import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { VocabularyCard } from '@/components/VocabularyCard';
import { AppText, EmptyState, ErrorState, LoadingState, Screen } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { dueVocabularyIds } from '@/lib/spacedReview';
import { contentService } from '@/services/content';
import { useProgressStore } from '@/store/useProgressStore';

export default function ReviewMistakesScreen() {
  const router = useRouter();

  const mistakeIds = useProgressStore((state) => state.mistakeVocabularyIds);
  const vocabularyProgress = useProgressStore((state) => state.vocabulary);
  const savedWordIds = useProgressStore((state) => state.savedWordIds);
  const toggleSavedWord = useProgressStore((state) => state.toggleSavedWord);
  const recordVocabularyReview = useProgressStore((state) => state.recordVocabularyReview);
  const clearMistake = useProgressStore((state) => state.clearMistake);

  const idsKey = useMemo(() => {
    const ids = new Set([...mistakeIds, ...dueVocabularyIds(vocabularyProgress)]);
    return [...ids].join(',');
  }, [mistakeIds, vocabularyProgress]);

  const loader = useCallback(
    () => contentService.getVocabularyById(idsKey ? idsKey.split(',') : []),
    [idsKey],
  );
  const { data, loading, error, reload } = useAsyncData(loader);

  if (loading) {
    return (
      <Screen scroll={false}>
        <LoadingState label="Finding what needs review…" />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen scroll={false}>
        <ErrorState onRetry={reload} />
      </Screen>
    );
  }

  return (
    <Screen>
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
        <AppText variant="heading">Review Mistakes</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          Words you missed, plus anything due for spaced review.
        </AppText>
      </View>

      {!data || data.length === 0 ? (
        <EmptyState
          emoji="✨"
          title="Nothing to review"
          message="You're all caught up. Finish a lesson and anything tricky shows up here."
          actionLabel="Go to Learn"
          onAction={() => router.replace('/(tabs)/learn')}
        />
      ) : (
        <View style={styles.list}>
          {data.map((word) => (
            <VocabularyCard
              key={word.id}
              word={word}
              saved={savedWordIds.includes(word.id)}
              onToggleSave={() => toggleSavedWord(word.id)}
              onKnowIt={() => {
                recordVocabularyReview(word.id, true);
                clearMistake(word.id);
              }}
              onReviewAgain={() => recordVocabularyReview(word.id, false)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, gap: spacing.xs },
  back: { width: 40, height: 40, justifyContent: 'center', marginLeft: -spacing.sm },
  list: { gap: spacing.lg, paddingTop: spacing.xl },
});
