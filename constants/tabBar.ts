import { StyleSheet, type ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';

/**
 * Style for the bottom tab bar.
 *
 * Deliberately carries no `height` and no `paddingBottom`.
 *
 * Android 15 forces every app edge-to-edge, so the window extends underneath
 * the system navigation bar and the tab bar has to lift itself clear of it.
 * React Navigation already does that: it adds the bottom safe-area inset to
 * both the bar's height and its bottom padding — but only while nothing
 * overrides them. A numeric `height` here replaces that calculation wholesale
 * (see `getTabBarHeight` in the vendored bottom-tabs view), which is how the
 * labels ended up sitting behind the navigation buttons.
 *
 * Adding the inset back by hand works too, right up until a device reports it
 * differently. Letting the library own the arithmetic removes the whole class
 * of mistake, at the cost of a slightly shorter bar.
 */
export const tabBarStyle: ViewStyle = {
  backgroundColor: colors.surface,
  borderTopColor: colors.borderSoft,
  borderTopWidth: StyleSheet.hairlineWidth,
};
