import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { VocabularyCard } from '@/components/VocabularyCard';
import {
  AppButton,
  AppText,
  EmptyState,
  ErrorState,
  LoadingState,
  ProgressBar,
  Screen,
} from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { contentService } from '@/services/content';
import { useProgressStore } from '@/store/useProgressStore';
import { useUserStore } from '@/store/useUserStore';

export default function VocabularyPracticeScreen() {
  const router = useRouter();
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const koreanLevel = useUserStore((state) => state.koreanLevel);

  const savedWordIds = useProgressStore((state) => state.savedWordIds);
  const toggleSavedWord = useProgressStore((state) => state.toggleSavedWord);
  const recordVocabularyReview = useProgressStore((state) => state.recordVocabularyReview);

  const [index, setIndex] = useState(0);

  const loader = useCallback(async () => {
    const words = await contentService.listVocabulary({ level: koreanLevel, limit: 20 });
    if (!focus) return words;
    const focused = words.filter((word) => word.id === focus);
    const rest = words.filter((word) => word.id !== focus);
    return [...focused, ...rest];
  }, [koreanLevel, focus]);

  const { data, loading, error, reload } = useAsyncData(loader);

  if (loading) {
    return (
      <Screen scroll={false}>
        <LoadingState label="Shuffling your words…" />
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen scroll={false}>
        <ErrorState onRetry={reload} />
      </Screen>
    );
  }

  if (data.length === 0) {
    return (
      <Screen scroll={false}>
        <EmptyState
          title="No words yet"
          message="Finish a lesson and your vocabulary will show up here."
          actionLabel="Go to Learn"
          onAction={() => router.replace('/(tabs)/learn')}
        />
      </Screen>
    );
  }

  const word = data[Math.min(index, data.length - 1)];
  const isLast = index >= data.length - 1;

  const advance = () => {
    if (isLast) {
      router.back();
      return;
    }
    setIndex(index + 1);
  };

  return (
    <Screen
      footer={
        <AppButton
          label={isLast ? 'Finish' : 'Next Word'}
          size="lg"
          onPress={advance}
        />
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

      <ProgressBar
        ratio={(index + 1) / data.length}
        accessibilityLabel={`Card ${index + 1} of ${data.length}`}
      />

      <View style={styles.card}>
        <VocabularyCard
          word={word}
          saved={savedWordIds.includes(word.id)}
          onToggleSave={() => toggleSavedWord(word.id)}
          onKnowIt={() => {
            recordVocabularyReview(word.id, true);
            advance();
          }}
          onReviewAgain={() => {
            recordVocabularyReview(word.id, false);
            advance();
          }}
        />
      </View>
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
  card: { marginTop: spacing.xl },
});
