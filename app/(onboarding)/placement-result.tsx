import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton, AppText, Card, Screen } from '@/components/ui';
import { LEVEL_BLURBS } from '@/constants/app';
import { colors, radius, spacing } from '@/constants/theme';

export default function PlacementResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string; correct?: string; total?: string }>();

  const level = Number(params.level ?? '1');
  const correct = Number(params.correct ?? '0');
  const total = Number(params.total ?? '0');

  return (
    <Screen
      footer={
        <AppButton
          label="Start Learning"
          size="lg"
          onPress={() => router.replace('/(onboarding)/daily-goal')}
        />
      }
    >
      <View style={styles.content}>
        <AppText style={styles.emoji}>🎉</AppText>

        <AppText variant="caption" color={colors.textMuted} center>
          Your Korean Level
        </AppText>

        <View style={styles.levelBadge}>
          <AppText variant="display" color={colors.white}>
            LEVEL {level}
          </AppText>
        </View>

        <AppText variant="subheading" center style={styles.blurb}>
          {LEVEL_BLURBS[level] ?? LEVEL_BLURBS[1]}
        </AppText>

        <Card style={styles.scoreCard}>
          <AppText variant="caption" color={colors.textMuted} center>
            You answered
          </AppText>
          <AppText variant="title" center>
            {correct} / {total}
          </AppText>
          <AppText variant="caption" color={colors.textMuted} center>
            We&apos;ll start you at the right difficulty and adjust as you go.
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emoji: { fontSize: 64, lineHeight: 76 },
  levelBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
    marginVertical: spacing.sm,
  },
  blurb: { maxWidth: 300, marginBottom: spacing.lg },
  scoreCard: { alignSelf: 'stretch', gap: spacing.xs },
});
