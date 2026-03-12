import { useFonts } from 'expo-font';
import { View, Text, StyleSheet } from 'react-native';

import './core/i18n';
import { AppBootstrap } from './core/providers/AppBootstrap';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'SpaceGrotesk-Regular': require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
    'SpaceGrotesk-Medium': require('../assets/fonts/SpaceGrotesk-Medium.ttf'),
    'SpaceGrotesk-SemiBold': require('../assets/fonts/SpaceGrotesk-SemiBold.ttf'),
  });

  if (fontError) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>Font Loading Error</Text>
        <Text style={styles.errorSub}>{fontError.message}</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return <View style={styles.loading} />;
  }

  return <AppBootstrap />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSub: {
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'center',
  },
});
