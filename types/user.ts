import type { KoreanLevel, LearningGoal, LevelKey } from './content';

export interface Profile {
  id: string;
  email: string | null;
  displayName: string;
  country: string | null;
  nativeLanguage: string;
  koreanLevel: KoreanLevel;
  levelKey: LevelKey | null;
  learningGoals: LearningGoal[];
  dailyGoalMinutes: DailyGoalMinutes;
  createdAt: string;
  updatedAt: string;
}

export type DailyGoalMinutes = 5 | 10 | 15 | 20 | 30;

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  score: number | null;
  totalQuestions: number | null;
  studySeconds: number;
  completedAt: string | null;
}

export interface VocabularyProgress {
  vocabularyId: string;
  correctCount: number;
  wrongCount: number;
  masteryLevel: number;
  lastReviewedAt: string | null;
  nextReviewAt: string;
}

export interface SavedWord {
  vocabularyId: string;
  createdAt: string;
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

export interface DailyActivity {
  date: string;
  studySeconds: number;
  xpEarned: number;
  lessonsCompleted: number;
}

export type SubscriptionPlan = 'free' | 'monthly' | 'yearly' | 'lifetime';
export type SubscriptionStatus = 'active' | 'trialing' | 'expired' | 'cancelled';

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startedAt: string | null;
  expiresAt: string | null;
}

export type AchievementId =
  | 'first_lesson'
  | 'streak_3'
  | 'streak_7'
  | 'words_50'
  | 'words_100'
  | 'first_conversation'
  | 'perfect_quiz'
  | 'hangul_master';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  emoji: string;
}

export interface NotificationSettings {
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  streakReminderEnabled: boolean;
  dailyKoreanEnabled: boolean;
}
