import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, radius, shadow, spacing } from '@/constants/theme';

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padded?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export function Card({
  children,
  onPress,
  style,
  padded = true,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: CardProps) {
  const content = [styles.card, padded && styles.padded, style];

  if (!onPress) {
    return (
      <View style={content} testID={testID}>
        {children}
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
      style={({ pressed }) => [...content, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    ...shadow.card,
  },
  padded: { padding: spacing.xl },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
