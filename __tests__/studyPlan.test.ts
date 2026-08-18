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

  it('lands each pace in the right ballpark for the real library', () => {
    // Guards the promise against the content: if the courses grow enough that
    // "3 months" stops being roughly three months, this fails rather than the
    // app quietly overselling.
    for (const pace of STUDY_PACES) {
      const { days } = estimateFinish(pace.minutesPerDay, TOTAL_MINUTES, LESSONS.length);
      const months = days / 30;
      expect(months).toBeLessThanOrEqual(pace.months);
    }
  });
});
