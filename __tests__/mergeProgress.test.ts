import {
  EMPTY_SYNCABLE_PROGRESS,
  mergeLessonProgress,
  mergeProgress,
  mergeStreaks,
  mergeVocabularyProgress,
  type SyncableProgress,
} from '@/lib/mergeProgress';
import type { LessonProgress, VocabularyProgress } from '@/types/user';

const lesson = (overrides: Partial<LessonProgress> = {}): LessonProgress => ({
  lessonId: 'l1',
  status: 'not_started',
  score: null,
  totalQuestions: null,
  studySeconds: 0,
  completedAt: null,
  ...overrides,
});

const word = (overrides: Partial<VocabularyProgress> = {}): VocabularyProgress => ({
  vocabularyId: 'v1',
  correctCount: 0,
  wrongCount: 0,
  masteryLevel: 0,
  lastReviewedAt: null,
  nextReviewAt: '2026-03-01T00:00:00.000Z',
  ...overrides,
});

const snapshot = (overrides: Partial<SyncableProgress> = {}): SyncableProgress => ({
  ...EMPTY_SYNCABLE_PROGRESS,
  ...overrides,
});

describe('merging lesson progress', () => {
  it('keeps the furthest status', () => {
    const merged = mergeLessonProgress(
      lesson({ status: 'in_progress' }),
      lesson({ status: 'completed', score: 3, totalQuestions: 4, completedAt: '2026-03-01T00:00:00.000Z' }),
    );
    expect(merged.status).toBe('completed');
    expect(merged.completedAt).toBe('2026-03-01T00:00:00.000Z');
  });

  it('keeps the better score', () => {
    const merged = mergeLessonProgress(
      lesson({ status: 'completed', score: 2, totalQuestions: 4 }),
      lesson({ status: 'completed', score: 4, totalQuestions: 4 }),
    );
    expect(merged.score).toBe(4);
  });

  it('takes the larger study time rather than summing, so repeat syncs cannot inflate it', () => {
    const merged = mergeLessonProgress(
      lesson({ studySeconds: 300 }),
      lesson({ studySeconds: 180 }),
    );
    expect(merged.studySeconds).toBe(300);
  });

  it('clears completedAt when neither side actually completed', () => {
    const merged = mergeLessonProgress(
      lesson({ status: 'in_progress', completedAt: '2026-03-01T00:00:00.000Z' }),
      lesson({ status: 'not_started' }),
    );
    expect(merged.status).toBe('in_progress');
    expect(merged.completedAt).toBeNull();
  });
});

describe('merging vocabulary progress', () => {
  it('trusts the most recent review for mastery and the next due date', () => {
    const older = word({
      masteryLevel: 3,
      lastReviewedAt: '2026-03-01T00:00:00.000Z',
      nextReviewAt: '2026-03-08T00:00:00.000Z',
      correctCount: 3,
    });
    const newer = word({
      masteryLevel: 1,
      lastReviewedAt: '2026-03-05T00:00:00.000Z',
      nextReviewAt: '2026-03-06T00:00:00.000Z',
      correctCount: 2,
      wrongCount: 2,
    });

    const merged = mergeVocabularyProgress(older, newer);
    expect(merged.masteryLevel).toBe(1);
    expect(merged.nextReviewAt).toBe('2026-03-06T00:00:00.000Z');
    expect(merged.lastReviewedAt).toBe('2026-03-05T00:00:00.000Z');
    expect(merged.correctCount).toBe(3);
    expect(merged.wrongCount).toBe(2);
  });

  it('handles a word that has never been reviewed on one side', () => {
    const merged = mergeVocabularyProgress(
      word(),
      word({ masteryLevel: 2, lastReviewedAt: '2026-03-05T00:00:00.000Z', correctCount: 2 }),
    );
    expect(merged.masteryLevel).toBe(2);
    expect(merged.correctCount).toBe(2);
  });
});

describe('merging streaks', () => {
  it('takes the current streak from the most recent activity', () => {
    const merged = mergeStreaks(
      { currentStreak: 9, longestStreak: 9, lastActivityDate: '2026-03-01' },
      { currentStreak: 2, longestStreak: 4, lastActivityDate: '2026-03-05' },
    );
    expect(merged.currentStreak).toBe(2);
    expect(merged.longestStreak).toBe(9);
    expect(merged.lastActivityDate).toBe('2026-03-05');
  });

  it('adopts the other side when one has never studied', () => {
    const merged = mergeStreaks(
      { currentStreak: 0, longestStreak: 0, lastActivityDate: null },
      { currentStreak: 5, longestStreak: 6, lastActivityDate: '2026-03-05' },
    );
    expect(merged.currentStreak).toBe(5);
    expect(merged.longestStreak).toBe(6);
  });
});

describe('merging a full snapshot', () => {
  const guest = snapshot({
    totalXp: 60,
    lessons: { l1: lesson({ status: 'completed', score: 4, totalQuestions: 4, studySeconds: 300 }) },
    savedWordIds: ['v-keopi'],
    savedPhraseIds: ['dp-01'],
    achievements: ['first_lesson'],
    speakingSeconds: 120,
    streak: { currentStreak: 2, longestStreak: 2, lastActivityDate: '2026-03-05' },
  });

  const account = snapshot({
    totalXp: 200,
    lessons: { l2: lesson({ lessonId: 'l2', status: 'completed', score: 3, totalQuestions: 5 }) },
    savedWordIds: ['v-mul'],
    achievements: ['streak_3'],
    conversationsCompleted: 4,
    streak: { currentStreak: 7, longestStreak: 7, lastActivityDate: '2026-03-01' },
  });

  it('unions everything without losing either side', () => {
    const merged = mergeProgress(guest, account);

    expect(Object.keys(merged.lessons).sort()).toEqual(['l1', 'l2']);
    expect(merged.savedWordIds.sort()).toEqual(['v-keopi', 'v-mul']);
    expect(merged.savedPhraseIds).toEqual(['dp-01']);
    expect(merged.achievements.sort()).toEqual(['first_lesson', 'streak_3']);
    expect(merged.speakingSeconds).toBe(120);
    expect(merged.conversationsCompleted).toBe(4);
  });

  it('takes the higher XP rather than adding, so re-syncing cannot inflate it', () => {
    expect(mergeProgress(guest, account).totalXp).toBe(200);
  });

  it('is idempotent — merging the result again changes nothing', () => {
    const once = mergeProgress(guest, account);
    const twice = mergeProgress(once, account);
    const thrice = mergeProgress(twice, once);

    expect(twice).toEqual(once);
    expect(thrice).toEqual(once);
  });

  it('is commutative for the values that matter', () => {
    const forward = mergeProgress(guest, account);
    const backward = mergeProgress(account, guest);

    expect(backward.totalXp).toBe(forward.totalXp);
    expect(Object.keys(backward.lessons).sort()).toEqual(Object.keys(forward.lessons).sort());
    expect(backward.savedWordIds.sort()).toEqual(forward.savedWordIds.sort());
    expect(backward.streak).toEqual(forward.streak);
  });

  it('drops a mistake that has since been answered correctly on the other device', () => {
    const withMistake = snapshot({
      mistakeVocabularyIds: ['v-keopi'],
      vocabulary: { 'v-keopi': word({ vocabularyId: 'v-keopi', wrongCount: 1 }) },
    });
    const withFix = snapshot({
      vocabulary: {
        'v-keopi': word({
          vocabularyId: 'v-keopi',
          masteryLevel: 2,
          correctCount: 3,
          wrongCount: 1,
          lastReviewedAt: '2026-03-06T00:00:00.000Z',
        }),
      },
    });

    expect(mergeProgress(withMistake, withFix).mistakeVocabularyIds).toEqual([]);
  });

  it('keeps a mistake that is still unresolved', () => {
    const withMistake = snapshot({
      mistakeVocabularyIds: ['v-keopi'],
      vocabulary: {
        'v-keopi': word({ vocabularyId: 'v-keopi', wrongCount: 3, correctCount: 1, masteryLevel: 1 }),
      },
    });

    expect(mergeProgress(withMistake, snapshot()).mistakeVocabularyIds).toEqual(['v-keopi']);
  });

  it('merging with an empty snapshot returns the original', () => {
    expect(mergeProgress(guest, snapshot())).toEqual(mergeProgress(snapshot(), guest));
  });
});
