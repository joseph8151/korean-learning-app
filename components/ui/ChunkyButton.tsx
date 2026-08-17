import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { AppText } from './AppText';
import {
  colors,
  depth,
  layout,
  radius,
  spacing,
  typography,
  undersides,
} from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ChunkyTone = 'primary' | 'surface' | 'secondary' | 'accent' | 'success';

export interface ChunkyButtonProps {
  label: string;
  onPress?: () => void;
  tone?: ChunkyTone;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  size?: 'md' | 'lg';
  haptic?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const FACE: Record<ChunkyTone, string> = {
  primary: colors.primary,
  surface: colors.surface,
  secondary: colors.secondary,
  accent: colors.accent,
  success: colors.success,
};

// Every pairing clears 4.5:1 against its own face colour.
const LABEL: Record<ChunkyTone, string> = {
  primary: colors.white,
  surface: colors.primaryDeep,
  secondary: colors.text,
  accent: colors.white,
  success: colors.white,
};

const UNDERSIDE: Record<ChunkyTone, string> = {
  primary: undersides.primary,
  surface: undersides.surface,
  secondary: undersides.secondary,
  accent: undersides.accent,
  success: undersides.success,
};

/**
 * A button with a visible thickness: a solid slab sits behind the face, and
 * pressing drops the face down onto it. The hard edge is the point — a soft
 * drop shadow says "floating card", a solid offset says "physical object",
 * and only the second one is satisfying to press repeatedly.
 *
 * Reserved for the primary action on a screen. Used everywhere it would just
 * be loud, which is why AppButton still exists for everything else.
 */
export function ChunkyButton({
  label,
  onPress,
  tone = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  icon,
  size = 'lg',
  haptic = true,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: ChunkyButtonProps) {
  const inactive = disabled || loading;
  const drop = useSharedValue(0);

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: drop.value * depth.press }],
  }));

  // The underside shortens by exactly what the face travels, so the button
  // keeps its overall height and never nudges the layout around it.
  const undersideStyle = useAnimatedStyle(() => ({
    bottom: -(depth.lift - drop.value * depth.press),
  }));

  const height = size === 'lg' ? 58 : 52;

  return (
    <View
      style={[
        styles.root,
        { alignSelf: fullWidth ? 'stretch' : 'flex-start', marginBottom: depth.lift },
        inactive && styles.inactive,
        style,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.underside, { backgroundColor: UNDERSIDE[tone] }, undersideStyle]}
      />

      <AnimatedPressable
        testID={testID}
        onPress={() => {
          if (haptic) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
          }
          onPress?.();
        }}
        onPressIn={() => {
          drop.value = withSpring(1, depth.spring.press);
        }}
        onPressOut={() => {
          drop.value = withSpring(0, depth.spring.settle);
        }}
        disabled={inactive}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: inactive, busy: loading }}
        style={[
          styles.face,
          { backgroundColor: FACE[tone], height },
          tone === 'surface' && styles.faceOutlined,
          faceStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={LABEL[tone]} />
        ) : (
          <View style={styles.content}>
            {icon}
            <AppText numberOfLines={1} style={[typography.bodyStrong, { color: LABEL[tone] }]}>
              {label}
            </AppText>
          </View>
        )}
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'relative' },
  underside: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    borderRadius: radius.md,
  },
  face: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    minHeight: layout.minTouchTarget,
  },
  faceOutlined: { borderWidth: 1.5, borderColor: colors.border },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  inactive: { opacity: 0.45 },
});
