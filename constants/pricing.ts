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

/**
 * What Premium actually unlocks. Every line here has to be checkable against
 * the app, because this is the screen someone reads before paying.
 *
 * An audit removed four claims that were not true: recording your voice (the
 * app records nothing and does not ask for the microphone), TOPIK courses
 * (there are none), progress insights (the Progress tab is free), and
 * unlimited AI conversation (the daily cap applied to paid accounts too).
 * The AI limit is now genuinely higher on Premium, so that one is earned
 * rather than withdrawn.
 */
export const PREMIUM_BENEFITS = [
  {
    emoji: '📚',
    title: '52 more lessons',
    description: 'Conversation, Living in Korea, Travel and Work — four full courses.',
  },
  {
    emoji: '🤖',
    title: '10× the AI practice',
    description: '100 messages a day with your conversation partner instead of 10.',
  },
  {
    emoji: '🎙️',
    title: 'Speaking practice',
    description: 'Listen, say it out loud, and compare against the audio.',
  },
  {
    emoji: '🧩',
    title: 'Grammar practice',
    description: 'The patterns behind the sentences, drilled until they stick.',
  },
  {
    emoji: '🍜',
    title: 'All culture articles',
    description: 'Nunchi, drinking etiquette, KakaoTalk, noraebang and more.',
  },
  {
    emoji: '💬',
    title: 'Every AI situation',
    description: 'Clinics, apartment viewings, hair salons and job interviews.',
  },
];

/** What a learner keeps without paying. Also checked against the app. */
export const FREE_FEATURES = [
  'The full Hangul trainer',
  'Korean Starter and Everyday Korean — 32 lessons',
  'Unlimited quizzes, listening and review',
  'A new Korean phrase every day',
  'Streaks, XP and the whole Progress tab',
];
