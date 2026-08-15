import { daysBetween, toDateKey } from './date';
import type { StreakState } from '@/types/user';

export const INITIAL_STREAK: StreakState = {
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
};

/**
 * Records a study day. Same day is idempotent, the next day extends the
 * streak, and any longer gap resets it to 1.
 */
export function recordActivity(state: StreakState, today: Date = new Date()): StreakState {
  const todayKey = toDateKey(today);

  if (state.lastActivityDate === todayKey) {
    return state;
  }

  const gap = state.lastActivityDate ? daysBetween(state.lastActivityDate, todayKey) : null;
  const currentStreak = gap === 1 ? state.currentStreak + 1 : 1;

  return {
    currentStreak,
    longestStreak: Math.max(state.longestStreak, currentStreak),
    lastActivityDate: todayKey,
  };
}

/** A streak shown in the UI is stale once the learner misses a full day. */
export function visibleStreak(state: StreakState, today: Date = new Date()): number {
  if (!state.lastActivityDate) return 0;
  const gap = daysBetween(state.lastActivityDate, toDateKey(today));
  return gap <= 1 ? state.currentStreak : 0;
}

export function isStreakAtRisk(state: StreakState, today: Date = new Date()): boolean {
  if (!state.lastActivityDate) return false;
  return daysBetween(state.lastActivityDate, toDateKey(today)) === 1;
}
