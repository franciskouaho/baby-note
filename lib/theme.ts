import type { ThemeColor } from './types';

export type ColorSchemePreference = 'dark' | 'light' | 'system';

export const themeColors: Record<ThemeColor, { primary: string; primaryLight: string; primaryDark: string }> = {
  peach: {
    primary: '#F4A683',
    primaryLight: '#F8C4A8',
    primaryDark: '#E8855C',
  },
  pink: {
    primary: '#E8A0BF',
    primaryLight: '#F0C0D4',
    primaryDark: '#D080A0',
  },
  blue: {
    primary: '#7EB6DE',
    primaryLight: '#A8D0EE',
    primaryDark: '#5A96C0',
  },
};

const darkColors = {
  background: '#0D0D0F',
  surface: '#1A1A1F',
  surfaceElevated: '#252530',
  surfaceLight: '#2C2C30',
  surfaceLighter: '#3A3A40',
  text: '#F5F0EB',
  textSecondary: '#9D9DA3',
  textTertiary: '#6B6B73',
  activeButtonText: '#0D0D0F',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  border: '#2A2A30',
  // Accent colors (softened)
  iconSleep: '#A599FF',
  iconFeeding: '#6BD68A',
  iconDiaper: '#FFD166',
  iconBottle: '#7EC8F2',
  iconSolids: '#FFB088',
  iconPumped: '#C9A0E0',
  // Card backgrounds (tinted)
  cardSleep: '#16162A',
  cardFeeding: '#142218',
  cardDiaper: '#252218',
  cardBottle: '#142028',
  cardSolids: '#251C18',
  cardPumped: '#1E1828',
  statsLine: '#F4A683',
};

const lightColors = {
  background: '#FBF8F4',
  surface: '#FFFFFF',
  surfaceElevated: '#F5F0EB',
  surfaceLight: '#EDE8E2',
  surfaceLighter: '#E0DBD5',
  text: '#1A1A1F',
  textSecondary: '#7A7A82',
  textTertiary: '#A8A8B0',
  activeButtonText: '#FFFFFF',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  border: '#E8E4DE',
  // Accent colors (same)
  iconSleep: '#A599FF',
  iconFeeding: '#6BD68A',
  iconDiaper: '#FFD166',
  iconBottle: '#7EC8F2',
  iconSolids: '#FFB088',
  iconPumped: '#C9A0E0',
  // Card backgrounds (tinted light)
  cardSleep: '#F0EEFF',
  cardFeeding: '#ECFAEF',
  cardDiaper: '#FFF8E8',
  cardBottle: '#ECF5FC',
  cardSolids: '#FFF0E8',
  cardPumped: '#F5ECFA',
  statsLine: '#F4A683',
};

export type ThemeColors = typeof darkColors & { primary: string; primaryLight: string; primaryDark: string };

export function getColors(mode: 'dark' | 'light') {
  return mode === 'dark' ? darkColors : lightColors;
}

export function getTheme(themeColor: ThemeColor, mode: 'dark' | 'light'): ThemeColors {
  const base = getColors(mode);
  return {
    ...base,
    ...themeColors[themeColor],
  };
}

export function resolveColorScheme(
  preference: ColorSchemePreference,
  systemScheme: 'dark' | 'light' | null | undefined,
): 'dark' | 'light' {
  if (preference === 'system') {
    return systemScheme === 'light' ? 'light' : 'dark';
  }
  return preference;
}
