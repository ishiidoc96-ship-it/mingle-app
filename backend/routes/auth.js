import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase.js';
import { generateToken, verifyToken } from '../middleware/auth.js';

const router = Router();

function generateReferralCode(name) {
  const prefix = (name || 'USER').slice(0, 6).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${suffix}`;
}

router.post('/register', async (req, res) => {
  const { name, email, phone, password, referralCode } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const { data: existing, error: existingErr } = await supabase.from('users').select('id').or(`email.eq.${email},phone.eq.${phone}`).single();
  if (existing) {
    return res.status(409).json({ error: 'Email or phone already registered' });
  }
  if (existingErr && existingErr.code !== 'PGRST116') {
    return res.status(500).json({ error: existingErr.message });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const id = uuidv4();
  const code = generateReferralCode(name);
  let referredBy = null;

  if (referralCode) {
    const { data: referrer, error: refErr } = await supabase.from('users').select('id').eq('referral_code', referralCode.toUpperCase()).single();
    if (refErr && refErr.code !== 'PGRST116') {
      return res.status(500).json({ error: refErr.message });
    }
    if (referrer) referredBy = referrer.id;
  }

  const { error: insertErr } = await supabase.from('users').insert({
    id, name, email, phone, password: hashed, referral_code: code, referred_by: referredBy
  });
  if (insertErr) return res.status(500).json({ error: insertErr.message });

  const token = generateToken(id);
  res.status(201).json({ token, user: { id, name, email, phone, referralCode: code } });
});

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Identifier and password are required' });
  }

  const { data: user, error } = await supabase.from('users').select('*').or(`email.eq.${identifier},phone.eq.${identifier}`).single();
  if (error?.code === 'PGRST116' || !user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (error) return res.status(500).json({ error: error.message });

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user.id);
  const { password: _, ...safe } = user;
  res.json({ token, user: safe });
});

router.get('/me', verifyToken, async (req, res) => {
  const { data: user, error } = await supabase.from('users').select('*').eq('id', req.userId).single();
  if (error?.code === 'PGRST116' || !user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (error) return res.status(500).json({ error: error.message });
  const { password: _, ...safe } = user;
  res.json({ user: safe });
});

router.put('/me', verifyToken, async (req, res) => {
  const { name, gender, age, interestedIn, location, bio, avatarUrl } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (gender !== undefined) updates.gender = gender;
  if (age !== undefined) updates.age = age;
  if (interestedIn !== undefined) updates.interested_in = interestedIn;
  if (location !== undefined) updates.location = location;
  if (bio !== undefined) updates.bio = bio;
  if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  updates.updated_at = new Date().toISOString();

  const { error } = await supabase.from('users').update(updates).eq('id', req.userId);
  if (error) return res.status(500).json({ error: error.message });

  const { data: user } = await supabase.from('users').select('*').eq('id', req.userId).single();
  const { password: _, ...safe } = user;
  res.json({ user: safe });
});

export default router;
