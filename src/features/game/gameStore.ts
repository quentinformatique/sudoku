import { create } from 'zustand';

import { Difficulty } from './engine/difficulty';
import { generatePuzzle } from './engine/generator';
import { countIncorrectCells } from './engine/validator';
import { GameRecord, MoveEntry, PersistedGameState } from './types';
import { getActiveGame, saveGame } from '../../data/repositories/gameRepository';
import { createId } from '../../utils/id';
import { useSettingsStore } from '../settings/settingsStore';

const emptyNotes = () => Array.from({ length: 81 }, () => [] as number[]);

type GameStore = {
  record: GameRecord | null;
  grid: number[];
  notes: number[][];
  selectedIndex: number | null;
  mode: 'pen' | 'pencil';
  undoStack: MoveEntry[];
  redoStack: MoveEntry[];
  elapsedSec: number;
  isPaused: boolean;
  hydrate: () => Promise<void>;
  startNewGame: (difficulty: Difficulty) => Promise<void>;
  loadGame: (record: GameRecord, state: PersistedGameState | null) => void;
  selectCell: (index: number | null) => void;
  setMode: (mode: 'pen' | 'pencil') => void;
  inputNumber: (value: number) => void;
  erase: () => void;
  undo: () => void;
  redo: () => void;
  resetPuzzle: () => void;
  newPuzzle: () => Promise<void>;
  tick: () => void;
  setPaused: (paused: boolean) => void;
  completeIfValid: () => { completed: boolean; incorrect: number };
  persist: () => Promise<void>;
};

const createRecord = (
  difficulty: Difficulty,
  puzzle: number[],
  solution: number[],
): GameRecord => {
  const now = Date.now();
  return {
    id: createId(),
    difficulty,
    puzzle,
    solution,
    status: 'active',
    startedAt: now,
    updatedAt: now,
    completedAt: null,
    durationSec: 0,
    mistakes: 0,
    moves: 0,
  };
};

const toPersistedState = (state: GameStore): PersistedGameState => ({
  grid: state.grid,
  notes: state.notes,
  elapsedSec: state.elapsedSec,
  mode: state.mode,
  selectedIndex: state.selectedIndex,
});

export const useGameStore = create<GameStore>((set, get) => ({
  record: null,
  grid: [],
  notes: [],
  selectedIndex: null,
  mode: 'pen',
  undoStack: [],
  redoStack: [],
  elapsedSec: 0,
  isPaused: false,
  hydrate: async () => {
    const active = await getActiveGame();
    if (active) {
      get().loadGame(active.record, active.state);
    } else {
      set({ record: null, grid: [], notes: [], elapsedSec: 0, selectedIndex: null });
    }
  },
  startNewGame: async (difficulty) => {
    const existing = get().record;
    if (existing && existing.status === 'active') {
      const abandoned: GameRecord = {
        ...existing,
        status: 'abandoned',
        updatedAt: Date.now(),
        durationSec: get().elapsedSec,
      };
      await saveGame(abandoned, toPersistedState(get()));
    }
    const { puzzle, solution } = generatePuzzle(difficulty);
    const record = createRecord(difficulty, puzzle, solution);
    set({
      record,
      grid: [...puzzle],
      notes: emptyNotes(),
      selectedIndex: null,
      mode: 'pen',
      undoStack: [],
      redoStack: [],
      elapsedSec: 0,
      isPaused: false,
    });
    await saveGame(record, toPersistedState(get()));
  },
  loadGame: (record, state) => {
    const safeNotes =
      state?.notes && state.notes.length === 81 ? state.notes : emptyNotes();
    set({
      record,
      grid: state?.grid && state.grid.length === 81 ? state.grid : [...record.puzzle],
      notes: safeNotes,
      elapsedSec: state?.elapsedSec ?? record.durationSec,
      mode: state?.mode ?? 'pen',
      selectedIndex: state?.selectedIndex ?? null,
      undoStack: [],
      redoStack: [],
      isPaused: false,
    });
  },
  selectCell: (index) => {
    set({ selectedIndex: index });
  },
  setMode: (mode) => {
    set({ mode });
  },
  inputNumber: (value) => {
    const { record, selectedIndex, grid, notes, mode } = get();
    if (!record || selectedIndex === null) return;
    if (record.status !== 'active') return;
    if (record.puzzle[selectedIndex] !== 0) return;

    const prevValue = grid[selectedIndex] ?? 0;
    const prevNotes = [...(notes[selectedIndex] ?? [])];
    const nextNotes =
      mode === 'pencil'
        ? prevNotes.includes(value)
          ? prevNotes.filter((n) => n !== value)
          : [...prevNotes, value]
        : [];
    nextNotes.sort((a, b) => a - b);
    const nextValue = mode === 'pen' ? value : prevValue;

    if (mode === 'pen' && prevValue === value) {
      return;
    }

    const move: MoveEntry = {
      index: selectedIndex,
      prevValue,
      nextValue,
      prevNotes,
      nextNotes,
    };

    const nextGrid = [...grid];
    nextGrid[selectedIndex] = nextValue;
    const nextNotesGrid = [...notes];
    nextNotesGrid[selectedIndex] = nextNotes;

    const settings = useSettingsStore.getState();
    const isMistake =
      settings.errorFeedback === 'instant' &&
      mode === 'pen' &&
      nextValue !== 0 &&
      nextValue !== (record.solution[selectedIndex] ?? 0);

    const updatedRecord: GameRecord = {
      ...record,
      updatedAt: Date.now(),
      moves: record.moves + (mode === 'pen' ? 1 : 0),
      mistakes: record.mistakes + (isMistake ? 1 : 0),
      durationSec: get().elapsedSec,
    };

    set({
      record: updatedRecord,
      grid: nextGrid,
      notes: nextNotesGrid,
      undoStack: [...get().undoStack, move],
      redoStack: [],
    });
    void get().persist();
  },
  erase: () => {
    const { record, selectedIndex, grid, notes } = get();
    if (!record || selectedIndex === null) return;
    if (record.status !== 'active') return;
    if (record.puzzle[selectedIndex] !== 0) return;
    const prevValue = grid[selectedIndex] ?? 0;
    const cellNotes = [...(notes[selectedIndex] ?? [])];
    if (prevValue === 0 && cellNotes.length === 0) return;
    const move: MoveEntry = {
      index: selectedIndex,
      prevValue,
      nextValue: 0,
      prevNotes: cellNotes,
      nextNotes: [],
    };
    const nextGrid = [...grid];
    nextGrid[selectedIndex] = 0;
    const nextNotesGrid = [...notes];
    nextNotesGrid[selectedIndex] = [];
    const updatedRecord: GameRecord = {
      ...record,
      updatedAt: Date.now(),
      durationSec: get().elapsedSec,
    };
    set({
      record: updatedRecord,
      grid: nextGrid,
      notes: nextNotesGrid,
      undoStack: [...get().undoStack, move],
      redoStack: [],
    });
    void get().persist();
  },
  undo: () => {
    const { undoStack, redoStack, grid, notes, record } = get();
    if (!record || undoStack.length === 0) return;
    if (record.status !== 'active') return;
    const move = undoStack[undoStack.length - 1];
    if (!move) return;
    const nextGrid = [...grid];
    nextGrid[move.index] = move.prevValue;
    const nextNotes = [...notes];
    nextNotes[move.index] = [...move.prevNotes];
    set({
      grid: nextGrid,
      notes: nextNotes,
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, move],
    });
    void get().persist();
  },
  redo: () => {
    const { undoStack, redoStack, grid, notes, record } = get();
    if (!record || redoStack.length === 0) return;
    if (record.status !== 'active') return;
    const move = redoStack[redoStack.length - 1];
    if (!move) return;
    const nextGrid = [...grid];
    nextGrid[move.index] = move.nextValue;
    const nextNotes = [...notes];
    nextNotes[move.index] = [...move.nextNotes];
    set({
      grid: nextGrid,
      notes: nextNotes,
      undoStack: [...undoStack, move],
      redoStack: redoStack.slice(0, -1),
    });
    void get().persist();
  },
  resetPuzzle: () => {
    const record = get().record;
    if (!record) return;
    const updated: GameRecord = {
      ...record,
      updatedAt: Date.now(),
      durationSec: 0,
      mistakes: 0,
      moves: 0,
    };
    set({
      record: updated,
      grid: [...record.puzzle],
      notes: emptyNotes(),
      selectedIndex: null,
      undoStack: [],
      redoStack: [],
      elapsedSec: 0,
    });
    void get().persist();
  },
  newPuzzle: async () => {
    const record = get().record;
    if (!record) return;
    await get().startNewGame(record.difficulty);
  },
  tick: () => {
    const { isPaused, record } = get();
    if (isPaused || !record || record.status !== 'active') {
      return;
    }
    set({ elapsedSec: get().elapsedSec + 1 });
  },
  setPaused: (paused) => {
    set({ isPaused: paused });
  },
  completeIfValid: () => {
    const { record, grid, elapsedSec } = get();
    if (!record) return { completed: false, incorrect: 0 };
    const incorrect = countIncorrectCells(grid, record.solution);
    const completed = incorrect === 0 && grid.every((value) => value !== 0);
    if (completed) {
      const updated: GameRecord = {
        ...record,
        status: 'completed',
        completedAt: Date.now(),
        updatedAt: Date.now(),
        durationSec: elapsedSec,
      };
      set({ record: updated });
      void saveGame(updated, toPersistedState(get()));
      return { completed: true, incorrect: 0 };
    }
    return { completed: false, incorrect };
  },
  persist: async () => {
    const state = get();
    if (!state.record) return;
    const updated = {
      ...state.record,
      durationSec: state.elapsedSec,
      updatedAt: Date.now(),
    };
    set({ record: updated });
    await saveGame(updated, toPersistedState(state));
  },
}));
