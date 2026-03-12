import { difficultyConfig, Difficulty } from '../src/features/game/engine/difficulty';
import { generatePuzzle } from '../src/features/game/engine/generator';
import { countSolutions, solveSudoku } from '../src/features/game/engine/solver';
import { isValidGrid } from '../src/features/game/engine/validator';

const difficulties: Difficulty[] = ['beginner', 'intermediate', 'hard', 'expert'];

difficulties.forEach((difficulty) => {
  test(`generator creates a valid ${difficulty} puzzle`, () => {
    const { puzzle, solution } = generatePuzzle(difficulty, 1200);
    expect(puzzle).toHaveLength(81);
    expect(solution).toHaveLength(81);
    const clues = puzzle.filter((value) => value !== 0).length;
    const config = difficultyConfig[difficulty];
    expect(clues).toBeGreaterThanOrEqual(config.minClues - 2);
    expect(clues).toBeLessThanOrEqual(config.maxClues + 2);
    expect(isValidGrid(solution)).toBe(true);
    const solved = solveSudoku(puzzle);
    expect(solved).not.toBeNull();
    expect(countSolutions(puzzle, 2)).toBe(1);
  });
});
