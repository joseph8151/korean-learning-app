import {
  MAX_MASTERY_LEVEL,
  createVocabularyProgress,
  dueVocabularyIds,
  intervalForMastery,
  isDueForReview,
  isMastered,
  reviewVocabulary,
} from '@/lib/spacedReview';
import { MS_PER_DAY } from '@/lib/date';

const NOW = new Date('2026-03-01T09:00:00.000Z');

const daysFromNow = (isoDate: string) =>
  Math.round((new Date(isoDate).getTime() - NOW.getTime()) / MS_PER_DAY);

describe('spaced review scheduling', () => {
  it('creates a new word that is due immediately', () => {
    const progress = createVocabularyProgress('v-annyeong', NOW);
    expect(progress.masteryLevel).toBe(0);
    expect(isDueForReview(progress, NOW)).toBe(true);
  });

  it('pushes the next review further out with each correct answer', () => {
    let progress = createVocabularyProgress('v1', NOW);

    progress = reviewVocabulary(progress, true, NOW);
    expect(progress.masteryLevel).toBe(1);
    expect(daysFromNow(progress.nextReviewAt)).toBe(1);

    progress = reviewVocabulary(progress, true, NOW);
    expect(progress.masteryLevel).toBe(2);
    expect(daysFromNow(progress.nextReviewAt)).toBe(3);

    progress = reviewVocabulary(progress, true, NOW);
    expect(daysFromNow(progress.nextReviewAt)).toBe(7);
  });

  it('drops one level and brings the review forward on a wrong answer', () => {
    let progress = createVocabularyProgress('v1', NOW);
    progress = reviewVocabulary(progress, true, NOW);
    progress = reviewVocabulary(progress, true, NOW);
    expect(progress.masteryLevel).toBe(2);

    progress = reviewVocabulary(progress, false, NOW);
    expect(progress.masteryLevel).toBe(1);
    expect(progress.wrongCount).toBe(1);
    expect(daysFromNow(progress.nextReviewAt)).toBe(1);
  });

  it('never drops below zero or climbs above the maximum', () => {
    let progress = createVocabularyProgress('v1', NOW);
    progress = reviewVocabulary(progress, false, NOW);
    expect(progress.masteryLevel).toBe(0);
    expect(daysFromNow(progress.nextReviewAt)).toBe(0);

    for (let index = 0; index < 10; index += 1) {
      progress = reviewVocabulary(progress, true, NOW);
    }
    expect(progress.masteryLevel).toBe(MAX_MASTERY_LEVEL);
    expect(isMastered(progress)).toBe(true);
  });

  it('counts correct and wrong answers independently', () => {
    let progress = createVocabularyProgress('v1', NOW);
    progress = reviewVocabulary(progress, true, NOW);
    progress = reviewVocabulary(progress, false, NOW);
    progress = reviewVocabulary(progress, true, NOW);
    expect(progress.correctCount).toBe(2);
    expect(progress.wrongCount).toBe(1);
  });

  it('clamps the interval lookup for out-of-range mastery levels', () => {
    expect(intervalForMastery(-3)).toBe(0);
    expect(intervalForMastery(99)).toBe(35);
  });

  it('lists due words soonest first and excludes future ones', () => {
    const due = createVocabularyProgress('due', NOW);
    const later = reviewVocabulary(createVocabularyProgress('later', NOW), true, NOW);
    const muchLater = reviewVocabulary(
      reviewVocabulary(createVocabularyProgress('much-later', NOW), true, NOW),
      true,
      NOW,
    );

    const ids = dueVocabularyIds({ due, later, 'much-later': muchLater }, NOW);
    expect(ids).toEqual(['due']);

    const inTwoDays = new Date(NOW.getTime() + 2 * MS_PER_DAY);
    expect(dueVocabularyIds({ due, later, 'much-later': muchLater }, inTwoDays)).toEqual([
      'due',
      'later',
    ]);
  });
});
