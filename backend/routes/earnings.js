import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();
const MIN_WITHDRAWAL = 500;

router.get('/wallet', verifyToken, async (req, res) => {
  const { data: completedTxs } = await supabase.from('transactions').select('*').eq('user_id', req.userId).eq('status', 'completed');
  const balance = completedTxs?.reduce((acc, t) => acc + t.amount, 0) || 0;

  const bonusTxs = completedTxs?.filter(t => t.type === 'referral_bonus') || [];
  const totalEarned = bonusTxs.reduce((acc, t) => acc + t.amount, 0);

  const { data: pendingRefs } = await supabase.from('referrals').select('reward_amount').eq('referrer_id', req.userId).eq('status', 'pending');
  const pendingRewards = pendingRefs?.reduce((acc, r) => acc + (r.reward_amount || 0), 0) || 0;

  const { data: transactions } = await supabase.from('transactions').select('*').eq('user_id', req.userId).order('created_at', { ascending: false }).limit(50);

  res.json({ balance, totalEarned, pendingRewards, transactions, minWithdrawal: MIN_WITHDRAWAL });
});

router.post('/withdraw', verifyToken, async (req, res) => {
  const { phone, amount } = req.body;
  if (!phone || !amount) return res.status(400).json({ error: 'Phone and amount required' });

  if (amount < MIN_WITHDRAWAL) {
    return res.status(400).json({ error: `Minimum withdrawal is KSh ${MIN_WITHDRAWAL}` });
  }

  const { data: completedTxs } = await supabase.from('transactions').select('amount').eq('user_id', req.userId).eq('status', 'completed');
  const balance = completedTxs?.reduce((acc, t) => acc + t.amount, 0) || 0;
  if (balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

  const normalized = phone.replace(/\D/g, '');
  const phoneE164 = normalized.startsWith('254') ? `+${normalized}` : normalized.startsWith('0') ? `+254${normalized.slice(1)}` : `+${normalized}`;

  const id = uuidv4();
  const { error } = await supabase.from('transactions').insert({
    id, user_id: req.userId, type: 'withdrawal', amount: -Math.abs(amount), description: `Withdraw to M-Pesa ${phoneE164}`, reference: `WTH${Date.now()}`, status: 'completed'
  });
  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, message: `KSh ${amount} withdrawn to ${phoneE164}` });
});

export default router;
