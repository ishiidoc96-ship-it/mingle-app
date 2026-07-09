import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import initSqlJs from 'sql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(dirname(__dirname), 'mingle.db');

async function main() {
  const emailOrPhone = process.argv[2];

  if (!emailOrPhone) {
    console.log('\n⚠️  Usage: node setup_admin.mjs <email_or_phone>');
    console.log('Example: node setup_admin.mjs admin@mingle.app\n');
    console.log('Note: Use an existing user\'s email or phone to make them admin.');
    process.exit(1);
  }

  const SQL = await initSqlJs();
  const buffer = existsSync(DB_PATH) ? readFileSync(DB_PATH) : null;
  const db = new SQL.Database(buffer);

  const users = db.exec("SELECT id, name, email, is_admin FROM users WHERE email = ? OR phone = ?", [emailOrPhone, emailOrPhone]);

  if (users.length === 0 || users[0].values.length === 0) {
    console.log(`❌ No user found with email/phone: ${emailOrPhone}`);
    console.log('\nExisting users:');
    const all = db.exec('SELECT id, name, email, phone FROM users LIMIT 10');
    if (all.length > 0) {
      all[0].values.forEach(([id, name, email, phone]) => {
        console.log(`  ${email || phone} (${name})`);
      });
    } else {
      console.log('  No users in database');
    }
    const data = db.export();
    writeFileSync(DB_PATH, Buffer.from(data));
    db.close();
    process.exit(1);
  }

  const [id, name, email, isAdmin] = users[0].values[0];
  console.log(`\nFound user: ${name} (${email || id})`);
  console.log(`Current admin status: ${isAdmin ? '✓ Admin' : 'Not admin'}`);

  if (isAdmin) {
    console.log('\n✅ User is already an admin.\n');
    const data = db.export();
    writeFileSync(DB_PATH, Buffer.from(data));
    db.close();
    process.exit(0);
  }

  db.run('UPDATE users SET is_admin = 1, updated_at = datetime("now") WHERE id = ?', [id]);
  const data = db.export();
  writeFileSync(DB_PATH, Buffer.from(data));
  db.close();
  console.log(`✅ Admin access granted to: ${email || id}\n`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
