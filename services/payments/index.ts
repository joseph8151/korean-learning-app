import type { PricingPlan } from '@/constants/pricing';
import type { Subscription } from '@/types/user';

export interface PurchaseResult {
  status: 'purchased' | 'cancelled' | 'unavailable';
  subscription: Subscription | null;
  message: string;
}

/**
 * Billing boundary. Swap `mockPaymentService` for a Google Play Billing or
 * RevenueCat implementation without touching a single screen.
 */
export interface PaymentService {
  readonly id: string;
  readonly isAvailable: boolean;
  purchase(plan: PricingPlan): Promise<PurchaseResult>;
  restore(): Promise<PurchaseResult>;
}

export const mockPaymentService: PaymentService = {
  id: 'mock',
  isAvailable: false,

  async purchase() {
    return {
      status: 'unavailable',
      subscription: null,
      message: 'Billing is not connected in this build yet. Coming with the Play Store release.',
    };
  },

  async restore() {
    return {
      status: 'unavailable',
      subscription: null,
      message: 'Nothing to restore — billing is not connected in this build yet.',
    };
  },
};

export const paymentService: PaymentService = mockPaymentService;
