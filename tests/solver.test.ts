import { solveSudoku } from '../src/features/game/engine/solver';
import { isValidGrid } from '../src/features/game/engine/validator';

const puzzle = [
  5, 3, 0, 0, 7, 0, 0, 0, 0, 6, 0, 0, 1, 9, 5, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 6, 0, 8, 0,
  0, 0, 6, 0, 0, 0, 3, 4, 0, 0, 8, 0, 3, 0, 0, 1, 7, 0, 0, 0, 2, 0, 0, 0, 6, 0, 6, 0, 0,
  0, 0, 2, 8, 0, 0, 0, 0, 4, 1, 9, 0, 0, 5, 0, 0, 0, 0, 8, 0, 0, 7, 9,
];

test('solver returns a valid completed grid', () => {
  const solved = solveSudoku(puzzle);
  expect(solved).not.toBeNull();
  expect(solved?.every((value) => value !== 0)).toBe(true);
  expect(isValidGrid(solved ?? [])).toBe(true);
});
