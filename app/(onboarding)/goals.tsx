import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton, AppText, Screen, SelectableChip } from '@/components/ui';
import { LEARNING_GOAL_OPTIONS } from '@/constants/app';
import { colors, spacing } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';
import type { LearningGoal } from '@/types/content';

export default function GoalsScreen() {
  const router = useRouter();
  const learningGoals = useUserStore((state) => state.learningGoals);
  const toggleLearningGoal = useUserStore((state) => state.toggleLearningGoal);

  return (
    <Screen
      footer={
        <AppButton
          label="Continue"
          size="lg"
          disabled={learningGoals.length === 0}
          onPress={() => router.push('/(onboarding)/level')}
          accessibilityHint="Saves your goals and moves to level selection"
        />
      }
    >
      <View style={styles.header}>
        <AppText variant="micro" color={colors.primary}>
          STEP 1 OF 3
        </AppText>
        <AppText variant="title" style={styles.title}>
          Why are you learning Korean?
        </AppText>
        <AppText variant="body" color={colors.textMuted}>
          Pick everything that fits. We use this to choose your lessons.
        </AppText>
      </View>

      <View style={styles.list}>
        {LEARNING_GOAL_OPTIONS.map((option) => (
          <SelectableChip
            key={option.id}
            label={option.label}
            emoji={option.emoji}
            selected={learningGoals.includes(option.id as LearningGoal)}
            onPress={() => toggleLearningGoal(option.id as LearningGoal)}
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
