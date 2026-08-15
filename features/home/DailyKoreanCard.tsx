import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, AudioButton, Card, Tag } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import type { DailyPhrase } from '@/types/content';

export interface DailyKoreanCardProps {
  phrase: DailyPhrase;
  saved: boolean;
  onToggleSave: () => void;
}

export function DailyKoreanCard({ phrase, saved, onToggleSave }: DailyKoreanCardProps) {
  return (
    <Card>
      <View style={styles.header}>
        <AppText variant="micro" color={colors.accent}>
          DAILY KOREAN
        </AppText>
        <Tag label={phrase.category.toUpperCase()} backgroundColor={colors.accentSoft} color={colors.accent} />
      </View>

      <AppText variant="korean" style={styles.korean}>
        {phrase.korean}
      </AppText>
      <AppText variant="caption" color={colors.textMuted}>
        {phrase.romanization}
      </AppText>
      <AppText variant="body" style={styles.english}>
        {phrase.english}
      </AppText>

      <View style={styles.actions}>
        <AudioButton text={phrase.korean} />

        <Pressable
          onPress={onToggleSave}
          accessibilityRole="button"
          accessibilityLabel={saved ? "Remove today's phrase from saved" : "Save today's phrase"}
          accessibilityState={{ selected: saved }}
          style={styles.save}
          hitSlop={8}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={saved ? colors.accent : colors.textSubtle}
          />
          <AppText variant="caption" color={saved ? colors.accent : colors.textMuted}>
            {saved ? 'Saved' : 'Save'}
          </AppText>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  korean: { marginBottom: spacing.xs },
  english: { marginTop: spacing.sm },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  save: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm },
});
