import { DefaultTheme } from '@react-navigation/native';

import { spacing, radius, typography } from './tokens';

export type ThemeMode = 'light' | 'dark';

export type Theme = {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    card: string;
    text: string;
    muted: string;
    border: string;
    accent: string;
    accentSoft: string;
    danger: string;
    success: string;
    highlight: string;
  };
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
};

const createBase = (mode: ThemeMode, accent: string, highContrast: boolean): Theme => {
  const light = mode === 'light';
  const background = light ? '#F4F4F2' : '#0E0E0E';
  const surface = light ? '#FFFFFF' : '#151515';
  const card = light ? '#FAFAF8' : '#121212';
  const text = light ? '#121212' : '#F4F4F2';
  const muted = light ? '#6E6E6E' : '#A0A0A0';
  const border = light ? '#E1E1DE' : '#232323';
  const accentSoft = `${accent}22`;
  const highlight = highContrast ? (light ? '#000000' : '#FFFFFF') : accent;

  return {
    mode,
    colors: {
      background,
      surface,
      card,
      text,
      muted,
      border,
      accent,
      accentSoft,
      danger: '#FF4D4D',
      success: '#2FBF71',
      highlight,
    },
    spacing,
    radius,
    typography,
  };
};

export const createTheme = (mode: ThemeMode, accent: string, highContrast: boolean) =>
  createBase(mode, accent, highContrast);

export const toNavigationTheme = (theme: Theme) => ({
  ...DefaultTheme,
  dark: theme.mode === 'dark',
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.accent,
    background: theme.colors.background,
    card: theme.colors.card,
    text: theme.colors.text,
    border: theme.colors.border,
    notification: theme.colors.accent,
  },
  fonts: DefaultTheme.fonts,
});
