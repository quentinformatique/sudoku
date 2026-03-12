export type ThemePreference = 'system' | 'light' | 'dark';
export type ErrorFeedbackMode = 'instant' | 'free';
export type LanguageCode = 'en' | 'fr';

export type SettingsState = {
  themeMode: ThemePreference;
  accentColor: string;
  customAccent: string | null;
  useCustomAccent: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  largeNumbers: boolean;
  errorFeedback: ErrorFeedbackMode;
  language: LanguageCode;
};
