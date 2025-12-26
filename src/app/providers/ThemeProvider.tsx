import { StatusBar } from 'expo-status-bar';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useSettingsStore } from '../../features/settings/settingsStore';
import { createTheme, Theme } from '../theme/theme';

const ThemeContext = createContext<{ theme: Theme } | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const { themeMode, accentColor, customAccent, useCustomAccent, highContrast } =
    useSettingsStore();

  const theme = useMemo(() => {
    const mode =
      themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;
    const accent = useCustomAccent && customAccent ? customAccent : accentColor;
    return createTheme(mode, accent, highContrast);
  }, [themeMode, systemScheme, accentColor, customAccent, useCustomAccent, highContrast]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return context.theme;
};
