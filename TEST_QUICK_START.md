# 🚀 QUICK START - TESTING GUIDE (SUPABASE)

## 📍 File Locations

### Environment Variables
**File:** `/workspaces/Toma-Beauty/.env`
**Status:** ✅ Created - needs Supabase credentials

### Configuration Files
```
/workspaces/Toma-Beauty/
├── .env                    ← MAIN: Environment variables (create with your credentials!)
├── .env.example            ← Reference template
├── server/db.ts            ← Reads DATABASE_URL
├── public/supabase.js      ← Reads VITE_SUPABASE_URL & VITE_SUPABASE_PUBLISHABLE_KEY
├── drizzle.config.ts       ← Database schema
└── vite.config.ts          ← Frontend build
```

---

## 🎯 Getting Your Supabase Credentials

### Step 1: Get DATABASE_URL (Server-side)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings → Database**
4. Copy the connection string under "Connection string"
   - Use **Transaction mode** for your `.env`
   - Format: `postgresql://postgres.[PROJECT_ID]:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres`

Example:
```env
DATABASE_URL=postgresql://postgres.abc123:yourpassword123@db.abc123.supabase.co:5432/postgres
```

### Step 2: Get Supabase API Keys (Frontend)

1. In Supabase Dashboard → **Settings → API**
2. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`

Example:
```env
VITE_SUPABASE_URL=https://abc123.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔧 Setting Up .env File

### Edit Your .env File

```bash
# Open .env in your editor and add:
nano .env
# or
code .env
```

### Add Your Credentials

```env
# ===== DATABASE (from Supabase Settings → Database) =====
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_ID:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres

# ===== SERVER =====
PORT=5000
NODE_ENV=development

# ===== SESSION =====
SESSION_SECRET=your_super_secret_key_min_32_chars

# ===== ADMIN CREDENTIALS =====
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123

# ===== SUPABASE (from Supabase Settings → API) =====
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here

# ===== FRONTEND =====
VITE_API_URL=http://localhost:5000

# ===== OPTIONAL =====
LOG_LEVEL=info
DEBUG=false
```

---

## ▶️ Running Tests

### 1. Install Dependencies (if not done)
```bash
npm install
```

### 2. Push Database Schema to Supabase
```bash
npm run db:push
```

This creates all tables in your Supabase database.

### 3. Start Server
```bash
npm run dev
```

**Expected Output:**
```
12:34:56 PM [express] Server running on port 5000
12:34:57 PM [express] Database connected
```

### 4. Access Application
```
http://localhost:5000
```

### 5. Login as Admin
- Username: `admin` (from `.env` ADMIN_USERNAME)
- Password: `password123` (from `.env` ADMIN_PASSWORD)

### 6. Test Features

#### Test Articles CRUD
- [ ] Navigate to Articles page
- [ ] Click "Add Article"
- [ ] Create article with bilingual content
- [ ] View, edit, delete articles

#### Test Remedies Migration
- [ ] View remedies from Supabase database
- [ ] Create remedy (click + button)
- [ ] View recipe details
- [ ] Delete remedy

#### Test API Endpoints
```bash
# In another terminal

# Check API is running
curl http://localhost:5000/api/articles

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Create article
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"titleAr":"مقالة","titleEn":"Article",...}'
```

---

## 📋 Environment Variables Reference

| Variable | Source | Purpose |
|----------|--------|---------|
| `DATABASE_URL` | Supabase: Settings → Database | Server database connection |
| `VITE_SUPABASE_URL` | Supabase: Settings → API | Frontend Supabase URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase: Settings → API | Frontend Supabase anon key |
| `PORT` | Manual | Server port (default 5000) |
| `NODE_ENV` | Manual | development/production |
| `SESSION_SECRET` | Manual | Session encryption key |
| `ADMIN_USERNAME` | Manual | Login username |
| `ADMIN_PASSWORD` | Manual | Login password |
| `VITE_API_URL` | Manual | Frontend API endpoint |

---

## ⚠️ Important Notes

1. **Never commit `.env` file to git** (already in .gitignore)
2. **Keep DATABASE_URL and API keys secret** - don't share them
3. **Change SESSION_SECRET before production**
4. **Use strong passwords in production**
5. **VITE_SUPABASE_PUBLISHABLE_KEY is intentionally public** (for frontend use)
6. **DATABASE_URL is for server-side use only** (keep it secret)

---

## 🐛 Common Issues

### "DATABASE_URL is missing"
- [ ] Check `.env` file exists in root directory
- [ ] Verify DATABASE_URL is set correctly
- [ ] Copy from Supabase: Settings → Database → Connection string

### "Cannot connect to Supabase database"
- [ ] Verify DATABASE_URL format (should include `.supabase.co`)
- [ ] Check password is URL-encoded if it contains special characters
- [ ] Ensure Supabase project is active
- [ ] Test connection: `psql "your-database-url"`

### "Supabase credentials missing" (in frontend)
- [ ] Check VITE_SUPABASE_URL in `.env`
- [ ] Check VITE_SUPABASE_PUBLISHABLE_KEY in `.env`
- [ ] VITE variables must be set BEFORE starting dev server
- [ ] Restart dev server after updating .env

### "Port 5000 already in use"
- [ ] Change PORT in `.env` to 5001
- [ ] Or kill process: `lsof -ti:5000 | xargs kill -9`

### "Login fails"
- [ ] Check ADMIN_USERNAME and ADMIN_PASSWORD in `.env`
- [ ] Verify admin user exists in Supabase
- [ ] Check browser cookies enabled

---

## 📚 Documentation Files

- [TESTING_SETUP.md](TESTING_SETUP.md) - Detailed testing guide
- [PROGRESS_REPORT.md](PROGRESS_REPORT.md) - Project status
- [NEXT_STEPS.md](NEXT_STEPS.md) - Phase 5 planning
- [.env.example](.env.example) - Environment template

---

## ✅ Setup Checklist

- [ ] Supabase project created
- [ ] DATABASE_URL copied to `.env`
- [ ] VITE_SUPABASE_URL copied to `.env`
- [ ] VITE_SUPABASE_PUBLISHABLE_KEY copied to `.env`
- [ ] Other env variables set
- [ ] `npm install` completed
- [ ] `npm run db:push` completed
- [ ] Server starts: `npm run dev`
- [ ] Frontend loads: http://localhost:5000
- [ ] Can login as admin
- [ ] Can create/view/delete articles and remedies

---

**Ready to test?** 

1. Add credentials to `.env`
2. Run: `npm run db:push`
3. Run: `npm run dev`
4. Visit: http://localhost:5000

Questions? Check [TESTING_SETUP.md](TESTING_SETUP.md)
