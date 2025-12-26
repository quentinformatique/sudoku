import { Difficulty } from './engine/difficulty';

export type GameStatus = 'idle' | 'active' | 'completed';

export type GameRecord = {
  id: string;
  difficulty: Difficulty;
  puzzle: number[];
  solution: number[];
  status: 'active' | 'completed' | 'abandoned';
  startedAt: number;
  updatedAt: number;
  completedAt: number | null;
  durationSec: number;
  mistakes: number;
  moves: number;
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
  prevNotes: number[];
  nextNotes: number[];
};
