import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AuthForm, type AuthFormValues } from '@/features/auth/AuthForm';
import { AppButton, AppText, Screen } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { authService } from '@/services/auth';
import { useUserStore } from '@/store/useUserStore';

export default function SignInScreen() {
  const router = useRouter();
  const signIn = useUserStore((state) => state.signIn);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: AuthFormValues) => {
    setBusy(true);
    setError(null);

    const outcome = await authService.signInWithEmail(values.email, values.password);
    setBusy(false);

    if (outcome.ok && outcome.user) {
      signIn(outcome.user);
      router.replace('/(tabs)');
      return;
    }
    setError(outcome.message);
  };

  const handleGoogle = async () => {
    setBusy(true);
    setError(null);
    const outcome = await authService.signInWithGoogle();
    setBusy(false);

    if (outcome.ok && outcome.user) {
      signIn(outcome.user);
      router.replace('/(tabs)');
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

      <AppText variant="title">Welcome back</AppText>
      <AppText variant="body" color={colors.textMuted} style={styles.subtitle}>
        Pick up your streak where you left it.
      </AppText>

      <View style={styles.form}>
        <AuthForm mode="sign-in" busy={busy} errorMessage={error} onSubmit={handleSubmit} />
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
        disabled={busy}
        icon={<Ionicons name="logo-google" size={18} color={colors.primary} />}
      />

      <Pressable
        onPress={() => router.replace('/auth/sign-up')}
        accessibilityRole="button"
        accessibilityLabel="Create a new account"
        style={styles.switch}
      >
        <AppText variant="caption" color={colors.textMuted} center>
          New here?{' '}
          <AppText variant="caption" color={colors.primary}>
            Create an account
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
  form: { marginTop: spacing.xxl },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginVertical: spacing.xl },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  switch: { marginTop: spacing.xl, padding: spacing.sm },
});
