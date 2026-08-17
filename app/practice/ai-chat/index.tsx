import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, PremiumBadge, Screen } from '@/components/ui';
import { CHAT_SITUATIONS } from '@/constants/content';
import { colors, radius, spacing } from '@/constants/theme';
import { usePremiumGate } from '@/hooks/usePremium';
import { aiProvider } from '@/services/ai';

export default function AIChatSituationsScreen() {
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
        <AppText variant="heading">AI Korean Partner</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          Choose a situation and start talking. No judgement, no pressure.
        </AppText>
      </View>

      {aiProvider.isMock ? (
        <Card style={styles.notice}>
          <AppText variant="micro" color={colors.warningDeep}>
            PRACTICE MODE
          </AppText>
          <AppText variant="caption" color={colors.textMuted}>
            Conversations follow a guided script for now. Live AI responses arrive in a
            future update.
          </AppText>
        </Card>
      ) : null}

      <View style={styles.grid}>
        {CHAT_SITUATIONS.map((situation) => {
          const locked = situation.isPremium && !isPremium;
          return (
            <Pressable
              key={situation.id}
              onPress={() =>
                guard(situation.isPremium, () => router.push(`/practice/ai-chat/${situation.id}`))
              }
              accessibilityRole="button"
              accessibilityLabel={`${situation.title}. ${situation.description}${
                locked ? ' Premium.' : ''
              }`}
              style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
            >
              <AppText variant="title">{situation.emoji}</AppText>
              <View style={styles.tileTitleRow}>
                <AppText variant="bodyStrong" style={styles.tileTitle}>
                  {situation.title}
                </AppText>
                {locked ? <PremiumBadge label="PRO" /> : null}
              </View>
              <AppText variant="micro" color={colors.textMuted} numberOfLines={2}>
                {situation.description}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, gap: spacing.xs },
  back: { width: 40, height: 40, justifyContent: 'center', marginLeft: -spacing.sm },
  notice: { marginTop: spacing.xl, gap: spacing.xs, backgroundColor: colors.warningSoft },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingTop: spacing.xl },
  tile: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
    minHeight: 132,
  },
  tileTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  tileTitle: { flexShrink: 1 },
  pressed: { opacity: 0.9 },
});
