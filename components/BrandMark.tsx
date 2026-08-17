import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { APP_NAME } from '@/constants/app';
import { colors, gradients, onGradient, radius, shadow, spacing } from '@/constants/theme';

export interface BrandMarkProps {
  tagline?: string;
}

export function BrandMark({ tagline = 'Speak Korean.\nLive Korea.' }: BrandMarkProps) {
  return (
    <LinearGradient
      colors={gradients.dusk}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.root}
    >
      <View style={styles.logo}>
        <AppText style={styles.glyph} color={colors.primaryDeep}>
          한
        </AppText>
      </View>

      <AppText variant="display" color={onGradient.primary} style={styles.name}>
        {APP_NAME}
      </AppText>

      {/*
        The wordmark and tagline are centred on purpose: the diagonal sweep is
        light enough at the bottom-right corner that white text would drop
        below 4.5:1 if it ran the full width.
      */}
      <AppText variant="body" color={onGradient.secondary} center style={styles.tagline}>
        {tagline}
      </AppText>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  logo: {
    width: 96,
    height: 96,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.floating,
  },
  glyph: { fontSize: 40, lineHeight: 52, fontWeight: '800' },
  name: { marginTop: spacing.xl },
  tagline: { marginTop: spacing.sm, maxWidth: 280 },
});
