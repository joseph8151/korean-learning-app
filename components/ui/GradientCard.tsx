import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { gradients, radius, shadow, spacing } from '@/constants/theme';

export type GradientName = keyof typeof gradients;

export interface GradientCardProps {
  children: ReactNode;
  gradient?: GradientName;
  onPress?: () => void;
  /** Outer box: margins, width. */
  style?: ViewStyle;
  /** Inner gradient surface: how the children are laid out. */
  contentStyle?: ViewStyle;
  padded?: boolean;
  /** Diagonal by default; `horizontal` keeps text over the darker left stops. */
  direction?: 'diagonal' | 'horizontal';
  /**
   * Decoration painted behind the children and inside the rounded clip — the
   * Seoul skyline, typically. Purely visual, so it is hidden from assistive
   * technology.
   */
  decoration?: ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const ENDPOINTS = {
  diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  horizontal: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
} as const;

/**
 * A full-bleed coloured panel for the one or two moments per screen that
 * deserve emphasis — today's lesson, the Hangul entry point, the Premium
 * upsell. The gradient stops are picked so white text stays readable across
 * the whole sweep; see `gradients` in the theme.
 */
export function GradientCard({
  children,
  gradient = 'brand',
  onPress,
  style,
  contentStyle,
  padded = true,
  direction = 'diagonal',
  decoration,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: GradientCardProps) {
  const { start, end } = ENDPOINTS[direction];

  const surface = (
    <LinearGradient
      // The theme exports a readonly array; the typings ask for a tuple, and
      // the runtime only cares that there are two or more stops.
      colors={gradients[gradient] as unknown as readonly [string, string, ...string[]]}
      start={start}
      end={end}
      style={[styles.surface, padded && styles.padded, contentStyle]}
    >
      {decoration ? (
        <View
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {decoration}
        </View>
      ) : null}
      {children}
    </LinearGradient>
  );

  if (!onPress) {
    return (
      <View style={[styles.container, style]} testID={testID}>
        {surface}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.container, style, pressed && styles.pressed]}
    >
      {surface}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // The shadow lives on the outer view. `overflow: hidden` on the gradient
  // itself would clip the Android elevation shadow, so the rounding and the
  // shadow are deliberately split across the two levels.
  container: { borderRadius: radius.xl, ...shadow.raised },
  surface: { borderRadius: radius.xl, overflow: 'hidden' },
  padded: { padding: spacing.xl },
  pressed: { opacity: 0.94, transform: [{ scale: 0.985 }] },
});
