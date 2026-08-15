import { XP_RULES } from '@/constants/app';

export interface LessonXpInput {
  completed: boolean;
  isPerfectQuiz: boolean;
  dailyGoalReachedNow: boolean;
}

export interface XpBreakdownItem {
  label: string;
  amount: number;
}

export interface XpBreakdown {
  total: number;
  items: XpBreakdownItem[];
}

export function calculateLessonXp(input: LessonXpInput): XpBreakdown {
  const items: XpBreakdownItem[] = [];

  if (input.completed) {
    items.push({ label: 'Lesson complete', amount: XP_RULES.lessonComplete });
  }
  if (input.isPerfectQuiz) {
    items.push({ label: 'Perfect quiz', amount: XP_RULES.perfectQuizBonus });
  }
  if (input.dailyGoalReachedNow) {
    items.push({ label: 'Daily goal', amount: XP_RULES.dailyGoalComplete });
  }

  return { total: items.reduce((sum, item) => sum + item.amount, 0), items };
}

const XP_PER_LEVEL = 200;

export function xpLevel(totalXp: number): number {
  return Math.floor(Math.max(0, totalXp) / XP_PER_LEVEL) + 1;
}

export function xpProgressWithinLevel(totalXp: number): { current: number; required: number; ratio: number } {
  const safeXp = Math.max(0, totalXp);
  const current = safeXp % XP_PER_LEVEL;
  return { current, required: XP_PER_LEVEL, ratio: current / XP_PER_LEVEL };
}
