import { useEffect, useRef } from 'react';

import { profileService, type RemoteProfile } from '@/services/profile';
import { useUserStore } from '@/store/useUserStore';

function signatureOf(profile: RemoteProfile): string {
  return JSON.stringify([
    profile.displayName,
    profile.country,
    profile.nativeLanguage,
    profile.koreanLevel,
    profile.levelKey,
    [...profile.learningGoals].sort(),
    profile.dailyGoalMinutes,
  ]);
}

/**
 * Mirrors profile settings up to Supabase whenever they change for a signed-in
 * learner. Mounted once at the app root so no settings screen has to know that
 * a backend exists.
 */
export function useProfileSync(): void {
  const userId = useUserStore((state) => state.userId);
  const hydrated = useUserStore((state) => state.hydrated);

  const displayName = useUserStore((state) => state.displayName);
  const country = useUserStore((state) => state.country);
  const nativeLanguage = useUserStore((state) => state.nativeLanguage);
  const koreanLevel = useUserStore((state) => state.koreanLevel);
  const levelKey = useUserStore((state) => state.levelKey);
  const learningGoals = useUserStore((state) => state.learningGoals);
  const dailyGoalMinutes = useUserStore((state) => state.dailyGoalMinutes);

  const lastPushed = useRef<string | null>(null);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated || !userId) {
      lastPushed.current = null;
      lastUserId.current = null;
      return;
    }

    const profile: RemoteProfile = {
      displayName,
      country,
      nativeLanguage,
      koreanLevel,
      levelKey,
      learningGoals,
      dailyGoalMinutes,
    };
    const signature = signatureOf(profile);

    // Skip the first pass after sign-in: syncOnSignIn already reconciled the
    // profile, so re-pushing identical values would be pure noise.
    if (lastUserId.current !== userId) {
      lastUserId.current = userId;
      lastPushed.current = signature;
      return;
    }

    if (lastPushed.current === signature) return;
    lastPushed.current = signature;

    const timer = setTimeout(() => {
      void profileService.push(userId, profile);
    }, 800);

    return () => clearTimeout(timer);
  }, [
    hydrated,
    userId,
    displayName,
    country,
    nativeLanguage,
    koreanLevel,
    levelKey,
    learningGoals,
    dailyGoalMinutes,
  ]);
}
