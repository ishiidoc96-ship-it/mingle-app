import { Router } from 'express';
import crypto from 'crypto';
import { supabase } from '../lib/supabase.js';

const router = Router();

function verifyWebhookSignature(signature, rawBody, secret) {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

router.post('/callback', (req, res) => {
  const signature = req.headers['x-lipana-signature'] || req.headers['X-Lipana-Signature'];
  const webhookSecret = process.env.LIPANA_WEBHOOK_SECRET || '';
  const rawBody = req.rawBody || '';
  let parsed;
  try { parsed = JSON.parse(rawBody.toString()); } catch {
    return res.status(400).send('Bad Request');
  }
  if (!verifyWebhookSignature(signature, rawBody.toString(), webhookSecret)) {
    return res.status(401).send('Unauthorized');
  }

  res.status(200).json({ received: true });

  const { event, data } = parsed;
  (async () => {
    try {
      const checkoutRequestId = data.checkoutRequestID || data.checkout_request_id || '';
      if (!checkoutRequestId) return;
      const { data: payment } = await supabase
        .from('payments').select('id, user_id, amount')
        .eq('checkout_request_id', checkoutRequestId).maybeSingle();
      if (!payment) return;

      if (event === 'payment.success' || event === 'transaction.success') {
        const now = new Date().toISOString();
        const txnId = data.transactionId || data.transaction_id || '';
        await supabase.from('payments').update({ status: 'completed', lipana_transaction_id: txnId, paid_at: now }).eq('id', payment.id);
        await supabase.from('transactions').insert({
          id: crypto.randomUUID(), user_id: payment.user_id, type: 'payment',
          amount: -payment.amount, description: 'Membership fee payment', reference: txnId, status: 'completed', created_at: now,
        });
      } else if (event === 'payment.failed' || event === 'payment.cancelled' || event === 'transaction.failed' || event === 'transaction.cancelled') {
        await supabase.from('payments').update({ status: 'failed' }).eq('id', payment.id);
      } else {
        const ns = data.status === 'success' ? 'completed' : data.status === 'failed' ? 'failed' : 'pending';
        await supabase.from('payments').update({ status: ns }).eq('id', payment.id);
      }
    } catch (err) {
      console.error('Webhook background processing error:', err);
    }
  })();
});

export default router;
