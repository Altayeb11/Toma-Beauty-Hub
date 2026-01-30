# 🚀 NEXT STEPS - FRONTEND-ONLY + SUPABASE

## Status: BACKEND REMOVED ✅

The Express backend has been completely removed. Now frontend-only with Supabase.

---

## 1. Install Dependencies
```bash
npm install
```

This removes all backend packages and installs only frontend dependencies.

---

## 2. Set Up Supabase Credentials

### Get Your Keys:
1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_PUBLISHABLE_KEY`

### Update `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 3. Update Remaining Components

These still need to be updated to use `supabaseClient`:

### Articles.tsx
- Replace: `import { apiClient } from "@/lib/api"`
- With: `import { fetchArticles, createArticle, updateArticle, deleteArticle } from "@/lib/supabaseClient"`

### Routines.tsx
- Replace: `import { apiClient } from "@/lib/api"`
- With: `import { fetchRoutines, createRoutine, updateRoutine, deleteRoutine } from "@/lib/supabaseClient"`

### use-auth.ts
- Replace custom auth with Supabase Auth:
  ```typescript
  import { signIn, signOut, getCurrentUser, getSession } from "@/lib/supabaseClient"
  ```

---

## 4. Start Development

```bash
npm run dev
```

This runs Vite on `http://localhost:5173` (frontend only, no backend server)

---

## 5. Set Up Supabase RLS Policies

In Supabase Dashboard → SQL Editor, create policies for:

```sql
-- Allow admins full access
CREATE POLICY "Admin full access" ON articles
  AS (auth.uid() = '...');

-- Allow public read-only
CREATE POLICY "Public read-only" ON articles
  AS (true);
```

---

## 6. Set Up Supabase Tables

Make sure your Supabase project has these tables:
- `articles`
- `routines`
- `remedies`
- `auth.users` (built-in)

---

## Architecture Overview

```
┌─────────────────────┐
│   React Frontend    │
│  (localhost:5173)   │
└──────────┬──────────┘
           │
     ┌─────▼─────┐
     │ Supabase  │
     │ PostgreSQL│
     │ + Auth    │
     └───────────┘
```

---

## Remaining Work

- ⏳ Update Articles.tsx
- ⏳ Update Routines.tsx  
- ⏳ Update use-auth.ts
- ⏳ Set up RLS policies
- ⏳ Test with real Supabase instance
- ⏳ Remove old `apiClient.ts` (no longer needed)

---

## What Changed

| Item | Old | New |
|------|-----|-----|
| Backend | Express Server | None |
| Database Connection | Backend → Postgres | Frontend → Supabase |
| Dev Command | `npm run dev` (server) | `npm run dev` (Vite) |
| Dev Port | 5000 | 5173 |
| Auth | Express middleware | Supabase Auth |
| CRUD | API endpoints | Direct Supabase queries |

---

**Ready to test?**

1. Run `npm install`
2. Add Supabase credentials to `.env`
3. Run `npm run dev`
4. Visit `http://localhost:5173`

