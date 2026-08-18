import { toDateKey } from './date';
import { isDueForReview } from './spacedReview';
import type { DailyActivity, VocabularyProgress } from '@/types/user';

export type DailyTaskId = 'lesson' | 'review' | 'phrase';

export interface DailyTask {
  id: DailyTaskId;
  done: boolean;
  /** Present when the task has a countable target, e.g. words due. */
  count?: number;
}

export interface DailyPlanInput {
  activityByDate: Record<string, DailyActivity>;
  vocabulary: Record<string, VocabularyProgress>;
  savedPhraseIds: string[];
  todaysPhraseId: string | null;
  now?: Date;
}

export interface DailyPlan {
  tasks: DailyTask[];
  completed: number;
  total: number;
  /** 0–1, for a progress ring. */
  ratio: number;
  allDone: boolean;
}

/** How many due words count as a full review session. */
export const REVIEW_TARGET = 5;

/**
 * Turns the day into three concrete things to do rather than a minute count.
 *
 * A goal of "10 minutes" is a number a learner watches; "finish a lesson,
 * review five words, read today's phrase" is a list they can finish. The
 * second one is what actually gets people to open the app tomorrow, and it
 * degrades honestly — a day with nothing due shows the review task already
 * satisfied instead of inventing busywork.
 */
export function buildDailyPlan({
  activityByDate,
  vocabulary,
  savedPhraseIds,
  todaysPhraseId,
  now = new Date(),
}: DailyPlanInput): DailyPlan {
  const today = activityByDate[toDateKey(now)];

  const dueCount = Object.values(vocabulary).filter((progress) =>
    isDueForReview(progress, now),
  ).length;

  // Reviewing clears the due flag, so "nothing due" is indistinguishable from
  // "already reviewed" — and both mean there is nothing left to do today.
  const reviewDone = dueCount === 0;

  const tasks: DailyTask[] = [
    { id: 'lesson', done: (today?.lessonsCompleted ?? 0) > 0 },
    { id: 'review', done: reviewDone, count: Math.min(dueCount, REVIEW_TARGET) },
    {
      id: 'phrase',
      done: todaysPhraseId !== null && savedPhraseIds.includes(todaysPhraseId),
    },
  ];

  const completed = tasks.filter((task) => task.done).length;

  return {
    tasks,
    completed,
    total: tasks.length,
    ratio: completed / tasks.length,
    allDone: completed === tasks.length,
  };
}
