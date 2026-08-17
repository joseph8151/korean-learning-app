import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppButton, AppText, AudioButton, Card } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import type { Vocabulary } from '@/types/content';

export interface VocabularyCardProps {
  word: Vocabulary;
  saved: boolean;
  onToggleSave: () => void;
  onKnowIt?: () => void;
  onReviewAgain?: () => void;
}

/** Tap-to-flip card: Korean on the front, meaning and example on the back. */
export function VocabularyCard({
  word,
  saved,
  onToggleSave,
  onKnowIt,
  onReviewAgain,
}: VocabularyCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Card>
      <Pressable
        onPress={() => setFlipped((value) => !value)}
        accessibilityRole="button"
        accessibilityLabel={
          flipped
            ? `${word.korean}. ${word.romanization}. ${word.english}`
            : `${word.korean}. Tap to reveal the meaning.`
        }
        style={styles.face}
      >
        <AppText variant="koreanLarge" center>
          {word.korean}
        </AppText>

        {flipped ? (
          <View style={styles.back}>
            <AppText variant="body" color={colors.textMuted} center>
              {word.romanization}
            </AppText>
            <AppText variant="subheading" center>
              {word.english}
            </AppText>

            {word.exampleKorean ? (
              <View style={styles.example}>
                <AppText variant="body" center>
                  {word.exampleKorean}
                </AppText>
                <AppText variant="caption" color={colors.textMuted} center>
                  {word.exampleEnglish}
                </AppText>
              </View>
            ) : null}
          </View>
        ) : (
          <AppText variant="caption" color={colors.textSubtle} center style={styles.hint}>
            Tap to flip
          </AppText>
        )}
      </Pressable>

      <View style={styles.actions}>
        <AudioButton text={word.korean} compact />

        <Pressable
          onPress={onToggleSave}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove from saved words' : 'Save this word'}
          accessibilityState={{ selected: saved }}
          style={styles.saveButton}
          hitSlop={8}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={saved ? colors.accentDeep : colors.textSubtle}
          />
          <AppText variant="caption" color={saved ? colors.accentDeep : colors.textMuted}>
            {saved ? 'Saved' : 'Save'}
          </AppText>
        </Pressable>
      </View>

      {onKnowIt && onReviewAgain ? (
        <View style={styles.reviewActions}>
          <AppButton
            label="Review Again"
            variant="outline"
            size="sm"
            onPress={onReviewAgain}
            style={styles.reviewButton}
          />
          <AppButton label="Know It" size="sm" onPress={onKnowIt} style={styles.reviewButton} />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  face: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  back: { gap: spacing.xs, alignItems: 'center' },
  example: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: spacing.xs,
    alignSelf: 'stretch',
  },
  hint: { marginTop: spacing.sm },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  saveButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm },
  reviewActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  reviewButton: { flex: 1 },
});
