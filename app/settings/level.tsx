import { useRouter } from 'expo-router';

import { SettingsScreen } from '@/components/SettingsScreen';
import { AppButton, SelectableChip } from '@/components/ui';
import { LEVEL_OPTIONS } from '@/constants/app';
import { useUserStore } from '@/store/useUserStore';
import type { KoreanLevel, LevelKey } from '@/types/content';

export default function LevelSettingsScreen() {
  const router = useRouter();
  const levelKey = useUserStore((state) => state.levelKey);
  const koreanLevel = useUserStore((state) => state.koreanLevel);
  const setLevel = useUserStore((state) => state.setLevel);

  return (
    <SettingsScreen
      title="Korean Level"
      subtitle="Change this whenever lessons feel too easy or too hard."
      footer={
        <AppButton
          label="Take the Placement Test"
          variant="outline"
          onPress={() => router.push('/(onboarding)/placement')}
        />
      }
    >
      {LEVEL_OPTIONS.map((option) => (
        <SelectableChip
          key={option.id}
          label={option.label}
          description={option.description}
          selected={levelKey ? levelKey === option.id : koreanLevel === option.level}
          onPress={() => {
            setLevel(option.level as KoreanLevel, option.id as LevelKey);
            router.back();
          }}
        />
      ))}
    </SettingsScreen>
  );
}
