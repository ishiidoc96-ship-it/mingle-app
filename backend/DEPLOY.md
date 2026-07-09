# Deploy to Vercel

## Prerequisites
- Vercel account (free at vercel.com)
- Supabase account (free at supabase.com)
- Cloudinary account (free at cloudinary.com)
- Git repository on GitHub

## 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** in the sidebar
3. Copy the contents of `backend/supabase-schema.sql` and paste it into the SQL Editor
4. Click **Run** to create all tables and indexes
5. Go to **Project Settings** > **API** and copy:
   - `Project URL` -> `SUPABASE_URL`
   - `anon public` key -> `SUPABASE_ANON_KEY`

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit for Vercel deploy"
git remote add origin https://github.com/yourusername/mingle-app.git
git push -u origin main
```

## 3. Deploy on Vercel

### Option A: Via Vercel UI (easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** and select your GitHub repository
3. **Framework Preset**: Other
4. **Root Directory**: `/` (leave as root)
5. **Build Command**: (leave as default, uses `vercel.json`)
6. Scroll to **Environment Variables** and add:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-key-here
   JWT_SECRET=your-secret-key
   ADMIN_SECRET=your-admin-password
   ```
7. Click **Deploy**

### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 4. Seed Users

After your first deploy, seed users in Supabase:

**Option A - Using Supabase Table Editor:**
Go to Supabase > Table Editor > `users` > Insert Row, add users manually.

**Option B - Run locally first:**
```bash
cd backend
node scripts/seed_users.mjs
```
This creates 100 users with password `Mingle123!`. Then use the Supabase Table Editor to see and export them.

## 5. Access the App

- **Main App**: `https://your-app.vercel.app`
- **Admin Panel**: `https://your-app.vercel.app/admin`
- Login with seeded credentials: `email: first.lastname1@mingle.app`, `password: Mingle123!`

## 6. Admin Panel Auth

Go to `/admin` and enter the `ADMIN_SECRET` you set in Vercel environment variables.

## How It Works

The Vercel deployment uses a single project with:

- **Frontend**: Built by Vite, served as static files from `frontend/dist`
- **Backend API**: Express app bundled as a serverless function via `backend/api/index.js`
- **Routing**: `/api/*` requests go to the serverless function, everything else serves the frontend SPA

### Architecture

```
vercel.json (root)
  -> builds frontend (Vite)
  -> builds backend/api/index.js (serverless function)
  -> routes /api/* to serverless function
  -> serves frontend/dist for all other routes
```

## Notes

- SQLite is disabled on Vercel — all data is in Supabase
- Photos are uploaded directly to Cloudinary (no server storage)
- The local photo seeding script (`upload_photos.mjs`) is for local setup only
- For production photo seeding via admin panel, upload photos to Cloudinary first, then use the admin panel
