import { googlePlayPaymentService } from './googlePlayPaymentService';
import { mockPaymentService } from './mockPaymentService';
import type { PaymentService } from './types';

/**
 * Real billing when the native module is present (a dev client or a store
 * build), the inert mock everywhere else. `isAvailable` is evaluated at import
 * time on purpose so screens can branch without another async hop.
 */
export const paymentService: PaymentService = googlePlayPaymentService.isAvailable
  ? googlePlayPaymentService
  : mockPaymentService;

export { googlePlayPaymentService, mockPaymentService };
export type { PaymentService, PurchaseResult, PurchaseStatus, StorePrice } from './types';
export { verifyPurchase } from './receiptVerification';
