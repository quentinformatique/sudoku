import { cloneGrid, getCandidates, isComplete } from './grid';

const findBestEmpty = (grid: number[]) => {
  let bestIndex = -1;
  let bestCandidates: number[] = [];
  for (let i = 0; i < grid.length; i += 1) {
    if (grid[i] === 0) {
      const candidates = getCandidates(grid, i);
      if (candidates.length === 0) {
        return { index: i, candidates };
      }
      if (bestIndex === -1 || candidates.length < bestCandidates.length) {
        bestIndex = i;
        bestCandidates = candidates;
        if (bestCandidates.length === 1) {
          break;
        }
      }
    }
  }
  return { index: bestIndex, candidates: bestCandidates };
};

export const solveSudoku = (grid: number[]) => {
  const working = cloneGrid(grid);
  const solveRecursive = () => {
    if (isComplete(working)) {
      return true;
    }
    const { index, candidates } = findBestEmpty(working);
    if (index === -1 || candidates.length === 0) {
      return false;
    }
    for (const candidate of candidates) {
      working[index] = candidate;
      if (solveRecursive()) {
        return true;
      }
      working[index] = 0;
    }
    return false;
  };

  const solved = solveRecursive();
  return solved ? working : null;
};

export const countSolutions = (grid: number[], limit = 2) => {
  const working = cloneGrid(grid);
  let count = 0;

  const solveRecursive = () => {
    if (count >= limit) {
      return;
    }
    if (isComplete(working)) {
      count += 1;
      return;
    }
    const { index, candidates } = findBestEmpty(working);
    if (index === -1 || candidates.length === 0) {
      return;
    }
    for (const candidate of candidates) {
      working[index] = candidate;
      solveRecursive();
      working[index] = 0;
      if (count >= limit) {
        return;
      }
    }
  };

  solveRecursive();
  return count;
};
