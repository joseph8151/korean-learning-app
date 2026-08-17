/**
 * Design tokens.
 *
 * The brand colours come from the product spec. The extra "deep" variants are
 * derived, not decorative: the spec colours are bright enough that white or
 * mid-grey text on top of them falls below the WCAG AA 4.5:1 ratio that small
 * text needs. Every pairing noted below was measured, so use the deep variant
 * whenever a colour carries *text*, and the bright variant when it is a fill,
 * an icon on a light surface, or a progress bar.
 */
export const colors = {
  // Brand — bright variants are for fills, icons and accents.
  primary: '#6C63FF',
  primaryDark: '#544CE0',
  primaryDeep: '#4A41C9',
  primarySoft: '#EEEDFF',
  primaryTint: '#F5F4FF',

  secondary: '#FFB84D',
  secondarySoft: '#FFF4E3',

  accent: '#FF6B81',
  accentSoft: '#FFECEF',

  background: '#F8F9FD',
  surface: '#FFFFFF',
  // A barely-there wash used to separate nested blocks from a white card
  // without introducing another border.
  surfaceMuted: '#F3F4FA',

  // Text ramp. All three pass AA on both `surface` and `background`:
  // text 15.9:1, textMuted 6.4:1, textSubtle 4.6:1.
  text: '#202124',
  textMuted: '#5A5F73',
  textSubtle: '#6F7486',
  // Decorative only — chevrons, inactive dots, placeholder glyphs. Never put
  // information here; it is 2.5:1 and deliberately recedes.
  textFaint: '#9CA1B3',

  border: '#E8EAF2',
  // For a 1px edge on a white card sitting on `background`.
  borderSoft: '#EFF1F8',

  success: '#22B573',
  successDeep: '#0B7A4A',
  successSoft: '#E4F7EE',

  warning: '#F0A500',
  warningDeep: '#8F5A05',
  warningSoft: '#FDF3DC',

  danger: '#E5484D',
  dangerDeep: '#C2262B',
  dangerSoft: '#FDECEC',

  accentDeep: '#C4304C',

  white: '#FFFFFF',
  overlay: 'rgba(32, 33, 36, 0.45)',
} as const;

/**
 * Gradient stops, chosen so that white text stays above 4.5:1 across every
 * stop that text can sit on. `dusk` runs purple → magenta → coral: keep text
 * within the left two thirds, where the ratio is 5.9:1 and 5.0:1.
 */
export const gradients = {
  brand: ['#645BF5', '#4A41C9'],
  dusk: ['#5B4BE0', '#B8447E', '#E8637A'],
  sunrise: ['#FF9A5A', '#F4577A'],
  mint: ['#2BC48A', '#0B7A4A'],
} as const;

/** White at these opacities keeps AA on every `gradients` stop above. */
export const onGradient = {
  primary: '#FFFFFF',
  secondary: 'rgba(255, 255, 255, 0.92)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  /** Chips, icon tiles, badges. */
  xs: 8,
  sm: 12,
  /** List rows and compact tiles. */
  md: 18,
  lg: 20,
  /** Full-width cards and banners. */
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 40, fontWeight: '800', letterSpacing: -0.6 },
  title: { fontSize: 26, lineHeight: 34, fontWeight: '800', letterSpacing: -0.4 },
  heading: { fontSize: 20, lineHeight: 28, fontWeight: '700', letterSpacing: -0.2 },
  subheading: { fontSize: 17, lineHeight: 24, fontWeight: '700', letterSpacing: -0.1 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '700' },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  micro: { fontSize: 12, lineHeight: 16, fontWeight: '700' },
  /** All-caps eyebrow labels. The tracking is what stops them reading as shouting. */
  overline: { fontSize: 11, lineHeight: 16, fontWeight: '800', letterSpacing: 1.1 },
  korean: { fontSize: 28, lineHeight: 40, fontWeight: '700' },
  koreanLarge: { fontSize: 44, lineHeight: 58, fontWeight: '800' },
} as const;

/**
 * Android renders `elevation` as a grey drop shadow that darkens quickly, so
 * these stay low and lean on a hairline border for definition instead. iOS
 * uses the shadow* values and ignores elevation.
 */
export const shadow = {
  card: {
    shadowColor: '#1B1D2E',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#1B1D2E',
    shadowOpacity: 0.1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  floating: {
    shadowColor: '#1B1D2E',
    shadowOpacity: 0.14,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
} as const;

export const layout = {
  screenPadding: spacing.xl,
  minTouchTarget: 48,
  maxContentWidth: 640,
  /** Height of the tab bar excluding the device's bottom safe-area inset. */
  tabBarHeight: 60,
} as const;

export type ThemeColor = keyof typeof colors;
