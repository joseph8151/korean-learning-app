import type { SubscriptionPlan } from '@/types/user';

export interface PricingPlan {
  id: Exclude<SubscriptionPlan, 'free'>;
  productId: string;
  title: string;
  priceLabel: string;
  periodLabel: string;
  perMonthLabel: string | null;
  badge: string | null;
  trialDays: number;
  highlighted: boolean;
}

/**
 * Prices are display values only. The real source of truth is the Google Play
 * / App Store product configured under `productId`.
 */
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'monthly',
    productId: 'koreango_premium_monthly',
    title: 'Monthly',
    priceLabel: '$9.99',
    periodLabel: 'per month',
    perMonthLabel: null,
    badge: null,
    trialDays: 7,
    highlighted: false,
  },
  {
    id: 'yearly',
    productId: 'koreango_premium_yearly',
    title: 'Yearly',
    priceLabel: '$59.99',
    periodLabel: 'per year',
    perMonthLabel: '$5.00 / month',
    badge: 'Save 50%',
    trialDays: 7,
    highlighted: true,
  },
  {
    id: 'lifetime',
    productId: 'koreango_premium_lifetime',
    title: 'Lifetime',
    priceLabel: '$149.99',
    periodLabel: 'one-time',
    perMonthLabel: null,
    badge: null,
    trialDays: 0,
    highlighted: false,
  },
];

export const PREMIUM_BENEFITS = [
  { emoji: '📚', title: 'Unlimited lessons', description: 'Every course, every unit, no daily caps.' },
  { emoji: '🤖', title: 'AI Korean conversations', description: 'Practise real situations any time.' },
  { emoji: '🎙️', title: 'Speaking practice', description: 'Repeat, record and compare your Korean.' },
  { emoji: '🔁', title: 'Vocabulary review', description: 'Smart spaced review of what you forget.' },
  { emoji: '🎧', title: 'Advanced Korean courses', description: 'Business, TOPIK and native listening.' },
  { emoji: '📈', title: 'Progress insights', description: 'See exactly what is improving each week.' },
];

export const FREE_FEATURES = [
  'Daily lessons',
  'Basic vocabulary',
  'Limited quizzes',
  'Daily Korean phrase',
  'Basic progress',
];
