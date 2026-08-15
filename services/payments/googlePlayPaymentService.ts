import { Platform } from 'react-native';

import type { PricingPlan } from '@/constants/pricing';
import { PRICING_PLANS } from '@/constants/pricing';
import { FREE_SUBSCRIPTION, strongerEntitlement } from '@/lib/entitlement';
import { verifyPurchase } from './receiptVerification';
import type { PaymentService, PurchaseResult, StorePrice } from './types';

/**
 * react-native-iap is a native module: it is absent in Expo Go and on web, and
 * importing it there throws. Loading it lazily keeps the app runnable
 * everywhere and lets `isAvailable` report the truth.
 */
type IapModule = typeof import('react-native-iap');

let iapModule: IapModule | null = null;
let loadAttempted = false;

function loadIap(): IapModule | null {
  if (loadAttempted) return iapModule;
  loadAttempted = true;

  if (Platform.OS !== 'android' && Platform.OS !== 'ios') return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    iapModule = require('react-native-iap') as IapModule;
  } catch {
    iapModule = null;
  }

  return iapModule;
}

const SUBSCRIPTION_PRODUCT_IDS = PRICING_PLANS.filter((plan) => plan.id !== 'lifetime').map(
  (plan) => plan.productId,
);
const ONE_TIME_PRODUCT_IDS = PRICING_PLANS.filter((plan) => plan.id === 'lifetime').map(
  (plan) => plan.productId,
);

const UNAVAILABLE: PurchaseResult = {
  status: 'unavailable',
  subscription: null,
  message: 'In-app purchases are not available in this build. Install the Play Store version to subscribe.',
};

const CANCELLED: PurchaseResult = {
  status: 'cancelled',
  subscription: null,
  message: '',
};

const GENERIC_FAILURE: PurchaseResult = {
  status: 'failed',
  subscription: null,
  message: 'The purchase could not be completed. Please try again.',
};

function isUserCancellation(error: unknown): boolean {
  const code = (error as { code?: string })?.code ?? '';
  return /cancel/i.test(code) || /cancel/i.test(String((error as Error)?.message ?? ''));
}

function readPurchaseToken(purchase: unknown): string | null {
  const record = purchase as unknown as Record<string, unknown>;
  const token =
    record.purchaseToken ??
    record.purchaseTokenAndroid ??
    record.transactionReceipt ??
    record.id;
  return typeof token === 'string' && token.length > 0 ? token : null;
}

function readProductId(purchase: unknown): string | null {
  const record = purchase as unknown as Record<string, unknown>;
  const id = record.productId ?? record.id;
  return typeof id === 'string' && id.length > 0 ? id : null;
}

let connected = false;

export const googlePlayPaymentService: PaymentService = {
  id: 'google-play',

  get isAvailable() {
    return loadIap() !== null;
  },

  async initialize() {
    const iap = loadIap();
    if (!iap || connected) return;

    try {
      await iap.initConnection();
      connected = true;
    } catch {
      connected = false;
    }
  },

  async getPrices(): Promise<StorePrice[]> {
    const iap = loadIap();
    if (!iap) return [];

    try {
      await this.initialize();

      const [subscriptions, oneTime] = await Promise.all([
        SUBSCRIPTION_PRODUCT_IDS.length > 0
          ? iap.fetchProducts({ skus: SUBSCRIPTION_PRODUCT_IDS, type: 'subs' })
          : Promise.resolve([]),
        ONE_TIME_PRODUCT_IDS.length > 0
          ? iap.fetchProducts({ skus: ONE_TIME_PRODUCT_IDS, type: 'in-app' })
          : Promise.resolve([]),
      ]);

      return [...(subscriptions ?? []), ...(oneTime ?? [])]
        .map((product) => {
          const record = product as unknown as Record<string, unknown>;
          const productId = typeof record.id === 'string' ? record.id : null;
          const displayPrice =
            typeof record.displayPrice === 'string'
              ? record.displayPrice
              : typeof record.localizedPrice === 'string'
                ? record.localizedPrice
                : null;

          if (!productId || !displayPrice) return null;

          return {
            productId,
            displayPrice,
            currencyCode: typeof record.currency === 'string' ? record.currency : null,
          } satisfies StorePrice;
        })
        .filter((price): price is StorePrice => price !== null);
    } catch {
      return [];
    }
  },

  async purchase(plan: PricingPlan): Promise<PurchaseResult> {
    const iap = loadIap();
    if (!iap) return UNAVAILABLE;

    try {
      await this.initialize();
      if (!connected) return UNAVAILABLE;

      const isSubscription = plan.id !== 'lifetime';

      const purchase = await iap.requestPurchase({
        type: isSubscription ? 'subs' : 'in-app',
        request: {
          google: { skus: [plan.productId] },
          apple: { sku: plan.productId },
        },
      });

      const result = Array.isArray(purchase) ? purchase[0] : purchase;
      if (!result) return CANCELLED;

      const purchaseToken = readPurchaseToken(result);
      const productId = readProductId(result) ?? plan.productId;

      if (!purchaseToken) return GENERIC_FAILURE;

      const verification = await verifyPurchase({
        productId,
        purchaseToken,
        orderId: (result as unknown as Record<string, unknown>).transactionId as string | undefined,
      });

      if (!verification.ok) {
        // Deliberately not finished: leaving the transaction open lets Google
        // re-deliver it so a verification outage does not lose a paid purchase.
        return { status: 'failed', subscription: null, message: verification.message };
      }

      // Acknowledge only after the server granted the entitlement. Google
      // refunds unacknowledged purchases after three days.
      await iap.finishTransaction({ purchase: result, isConsumable: false });

      return {
        status: 'purchased',
        subscription: verification.subscription,
        message: verification.message,
      };
    } catch (error) {
      if (isUserCancellation(error)) return CANCELLED;
      return GENERIC_FAILURE;
    }
  },

  async restore(): Promise<PurchaseResult> {
    const iap = loadIap();
    if (!iap) return UNAVAILABLE;

    try {
      await this.initialize();
      if (!connected) return UNAVAILABLE;

      const purchases = (await iap.getAvailablePurchases()) ?? [];
      if (purchases.length === 0) {
        return {
          status: 'unavailable',
          subscription: null,
          message: 'We did not find a previous purchase on this account.',
        };
      }

      let best = FREE_SUBSCRIPTION;
      let anyVerified = false;

      for (const purchase of purchases) {
        const purchaseToken = readPurchaseToken(purchase);
        const productId = readProductId(purchase);
        if (!purchaseToken || !productId) continue;

        const verification = await verifyPurchase({ productId, purchaseToken });
        if (verification.ok) {
          anyVerified = true;
          best = strongerEntitlement(best, verification.subscription);
        }
      }

      if (!anyVerified) {
        return {
          status: 'unavailable',
          subscription: null,
          message: 'We could not confirm an active subscription on this account.',
        };
      }

      return { status: 'purchased', subscription: best, message: 'Your Premium access is restored.' };
    } catch {
      return GENERIC_FAILURE;
    }
  },

  async dispose() {
    const iap = loadIap();
    if (!iap || !connected) return;

    try {
      await iap.endConnection();
    } finally {
      connected = false;
    }
  },
};
