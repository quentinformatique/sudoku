import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { getStats } from '../../../data/repositories/gameRepository';
import { formatDuration } from '../../../utils/time';

export const StatisticsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      const load = async () => {
        const rows = await getStats();
        if (mounted) {
          setStats(rows);
        }
      };
      void load();
      return () => {
        mounted = false;
      };
    }, []),
  );

  const totalGames = stats.reduce((acc, row) => acc + Number(row.total ?? 0), 0);
  const totalCompleted = stats.reduce((acc, row) => acc + Number(row.completed ?? 0), 0);

  return (
    <Screen scroll>
      <AppText variant="title">{t('stats.title')}</AppText>
      <Card style={styles.card}>
        <AppText variant="label">{t('stats.overall')}</AppText>
        <View style={styles.row}>
          <View>
            <AppText variant="subtitle">{totalCompleted}</AppText>
            <AppText>{t('stats.completed')}</AppText>
          </View>
          <View>
            <AppText variant="subtitle">{totalGames}</AppText>
            <AppText>{t('stats.totalGames')}</AppText>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <AppText variant="label">{t('stats.byDifficulty')}</AppText>
        {stats.map((row) => (
          <View key={row.difficulty} style={styles.statRow}>
            <View>
              <AppText variant="subtitle" style={{ fontSize: 16 }}>
                {t(`difficulty.${row.difficulty}`)}
              </AppText>
              <AppText>
                {t('stats.completed')}: {Number(row.completed ?? 0)}
              </AppText>
            </View>
            <View>
              <AppText>
                {t('stats.bestTime')}: {row.best ? formatDuration(Number(row.best)) : '-'}
              </AppText>
              <AppText>
                {t('stats.averageTime')}:{' '}
                {row.average ? formatDuration(Math.round(Number(row.average))) : '-'}
              </AppText>
            </View>
          </View>
        ))}
      </Card>

      <Button label={t('history.title')} onPress={() => navigation.navigate('History')} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 40,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    gap: 12,
  },
});
