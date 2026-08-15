import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { VocabularyCard } from '@/components/VocabularyCard';
import { AppText, Card, EmptyState, ErrorState, LoadingState, Screen } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { audioService } from '@/services/audio';
import { contentService } from '@/services/content';
import { useProgressStore } from '@/store/useProgressStore';
import type { DailyPhrase, Vocabulary } from '@/types/content';

interface SavedData {
  words: Vocabulary[];
  phrases: DailyPhrase[];
}

export default function SavedWordsScreen() {
  const router = useRouter();

  const savedWordIds = useProgressStore((state) => state.savedWordIds);
  const savedPhraseIds = useProgressStore((state) => state.savedPhraseIds);
  const toggleSavedWord = useProgressStore((state) => state.toggleSavedWord);
  const toggleSavedPhrase = useProgressStore((state) => state.toggleSavedPhrase);

  const wordKey = savedWordIds.join(',');
  const phraseKey = savedPhraseIds.join(',');

  const loader = useCallback(async (): Promise<SavedData> => {
    const wantedWords = wordKey ? wordKey.split(',') : [];
    const wantedPhrases = new Set(phraseKey ? phraseKey.split(',') : []);

    const [words, allPhrases] = await Promise.all([
      contentService.getVocabularyById(wantedWords),
      wantedPhrases.size > 0 ? contentService.listDailyPhrases() : Promise.resolve([]),
    ]);

    return { words, phrases: allPhrases.filter((phrase) => wantedPhrases.has(phrase.id)) };
  }, [wordKey, phraseKey]);

  const { data, loading, error, reload } = useAsyncData(loader);

  if (loading) {
    return (
      <Screen scroll={false}>
        <LoadingState />
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

  const total = data.words.length + data.phrases.length;

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
        <AppText variant="heading">Saved</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          {total} saved {total === 1 ? 'item' : 'items'}
        </AppText>
      </View>

      {total === 0 ? (
        <EmptyState
          emoji="🔖"
          title="Nothing saved yet"
          message="Tap the bookmark on any word or daily phrase to keep it here."
          actionLabel="Browse Vocabulary"
          onAction={() => router.replace('/practice/vocabulary')}
        />
      ) : (
        <>
          {data.phrases.length > 0 ? (
            <View style={styles.section}>
              <AppText variant="micro" color={colors.textMuted}>
                SAVED PHRASES
              </AppText>

              {data.phrases.map((phrase) => (
                <Card key={phrase.id}>
                  <View style={styles.row}>
                    <View style={styles.text}>
                      <AppText variant="body">{phrase.korean}</AppText>
                      <AppText variant="micro" color={colors.textSubtle}>
                        {phrase.romanization}
                      </AppText>
                      <AppText variant="caption" color={colors.textMuted} style={styles.english}>
                        {phrase.english}
                      </AppText>
                    </View>

                    <View style={styles.actions}>
                      <Pressable
                        onPress={() => audioService.speakKorean(phrase.korean)}
                        accessibilityRole="button"
                        accessibilityLabel={`Play ${phrase.korean}`}
                        hitSlop={8}
                        style={styles.action}
                      >
                        <Ionicons name="volume-medium-outline" size={20} color={colors.primary} />
                      </Pressable>

                      <Pressable
                        onPress={() => toggleSavedPhrase(phrase.id)}
                        accessibilityRole="button"
                        accessibilityLabel="Remove phrase from saved"
                        accessibilityState={{ selected: true }}
                        hitSlop={8}
                        style={styles.action}
                      >
                        <Ionicons name="bookmark" size={20} color={colors.accent} />
                      </Pressable>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          ) : null}

          {data.words.length > 0 ? (
            <View style={styles.section}>
              <AppText variant="micro" color={colors.textMuted}>
                SAVED WORDS
              </AppText>

              {data.words.map((word) => (
                <VocabularyCard
                  key={word.id}
                  word={word}
                  saved
                  onToggleSave={() => toggleSavedWord(word.id)}
                />
              ))}
            </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, gap: spacing.xs },
  back: { width: 40, height: 40, justifyContent: 'center', marginLeft: -spacing.sm },
  section: { gap: spacing.md, paddingTop: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  text: { flex: 1, gap: 2 },
  english: { marginTop: spacing.xs },
  actions: { flexDirection: 'row', gap: spacing.sm },
  action: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
