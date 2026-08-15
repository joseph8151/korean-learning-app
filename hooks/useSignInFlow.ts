import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { profileService } from '@/services/profile';
import { syncService } from '@/services/sync';
import { useProgressStore } from '@/store/useProgressStore';
import { useUserStore } from '@/store/useUserStore';
import type { AuthUser } from '@/services/auth';

export interface SignInFlowState {
  /** Non-null while progress is being merged with the account. */
  syncingMessage: string | null;
  completeSignIn: (user: AuthUser) => Promise<void>;
}

/**
 * The single path every successful sign-in takes: adopt the user, merge this
 * device's guest progress into the account, then land on Home.
 *
 * A failed sync is never fatal — the learner keeps their local progress and
 * lands on Home either way.
 */
export function useSignInFlow(): SignInFlowState {
  const router = useRouter();
  const signIn = useUserStore((state) => state.signIn);
  const setSubscription = useUserStore((state) => state.setSubscription);
  const getSyncableSnapshot = useProgressStore((state) => state.getSyncableSnapshot);
  const adoptSyncedProgress = useProgressStore((state) => state.adoptSyncedProgress);

  const [syncingMessage, setSyncingMessage] = useState<string | null>(null);

  const completeSignIn = useCallback(
    async (user: AuthUser) => {
      signIn(user);
      setSyncingMessage('Syncing your progress…');

      const { learningGoals, koreanLevel, levelKey, dailyGoalMinutes, displayName, country, nativeLanguage } =
        useUserStore.getState();

      const [result, subscription] = await Promise.all([
        syncService.syncOnSignIn(user.id, getSyncableSnapshot()),
        profileService.pullSubscription(user.id),
        // The learner just set these up on this device, so local wins on the
        // first sign-in rather than being overwritten by an empty profile row.
        profileService.push(user.id, {
          displayName,
          country,
          nativeLanguage,
          koreanLevel,
          levelKey,
          learningGoals,
          dailyGoalMinutes,
        }),
      ]);

      if (result.progress) {
        adoptSyncedProgress(result.progress);
      }
      if (subscription) {
        setSubscription(subscription);
      }

      setSyncingMessage(null);
      router.replace('/(tabs)');
    },
    [signIn, setSubscription, getSyncableSnapshot, adoptSyncedProgress, router],
  );

  return { syncingMessage, completeSignIn };
}
