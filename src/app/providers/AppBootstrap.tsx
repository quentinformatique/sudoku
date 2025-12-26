import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { AppProviders } from './AppProviders';
import { migrate } from '../../data/sqlite/migrations';
import { useGameStore } from '../../features/game/gameStore';
import { useSettingsStore } from '../../features/settings/settingsStore';
import { RootNavigator } from '../navigation/RootNavigator';

export const AppBootstrap = () => {
  const [ready, setReady] = useState(false);
  const hydrateSettings = useSettingsStore((state) => state.hydrate);
  const hydrateGame = useGameStore((state) => state.hydrate);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      await migrate();
      await hydrateSettings();
      await hydrateGame();
      if (mounted) {
        setReady(true);
      }
    };
    void init();
    return () => {
      mounted = false;
    };
  }, [hydrateSettings, hydrateGame]);

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
  },
});
