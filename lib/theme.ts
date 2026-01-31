import { ThemeColor } from './types';

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

export const colors = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceLight: '#2C2C2E',
  surfaceLighter: '#3A3A3C',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  cardSleep: '#1C1C2E',
  cardFeeding: '#1C2E1C',
  cardDiaper: '#2E2E1C',
  iconSleep: '#8B7BF4',
  iconFeeding: '#4ECB71',
  iconDiaper: '#F4C542',
  iconBottle: '#64B5F6',
  iconSolids: '#FF8A65',
  iconPumped: '#BA68C8',
  statsLine: '#F4A683',
};

export function getTheme(themeColor: ThemeColor) {
  return {
    ...colors,
    ...themeColors[themeColor],
  };
}
