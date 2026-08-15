import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, PremiumBadge, Screen, SectionHeader } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { usePremiumGate } from '@/hooks/usePremium';
import { useProgressStore } from '@/store/useProgressStore';

interface PracticeItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  href: Href;
  premium: boolean;
}

const ITEMS: PracticeItem[] = [
  { id: 'vocabulary', title: 'Vocabulary', description: 'Flip cards and lock in new words.', icon: 'library', tint: colors.primarySoft, href: '/practice/vocabulary', premium: false },
  { id: 'quick-quiz', title: 'Quick Quiz', description: 'Ten questions, two minutes.', icon: 'flash', tint: colors.secondarySoft, href: '/practice/quick-quiz', premium: false },
  { id: 'listening', title: 'Listening', description: 'Train your ear on real phrases.', icon: 'headset', tint: colors.accentSoft, href: '/practice/listening', premium: false },
  { id: 'speaking', title: 'Speaking', description: 'Say it out loud and compare.', icon: 'mic', tint: colors.successSoft, href: '/practice/speaking', premium: true },
  { id: 'ai-chat', title: 'AI Korean Partner', description: 'Practise real situations by chat.', icon: 'chatbubbles', tint: colors.primarySoft, href: '/practice/ai-chat', premium: false },
  { id: 'grammar', title: 'Grammar', description: 'The patterns behind the sentences.', icon: 'construct', tint: colors.warningSoft, href: '/practice/grammar', premium: true },
  { id: 'review', title: 'Review Mistakes', description: 'Fix what you got wrong.', icon: 'refresh', tint: colors.accentSoft, href: '/practice/review', premium: false },
  { id: 'saved', title: 'Saved', description: 'Words and phrases you bookmarked.', icon: 'bookmark', tint: colors.successSoft, href: '/practice/saved', premium: false },
];

export default function PracticeScreen() {
  const router = useRouter();
  const { isPremium, guard } = usePremiumGate();

  const mistakeCount = useProgressStore((state) => state.mistakeVocabularyIds.length);
  const savedWordCount = useProgressStore((state) => state.savedWordIds.length);
  const savedPhraseCount = useProgressStore((state) => state.savedPhraseIds.length);

  const countFor = (id: string) => {
    if (id === 'review') return mistakeCount;
    if (id === 'saved') return savedWordCount + savedPhraseCount;
    return null;
  };

  return (
    <Screen>
      <View style={styles.header}>
        <SectionHeader title="Practice" subtitle="Short drills that make it stick." />
      </View>

      <View style={styles.grid}>
        {ITEMS.map((item) => {
          const locked = item.premium && !isPremium;
          const count = countFor(item.id);

          return (
            <Pressable
              key={item.id}
              onPress={() => guard(item.premium, () => router.push(item.href))}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}. ${item.description}${locked ? ' Premium.' : ''}`}
              style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
            >
              <View style={[styles.iconBox, { backgroundColor: item.tint }]}>
                <Ionicons
                  name={locked ? 'lock-closed' : item.icon}
                  size={22}
                  color={locked ? colors.textSubtle : colors.text}
                />
              </View>

              <View style={styles.tileText}>
                <View style={styles.titleRow}>
                  <AppText variant="bodyStrong" style={styles.tileTitle}>
                    {item.title}
                  </AppText>
                  {locked ? <PremiumBadge label="PRO" /> : null}
                </View>
                <AppText variant="caption" color={colors.textMuted}>
                  {item.description}
                </AppText>
              </View>

              {count && count > 0 ? (
                <View style={styles.count}>
                  <AppText variant="micro" color={colors.white}>
                    {count}
                  </AppText>
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
              )}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg },
  grid: { gap: spacing.md, paddingTop: spacing.xl },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    minHeight: 76,
  },
  pressed: { opacity: 0.9 },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  tileTitle: { flexShrink: 1 },
  count: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 6,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
