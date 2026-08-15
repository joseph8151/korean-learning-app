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

const stateStyles: Record<QuizOptionState, { border: string; background: string; text: string }> = {
  idle: { border: colors.border, background: colors.surface, text: colors.text },
  selected: { border: colors.primary, background: colors.primarySoft, text: colors.text },
  correct: { border: colors.success, background: colors.successSoft, text: colors.text },
  wrong: { border: colors.warning, background: colors.warningSoft, text: colors.text },
  revealed: { border: colors.success, background: colors.successSoft, text: colors.text },
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
          <Ionicons name="checkmark" size={16} color={colors.success} />
        ) : showWrong ? (
          <Ionicons name="refresh" size={16} color={colors.warning} />
        ) : (
          <AppText variant="micro" color={colors.textSubtle}>
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
    gap: spacing.md,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 60,
  },
  marker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1 },
  pressed: { opacity: 0.85 },
});
