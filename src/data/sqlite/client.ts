import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDb = async () => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('sudoku.db');
  }
  return await dbPromise;
};

export const execAsync = async (statement: string) => {
  const db = await getDb();
  await db.execAsync(statement);
};

export const runAsync = async (
  statement: string,
  params: SQLite.SQLiteBindValue[] = [],
) => {
  const db = await getDb();
  return await db.runAsync(statement, params);
};

export const getFirstAsync = async <T>(
  statement: string,
  params: SQLite.SQLiteBindValue[] = [],
) => {
  const db = await getDb();
  return await db.getFirstAsync<T>(statement, params);
};

export const getAllAsync = async <T>(
  statement: string,
  params: SQLite.SQLiteBindValue[] = [],
) => {
  const db = await getDb();
  return await db.getAllAsync<T>(statement, params);
};
