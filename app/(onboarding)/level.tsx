import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppButton, AppText, Screen, SelectableChip } from '@/components/ui';
import { LEVEL_OPTIONS } from '@/constants/app';
import { colors, radius, spacing } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';
import type { KoreanLevel, LevelKey } from '@/types/content';

export default function LevelScreen() {
  const router = useRouter();
  const setLevel = useUserStore((state) => state.setLevel);
  const [selected, setSelected] = useState<LevelKey | null>(null);

  const handleContinue = () => {
    const option = LEVEL_OPTIONS.find((item) => item.id === selected);
    if (!option) return;
    setLevel(option.level as KoreanLevel, option.id as LevelKey);
    router.push('/(onboarding)/daily-goal');
  };

  return (
    <Screen
      footer={
        <AppButton
          label="Continue"
          size="lg"
          disabled={!selected}
          onPress={handleContinue}
          accessibilityHint="Saves your Korean level"
        />
      }
    >
      <View style={styles.header}>
        <AppText variant="micro" color={colors.primaryDark}>
          STEP 2 OF 3
        </AppText>
        <AppText variant="title" style={styles.title}>
          What&apos;s your Korean level?
        </AppText>
        <AppText variant="body" color={colors.textMuted}>
          Be honest — you can change this any time.
        </AppText>
      </View>

      <View style={styles.list}>
        {LEVEL_OPTIONS.map((option) => (
          <SelectableChip
            key={option.id}
            label={option.label}
            description={option.description}
            selected={selected === option.id}
            onPress={() => setSelected(option.id as LevelKey)}
          />
        ))}
      </View>

      <Pressable
        onPress={() => router.push('/(onboarding)/placement')}
        accessibilityRole="button"
        accessibilityLabel="Not sure? Take a short placement test"
        style={styles.notSure}
      >
        <AppText variant="bodyStrong" color={colors.primaryDark} center>
          Not Sure?
        </AppText>
        <AppText variant="caption" color={colors.textMuted} center>
          Take a 15-question test and we&apos;ll place you.
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.xl, gap: spacing.sm },
  title: { marginTop: spacing.xs },
  list: { gap: spacing.md, paddingTop: spacing.xl },
  notSure: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    gap: spacing.xs,
  },
});
