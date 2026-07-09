import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
  const { data: chats, error } = await supabase.from('chats').select('*').or(`user1_id.eq.${req.userId},user2_id.eq.${req.userId}`).order('last_message_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  const otherIds = [...new Set(chats.map(c => c.user1_id === req.userId ? c.user2_id : c.user1_id))];
  const { data: otherUsers } = await supabase.from('users').select('id, name, avatar_url').in('id', otherIds);
  const userMap = Object.fromEntries((otherUsers || []).map(u => [u.id, u]));

  const enriched = chats.map(c => {
    const otherId = c.user1_id === req.userId ? c.user2_id : c.user1_id;
    const other = userMap[otherId] || {};
    return { ...c, other_name: other.name, other_avatar: other.avatar_url };
  });

  res.json({ chats: enriched });
});

router.post('/start', verifyToken, async (req, res) => {
  const { userId: otherId } = req.body;
  if (!otherId) return res.status(400).json({ error: 'User ID required' });
  if (otherId === req.userId) return res.status(400).json({ error: 'Cannot chat with yourself' });

  const { data: existing } = await supabase.from('chats').select('*')
    .or(`and(user1_id.eq.${req.userId},user2_id.eq.${otherId}),and(user1_id.eq.${otherId},user2_id.eq.${req.userId})`).maybeSingle();
  if (existing) return res.json({ chat: existing });

  const { data: chat, error } = await supabase.from('chats').insert({ id: uuidv4(), user1_id: req.userId, user2_id: otherId }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ chat });
});

router.get('/:chatId/messages', verifyToken, async (req, res) => {
  const { data: chat, error: chatErr } = await supabase.from('chats').select('*').eq('id', req.params.chatId).single();
  if (chatErr?.code === 'PGRST116' || !chat) return res.status(404).json({ error: 'Chat not found' });
  if (chatErr) return res.status(500).json({ error: chatErr.message });
  if (chat.user1_id !== req.userId && chat.user2_id !== req.userId) {
    return res.status(403).json({ error: 'Not part of this chat' });
  }

  const { data: messages } = await supabase.from('messages').select('*').eq('chat_id', req.params.chatId).order('created_at', { ascending: true });

  await supabase.from('messages').update({ read: true }).eq('chat_id', req.params.chatId).neq('sender_id', req.userId).eq('read', false);

  res.json({ messages });
});

router.post('/:chatId/messages', verifyToken, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'Message text required' });

  const { data: chat, error: chatErr } = await supabase.from('chats').select('*').eq('id', req.params.chatId).single();
  if (chatErr?.code === 'PGRST116' || !chat) return res.status(404).json({ error: 'Chat not found' });
  if (chatErr) return res.status(500).json({ error: chatErr.message });
  if (chat.user1_id !== req.userId && chat.user2_id !== req.userId) {
    return res.status(403).json({ error: 'Not part of this chat' });
  }

  const { data: msg, error } = await supabase.from('messages').insert({
    id: uuidv4(), chat_id: req.params.chatId, sender_id: req.userId, text: text.trim()
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('chats').update({ last_message: text.trim(), last_message_at: new Date().toISOString() }).eq('id', req.params.chatId);

  const otherId = chat.user1_id === req.userId ? chat.user2_id : chat.user1_id;
  const { data: user } = await supabase.from('users').select('name').eq('id', req.userId).single();
  await supabase.from('notifications').insert({
    id: uuidv4(), user_id: otherId, type: 'message', title: `New message from ${user?.name || 'Someone'}`, body: text.trim()
  });

  res.json({ message: msg });
});

router.get('/:chatId/unread', verifyToken, async (req, res) => {
  const { count } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('chat_id', req.params.chatId).neq('sender_id', req.userId).eq('read', false);
  res.json({ unread: count || 0 });
});

export default router;
