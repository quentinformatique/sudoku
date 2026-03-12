import { difficultyConfig, Difficulty } from './difficulty';
import { cloneGrid, createEmptyGrid, isValidPlacement } from './grid';
import { countSolutions, solveSudoku } from './solver';

const shuffle = <T>(items: T[]) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i]!;
    array[i] = array[j]!;
    array[j] = temp;
  }
  return array;
};

const fillGrid = (grid: number[]) => {
  const index = grid.findIndex((value) => value === 0);
  if (index === -1) {
    return true;
  }
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (const value of numbers) {
    if (isValidPlacement(grid, index, value)) {
      grid[index] = value;
      if (fillGrid(grid)) {
        return true;
      }
      grid[index] = 0;
    }
  }
  return false;
};

export const generateSolvedGrid = () => {
  const grid = createEmptyGrid();
  fillGrid(grid);
  return grid;
};

const createPuzzleFromSolution = (
  solution: number[],
  targetClues: number,
  timeoutAt: number,
) => {
  const puzzle = cloneGrid(solution);
  let clues = puzzle.filter((value) => value !== 0).length;
  const indices = shuffle([...Array(81).keys()]);

  for (const index of indices) {
    if (Date.now() > timeoutAt) {
      return null;
    }
    if (clues <= targetClues) {
      break;
    }
    const backup = puzzle[index] ?? 0;
    puzzle[index] = 0;
    if (countSolutions(puzzle, 2) !== 1) {
      puzzle[index] = backup;
    } else {
      clues -= 1;
    }
  }

  if (clues > targetClues) {
    return null;
  }

  return puzzle;
};

const relaxPuzzle = (solution: number[]) => {
  const puzzle = cloneGrid(solution);
  const indices = shuffle([...Array(81).keys()]);

  for (const index of indices) {
    const backup = puzzle[index] ?? 0;
    puzzle[index] = 0;
    if (countSolutions(puzzle, 2) !== 1) {
      puzzle[index] = backup;
    }
  }
  return puzzle;
};

export const generatePuzzle = (difficulty: Difficulty, timeoutMs = 1500) => {
  const config = difficultyConfig[difficulty];
  const targetClues =
    config.minClues + Math.floor(Math.random() * (config.maxClues - config.minClues + 1));

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const deadline = Date.now() + timeoutMs;
    const solution = generateSolvedGrid();
    const puzzle = createPuzzleFromSolution(solution, targetClues, deadline);
    if (!puzzle) {
      continue;
    }
    const solved = solveSudoku(puzzle);
    if (solved) {
      return { puzzle, solution };
    }
  }

  const fallbackSolution = generateSolvedGrid();
  const fallbackPuzzle = createPuzzleFromSolution(
    fallbackSolution,
    targetClues,
    Number.POSITIVE_INFINITY,
  );
  return {
    puzzle: fallbackPuzzle ?? relaxPuzzle(fallbackSolution),
    solution: fallbackSolution,
  };
};
