import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { VocabularyCard } from '@/components/VocabularyCard';
import { AppText, EmptyState, ErrorState, LoadingState, Screen } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { contentService } from '@/services/content';
import { useProgressStore } from '@/store/useProgressStore';

export default function SavedWordsScreen() {
  const router = useRouter();
  const savedWordIds = useProgressStore((state) => state.savedWordIds);
  const toggleSavedWord = useProgressStore((state) => state.toggleSavedWord);

  const key = savedWordIds.join(',');
  const loader = useCallback(
    () => contentService.getVocabularyById(key ? key.split(',') : []),
    [key],
  );
  const { data, loading, error, reload } = useAsyncData(loader);

  if (loading) {
    return (
      <Screen scroll={false}>
        <LoadingState />
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
        <AppText variant="heading">Saved Words</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          {savedWordIds.length} saved
        </AppText>
      </View>

      {!data || data.length === 0 ? (
        <EmptyState
          emoji="🔖"
          title="Nothing saved yet"
          message="Tap the bookmark on any word or daily phrase to keep it here."
          actionLabel="Browse Vocabulary"
          onAction={() => router.replace('/practice/vocabulary')}
        />
      ) : (
        <View style={styles.list}>
          {data.map((word) => (
            <VocabularyCard
              key={word.id}
              word={word}
              saved
              onToggleSave={() => toggleSavedWord(word.id)}
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
