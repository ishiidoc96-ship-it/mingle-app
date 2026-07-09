# Mingle

A dating and social matchmaking platform built for the Kenyan market. Users create profiles, swipe on others, match, chat, earn referral rewards, and pay membership fees via M-Pesa.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router v7
- **Backend:** Express.js, Node.js
- **Database:** Supabase (PostgreSQL)
- **Auth:** JWT + bcryptjs
- **Payments:** Lipana (M-Pesa STK Push)
- **Media:** Cloudinary (profile photos)
- **Deployment:** Vercel / Railway

## Project Structure

```
mingle-app-main/
├── frontend/          # React SPA
│   ├── src/
│   │   ├── pages/     # 24 page components
│   │   ├── components/# Reusable UI (TopBar, BottomNav, Avatar, etc.)
│   │   ├── context/   # AuthContext, ToastContext
│   │   ├── lib/       # Firebase config
│   │   ├── api.js     # Axios instance with interceptors
│   │   └── App.jsx    # Route definitions
│   └── vite.config.js
├── backend/           # Express API
│   ├── routes/        # 10 route modules
│   ├── middleware/     # JWT auth, admin auth
│   ├── db/            # Schema, migrations
│   ├── lib/           # Supabase client
│   └── server.js      # Entry point
├── api/               # Vercel serverless entry
├── public/admin/      # Admin panel
└── package.json       # Root scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account (for database)
- Cloudinary account (for image uploads)

### Installation

```bash
# Install all dependencies
npm run install:all

# Or install individually
cd backend && npm install
cd frontend && npm install
```

### Environment Variables

Create `backend/.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
ADMIN_SECRET=your_admin_secret
LIPANA_BASE_URL=https://api.lipana.dev/v1
LIPANA_SECRET_KEY=your_lipana_key
LIPANA_WEBHOOK_SECRET=your_webhook_secret
PORT=3001
```

### Development

```bash
# Run backend (port 3001)
npm run dev:backend

# Run frontend (port 5173, proxies /api to backend)
npm run dev:frontend
```

### Production Build

```bash
npm run build    # Builds frontend to frontend/dist/
npm start        # Starts backend server
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (email or phone) |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/me` | Update profile |
| GET | `/api/users/discover` | Get discoverable profiles |
| POST | `/api/users/:id/swipe` | Like/pass/super_like a user |
| GET | `/api/chats` | List user's chats |
| POST | `/api/chats/start` | Start a new chat |
| GET | `/api/chats/:id/messages` | Get chat messages |
| POST | `/api/chats/:id/messages` | Send a message |
| GET | `/api/referrals/dashboard` | Referral stats |
| POST | `/api/referrals/submit` | Apply a referral code |
| GET | `/api/earnings/wallet` | Wallet balance + transactions |
| POST | `/api/earnings/withdraw` | Withdraw to M-Pesa |
| POST | `/api/payments/initiate` | Start M-Pesa STK push |
| GET | `/api/payments/status` | Check payment status |
| GET | `/api/search` | Search users |
| GET | `/api/notifications` | List notifications |
| POST | `/api/mpesa/callback` | M-Pesa webhook |

## Database Schema

- **users** - User profiles, referral codes, admin flags
- **matches** - Swipe actions between users
- **chats** - Chat sessions between matched users
- **messages** - Individual messages
- **referrals** - Referral tracking and rewards
- **payments** - M-Pesa payment records
- **transactions** - Wallet ledger (bonuses, withdrawals)
- **notifications** - In-app notifications

## License

Private
