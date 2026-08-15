export const APP_NAME = 'KoreanGo';
export const APP_TAGLINE = 'Speak Korean. Live Korea.';
// TODO: point these at wherever you host `site/`. The defaults assume GitHub
// Pages (Settings -> Pages -> Source: GitHub Actions). Google Play rejects an
// app whose privacy policy URL is unreachable, so verify these open in a
// browser before submitting.
const SITE_URL = 'https://joseph8151.github.io/korean-learning-app';

export const SUPPORT_EMAIL = 'support@koreango.app';
export const PRIVACY_URL = `${SITE_URL}/privacy.html`;
export const TERMS_URL = `${SITE_URL}/terms.html`;

export const XP_RULES = {
  lessonComplete: 20,
  perfectQuizBonus: 10,
  dailyGoalComplete: 10,
  vocabularyReviewed: 2,
  speakingPractice: 5,
} as const;

export const DAILY_GOAL_OPTIONS = [5, 10, 15, 20, 30] as const;
export const DEFAULT_DAILY_GOAL_MINUTES = 10;

export const FREE_LIMITS = {
  quizzesPerDay: 5,
  aiChatMessagesPerDay: 10,
  savedWords: 30,
} as const;

export const LEARNING_GOAL_OPTIONS = [
  { id: 'kpop_kdrama', label: 'K-POP & K-Drama', emoji: '🎤' },
  { id: 'travel', label: 'Travel to Korea', emoji: '✈️' },
  { id: 'living', label: 'Living in Korea', emoji: '🏙️' },
  { id: 'friends_dating', label: 'Korean Friends / Dating', emoji: '💬' },
  { id: 'work', label: 'Work & Business', emoji: '💼' },
  { id: 'topik', label: 'TOPIK', emoji: '📘' },
  { id: 'fun', label: 'Just for Fun', emoji: '✨' },
] as const;

export const LEVEL_OPTIONS = [
  {
    id: 'complete_beginner',
    label: 'Complete Beginner',
    description: "I've never studied Korean.",
    level: 1,
  },
  {
    id: 'knows_hangul',
    label: 'I know Hangul',
    description: 'I can read 한글 slowly.',
    level: 1,
  },
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'I know a few words and greetings.',
    level: 2,
  },
  {
    id: 'elementary',
    label: 'Elementary',
    description: 'I can make simple sentences.',
    level: 3,
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'I can hold everyday conversations.',
    level: 4,
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'I can discuss complex topics.',
    level: 5,
  },
] as const;

export const LEVEL_BLURBS: Record<number, string> = {
  1: "Perfect — let's start with Hangul and your first words.",
  2: "You're ready to start real Korean conversations.",
  3: 'Nice. Time to build everyday fluency.',
  4: 'Strong base. Let’s make your Korean sound natural.',
  5: 'Impressive. Let’s refine nuance and business Korean.',
};
