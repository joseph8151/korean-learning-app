import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { DailyKoreanCard } from '@/features/home/DailyKoreanCard';
import { AppText, Card, ErrorState, LoadingState, Screen, Tag } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { audioService } from '@/services/audio';
import { contentService } from '@/services/content';
import { useProgressStore } from '@/store/useProgressStore';
import type { DailyPhraseCategory } from '@/types/content';

const CATEGORIES: (DailyPhraseCategory | 'all')[] = [
  'all',
  'friends',
  'dating',
  'travel',
  'food',
  'work',
  'slang',
  'culture',
];

export default function DailyKoreanScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<DailyPhraseCategory | 'all'>('all');

  const savedPhraseIds = useProgressStore((state) => state.savedPhraseIds);
  const toggleSavedPhrase = useProgressStore((state) => state.toggleSavedPhrase);

  const loader = useCallback(async () => {
    const [today, all] = await Promise.all([
      contentService.getTodaysPhrase(),
      contentService.listDailyPhrases(),
    ]);
    return { today, all };
  }, []);

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

  const filtered =
    category === 'all' ? data.all : data.all.filter((phrase) => phrase.category === category);

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
        <AppText variant="heading">Daily Korean</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          One phrase a day that people actually say.
        </AppText>
      </View>

      <View style={styles.todayCard}>
        <DailyKoreanCard
          phrase={data.today}
          saved={savedPhraseIds.includes(data.today.id)}
          onToggleSave={() => toggleSavedPhrase(data.today.id)}
        />
      </View>

      <View style={styles.filters}>
        {CATEGORIES.map((item) => (
          <Pressable
            key={item}
            onPress={() => setCategory(item)}
            accessibilityRole="button"
            accessibilityState={{ selected: category === item }}
            accessibilityLabel={`Filter by ${item}`}
          >
            <Tag
              label={item.toUpperCase()}
              color={category === item ? colors.white : colors.textMuted}
              backgroundColor={category === item ? colors.primary : colors.surface}
            />
          </Pressable>
        ))}
      </View>

      <View style={styles.list}>
        {filtered.map((phrase) => (
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
                  accessibilityLabel={
                    savedPhraseIds.includes(phrase.id) ? 'Remove from saved' : 'Save phrase'
                  }
                  accessibilityState={{ selected: savedPhraseIds.includes(phrase.id) }}
                  hitSlop={8}
                  style={styles.action}
                >
                  <Ionicons
                    name={savedPhraseIds.includes(phrase.id) ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={savedPhraseIds.includes(phrase.id) ? colors.accentDeep : colors.textSubtle}
                  />
                </Pressable>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, gap: spacing.xs },
  back: { width: 40, height: 40, justifyContent: 'center', marginLeft: -spacing.sm },
  todayCard: { marginTop: spacing.xl },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xxl },
  list: { gap: spacing.md, marginTop: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  text: { flex: 1, gap: 2 },
  english: { marginTop: spacing.xs },
  actions: { flexDirection: 'row', gap: spacing.sm },
  action: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
