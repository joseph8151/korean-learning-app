import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { selectIsPremium, useUserStore } from '@/store/useUserStore';

export function useIsPremium(): boolean {
  return useUserStore(selectIsPremium);
}

/**
 * Returns a guard that routes locked content to the paywall instead of
 * opening it, keeping premium checks out of individual screens.
 */
export function usePremiumGate() {
  const router = useRouter();
  const isPremium = useIsPremium();

  const guard = useCallback(
    (isPremiumContent: boolean, onAllowed: () => void) => {
      if (isPremiumContent && !isPremium) {
        router.push('/paywall');
        return;
      }
      onAllowed();
    },
    [isPremium, router],
  );

  return { isPremium, guard };
}
