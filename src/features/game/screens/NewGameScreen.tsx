import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAppTheme } from '../../../core/providers/ThemeProvider';
import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { difficultyConfig, Difficulty } from '../engine/difficulty';
import { useGameStore } from '../gameStore';

export const NewGameScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const [selected, setSelected] = useState<Difficulty>('beginner');
  const startNewGame = useGameStore((state) => state.startNewGame);
  const record = useGameStore((state) => state.record);
  const hasActive = record?.status === 'active';

  const handleStart = async () => {
    await startNewGame(selected);
    navigation.navigate('Game', { source: 'new' });
  };

  return (
    <Screen 
      title={t('play.newGame')} 
      subtitle={t('play.newHint')}
      scroll
    >
      <View style={styles.list}>
        {Object.entries(difficultyConfig).map(([key, config]) => {
          const value = key as Difficulty;
          const isActive = value === selected;
          return (
            <Pressable
              key={value}
              onPress={() => setSelected(value)}
              style={[
                styles.difficultyCard,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: isActive ? theme.colors.accent : theme.colors.border,
                  borderWidth: isActive ? 1.5 : 1,
                },
              ]}
            >
              <View style={styles.difficultyInfo}>
                <AppText variant="subtitle" style={isActive && { color: theme.colors.accent }}>
                  {t(`difficulty.${value}`)}
                </AppText>
                <AppText style={{ color: theme.colors.muted, fontSize: 13, marginTop: 2 }}>
                  {t('play.clues', { min: config.minClues, max: config.maxClues })}
                </AppText>
              </View>
              {isActive && (
                <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.accent} />
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.actions}>
        <Button 
          label={t('play.start')} 
          onPress={handleStart} 
          style={styles.mainButton}
        />
        
        {hasActive && (
          <Button
            label={t('play.continue')}
            onPress={() => navigation.navigate('Continue')}
            variant="secondary"
          />
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  difficultyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  difficultyInfo: {
    flex: 1,
  },
  actions: {
    marginTop: 32,
    gap: 12,
  },
  mainButton: {
    height: 56,
  },
});
