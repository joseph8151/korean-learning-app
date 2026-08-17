import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';

import { AuthForm, type AuthFormValues } from '@/features/auth/AuthForm';
import { AppButton, AppText, Screen } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { authService } from '@/services/auth';
import { useSignInFlow } from '@/hooks/useSignInFlow';
import { useUserStore } from '@/store/useUserStore';

export default function SignUpScreen() {
  const router = useRouter();
  const { syncingMessage, completeSignIn } = useSignInFlow();
  const continueAsGuest = useUserStore((state) => state.continueAsGuest);
  const setDisplayName = useUserStore((state) => state.setDisplayName);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: AuthFormValues) => {
    setBusy(true);
    setError(null);

    const outcome = await authService.signUpWithEmail(
      values.email,
      values.password,
      values.displayName,
    );
    setBusy(false);

    if (!outcome.ok) {
      setError(outcome.message);
      return;
    }

    setDisplayName(values.displayName);

    if (outcome.user && !outcome.needsEmailConfirmation) {
      await completeSignIn(outcome.user);
      return;
    }

    Alert.alert('Almost there', outcome.message, [
      { text: 'OK', onPress: () => router.replace('/auth/sign-in') },
    ]);
  };

  const handleGoogle = async () => {
    setBusy(true);
    setError(null);
    const outcome = await authService.signInWithGoogle();
    setBusy(false);

    if (outcome.ok && outcome.user) {
      await completeSignIn(outcome.user);
      return;
    }
    setError(outcome.message);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={12}
          style={styles.close}
        >
          <Ionicons name="close" size={22} color={colors.textMuted} />
        </Pressable>
      </View>

      <AppText variant="title">Save your Korean</AppText>
      <AppText variant="body" color={colors.textMuted} style={styles.subtitle}>
        Create a free account to keep your streak, XP and saved words safe.
      </AppText>

      {syncingMessage ? (
        <View style={styles.syncing} accessibilityLiveRegion="polite">
          <ActivityIndicator size="small" color={colors.primary} />
          <AppText variant="caption" color={colors.primaryDark}>
            {syncingMessage}
          </AppText>
        </View>
      ) : null}

      <View style={styles.form}>
        <AuthForm
          mode="sign-up"
          busy={busy || syncingMessage !== null}
          errorMessage={error}
          onSubmit={handleSubmit}
        />
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <AppText variant="micro" color={colors.textSubtle}>
          OR
        </AppText>
        <View style={styles.line} />
      </View>

      <AppButton
        label="Continue with Google"
        variant="outline"
        onPress={handleGoogle}
        disabled={busy || syncingMessage !== null}
        icon={<Ionicons name="logo-google" size={18} color={colors.primary} />}
      />

      <AppButton
        label="Continue as Guest"
        variant="ghost"
        style={styles.guest}
        onPress={() => {
          continueAsGuest();
          router.replace('/(tabs)');
        }}
      />

      <Pressable
        onPress={() => router.replace('/auth/sign-in')}
        accessibilityRole="button"
        accessibilityLabel="Already have an account? Sign in"
        style={styles.switch}
      >
        <AppText variant="caption" color={colors.textMuted} center>
          Already have an account?{' '}
          <AppText variant="caption" color={colors.primaryDark}>
            Sign in
          </AppText>
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: spacing.lg },
  close: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  subtitle: { marginTop: spacing.sm },
  syncing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  form: { marginTop: spacing.xxl },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginVertical: spacing.xl },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  guest: { marginTop: spacing.sm },
  switch: { marginTop: spacing.lg, padding: spacing.sm },
});
