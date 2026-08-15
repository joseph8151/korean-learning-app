import {
  FREE_SUBSCRIPTION,
  daysUntilExpiry,
  isEntitled,
  isInGracePeriod,
  planForProductId,
  productIdForPlan,
  strongerEntitlement,
} from '@/lib/entitlement';
import type { Subscription } from '@/types/user';

const NOW = new Date('2026-06-15T12:00:00.000Z');
const future = '2026-07-15T12:00:00.000Z';
const past = '2026-05-15T12:00:00.000Z';

const sub = (overrides: Partial<Subscription> = {}): Subscription => ({
  plan: 'monthly',
  status: 'active',
  startedAt: '2026-05-15T12:00:00.000Z',
  expiresAt: future,
  ...overrides,
});

describe('entitlement', () => {
  it('grants access to an active subscription that has not expired', () => {
    expect(isEntitled(sub(), NOW)).toBe(true);
  });

  it('grants access during a free trial', () => {
    expect(isEntitled(sub({ status: 'trialing' }), NOW)).toBe(true);
  });

  it('denies access on the free plan', () => {
    expect(isEntitled(FREE_SUBSCRIPTION, NOW)).toBe(false);
  });

  it('denies access once the paid period has passed, even if the row still says active', () => {
    expect(isEntitled(sub({ expiresAt: past }), NOW)).toBe(false);
  });

  it('keeps a cancelled subscription until the end of the paid period', () => {
    // Cancelling turns auto-renew off; the learner already paid for this month.
    expect(isEntitled(sub({ status: 'cancelled', expiresAt: future }), NOW)).toBe(true);
  });

  it('revokes a cancelled subscription once the paid period ends', () => {
    expect(isEntitled(sub({ status: 'cancelled', expiresAt: past }), NOW)).toBe(false);
  });

  it('revokes a refunded subscription immediately', () => {
    expect(isEntitled(sub({ status: 'refunded', expiresAt: future }), NOW)).toBe(false);
  });

  it('never expires a lifetime purchase', () => {
    expect(isEntitled(sub({ plan: 'lifetime', expiresAt: null }), NOW)).toBe(true);
    expect(isEntitled(sub({ plan: 'lifetime', expiresAt: past }), NOW)).toBe(true);
  });

  it('denies a paid plan with no expiry date, which would otherwise be unbounded', () => {
    expect(isEntitled(sub({ plan: 'yearly', expiresAt: null }), NOW)).toBe(false);
  });
});

describe('product mapping', () => {
  it('maps configured product ids to plans and back', () => {
    expect(planForProductId('koreango_premium_yearly')).toBe('yearly');
    expect(productIdForPlan('yearly')).toBe('koreango_premium_yearly');
  });

  it('returns null for an unknown product rather than guessing', () => {
    expect(planForProductId('some_other_app_product')).toBeNull();
    expect(productIdForPlan('free')).toBeNull();
  });
});

describe('grace period', () => {
  it('flags an active subscription whose expiry has just passed', () => {
    expect(isInGracePeriod(sub({ expiresAt: past }), NOW)).toBe(true);
  });

  it('does not flag a healthy subscription', () => {
    expect(isInGracePeriod(sub(), NOW)).toBe(false);
  });

  it('does not flag lifetime or free', () => {
    expect(isInGracePeriod(sub({ plan: 'lifetime' }), NOW)).toBe(false);
    expect(isInGracePeriod(FREE_SUBSCRIPTION, NOW)).toBe(false);
  });
});

describe('days until expiry', () => {
  it('counts remaining days', () => {
    expect(daysUntilExpiry(sub(), NOW)).toBe(30);
  });

  it('returns null for lifetime and for a missing expiry', () => {
    expect(daysUntilExpiry(sub({ plan: 'lifetime' }), NOW)).toBeNull();
    expect(daysUntilExpiry(FREE_SUBSCRIPTION, NOW)).toBeNull();
  });
});

describe('choosing between two entitlements', () => {
  it('prefers the entitled one', () => {
    expect(strongerEntitlement(FREE_SUBSCRIPTION, sub(), NOW)).toEqual(sub());
    expect(strongerEntitlement(sub(), FREE_SUBSCRIPTION, NOW)).toEqual(sub());
  });

  it('prefers lifetime over a dated plan', () => {
    const lifetime = sub({ plan: 'lifetime', expiresAt: null });
    expect(strongerEntitlement(sub(), lifetime, NOW)).toEqual(lifetime);
    expect(strongerEntitlement(lifetime, sub(), NOW)).toEqual(lifetime);
  });

  it('prefers the later expiry when both are active', () => {
    const later = sub({ expiresAt: '2026-09-15T12:00:00.000Z' });
    expect(strongerEntitlement(sub(), later, NOW)).toEqual(later);
    expect(strongerEntitlement(later, sub(), NOW)).toEqual(later);
  });

  it('falls back to a real plan over free when neither is entitled', () => {
    const expired = sub({ expiresAt: past });
    expect(strongerEntitlement(FREE_SUBSCRIPTION, expired, NOW)).toEqual(expired);
  });
});
