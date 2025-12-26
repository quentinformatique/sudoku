import { useFonts } from 'expo-font';
import { View } from 'react-native';

import './app/i18n';
import { AppBootstrap } from './app/providers/AppBootstrap';

export default function App() {
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
    'SpaceGrotesk-Medium': require('../assets/fonts/SpaceGrotesk-Medium.ttf'),
    'SpaceGrotesk-SemiBold': require('../assets/fonts/SpaceGrotesk-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return <AppBootstrap />;
}
