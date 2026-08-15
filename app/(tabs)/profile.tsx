import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';

import { AppButton, AppText, Card, PremiumBadge, Screen, SectionHeader } from '@/components/ui';
import { LEARNING_GOAL_OPTIONS, PRIVACY_URL, SUPPORT_EMAIL, TERMS_URL } from '@/constants/app';
import { colors, radius, spacing } from '@/constants/theme';
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
          <AppText variant="title" color={colors.primary}>
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
        <Pressable
          onPress={() => router.push('/paywall')}
          accessibilityRole="button"
          accessibilityLabel="See KoreanGo Premium plans"
          style={({ pressed }) => [styles.premiumBanner, pressed && styles.pressed]}
        >
          <View style={styles.premiumText}>
            <AppText variant="subheading" color={colors.white}>
              Go Premium ✦
            </AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.85)">
              All courses, AI conversations and speaking practice.
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </Pressable>
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
  return (
    <View style={styles.section}>
      <AppText variant="micro" color={colors.textMuted} style={styles.sectionTitle}>
        {title.toUpperCase()}
      </AppText>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Row({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}: ${value}` : label}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <AppText variant="body" style={styles.rowLabel}>
        {label}
      </AppText>
      {value ? (
        <AppText variant="caption" color={colors.textMuted} numberOfLines={1} style={styles.rowValue}>
          {value}
        </AppText>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
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
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginTop: spacing.lg,
  },
  premiumText: { flex: 1, gap: 2 },
  pressed: { opacity: 0.9 },
  section: { marginTop: spacing.xxl },
  sectionTitle: { marginBottom: spacing.md },
  sectionBody: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
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
  rowLabel: { flex: 1 },
  rowValue: { maxWidth: '50%', textAlign: 'right' },
  footer: { marginTop: spacing.xxl, gap: spacing.sm },
});
