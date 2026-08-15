import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, EmptyState, Screen } from '@/components/ui';
import { CULTURE_ARTICLES } from '@/constants/content';
import { colors, spacing } from '@/constants/theme';

export default function CultureArticleScreen() {
  const router = useRouter();
  const { articleId } = useLocalSearchParams<{ articleId: string }>();
  const article = CULTURE_ARTICLES.find((item) => item.id === articleId) ?? null;

  if (!article) {
    return (
      <Screen scroll={false}>
        <EmptyState
          title="Article not found"
          message="This story may have moved."
          actionLabel="Back to Culture"
          onAction={() => router.replace('/culture')}
        />
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
      </View>

      <AppText style={styles.emoji}>{article.emoji}</AppText>
      <AppText variant="title">{article.title}</AppText>
      <AppText variant="body" color={colors.textMuted} style={styles.subtitle}>
        {article.subtitle}
      </AppText>
      <AppText variant="micro" color={colors.textSubtle}>
        {article.readMinutes} min read
      </AppText>

      <View style={styles.body}>
        {article.sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <AppText variant="subheading">{section.heading}</AppText>
            <AppText variant="body" color={colors.textMuted} style={styles.paragraph}>
              {section.body}
            </AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg },
  back: { width: 40, height: 40, justifyContent: 'center', marginLeft: -spacing.sm },
  emoji: { fontSize: 44, lineHeight: 54, marginTop: spacing.md },
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.xs },
  body: { marginTop: spacing.xxl, gap: spacing.xl },
  section: { gap: spacing.sm },
  paragraph: { lineHeight: 26 },
});
