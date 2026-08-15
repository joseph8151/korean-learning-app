import { useRouter } from 'expo-router';

import { SettingsScreen } from '@/components/SettingsScreen';
import { AppButton, SelectableChip } from '@/components/ui';
import { LEARNING_GOAL_OPTIONS } from '@/constants/app';
import { useUserStore } from '@/store/useUserStore';
import type { LearningGoal } from '@/types/content';

export default function GoalsSettingsScreen() {
  const router = useRouter();
  const learningGoals = useUserStore((state) => state.learningGoals);
  const toggleLearningGoal = useUserStore((state) => state.toggleLearningGoal);

  return (
    <SettingsScreen
      title="Learning Goal"
      subtitle="We use this to pick which lessons to show first."
      footer={<AppButton label="Done" onPress={() => router.back()} />}
    >
      {LEARNING_GOAL_OPTIONS.map((option) => (
        <SelectableChip
          key={option.id}
          label={option.label}
          emoji={option.emoji}
          selected={learningGoals.includes(option.id as LearningGoal)}
          onPress={() => toggleLearningGoal(option.id as LearningGoal)}
        />
      ))}
    </SettingsScreen>
  );
}
