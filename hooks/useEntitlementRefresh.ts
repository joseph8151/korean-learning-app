import { useEffect } from 'react';
import { AppState } from 'react-native';

import { profileService } from '@/services/profile';
import { paymentService } from '@/services/payments';
import { useUserStore } from '@/store/useUserStore';

/**
 * Keeps Premium honest.
 *
 * The server is the authority on entitlement — renewals, cancellations and
 * refunds all land there via the Play RTDN webhook. The device re-reads it on
 * launch and whenever the app returns to the foreground, so a lapsed
 * subscription stops unlocking content without waiting for a reinstall.
 */
export function useEntitlementRefresh(): void {
  const hydrated = useUserStore((state) => state.hydrated);
  const userId = useUserStore((state) => state.userId);
  const setSubscription = useUserStore((state) => state.setSubscription);

  useEffect(() => {
    if (!hydrated || !userId) return;

    let cancelled = false;

    const refresh = async () => {
      const subscription = await profileService.pullSubscription(userId);
      if (!cancelled && subscription) setSubscription(subscription);
    };

    void refresh();

    const listener = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh();
    });

    return () => {
      cancelled = true;
      listener.remove();
    };
  }, [hydrated, userId, setSubscription]);

  // Open the billing connection once so the paywall can show live prices
  // immediately instead of after a round trip.
  useEffect(() => {
    if (!paymentService.isAvailable) return;

    void paymentService.initialize();
    return () => {
      void paymentService.dispose();
    };
  }, []);
}
