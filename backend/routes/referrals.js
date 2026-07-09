import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', verifyToken, async (req, res) => {
  const { data: user, error: userErr } = await supabase.from('users').select('referral_code, referred_by').eq('id', req.userId).single();
  if (userErr?.code === 'PGRST116' || !user) return res.status(404).json({ error: 'User not found' });
  if (userErr) return res.status(500).json({ error: userErr.message });

  const { data: referrals } = await supabase.from('referrals').select('id, status, reward_amount, created_at, referred_email').eq('referrer_id', req.userId).order('created_at', { ascending: false });
  const { data: completedRefs } = await supabase.from('referrals').select('reward_amount').eq('referrer_id', req.userId).eq('status', 'completed');
  const totalEarned = completedRefs?.reduce((acc, r) => acc + (r.reward_amount || 0), 0) || 0;
  const successful = referrals?.filter(r => r.status === 'completed').length || 0;

  res.json({ referralCode: user.referral_code, totalEarned, successful, referrals });
});

router.post('/submit', verifyToken, async (req, res) => {
  const { referralCode } = req.body;
  if (!referralCode) return res.status(400).json({ error: 'Referral code required' });

  const { data: referrer, error: refErr } = await supabase.from('users').select('id, email').eq('referral_code', referralCode.toUpperCase()).single();
  if (refErr?.code === 'PGRST116' || !referrer) return res.status(404).json({ error: 'Invalid referral code' });
  if (refErr) return res.status(500).json({ error: refErr.message });

  if (referrer.id === req.userId) return res.status(400).json({ error: 'Cannot use your own code' });

  const currentUser = await supabase.from('users').select('email, phone').eq('id', req.userId).single();
  const { data: existing, error: existErr } = await supabase.from('referrals').select('id').eq('referrer_id', referrer.id).eq('referred_email', currentUser.data.email).single();
  if (existing) return res.status(409).json({ error: 'Already referred' });
  if (existErr && existErr.code !== 'PGRST116') return res.status(500).json({ error: existErr.message });

  await supabase.from('users').update({ referred_by: referrer.id }).eq('id', req.userId);

  const refId = uuidv4();
  await supabase.from('referrals').insert({
    id: refId, referrer_id: referrer.id, referred_email: currentUser.data.email, referred_phone: currentUser.data.phone, status: 'completed'
  });

  const txId = uuidv4();
  await supabase.from('transactions').insert({
    id: txId, user_id: referrer.id, type: 'referral_bonus', amount: 50, description: 'Referral bonus', reference: refId
  });

  const { data: txRows } = await supabase.from('transactions').select('amount').eq('user_id', referrer.id).eq('type', 'referral_bonus');
  const referrerBalance = txRows?.reduce((acc, t) => acc + t.amount, 0) || 0;

  res.json({ success: true, message: 'Referral applied! You earned KSh 50.', referrerEarned: referrerBalance });
});

export default router;
