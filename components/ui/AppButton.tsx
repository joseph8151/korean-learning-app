import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, layout, radius, spacing, typography } from '@/constants/theme';
import { AppText } from './AppText';

export type AppButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
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
};

const labelColorByVariant: Record<AppButtonVariant, string> = {
  primary: colors.white,
  secondary: colors.text,
  outline: colors.primary,
  ghost: colors.textMuted,
  danger: colors.white,
};

const heightBySize: Record<AppButtonSize, number> = {
  sm: layout.minTouchTarget,
  md: 54,
  lg: 60,
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
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  inactive: { opacity: 0.45 },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { marginRight: 2 },
  largeLabel: { fontSize: 17 },
});
