import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { APP_NAME } from '@/constants/app';
import { colors, radius, spacing } from '@/constants/theme';

export interface BrandMarkProps {
  tagline?: string;
}

export function BrandMark({ tagline = 'Speak Korean.\nLive Korea.' }: BrandMarkProps) {
  return (
    <LinearGradient
      colors={[colors.primary, '#8A6BFF', colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.root}
    >
      <View style={styles.logo}>
        <AppText variant="title" color={colors.primary}>
          한
        </AppText>
      </View>

      <AppText variant="display" color={colors.white} style={styles.name}>
        {APP_NAME}
      </AppText>

      <AppText variant="body" color="rgba(255,255,255,0.9)" center style={styles.tagline}>
        {tagline}
      </AppText>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  logo: {
    width: 88,
    height: 88,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { marginTop: spacing.xl, letterSpacing: -0.5 },
  tagline: { marginTop: spacing.sm },
});
