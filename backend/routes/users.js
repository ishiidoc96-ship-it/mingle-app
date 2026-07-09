import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/discover', verifyToken, async (req, res) => {
  const { data: currentUser, error: userErr } = await supabase.from('users').select('*').eq('id', req.userId).single();
  if (userErr?.code === 'PGRST116' || !currentUser) return res.status(404).json({ error: 'User not found' });
  if (userErr) return res.status(500).json({ error: userErr.message });

  const { data: users, error } = await supabase.from('users').select('id, name, age, gender, location, bio, avatar_url').neq('id', req.userId).order('created_at', { ascending: false }).limit(20);
  if (error) return res.status(500).json({ error: error.message });

  const safe = users.filter(u => u.id !== req.userId);
  res.json({ users: safe });
});

router.get('/profile/me', verifyToken, async (req, res) => {
  const { data: user, error } = await supabase.from('users').select('*').eq('id', req.userId).single();
  if (error?.code === 'PGRST116' || !user) return res.status(404).json({ error: 'User not found' });
  if (error) return res.status(500).json({ error: error.message });
  const { password, ...safe } = user;
  res.json({ user: safe });
});

router.get('/:id/profile', verifyToken, async (req, res) => {
  const { data: user, error } = await supabase.from('users').select('id, name, age, gender, location, bio, avatar_url').eq('id', req.params.id).single();
  if (error?.code === 'PGRST116' || !user) return res.status(404).json({ error: 'User not found' });
  if (error) return res.status(500).json({ error: error.message });

  const { data: mutualMatches } = await supabase.from('matches').select('id').eq('user_id', req.params.id).eq('matched_user_id', req.userId).eq('action', 'like');
  const { data: reverseMatches } = await supabase.from('matches').select('id').eq('user_id', req.userId).eq('matched_user_id', req.params.id).eq('action', 'like');
  const isMatch = (mutualMatches?.length || 0) > 0 || (reverseMatches?.length || 0) > 0;

  res.json({ user: { ...user, isMatch } });
});

router.get('/:id', verifyToken, async (req, res) => {
  const { data: user, error } = await supabase.from('users').select('id, name, age, gender, location, bio, avatar_url').eq('id', req.params.id).single();
  if (error?.code === 'PGRST116' || !user) return res.status(404).json({ error: 'User not found' });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ user });
});

router.post('/:id/swipe', verifyToken, async (req, res) => {
  const { action } = req.body;
  if (!['like', 'pass', 'super_like'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  const { data: target, error: targetErr } = await supabase.from('users').select('id').eq('id', req.params.id).single();
  if (targetErr?.code === 'PGRST116' || !target) return res.status(404).json({ error: 'User not found' });
  if (targetErr) return res.status(500).json({ error: targetErr.message });

  const { error: insertErr } = await supabase.from('matches').insert({
    id: uuidv4(), user_id: req.userId, matched_user_id: req.params.id, action
  });
  if (insertErr) return res.status(500).json({ error: insertErr.message });

  const { data: mutual } = await supabase.from('matches').select('id').eq('user_id', req.params.id).eq('matched_user_id', req.userId).eq('action', 'like').single();
  res.json({ match: !!mutual });
});

export default router;
