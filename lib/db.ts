import fs from 'fs';
import path from 'path';
import type { Database } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export function readDb(): Database {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data) as Database;
}

export function writeDb(data: Database) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
