import { StyleSheet, View, type ViewStyle } from 'react-native';

import { StreakFlame } from '@/components/motion/StreakFlame';
import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from './AppText';

export interface StreakBadgeProps {
  days: number;
  compact?: boolean;
  style?: ViewStyle;
}

export function StreakBadge({ days, compact = false, style }: StreakBadgeProps) {
  const label = compact ? `${days}` : `${days} day streak`;
  // A zero streak in warm amber reads as an achievement it is not.
  const active = days > 0;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: active ? colors.secondarySoft : colors.surfaceMuted },
        style,
      ]}
      accessibilityLabel={days === 1 ? '1 day streak' : `${days} day streak`}
    >
      <StreakFlame active={active} />
      <AppText variant="micro" color={active ? colors.warningDeep : colors.textSubtle}>
        {label}
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
      <AppText variant="micro" color={colors.primaryDeep}>
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
  backgroundColor = colors.surfaceMuted,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
});
