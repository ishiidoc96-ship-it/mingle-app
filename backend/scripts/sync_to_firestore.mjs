import { readFileSync, existsSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

const MAPPING_FILE = join(PROJECT_ROOT, 'scripts', 'cloudinary_url_mapping.json');
const DB_PATH = join(PROJECT_ROOT, 'mingle.db');

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD6ZMd3-Vkx9Bcr9a1eEfJWdtbmK6_EAVs",
  authDomain: "obomocare.firebaseapp.com",
  projectId: "obomocare",
  storageBucket: "obomocare.firebasestorage.app",
  messagingSenderId: "816388688401",
  appId: "1:816388688401:web:721c812ddf5403081fbfb0",
  measurementId: "G-50LQ7DJLRM"
};

async function syncToFirestore() {
  const firebase = await import('firebase/app');
  const fs = await import('firebase/firestore');
  const app = initializeApp(FIREBASE_CONFIG);
  const db = getFirestore(app);

  // Load existing Cloudinary mapping
  const mapping = JSON.parse(readFileSync(MAPPING_FILE, 'utf-8'));
  const keys = Object.keys(mapping).sort((a, b) => a.localeCompare(b));
  const urls = keys.map(k => mapping[k]).filter(Boolean);
  console.log(`Loaded ${urls.length} URLs from mapping file.`);

  // Read users from SQLite
  const { default: initSqlJs } = await import('sql.js');
  const SQL = await initSqlJs();
  const sqlDb = new SQL.Database(readFileSync(DB_PATH));
  const users = sqlDb.exec('SELECT id, avatar_url, name FROM users ORDER BY rowid ASC');
  const userRows = users[0] ? users[0].values : [];
  console.log(`Found ${userRows.length} users in database.`);

  let synced = 0;
  for (const row of userRows) {
    const [userId, avatarUrl, name] = row;
    if (avatarUrl && avatarUrl !== 'null') {
      try {
        await setDoc(doc(db, 'profile_photos', userId), {
          userId,
          url: avatarUrl,
          name: name || '',
          updatedAt: new Date().toISOString()
        });
        synced++;
        if (synced % 25 === 0) console.log(`  Synced ${synced}/${userRows.length}...`);
      } catch (err) {
        console.error(`  FAIL to sync ${userId}: ${err.message}`);
      }
    }
  }

  sqlDb.close();
  console.log(`Firestore sync complete: ${synced} users synced.`);
}

syncToFirestore().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
