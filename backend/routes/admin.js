import express from 'express';
import { adminOnly } from '../middleware/admin.js';
import { supabase } from '../lib/supabase.js';
import { readdirSync, readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const CLOUD_NAME = 'dilrcexxe';
const UPLOAD_PRESET = 'MingleKe';
const MAPPING_FILE = join(dirname(dirname(__dirname)), 'scripts', 'cloudinary_url_mapping.json');

function tryLoadMapping() {
  try {
    if (existsSync(MAPPING_FILE)) return JSON.parse(readFileSync(MAPPING_FILE, 'utf-8'));
  } catch (_) {}
  return null;
}

function saveMappingToFile(mapping) {
  try { writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2)); } catch (e) { console.error('Failed to save mapping:', e.message); }
}

async function uploadToCloudinary(filePath, fileName) {
  const form = new FormData();
  form.append('file', new Blob([readFileSync(filePath)], { type: 'image/jpeg' }), fileName);
  form.append('upload_preset', UPLOAD_PRESET);
  form.append('folder', 'mingle/profiles');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: form });
  if (!res.ok) { const text = await res.text(); throw new Error(`HTTP ${res.status}: ${text}`); }
  const data = await res.json();
  return data.secure_url;
}

router.get('/status', adminOnly, async (req, res) => {
  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: withPhotos } = await supabase.from('users').select('*', { count: 'exact', head: true }).not('avatar_url', 'is', null);
  const withoutPhotos = totalUsers - withPhotos;
  const mapping = tryLoadMapping();
  const mappedUrls = mapping ? Object.values(mapping).filter(Boolean).length : 0;
  res.json({ totalUsers, withPhotos, withoutPhotos, mappedUrls, mappingFile: MAPPING_FILE, cloudName: CLOUD_NAME, uploadPreset: UPLOAD_PRESET });
});

router.get('/users', adminOnly, async (req, res) => {
  const { data: users } = await supabase.from('users').select('id, name, email, avatar_url, is_admin').order('created_at', { ascending: false });
  res.json(users);
});

router.get('/photos-samples', adminOnly, async (req, res) => {
  const { data: photos } = await supabase.from('users').select('id, avatar_url').not('avatar_url', 'is', null).order('created_at', { ascending: false }).limit(50);
  res.json(photos);
});

router.post('/seed-photos', adminOnly, async (req, res) => {
  try {
    const mapping = tryLoadMapping();
    if (!mapping || Object.keys(mapping).length === 0) return res.status(400).json({ error: 'No Cloudinary URLs in mapping file. Upload photos locally first or provide Cloudinary URLs via /seed-urls endpoint.' });

    const urls = Object.values(mapping).filter(Boolean);
    if (urls.length === 0) return res.status(400).json({ error: 'No valid URLs in mapping file' });

    const { data: users } = await supabase.from('users').select('id').order('created_at', { ascending: true });
    if (!users || users.length === 0) return res.json({ usersUpdated: 0, availableUrls: urls.length, message: 'No users in database' });

    for (let i = 0; i < users.length; i++) {
      await supabase.from('users').update({ avatar_url: urls[i % urls.length], updated_at: new Date().toISOString() }).eq('id', users[i].id);
    }
    res.json({ usersUpdated: users.length, availableUrls: urls.length, message: `Assigned photos to ${users.length} users` });
  } catch (err) {
    console.error('Seed photos error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload-photos', adminOnly, async (req, res) => {
  try {
    const { urls } = req.body;
    if (!Array.isArray(urls) || urls.length === 0) return res.status(400).json({ error: 'Provide a "urls" array of Cloudinary URLs' });

    const { data: users } = await supabase.from('users').select('id').order('created_at', { ascending: true });
    if (!users || users.length === 0) return res.json({ usersUpdated: 0, message: 'No users in database' });

    for (let i = 0; i < users.length; i++) {
      await supabase.from('users').update({ avatar_url: urls[i % urls.length], updated_at: new Date().toISOString() }).eq('id', users[i].id);
    }

    let allMappings = {};
    try { allMappings = tryLoadMapping() || {}; } catch (_) {}
    urls.forEach((url, idx) => { allMappings[`uploaded_${Date.now()}_${idx}`] = url; });
    saveMappingToFile(allMappings);

    res.json({ usersUpdated: users.length, urlsProvided: urls.length });
  } catch (err) {
    console.error('Upload photos error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/seed-urls', adminOnly, async (req, res) => {
  const { urls } = req.body;
  if (!Array.isArray(urls) || urls.length === 0) return res.status(400).json({ error: 'Provide a "urls" array of Cloudinary image URLs' });

  const { data: users } = await supabase.from('users').select('id').order('created_at', { ascending: true });
  if (!users || users.length === 0) return res.json({ usersUpdated: 0, message: 'No users in database' });

  for (let i = 0; i < users.length; i++) {
    await supabase.from('users').update({ avatar_url: urls[i % urls.length], updated_at: new Date().toISOString() }).eq('id', users[i].id);
  }

  let allMappings = {};
  try { allMappings = tryLoadMapping() || {}; } catch (_) {}
  urls.forEach((url, idx) => { allMappings[`uploaded_${idx}`] = url; });
  saveMappingToFile(allMappings);

  res.json({ usersUpdated: users.length, urlsProvided: urls.length });
});

router.delete('/photos', adminOnly, async (req, res) => {
  const { error } = await supabase.from('users').update({ avatar_url: null, updated_at: new Date().toISOString() }).not('avatar_url', 'is', null);
  res.json({ cleared: error ? 0 : 'all', message: 'Cleared user photos' });
});

export default router;
