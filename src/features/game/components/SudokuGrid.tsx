import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../core/providers/ThemeProvider';
import { AppText } from '../../../components/ui/AppText';
import { getCol, getRow } from '../engine/grid';

const indexToBox = (index: number) => {
  const row = Math.floor(getRow(index) / 3);
  const col = Math.floor(getCol(index) / 3);
  return row * 3 + col;
};

export const SudokuGrid = memo(
  ({
    grid,
    notes,
    puzzle,
    solution,
    selectedIndex,
    onSelect,
    showErrors,
    largeNumbers,
    size,
    isPaused,
  }: {
    grid: number[];
    notes: number[][];
    puzzle: number[];
    solution: number[];
    selectedIndex: number | null;
    onSelect: (index: number) => void;
    showErrors: boolean;
    largeNumbers: boolean;
    size?: number;
    isPaused?: boolean;
  }) => {
    const theme = useAppTheme();
    const selectedValue = selectedIndex !== null ? (grid[selectedIndex] ?? 0) : 0;
    const selectedRow = selectedIndex !== null ? getRow(selectedIndex) : -1;
    const selectedCol = selectedIndex !== null ? getCol(selectedIndex) : -1;
    const selectedBox = selectedIndex !== null ? indexToBox(selectedIndex) : -1;

    if (!grid || grid.length !== 81 || !notes || notes.length !== 81) {
      return null;
    }

    // Pro Noir highlights
    const relatedBg = theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.035)';
    const sameNumberBg = theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
    const selectedBg = theme.colors.accentSoft;

    if (isPaused) {
      return (
        <View
          style={[
            styles.grid,
            { borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
            size ? { width: size, height: size } : null,
            styles.pausedContainer,
          ]}
        >
          <AppText variant="subtitle" style={{ color: theme.colors.muted }}>
            Paused
          </AppText>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.grid,
          { borderColor: theme.colors.border },
          size ? { width: size, height: size } : null,
        ]}
      >
        {grid.map((value, index) => {
          const row = getRow(index);
          const col = getCol(index);
          const box = indexToBox(index);
          const isSelected = index === selectedIndex;
          
          const isRelatedToSelection =
            selectedIndex !== null &&
            (row === selectedRow || col === selectedCol || box === selectedBox);
          
          const isSameNumber = selectedValue !== 0 && value === selectedValue;
          const isFixed = puzzle[index] !== 0;
          const cellNotes = (notes && notes[index]) || [];
          const isError = showErrors && value !== 0 && value !== (solution[index] ?? 0);
          const showNotes = value === 0 && cellNotes.length > 0;

          let backgroundColor = 'transparent';
          if (isRelatedToSelection) backgroundColor = relatedBg;
          if (isSameNumber) backgroundColor = sameNumberBg;
          if (isSelected) backgroundColor = selectedBg;

          return (
            <Pressable
              key={index}
              onPress={() => onSelect(index)}
              style={[
                styles.cell,
                {
                  backgroundColor,
                  borderColor: theme.colors.border,
                  borderRightWidth: (col + 1) % 3 === 0 && col !== 8 ? 2 : 0.5,
                  borderBottomWidth: (row + 1) % 3 === 0 && row !== 8 ? 2 : 0.5,
                },
              ]}
            >
              {showNotes ? (
                <View style={styles.notes}>
                  {Array.from({ length: 9 }, (_, nIdx) => {
                    const nVal = nIdx + 1;
                    const hasNote = cellNotes.includes(nVal);
                    const isNoteHighlighted = selectedValue !== 0 && nVal === selectedValue;
                    return (
                      <View key={nVal} style={styles.noteCell}>
                        {hasNote && (
                          <AppText
                            style={{
                              fontSize: largeNumbers ? 11 : 9,
                              color: isNoteHighlighted ? theme.colors.accent : theme.colors.muted,
                              fontFamily: isNoteHighlighted 
                                ? theme.typography.fontFamily.semibold 
                                : theme.typography.fontFamily.regular,
                            }}
                          >
                            {nVal}
                          </AppText>
                        )}
                      </View>
                    );
                  })}
                </View>
              ) : (
                <AppText
                  style={{
                    fontSize: largeNumbers ? 26 : 22,
                    color: isError
                      ? theme.colors.danger
                      : isFixed
                        ? theme.colors.text
                        : theme.colors.accent,
                    fontFamily: isFixed
                      ? theme.typography.fontFamily.semibold
                      : theme.typography.fontFamily.medium,
                  }}
                >
                  {value !== 0 ? value : ''}
                </AppText>
              )}
              {isSelected && (
                <View 
                  style={[
                    styles.selectionIndicator, 
                    { backgroundColor: theme.colors.accent }
                  ]} 
                />
              )}
            </Pressable>
          );
        })}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  grid: {
    borderWidth: 2.5,
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pausedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    width: `${100 / 9}%`,
    height: `${100 / 9}%`,
    borderWidth: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notes: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
  noteCell: {
    width: '33.333%',
    height: '33.333%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
  },
});
