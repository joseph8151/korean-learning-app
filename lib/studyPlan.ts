import { addDays } from './date';

export type StudyPaceId = 'intensive' | 'steady' | 'relaxed';

export interface StudyPace {
  id: StudyPaceId;
  months: 3 | 6 | 12;
  minutesPerDay: number;
  title: string;
  blurb: string;
}

/**
 * Three commitments, not three products. Everyone gets the same courses; the
 * pace decides the daily goal and the date the courses run out.
 *
 * The minute figures are chosen so the arithmetic below lands near the stated
 * month count for the current library — see `estimateFinish`. They are not
 * marketing numbers, and if the content grows the estimate moves rather than
 * the promise.
 */
export const STUDY_PACES: StudyPace[] = [
  {
    id: 'intensive',
    months: 3,
    minutesPerDay: 20,
    title: '3 months',
    blurb: 'Moving to Korea, or you want this done.',
  },
  {
    id: 'steady',
    months: 6,
    minutesPerDay: 10,
    title: '6 months',
    blurb: 'One coffee break a day. Most people pick this.',
  },
  {
    id: 'relaxed',
    months: 12,
    minutesPerDay: 5,
    title: '12 months',
    blurb: 'A little every day, around a full life.',
  },
];

export interface FinishEstimate {
  /** Days of study to get through every lesson at this pace. */
  days: number;
  /** The date those lessons run out, if you start today and never miss. */
  date: Date;
  /** Lessons per study day, rounded for display. */
  lessonsPerDay: number;
}

/**
 * When the courses run out at a given pace.
 *
 * Deliberately measures lessons only. Review, practice and conversation carry
 * on indefinitely, so a "finish date" for the whole app would be a lie — this
 * is the date new material stops, which is the honest thing to show.
 */
export function estimateFinish(
  minutesPerDay: number,
  totalLessonMinutes: number,
  lessonCount: number,
  from: Date = new Date(),
): FinishEstimate {
  const safeMinutes = Math.max(1, minutesPerDay);
  const days = Math.max(1, Math.ceil(totalLessonMinutes / safeMinutes));
  const averageLesson = lessonCount > 0 ? totalLessonMinutes / lessonCount : 1;

  return {
    days,
    date: addDays(from, days),
    lessonsPerDay: Math.max(1, Math.round(safeMinutes / Math.max(1, averageLesson))),
  };
}

export function paceById(id: StudyPaceId): StudyPace {
  return STUDY_PACES.find((pace) => pace.id === id) ?? STUDY_PACES[1];
}

/** Maps an existing daily-goal setting back onto the closest pace. */
export function paceForDailyGoal(minutesPerDay: number): StudyPace {
  return STUDY_PACES.reduce((closest, pace) =>
    Math.abs(pace.minutesPerDay - minutesPerDay) < Math.abs(closest.minutesPerDay - minutesPerDay)
      ? pace
      : closest,
  );
}
