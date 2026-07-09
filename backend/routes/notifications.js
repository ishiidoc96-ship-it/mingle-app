import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
  const { data: notifications } = await supabase.from('notifications').select('*').eq('user_id', req.userId).order('created_at', { ascending: false }).limit(50);
  res.json({ notifications });
});

router.get('/unread', verifyToken, async (req, res) => {
  const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', req.userId).eq('read', false);
  res.json({ unread: count || 0 });
});

router.put('/read-all', verifyToken, async (req, res) => {
  await supabase.from('notifications').update({ read: true }).eq('user_id', req.userId);
  res.json({ success: true });
});

router.put('/:id/read', verifyToken, async (req, res) => {
  const { data: notif, error } = await supabase.from('notifications').select('*').eq('id', req.params.id).eq('user_id', req.userId).single();
  if (error?.code === 'PGRST116' || !notif) return res.status(404).json({ error: 'Not found' });
  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('notifications').update({ read: true }).eq('id', req.params.id);
  res.json({ success: true });
});

export default router;
