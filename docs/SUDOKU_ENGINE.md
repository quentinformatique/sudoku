# Sudoku Engine

The engine lives in `src/features/game/engine` and is fully unit tested.

## Solver

- Backtracking solver with a Most-Restricted-Variable heuristic (MRV).
- Uses candidate generation to select the tightest empty cell first.
- Returns the first valid solution or `null` if unsolvable.

## Uniqueness

- `countSolutions` explores the search tree with an early exit once more than one solution is found.
- The generator uses this to ensure puzzles remain uniquely solvable.

## Generator

1. Create a fully solved grid using randomized backtracking.
2. Remove clues in random order while maintaining uniqueness.
3. Regenerate if the process exceeds a time budget.

Difficulty impacts the target clue count:
- Beginner: 40–45
- Intermediate: 32–38
- Hard: 26–31
- Expert: 22–25
