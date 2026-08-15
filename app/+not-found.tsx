import { useRouter } from 'expo-router';

import { EmptyState, Screen } from '@/components/ui';

/** Catches deep links and internal routes that no longer exist. */
export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <Screen scroll={false}>
      <EmptyState
        emoji="🧭"
        title="This page moved"
        message="We couldn't find that screen. Let's get you back to your Korean."
        actionLabel="Go Home"
        onAction={() => router.replace('/(tabs)')}
      />
    </Screen>
  );
}
