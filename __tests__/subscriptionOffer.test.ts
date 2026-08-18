import { pickSubscriptionOffer } from '@/services/payments/googlePlayPaymentService';

/**
 * Google Play Billing v5 requires naming a specific base plan / offer by its
 * token. Getting this wrong does not throw — it charges the wrong price, or
 * silently skips the free trial the paywall just promised.
 */

const phase = (micros: string) => ({ priceAmountMicros: micros });

const offer = (id: string, token: string | null, phases: { priceAmountMicros: string }[]) => ({
  id,
  offerTokenAndroid: token,
  pricingPhasesAndroid: { pricingPhaseList: phases },
});

describe('pickSubscriptionOffer', () => {
  it('prefers the free trial over the plain price', () => {
    const product = {
      id: 'koreango_premium_yearly',
      subscriptionOffers: [
        offer('base', 'token-paid', [phase('59990000')]),
        offer('trial', 'token-trial', [phase('0'), phase('59990000')]),
      ],
    };

    expect(pickSubscriptionOffer(product)).toEqual({
      sku: 'koreango_premium_yearly',
      offerToken: 'token-trial',
    });
  });

  it('falls back to the paid offer when no trial is on the account', () => {
    // Play only returns offers the account is eligible for, so a learner who
    // already used their trial sees the base plan alone.
    const product = {
      id: 'koreango_premium_monthly',
      subscriptionOffers: [offer('base', 'token-paid', [phase('9990000')])],
    };

    expect(pickSubscriptionOffer(product)).toEqual({
      sku: 'koreango_premium_monthly',
      offerToken: 'token-paid',
    });
  });

  it('picks the cheapest first phase among several offers', () => {
    const product = {
      id: 'koreango_premium_yearly',
      subscriptionOffers: [
        offer('full', 'token-full', [phase('59990000')]),
        offer('intro', 'token-intro', [phase('9990000'), phase('59990000')]),
        offer('trial', 'token-trial', [phase('0'), phase('59990000')]),
      ],
    };

    expect(pickSubscriptionOffer(product)?.offerToken).toBe('token-trial');
  });

  it('ignores offers with no usable token', () => {
    const product = {
      id: 'koreango_premium_monthly',
      subscriptionOffers: [
        offer('broken', null, [phase('0')]),
        offer('base', 'token-paid', [phase('9990000')]),
      ],
    };

    expect(pickSubscriptionOffer(product)?.offerToken).toBe('token-paid');
  });

  it('returns null when the product has no offers, so the caller can say why', () => {
    // This is what a product that is not live in Play Console yet looks like.
    expect(pickSubscriptionOffer({ id: 'koreango_premium_monthly', subscriptionOffers: [] })).toBeNull();
  });

  it('returns null for a missing product rather than throwing', () => {
    expect(pickSubscriptionOffer(undefined)).toBeNull();
    expect(pickSubscriptionOffer(null)).toBeNull();
    expect(pickSubscriptionOffer({})).toBeNull();
  });

  it('survives malformed pricing data instead of picking by accident', () => {
    const product = {
      id: 'koreango_premium_monthly',
      subscriptionOffers: [
        { id: 'a', offerTokenAndroid: 'token-a' },
        offer('b', 'token-b', [phase('9990000')]),
      ],
    };

    // The offer with no phases sorts last, so the priced one wins.
    expect(pickSubscriptionOffer(product)?.offerToken).toBe('token-b');
  });
});
