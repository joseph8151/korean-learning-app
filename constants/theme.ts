export const colors = {
  primary: '#6C63FF',
  primaryDark: '#544CE0',
  primarySoft: '#EEEDFF',
  secondary: '#FFB84D',
  secondarySoft: '#FFF4E3',
  accent: '#FF6B81',
  accentSoft: '#FFECEF',
  background: '#F8F9FD',
  surface: '#FFFFFF',
  text: '#202124',
  textMuted: '#6B6F80',
  textSubtle: '#9CA1B3',
  border: '#E8EAF2',
  success: '#22B573',
  successSoft: '#E4F7EE',
  warning: '#F0A500',
  warningSoft: '#FDF3DC',
  danger: '#E5484D',
  white: '#FFFFFF',
  overlay: 'rgba(32, 33, 36, 0.45)',
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
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 40, fontWeight: '800' },
  title: { fontSize: 26, lineHeight: 34, fontWeight: '800' },
  heading: { fontSize: 20, lineHeight: 28, fontWeight: '700' },
  subheading: { fontSize: 17, lineHeight: 24, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '700' },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  micro: { fontSize: 12, lineHeight: 16, fontWeight: '700' },
  korean: { fontSize: 28, lineHeight: 40, fontWeight: '700' },
  koreanLarge: { fontSize: 44, lineHeight: 58, fontWeight: '800' },
} as const;

export const shadow = {
  card: {
    shadowColor: '#1B1D2E',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  floating: {
    shadowColor: '#1B1D2E',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} as const;

export const layout = {
  screenPadding: spacing.xl,
  minTouchTarget: 48,
  maxContentWidth: 640,
} as const;

export type ThemeColor = keyof typeof colors;
