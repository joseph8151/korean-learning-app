import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { colors, radius, seoulLines } from '@/constants/theme';
import { useReduceMotion } from './Reveal';

const PALETTE = [
  colors.primary,
  colors.secondary,
  colors.accent,
  colors.success,
  seoulLines.line4,
  seoulLines.line8,
];

/**
 * Deterministic pseudo-random in [0, 1). Seeded by piece index rather than
 * Math.random so the burst is stable across re-renders — and so it works in
 * a workflow context where Math.random is unavailable.
 */
function noise(seed: number, salt: number): number {
  const x = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface PieceProps {
  index: number;
  width: number;
}

function Piece({ index, width }: PieceProps) {
  const progress = useSharedValue(0);

  const startX = noise(index, 1) * width;
  const drift = (noise(index, 2) - 0.5) * 140;
  const size = 7 + noise(index, 3) * 7;
  const spin = (noise(index, 4) - 0.5) * 1080;
  const delay = noise(index, 5) * 320;
  const duration = 1500 + noise(index, 6) * 900;
  const color = PALETTE[index % PALETTE.length];
  const isCircle = noise(index, 7) > 0.6;

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.quad) }),
    );
  }, [progress, delay, duration]);

  const style = useAnimatedStyle(() => ({
    // Falls the height of the card, drifting sideways and tumbling.
    transform: [
      { translateY: progress.value * 460 },
      { translateX: progress.value * drift },
      { rotate: `${progress.value * spin}deg` },
    ],
    // Holds full opacity most of the way, then fades out at the end.
    opacity: progress.value > 0.75 ? (1 - progress.value) * 4 : 1,
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: startX,
          width: size,
          height: isCircle ? size : size * 1.6,
          backgroundColor: color,
          borderRadius: isCircle ? size / 2 : 2,
        },
        style,
      ]}
    />
  );
}

export interface ConfettiProps {
  /** Number of pieces. Above ~40 the cost stops buying any extra delight. */
  count?: number;
}

/**
 * A one-shot confetti burst for genuine milestones — finishing a lesson,
 * unlocking an achievement. Not for routine taps: confetti that fires
 * constantly stops meaning anything.
 *
 * Decorative and hidden from screen readers; the accompanying text carries
 * the actual news. Renders nothing when the OS asks for reduced motion.
 */
export function Confetti({ count = 34 }: ConfettiProps) {
  const { width } = useWindowDimensions();
  const reduceMotion = useReduceMotion();

  if (reduceMotion) return null;

  return (
    <View
      style={styles.root}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: count }, (_, index) => (
        <Piece key={index} index={index} width={width} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    top: -40,
    overflow: 'hidden',
    borderRadius: radius.xl,
  },
  piece: { position: 'absolute', top: 0 },
});
