import type { Lesson, Unit } from '@/types/content';
import type { LessonProgress } from '@/types/user';

export function completionPercentage(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

export function goalProgressRatio(achieved: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(1, Math.max(0, achieved / goal));
}

export interface CourseProgressSummary {
  completedLessons: number;
  totalLessons: number;
  percentage: number;
}

export function summarizeLessons(
  lessons: Lesson[],
  progress: Record<string, LessonProgress>,
): CourseProgressSummary {
  const completedLessons = lessons.filter(
    (lesson) => progress[lesson.id]?.status === 'completed',
  ).length;

  return {
    completedLessons,
    totalLessons: lessons.length,
    percentage: completionPercentage(completedLessons, lessons.length),
  };
}

/**
 * The first lesson that is not completed yet, scanning units and lessons in
 * their intended order. Falls back to the first lesson when everything is done.
 */
export function findNextLesson(
  units: Unit[],
  lessonsByUnit: Record<string, Lesson[]>,
  progress: Record<string, LessonProgress>,
): { unit: Unit; lesson: Lesson } | null {
  const orderedUnits = [...units].sort((a, b) => a.orderIndex - b.orderIndex);

  for (const unit of orderedUnits) {
    const lessons = [...(lessonsByUnit[unit.id] ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
    for (const lesson of lessons) {
      if (progress[lesson.id]?.status !== 'completed') {
        return { unit, lesson };
      }
    }
  }

  const firstUnit = orderedUnits[0];
  const firstLesson = firstUnit
    ? [...(lessonsByUnit[firstUnit.id] ?? [])].sort((a, b) => a.orderIndex - b.orderIndex)[0]
    : undefined;
  return firstUnit && firstLesson ? { unit: firstUnit, lesson: firstLesson } : null;
}
