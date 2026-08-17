import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton, AppText, Screen, SelectableChip } from '@/components/ui';
import { DAILY_GOAL_OPTIONS, DEFAULT_DAILY_GOAL_MINUTES } from '@/constants/app';
import { colors, spacing } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';
import type { DailyGoalMinutes } from '@/types/user';

const DESCRIPTIONS: Record<number, string> = {
  5: 'Casual — one phrase a day.',
  10: 'Recommended — a real habit.',
  15: 'Serious — steady progress.',
  20: 'Intense — fast improvement.',
  30: 'All in — conversation ready sooner.',
};

export default function DailyGoalScreen() {
  const router = useRouter();
  const setDailyGoal = useUserStore((state) => state.setDailyGoal);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  const [selected, setSelected] = useState<DailyGoalMinutes>(DEFAULT_DAILY_GOAL_MINUTES);

  const handleFinish = () => {
    setDailyGoal(selected);
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <Screen
      footer={
        <AppButton
          label="Start Learning"
          size="lg"
          onPress={handleFinish}
          accessibilityHint="Finishes setup and opens your home screen"
        />
      }
    >
      <View style={styles.header}>
        <AppText variant="micro" color={colors.primaryDark}>
          STEP 3 OF 3
        </AppText>
        <AppText variant="title" style={styles.title}>
          How much time each day?
        </AppText>
        <AppText variant="body" color={colors.textMuted}>
          Small and consistent beats long and rare.
        </AppText>
      </View>

      <View style={styles.list}>
        {DAILY_GOAL_OPTIONS.map((minutes) => (
          <SelectableChip
            key={minutes}
            label={`${minutes} min`}
            description={DESCRIPTIONS[minutes]}
            selected={selected === minutes}
            onPress={() => setSelected(minutes)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.xl, gap: spacing.sm },
  title: { marginTop: spacing.xs },
  list: { gap: spacing.md, paddingTop: spacing.xl },
});
