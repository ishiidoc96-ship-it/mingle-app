import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CLOUD_NAME = 'dilrcexxe';
const UPLOAD_PRESET = 'MingleKe';
const PHOTOS_DIR = 'C:\\Users\\pixel\\Downloads\\african_women_photos';
const PROJECT_ROOT = join(__dirname, '..');

const MAPPING_FILE = join(PROJECT_ROOT, 'scripts', 'cloudinary_url_mapping.json');
const DB_PATH = join(PROJECT_ROOT, 'mingle.db');

async function uploadViaUnsigned(filePath) {
  const form = new FormData();
  form.append('file', new Blob([readFileSync(filePath)], { type: 'image/jpeg' }), filePath.split(/[/\\]/).pop());
  form.append('upload_preset', UPLOAD_PRESET);
  form.append('folder', 'mingle/profiles');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.secure_url;
}

async function uploadPhotos() {
  const files = readdirSync(PHOTOS_DIR)
    .filter(f => f.endsWith('.jpg'))
    .sort((a, b) => a.localeCompare(b));

  console.log(`Found ${files.length} JPG files to upload.`);

  const existing = {};
  try {
    Object.assign(existing, JSON.parse(readFileSync(MAPPING_FILE, 'utf-8')));
    console.log(`Loaded ${Object.keys(existing).length} existing mappings from cache.`);
  } catch (_) {}

  const mapping = {};
  let uploaded = 0;
  for (const file of files) {
    if (existing[file] && existing[file] !== 'null') {
      mapping[file] = existing[file];
      console.log(`  SKIP: ${file}`);
      continue;
    }
    const filePath = join(PHOTOS_DIR, file);
    try {
      const url = await uploadViaUnsigned(filePath);
      mapping[file] = url;
      uploaded++;
      console.log(`  OK [${uploaded}/${files.length}]: ${file}`);
    } catch (err) {
      console.error(`  FAIL: ${file} - ${err.message}`);
      mapping[file] = existing[file] || null;
    }
  }

  const allMappings = { ...existing, ...mapping };
  await import('fs').then(({ writeFileSync }) => {
    writeFileSync(MAPPING_FILE, JSON.stringify(allMappings, null, 2));
  });
  console.log(`Mapping saved to ${MAPPING_FILE}`);
  return { mapping: allMappings, newUploads: uploaded, totalFiles: files.length };
}

async function assignUrlsToUsers(mapping) {
  const { default: initSqlJs } = await import('sql.js');
  const SQL = await initSqlJs();
  const db = new SQL.Database(readFileSync(DB_PATH));

  const keys = Object.keys(mapping).sort((a, b) => a.localeCompare(b));
  const urls = keys.map(k => mapping[k]).filter(Boolean);
  console.log(`${urls.length} URLs available for assignment.`);

  const users = db.exec('SELECT id FROM users ORDER BY rowid ASC');
  const userRows = users[0] ? users[0].values : [];
  console.log(`Found ${userRows.length} users in database.`);

  if (userRows.length === 0) {
    db.close();
    return 0;
  }

  const prepared = db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?');
  let updated = 0;
  for (let i = 0; i < userRows.length; i++) {
    const userId = userRows[i][0];
    const url = urls[i % urls.length];
    prepared.run([url, userId]);
    updated++;
    if (updated % 25 === 0) console.log(`  Updated ${updated}/${userRows.length}...`);
  }
  prepared.free();

  const { writeFileSync } = await import('fs');
  writeFileSync(DB_PATH, Buffer.from(db.export()));
  db.close();
  console.log(`Database updated: ${updated} users assigned avatar_url.`);
  return updated;
}

async function main() {
  console.log('=== Step 1: Upload photos to Cloudinary ===');
  const { mapping, newUploads, totalFiles } = await uploadPhotos();

  console.log('\n=== Step 2: Assign URLs to users in DB ===');
  const updated = await assignUrlsToUsers(mapping);

  console.log('\n=== Summary ===');
  console.log(`New uploads: ${newUploads} / ${totalFiles}`);
  console.log(`Users updated: ${updated}`);
  console.log(`Mapping file: ${MAPPING_FILE}`);
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
