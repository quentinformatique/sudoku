import { Difficulty } from './engine/difficulty';

export type GameStatus = 'active' | 'completed' | 'abandoned' | 'lost';

export type GameRecord = {
  id: string;
  difficulty: Difficulty;
  puzzle: number[];
  solution: number[];
  status: 'active' | 'completed' | 'abandoned' | 'lost';
  startedAt: number;
  updatedAt: number;
  completedAt: number | null;
  durationSec: number;
  mistakes: number;
  moves: number;
  hintsRemaining: number;
};

export type PersistedGameState = {
  grid: number[];
  notes: number[][];
  elapsedSec: number;
  mode: 'pen' | 'pencil';
  selectedIndex: number | null;
};

export type MoveEntry = {
  index: number;
  prevValue: number;
  nextValue: number;
  prevNotes: number[]; // notes of the target cell
  nextNotes: number[]; // notes of the target cell
  prevNotesGrid?: number[][]; // snapshot for Smart Notes undo
  nextNotesGrid?: number[][]; // snapshot for Smart Notes redo
};
