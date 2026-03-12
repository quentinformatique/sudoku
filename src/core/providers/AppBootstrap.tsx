import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

import { AppProviders } from './AppProviders';
import { migrate } from '../../data/sqlite/migrations';
import { useGameStore } from '../../features/game/gameStore';
import { useSettingsStore } from '../../features/settings/settingsStore';
import { RootNavigator } from '../navigation/RootNavigator';

export const AppBootstrap = () => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hydrateSettings = useSettingsStore((state) => state.hydrate);
  const hydrateGame = useGameStore((state) => state.hydrate);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        // Migration and hydration should not block indefinitely
        const timeout = setTimeout(() => {
          if (mounted && !ready) {
            setError('Initialization timed out. Checking database...');
          }
        }, 8000);

        await migrate();
        await hydrateSettings();
        await hydrateGame();

        clearTimeout(timeout);
        if (mounted) {
          setReady(true);
        }
      } catch (err) {
        console.error('App initialization failed:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error during startup');
        }
      }
    };
    void init();
    return () => {
      mounted = false;
    };
  }, [hydrateSettings, hydrateGame, ready]);

  if (error) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>Something went wrong</Text>
        <Text style={styles.errorSub}>{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E0E0E',
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#0E0E0E',
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  errorSub: {
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'center',
  },
});
