import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const DB_NAME = 'habits.db';

let expoDb;
try {
  expoDb = openDatabaseSync(DB_NAME, { enableChangeListener: true });
  expoDb.execSync('PRAGMA journal_mode = WAL;');
  expoDb.execSync('PRAGMA foreign_keys = ON;');
} catch (e) {
  console.error('Failed to initialize SQLite database:', e);
  throw e;
}

export const db = drizzle(expoDb, { schema });
