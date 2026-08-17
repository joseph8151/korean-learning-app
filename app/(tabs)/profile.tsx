import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Children, cloneElement, isValidElement, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Card,
  GradientCard,
  PremiumBadge,
  Screen,
  SectionHeader,
} from '@/components/ui';
import { LEARNING_GOAL_OPTIONS, PRIVACY_URL, SUPPORT_EMAIL, TERMS_URL } from '@/constants/app';
import { colors, onGradient, radius, spacing } from '@/constants/theme';
import { useIsPremium } from '@/hooks/usePremium';
import { authService } from '@/services/auth';
import { syncService } from '@/services/sync';
import { useProgressStore } from '@/store/useProgressStore';
import { useUserStore } from '@/store/useUserStore';

export default function ProfileScreen() {
  const router = useRouter();
  const isPremium = useIsPremium();

  const displayName = useUserStore((state) => state.displayName);
  const email = useUserStore((state) => state.email);
  const country = useUserStore((state) => state.country);
  const nativeLanguage = useUserStore((state) => state.nativeLanguage);
  const koreanLevel = useUserStore((state) => state.koreanLevel);
  const dailyGoalMinutes = useUserStore((state) => state.dailyGoalMinutes);
  const learningGoals = useUserStore((state) => state.learningGoals);
  const isGuest = useUserStore((state) => state.isGuest);
  const userId = useUserStore((state) => state.userId);
  const signOut = useUserStore((state) => state.signOut);
  const getSyncableSnapshot = useProgressStore((state) => state.getSyncableSnapshot);
  const adoptSyncedProgress = useProgressStore((state) => state.adoptSyncedProgress);
  const resetUser = useUserStore((state) => state.resetAll);
  const resetProgress = useProgressStore((state) => state.resetAll);

  const goalLabels = learningGoals
    .map((goal) => LEARNING_GOAL_OPTIONS.find((option) => option.id === goal)?.label)
    .filter(Boolean)
    .join(', ');

  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    if (!userId || syncing) return;
    setSyncing(true);

    const result = await syncService.syncOnSignIn(userId, getSyncableSnapshot());
    if (result.progress) adoptSyncedProgress(result.progress);

    setSyncing(false);
    Alert.alert('Sync', result.message);
  };

  const handleSignOut = () => {
    Alert.alert('Log out?', 'Your progress stays on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await authService.signOut();
          signOut();
        },
      },
    ]);
  };

  const handleReset = () => {
    Alert.alert('Reset all data?', 'This clears your progress and setup on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          resetProgress();
          resetUser();
          router.replace('/(onboarding)/welcome');
        },
      },
    ]);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <SectionHeader title="Profile" />
      </View>

      <Card style={styles.identity}>
        <View style={styles.avatar}>
          <AppText variant="title" color={colors.primaryDark}>
            {displayName.slice(0, 1).toUpperCase()}
          </AppText>
        </View>

        <View style={styles.identityText}>
          <AppText variant="subheading">{displayName}</AppText>
          <AppText variant="caption" color={colors.textMuted}>
            {email ?? (isGuest ? 'Learning as a guest' : 'No email on file')}
          </AppText>
        </View>

        {isPremium ? <PremiumBadge /> : null}
      </Card>

      {isGuest ? (
        <Card style={styles.saveCard}>
          <AppText variant="subheading">Save your progress</AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.saveText}>
            Create a free account to keep your streak, saved words and XP across devices.
          </AppText>
          <AppButton label="Create Account" onPress={() => router.push('/auth/sign-up')} />
        </Card>
      ) : null}

      {!isPremium ? (
        <GradientCard
          onPress={() => router.push('/paywall')}
          accessibilityLabel="Go Premium. All courses, AI conversations and speaking practice."
          accessibilityHint="Opens the KoreanGo Premium plans"
          style={styles.premiumBanner}
          contentStyle={styles.premiumContent}
        >
          <View style={styles.premiumText}>
            <AppText variant="subheading" color={onGradient.primary}>
              Go Premium ✦
            </AppText>
            <AppText variant="caption" color={onGradient.secondary}>
              All courses, AI conversations and speaking practice.
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </GradientCard>
      ) : null}

      <Section title="Learning">
        <Row
          label="Korean Level"
          value={`Level ${koreanLevel}`}
          onPress={() => router.push('/settings/level')}
        />
        <Row
          label="Daily Goal"
          value={`${dailyGoalMinutes} min`}
          onPress={() => router.push('/settings/daily-goal')}
        />
        <Row
          label="Learning Goal"
          value={goalLabels || 'Not set'}
          onPress={() => router.push('/settings/goals')}
        />
        <Row
          label="Notifications"
          value=""
          onPress={() => router.push('/settings/notifications')}
        />
      </Section>

      <Section title="Account">
        <Row label="Name" value={displayName} onPress={() => router.push('/settings/account')} />
        <Row label="Country" value={country ?? 'Not set'} onPress={() => router.push('/settings/account')} />
        <Row label="Native Language" value={nativeLanguage} onPress={() => router.push('/settings/account')} />
      </Section>

      <Section title="About">
        <Row label="Privacy Policy" value="" onPress={() => Linking.openURL(PRIVACY_URL)} />
        <Row label="Terms" value="" onPress={() => Linking.openURL(TERMS_URL)} />
        <Row label="Contact" value={SUPPORT_EMAIL} onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)} />
      </Section>

      <View style={styles.footer}>
        {!isGuest ? (
          <>
            <AppButton
              label="Sync Now"
              variant="outline"
              loading={syncing}
              onPress={handleSync}
            />
            <AppButton label="Log Out" variant="ghost" onPress={handleSignOut} />
          </>
        ) : null}
        <AppButton label="Reset All Data" variant="ghost" onPress={handleReset} />
      </View>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const rows = Children.toArray(children);

  return (
    <View style={styles.section}>
      <AppText variant="overline" color={colors.textSubtle} style={styles.sectionTitle}>
        {title.toUpperCase()}
      </AppText>
      <View style={styles.sectionBody}>
        {rows.map((row, index) =>
          // The separator belongs *between* rows. Left on every row, the last
          // one draws a stray line just inside the container's rounded edge.
          isValidElement<RowProps>(row) ? cloneElement(row, { last: index === rows.length - 1 }) : row,
        )}
      </View>
    </View>
  );
}

interface RowProps {
  label: string;
  value: string;
  onPress: () => void;
  last?: boolean;
}

function Row({ label, value, onPress, last = false }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}: ${value}` : label}
      style={({ pressed }) => [styles.row, last && styles.rowLast, pressed && styles.rowPressed]}
    >
      <AppText variant="body" style={styles.rowLabel}>
        {label}
      </AppText>
      {value ? (
        <AppText variant="caption" color={colors.textMuted} numberOfLines={1} style={styles.rowValue}>
          {value}
        </AppText>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.xl },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: { flex: 1, gap: 2 },
  saveCard: { marginTop: spacing.lg, gap: spacing.sm },
  saveText: { marginBottom: spacing.md },
  premiumBanner: { marginTop: spacing.lg },
  premiumContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  premiumText: { flex: 1, gap: 2 },
  pressed: { opacity: 0.9 },
  section: { marginTop: spacing.xxl },
  sectionTitle: { marginBottom: spacing.md },
  sectionBody: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  rowPressed: { backgroundColor: colors.surfaceMuted },
  rowLabel: { flex: 1 },
  rowValue: { maxWidth: '50%', textAlign: 'right' },
  footer: { marginTop: spacing.xxl, gap: spacing.sm },
});
