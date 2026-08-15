import type { PricingPlan } from '@/constants/pricing';
import type { PaymentService, PurchaseResult, StorePrice } from './types';

const NOT_CONNECTED: PurchaseResult = {
  status: 'unavailable',
  subscription: null,
  message:
    'In-app purchases need the Play Store build. Install the release APK or AAB to subscribe.',
};

/**
 * Used in Expo Go, on web, and in tests. It never grants an entitlement — a
 * store that cannot verify a payment must not hand out Premium.
 */
export const mockPaymentService: PaymentService = {
  id: 'mock',
  isAvailable: false,

  async initialize() {},

  async getPrices(): Promise<StorePrice[]> {
    return [];
  },

  async purchase(_plan: PricingPlan): Promise<PurchaseResult> {
    return NOT_CONNECTED;
  },

  async restore(): Promise<PurchaseResult> {
    return { ...NOT_CONNECTED, message: 'Nothing to restore in this build.' };
  },

  async dispose() {},
};
