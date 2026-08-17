import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

export interface SeoulSkylineProps {
  color?: string;
  opacity?: number;
  height?: number;
}

/**
 * A Seoul silhouette for the bottom edge of a coloured panel: N Seoul Tower on
 * Namsan, a run of the apartment towers that actually define the skyline, the
 * Lotte World Tower taper, and a Han River bridge.
 *
 * Silhouette only, no window detail — at the low opacity this sits at, detail
 * turns into noise. It is decorative and carries no information, so it is
 * hidden from screen readers by the parent's `accessibilityElementsHidden`.
 */
export function SeoulSkyline({ color = '#FFFFFF', opacity = 0.22, height = 76 }: SeoulSkylineProps) {
  return (
    <View style={[styles.root, { height }]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 360 76" preserveAspectRatio="xMidYMax slice">
        <G fill={color} opacity={opacity}>
          {/* Namsan, with N Seoul Tower on the ridge. */}
          <Path d="M0 76 L0 58 Q26 40 52 47 Q66 51 74 58 L74 76 Z" />
          <Rect x="40" y="20" width="4" height="30" />
          <Path d="M36 26 L48 26 L45 17 L39 17 Z" />
          <Circle cx="42" cy="13" r="3" />

          {/* Riverside apartment blocks — the real shape of the city. */}
          <Rect x="86" y="36" width="17" height="40" rx="1.5" />
          <Rect x="106" y="28" width="17" height="48" rx="1.5" />
          <Rect x="126" y="44" width="17" height="32" rx="1.5" />
          <Rect x="146" y="32" width="17" height="44" rx="1.5" />
          <Rect x="166" y="48" width="14" height="28" rx="1.5" />

          {/* Mid-rise offices. */}
          <Rect x="188" y="40" width="22" height="36" rx="2" />
          <Rect x="214" y="52" width="18" height="24" rx="2" />
          <Rect x="236" y="34" width="20" height="42" rx="2" />

          {/* Lotte World Tower — the taper is the whole point. */}
          <Path d="M272 76 L275 22 L285 22 L288 76 Z" />
          <Path d="M277 22 L280 12 L283 22 Z" />

          <Rect x="296" y="50" width="16" height="26" rx="2" />

          {/* Han River bridge running off the right edge. */}
          <Path d="M316 66 h44 v3 h-44 Z" />
          <Path d="M322 69 h3 v7 h-3 Z M338 69 h3 v7 h-3 Z M354 69 h3 v7 h-3 Z" />
          <Path d="M318 66 Q330 56 342 66 Z" opacity={0.7} />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
