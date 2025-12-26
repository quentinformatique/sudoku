import { execAsync, getFirstAsync, runAsync } from './client';

type Migration = {
  version: number;
  up: () => Promise<void>;
};

const migrations: Migration[] = [
  {
    version: 1,
    up: async () => {
      await execAsync('PRAGMA foreign_keys = ON;');
      await execAsync(
        'CREATE TABLE IF NOT EXISTS schema_version (version INTEGER NOT NULL);',
      );
      await execAsync(
        'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);',
      );
      await execAsync(`
        CREATE TABLE IF NOT EXISTS games (
          id TEXT PRIMARY KEY,
          difficulty TEXT NOT NULL,
          puzzle TEXT NOT NULL,
          solution TEXT NOT NULL,
          status TEXT NOT NULL,
          started_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          completed_at INTEGER,
          duration_sec INTEGER NOT NULL,
          mistakes INTEGER NOT NULL,
          moves INTEGER NOT NULL
        );
      `);
      await execAsync(
        'CREATE TABLE IF NOT EXISTS game_state (game_id TEXT PRIMARY KEY, state_json TEXT NOT NULL, FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE);',
      );
      await execAsync('CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);');
      await execAsync(
        'CREATE INDEX IF NOT EXISTS idx_games_difficulty ON games(difficulty);',
      );
    },
  },
];

export const migrate = async () => {
  await execAsync('PRAGMA foreign_keys = ON;');
  await execAsync(
    'CREATE TABLE IF NOT EXISTS schema_version (version INTEGER NOT NULL);',
  );
  const row = await getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version LIMIT 1',
  );
  let current = row?.version ?? 0;
  if (!row) {
    await runAsync('INSERT INTO schema_version (version) VALUES (0)');
  }

  for (const migration of migrations) {
    if (migration.version > current) {
      await migration.up();
      current = migration.version;
      await runAsync('UPDATE schema_version SET version = ?', [current]);
    }
  }
};
