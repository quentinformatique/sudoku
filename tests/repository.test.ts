import { saveGame, getActiveGame } from '../src/data/repositories/gameRepository';
import { GameRecord, PersistedGameState } from '../src/features/game/types';

const store = {
  games: new Map<string, any>(),
  state: new Map<string, string>(),
};

jest.mock('../src/data/sqlite/client', () => ({
  runAsync: async (statement: string, params: any[]) => {
    if (statement.includes('INSERT INTO games')) {
      const [
        id,
        difficulty,
        puzzle,
        solution,
        status,
        started_at,
        updated_at,
        completed_at,
        duration_sec,
        mistakes,
        moves,
      ] = params;
      store.games.set(id, {
        id,
        difficulty,
        puzzle,
        solution,
        status,
        started_at,
        updated_at,
        completed_at,
        duration_sec,
        mistakes,
        moves,
      });
    }
    if (statement.includes('INSERT INTO game_state')) {
      const [game_id, state_json] = params;
      store.state.set(game_id, state_json);
    }
    if (statement.startsWith('DELETE')) {
      store.games.clear();
      store.state.clear();
    }
    return { lastInsertRowId: 0, changes: 1 };
  },
  getFirstAsync: async (statement: string, params: any[]) => {
    if (statement.includes('SELECT * FROM games WHERE status')) {
      const status = params[0];
      const row = Array.from(store.games.values()).find((game) => game.status === status);
      return row ?? null;
    }
    if (statement.includes('SELECT state_json FROM game_state')) {
      const gameId = params[0];
      const state_json = store.state.get(gameId);
      return state_json ? { state_json } : null;
    }
    return null;
  },
  getAllAsync: async () => [],
}));

test('saveGame persists and loadActiveGame returns state', async () => {
  const record: GameRecord = {
    id: 'game-1',
    difficulty: 'beginner',
    puzzle: Array(81).fill(0),
    solution: Array(81).fill(1),
    status: 'active',
    startedAt: 1,
    updatedAt: 2,
    completedAt: null,
    durationSec: 120,
    mistakes: 0,
    moves: 5,
  };
  const state: PersistedGameState = {
    grid: Array(81).fill(0),
    notes: Array.from({ length: 81 }, () => [] as number[]),
    elapsedSec: 120,
    mode: 'pen',
    selectedIndex: null,
  };

  await saveGame(record, state);
  const loaded = await getActiveGame();
  expect(loaded).not.toBeNull();
  expect(loaded?.record.id).toBe('game-1');
  expect(loaded?.state?.elapsedSec).toBe(120);
});
