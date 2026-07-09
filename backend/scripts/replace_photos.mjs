import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

const CLOUD_NAME = 'dilrcexxe';
const UPLOAD_PRESET = 'MingleKe';
const PHOTO_DIRS = [
  'C:\\Users\\pixel\\Downloads\\mingle_new_photos_1',
  'C:\\Users\\pixel\\Downloads\\mingle_new_photos_2'
];

const SUPABASE_URL = 'https://lnmxlziawmtxcekkiulm.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubXhsemlhd210eGNla2tpdWxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA5MDEwOSwiZXhwIjoyMDk4NjY2MTA5fQ.J7wzis_VLuYgKXgmAHuxVHziiNTo4oxLMQZY8OxfuwQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function uploadToCloudinary(filePath, fileName) {
  const form = new FormData();
  form.append('file', new Blob([readFileSync(filePath)], { type: 'image/jpeg' }), fileName);
  form.append('upload_preset', UPLOAD_PRESET);
  form.append('folder', 'mingle/profiles');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST', body: form
  });
  if (!res.ok) { const text = await res.text(); throw new Error(`HTTP ${res.status}: ${text}`); }
  const data = await res.json();
  return data.secure_url;
}

async function main() {
  console.log('=== Step 1: Collecting photos ===');
  const files = [];
  for (const dir of PHOTO_DIRS) {
    const entries = readdirSync(dir)
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b))
      .map(f => ({ name: f, path: join(dir, f) }));
    files.push(...entries);
  }
  console.log(`Total photos found: ${files.length}`);

  console.log('\n=== Step 2: Uploading to Cloudinary ===');
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const { name, path } = files[i];
    try {
      const url = await uploadToCloudinary(path, name);
      urls.push(url);
      console.log(`  [${i + 1}/${files.length}] OK: ${name}`);
    } catch (err) {
      console.error(`  [${i + 1}/${files.length}] FAIL: ${name} - ${err.message}`);
    }
  }
  console.log(`\nUploaded ${urls.length}/${files.length} photos`);

  console.log('\n=== Step 3: Clearing old avatar_urls ===');
  const { error: clearErr } = await supabase
    .from('users')
    .update({ avatar_url: null, updated_at: new Date().toISOString() })
    .not('avatar_url', 'is', null);
  if (clearErr) {
    console.error('Failed to clear old photos:', clearErr.message);
  } else {
    console.log('Old photos cleared');
  }

  console.log('\n=== Step 4: Assigning new photos to users ===');
  const { data: users, error: usersErr } = await supabase
    .from('users')
    .select('id')
    .order('created_at', { ascending: true });
  if (usersErr) { console.error('Failed to fetch users:', usersErr.message); return; }
  if (!users || users.length === 0) { console.log('No users found'); return; }
  console.log(`Found ${users.length} users`);

  for (let i = 0; i < users.length; i++) {
    const url = urls[i % urls.length];
    const { error: updateErr } = await supabase
      .from('users')
      .update({ avatar_url: url, updated_at: new Date().toISOString() })
      .eq('id', users[i].id);
    if (updateErr) console.error(`  FAIL user ${users[i].id}: ${updateErr.message}`);
    if ((i + 1) % 25 === 0) console.log(`  Updated ${i + 1}/${users.length}...`);
  }

  console.log(`\n=== Done ===`);
  console.log(`Photos uploaded: ${urls.length}`);
  console.log(`Users updated: ${users.length}`);
}

main().catch(err => { console.error('Script failed:', err); process.exit(1); });