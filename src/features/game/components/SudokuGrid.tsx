import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
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
  }) => {
    const theme = useAppTheme();
    const selectedValue = selectedIndex !== null ? (grid[selectedIndex] ?? 0) : 0;
    const selectedRow = selectedIndex !== null ? getRow(selectedIndex) : -1;
    const selectedCol = selectedIndex !== null ? getCol(selectedIndex) : -1;
    const selectedBox = selectedIndex !== null ? indexToBox(selectedIndex) : -1;

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
          const isRelated =
            selectedIndex !== null &&
            (row === selectedRow || col === selectedCol || box === selectedBox);
          const isSameNumber = selectedValue !== 0 && value === selectedValue;
          const isFixed = puzzle[index] !== 0;
          const cellNotes = notes[index] ?? [];
          const solutionValue = solution[index] ?? 0;
          const isError = showErrors && value !== 0 && value !== solutionValue;
          const showNotes = value === 0 && cellNotes.length > 0;

          return (
            <Pressable
              key={index}
              onPress={() => {
                onSelect(index);
              }}
              style={[
                styles.cell,
                {
                  backgroundColor: isSelected
                    ? theme.colors.accentSoft
                    : isRelated
                      ? `${theme.colors.border}55`
                      : 'transparent',
                  borderColor: theme.colors.border,
                  borderRightWidth: (col + 1) % 3 === 0 && col !== 8 ? 2 : 1,
                  borderBottomWidth: (row + 1) % 3 === 0 && row !== 8 ? 2 : 1,
                },
              ]}
            >
              {showNotes ? (
                <View style={styles.notes}>
                  {Array.from({ length: 9 }, (_, noteIndex) => {
                    const noteValue = noteIndex + 1;
                    const active = cellNotes.includes(noteValue);
                    return (
                      <AppText
                        key={noteValue}
                        style={{
                          fontSize: largeNumbers ? 12 : 10,
                          color: active ? theme.colors.muted : 'transparent',
                        }}
                      >
                        {noteValue}
                      </AppText>
                    );
                  })}
                </View>
              ) : (
                <AppText
                  variant="subtitle"
                  style={{
                    fontSize: largeNumbers ? 28 : 22,
                    color: isError
                      ? theme.colors.danger
                      : isFixed
                        ? theme.colors.text
                        : isSameNumber
                          ? theme.colors.accent
                          : theme.colors.text,
                    fontFamily: isFixed
                      ? theme.typography.fontFamily.semibold
                      : theme.typography.fontFamily.medium,
                  }}
                >
                  {value !== 0 ? value : ''}
                </AppText>
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
    borderWidth: 2,
    borderRadius: 18,
    overflow: 'hidden',
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 9}%`,
    height: `${100 / 9}%`,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notes: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
});
