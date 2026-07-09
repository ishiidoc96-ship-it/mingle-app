import initSqlJs from 'sql.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'mingle.db');

const SQL = await initSqlJs();
const db = new SQL.Database(readFileSync(dbPath));
const rows = db.exec('SELECT id, name, avatar_url FROM users');
console.log('User count:', rows[0] ? rows[0].values.length : 0);
if (rows[0]) {
  rows[0].values.slice(0, 5).forEach(r => {
    console.log('ID:', r[0], '| Name:', r[1], '| avatar_url:', r[2]);
  });
}
db.close();
