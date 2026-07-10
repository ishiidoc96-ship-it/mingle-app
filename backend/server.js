import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import referralRoutes from './routes/referrals.js';
import paymentRoutes from './routes/payments.js';
import earningsRoutes from './routes/earnings.js';
import chatRoutes from './routes/chats.js';
import searchRoutes from './routes/search.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import mpesaRoutes from './routes/mpesa.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mpesa', express.raw({ type: 'application/json' }), mpesaRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Mingle API' });
});

if (!process.env.VERCEL) {
  const distPath = join(__dirname, '..', 'frontend', 'dist');
  const adminPath = join(__dirname, '..', 'public', 'admin');

  app.use('/admin', express.static(adminPath));
  app.get('/admin', (req, res) => {
    res.sendFile(join(adminPath, 'index.html'), err => {
      if (err) return res.status(404).json({ error: 'Admin panel not found' });
    });
  });

  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
    res.sendFile(join(distPath, 'index.html'), err => {
      if (err) return res.status(404).json({ error: 'Not found' });
    });
  });

  const { initDb } = await import('./db/db.js');
  await initDb().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
}

app.listen(PORT, () => {
  console.log(`Mingle running at http://localhost:${PORT}`);
});

export default app;
