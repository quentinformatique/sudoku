import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';

export const AboutScreen = () => {
  const { t } = useTranslation();
  return (
    <Screen>
      <AppText variant="title">{t('about.title')}</AppText>
      <AppText style={styles.body}>{t('about.body')}</AppText>
      <View style={styles.block}>
        <AppText variant="label">{t('about.version')}</AppText>
        <AppText>1.0.0</AppText>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  body: {
    marginTop: 12,
  },
  block: {
    marginTop: 20,
    gap: 4,
  },
});
