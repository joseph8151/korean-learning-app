import { buildDailyPlan, REVIEW_TARGET } from '@/lib/dailyPlan';
import { toDateKey } from '@/lib/date';
import type { DailyActivity, VocabularyProgress } from '@/types/user';

const NOW = new Date(2026, 4, 12, 10, 0);

const activity = (lessonsCompleted: number): Record<string, DailyActivity> => ({
  [toDateKey(NOW)]: {
    date: toDateKey(NOW),
    studySeconds: 300,
    xpEarned: 20,
    lessonsCompleted,
  },
});

const word = (id: string, nextReviewAt: Date): VocabularyProgress => ({
  vocabularyId: id,
  masteryLevel: 1,
  correctCount: 1,
  wrongCount: 0,
  lastReviewedAt: new Date(2026, 4, 11).toISOString(),
  nextReviewAt: nextReviewAt.toISOString(),
});

const overdue = (id: string) => word(id, new Date(2026, 4, 11));
const notYet = (id: string) => word(id, new Date(2026, 4, 20));

describe('buildDailyPlan', () => {
  it('starts the day with everything outstanding', () => {
    const plan = buildDailyPlan({
      activityByDate: {},
      vocabulary: { a: overdue('a') },
      savedPhraseIds: [],
      todaysPhraseId: 'dp-01',
      now: NOW,
    });

    expect(plan.completed).toBe(0);
    expect(plan.total).toBe(3);
    expect(plan.allDone).toBe(false);
    expect(plan.tasks.map((task) => task.id)).toEqual(['lesson', 'review', 'phrase']);
  });

  it('ticks the lesson task off once one is finished today', () => {
    const plan = buildDailyPlan({
      activityByDate: activity(1),
      vocabulary: { a: overdue('a') },
      savedPhraseIds: [],
      todaysPhraseId: 'dp-01',
      now: NOW,
    });

    expect(plan.tasks.find((task) => task.id === 'lesson')?.done).toBe(true);
    expect(plan.completed).toBe(1);
  });

  it('does not count a lesson finished on another day', () => {
    const plan = buildDailyPlan({
      activityByDate: {
        '2026-05-11': {
          date: '2026-05-11',
          studySeconds: 600,
          xpEarned: 40,
          lessonsCompleted: 3,
        },
      },
      vocabulary: {},
      savedPhraseIds: [],
      todaysPhraseId: 'dp-01',
      now: NOW,
    });

    expect(plan.tasks.find((task) => task.id === 'lesson')?.done).toBe(false);
  });

  it('treats nothing due as review already done, rather than inventing busywork', () => {
    const plan = buildDailyPlan({
      activityByDate: {},
      vocabulary: { a: notYet('a'), b: notYet('b') },
      savedPhraseIds: [],
      todaysPhraseId: 'dp-01',
      now: NOW,
    });

    const review = plan.tasks.find((task) => task.id === 'review');
    expect(review?.done).toBe(true);
    expect(review?.count).toBe(0);
  });

  it('caps the review count at the daily target', () => {
    const vocabulary: Record<string, VocabularyProgress> = {};
    for (let index = 0; index < 40; index += 1) {
      vocabulary[`w${index}`] = overdue(`w${index}`);
    }

    const plan = buildDailyPlan({
      activityByDate: {},
      vocabulary,
      savedPhraseIds: [],
      todaysPhraseId: 'dp-01',
      now: NOW,
    });

    // Forty overdue words is a wall, not a plan.
    expect(plan.tasks.find((task) => task.id === 'review')?.count).toBe(REVIEW_TARGET);
  });

  it('counts the phrase once it has been saved', () => {
    const plan = buildDailyPlan({
      activityByDate: {},
      vocabulary: {},
      savedPhraseIds: ['dp-07'],
      todaysPhraseId: 'dp-07',
      now: NOW,
    });

    expect(plan.tasks.find((task) => task.id === 'phrase')?.done).toBe(true);
  });

  it('does not credit the phrase task for a different day\'s phrase', () => {
    const plan = buildDailyPlan({
      activityByDate: {},
      vocabulary: {},
      savedPhraseIds: ['dp-99'],
      todaysPhraseId: 'dp-07',
      now: NOW,
    });

    expect(plan.tasks.find((task) => task.id === 'phrase')?.done).toBe(false);
  });

  it('survives content not having loaded yet', () => {
    const plan = buildDailyPlan({
      activityByDate: {},
      vocabulary: {},
      savedPhraseIds: [],
      todaysPhraseId: null,
      now: NOW,
    });

    expect(plan.tasks.find((task) => task.id === 'phrase')?.done).toBe(false);
    expect(plan.total).toBe(3);
  });

  it('reports a finished day', () => {
    const plan = buildDailyPlan({
      activityByDate: activity(2),
      vocabulary: { a: notYet('a') },
      savedPhraseIds: ['dp-07'],
      todaysPhraseId: 'dp-07',
      now: NOW,
    });

    expect(plan.allDone).toBe(true);
    expect(plan.ratio).toBe(1);
  });
});
