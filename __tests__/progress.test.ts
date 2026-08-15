import { completionPercentage, findNextLesson, goalProgressRatio, summarizeLessons } from '@/lib/progress';
import type { Lesson, Unit } from '@/types/content';
import type { LessonProgress } from '@/types/user';

const unit = (id: string, orderIndex: number): Unit => ({
  id,
  courseId: 'c1',
  title: id,
  description: '',
  orderIndex,
});

const lesson = (id: string, unitId: string, orderIndex: number): Lesson => ({
  id,
  unitId,
  title: id,
  description: '',
  lessonType: 'vocabulary',
  estimatedMinutes: 5,
  orderIndex,
  isPremium: false,
});

const completed = (lessonId: string): LessonProgress => ({
  lessonId,
  status: 'completed',
  score: 5,
  totalQuestions: 5,
  studySeconds: 300,
  completedAt: '2026-03-01T00:00:00.000Z',
});

describe('progress percentages', () => {
  it('computes a rounded completion percentage', () => {
    expect(completionPercentage(1, 3)).toBe(33);
    expect(completionPercentage(2, 4)).toBe(50);
    expect(completionPercentage(5, 5)).toBe(100);
  });

  it('returns zero rather than NaN when nothing exists yet', () => {
    expect(completionPercentage(0, 0)).toBe(0);
    expect(goalProgressRatio(5, 0)).toBe(0);
  });

  it('clamps values that exceed the goal', () => {
    expect(completionPercentage(7, 5)).toBe(100);
    expect(goalProgressRatio(30, 10)).toBe(1);
  });

  it('clamps negative input', () => {
    expect(goalProgressRatio(-5, 10)).toBe(0);
  });
});

describe('lesson summaries', () => {
  const lessons = [lesson('l1', 'u1', 1), lesson('l2', 'u1', 2), lesson('l3', 'u1', 3)];

  it('counts completed lessons only', () => {
    const summary = summarizeLessons(lessons, {
      l1: completed('l1'),
      l2: { ...completed('l2'), status: 'in_progress' },
    });
    expect(summary.completedLessons).toBe(1);
    expect(summary.totalLessons).toBe(3);
    expect(summary.percentage).toBe(33);
  });
});

describe('finding the next lesson', () => {
  const units = [unit('u2', 2), unit('u1', 1)];
  const lessonsByUnit = {
    u1: [lesson('l2', 'u1', 2), lesson('l1', 'u1', 1)],
    u2: [lesson('l3', 'u2', 1)],
  };

  it('returns the first lesson when nothing is done', () => {
    const next = findNextLesson(units, lessonsByUnit, {});
    expect(next?.lesson.id).toBe('l1');
    expect(next?.unit.id).toBe('u1');
  });

  it('skips completed lessons in order', () => {
    const next = findNextLesson(units, lessonsByUnit, { l1: completed('l1') });
    expect(next?.lesson.id).toBe('l2');
  });

  it('moves to the next unit when a unit is finished', () => {
    const next = findNextLesson(units, lessonsByUnit, {
      l1: completed('l1'),
      l2: completed('l2'),
    });
    expect(next?.unit.id).toBe('u2');
    expect(next?.lesson.id).toBe('l3');
  });

  it('falls back to the first lesson when everything is complete', () => {
    const next = findNextLesson(units, lessonsByUnit, {
      l1: completed('l1'),
      l2: completed('l2'),
      l3: completed('l3'),
    });
    expect(next?.lesson.id).toBe('l1');
    expect(next?.unit.id).toBe('u1');
  });

  it('returns null when there is no content', () => {
    expect(findNextLesson([], {}, {})).toBeNull();
  });
});
