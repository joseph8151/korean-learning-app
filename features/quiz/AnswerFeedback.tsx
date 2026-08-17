import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';

const CORRECT_MESSAGES = ['Correct!', 'Nice!', 'Great job!', '잘했어요!'];
const WRONG_MESSAGES = ['Almost!', 'Try again.', 'Not quite — you got this.'];

export interface AnswerFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  seed: number;
}

/** Lightweight fade/slide only — no heavy animation work on the JS thread. */
export function AnswerFeedback({ isCorrect, correctAnswer, seed }: AnswerFeedbackProps) {
  const [value] = useState(() => new Animated.Value(0));

  useEffect(() => {
    value.setValue(0);
    Animated.spring(value, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
  }, [seed, value]);

  const messages = isCorrect ? CORRECT_MESSAGES : WRONG_MESSAGES;
  const message = messages[seed % messages.length];

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={[
        styles.root,
        { backgroundColor: isCorrect ? colors.successSoft : colors.warningSoft },
        {
          opacity: value,
          transform: [{ translateY: value.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
        },
      ]}
    >
      <AppText variant="heading">{isCorrect ? '🎉' : '💪'}</AppText>

      <View style={styles.text}>
        <AppText variant="bodyStrong" color={isCorrect ? colors.successDeep : colors.warningDeep}>
          {message}
        </AppText>
        {!isCorrect ? (
          <AppText variant="caption" color={colors.textMuted}>
            Answer: {correctAnswer}
          </AppText>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  text: { flex: 1, gap: 2 },
});
