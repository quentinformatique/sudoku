import { create } from 'zustand';

import { accentPalette } from './constants';
import { SettingsState, ThemePreference } from './types';
import i18n from '../../core/i18n';
import { loadSettings, saveSettings } from '../../data/repositories/settingsRepository';

const defaultSettings: SettingsState = {
  themeMode: 'system',
  accentColor: accentPalette[0] ?? '#FF4D4D',
  customAccent: null,
  useCustomAccent: false,
  soundEnabled: true,
  hapticsEnabled: true,
  highContrast: false,
  reduceMotion: false,
  largeNumbers: false,
  errorFeedback: 'instant',
  language: 'en',
};

type SettingsStore = SettingsState & {
  hydrate: () => Promise<void>;
  update: (next: Partial<SettingsState>) => void;
  setThemeMode: (mode: ThemePreference) => void;
  setAccentColor: (accent: string) => void;
  setCustomAccent: (accent: string | null) => void;
  setUseCustomAccent: (value: boolean) => void;
};

const pickSettings = (state: SettingsStore | SettingsState): SettingsState => ({
  themeMode: state.themeMode,
  accentColor: state.accentColor,
  customAccent: state.customAccent,
  useCustomAccent: state.useCustomAccent,
  soundEnabled: state.soundEnabled,
  hapticsEnabled: state.hapticsEnabled,
  highContrast: state.highContrast,
  reduceMotion: state.reduceMotion,
  largeNumbers: state.largeNumbers,
  errorFeedback: state.errorFeedback,
  language: state.language,
});

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...defaultSettings,
  hydrate: async () => {
    const stored = await loadSettings();
    if (stored) {
      set({ ...defaultSettings, ...stored });
      if (stored.language) {
        await i18n.changeLanguage(stored.language);
      }
    }
  },
  update: (next) => {
    set((state) => {
      const updated = { ...state, ...next };
      void saveSettings(pickSettings(updated));
      if (next.language) {
        void i18n.changeLanguage(next.language);
      }
      return next;
    });
  },
  setThemeMode: (mode) => {
    get().update({ themeMode: mode });
  },
  setAccentColor: (accent) => {
    get().update({ accentColor: accent });
  },
  setCustomAccent: (accent) => {
    get().update({ customAccent: accent });
  },
  setUseCustomAccent: (value) => {
    get().update({ useCustomAccent: value });
  },
}));
