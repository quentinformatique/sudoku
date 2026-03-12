import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { Card } from '../../../components/ui/Card';

export const LearningScreen = () => {
  const { t } = useTranslation();
  return (
    <Screen>
      <AppText variant="title">{t('learning.title')}</AppText>
      <AppText>{t('learning.subtitle')}</AppText>
      <Card style={styles.card}>
        <AppText>{t('learning.body')}</AppText>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
  },
});
