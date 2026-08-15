import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from './AppText';

export interface StreakBadgeProps {
  days: number;
  compact?: boolean;
  style?: ViewStyle;
}

export function StreakBadge({ days, compact = false, style }: StreakBadgeProps) {
  const label = compact ? `${days}` : `${days} Day Streak`;

  return (
    <View
      style={[styles.badge, { backgroundColor: colors.secondarySoft }, style]}
      accessibilityLabel={`${days} day streak`}
    >
      <AppText variant="micro" color={colors.warning}>
        🔥 {label}
      </AppText>
    </View>
  );
}

export interface PremiumBadgeProps {
  label?: string;
  style?: ViewStyle;
}

export function PremiumBadge({ label = 'PREMIUM', style }: PremiumBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: colors.primarySoft }, style]}>
      <AppText variant="micro" color={colors.primary}>
        ✦ {label}
      </AppText>
    </View>
  );
}

export interface TagProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function Tag({
  label,
  color = colors.textMuted,
  backgroundColor = colors.background,
  style,
}: TagProps) {
  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <AppText variant="micro" color={color}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
});
