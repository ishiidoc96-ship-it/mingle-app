import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();
const LIPANA = process.env.LIPANA_BASE_URL || 'https://api.lipana.dev/v1';
const LIPANA_KEY = process.env.LIPANA_SECRET_KEY || '';

const normalizePhone = (phone) => {
  if (!phone) return '';
  let p = phone.replace(/\D/g, '');
  if (p.startsWith('0')) p = '254' + p.slice(1);
  return '+' + p;
};

router.post('/initiate', verifyToken, async (req, res) => {
  const { method, phone } = req.body;
  if (!method) return res.status(400).json({ error: 'Payment method is required' });

  if (method !== 'mpesa') {
    return res.status(400).json({ error: 'Only M-Pesa is supported at this time' });
  }

  const normalized = normalizePhone(phone);
  if (!normalized || !normalized.startsWith('+254')) {
    return res.status(400).json({ error: 'Valid M-Pesa phone required (e.g. 0712... or +254712...)' });
  }

  const { data: existing } = await supabase
    .from('payments').select('id').eq('user_id', req.userId).eq('status', 'completed').maybeSingle();

  if (existing) return res.status(409).json({ error: 'Already paid' });

  const id = uuidv4();
  const idempotencyKey = uuidv4();
  const amount = 100;

  let stkResult;
  try {
    const response = await fetch(`${LIPANA}/transactions/push-stk`, {
      method: 'POST',
      headers: {
        'x-api-key': LIPANA_KEY,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({ phone: normalized, amount }),
      signal: AbortSignal.timeout(15000),
    });
    stkResult = await response.json();
    if (!response.ok) {
      throw new Error(stkResult?.message || stkResult?.data?.message || 'Lipana request failed');
    }
  } catch (err) {
    console.error('Lipana STK push error:', err);
    return res.status(502).json({ error: err.message || 'Failed to initiate M-Pesa payment. Try again.' });
  }

  const checkoutRequestId = stkResult?.data?.checkoutRequestID || stkResult?.data?.checkout_request_id || '';
  const lipanaTxnId = stkResult?.data?.transactionId || stkResult?.data?.transaction_id || '';

  const { data: payment, error: paymentErr } = await supabase.from('payments').upsert({
    id,
    user_id: req.userId,
    method,
    amount,
    phone: normalized,
    status: 'pending',
    mpesa_receipt: null,
    lipana_transaction_id: lipanaTxnId,
    checkout_request_id: checkoutRequestId,
  }, { onConflict: 'checkout_request_id', ignoreDuplicates: false }).select().single();

  if (paymentErr) return res.status(500).json({ error: paymentErr.message });

  res.json({
    success: stkResult?.success !== false,
    paymentId: payment.id,
    checkoutRequestId,
    transactionId: lipanaTxnId,
    message: stkResult?.data?.message || 'STK push sent to your phone. Please complete the payment.',
  });
});

router.get('/status', verifyToken, async (req, res) => {
  const { data: payment } = await supabase
    .from('payments').select('*').eq('user_id', req.userId)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();

  res.json({
    paid: payment?.status === 'completed',
    payment,
  });
});

export default router;
