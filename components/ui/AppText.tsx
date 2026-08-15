import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { colors, typography } from '@/constants/theme';

export type AppTextVariant = keyof typeof typography;

export interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  color?: string;
  center?: boolean;
}

export function AppText({
  variant = 'body',
  color = colors.text,
  center = false,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      {...rest}
      style={[
        typography[variant] as TextStyle,
        { color },
        center && styles.center,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
});
