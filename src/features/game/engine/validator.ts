import { GRID_SIZE } from './grid';

const hasDuplicates = (values: number[]) => {
  const seen = new Set<number>();
  for (const value of values) {
    if (value === 0) continue;
    if (seen.has(value)) return true;
    seen.add(value);
  }
  return false;
};

export const isValidGrid = (grid: number[]) => {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    const rowValues = grid.slice(row * GRID_SIZE, row * GRID_SIZE + GRID_SIZE);
    if (hasDuplicates(rowValues)) return false;
  }
  for (let col = 0; col < GRID_SIZE; col += 1) {
    const colValues: number[] = [];
    for (let row = 0; row < GRID_SIZE; row += 1) {
      colValues.push(grid[row * GRID_SIZE + col] ?? 0);
    }
    if (hasDuplicates(colValues)) return false;
  }
  for (let boxRow = 0; boxRow < 3; boxRow += 1) {
    for (let boxCol = 0; boxCol < 3; boxCol += 1) {
      const boxValues: number[] = [];
      for (let row = 0; row < 3; row += 1) {
        for (let col = 0; col < 3; col += 1) {
          const index = (boxRow * 3 + row) * GRID_SIZE + (boxCol * 3 + col);
          boxValues.push(grid[index] ?? 0);
        }
      }
      if (hasDuplicates(boxValues)) return false;
    }
  }
  return true;
};

export const countIncorrectCells = (grid: number[], solution: number[]) =>
  grid.reduce((acc, value, index) => {
    if (value === 0) return acc;
    const solved = solution[index] ?? 0;
    return acc + (value === solved ? 0 : 1);
  }, 0);
