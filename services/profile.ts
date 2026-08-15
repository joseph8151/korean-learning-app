import { getSupabase } from '@/lib/supabase';
import type { ProfileRow } from '@/types/database';
import type { KoreanLevel, LearningGoal, LevelKey } from '@/types/content';
import type { DailyGoalMinutes, Subscription, SubscriptionPlan, SubscriptionStatus } from '@/types/user';

export interface RemoteProfile {
  displayName: string;
  country: string | null;
  nativeLanguage: string;
  koreanLevel: KoreanLevel;
  levelKey: LevelKey | null;
  learningGoals: LearningGoal[];
  dailyGoalMinutes: DailyGoalMinutes;
}

export type ProfilePatch = Partial<RemoteProfile>;

const DAILY_GOALS: DailyGoalMinutes[] = [5, 10, 15, 20, 30];

function toDailyGoal(value: number): DailyGoalMinutes {
  return DAILY_GOALS.includes(value as DailyGoalMinutes) ? (value as DailyGoalMinutes) : 10;
}

function toKoreanLevel(value: number): KoreanLevel {
  const clamped = Math.min(5, Math.max(1, Math.round(value)));
  return clamped as KoreanLevel;
}

/**
 * Profile settings are small and change rarely, so every write is a full patch
 * of the changed fields. Failures are silent by design: the local store is
 * already updated and the next sign-in re-pushes.
 */
export const profileService = {
  async pull(userId: string): Promise<RemoteProfile | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, country, native_language, korean_level, level_key, learning_goals, daily_goal_minutes')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        displayName: data.display_name,
        country: data.country,
        nativeLanguage: data.native_language,
        koreanLevel: toKoreanLevel(data.korean_level),
        levelKey: (data.level_key as LevelKey | null) ?? null,
        learningGoals: (data.learning_goals ?? []) as LearningGoal[],
        dailyGoalMinutes: toDailyGoal(data.daily_goal_minutes),
      };
    } catch {
      return null;
    }
  },

  async push(userId: string, patch: ProfilePatch): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    const row: Partial<ProfileRow> = {};
    if (patch.displayName !== undefined) row.display_name = patch.displayName;
    if (patch.country !== undefined) row.country = patch.country;
    if (patch.nativeLanguage !== undefined) row.native_language = patch.nativeLanguage;
    if (patch.koreanLevel !== undefined) row.korean_level = patch.koreanLevel;
    if (patch.levelKey !== undefined) row.level_key = patch.levelKey;
    if (patch.learningGoals !== undefined) row.learning_goals = patch.learningGoals;
    if (patch.dailyGoalMinutes !== undefined) row.daily_goal_minutes = patch.dailyGoalMinutes;

    if (Object.keys(row).length === 0) return true;

    try {
      const { error } = await supabase.from('profiles').update(row).eq('id', userId);
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Subscriptions are written only by the service role (a purchase webhook),
   * so the app can read the entitlement but never grant it.
   */
  async pullSubscription(userId: string): Promise<Subscription | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan, status, started_at, expires_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        plan: data.plan as SubscriptionPlan,
        status: data.status as SubscriptionStatus,
        startedAt: data.started_at,
        expiresAt: data.expires_at,
      };
    } catch {
      return null;
    }
  },
};
