import { getTabBarHeight } from 'expo-router/build/react-navigation/bottom-tabs/views/BottomTabBar';

import { tabBarStyle } from '@/constants/tabBar';

/**
 * The bottom tab bar sits underneath the Android system navigation bar unless
 * its height and bottom padding include the bottom safe-area inset. React
 * Navigation adds that inset for us, but silently stops as soon as the style
 * we hand it declares a numeric `height` — which is exactly the bug that put
 * the tab labels behind the navigation buttons.
 *
 * So rather than assert on our own arithmetic, these tests run the real
 * library function over the real style object.
 */
describe('tab bar height', () => {
  const NAV_BAR = 48;

  function heightWith(style: unknown) {
    return getTabBarHeight({
      state: { index: 0, routes: [{ key: 'home' }] },
      descriptors: { home: { options: {} } },
      dimensions: { width: 412, height: 915 },
      insets: { top: 24, right: 0, bottom: NAV_BAR, left: 0 },
      style,
    } as never);
  }

  it('clears the system navigation bar', () => {
    const height = heightWith(tabBarStyle);

    // Every tap target has to live above the nav bar, so the bar needs room
    // for the inset *and* a usable row on top of it.
    expect(height).toBeGreaterThan(NAV_BAR + 40);
  });

  it('grows with the inset rather than ignoring it', () => {
    const withInset = heightWith(tabBarStyle);
    const withoutInset = getTabBarHeight({
      state: { index: 0, routes: [{ key: 'home' }] },
      descriptors: { home: { options: {} } },
      dimensions: { width: 412, height: 915 },
      insets: { top: 24, right: 0, bottom: 0, left: 0 },
      style: tabBarStyle,
    } as never);

    expect(withInset - withoutInset).toBe(NAV_BAR);
  });

  it('would stop clearing it if we declared a height — which is why we do not', () => {
    // Documents the failure mode: this is the shape the style used to have.
    expect(heightWith({ ...tabBarStyle, height: 64 })).toBe(64);
    expect('height' in tabBarStyle).toBe(false);
    expect('paddingBottom' in tabBarStyle).toBe(false);
  });
});
