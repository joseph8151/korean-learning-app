import { PRICING_PLANS } from '@/constants/pricing';
import type { Subscription, SubscriptionPlan, SubscriptionStatus } from '@/types/user';

export const FREE_SUBSCRIPTION: Subscription = {
  plan: 'free',
  status: 'active',
  startedAt: null,
  expiresAt: null,
};

/**
 * `cancelled` belongs here: Google's CANCELED state means auto-renew is off,
 * not that access ended. A learner who cancels keeps Premium until the period
 * they already paid for runs out — the expiry check below enforces that.
 * `expired` and `refunded` are the states that actually revoke access.
 */
const ENTITLED_STATUSES: SubscriptionStatus[] = ['active', 'trialing', 'cancelled'];

/**
 * Single source of truth for "is this learner Premium right now".
 *
 * A lifetime plan never expires. Everything else must be both in an entitled
 * status and not past its expiry, so a stale row from before a lapsed renewal
 * cannot keep Premium alive.
 */
export function isEntitled(subscription: Subscription, now: Date = new Date()): boolean {
  if (subscription.plan === 'free') return false;
  if (!ENTITLED_STATUSES.includes(subscription.status)) return false;
  if (subscription.plan === 'lifetime') return true;
  if (!subscription.expiresAt) return false;

  return new Date(subscription.expiresAt).getTime() > now.getTime();
}

/** Maps a store product id back to the plan it grants. */
export function planForProductId(productId: string): SubscriptionPlan | null {
  return PRICING_PLANS.find((plan) => plan.productId === productId)?.id ?? null;
}

export function productIdForPlan(plan: SubscriptionPlan): string | null {
  return PRICING_PLANS.find((item) => item.id === plan)?.productId ?? null;
}

/**
 * Google Play grace period: a renewal can fail and retry for a few days while
 * the subscription is still valid. Showing "expired" immediately would lock out
 * a paying customer, so the UI warns instead.
 */
export function isInGracePeriod(subscription: Subscription, now: Date = new Date()): boolean {
  return (
    subscription.plan !== 'free' &&
    subscription.plan !== 'lifetime' &&
    subscription.status === 'active' &&
    subscription.expiresAt !== null &&
    new Date(subscription.expiresAt).getTime() <= now.getTime()
  );
}

export function daysUntilExpiry(subscription: Subscription, now: Date = new Date()): number | null {
  if (!subscription.expiresAt || subscription.plan === 'lifetime') return null;
  const millis = new Date(subscription.expiresAt).getTime() - now.getTime();
  return Math.ceil(millis / 86_400_000);
}

/**
 * Picks the stronger of two entitlements. Used when a restore returns several
 * purchases, or when the server and the device disagree.
 */
export function strongerEntitlement(
  a: Subscription,
  b: Subscription,
  now: Date = new Date(),
): Subscription {
  const aEntitled = isEntitled(a, now);
  const bEntitled = isEntitled(b, now);

  if (aEntitled !== bEntitled) return aEntitled ? a : b;
  if (!aEntitled) return a.plan === 'free' ? b : a;

  if (a.plan === 'lifetime') return a;
  if (b.plan === 'lifetime') return b;

  const aExpiry = a.expiresAt ? new Date(a.expiresAt).getTime() : 0;
  const bExpiry = b.expiresAt ? new Date(b.expiresAt).getTime() : 0;
  return aExpiry >= bExpiry ? a : b;
}
