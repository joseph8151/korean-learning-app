import { useEffect } from 'react';

import { notificationService } from '@/services/notifications';
import { useUserStore } from '@/store/useUserStore';

/**
 * Local notifications do not survive an app reinstall or an OS reboot on every
 * device, so the reminder is re-registered once per launch from the settings
 * the learner already chose. Scheduling is idempotent — it cancels the
 * previous entry first.
 */
export function useDailyReminder(): void {
  const hydrated = useUserStore((state) => state.hydrated);
  const onboardingCompleted = useUserStore((state) => state.onboardingCompleted);
  const notifications = useUserStore((state) => state.notifications);

  useEffect(() => {
    if (!hydrated || !onboardingCompleted) return;
    void notificationService.scheduleDailyReminder(notifications);
  }, [hydrated, onboardingCompleted, notifications]);
}
