import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, AppState, StyleSheet, useWindowDimensions, View, Pressable } from 'react-native';

import { useSnackbar } from '../../../core/providers/SnackbarProvider';
import { useAppTheme } from '../../../core/providers/ThemeProvider';
import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { playClick, triggerHaptic } from '../../../utils/feedback';
import { formatDuration } from '../../../utils/time';
import { useSettingsStore } from '../../settings/settingsStore';
import { Keypad } from '../components/Keypad';
import { SudokuGrid } from '../components/SudokuGrid';
import { useGameStore } from '../gameStore';

export const GameScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const { width, height } = useWindowDimensions();
  const snackbar = useSnackbar();

  const record = useGameStore((state) => state.record);
  const grid = useGameStore((state) => state.grid);
  const notes = useGameStore((state) => state.notes);
  const selectedIndex = useGameStore((state) => state.selectedIndex);
  const mode = useGameStore((state) => state.mode);
  const elapsedSec = useGameStore((state) => state.elapsedSec);
  const isPaused = useGameStore((state) => state.isPaused);
  const selectCell = useGameStore((state) => state.selectCell);
  const setMode = useGameStore((state) => state.setMode);
  const inputNumber = useGameStore((state) => state.inputNumber);
  const erase = useGameStore((state) => state.erase);
  const undo = useGameStore((state) => state.undo);
  const redo = useGameStore((state) => state.redo);
  const useHint = useGameStore((state) => state.useHint);
  const autoPencil = useGameStore((state) => state.autoPencil);
  const resetPuzzle = useGameStore((state) => state.resetPuzzle);
  const abandonGame = useGameStore((state) => state.abandonGame);
  const clearSession = useGameStore((state) => state.clearSession);
  const tick = useGameStore((state) => state.tick);
  const setPaused = useGameStore((state) => state.setPaused);
  const completeIfValid = useGameStore((state) => state.completeIfValid);
  const persist = useGameStore((state) => state.persist);

  const { soundEnabled, hapticsEnabled, errorFeedback, largeNumbers } = useSettingsStore();
  const mistakeScale = useRef(new Animated.Value(1)).current;

  // Adaptive Layout Logic
  const isLandscape = width > height;
  const isWide = width > 550; 
  const isUltraNarrow = width < 360; // Fold folded is very narrow
  const useSidePanel = isWide && (isLandscape || width / height > 0.7);
  
  // Dynamic padding based on width
  const horizontalPadding = width < 400 ? 16 : 32;
  const verticalReserved = useSidePanel ? 120 : (width < 380 ? 380 : 280); 
  
  const maxAvailableWidth = useSidePanel ? width * 0.55 - horizontalPadding : width - horizontalPadding;
  const maxAvailableHeight = height - verticalReserved;
  
  // On ultra narrow screens, we must prioritize fitting the board
  const boardSize = Math.max(260, Math.min(maxAvailableWidth, maxAvailableHeight, 600));

  const sidePanelWidth = Math.min(width - boardSize - horizontalPadding - 32, 400);
  
  // Responsive keypad config
  const numPerRow = useSidePanel ? 3 : (width < 380 ? 3 : 5);
  const numHeight = useSidePanel ? Math.floor(boardSize / 5) : (width < 380 ? 50 : undefined);

  const showOverlay = record?.status === 'completed' || record?.status === 'lost';
  const overlayTitle = record?.status === 'lost' ? t('game.lossTitle') : t('game.winTitle');
  const overlayBackdrop = theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.92)';

  const modeOptions = useMemo<{ label: string; value: 'pen' | 'pencil' }[]>(() => [
    { label: t('game.pen'), value: 'pen' },
    { label: t('game.pencil'), value: 'pencil' },
  ], [t]);

  const disabledNumbers = useMemo(() => {
    const counts = Array.from({ length: 10 }, () => 0);
    grid.forEach((v) => { if (v > 0) counts[v] = (counts[v] ?? 0) + 1; });
    return counts.reduce<number[]>((acc, count, val) => {
      if (val > 0 && count >= 9) acc.push(val);
      return acc;
    }, []);
  }, [grid]);

  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      setPaused(state !== 'active');
      if (state !== 'active') void persist();
    });
    return () => subscription.remove();
  }, [setPaused, persist]);

  useEffect(() => {
    if (!record || record.status !== 'active') return;
    if (grid.every((v) => v !== 0)) {
      const result = completeIfValid();
      if (result.completed) snackbar.show(t('game.complete'));
      else if (errorFeedback === 'free') snackbar.show(t('game.freeModeWarning'));
      else if (result.incorrect > 0) snackbar.show(t('game.incorrectSummary', { count: result.incorrect }));
    }
  }, [grid, record, errorFeedback, completeIfValid, snackbar, t]);

  const handleNumber = async (val: number) => {
    if (!record || record.status !== 'active') return;
    inputNumber(val);
    await Promise.all([playClick(soundEnabled), triggerHaptic(hapticsEnabled)]);
  };

  const handleAbandon = async () => {
    await abandonGame();
    navigation.navigate('HomeTab');
  };

  const handleBackHome = () => {
    clearSession();
    navigation.navigate('HomeTab');
  };

  if (!record) return null;

  return (
    <Screen 
      title={t(`difficulty.${record.difficulty}`)}
      subtitle={t('game.title')}
      showBack
      scroll={maxAvailableHeight < 350} // Only scroll if really tight
    >
      <View style={styles.container}>
        <View style={styles.topStats}>
          <Animated.View style={[styles.statItem, { transform: [{ scale: mistakeScale }] }]}>
            <AppText variant="label" style={styles.statLabel}>{t('game.mistakes')}</AppText>
            <AppText variant="subtitle" style={styles.statValue}>{record.mistakes}/3</AppText>
          </Animated.View>
          
          <Pressable onPress={() => setPaused(!isPaused)} style={styles.statItem}>
            <AppText variant="label" style={[styles.statLabel, isPaused && { color: theme.colors.accent }]}>
              {isPaused ? t('game.resumePrompt').toUpperCase() : t('game.timer').toUpperCase()}
            </AppText>
            <AppText variant="subtitle" style={[styles.statValue, isPaused && { color: theme.colors.accent }]}>
              {formatDuration(elapsedSec)}
            </AppText>
          </Pressable>

          <View style={styles.statItem}>
            <AppText variant="label" style={styles.statLabel}>{t('game.moves').toUpperCase()}</AppText>
            <AppText variant="subtitle" style={styles.statValue}>{record.moves}</AppText>
          </View>
        </View>

        <View style={[styles.layoutBody, useSidePanel ? styles.layoutSide : styles.layoutStack]}>
          <View style={styles.gridWrapper}>
            <SudokuGrid
              grid={grid}
              notes={notes}
              puzzle={record.puzzle}
              solution={record.solution}
              selectedIndex={selectedIndex}
              onSelect={selectCell}
              showErrors={errorFeedback === 'instant'}
              largeNumbers={largeNumbers}
              size={boardSize}
              isPaused={isPaused}
            />
          </View>

          <View style={[styles.controlsWrapper, useSidePanel ? { width: sidePanelWidth } : { width: '100%' }]}>
            <View style={styles.modeRow}>
              <SegmentedControl options={modeOptions} value={mode} onChange={setMode} />
            </View>
            <Keypad
              onNumber={handleNumber}
              onErase={erase}
              onUndo={undo}
              onRedo={redo}
              onHint={useHint}
              onAutoPencil={autoPencil}
              numPerRow={numPerRow}
              numHeight={numHeight}
              disabledNumbers={disabledNumbers}
              hintsRemaining={record?.hintsRemaining}
              labels={{ 
                erase: t('game.erase'), 
                undo: t('game.undo'), 
                redo: t('game.redo'),
                hint: t('game.hint'),
                autoPencil: t('game.autoPencil'),
              }}
            />
            
            <View style={styles.bottomActions}>
              <Button label={t('game.reset')} variant="ghost" onPress={resetPuzzle} style={styles.smallButton} />
              <Button label={t('game.abandon')} variant="ghost" onPress={handleAbandon} style={styles.smallButton} />
            </View>
          </View>
        </View>

        {showOverlay && (
          <View style={[styles.overlay, { backgroundColor: overlayBackdrop }]}>
            <Card style={styles.overlayCard}>
              <AppText variant="title" style={{ textAlign: 'center' }}>{overlayTitle}</AppText>
              <View style={styles.recapList}>
                <View style={styles.recapRow}>
                  <AppText style={styles.recapLabel}>{t('game.timer')}</AppText>
                  <AppText variant="subtitle">{formatDuration(elapsedSec)}</AppText>
                </View>
                <View style={styles.recapRow}>
                  <AppText style={styles.recapLabel}>{t('game.moves')}</AppText>
                  <AppText variant="subtitle">{record.moves}</AppText>
                </View>
              </View>
              <View style={styles.overlayActions}>
                <Button label={t('game.newGame')} onPress={() => { clearSession(); navigation.navigate('NewGame'); }} />
                <Button label={t('game.backHome')} onPress={handleBackHome} variant="secondary" />
              </View>
            </Card>
          </View>
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
    alignSelf: 'center',
    maxWidth: 1000,
  },
  topStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: 'rgba(128,128,128,0.06)',
    padding: 12,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    letterSpacing: 1,
    color: '#888',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
  },
  layoutBody: {
    flexGrow: 1,
    width: '100%',
    gap: 20,
  },
  layoutSide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layoutStack: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  gridWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsWrapper: {
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 12,
  },
  modeRow: {
    marginBottom: 4,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  smallButton: {
    paddingVertical: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 100,
  },
  overlayCard: {
    width: '100%',
    maxWidth: 320,
    padding: 24,
    gap: 20,
    borderRadius: 20,
  },
  recapList: {
    gap: 10,
  },
  recapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recapLabel: {
    color: '#888',
  },
  overlayActions: {
    gap: 10,
  },
});
