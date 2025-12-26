import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { difficultyConfig, Difficulty } from '../engine/difficulty';
import { useGameStore } from '../gameStore';

export const NewGameScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const [selected, setSelected] = useState<Difficulty>('beginner');
  const startNewGame = useGameStore((state) => state.startNewGame);

  const handleStart = async () => {
    await startNewGame(selected);
    navigation.navigate('Game', { source: 'new' });
  };

  return (
    <Screen scroll>
      <AppText variant="title">{t('play.newGame')}</AppText>
      <AppText>{t('play.newHint')}</AppText>

      <View style={styles.list}>
        {Object.entries(difficultyConfig).map(([key, config]) => {
          const value = key as Difficulty;
          const isActive = value === selected;
          return (
            <Card
              key={value}
              style={[
                styles.card,
                {
                  borderWidth: isActive ? 2 : 1,
                  borderColor: isActive ? theme.colors.accent : theme.colors.border,
                },
              ]}
            >
              <AppText variant="subtitle">{t(`difficulty.${value}`)}</AppText>
              <AppText>
                {t('play.clues', { min: config.minClues, max: config.maxClues })}
              </AppText>
              <Button
                label={isActive ? t('common.done') : t('common.apply')}
                onPress={() => {
                  setSelected(value);
                }}
                variant={isActive ? 'primary' : 'secondary'}
                style={styles.button}
              />
            </Card>
          );
        })}
      </View>
      <View style={styles.actions}>
        <Button label={t('play.start')} onPress={handleStart} />
        <Button
          label={t('play.continue')}
          onPress={() => navigation.navigate('Continue')}
          variant="secondary"
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  list: {
    marginTop: 16,
    gap: 12,
  },
  card: {
    gap: 8,
  },
  button: {
    alignSelf: 'flex-start',
  },
  actions: {
    marginTop: 16,
    gap: 12,
  },
});
