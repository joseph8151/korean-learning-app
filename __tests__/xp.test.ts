import { XP_RULES } from '@/constants/app';
import { calculateLessonXp, xpLevel, xpProgressWithinLevel } from '@/lib/xp';

describe('XP calculation', () => {
  it('awards the base amount for finishing a lesson', () => {
    const result = calculateLessonXp({
      completed: true,
      isPerfectQuiz: false,
      dailyGoalReachedNow: false,
    });
    expect(result.total).toBe(XP_RULES.lessonComplete);
    expect(result.items).toHaveLength(1);
  });

  it('stacks the perfect-quiz and daily-goal bonuses', () => {
    const result = calculateLessonXp({
      completed: true,
      isPerfectQuiz: true,
      dailyGoalReachedNow: true,
    });
    expect(result.total).toBe(
      XP_RULES.lessonComplete + XP_RULES.perfectQuizBonus + XP_RULES.dailyGoalComplete,
    );
    expect(result.items.map((item) => item.label)).toEqual([
      'Lesson complete',
      'Perfect quiz',
      'Daily goal',
    ]);
  });

  it('awards nothing for an unfinished lesson', () => {
    const result = calculateLessonXp({
      completed: false,
      isPerfectQuiz: false,
      dailyGoalReachedNow: false,
    });
    expect(result.total).toBe(0);
    expect(result.items).toHaveLength(0);
  });
});

describe('XP levels', () => {
  it('starts every learner at level 1', () => {
    expect(xpLevel(0)).toBe(1);
    expect(xpLevel(199)).toBe(1);
  });

  it('advances a level every 200 XP', () => {
    expect(xpLevel(200)).toBe(2);
    expect(xpLevel(640)).toBe(4);
  });

  it('never returns a negative level for corrupt data', () => {
    expect(xpLevel(-50)).toBe(1);
  });

  it('reports progress within the current level', () => {
    expect(xpProgressWithinLevel(250)).toEqual({ current: 50, required: 200, ratio: 0.25 });
    expect(xpProgressWithinLevel(0).ratio).toBe(0);
  });
});
