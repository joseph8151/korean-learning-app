import type { PricingPlan } from '@/constants/pricing';
import type { Subscription } from '@/types/user';

export type PurchaseStatus = 'purchased' | 'pending' | 'cancelled' | 'unavailable' | 'failed';

export interface PurchaseResult {
  status: PurchaseStatus;
  subscription: Subscription | null;
  /** Safe, user-facing copy. Store errors never reach the UI verbatim. */
  message: string;
}

export interface StorePrice {
  productId: string;
  /** Localised price straight from the store, e.g. "₩12,000". */
  displayPrice: string;
  currencyCode: string | null;
}

/**
 * Billing boundary. The paywall talks only to this interface, so swapping
 * Google Play for RevenueCat or adding App Store billing touches no screen.
 */
export interface PaymentService {
  readonly id: string;
  /** False in Expo Go, on web, and wherever the native billing module is absent. */
  readonly isAvailable: boolean;

  /** Opens the store connection. Safe to call more than once. */
  initialize(): Promise<void>;
  /** Localised prices for the configured products; empty when unavailable. */
  getPrices(): Promise<StorePrice[]>;
  purchase(plan: PricingPlan): Promise<PurchaseResult>;
  restore(): Promise<PurchaseResult>;
  dispose(): Promise<void>;
}
