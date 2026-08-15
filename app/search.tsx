import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText, EmptyState, Screen, Tag } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { searchEverything, type SearchResultKind } from '@/services/search';

const KIND_LABEL: Record<SearchResultKind, string> = {
  lesson: 'LESSON',
  vocabulary: 'WORD',
  phrase: 'PHRASE',
};

const KIND_COLOR: Record<SearchResultKind, string> = {
  lesson: colors.primary,
  vocabulary: colors.success,
  phrase: colors.accent,
};

const SUGGESTIONS = ['coffee', 'hello', 'subway', '주세요', 'thank you'];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchEverything(query), [query]);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close search"
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textSubtle} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search lessons, words, phrases"
            placeholderTextColor={colors.textSubtle}
            style={styles.input}
            autoFocus
            returnKeyType="search"
            accessibilityLabel="Search KoreanGo"
          />
          {query.length > 0 ? (
            <Pressable
              onPress={() => setQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={18} color={colors.textSubtle} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {query.trim().length === 0 ? (
        <View style={styles.suggestions}>
          <AppText variant="micro" color={colors.textMuted}>
            TRY SEARCHING
          </AppText>
          <View style={styles.suggestionRow}>
            {SUGGESTIONS.map((suggestion) => (
              <Pressable
                key={suggestion}
                onPress={() => setQuery(suggestion)}
                accessibilityRole="button"
                accessibilityLabel={`Search for ${suggestion}`}
              >
                <Tag label={suggestion} backgroundColor={colors.surface} />
              </Pressable>
            ))}
          </View>
        </View>
      ) : results.length === 0 ? (
        <EmptyState
          emoji="🔍"
          title={`No results for "${query}"`}
          message="Try a Korean word, an English meaning or a lesson name."
        />
      ) : (
        <View style={styles.results}>
          {results.map((result) => (
            <Pressable
              key={`${result.kind}-${result.id}`}
              onPress={() => router.push(result.href as Href)}
              accessibilityRole="button"
              accessibilityLabel={`${KIND_LABEL[result.kind]}: ${result.title}. ${result.subtitle}`}
              style={({ pressed }) => [styles.result, pressed && styles.pressed]}
            >
              <View style={styles.resultText}>
                <Tag
                  label={KIND_LABEL[result.kind]}
                  color={KIND_COLOR[result.kind]}
                  backgroundColor={colors.background}
                />
                <AppText variant="bodyStrong" style={styles.resultTitle}>
                  {result.title}
                </AppText>
                <AppText variant="caption" color={colors.textMuted} numberOfLines={2}>
                  {result.subtitle}
                </AppText>
                {result.detail ? (
                  <AppText variant="micro" color={colors.textSubtle}>
                    {result.detail}
                  </AppText>
                ) : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.lg },
  back: { width: 36, height: 40, justifyContent: 'center', marginLeft: -spacing.sm },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 50,
  },
  input: { flex: 1, fontSize: 16, color: colors.text },
  suggestions: { paddingTop: spacing.xxl, gap: spacing.md },
  suggestionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  results: { paddingTop: spacing.xl, gap: spacing.md },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  resultText: { flex: 1, gap: spacing.xs, alignItems: 'flex-start' },
  resultTitle: { marginTop: 2 },
  pressed: { opacity: 0.9 },
});
