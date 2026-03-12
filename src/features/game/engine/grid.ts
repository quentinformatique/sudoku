export const GRID_SIZE = 9;
export const CELL_COUNT = 81;

export const createEmptyGrid = () => Array(CELL_COUNT).fill(0);

export const cloneGrid = (grid: number[]) => [...grid];

export const getRow = (index: number) => Math.floor(index / GRID_SIZE);
export const getCol = (index: number) => index % GRID_SIZE;

export const getBoxStart = (index: number) => {
  const row = getRow(index);
  const col = getCol(index);
  return {
    row: Math.floor(row / 3) * 3,
    col: Math.floor(col / 3) * 3,
  };
};

export const isValidPlacement = (grid: number[], index: number, value: number) => {
  const row = getRow(index);
  const col = getCol(index);
  for (let i = 0; i < GRID_SIZE; i += 1) {
    if (grid[row * GRID_SIZE + i] === value) return false;
    if (grid[i * GRID_SIZE + col] === value) return false;
  }
  const start = getBoxStart(index);
  for (let r = start.row; r < start.row + 3; r += 1) {
    for (let c = start.col; c < start.col + 3; c += 1) {
      if (grid[r * GRID_SIZE + c] === value) return false;
    }
  }
  return true;
};

export const findEmptyIndex = (grid: number[]) => grid.findIndex((value) => value === 0);

export const isComplete = (grid: number[]) => grid.every((value) => value !== 0);

export const getCandidates = (grid: number[], index: number) => {
  if (grid[index] !== 0) return [];
  const candidates: number[] = [];
  for (let value = 1; value <= 9; value += 1) {
    if (isValidPlacement(grid, index, value)) {
      candidates.push(value);
    }
  }
  return candidates;
};
