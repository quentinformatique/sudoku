import { create } from 'zustand';

import { Difficulty } from './engine/difficulty';
import { generatePuzzle } from './engine/generator';
import { countIncorrectCells } from './engine/validator';
import { GameRecord, MoveEntry, PersistedGameState } from './types';
import { getActiveGame, saveGame } from '../../data/repositories/gameRepository';
import { createId } from '../../utils/id';
import { getRow, getCol, getBoxStart, GRID_SIZE, isValidPlacement } from './engine/grid';

const emptyNotes = () => Array.from({ length: 81 }, () => [] as number[]);

const removeNotesAtIndices = (notes: number[][], indices: number[], value: number) => {
  const nextNotes = [...notes];
  indices.forEach((idx) => {
    if (nextNotes[idx]?.includes(value)) {
      nextNotes[idx] = nextNotes[idx].filter((v) => v !== value);
    }
  });
  return nextNotes;
};

const getRelatedIndices = (index: number) => {
  const row = getRow(index);
  const col = getCol(index);
  const start = getBoxStart(index);
  const indices = new Set<number>();

  for (let i = 0; i < GRID_SIZE; i += 1) {
    indices.add(row * GRID_SIZE + i);
    indices.add(i * GRID_SIZE + col);
  }

  for (let r = start.row; r < start.row + 3; r += 1) {
    for (let c = start.col; c < start.col + 3; c += 1) {
      indices.add(r * GRID_SIZE + c);
    }
  }

  indices.delete(index);
  return Array.from(indices);
};

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
  lastTickAt: number | null;
  hydrate: () => Promise<void>;
  startNewGame: (difficulty: Difficulty) => Promise<void>;
  loadGame: (record: GameRecord, state: PersistedGameState | null) => void;
  selectCell: (index: number | null) => void;
  setMode: (mode: 'pen' | 'pencil') => void;
  inputNumber: (value: number) => void;
  erase: () => void;
  undo: () => void;
  redo: () => void;
  useHint: () => void;
  autoPencil: () => void;
  resetPuzzle: () => void;
  newPuzzle: () => Promise<void>;
  retryGame: () => Promise<void>;
  abandonGame: () => Promise<void>;
  clearSession: () => void;
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
    hintsRemaining: 3,
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
  lastTickAt: null,
  hydrate: async () => {
    const active = await getActiveGame();
    if (active) {
      get().loadGame(active.record, active.state);
    } else {
      set({
        record: null,
        grid: [],
        notes: [],
        elapsedSec: 0,
        selectedIndex: null,
        lastTickAt: null,
      });
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
      lastTickAt: Date.now(),
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
      lastTickAt: Date.now(),
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
    if (record.mistakes >= 3) return;
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

    const nextGrid = [...grid];
    nextGrid[selectedIndex] = nextValue;

    const isMistake =
      mode === 'pen' &&
      nextValue !== 0 &&
      nextValue !== (record.solution[selectedIndex] ?? 0);

    let nextNotesGrid = [...notes];
    nextNotesGrid[selectedIndex] = nextNotes;

    if (mode === 'pen' && !isMistake && nextValue !== 0) {
      const related = getRelatedIndices(selectedIndex);
      nextNotesGrid = removeNotesAtIndices(nextNotesGrid, related, nextValue);
    }

    const move: MoveEntry = {
      index: selectedIndex,
      prevValue,
      nextValue,
      prevNotes,
      nextNotes,
      prevNotesGrid: notes,
      nextNotesGrid: nextNotesGrid,
    };

    const nextMistakes = Math.min(3, record.mistakes + (isMistake ? 1 : 0));
    const reachedLimit = nextMistakes >= 3;
    const filled = mode === 'pen' && nextGrid.every((cell) => cell !== 0);
    const solved =
      filled && countIncorrectCells(nextGrid, record.solution) === 0 && !reachedLimit;
    const nextStatus = solved ? 'completed' : reachedLimit ? 'lost' : record.status;
    const completedAt = solved ? Date.now() : record.completedAt;

    const updatedRecord: GameRecord = {
      ...record,
      status: nextStatus,
      updatedAt: Date.now(),
      completedAt,
      moves: record.moves + (mode === 'pen' ? 1 : 0),
      mistakes: nextMistakes,
      durationSec: get().elapsedSec,
    };

    set({
      record: updatedRecord,
      grid: nextGrid,
      notes: nextNotesGrid,
      undoStack: [...get().undoStack, move],
      redoStack: [],
      lastTickAt: nextStatus === 'completed' || reachedLimit ? null : get().lastTickAt,
    });
    void get().persist();
  },
  useHint: () => {
    const { record, grid, notes, selectedIndex } = get();
    if (!record || record.status !== 'active' || record.hintsRemaining <= 0) return;

    let targetIndex = selectedIndex;
    
    // Si la cellule sélectionnée est correcte et remplie, ou immuable, on cherche une autre cellule
    if (
      targetIndex === null || 
      record.puzzle[targetIndex] !== 0 || 
      (grid[targetIndex] !== 0 && grid[targetIndex] === record.solution[targetIndex])
    ) {
      // Chercher la première cellule vide ou incorrecte
      targetIndex = grid.findIndex((val, idx) => 
        record.puzzle[idx] === 0 && (val === 0 || val !== record.solution[idx])
      );
    }

    if (targetIndex === -1) return;

    const correctValue = record.solution[targetIndex];
    const prevValue = grid[targetIndex];
    const prevNotes = [...notes[targetIndex]];

    const nextGrid = [...grid];
    nextGrid[targetIndex] = correctValue;

    let nextNotesGrid = [...notes];
    nextNotesGrid[targetIndex] = [];
    const related = getRelatedIndices(targetIndex);
    nextNotesGrid = removeNotesAtIndices(nextNotesGrid, related, correctValue);

    const move: MoveEntry = {
      index: targetIndex,
      prevValue,
      nextValue: correctValue,
      prevNotes,
      nextNotes: [],
      prevNotesGrid: notes,
      nextNotesGrid,
    };

    const filled = nextGrid.every((cell) => cell !== 0);
    const solved = filled && countIncorrectCells(nextGrid, record.solution) === 0;
    const nextStatus = solved ? 'completed' : record.status;

    const updatedRecord: GameRecord = {
      ...record,
      status: nextStatus,
      hintsRemaining: record.hintsRemaining - 1,
      moves: record.moves + 1,
      updatedAt: Date.now(),
      completedAt: solved ? Date.now() : record.completedAt,
    };

    set({
      record: updatedRecord,
      grid: nextGrid,
      notes: nextNotesGrid,
      selectedIndex: targetIndex,
      undoStack: [...get().undoStack, move],
      redoStack: [],
    });
    void get().persist();
  },
  autoPencil: () => {
    const { record, grid, notes } = get();
    if (!record || record.status !== 'active') return;

    const nextNotesGrid: number[][] = Array.from({ length: 81 }, (_, idx) => {
      if (grid[idx] !== 0 || record.puzzle[idx] !== 0) return [];
      
      const candidates: number[] = [];
      for (let v = 1; v <= 9; v++) {
        if (isValidPlacement(grid, idx, v)) {
          candidates.push(v);
        }
      }
      return candidates;
    });

    const move: MoveEntry = {
      index: -1,
      prevValue: 0,
      nextValue: 0,
      prevNotes: [],
      nextNotes: [],
      prevNotesGrid: notes,
      nextNotesGrid,
    };

    set({
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
    const nextGrid = [...grid];
    nextGrid[selectedIndex] = 0;
    const nextNotesGrid = [...notes];
    nextNotesGrid[selectedIndex] = [];

    const move: MoveEntry = {
      index: selectedIndex,
      prevValue,
      nextValue: 0,
      prevNotes: cellNotes,
      nextNotes: [],
      prevNotesGrid: notes,
      nextNotesGrid: nextNotesGrid,
    };
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
    if (move.index !== -1) {
      nextGrid[move.index] = move.prevValue;
    }
    
    const nextNotes = move.prevNotesGrid ? [...move.prevNotesGrid] : [...notes];
    if (!move.prevNotesGrid && move.index !== -1) {
      nextNotes[move.index] = [...move.prevNotes];
    }

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
    if (move.index !== -1) {
      nextGrid[move.index] = move.nextValue;
    }
    
    const nextNotes = move.nextNotesGrid ? [...move.nextNotesGrid] : [...notes];
    if (!move.nextNotesGrid && move.index !== -1) {
      nextNotes[move.index] = [...move.nextNotes];
    }

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
    if (record.status !== 'active') return;
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
      lastTickAt: Date.now(),
    });
    void get().persist();
  },
  newPuzzle: async () => {
    const record = get().record;
    if (!record) return;
    await get().startNewGame(record.difficulty);
  },
  retryGame: async () => {
    const record = get().record;
    if (!record) return;
    const retryRecord = createRecord(record.difficulty, record.puzzle, record.solution);
    set({
      record: retryRecord,
      grid: [...record.puzzle],
      notes: emptyNotes(),
      selectedIndex: null,
      mode: 'pen',
      undoStack: [],
      redoStack: [],
      elapsedSec: 0,
      isPaused: false,
      lastTickAt: Date.now(),
    });
    await saveGame(retryRecord, toPersistedState(get()));
  },
  abandonGame: async () => {
    const record = get().record;
    if (!record) return;
    const updated: GameRecord = {
      ...record,
      status: 'abandoned',
      updatedAt: Date.now(),
      durationSec: get().elapsedSec,
    };
    await saveGame(updated, toPersistedState(get()));
    set({
      record: null,
      grid: [],
      notes: [],
      selectedIndex: null,
      undoStack: [],
      redoStack: [],
      elapsedSec: 0,
      isPaused: false,
      lastTickAt: null,
    });
  },
  clearSession: () => {
    set({
      record: null,
      grid: [],
      notes: [],
      selectedIndex: null,
      undoStack: [],
      redoStack: [],
      elapsedSec: 0,
      isPaused: false,
      lastTickAt: null,
    });
  },
  tick: () => {
    const { isPaused, record, lastTickAt } = get();
    if (isPaused || !record || record.status !== 'active') {
      if (lastTickAt !== null) {
        set({ lastTickAt: null });
      }
      return;
    }
    const now = Date.now();
    const last = lastTickAt ?? now;
    const deltaMs = now - last;
    if (deltaMs < 1000) {
      if (lastTickAt === null) {
        set({ lastTickAt: now });
      }
      return;
    }
    const increment = Math.floor(deltaMs / 1000);
    set({
      elapsedSec: get().elapsedSec + increment,
      lastTickAt: last + increment * 1000,
    });
  },
  setPaused: (paused) => {
    set({ isPaused: paused, lastTickAt: paused ? null : Date.now() });
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
      set({ record: updated, lastTickAt: null });
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
