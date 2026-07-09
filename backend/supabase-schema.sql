-- Supabase schema for Mingle dating app
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  password TEXT NOT NULL,
  gender TEXT,
  age INTEGER,
  interested_in TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  is_verified INTEGER DEFAULT 0,
  is_admin INTEGER DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT NOW(),
  updated_at TEXT DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  matched_user_id TEXT NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  created_at TEXT DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  user1_id TEXT NOT NULL REFERENCES users(id),
  user2_id TEXT NOT NULL REFERENCES users(id),
  last_message TEXT,
  last_message_at TEXT DEFAULT NOW(),
  created_at TEXT DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id),
  sender_id TEXT NOT NULL REFERENCES users(id),
  text TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  referrer_id TEXT NOT NULL REFERENCES users(id),
  referred_email TEXT,
  referred_phone TEXT,
  status TEXT DEFAULT 'pending',
  reward_amount REAL DEFAULT 500,
  created_at TEXT DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  method TEXT NOT NULL,
  amount REAL NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'pending',
  mpesa_receipt TEXT,
  pesapal_order_tracking_id TEXT,
  pesapal_merchant_reference TEXT,
  created_at TEXT DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  description TEXT,
  reference TEXT,
  status TEXT DEFAULT 'completed',
  created_at TEXT DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data TEXT,
  read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matches_user ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_users ON chats(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
