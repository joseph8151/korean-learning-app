import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { depth } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface BouncyProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  /** How far it squashes. 0.96 is a firm press, 0.92 a springy one. */
  scaleTo?: number;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'radio' | 'checkbox';
  accessibilityState?: { selected?: boolean; disabled?: boolean; checked?: boolean };
  hitSlop?: number;
  testID?: string;
}

/**
 * A pressable that springs rather than fading. Opacity-only feedback is the
 * default everywhere and reads as flat and generic; a spring makes a control
 * feel like it has mass.
 *
 * Runs entirely on the UI thread, so it stays smooth while the JS thread is
 * busy loading the next screen.
 */
export function Bouncy({
  children,
  onPress,
  disabled = false,
  scaleTo = 0.955,
  haptic = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  accessibilityState,
  hitSlop,
  testID,
}: BouncyProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * (1 - scaleTo) }],
  }));

  return (
    <AnimatedPressable
      testID={testID}
      onPress={() => {
        if (haptic) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
        }
        onPress?.();
      }}
      onPressIn={() => {
        pressed.value = withSpring(1, depth.spring.press);
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, depth.spring.settle);
      }}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, ...accessibilityState }}
      hitSlop={hitSlop}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
