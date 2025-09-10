import Database from 'better-sqlite3';
import { join } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';


const dataDir = join(process.cwd(), 'server'); // 런타임 쓰기 가능한 폴더
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });


const dbPath = join(dataDir, 'db.sqlite');
export const db = new Database(dbPath);


db.exec(`CREATE TABLE IF NOT EXISTS entries (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
content TEXT NOT NULL,
image_name TEXT NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);