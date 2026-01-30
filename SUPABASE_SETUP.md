# 🔌 SUPABASE SETUP GUIDE

## How to Get Your Supabase Credentials

### 1. Create a Supabase Project

If you don't have one:
- Go to [supabase.com](https://supabase.com)
- Sign up or login
- Click "New Project"
- Choose organization and set password
- Wait for project to initialize

### 2. Get DATABASE_URL

**For Server-Side Connection:**

1. In Supabase Dashboard, go to **Settings → Database**
2. Under "Connection string", you'll see options for different connection modes
3. Select **"Transaction mode"** (recommended for applications)
4. Copy the full connection string

**Example format:**
```
postgresql://postgres.xyzabc123def:your_password@db.xyzabc123def.supabase.co:5432/postgres
```

**Add to .env:**
```env
DATABASE_URL=postgresql://postgres.xyzabc123def:your_password@db.xyzabc123def.supabase.co:5432/postgres
```

### 3. Get API Keys

**For Frontend JavaScript Client:**

1. In Supabase Dashboard, go to **Settings → API**
2. You'll see several values:
   - **Project URL** - Copy this
   - **Anon public** - Copy this (this is your public key, safe to expose)
   - **Service role secret** - DON'T use this in frontend!

**Add to .env:**
```env
VITE_SUPABASE_URL=https://xyzabc123def.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9[...rest of key...]
```

### 4. Find Your Values

**Location in Supabase Dashboard:**
```
Dashboard Home
  ↓
Settings (gear icon, top right)
  ↓
Database (tab on left)
    - Connection string is here
  ↓
API (tab on left)
    - Project URL is here
    - Anon key is here
```

### 5. Common Issues

**"Cannot find connection string"**
- Make sure you're in the right project
- Go to Settings → Database tab
- Connection string should be visible on that page

**"Wrong password error"**
- Connection string might not have your current database password
- Try resetting database password in Settings → Database
- Generate new connection string

**"Connection refused"**
- Supabase project might be paused
- Go to Settings → Pause Project (if it shows "Resume" instead, it's paused)
- Resume the project if needed

---

## Your .env File Template

Copy and paste this into your `.env` file, replacing YOUR_VALUES:

```env
# ===== SUPABASE DATABASE CONNECTION =====
# From: Supabase Dashboard → Settings → Database → Connection string (Transaction mode)
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres

# ===== SERVER =====
PORT=5000
NODE_ENV=development

# ===== SESSION =====
SESSION_SECRET=your_random_session_key_at_least_32_chars_change_in_production

# ===== ADMIN CREDENTIALS =====
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123

# ===== SUPABASE API KEYS (FRONTEND) =====
# From: Supabase Dashboard → Settings → API
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[YOUR_ANON_KEY]

# ===== FRONTEND =====
VITE_API_URL=http://localhost:5000

# ===== OPTIONAL =====
LOG_LEVEL=info
DEBUG=false
```

---

## After Setting Up .env

1. **Push database schema:**
   ```bash
   npm run db:push
   ```
   This creates all the tables in Supabase

2. **Start development:**
   ```bash
   npm run dev
   ```

3. **Access the app:**
   ```
   http://localhost:5000
   ```

---

## Security Notes

- **DATABASE_URL**: Keep this SECRET! This is your private server connection.
- **VITE_SUPABASE_PUBLISHABLE_KEY**: This is intentionally PUBLIC. It's only for browser use.
- **VITE_SUPABASE_URL**: This is PUBLIC. It's only the project URL.
- **NEVER commit .env file** - it's already in .gitignore

---

## Need Help?

- Check Supabase docs: https://supabase.com/docs
- Project failing to connect? Check DATABASE_URL format
- Browser showing "Supabase credentials missing"? Check VITE_* variables

