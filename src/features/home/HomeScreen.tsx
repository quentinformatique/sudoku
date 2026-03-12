import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAppTheme } from '../../core/providers/ThemeProvider';
import { Screen } from '../../components/layout/Screen';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { getStats, listGames } from '../../data/repositories/gameRepository';
import { formatDuration, formatDate } from '../../utils/time';
import { useGameStore } from '../game/gameStore';

export const HomeScreen = () => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const record = useGameStore((state) => state.record);
  const activeRecord = record?.status === 'active' ? record : null;
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
    <Screen 
      title={t('home.title')} 
      subtitle={t('home.subtitle')}
      scroll
    >
      <View style={styles.maxWidthWrapper}>
        <AppText variant="label" style={styles.sectionTitle}>
          {t('home.activeTitle')}
        </AppText>
        
        <Card style={styles.card}>
          {activeRecord ? (
            <Pressable 
              onPress={() => navigation.navigate('PlayTab', { screen: 'Continue' })}
              style={styles.activeRow}
            >
              <View style={styles.activeInfo}>
                <AppText variant="subtitle" style={{ fontSize: 18 }}>
                  {t(`difficulty.${activeRecord.difficulty}`)}
                </AppText>
                <AppText style={{ color: theme.colors.muted, marginTop: 4 }}>
                  {formatDuration(activeRecord.durationSec)}
                </AppText>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { backgroundColor: theme.colors.accent, width: `${Math.min(100, (activeRecord.moves / 81) * 100)}%` }
                      ]} 
                    />
                  </View>
                  <AppText style={styles.progressText}>
                    {Math.round((activeRecord.moves / 81) * 100)}%
                  </AppText>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.muted} />
            </Pressable>
          ) : (
            <Pressable 
              onPress={() => navigation.navigate('PlayTab', { screen: 'NewGame' })}
              style={styles.emptyActive}
            >
              <AppText style={{ color: theme.colors.muted }}>{t('home.activeEmpty')}</AppText>
              <AppText variant="subtitle" style={{ color: theme.colors.accent, marginTop: 4 }}>
                {t('home.startNew')}
              </AppText>
            </Pressable>
          )}
        </Card>

        <AppText variant="label" style={[styles.sectionTitle, { marginTop: 24 }]}>
          {t('home.quickStats')}
        </AppText>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <AppText variant="title" style={{ fontSize: 24 }}>{stats?.completed ?? 0}</AppText>
            <AppText variant="label" style={{ color: theme.colors.muted }}>{t('home.completed')}</AppText>
          </Card>
          <Card style={styles.statCard}>
            <AppText variant="title" style={{ fontSize: 24 }}>{stats?.total ?? 0}</AppText>
            <AppText variant="label" style={{ color: theme.colors.muted }}>{t('home.total')}</AppText>
          </Card>
        </View>

        <AppText variant="label" style={[styles.sectionTitle, { marginTop: 24 }]}>
          {t('home.recentHistory')}
        </AppText>
        <Card style={[styles.card, { padding: 0 }]}>
          {recent.length === 0 ? (
            <View style={{ padding: 16 }}>
              <AppText style={{ color: theme.colors.muted }}>{t('history.empty')}</AppText>
            </View>
          ) : (
            recent.map((game, index) => (
              <View
                key={game.id}
                style={[
                  styles.historyRow, 
                  { borderBottomColor: theme.colors.border },
                  index === recent.length - 1 && { borderBottomWidth: 0 }
                ]}
              >
                <View>
                  <AppText variant="subtitle" style={{ fontSize: 16 }}>
                    {t(`difficulty.${game.difficulty}`)}
                  </AppText>
                  <AppText style={{ color: theme.colors.muted, fontSize: 13, marginTop: 2 }}>
                    {formatDate(game.updatedAt)} · {formatDuration(Number(game.durationSec ?? 0))}
                  </AppText>
                </View>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: theme.colors.border }
                ]}>
                  <AppText style={{ fontSize: 10, color: theme.colors.muted }}>
                    {t(`status.${game.status}`).toUpperCase()}
                  </AppText>
                </View>
              </View>
            ))
          )}
        </Card>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  maxWidthWrapper: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    color: '#888',
    marginBottom: 8,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  card: {
    padding: 16,
    borderRadius: 16,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  activeInfo: {
    flex: 1,
  },
  emptyActive: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    width: 28,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
