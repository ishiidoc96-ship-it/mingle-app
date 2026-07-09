import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
  const { q, gender, minAge, maxAge, location } = req.query;
  let query = supabase.from('users').select('id, name, age, gender, location, bio, avatar_url').neq('id', req.userId);

  if (q) {
    const { data: nameMatches } = await supabase.from('users').select('id, name, age, gender, location, bio, avatar_url').neq('id', req.userId).ilike('name', `%${q}%`).limit(50);
    const { data: bioMatches } = await supabase.from('users').select('id, name, age, gender, location, bio, avatar_url').neq('id', req.userId).ilike('bio', `%${q}%`).limit(50);
    const combined = new Map();
    [...(nameMatches || []), ...(bioMatches || [])].forEach(u => combined.set(u.id, u));
    const users = Array.from(combined.values());
    res.json({ users });
    return;
  }

  if (gender && gender !== 'all') query = query.eq('gender', gender);
  if (minAge) query = query.gte('age', parseInt(minAge));
  if (maxAge) query = query.lte('age', parseInt(maxAge));
  if (location) query = query.ilike('location', `%${location}%`);

  const { data: users, error } = await query.order('created_at', { ascending: false }).limit(50);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ users });
});

export default router;
