import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { Card } from '../../../components/ui/Card';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { listGames } from '../../../data/repositories/gameRepository';
import { formatDateTime, formatDuration } from '../../../utils/time';
import { Difficulty } from '../../game/engine/difficulty';

const difficultyOptions: { labelKey: string; value: Difficulty | 'all' }[] = [
  { labelKey: 'common.all', value: 'all' },
  { labelKey: 'difficulty.beginner', value: 'beginner' },
  { labelKey: 'difficulty.intermediate', value: 'intermediate' },
  { labelKey: 'difficulty.hard', value: 'hard' },
  { labelKey: 'difficulty.expert', value: 'expert' },
];

const statusOptions: {
  labelKey: string;
  value: 'all' | 'active' | 'completed' | 'abandoned' | 'lost';
}[] = [
  { labelKey: 'common.all', value: 'all' },
  { labelKey: 'status.active', value: 'active' },
  { labelKey: 'status.completed', value: 'completed' },
  { labelKey: 'status.abandoned', value: 'abandoned' },
  { labelKey: 'status.lost', value: 'lost' },
];

export const HistoryScreen = () => {
  const { t } = useTranslation();
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [status, setStatus] = useState<
    'all' | 'active' | 'completed' | 'abandoned' | 'lost'
  >('all');
  const [games, setGames] = useState<any[]>([]);

  const difficultyLabels = useMemo(
    () =>
      difficultyOptions.map((option) => ({
        label: t(option.labelKey),
        value: option.value,
      })),
    [t],
  );
  const statusLabels = useMemo(
    () =>
      statusOptions.map((option) => ({
        label: t(option.labelKey),
        value: option.value,
      })),
    [t],
  );

  const loadGames = useCallback(async () => {
    const rows = await listGames({
      difficulty,
      status: status === 'all' ? undefined : status,
    });
    setGames(rows);
  }, [difficulty, status]);

  useFocusEffect(
    useCallback(() => {
      void loadGames();
    }, [loadGames]),
  );

  return (
    <Screen>
      <AppText variant="title">{t('history.title')}</AppText>
      <Card style={styles.card}>
        <AppText variant="label">{t('history.filterDifficulty')}</AppText>
        <SegmentedControl
          options={difficultyLabels}
          value={difficulty}
          onChange={setDifficulty}
        />
        <AppText variant="label" style={styles.label}>
          {t('history.filterStatus')}
        </AppText>
        <SegmentedControl options={statusLabels} value={status} onChange={setStatus} />
      </Card>

      {games.length === 0 ? (
        <Card style={styles.card}>
          <AppText>{t('history.empty')}</AppText>
        </Card>
      ) : (
        games.map((game) => (
          <Card key={game.id} style={styles.card}>
            <View style={styles.row}>
              <View>
                <AppText variant="subtitle">{t(`difficulty.${game.difficulty}`)}</AppText>
                <AppText>{formatDateTime(game.updatedAt)}</AppText>
              </View>
              <View>
                <AppText variant="label">{t(`status.${game.status}`)}</AppText>
                <AppText>{formatDuration(Number(game.durationSec ?? 0))}</AppText>
              </View>
            </View>
          </Card>
        ))
      )}
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
    justifyContent: 'space-between',
    gap: 16,
  },
  label: {
    marginTop: 12,
  },
});
