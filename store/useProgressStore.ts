import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { toDateKey } from '@/lib/date';
import { calculateLessonXp } from '@/lib/xp';
import { INITIAL_STREAK, recordActivity } from '@/lib/streak';
import { createVocabularyProgress, reviewVocabulary } from '@/lib/spacedReview';
import { STORAGE_KEYS, asyncStorage } from './storage';
import type {
  AchievementId,
  DailyActivity,
  LessonProgress,
  StreakState,
  VocabularyProgress,
} from '@/types/user';

export interface CompleteLessonInput {
  lessonId: string;
  score: number;
  totalQuestions: number;
  studySeconds: number;
  dailyGoalMinutes: number;
}

export interface CompleteLessonOutcome {
  xpEarned: number;
  xpItems: { label: string; amount: number }[];
  isPerfect: boolean;
  streak: number;
  unlockedAchievements: AchievementId[];
}

export interface ProgressState {
  hydrated: boolean;
  totalXp: number;
  lessons: Record<string, LessonProgress>;
  vocabulary: Record<string, VocabularyProgress>;
  savedWordIds: string[];
  mistakeVocabularyIds: string[];
  streak: StreakState;
  activityByDate: Record<string, DailyActivity>;
  achievements: AchievementId[];
  speakingSeconds: number;
  conversationsCompleted: number;

  setHydrated: () => void;
  startLesson: (lessonId: string) => void;
  completeLesson: (input: CompleteLessonInput) => CompleteLessonOutcome;
  addStudyTime: (seconds: number) => void;
  recordVocabularyReview: (vocabularyId: string, wasCorrect: boolean) => void;
  toggleSavedWord: (vocabularyId: string) => void;
  isSaved: (vocabularyId: string) => boolean;
  clearMistake: (vocabularyId: string) => void;
  recordSpeakingPractice: (seconds: number) => void;
  recordConversationCompleted: () => void;
  unlockAchievement: (id: AchievementId) => void;
  resetAll: () => void;
}

const initialState = {
  hydrated: false,
  totalXp: 0,
  lessons: {} as Record<string, LessonProgress>,
  vocabulary: {} as Record<string, VocabularyProgress>,
  savedWordIds: [] as string[],
  mistakeVocabularyIds: [] as string[],
  streak: INITIAL_STREAK,
  activityByDate: {} as Record<string, DailyActivity>,
  achievements: [] as AchievementId[],
  speakingSeconds: 0,
  conversationsCompleted: 0,
};

function emptyActivity(date: string): DailyActivity {
  return { date, studySeconds: 0, xpEarned: 0, lessonsCompleted: 0 };
}

function wordsLearned(vocabulary: Record<string, VocabularyProgress>): number {
  return Object.values(vocabulary).filter((item) => item.masteryLevel > 0).length;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHydrated: () => set({ hydrated: true }),

      startLesson: (lessonId) =>
        set((state) => {
          if (state.lessons[lessonId]) return state;
          return {
            lessons: {
              ...state.lessons,
              [lessonId]: {
                lessonId,
                status: 'in_progress',
                score: null,
                totalQuestions: null,
                studySeconds: 0,
                completedAt: null,
              },
            },
          };
        }),

      completeLesson: (input) => {
        const state = get();
        const todayKey = toDateKey();
        const today = state.activityByDate[todayKey] ?? emptyActivity(todayKey);

        const goalSeconds = input.dailyGoalMinutes * 60;
        const secondsBefore = today.studySeconds;
        const secondsAfter = secondsBefore + input.studySeconds;
        const dailyGoalReachedNow = secondsBefore < goalSeconds && secondsAfter >= goalSeconds;

        const isPerfect = input.totalQuestions > 0 && input.score === input.totalQuestions;
        const xp = calculateLessonXp({ completed: true, isPerfectQuiz: isPerfect, dailyGoalReachedNow });

        const previous = state.lessons[input.lessonId];
        const nextStreak = recordActivity(state.streak);

        const lessonsCompletedTotal =
          Object.values(state.lessons).filter((lesson) => lesson.status === 'completed').length +
          (previous?.status === 'completed' ? 0 : 1);

        const unlocked: AchievementId[] = [];
        const has = (id: AchievementId) => state.achievements.includes(id);

        if (!has('first_lesson')) unlocked.push('first_lesson');
        if (isPerfect && !has('perfect_quiz')) unlocked.push('perfect_quiz');
        if (nextStreak.currentStreak >= 3 && !has('streak_3')) unlocked.push('streak_3');
        if (nextStreak.currentStreak >= 7 && !has('streak_7')) unlocked.push('streak_7');

        const learned = wordsLearned(state.vocabulary);
        if (learned >= 50 && !has('words_50')) unlocked.push('words_50');
        if (learned >= 100 && !has('words_100')) unlocked.push('words_100');
        if (
          lessonsCompletedTotal >= 2 &&
          !has('hangul_master') &&
          state.lessons['lesson-hangul-consonants']?.status === 'completed' &&
          input.lessonId === 'lesson-hangul-vowels'
        ) {
          unlocked.push('hangul_master');
        }

        set({
          totalXp: state.totalXp + xp.total,
          lessons: {
            ...state.lessons,
            [input.lessonId]: {
              lessonId: input.lessonId,
              status: 'completed',
              score: input.score,
              totalQuestions: input.totalQuestions,
              studySeconds: (previous?.studySeconds ?? 0) + input.studySeconds,
              completedAt: new Date().toISOString(),
            },
          },
          streak: nextStreak,
          activityByDate: {
            ...state.activityByDate,
            [todayKey]: {
              date: todayKey,
              studySeconds: secondsAfter,
              xpEarned: today.xpEarned + xp.total,
              lessonsCompleted: today.lessonsCompleted + 1,
            },
          },
          achievements: [...state.achievements, ...unlocked],
        });

        return {
          xpEarned: xp.total,
          xpItems: xp.items,
          isPerfect,
          streak: nextStreak.currentStreak,
          unlockedAchievements: unlocked,
        };
      },

      addStudyTime: (seconds) =>
        set((state) => {
          const todayKey = toDateKey();
          const today = state.activityByDate[todayKey] ?? emptyActivity(todayKey);
          return {
            activityByDate: {
              ...state.activityByDate,
              [todayKey]: { ...today, studySeconds: today.studySeconds + seconds },
            },
          };
        }),

      recordVocabularyReview: (vocabularyId, wasCorrect) =>
        set((state) => {
          const existing = state.vocabulary[vocabularyId] ?? createVocabularyProgress(vocabularyId);
          const updated = reviewVocabulary(existing, wasCorrect);

          const mistakes = new Set(state.mistakeVocabularyIds);
          if (wasCorrect) mistakes.delete(vocabularyId);
          else mistakes.add(vocabularyId);

          return {
            vocabulary: { ...state.vocabulary, [vocabularyId]: updated },
            mistakeVocabularyIds: [...mistakes],
          };
        }),

      toggleSavedWord: (vocabularyId) =>
        set((state) => ({
          savedWordIds: state.savedWordIds.includes(vocabularyId)
            ? state.savedWordIds.filter((id) => id !== vocabularyId)
            : [vocabularyId, ...state.savedWordIds],
        })),

      isSaved: (vocabularyId) => get().savedWordIds.includes(vocabularyId),

      clearMistake: (vocabularyId) =>
        set((state) => ({
          mistakeVocabularyIds: state.mistakeVocabularyIds.filter((id) => id !== vocabularyId),
        })),

      recordSpeakingPractice: (seconds) =>
        set((state) => ({ speakingSeconds: state.speakingSeconds + seconds })),

      recordConversationCompleted: () =>
        set((state) => ({
          conversationsCompleted: state.conversationsCompleted + 1,
          achievements: state.achievements.includes('first_conversation')
            ? state.achievements
            : [...state.achievements, 'first_conversation'],
        })),

      unlockAchievement: (id) =>
        set((state) =>
          state.achievements.includes(id)
            ? state
            : { achievements: [...state.achievements, id] },
        ),

      resetAll: () => set({ ...initialState, hydrated: true }),
    }),
    {
      name: STORAGE_KEYS.progress,
      storage: asyncStorage,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
      partialize: ({ hydrated: _hydrated, ...rest }) => rest,
    },
  ),
);

export function selectCompletedLessonCount(state: ProgressState): number {
  return Object.values(state.lessons).filter((lesson) => lesson.status === 'completed').length;
}

export function selectWordsLearned(state: ProgressState): number {
  return wordsLearned(state.vocabulary);
}

export function selectTodaySeconds(state: ProgressState): number {
  return state.activityByDate[toDateKey()]?.studySeconds ?? 0;
}
