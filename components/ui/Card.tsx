import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, shadow, spacing } from '@/constants/theme';

export type CardTone = 'raised' | 'flat' | 'tinted';

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  /**
   * `raised` is the default white card. `flat` drops the shadow for cards
   * inside an already-elevated container, and `tinted` sits on a soft wash for
   * secondary information.
   */
  tone?: CardTone;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export function Card({
  children,
  onPress,
  style,
  padded = true,
  tone = 'raised',
  accessibilityLabel,
  accessibilityHint,
  testID,
}: CardProps) {
  const content = [styles.card, styles[tone], padded && styles.padded, style];

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
    // A hairline does the separating work on Android, where a shadow heavy
    // enough to be visible also looks muddy against the tinted background.
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
  },
  raised: shadow.card,
  flat: { borderColor: colors.border },
  tinted: { backgroundColor: colors.surfaceMuted, borderColor: 'transparent' },
  padded: { padding: spacing.xl },
  pressed: { opacity: 0.94, transform: [{ scale: 0.985 }] },
});
