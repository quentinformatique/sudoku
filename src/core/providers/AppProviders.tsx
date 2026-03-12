import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import i18n from '../i18n';
import { SnackbarProvider } from './SnackbarProvider';
import { ThemeProvider } from './ThemeProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <SnackbarProvider>{children}</SnackbarProvider>
        </ThemeProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);
