import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Bouncy, FlipCard } from '@/components/motion';
import { AppButton, AppText, AudioButton, Card } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
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

  const front = (
    <View style={styles.face}>
      <AppText variant="koreanLarge" center>
        {word.korean}
      </AppText>
      <View style={styles.hintPill}>
        <Ionicons name="sync-outline" size={13} color={colors.primaryDeep} />
        <AppText variant="micro" color={colors.primaryDeep}>
          Tap to flip
        </AppText>
      </View>
    </View>
  );

  const back = (
    <View style={styles.face}>
      <AppText variant="korean" center>
        {word.korean}
      </AppText>
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
  );

  return (
    <Card>
      <FlipCard
        flipped={flipped}
        onPress={() => setFlipped((value) => !value)}
        front={front}
        back={back}
        accessibilityLabel={
          flipped
            ? `${word.korean}. ${word.romanization}. ${word.english}`
            : `${word.korean}. Tap to reveal the meaning.`
        }
        accessibilityHint="Turns the card over"
      />

      <View style={styles.actions}>
        <AudioButton text={word.korean} compact />

        <Bouncy
          onPress={onToggleSave}
          scaleTo={0.88}
          haptic
          accessibilityLabel={saved ? 'Remove from saved words' : 'Save this word'}
          accessibilityState={{ selected: saved }}
          hitSlop={8}
          style={styles.saveButton}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={saved ? colors.accentDeep : colors.textSubtle}
          />
          <AppText variant="caption" color={saved ? colors.accentDeep : colors.textMuted}>
            {saved ? 'Saved' : 'Save'}
          </AppText>
        </Bouncy>
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
  face: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    minHeight: 190,
    justifyContent: 'center',
  },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    marginTop: spacing.sm,
  },
  example: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: spacing.xs,
    alignSelf: 'stretch',
  },
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
