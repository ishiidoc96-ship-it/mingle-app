import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

config({ path: join(PROJECT_ROOT, '.env') });

const CLOUD_NAME = 'dilrcexxe';
const UPLOAD_PRESET = 'MingleKe';
const FOLDER = 'mingle/profiles';
const MAPPING_FILE = join(PROJECT_ROOT, 'scripts', 'cloudinary_url_mapping.json');
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const DIRS = [
  'C:\\Users\\pixel\\Downloads\\mingle_new_photos_1',
  'C:\\Users\\pixel\\Downloads\\mingle_new_photos_2',
];

function collectPhotos(dir) {
  const photos = [];
  function walk(d) {
    try {
      for (const entry of readdirSync(d)) {
        const full = join(d, entry);
        const s = statSync(full);
        if (s.isDirectory()) walk(full);
        else if (/\.(jpe?g|png)$/i.test(entry)) photos.push(full);
      }
    } catch (e) { console.error(`Warn: ${e.message}`); }
  }
  walk(dir);
  return photos;
}

async function uploadToCloudinary(filePath, fileName) {
  const form = new FormData();
  form.append('file', new Blob([readFileSync(filePath)], { type: 'image/jpeg' }), fileName);
  form.append('upload_preset', UPLOAD_PRESET);
  form.append('folder', FOLDER);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST', body: form,
  });
  if (!res.ok) { const t = await res.text(); throw new Error(`HTTP ${res.status}: ${t}`); }
  return (await res.json()).secure_url;
}

async function supabaseFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok && res.status !== 204) { const t = await res.text(); throw new Error(`Sup ${res.status}: ${t}`); }
  return res;
}

async function bulkUpdateUsers(urls) {
  console.log(' Clearing all avatars...');
  await supabaseFetch('/users?select=id&order=created_at.asc').then(r => r.json()).then(users => {
    const batch = users.map(u => ({ id: u.id, avatar_url: null }));
    return Promise.all(batch.map(u => supabaseFetch(`/users?id=eq.${u.id}`, {
      method: 'PATCH', body: JSON.stringify({ avatar_url: null }),
    })));
  });

  console.log(' Assigning new photos...');
  const listRes = await supabaseFetch('/users?select=id&order=created_at.asc');
  const users = await listRes.json();
  console.log(` Total users: ${users.length}`);
  if (users.length === 0) return;

  for (let i = 0; i < users.length; i++) {
    const url = urls[i % urls.length];
    await supabaseFetch(`/users?id=eq.${users[i].id}`, {
      method: 'PATCH',
      body: JSON.stringify({ avatar_url: url, updated_at: new Date().toISOString() }),
    });
    if ((i + 1) % 25 === 0) console.log(`  Updated ${i + 1}/${users.length}...`);
  }
  console.log(` ✅ ${users.length} users updated.`);
}

async function main() {
  console.log('Collecting photos from ZIP folders...');
  let allPhotos = [];
  for (const d of DIRS) {
    const photos = collectPhotos(d);
    allPhotos = allPhotos.concat(photos);
    console.log(`  ${d}: ${photos.length} files`);
  }
  console.log(`Total photos found: ${allPhotos.length}`);

  let existingMapping = {};
  try {
    existingMapping = JSON.parse(readFileSync(MAPPING_FILE, 'utf-8'));
    console.log(`Existing mapping: ${Object.keys(existingMapping).length} entries`);
  } catch (_) {}

  const mapping = {};
  let uploaded = 0;
  const errors = [];
  const t0 = Date.now();

  for (const filePath of allPhotos) {
    const fileName = filePath.split(/[/\\]/).pop();
    try {
      if (existingMapping[fileName] && existingMapping[fileName] !== 'null') {
        mapping[fileName] = existingMapping[fileName];
        continue;
      }
      mapping[fileName] = await uploadToCloudinary(filePath, fileName);
      uploaded++;
      if (uploaded % 10 === 0) console.log(`  Uploaded ${uploaded}/${allPhotos.length}...`);
    } catch (err) {
      errors.push({ file: fileName, error: err.message });
    }
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\nUpload done in ${elapsed}s | New: ${uploaded} | Cached: ${Object.keys(mapping).length - uploaded} | Errors: ${errors.length}`);

  const allMappings = { ...existingMapping, ...mapping };
  writeFileSync(MAPPING_FILE, JSON.stringify(allMappings, null, 2));

  const uniqueUrls = Object.values(allMappings).filter(Boolean);
  console.log(`Unique URLs available: ${uniqueUrls.length}`);

  await bulkUpdateUsers(uniqueUrls);

  if (errors.length > 0) {
    console.log('\n⚠️ Upload errors (first 5):');
    errors.slice(0, 5).forEach(e => console.log(`  ${e.file}: ${e.error}`));
  }
  console.log('\n✅ DONE — all old photos cleared, replaced with new ones.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
