import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { Card } from '../../../components/ui/Card';

const licenses = [
  'Expo',
  'React',
  'React Native',
  'React Navigation',
  'Zustand',
  'i18next',
  'expo-sqlite',
  'expo-av',
];

export const LicensesScreen = () => {
  const { t } = useTranslation();
  return (
    <Screen scroll>
      <AppText variant="title">{t('licenses.title')}</AppText>
      <Card style={styles.card}>
        <AppText>{t('licenses.body')}</AppText>
      </Card>
      <Card style={styles.card}>
        {licenses.map((item) => (
          <View key={item} style={styles.row}>
            <AppText>{item}</AppText>
          </View>
        ))}
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    gap: 8,
  },
  row: {
    paddingVertical: 4,
  },
});
