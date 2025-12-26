import { Difficulty } from '../../features/game/engine/difficulty';
import { deserializeGrid, serializeGrid } from '../../features/game/engine/serialization';
import { GameRecord, PersistedGameState } from '../../features/game/types';
import { getAllAsync, getFirstAsync, runAsync } from '../sqlite/client';

export type GameFilters = {
  status?: 'active' | 'completed' | 'abandoned';
  difficulty?: Difficulty | 'all';
  limit?: number;
};

export type GameStatsRow = {
  difficulty: Difficulty;
  total: number;
  completed: number;
  best: number | null;
  average: number | null;
};

const toRecord = (row: any): GameRecord => ({
  id: row.id,
  difficulty: row.difficulty,
  puzzle: deserializeGrid(row.puzzle),
  solution: deserializeGrid(row.solution),
  status: row.status,
  startedAt: Number(row.started_at ?? 0),
  updatedAt: Number(row.updated_at ?? 0),
  completedAt: row.completed_at ? Number(row.completed_at) : null,
  durationSec: Number(row.duration_sec ?? 0),
  mistakes: Number(row.mistakes ?? 0),
  moves: Number(row.moves ?? 0),
});

export const saveGame = async (record: GameRecord, state: PersistedGameState) => {
  await runAsync(
    `INSERT INTO games (id, difficulty, puzzle, solution, status, started_at, updated_at, completed_at, duration_sec, mistakes, moves)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       difficulty = excluded.difficulty,
       puzzle = excluded.puzzle,
       solution = excluded.solution,
       status = excluded.status,
       started_at = excluded.started_at,
       updated_at = excluded.updated_at,
       completed_at = excluded.completed_at,
       duration_sec = excluded.duration_sec,
       mistakes = excluded.mistakes,
       moves = excluded.moves`,
    [
      record.id,
      record.difficulty,
      serializeGrid(record.puzzle),
      serializeGrid(record.solution),
      record.status,
      record.startedAt,
      record.updatedAt,
      record.completedAt,
      record.durationSec,
      record.mistakes,
      record.moves,
    ],
  );

  await runAsync(
    'INSERT INTO game_state (game_id, state_json) VALUES (?, ?) ON CONFLICT(game_id) DO UPDATE SET state_json = excluded.state_json',
    [record.id, JSON.stringify(state)],
  );
};

export const getActiveGame = async () => {
  const row = await getFirstAsync<any>(
    'SELECT * FROM games WHERE status = ? ORDER BY updated_at DESC LIMIT 1',
    ['active'],
  );
  if (!row) {
    return null;
  }
  const stateRow = await getFirstAsync<{ state_json: string }>(
    'SELECT state_json FROM game_state WHERE game_id = ? LIMIT 1',
    [row.id],
  );
  const state = stateRow ? (JSON.parse(stateRow.state_json) as PersistedGameState) : null;
  return { record: toRecord(row), state };
};

export const listGames = async (filters: GameFilters) => {
  const conditions: string[] = [];
  const params: (string | number)[] = [];
  if (filters.status) {
    conditions.push('status = ?');
    params.push(filters.status);
  }
  if (filters.difficulty && filters.difficulty !== 'all') {
    conditions.push('difficulty = ?');
    params.push(filters.difficulty);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = filters.limit ? `LIMIT ${filters.limit}` : '';
  const rows = await getAllAsync<any>(
    `SELECT * FROM games ${where} ORDER BY updated_at DESC ${limit}`,
    params,
  );
  return rows.map(toRecord);
};

export const getStats = async () => {
  const rows = await getAllAsync<any>(
    `SELECT difficulty,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        MIN(CASE WHEN status = 'completed' THEN duration_sec END) as best,
        AVG(CASE WHEN status = 'completed' THEN duration_sec END) as average
      FROM games
      GROUP BY difficulty`,
  );
  return rows as GameStatsRow[];
};

export const deleteAllData = async () => {
  await runAsync('DELETE FROM game_state');
  await runAsync('DELETE FROM games');
};
