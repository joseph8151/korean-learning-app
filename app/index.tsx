import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { BrandMark } from '@/components/BrandMark';
import { colors } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

/** Bootstrap route: shows the branded splash until persisted state is ready. */
export default function Index() {
  const hydrated = useUserStore((state) => state.hydrated);
  const onboardingCompleted = useUserStore((state) => state.onboardingCompleted);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary }}>
        <BrandMark />
      </View>
    );
  }

  return <Redirect href={onboardingCompleted ? '/(tabs)' : '/(onboarding)/welcome'} />;
}
