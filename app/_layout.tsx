import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { useDailyReminder } from '@/hooks/useDailyReminder';
import { useProfileSync } from '@/hooks/useProfileSync';
import { useProgressStore } from '@/store/useProgressStore';
import { useUserStore } from '@/store/useUserStore';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const userHydrated = useUserStore((state) => state.hydrated);
  const progressHydrated = useProgressStore((state) => state.hydrated);
  const ready = userHydrated && progressHydrated;

  useDailyReminder();
  useProfileSync();

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [ready]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="lesson/[lessonId]" />
          <Stack.Screen name="paywall" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="auth/sign-in" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="auth/sign-up" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
