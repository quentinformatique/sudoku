import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { formatDuration } from '../../../utils/time';
import { useGameStore } from '../gameStore';

export const ContinueScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const record = useGameStore((state) => state.record);

  return (
    <Screen scroll>
      <AppText variant="title">{t('play.continue')}</AppText>
      <AppText>{t('play.continueHint')}</AppText>

      <Card style={styles.card}>
        {record ? (
          <View style={styles.row}>
            <View>
              <AppText variant="subtitle">{t(`difficulty.${record.difficulty}`)}</AppText>
              <AppText>{formatDuration(record.durationSec)}</AppText>
            </View>
            <Button
              label={t('play.resume')}
              onPress={() => navigation.navigate('Game', { source: 'continue' })}
            />
          </View>
        ) : (
          <View style={styles.row}>
            <AppText>{t('play.noActive')}</AppText>
            <Button
              label={t('home.startNew')}
              onPress={() => navigation.navigate('NewGame')}
            />
          </View>
        )}
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
