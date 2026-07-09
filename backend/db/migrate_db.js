import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import initSqlJs from 'sql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(dirname(__dirname), 'mingle.db');
const SCHEMA_PATH = join(__dirname, 'schema.sql');

async function main() {
  const SQL = await initSqlJs();
  const buffer = existsSync(DB_PATH) ? readFileSync(DB_PATH) : null;
  const db = new SQL.Database(buffer);
  
  // Read schema
  const schema = readFileSync(SCHEMA_PATH, 'utf-8');
  
  // Apply schema
  dbHandle.run(schema);
  
  // Apply migrations
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
  dbHandle.close();
  console.log('Database schema and migrations applied successfully');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});