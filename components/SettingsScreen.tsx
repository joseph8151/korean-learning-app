import type { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Screen } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';

export interface SettingsScreenProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Shared chrome for every settings sub-page. */
export function SettingsScreen({ title, subtitle, children, footer }: SettingsScreenProps) {
  const router = useRouter();

  return (
    <Screen footer={footer}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="heading">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.textMuted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={styles.body}>{children}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, gap: spacing.xs },
  back: { width: 40, height: 40, justifyContent: 'center', marginLeft: -spacing.sm },
  body: { paddingTop: spacing.xl, gap: spacing.md },
});
