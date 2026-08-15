import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  AudioButton,
  Card,
  ErrorState,
  LoadingState,
  ProgressBar,
  Screen,
} from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { contentService } from '@/services/content';
import { useUserStore } from '@/store/useUserStore';

export default function ListeningPracticeScreen() {
  const router = useRouter();
  const koreanLevel = useUserStore((state) => state.koreanLevel);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const loader = useCallback(
    () => contentService.listVocabulary({ level: koreanLevel, limit: 12 }),
    [koreanLevel],
  );

  const { data, loading, error, reload } = useAsyncData(loader);

  if (loading) {
    return (
      <Screen scroll={false}>
        <LoadingState label="Loading audio…" />
      </Screen>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <Screen scroll={false}>
        <ErrorState onRetry={reload} />
      </Screen>
    );
  }

  const word = data[Math.min(index, data.length - 1)];
  const isLast = index >= data.length - 1;

  return (
    <Screen
      footer={
        <View style={styles.footer}>
          {!revealed ? (
            <AppButton label="Show Answer" size="lg" onPress={() => setRevealed(true)} />
          ) : (
            <AppButton
              label={isLast ? 'Finish' : 'Next'}
              size="lg"
              onPress={() => {
                if (isLast) {
                  router.back();
                  return;
                }
                setIndex(index + 1);
                setRevealed(false);
              }}
            />
          )}
        </View>
      }
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="micro" color={colors.textMuted}>
          {index + 1} / {data.length}
        </AppText>
      </View>

      <ProgressBar ratio={(index + 1) / data.length} />

      <Card style={styles.card}>
        <AppText variant="micro" color={colors.primary}>
          LISTEN AND GUESS
        </AppText>

        <View style={styles.audioRow}>
          <AudioButton text={word.korean} label="Play" />
          <AudioButton text={word.korean} label="Slow" slow />
        </View>

        {revealed ? (
          <View style={styles.answer}>
            <AppText variant="korean" center>
              {word.korean}
            </AppText>
            <AppText variant="caption" color={colors.textMuted} center>
              {word.romanization}
            </AppText>
            <AppText variant="subheading" center>
              {word.english}
            </AppText>
          </View>
        ) : (
          <AppText variant="body" color={colors.textMuted} center style={styles.hint}>
            Play the audio and say what you hear before revealing it.
          </AppText>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  back: { width: 40, height: 40, justifyContent: 'center', marginLeft: -spacing.sm },
  card: { marginTop: spacing.xl, gap: spacing.lg, alignItems: 'center' },
  audioRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  answer: { gap: spacing.xs, marginTop: spacing.lg, alignSelf: 'stretch' },
  hint: { marginTop: spacing.lg, maxWidth: 260 },
  footer: { gap: spacing.md },
});
