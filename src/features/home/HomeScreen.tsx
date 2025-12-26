import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

import { useAppTheme } from '../../app/providers/ThemeProvider';
import { Screen } from '../../components/layout/Screen';
import { AppText } from '../../components/ui/AppText';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getStats, listGames } from '../../data/repositories/gameRepository';
import { formatDuration, formatDate } from '../../utils/time';
import { useGameStore } from '../game/gameStore';

export const HomeScreen = () => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const record = useGameStore((state) => state.record);
  const [stats, setStats] = useState<{ total: number; completed: number } | null>(null);
  const [recent, setRecent] = useState<any[]>([]);

  const load = useCallback(async () => {
    const rows = await getStats();
    const total = rows.reduce((acc, row) => acc + Number(row.total ?? 0), 0);
    const completed = rows.reduce((acc, row) => acc + Number(row.completed ?? 0), 0);
    const history = await listGames({ limit: 3 });
    setStats({ total, completed });
    setRecent(history);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return (
    <Screen scroll>
      <AppText variant="title">{t('home.title')}</AppText>
      <AppText style={{ color: theme.colors.muted }}>{t('home.subtitle')}</AppText>

      <Card style={styles.card}>
        <AppText variant="label" style={{ color: theme.colors.muted }}>
          {t('home.activeTitle')}
        </AppText>
        {record ? (
          <View style={styles.row}>
            <View>
              <AppText variant="subtitle">{t(`difficulty.${record.difficulty}`)}</AppText>
              <AppText style={{ color: theme.colors.muted }}>
                {formatDuration(record.durationSec)}
              </AppText>
            </View>
            <Button
              label={t('home.resume')}
              onPress={() => navigation.navigate('PlayTab', { screen: 'Continue' })}
            />
          </View>
        ) : (
          <View style={styles.row}>
            <AppText style={{ color: theme.colors.muted }}>
              {t('home.activeEmpty')}
            </AppText>
            <Button
              label={t('home.startNew')}
              onPress={() => navigation.navigate('PlayTab', { screen: 'NewGame' })}
            />
          </View>
        )}
      </Card>

      <Card style={styles.card}>
        <AppText variant="label" style={{ color: theme.colors.muted }}>
          {t('home.quickStats')}
        </AppText>
        <View style={styles.statsRow}>
          <View>
            <AppText variant="subtitle">{stats?.completed ?? 0}</AppText>
            <AppText style={{ color: theme.colors.muted }}>{t('home.completed')}</AppText>
          </View>
          <View>
            <AppText variant="subtitle">{stats?.total ?? 0}</AppText>
            <AppText style={{ color: theme.colors.muted }}>{t('home.total')}</AppText>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <AppText variant="label" style={{ color: theme.colors.muted }}>
          {t('home.recentHistory')}
        </AppText>
        {recent.length === 0 ? (
          <AppText style={{ color: theme.colors.muted }}>{t('history.empty')}</AppText>
        ) : (
          recent.map((game) => (
            <View
              key={game.id}
              style={[styles.historyRow, { borderBottomColor: theme.colors.border }]}
            >
              <View>
                <AppText variant="subtitle" style={{ fontSize: 16 }}>
                  {t(`difficulty.${game.difficulty}`)}
                </AppText>
                <AppText style={{ color: theme.colors.muted }}>
                  {formatDate(game.updatedAt)} ·{' '}
                  {formatDuration(Number(game.durationSec ?? 0))}
                </AppText>
              </View>
              <AppText variant="label" style={{ color: theme.colors.muted }}>
                {t(`status.${game.status}`)}
              </AppText>
            </View>
          ))
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 12,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
