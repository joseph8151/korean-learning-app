import { EMPTY_SYNCABLE_PROGRESS, mergeProgress, type SyncableProgress } from '@/lib/mergeProgress';
import { getSupabase } from '@/lib/supabase';
import type { Json } from '@/types/database';
import type {
  AchievementId,
  DailyActivity,
  LessonProgress,
  LessonStatus,
  VocabularyProgress,
} from '@/types/user';

export interface SyncResult {
  ok: boolean;
  /** Safe, user-facing copy. */
  message: string;
  progress: SyncableProgress | null;
}

const OFFLINE: SyncResult = {
  ok: false,
  message: 'Your progress is saved on this device. We will sync it when you are back online.',
  progress: null,
};

const NOT_CONFIGURED: SyncResult = {
  ok: false,
  message: 'Cloud sync is not connected in this build.',
  progress: null,
};

/**
 * Progress that does not map onto a database table of its own. Storing it as
 * one JSON column on `profiles` keeps the schema small; it is device-agnostic
 * counters only, never anything another table already owns.
 */
interface ProfileExtras {
  speakingSeconds: number;
  conversationsCompleted: number;
  achievements: AchievementId[];
  activityByDate: Record<string, DailyActivity>;
  savedPhraseIds: string[];
  mistakeVocabularyIds: string[];
}

/**
 * `ProfileExtras` is a plain serialisable object, but a declared object type
 * has no index signature so TypeScript cannot see it as `Json`. This is the
 * one place that gap is bridged.
 */
function toJson(extras: ProfileExtras): Json {
  return extras as unknown as Json;
}

function readExtras(value: unknown): ProfileExtras {
  const extras = (value ?? {}) as Partial<ProfileExtras>;
  return {
    speakingSeconds: extras.speakingSeconds ?? 0,
    conversationsCompleted: extras.conversationsCompleted ?? 0,
    achievements: extras.achievements ?? [],
    activityByDate: extras.activityByDate ?? {},
    savedPhraseIds: extras.savedPhraseIds ?? [],
    mistakeVocabularyIds: extras.mistakeVocabularyIds ?? [],
  };
}

async function fetchRemoteProgress(userId: string): Promise<SyncableProgress | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const [profile, lessons, vocabulary, saved, streak] = await Promise.all([
    supabase.from('profiles').select('total_xp, sync_extras').eq('id', userId).maybeSingle(),
    supabase.from('progress').select('*').eq('user_id', userId),
    supabase.from('vocabulary_progress').select('*').eq('user_id', userId),
    supabase.from('saved_words').select('vocabulary_id').eq('user_id', userId),
    supabase.from('user_streaks').select('*').eq('user_id', userId).maybeSingle(),
  ]);

  if (profile.error || lessons.error || vocabulary.error || saved.error || streak.error) {
    return null;
  }

  const extras = readExtras((profile.data as { sync_extras?: unknown } | null)?.sync_extras);

  const lessonMap: Record<string, LessonProgress> = {};
  for (const row of lessons.data ?? []) {
    lessonMap[row.lesson_id] = {
      lessonId: row.lesson_id,
      status: row.status as LessonStatus,
      score: row.score,
      totalQuestions: row.total_questions,
      studySeconds: row.study_seconds,
      completedAt: row.completed_at,
    };
  }

  const vocabularyMap: Record<string, VocabularyProgress> = {};
  for (const row of vocabulary.data ?? []) {
    vocabularyMap[row.vocabulary_id] = {
      vocabularyId: row.vocabulary_id,
      correctCount: row.correct_count,
      wrongCount: row.wrong_count,
      masteryLevel: row.mastery_level,
      lastReviewedAt: row.last_reviewed_at,
      nextReviewAt: row.next_review_at,
    };
  }

  return {
    totalXp: profile.data?.total_xp ?? 0,
    lessons: lessonMap,
    vocabulary: vocabularyMap,
    savedWordIds: (saved.data ?? []).map((row) => row.vocabulary_id),
    savedPhraseIds: extras.savedPhraseIds,
    mistakeVocabularyIds: extras.mistakeVocabularyIds,
    streak: {
      currentStreak: streak.data?.current_streak ?? 0,
      longestStreak: streak.data?.longest_streak ?? 0,
      lastActivityDate: streak.data?.last_activity_date ?? null,
    },
    activityByDate: extras.activityByDate,
    achievements: extras.achievements,
    speakingSeconds: extras.speakingSeconds,
    conversationsCompleted: extras.conversationsCompleted,
  };
}

async function pushProgress(userId: string, progress: SyncableProgress): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const extras: ProfileExtras = {
    speakingSeconds: progress.speakingSeconds,
    conversationsCompleted: progress.conversationsCompleted,
    achievements: progress.achievements,
    activityByDate: progress.activityByDate,
    savedPhraseIds: progress.savedPhraseIds,
    mistakeVocabularyIds: progress.mistakeVocabularyIds,
  };

  const lessonRows = Object.values(progress.lessons).map((lesson) => ({
    user_id: userId,
    lesson_id: lesson.lessonId,
    status: lesson.status,
    score: lesson.score,
    total_questions: lesson.totalQuestions,
    study_seconds: lesson.studySeconds,
    completed_at: lesson.completedAt,
  }));

  const vocabularyRows = Object.values(progress.vocabulary).map((word) => ({
    user_id: userId,
    vocabulary_id: word.vocabularyId,
    correct_count: word.correctCount,
    wrong_count: word.wrongCount,
    mastery_level: word.masteryLevel,
    last_reviewed_at: word.lastReviewedAt,
    next_review_at: word.nextReviewAt,
  }));

  const savedRows = progress.savedWordIds.map((vocabularyId) => ({
    user_id: userId,
    vocabulary_id: vocabularyId,
  }));

  const results = await Promise.all([
    supabase
      .from('profiles')
      .update({ total_xp: progress.totalXp, sync_extras: toJson(extras) })
      .eq('id', userId),
    lessonRows.length > 0
      ? supabase.from('progress').upsert(lessonRows, { onConflict: 'user_id,lesson_id' })
      : Promise.resolve({ error: null }),
    vocabularyRows.length > 0
      ? supabase
          .from('vocabulary_progress')
          .upsert(vocabularyRows, { onConflict: 'user_id,vocabulary_id' })
      : Promise.resolve({ error: null }),
    savedRows.length > 0
      ? supabase
          .from('saved_words')
          .upsert(savedRows, { onConflict: 'user_id,vocabulary_id', ignoreDuplicates: true })
      : Promise.resolve({ error: null }),
    supabase.from('user_streaks').upsert(
      {
        user_id: userId,
        current_streak: progress.streak.currentStreak,
        longest_streak: progress.streak.longestStreak,
        last_activity_date: progress.streak.lastActivityDate,
      },
      { onConflict: 'user_id' },
    ),
  ]);

  return results.every((result) => !result.error);
}

export const syncService = {
  /**
   * Called right after sign-in. Pulls whatever the account already has, merges
   * the guest progress from this device into it, writes the result back, and
   * returns the merged snapshot for the store to adopt.
   *
   * The merge is idempotent, so a retry after a failed push is safe.
   */
  async syncOnSignIn(userId: string, localProgress: SyncableProgress): Promise<SyncResult> {
    const supabase = getSupabase();
    if (!supabase) return NOT_CONFIGURED;

    try {
      const remote = await fetchRemoteProgress(userId);
      if (!remote) return OFFLINE;

      const merged = mergeProgress(localProgress, remote);
      const pushed = await pushProgress(userId, merged);

      return pushed
        ? { ok: true, message: 'Your progress is synced.', progress: merged }
        : { ...OFFLINE, progress: merged };
    } catch {
      return OFFLINE;
    }
  },

  /** Fire-and-forget upload used after a lesson completes. */
  async pushLatest(userId: string, localProgress: SyncableProgress): Promise<SyncResult> {
    const supabase = getSupabase();
    if (!supabase) return NOT_CONFIGURED;

    try {
      const pushed = await pushProgress(userId, localProgress);
      return pushed
        ? { ok: true, message: 'Saved.', progress: localProgress }
        : OFFLINE;
    } catch {
      return OFFLINE;
    }
  },

  async pullOnly(userId: string): Promise<SyncResult> {
    const supabase = getSupabase();
    if (!supabase) return NOT_CONFIGURED;

    try {
      const remote = await fetchRemoteProgress(userId);
      return remote
        ? { ok: true, message: 'Up to date.', progress: remote }
        : OFFLINE;
    } catch {
      return OFFLINE;
    }
  },
};

export { EMPTY_SYNCABLE_PROGRESS };
export type { SyncableProgress };
