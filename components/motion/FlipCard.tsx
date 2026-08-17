import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';

import { depth } from '@/constants/theme';
import { useReduceMotion } from './Reveal';

export interface FlipCardProps {
  flipped: boolean;
  onPress: () => void;
  front: ReactNode;
  back: ReactNode;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * A card that turns over in 3D rather than swapping its contents.
 *
 * `perspective` is what makes it read as rotation rather than a horizontal
 * squash — without it the card just narrows and widens. Both faces are always
 * mounted and `backfaceVisibility` hides whichever is turned away, which is
 * also why the back face starts pre-rotated 180°.
 *
 * The two faces are stacked absolutely over a sizing spacer so the container
 * takes the height of the taller face and the card does not resize mid-flip.
 */
export function FlipCard({
  flipped,
  onPress,
  front,
  back,
  style,
  accessibilityLabel,
  accessibilityHint,
}: FlipCardProps) {
  const reduceMotion = useReduceMotion();

  const progress = useDerivedValue(() =>
    withSpring(flipped ? 1 : 0, reduceMotion ? { damping: 100, stiffness: 400 } : depth.spring.bouncy),
  );

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(progress.value, [0, 1], [0, 180])}deg` },
    ],
    opacity: progress.value < 0.5 ? 1 : 0,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(progress.value, [0, 1], [180, 360])}deg` },
    ],
    opacity: progress.value < 0.5 ? 0 : 1,
  }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={style}
    >
      <View>
        {/* Invisible spacer: gives the stack the height of the taller face. */}
        <View style={styles.spacer} pointerEvents="none" accessibilityElementsHidden>
          {flipped ? back : front}
        </View>

        <Animated.View style={[styles.face, frontStyle]}>{front}</Animated.View>
        <Animated.View style={[styles.face, backStyle]}>{back}</Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  spacer: { opacity: 0 },
  face: {
    ...StyleSheet.absoluteFill,
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
  },
});
