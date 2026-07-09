import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(dirname(__dirname), 'mingle.db');
const SCHEMA_PATH = join(__dirname, 'schema.sql');

let dbHandle = null;
let dbReady = null;

class Statement {
  constructor(rawDb, sql) {
    this.rawDb = rawDb;
    this.sql = sql;
  }
  get(...params) {
    try {
      const stmt = this.rawDb.prepare(this.sql);
      if (params.length > 0) stmt.bind(params);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return row;
      }
      stmt.free();
      return undefined;
    } catch (e) {
      console.error('SQL get error:', this.sql, params, e.message);
      return undefined;
    }
  }
  all(...params) {
    try {
      const stmt = this.rawDb.prepare(this.sql);
      if (params.length > 0) stmt.bind(params);
      const rows = [];
      while (stmt.step()) rows.push(stmt.getAsObject());
      stmt.free();
      return rows;
    } catch (e) {
      console.error('SQL all error:', this.sql, params, e.message);
      return [];
    }
  }
  run(...params) {
    try {
      const stmt = this.rawDb.prepare(this.sql);
      if (params.length > 0) stmt.bind(params);
      stmt.step();
      stmt.free();
    } catch (e) {
      console.error('SQL run error:', this.sql, params, e.message);
    }
  }
}

export async function initDb() {
  if (dbReady) return dbReady;
  dbReady = (async () => {
    const SQL = await initSqlJs();
    const buffer = existsSync(DB_PATH) ? readFileSync(DB_PATH) : null;
    dbHandle = new SQL.Database(buffer);
    const schema = readFileSync(SCHEMA_PATH, 'utf-8');
    dbHandle.run(schema);
    
    const migrations = {
      users: [
        ['is_admin', "INTEGER DEFAULT 0"],
      ],
      payments: [
        ['pesapal_order_tracking_id', 'TEXT'],
        ['pesapal_merchant_reference', 'TEXT'],
      ]
    };
    
    for (const [table, cols] of Object.entries(migrations)) {
      const existing = [];
      const s = dbHandle.prepare(`PRAGMA table_info('${table}')`);
      while (s.step()) existing.push(s.getAsObject().name);
      s.free();
      for (const [col, type] of cols) {
        if (!existing.includes(col)) {
          dbHandle.run(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`);
        }
      }
    }
    
    saveDb();
  })();

  return dbReady;
}

export function saveDb() {
  if (!dbHandle) return;
  const data = dbHandle.export();
  writeFileSync(DB_PATH, Buffer.from(data));
}

export function getDb() {
  if (!dbHandle) throw new Error('Database not initialized. Call initDb() first.');
  return {
    prepare: (sql) => new Statement(dbHandle, sql),
    exec: (sql) => {
      try { dbHandle.run(sql); } catch (e) { console.error('SQL exec error:', sql, e.message); }
    }
  };
}