import type {
  AchievementId,
  DailyActivity,
  LessonProgress,
  LessonStatus,
  StreakState,
  VocabularyProgress,
} from '@/types/user';

/**
 * The subset of progress that is worth syncing. Kept separate from the store
 * so the merge is a pure function with no Zustand or Supabase involved.
 */
export interface SyncableProgress {
  totalXp: number;
  lessons: Record<string, LessonProgress>;
  vocabulary: Record<string, VocabularyProgress>;
  savedWordIds: string[];
  savedPhraseIds: string[];
  mistakeVocabularyIds: string[];
  streak: StreakState;
  activityByDate: Record<string, DailyActivity>;
  achievements: AchievementId[];
  speakingSeconds: number;
  conversationsCompleted: number;
}

const STATUS_RANK: Record<LessonStatus, number> = {
  not_started: 0,
  in_progress: 1,
  completed: 2,
};

function laterIso(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return new Date(a).getTime() >= new Date(b).getTime() ? a : b;
}

export function mergeLessonProgress(a: LessonProgress, b: LessonProgress): LessonProgress {
  const status = STATUS_RANK[a.status] >= STATUS_RANK[b.status] ? a.status : b.status;
  const best = (a.score ?? -1) >= (b.score ?? -1) ? a : b;

  return {
    lessonId: a.lessonId,
    status,
    score: best.score,
    totalQuestions: best.totalQuestions,
    // Study time is additive per device but capped by taking the larger value,
    // so repeated syncs of the same session never inflate the total.
    studySeconds: Math.max(a.studySeconds, b.studySeconds),
    completedAt:
      status === 'completed' ? (laterIso(a.completedAt, b.completedAt) ?? null) : null,
  };
}

export function mergeVocabularyProgress(
  a: VocabularyProgress,
  b: VocabularyProgress,
): VocabularyProgress {
  // The most recent review is the authority on mastery and the next due date;
  // the counters take the larger value so no review is lost.
  const newest = laterIso(a.lastReviewedAt, b.lastReviewedAt) === b.lastReviewedAt ? b : a;

  return {
    vocabularyId: a.vocabularyId,
    correctCount: Math.max(a.correctCount, b.correctCount),
    wrongCount: Math.max(a.wrongCount, b.wrongCount),
    masteryLevel: newest.masteryLevel,
    lastReviewedAt: laterIso(a.lastReviewedAt, b.lastReviewedAt),
    nextReviewAt: newest.nextReviewAt,
  };
}

export function mergeStreaks(a: StreakState, b: StreakState): StreakState {
  const newest = laterIso(a.lastActivityDate, b.lastActivityDate) === b.lastActivityDate ? b : a;

  return {
    currentStreak: newest.currentStreak,
    longestStreak: Math.max(a.longestStreak, b.longestStreak),
    lastActivityDate: laterIso(a.lastActivityDate, b.lastActivityDate),
  };
}

function mergeRecords<T>(
  a: Record<string, T>,
  b: Record<string, T>,
  merge: (left: T, right: T) => T,
): Record<string, T> {
  const result: Record<string, T> = { ...a };

  for (const [key, value] of Object.entries(b)) {
    const existing = result[key];
    result[key] = existing ? merge(existing, value) : value;
  }

  return result;
}

function union(a: string[], b: string[]): string[] {
  return [...new Set([...a, ...b])];
}

/**
 * Merges two snapshots of a learner's progress — typically local guest data
 * and whatever the account already had on the server.
 *
 * The merge is commutative and idempotent: merging the same two snapshots
 * twice yields the same result, so a retried sync cannot inflate XP or
 * double-count study time.
 */
export function mergeProgress(local: SyncableProgress, remote: SyncableProgress): SyncableProgress {
  const vocabulary = mergeRecords(local.vocabulary, remote.vocabulary, mergeVocabularyProgress);

  return {
    totalXp: Math.max(local.totalXp, remote.totalXp),
    lessons: mergeRecords(local.lessons, remote.lessons, mergeLessonProgress),
    vocabulary,
    savedWordIds: union(local.savedWordIds, remote.savedWordIds),
    savedPhraseIds: union(local.savedPhraseIds, remote.savedPhraseIds),
    // A word the learner has since answered correctly on either device should
    // not come back as a mistake.
    mistakeVocabularyIds: union(local.mistakeVocabularyIds, remote.mistakeVocabularyIds).filter(
      (id) => {
        const merged = vocabulary[id];
        return !merged || merged.masteryLevel === 0 || merged.wrongCount > merged.correctCount;
      },
    ),
    streak: mergeStreaks(local.streak, remote.streak),
    activityByDate: mergeRecords(local.activityByDate, remote.activityByDate, (a, b) => ({
      date: a.date,
      studySeconds: Math.max(a.studySeconds, b.studySeconds),
      xpEarned: Math.max(a.xpEarned, b.xpEarned),
      lessonsCompleted: Math.max(a.lessonsCompleted, b.lessonsCompleted),
    })),
    achievements: union(local.achievements, remote.achievements) as AchievementId[],
    speakingSeconds: Math.max(local.speakingSeconds, remote.speakingSeconds),
    conversationsCompleted: Math.max(local.conversationsCompleted, remote.conversationsCompleted),
  };
}

export const EMPTY_SYNCABLE_PROGRESS: SyncableProgress = {
  totalXp: 0,
  lessons: {},
  vocabulary: {},
  savedWordIds: [],
  savedPhraseIds: [],
  mistakeVocabularyIds: [],
  streak: { currentStreak: 0, longestStreak: 0, lastActivityDate: null },
  activityByDate: {},
  achievements: [],
  speakingSeconds: 0,
  conversationsCompleted: 0,
};
