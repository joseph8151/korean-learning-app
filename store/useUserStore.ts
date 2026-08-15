import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DEFAULT_DAILY_GOAL_MINUTES } from '@/constants/app';
import { isEntitled } from '@/lib/entitlement';
import { DEFAULT_NOTIFICATION_SETTINGS } from '@/services/notifications';
import { STORAGE_KEYS, asyncStorage } from './storage';
import type { KoreanLevel, LearningGoal, LevelKey } from '@/types/content';
import type {
  DailyGoalMinutes,
  NotificationSettings,
  Subscription,
} from '@/types/user';

export interface UserState {
  hydrated: boolean;
  onboardingCompleted: boolean;
  isGuest: boolean;

  userId: string | null;
  email: string | null;
  displayName: string;
  country: string | null;
  nativeLanguage: string;

  koreanLevel: KoreanLevel;
  levelKey: LevelKey | null;
  learningGoals: LearningGoal[];
  dailyGoalMinutes: DailyGoalMinutes;

  subscription: Subscription;
  notifications: NotificationSettings;

  setHydrated: () => void;
  setLearningGoals: (goals: LearningGoal[]) => void;
  toggleLearningGoal: (goal: LearningGoal) => void;
  setLevel: (level: KoreanLevel, levelKey: LevelKey | null) => void;
  setDailyGoal: (minutes: DailyGoalMinutes) => void;
  setDisplayName: (name: string) => void;
  setCountry: (country: string | null) => void;
  setNativeLanguage: (language: string) => void;
  setNotifications: (settings: Partial<NotificationSettings>) => void;
  completeOnboarding: () => void;
  continueAsGuest: () => void;
  signIn: (user: { id: string; email: string | null; displayName: string | null }) => void;
  signOut: () => void;
  setSubscription: (subscription: Subscription) => void;
  resetAll: () => void;
}

const FREE_SUBSCRIPTION: Subscription = {
  plan: 'free',
  status: 'active',
  startedAt: null,
  expiresAt: null,
};

const initialState = {
  hydrated: false,
  onboardingCompleted: false,
  isGuest: true,
  userId: null as string | null,
  email: null as string | null,
  displayName: 'Friend',
  country: null as string | null,
  nativeLanguage: 'English',
  koreanLevel: 1 as KoreanLevel,
  levelKey: null as LevelKey | null,
  learningGoals: [] as LearningGoal[],
  dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES as DailyGoalMinutes,
  subscription: FREE_SUBSCRIPTION,
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setHydrated: () => set({ hydrated: true }),

      setLearningGoals: (learningGoals) => set({ learningGoals }),

      toggleLearningGoal: (goal) =>
        set((state) => ({
          learningGoals: state.learningGoals.includes(goal)
            ? state.learningGoals.filter((item) => item !== goal)
            : [...state.learningGoals, goal],
        })),

      setLevel: (koreanLevel, levelKey) => set({ koreanLevel, levelKey }),
      setDailyGoal: (dailyGoalMinutes) => set({ dailyGoalMinutes }),
      setDisplayName: (displayName) => set({ displayName: displayName.trim() || 'Friend' }),
      setCountry: (country) => set({ country }),
      setNativeLanguage: (nativeLanguage) => set({ nativeLanguage }),

      setNotifications: (settings) =>
        set((state) => ({ notifications: { ...state.notifications, ...settings } })),

      completeOnboarding: () => set({ onboardingCompleted: true }),
      continueAsGuest: () => set({ isGuest: true, onboardingCompleted: true }),

      signIn: (user) =>
        set((state) => ({
          isGuest: false,
          userId: user.id,
          email: user.email,
          displayName: user.displayName?.trim() || state.displayName,
          onboardingCompleted: true,
        })),

      signOut: () => set({ isGuest: true, userId: null, email: null, subscription: FREE_SUBSCRIPTION }),
      setSubscription: (subscription) => set({ subscription }),
      resetAll: () => set({ ...initialState, hydrated: true }),
    }),
    {
      name: STORAGE_KEYS.user,
      storage: asyncStorage,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
      partialize: ({ hydrated: _hydrated, ...rest }) => rest,
    },
  ),
);

export function selectIsPremium(state: UserState): boolean {
  return isEntitled(state.subscription);
}
