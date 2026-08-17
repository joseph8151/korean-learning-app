import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { colors, layout, radius, spacing } from '@/constants/theme';
import { useSpeak } from '@/hooks/useKoreanVoice';
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
  const { speak, muted } = useSpeak();

  const handlePress = () => {
    speak(text, { slow });
    // Nothing was played, so nothing downstream should count as practice.
    if (!muted) onPlay?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={muted ? `${label}: Korean audio is not set up` : `${label}: ${text}`}
      accessibilityHint={
        muted ? 'Explains how to install a Korean voice' : 'Plays the Korean audio'
      }
      style={({ pressed }) => [
        styles.button,
        compact ? styles.compact : styles.full,
        muted && styles.muted,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Ionicons
        name={muted ? 'volume-mute' : slow ? 'play-outline' : 'volume-high'}
        size={18}
        color={muted ? colors.textMuted : colors.primary}
      />
      {compact ? null : (
        <AppText variant="caption" color={muted ? colors.textMuted : colors.primaryDark}>
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
  muted: { backgroundColor: colors.surfaceMuted },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
});
