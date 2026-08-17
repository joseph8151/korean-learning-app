import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from './AppText';

export type QuizOptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'revealed';

export interface QuizOptionProps {
  label: string;
  state: QuizOptionState;
  onPress: () => void;
  disabled?: boolean;
  index: number;
}

// `mark` is what the tick / retry glyph is drawn in. The bright brand colours
// sit at roughly 2:1 against their own soft backgrounds, which is invisible for
// a 16px glyph, so the deep variants carry the icon.
const stateStyles: Record<
  QuizOptionState,
  { border: string; background: string; text: string; mark: string }
> = {
  idle: {
    border: colors.border,
    background: colors.surface,
    text: colors.text,
    mark: colors.textSubtle,
  },
  selected: {
    border: colors.primary,
    background: colors.primarySoft,
    text: colors.text,
    mark: colors.primaryDeep,
  },
  correct: {
    border: colors.successDeep,
    background: colors.successSoft,
    text: colors.text,
    mark: colors.successDeep,
  },
  wrong: {
    border: colors.warningDeep,
    background: colors.warningSoft,
    text: colors.text,
    mark: colors.warningDeep,
  },
  revealed: {
    border: colors.successDeep,
    background: colors.successSoft,
    text: colors.text,
    mark: colors.successDeep,
  },
};

/**
 * Correctness is communicated with an icon and a text label as well as colour,
 * so the answer state is never colour-only.
 */
export function QuizOption({ label, state, onPress, disabled = false, index }: QuizOptionProps) {
  const palette = stateStyles[state];
  const showCorrect = state === 'correct' || state === 'revealed';
  const showWrong = state === 'wrong';

  const statusLabel = showCorrect ? 'Correct' : showWrong ? 'Not quite' : undefined;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected: state !== 'idle', disabled }}
      accessibilityLabel={statusLabel ? `${label}. ${statusLabel}` : label}
      style={({ pressed }) => [
        styles.option,
        { borderColor: palette.border, backgroundColor: palette.background },
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={[styles.marker, { borderColor: palette.border }]}>
        {showCorrect ? (
          <Ionicons name="checkmark" size={16} color={palette.mark} />
        ) : showWrong ? (
          <Ionicons name="close" size={16} color={palette.mark} />
        ) : (
          <AppText variant="micro" color={palette.mark}>
            {String.fromCharCode(65 + index)}
          </AppText>
        )}
      </View>

      <AppText variant="body" color={palette.text} style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 64,
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
