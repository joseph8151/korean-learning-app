import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { SettingsScreen } from '@/components/SettingsScreen';
import { AppButton, AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export default function AccountSettingsScreen() {
  const router = useRouter();

  const displayName = useUserStore((state) => state.displayName);
  const country = useUserStore((state) => state.country);
  const nativeLanguage = useUserStore((state) => state.nativeLanguage);
  const setDisplayName = useUserStore((state) => state.setDisplayName);
  const setCountry = useUserStore((state) => state.setCountry);
  const setNativeLanguage = useUserStore((state) => state.setNativeLanguage);

  const [name, setName] = useState(displayName);
  const [countryValue, setCountryValue] = useState(country ?? '');
  const [languageValue, setLanguageValue] = useState(nativeLanguage);

  const save = () => {
    setDisplayName(name);
    setCountry(countryValue.trim() || null);
    setNativeLanguage(languageValue.trim() || 'English');
    router.back();
  };

  return (
    <SettingsScreen
      title="Account"
      subtitle="This only changes how the app greets you."
      footer={<AppButton label="Save" size="lg" onPress={save} />}
    >
      <Field label="Name" value={name} onChangeText={setName} placeholder="Alex" />
      <Field
        label="Country"
        value={countryValue}
        onChangeText={setCountryValue}
        placeholder="United States"
      />
      <Field
        label="Native Language"
        value={languageValue}
        onChangeText={setLanguageValue}
        placeholder="English"
      />
    </SettingsScreen>
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
});
