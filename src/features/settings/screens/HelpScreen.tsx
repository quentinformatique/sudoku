import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { Card } from '../../../components/ui/Card';

export const HelpScreen = () => {
  const { t } = useTranslation();
  return (
    <Screen scroll>
      <AppText variant="title">{t('help.title')}</AppText>
      <Card style={styles.card}>
        <AppText variant="subtitle">{t('help.q1')}</AppText>
        <AppText>{t('help.a1')}</AppText>
      </Card>
      <Card style={styles.card}>
        <AppText variant="subtitle">{t('help.q2')}</AppText>
        <AppText>{t('help.a2')}</AppText>
      </Card>
      <Card style={styles.card}>
        <AppText variant="subtitle">{t('help.q3')}</AppText>
        <AppText>{t('help.a3')}</AppText>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    gap: 8,
  },
});
