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
 * pace only decides the daily goal.
 *
 * The month figure is the length of the commitment a learner is making, NOT a
 * promise about how long the lessons last. Those are different numbers and
 * conflating them is how an app ends up overselling: the current library is
 * about nine hours, so lessons run out well before twelve months even at five
 * minutes a day. What fills the rest is review, practice and conversation,
 * which is also how language learning actually works — but the UI has to say
 * that rather than imply a year of new material.
 *
 * `lessonWeeks` in `estimateFinish` is the honest number, and the About screen
 * shows it plainly next to the commitment.
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
  /** Whole weeks of new material. What the About screen shows. */
  lessonWeeks: number;
  /**
   * True when new lessons run out well before the commitment ends, which is
   * the normal state for a young library. The UI uses this to say what happens
   * next instead of leaving a learner to discover it.
   */
  runsOutEarly: boolean;
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
  commitmentMonths?: number,
): FinishEstimate {
  const safeMinutes = Math.max(1, minutesPerDay);
  const days = Math.max(1, Math.ceil(totalLessonMinutes / safeMinutes));
  const averageLesson = lessonCount > 0 ? totalLessonMinutes / lessonCount : 1;

  return {
    days,
    date: addDays(from, days),
    lessonsPerDay: Math.max(1, Math.round(safeMinutes / Math.max(1, averageLesson))),
    lessonWeeks: Math.max(1, Math.round(days / 7)),
    runsOutEarly: commitmentMonths !== undefined && days < commitmentMonths * 30 * 0.75,
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
