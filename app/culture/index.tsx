import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, PremiumBadge, Screen } from '@/components/ui';
import { CULTURE_ARTICLES } from '@/constants/content';
import { colors, radius, spacing } from '@/constants/theme';
import { usePremiumGate } from '@/hooks/usePremium';

export default function CultureListScreen() {
  const router = useRouter();
  const { isPremium, guard } = usePremiumGate();

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
        <AppText variant="heading">Korean Culture</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          The context behind the language. Two minutes each.
        </AppText>
      </View>

      <View style={styles.list}>
        {CULTURE_ARTICLES.map((article) => {
          const locked = article.isPremium && !isPremium;
          return (
            <Card
              key={article.id}
              onPress={() => guard(article.isPremium, () => router.push(`/culture/${article.id}`))}
              accessibilityLabel={`${article.title}. ${article.subtitle}. ${article.readMinutes} minute read.${
                locked ? ' Premium.' : ''
              }`}
              accessibilityHint="Opens the article"
            >
              <View style={styles.row}>
                <View style={styles.emojiBox}>
                  <AppText variant="heading">{article.emoji}</AppText>
                </View>

                <View style={styles.text}>
                  <View style={styles.titleRow}>
                    <AppText variant="bodyStrong" style={styles.title}>
                      {article.title}
                    </AppText>
                    {locked ? <PremiumBadge label="PRO" /> : null}
                  </View>
                  <AppText variant="caption" color={colors.textMuted}>
                    {article.subtitle}
                  </AppText>
                  <AppText variant="micro" color={colors.textSubtle} style={styles.meta}>
                    {article.readMinutes} min read
                  </AppText>
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, gap: spacing.xs },
  back: { width: 40, height: 40, justifyContent: 'center', marginLeft: -spacing.sm },
  list: { gap: spacing.md, paddingTop: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  emojiBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { flexShrink: 1 },
  meta: { marginTop: spacing.xs },
});
