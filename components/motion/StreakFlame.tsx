import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { useReduceMotion } from './Reveal';

export interface StreakFlameProps {
  /** A dead streak does not flicker. */
  active: boolean;
  size?: number;
}

/**
 * The streak flame, breathing. A slow asymmetric pulse — quick flare, slow
 * settle — reads as a flame rather than a throbbing dot.
 *
 * Deliberately subtle and slow: this sits on the home screen permanently, and
 * anything faster becomes an irritation within a day.
 */
export function StreakFlame({ active, size = 15 }: StreakFlameProps) {
  const pulse = useSharedValue(0);
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (!active || reduceMotion) {
      pulse.value = 0;
      return;
    }

    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 620, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 1180, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [active, reduceMotion, pulse]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 + pulse.value * 0.16 },
      { rotate: `${(pulse.value - 0.5) * 5}deg` },
    ],
  }));

  return (
    <Animated.View style={style}>
      <AppText style={[styles.flame, { fontSize: size, lineHeight: size + 4 }]}>
        {active ? '🔥' : '·'}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flame: { textAlign: 'center' },
});
