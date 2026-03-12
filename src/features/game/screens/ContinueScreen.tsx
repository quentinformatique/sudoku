import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../core/providers/ThemeProvider';
import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { formatDuration } from '../../../utils/time';
import { useGameStore } from '../gameStore';

export const ContinueScreen = () => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation<any>();
  const record = useGameStore((state) => state.record);
  const activeRecord = record?.status === 'active' ? record : null;

  return (
    <Screen 
      title={t('play.continue')} 
      subtitle={t('play.continueHint')}
      showBack
    >
      <View style={styles.container}>
        {activeRecord ? (
          <>
            <Card style={styles.card}>
              <View style={styles.info}>
                <AppText variant="subtitle" style={{ fontSize: 20 }}>
                  {t(`difficulty.${activeRecord.difficulty}`)}
                </AppText>
                <AppText style={{ color: theme.colors.muted, marginTop: 4 }}>
                  {formatDuration(activeRecord.durationSec)}
                </AppText>
                
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <AppText variant="label" style={styles.statLabel}>{t('game.mistakes')}</AppText>
                    <AppText>{activeRecord.mistakes}/3</AppText>
                  </View>
                  <View style={styles.statItem}>
                    <AppText variant="label" style={styles.statLabel}>{t('game.moves')}</AppText>
                    <AppText>{activeRecord.moves}</AppText>
                  </View>
                </View>
              </View>
            </Card>
            
            <View style={styles.actions}>
              <Button
                label={t('play.resume')}
                onPress={() => navigation.navigate('Game', { source: 'continue' })}
                style={styles.mainButton}
              />
              <Button
                label={t('game.abandon')}
                onPress={() => navigation.navigate('NewGame')}
                variant="ghost"
                style={{ marginTop: 8 }}
              />
            </View>
          </>
        ) : (
          <View style={styles.empty}>
            <AppText style={{ color: theme.colors.muted, textAlign: 'center' }}>
              {t('play.noActive')}
            </AppText>
            <Button
              label={t('home.startNew')}
              onPress={() => navigation.navigate('NewGame')}
              style={{ marginTop: 24, alignSelf: 'stretch' }}
            />
          </View>
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
  },
  card: {
    padding: 24,
    borderRadius: 20,
  },
  info: {
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 24,
    width: '100%',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#888',
    marginBottom: 4,
  },
  actions: {
    marginTop: 32,
    gap: 12,
  },
  mainButton: {
    height: 56,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
});
