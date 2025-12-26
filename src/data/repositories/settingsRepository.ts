import { SettingsState } from '../../features/settings/types';
import { getFirstAsync, runAsync } from '../sqlite/client';

const SETTINGS_KEY = 'app_settings';

export const loadSettings = async (): Promise<Partial<SettingsState> | null> => {
  const row = await getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ? LIMIT 1',
    [SETTINGS_KEY],
  );
  if (!row) {
    return null;
  }
  try {
    return JSON.parse(row.value) as Partial<SettingsState>;
  } catch {
    return null;
  }
};

export const saveSettings = async (settings: SettingsState) => {
  const payload = JSON.stringify(settings);
  await runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    [SETTINGS_KEY, payload],
  );
};
