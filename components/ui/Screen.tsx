import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/constants/theme';

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  background?: string;
  contentStyle?: ViewStyle;
  footer?: ReactNode;
  edges?: { top?: boolean; bottom?: boolean };
}

/**
 * Screen container that keeps content within a readable width on tablets and
 * handles safe-area padding consistently across the app.
 */
export function Screen({
  children,
  scroll = true,
  padded = true,
  background = colors.background,
  contentStyle,
  footer,
  edges = { top: true, bottom: true },
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const paddingTop = edges.top === false ? 0 : insets.top;
  const paddingBottom = edges.bottom === false ? 0 : insets.bottom;

  const inner = (
    <View
      style={[
        styles.inner,
        padded && { paddingHorizontal: layout.screenPadding },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: background, paddingTop }]}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: paddingBottom + spacing.xxl }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {inner}
        </ScrollView>
      ) : (
        <View style={styles.flex}>{inner}</View>
      )}

      {footer ? (
        <View
          style={[
            styles.footer,
            { paddingBottom: paddingBottom + spacing.lg, backgroundColor: background },
          ]}
        >
          <View style={styles.footerInner}>{footer}</View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
  },
  footerInner: { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' },
});
