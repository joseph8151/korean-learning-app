import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, layout, radius, shadow, spacing, typography } from '@/constants/theme';
import { AppText } from './AppText';

export type AppButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  /** White pill for use on top of a gradient or other coloured panel. */
  | 'onColor';
export type AppButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: ViewStyle;
  testID?: string;
}

const backgroundByVariant: Record<AppButtonVariant, string> = {
  primary: colors.primary,
  secondary: colors.secondary,
  outline: 'transparent',
  ghost: 'transparent',
  danger: colors.danger,
  onColor: colors.white,
};

// Every pairing here clears 4.5:1 against its own background.
const labelColorByVariant: Record<AppButtonVariant, string> = {
  primary: colors.white,
  secondary: colors.text,
  outline: colors.primaryDeep,
  ghost: colors.textMuted,
  danger: colors.white,
  onColor: colors.primaryDeep,
};

const heightBySize: Record<AppButtonSize, number> = {
  sm: layout.minTouchTarget,
  md: 54,
  lg: 58,
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
  icon,
  accessibilityLabel,
  accessibilityHint,
  style,
  testID,
}: AppButtonProps) {
  const isInactive = disabled || loading;
  const isElevated = variant === 'primary' || variant === 'onColor';

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isInactive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: backgroundByVariant[variant],
          height: heightBySize[size],
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          paddingHorizontal: fullWidth ? spacing.lg : spacing.xl,
        },
        variant === 'outline' && styles.outline,
        isElevated && !isInactive && shadow.card,
        pressed && !isInactive && styles.pressed,
        isInactive && styles.inactive,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={labelColorByVariant[variant]} />
      ) : (
        <View style={styles.content}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <AppText
            numberOfLines={1}
            style={[
              typography.bodyStrong,
              { color: labelColorByVariant[variant] },
              size === 'lg' && styles.largeLabel,
            ]}
          >
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.minTouchTarget,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  inactive: { opacity: 0.4 },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { marginRight: 2 },
  largeLabel: { fontSize: 17 },
});
