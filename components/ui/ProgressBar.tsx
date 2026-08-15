import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/constants/theme';

export interface ProgressBarProps {
  /** 0 to 1. */
  ratio: number;
  color?: string;
  trackColor?: string;
  height?: number;
  accessibilityLabel?: string;
}

export function ProgressBar({
  ratio,
  color = colors.primary,
  trackColor = colors.primarySoft,
  height = 10,
  accessibilityLabel,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, Number.isFinite(ratio) ? ratio : 0));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { backgroundColor: trackColor, height, borderRadius: height / 2 }]}
    >
      <View
        style={[
          styles.fill,
          { backgroundColor: color, width: `${clamped * 100}%`, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden', borderRadius: radius.pill },
  fill: { height: '100%' },
});
