import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { Card } from '../../../components/ui/Card';

export const PrivacyScreen = () => {
  const { t } = useTranslation();
  return (
    <Screen scroll>
      <AppText variant="title">{t('privacy.title')}</AppText>
      <Card style={styles.card}>
        <AppText>{t('privacy.body')}</AppText>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
  },
});
