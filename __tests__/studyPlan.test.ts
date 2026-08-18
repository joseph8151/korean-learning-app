import { LESSONS } from '@/constants/content';
import {
  estimateFinish,
  paceById,
  paceForDailyGoal,
  STUDY_PACES,
} from '@/lib/studyPlan';

const TOTAL_MINUTES = LESSONS.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0);

describe('estimateFinish', () => {
  it('takes longer at a slower pace', () => {
    const fast = estimateFinish(20, 600, 100);
    const slow = estimateFinish(5, 600, 100);
    expect(slow.days).toBeGreaterThan(fast.days);
  });

  it('returns a date in the future', () => {
    const from = new Date(2026, 0, 1);
    const { date } = estimateFinish(10, 600, 100, from);
    expect(date.getTime()).toBeGreaterThan(from.getTime());
  });

  it('never returns zero days, however much content is added', () => {
    expect(estimateFinish(1000, 10, 2).days).toBe(1);
  });

  it('does not divide by zero on an empty library', () => {
    const estimate = estimateFinish(10, 0, 0);
    expect(estimate.days).toBe(1);
    expect(Number.isFinite(estimate.lessonsPerDay)).toBe(true);
  });

  it('survives a nonsense daily goal instead of producing Infinity', () => {
    expect(estimateFinish(0, 600, 100).days).toBe(600);
    expect(estimateFinish(-5, 600, 100).days).toBe(600);
  });
});

describe('paceForDailyGoal', () => {
  it('maps a saved goal back onto the nearest pace', () => {
    expect(paceForDailyGoal(20).id).toBe('intensive');
    expect(paceForDailyGoal(10).id).toBe('steady');
    expect(paceForDailyGoal(5).id).toBe('relaxed');
  });

  it('picks the closest pace for a goal between two of them', () => {
    expect(paceForDailyGoal(15).minutesPerDay).toBeGreaterThanOrEqual(10);
    expect(paceForDailyGoal(30).id).toBe('intensive');
    expect(paceForDailyGoal(1).id).toBe('relaxed');
  });
});

describe('the shipped paces', () => {
  it('offers 3, 6 and 12 months', () => {
    expect(STUDY_PACES.map((pace) => pace.months)).toEqual([3, 6, 12]);
  });

  it('gets slower as the horizon gets longer', () => {
    const minutes = STUDY_PACES.map((pace) => pace.minutesPerDay);
    expect(minutes).toEqual([...minutes].sort((a, b) => b - a));
  });

  it('resolves every id', () => {
    for (const pace of STUDY_PACES) expect(paceById(pace.id)).toBe(pace);
  });

  it('never claims more months of lessons than the library holds', () => {
    // The one-sided version of this check passed trivially and let the UI
    // imply a year of new material from three weeks of it. The month label is
    // a commitment length, so what has to be guarded is the opposite: the
    // lessons must not outlast it, and the screen must admit when they fall
    // short.
    for (const pace of STUDY_PACES) {
      const estimate = estimateFinish(
        pace.minutesPerDay,
        TOTAL_MINUTES,
        LESSONS.length,
        new Date(2026, 0, 1),
        pace.months,
      );
      expect(estimate.days / 30).toBeLessThanOrEqual(pace.months);
    }
  });

  it('flags when the lessons run out well before the commitment ends', () => {
    // True for the current library at every pace. The About screen relies on
    // this to explain what happens next rather than letting a learner find
    // out by running dry.
    const estimate = estimateFinish(5, TOTAL_MINUTES, LESSONS.length, new Date(), 12);
    expect(estimate.runsOutEarly).toBe(true);
  });

  it('does not flag a library that fills the commitment', () => {
    // 12 months at 5 minutes a day is roughly 1,800 minutes of lessons.
    const estimate = estimateFinish(5, 1800, 300, new Date(), 12);
    expect(estimate.runsOutEarly).toBe(false);
  });

  it('reports whole weeks of lessons, never zero', () => {
    expect(estimateFinish(1000, 10, 2).lessonWeeks).toBe(1);
    expect(estimateFinish(10, 700, 100).lessonWeeks).toBe(10);
  });
});
