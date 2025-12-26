import { useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useSnackbar } from '../../../app/providers/SnackbarProvider';
import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { playClick, triggerHaptic } from '../../../utils/feedback';
import { isTabletWidth } from '../../../utils/layout';
import { formatDuration } from '../../../utils/time';
import { useSettingsStore } from '../../settings/settingsStore';
import { Keypad } from '../components/Keypad';
import { SudokuGrid } from '../components/SudokuGrid';
import { useGameStore } from '../gameStore';

export const GameScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
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
  const resetPuzzle = useGameStore((state) => state.resetPuzzle);
  const newPuzzle = useGameStore((state) => state.newPuzzle);
  const tick = useGameStore((state) => state.tick);
  const setPaused = useGameStore((state) => state.setPaused);
  const completeIfValid = useGameStore((state) => state.completeIfValid);
  const persist = useGameStore((state) => state.persist);

  const { soundEnabled, hapticsEnabled, errorFeedback, largeNumbers } =
    useSettingsStore();

  const lastCompletedRef = useRef<string | null>(null);
  const lastWarningRef = useRef<string | null>(null);

  const contentPadding = 20;
  const contentWidth = Math.max(0, width - contentPadding * 2);
  const isLandscape = width > height;
  const useSidePanel =
    (contentWidth >= 900 ||
      (isTabletWidth(width) && isLandscape && contentWidth >= 720)) &&
    height >= 640;
  const sidePanelWidth = useSidePanel
    ? Math.min(360, Math.max(280, Math.floor(contentWidth * 0.38)))
    : contentWidth;
  const boardMaxWidth = useSidePanel
    ? Math.max(0, contentWidth - sidePanelWidth - 16)
    : contentWidth;
  const boardSize = useSidePanel
    ? Math.min(boardMaxWidth, height - 180)
    : Math.min(boardMaxWidth, 420);

  const modeOptions = useMemo<{ label: string; value: 'pen' | 'pencil' }[]>(
    () => [
      { label: t('game.pen'), value: 'pen' },
      { label: t('game.pencil'), value: 'pencil' },
    ],
    [t],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [tick]);

  useEffect(() => {
    if (!record || record.status !== 'active') return;
    const interval = setInterval(() => {
      void persist();
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, [record, persist]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      setPaused(state !== 'active');
      if (state !== 'active') {
        void persist();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [setPaused, persist]);

  useEffect(() => {
    if (!record) return;
    if (record.status !== 'active') return;
    const filled = grid.every((value) => value !== 0);
    if (!filled) {
      lastWarningRef.current = null;
      return;
    }

    const result = completeIfValid();
    if (result.completed) {
      if (lastCompletedRef.current !== record.id) {
        snackbar.show(t('game.complete'));
        lastCompletedRef.current = record.id;
      }
      return;
    }
    if (errorFeedback === 'free') {
      if (lastWarningRef.current !== record.id) {
        snackbar.show(t('game.freeModeWarning'));
        lastWarningRef.current = record.id;
      }
    } else if (result.incorrect > 0) {
      snackbar.show(t('game.incorrectSummary', { count: result.incorrect }));
    }
  }, [grid, record, errorFeedback, completeIfValid, snackbar, t]);

  const handleNumber = async (value: number) => {
    inputNumber(value);
    await Promise.all([playClick(soundEnabled), triggerHaptic(hapticsEnabled)]);
  };

  if (!record) {
    return (
      <Screen scroll>
        <AppText variant="title">{t('game.title')}</AppText>
        <AppText>{t('play.noActive')}</AppText>
        <Button
          label={t('play.newGame')}
          onPress={() => navigation.navigate('NewGame')}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll={!useSidePanel}>
      <View
        style={[styles.header, useSidePanel ? styles.headerRow : styles.headerColumn]}
      >
        <View>
          <AppText variant="subtitle">{t(`difficulty.${record.difficulty}`)}</AppText>
          <AppText style={styles.timerText}>
            {t('game.timer')} - {formatDuration(elapsedSec)}
            {isPaused ? ` - ${t('game.pause')}` : ''}
          </AppText>
        </View>
        <View style={[styles.headerButtons, !useSidePanel && styles.headerButtonsStack]}>
          <Button label={t('game.reset')} variant="secondary" onPress={resetPuzzle} />
          <Button label={t('game.newPuzzle')} variant="ghost" onPress={newPuzzle} />
        </View>
      </View>

      <View style={[styles.body, useSidePanel ? styles.bodySide : styles.bodyStack]}>
        <View style={[styles.gridWrap, !useSidePanel && styles.gridStack]}>
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
          />
        </View>
        <View style={[styles.panel, { width: sidePanelWidth }]}>
          <Card style={styles.panelCard}>
            <AppText variant="label">{t('game.notes')}</AppText>
            <SegmentedControl options={modeOptions} value={mode} onChange={setMode} />
          </Card>
          <Keypad
            onNumber={handleNumber}
            onErase={erase}
            onUndo={undo}
            onRedo={redo}
            labels={{
              erase: t('game.erase'),
              undo: t('game.undo'),
              redo: t('game.redo'),
            }}
          />
          <View style={styles.footerRow}>
            <Card style={styles.footerCard}>
              <AppText variant="label">{t('game.mistakes')}</AppText>
              <AppText variant="subtitle">{record.mistakes}</AppText>
            </Card>
            <Card style={styles.footerCard}>
              <AppText variant="label">{t('game.timer')}</AppText>
              <AppText variant="subtitle">{formatDuration(elapsedSec)}</AppText>
            </Card>
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  headerButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerButtonsStack: {
    marginTop: 8,
  },
  timerText: {
    fontSize: 14,
  },
  body: {
    gap: 16,
  },
  bodySide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bodyStack: {
    flexDirection: 'column',
  },
  gridWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridStack: {
    alignSelf: 'center',
  },
  panel: {
    gap: 12,
  },
  panelCard: {
    gap: 10,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  footerCard: {
    flex: 1,
    alignItems: 'center',
  },
});
