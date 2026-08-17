import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { colors, layout, radius, spacing } from '@/constants/theme';
import { audioService } from '@/services/audio';
import { AppText } from './AppText';

export interface AudioButtonProps {
  text: string;
  label?: string;
  slow?: boolean;
  compact?: boolean;
  style?: ViewStyle;
  onPlay?: () => void;
}

export function AudioButton({
  text,
  label = 'Listen',
  slow = false,
  compact = false,
  style,
  onPlay,
}: AudioButtonProps) {
  const handlePress = () => {
    audioService.speakKorean(text, { slow });
    onPlay?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${text}`}
      accessibilityHint="Plays the Korean audio"
      style={({ pressed }) => [
        styles.button,
        compact ? styles.compact : styles.full,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Ionicons name={slow ? 'play-outline' : 'volume-high'} size={18} color={colors.primary} />
      {compact ? null : (
        <AppText variant="caption" color={colors.primaryDark}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    gap: spacing.sm,
  },
  full: {
    paddingHorizontal: spacing.lg,
    height: layout.minTouchTarget,
  },
  compact: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
  },
  pressed: { opacity: 0.75 },
});
