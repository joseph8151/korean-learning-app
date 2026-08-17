import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { z } from 'zod';

import { AppButton, AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';

export const credentialsSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
  displayName: z.string().min(1, 'Please enter a name.').optional(),
});

export interface AuthFormValues {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthFormProps {
  mode: 'sign-in' | 'sign-up';
  busy: boolean;
  errorMessage: string | null;
  onSubmit: (values: AuthFormValues) => void;
}

export function AuthForm({ mode, busy, errorMessage, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = () => {
    const parsed = credentialsSchema.safeParse({
      email: email.trim(),
      password,
      ...(mode === 'sign-up' ? { displayName: displayName.trim() } : {}),
    });

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Please check your details.');
      return;
    }

    setValidationError(null);
    onSubmit({ email: email.trim(), password, displayName: displayName.trim() || 'Friend' });
  };

  const message = validationError ?? errorMessage;

  return (
    <View style={styles.root}>
      {mode === 'sign-up' ? (
        <Field
          label="Name"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Alex"
          autoCapitalize="words"
        />
      ) : null}

      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.field}>
        <AppText variant="micro" color={colors.textMuted}>
          PASSWORD
        </AppText>
        <View style={styles.passwordRow}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            placeholderTextColor={colors.textSubtle}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            style={styles.passwordInput}
            accessibilityLabel="Password"
          />
          <Pressable
            onPress={() => setShowPassword((value) => !value)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            hitSlop={8}
            style={styles.eye}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSubtle}
            />
          </Pressable>
        </View>
      </View>

      {message ? (
        <View style={styles.error} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle-outline" size={16} color={colors.dangerDeep} />
          <AppText variant="caption" color={colors.dangerDeep} style={styles.errorText}>
            {message}
          </AppText>
        </View>
      ) : null}

      <AppButton
        label={mode === 'sign-up' ? 'Create Account' : 'Sign In'}
        size="lg"
        loading={busy}
        onPress={handleSubmit}
        style={styles.submit}
      />
    </View>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <AppText variant="micro" color={colors.textMuted}>
        {label.toUpperCase()}
      </AppText>
      <TextInput
        {...props}
        placeholderTextColor={colors.textSubtle}
        style={styles.input}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  field: { gap: spacing.sm },
  input: {
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    color: colors.text,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  passwordInput: { flex: 1, fontSize: 16, color: colors.text },
  eye: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  error: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  errorText: { flex: 1 },
  submit: { marginTop: spacing.sm },
});
