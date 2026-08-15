import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

export interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText variant="caption" color={colors.textMuted} style={styles.text}>
        {label}
      </AppText>
    </View>
  );
}

export interface EmptyStateProps {
  emoji?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ emoji = '🌱', title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="display">{emoji}</AppText>
      <AppText variant="subheading" center style={styles.text}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="caption" color={colors.textMuted} center style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} onPress={onAction} fullWidth={false} style={styles.action} />
      ) : null}
    </View>
  );
}

export interface ErrorStateProps {
  onRetry?: () => void;
  title?: string;
  message?: string;
}

/** Never surfaces raw error text — learners see friendly copy only. */
export function ErrorState({
  onRetry,
  title = 'Something went wrong.',
  message = 'Please try again in a moment.',
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="display">😵‍💫</AppText>
      <AppText variant="subheading" center style={styles.text}>
        {title}
      </AppText>
      <AppText variant="caption" color={colors.textMuted} center style={styles.message}>
        {message}
      </AppText>
      {onRetry ? (
        <AppButton label="Try Again" onPress={onRetry} fullWidth={false} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  text: { marginTop: spacing.md },
  message: { maxWidth: 280 },
  action: { marginTop: spacing.lg },
});
