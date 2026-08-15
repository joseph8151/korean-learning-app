import { addDays } from './date';
import type { VocabularyProgress } from '@/types/user';

export const MAX_MASTERY_LEVEL = 5;

/** Days until the next review for each mastery level (index = mastery level). */
export const REVIEW_INTERVALS_DAYS = [0, 1, 3, 7, 16, 35];

export function intervalForMastery(masteryLevel: number): number {
  const index = Math.min(Math.max(masteryLevel, 0), MAX_MASTERY_LEVEL);
  return REVIEW_INTERVALS_DAYS[index];
}

export function createVocabularyProgress(vocabularyId: string, now: Date = new Date()): VocabularyProgress {
  return {
    vocabularyId,
    correctCount: 0,
    wrongCount: 0,
    masteryLevel: 0,
    lastReviewedAt: null,
    nextReviewAt: now.toISOString(),
  };
}

/**
 * A deliberately simple SM-2-style schedule: a correct answer promotes the
 * word one mastery level, a wrong answer drops it back by one and brings the
 * review forward to today. Swap this function out to upgrade the algorithm.
 */
export function reviewVocabulary(
  progress: VocabularyProgress,
  wasCorrect: boolean,
  now: Date = new Date(),
): VocabularyProgress {
  const masteryLevel = wasCorrect
    ? Math.min(progress.masteryLevel + 1, MAX_MASTERY_LEVEL)
    : Math.max(progress.masteryLevel - 1, 0);

  return {
    ...progress,
    correctCount: progress.correctCount + (wasCorrect ? 1 : 0),
    wrongCount: progress.wrongCount + (wasCorrect ? 0 : 1),
    masteryLevel,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: addDays(now, intervalForMastery(masteryLevel)).toISOString(),
  };
}

export function isDueForReview(progress: VocabularyProgress, now: Date = new Date()): boolean {
  return new Date(progress.nextReviewAt).getTime() <= now.getTime();
}

export function dueVocabularyIds(
  progressById: Record<string, VocabularyProgress>,
  now: Date = new Date(),
): string[] {
  return Object.values(progressById)
    .filter((progress) => isDueForReview(progress, now))
    .sort((a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime())
    .map((progress) => progress.vocabularyId);
}

export function isMastered(progress: VocabularyProgress): boolean {
  return progress.masteryLevel >= MAX_MASTERY_LEVEL;
}
