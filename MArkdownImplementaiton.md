# Toma Beauty Hub - Implementation Progress Tracker

## 📋 IMPLEMENTATION STATUS - FRONTEND-ONLY + SUPABASE

**Last Updated:** January 30, 2026  
**Status:** 🔄 REFACTORING TO FRONTEND-ONLY  
**Architecture:** React Frontend + Supabase Backend (No Express Server)

---

## 🎯 NEW ARCHITECTURE

**Old (Removed):** Frontend → Express Backend → Supabase Database  
**New (Current):** Frontend (React) → Supabase (Auth + Database)

Backend Express server has been removed. All logic now in frontend using Supabase client.

---

## 📋 NEW IMPLEMENTATION PHASES

### ✅ Phase 1: Supabase Authentication (Frontend)
- Remove Express auth endpoints
- Use Supabase Auth in React components
- Authenticate directly via supabase.auth.signInWithPassword()
- Session management via Supabase

### ✅ Phase 2: Direct Supabase CRUD (Frontend)
- Replace Express endpoints with Supabase queries
- Use supabase.from('table_name') for all operations
- Implement RLS (Row-Level Security) policies
- Client-side CRUD operations

### ✅ Phase 3: Supabase Client Wrapper
- Create `supabaseClient.ts` with helper functions
- Wrap common operations (createArticle, updateRoutine, etc.)
- Error handling and type safety

### ✅ Phase 4: Migrate Components to Supabase
- Update Articles.tsx, Routines.tsx, Remedies.tsx
- Use supabaseClient wrapper functions
- Remove apiClient references
- Update state management for Supabase

---

## 📝 FILES BEING CHANGED

**Deleted:**
- ❌ `server/` folder (all backend files)
- ❌ Backend dependencies from package.json

**Created:**
- ✅ `client/src/lib/supabaseClient.ts` - Supabase helper functions

**Updated:**
- ✅ `client/src/pages/Articles.tsx` - Use Supabase directly
- ✅ `client/src/pages/Routines.tsx` - Use Supabase directly
- ✅ `client/src/pages/Remedies.tsx` - Use Supabase directly
- ✅ `client/src/hooks/use-auth.ts` - Supabase auth
- ✅ `package.json` - Remove backend dependencies
- ✅ `.env` - Only Supabase frontend credentials

---

## ✅ PHASE 1: SECURITY & DATA INTEGRITY (CRITICAL) - COMPLETE

### Change 1: Authentication Middleware & Routes ✅ COMPLETED

#### Files Modified:
- **server/storage.ts** - Added authentication methods
- **server/routes.ts** - Added middleware and auth endpoints
- **client/src/pages/Articles.tsx** - Integrated real authentication

#### Implementation Details:

**1a. Authentication Interface (server/storage.ts)**
```typescript
export interface IStorage {
  // ... existing methods
  verifyPassword(username: string, password: string): Promise<User | null>;
  updateArticle(id: number, data: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: number): Promise<void>;
}
```

**1b. Password Verification (server/storage.ts)**
```typescript
async verifyPassword(username: string, password: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  if (!user) return null;
  // TODO: Use bcrypt for production password hashing
  if (user.password !== password) return null;
  return user;
}
```

**⚠️ SECURITY NOTE:** Current implementation uses plain text comparison. Production must use bcrypt:
```typescript
import bcrypt from 'bcrypt';
const isValid = await bcrypt.compare(password, user.password);
```

**1c. Admin Authentication Middleware (server/routes.ts)**
```typescript
const ADMIN_ID = 1; // Default admin user ID
```

const authenticateAdmin = (req: any, res: any, next: any) => {
  const userId = req.session?.userId;
  
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  if (userId !== ADMIN_ID) {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
};
```

**1d. Authentication Endpoints (server/routes.ts)**

**POST /api/auth/login**
```typescript
app.post("/api/auth/login", async (req: any, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  
  try {
    const user = await storage.verifyPassword(username, password);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    req.session!.userId = user.id;
    res.json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});
```

**POST /api/auth/logout**
```typescript
app.post("/api/auth/logout", (req: any, res) => {
  req.session!.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});
```

**GET /api/auth/me** - Returns authentication status
```typescript
app.get("/api/auth/me", (req: any, res) => {
  if (!req.session?.userId) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({ 
    authenticated: true, 
    userId: req.session.userId, 
    isAdmin: req.session.userId === ADMIN_ID 
  });
});
```

**1e. Article Endpoints with Authentication Protection (server/routes.ts)**

**GET /api/articles** - Public, no auth required
```typescript
app.get(api.articles.list.path, async (_req, res) => {
  try {
    const articles = await storage.getArticles();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});
```

**POST /api/articles** - Admin only, with middleware protection
```typescript
app.post(api.articles.list.path, authenticateAdmin, async (req, res) => {
  try {
    const data = insertArticleSchema.parse(req.body);
    const article = await storage.createArticle(data);
    res.status(201).json(article);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Invalid article data" });
  }
});
```

**PUT /api/articles/:id** - Admin only, update article
```typescript
app.put(api.articles.get.path, authenticateAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = insertArticleSchema.partial().parse(req.body);
    const article = await storage.updateArticle(id, data);
    res.json(article);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Invalid article data" });
  }
});
```

**DELETE /api/articles/:id** - Admin only, delete article
```typescript
app.delete(api.articles.get.path, authenticateAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await storage.deleteArticle(id);
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete article" });
  }
});
```

**1f. Updated Articles.tsx Component**

Removed hardcoded `setIsAdmin(true)` and replaced with real authentication check:

```typescript
const checkAuth = async () => {
  try {
    const res = await fetch("/api/auth/me");
    if (res.ok) {
      const data = await res.json();
      setIsAdmin(data.isAdmin || false);
    } else {
      setIsAdmin(false);
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    setIsAdmin(false);
  }
};
```

Replaced Supabase queries with Express API calls:

```typescript
const fetchArticles = async () => {
  try {
    const res = await fetch("/api/articles");
    if (!res.ok) throw new Error("Failed to fetch articles");
    const data = await res.json();
    setArticles(data);
    setError(null);
  } catch (error: any) {
    setError(error.message);
    console.error("Error fetching articles:", error);
  }
};

const handleAdd = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (!newArt.titleAr.trim() || !newArt.descAr.trim()) {
    setError("العنوان والنص مطلوبان");
    return;
  }

  try {
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titleAr: newArt.titleAr,
        titleEn: newArt.titleAr,
        summaryAr: newArt.descAr.substring(0, 100),
        summaryEn: newArt.descAr.substring(0, 100),
        contentAr: newArt.descAr,
        contentEn: newArt.descAr,
        category: "beauty",
        imageUrl: newArt.image || null,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add article");
    }

    await fetchArticles();
    setShowForm(false);
    setNewArt({ titleAr: "", descAr: "", image: "" });
  } catch (error: any) {
    setError(error.message || "Failed to add article");
  }
};

const deleteArt = async (id: any) => {
  if (!confirm("حذف المقال؟")) return;

  setError(null);
  try {
    const res = await fetch(`/api/articles/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete article");
    }

    await fetchArticles();
  } catch (error: any) {
    setError(error.message || "Failed to delete article");
  }
};
```

### ✅ Phase 1 - COMPLETED
- ✅ Authentication middleware implemented
- ✅ Password verification added (plain text - needs bcrypt upgrade)
- ✅ Login/Logout/Auth status endpoints created
- ✅ Article endpoints protected with admin middleware
- ✅ Articles.tsx updated to use real auth and API instead of Supabase direct queries
- ✅ Error handling with user-facing messages
- ✅ Input validation in client

---

## 🔄 NEXT PHASES (Coming Next)

### Phase 2: Complete Missing API Endpoints ✅ COMPLETED

#### Files Modified:
- **server/storage.ts** - Extended IStorage interface with Routine & Remedy CRUD
- **server/routes.ts** - Added CRUD endpoints for Routines and Remedies

#### 2a. Extended Storage Interface (server/storage.ts)

Added new methods to IStorage interface:

```typescript
export interface IStorage {
  // ... existing methods
  
  // Routine CRUD
  getRoutines(): Promise<Routine[]>;
  createRoutine(routine: InsertRoutine): Promise<Routine>;
  updateRoutine(id: number, data: Partial<InsertRoutine>): Promise<Routine>;
  deleteRoutine(id: number): Promise<void>;

  // Remedy CRUD
  getRemedies(): Promise<Remedy[]>;
  createRemedy(remedy: InsertRemedy): Promise<Remedy>;
  updateRemedy(id: number, data: Partial<InsertRemedy>): Promise<Remedy>;
  deleteRemedy(id: number): Promise<void>;
}
```

#### 2b. Implemented Storage Methods (server/storage.ts)

**Routine Methods:**
```typescript
async createRoutine(insertRoutine: InsertRoutine): Promise<Routine> {
  const [routine] = await db.insert(routines).values(insertRoutine).returning();
  return routine;
}

async updateRoutine(id: number, data: Partial<InsertRoutine>): Promise<Routine> {
  const [routine] = await db
    .update(routines)
    .set(data)
    .where(eq(routines.id, id))
    .returning();
  return routine;
}

async deleteRoutine(id: number): Promise<void> {
  await db.delete(routines).where(eq(routines.id, id));
}
```

**Remedy Methods:**
```typescript
async createRemedy(insertRemedy: InsertRemedy): Promise<Remedy> {
  const [remedy] = await db.insert(remedies).values(insertRemedy).returning();
  return remedy;
}

async updateRemedy(id: number, data: Partial<InsertRemedy>): Promise<Remedy> {
  const [remedy] = await db
    .update(remedies)
    .set(data)
    .where(eq(remedies.id, id))
    .returning();
  return remedy;
}

async deleteRemedy(id: number): Promise<void> {
  await db.delete(remedies).where(eq(remedies.id, id));
}
```

#### 2c. New API Endpoints (server/routes.ts)

**Routine Endpoints:**

**POST /api/routines** - Create routine (admin only)
```typescript
app.post(api.routines.list.path, authenticateAdmin, async (req, res) => {
  try {
    const data = insertRoutineSchema.parse(req.body);
    const routine = await storage.createRoutine(data);
    res.status(201).json(routine);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Invalid routine data" });
  }
});
```

**PUT /api/routines/:id** - Update routine (admin only)
```typescript
app.put("/api/routines/:id", authenticateAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = insertRoutineSchema.partial().parse(req.body);
    const routine = await storage.updateRoutine(id, data);
    res.json(routine);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Invalid routine data" });
  }
});
```

**DELETE /api/routines/:id** - Delete routine (admin only)
```typescript
app.delete("/api/routines/:id", authenticateAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await storage.deleteRoutine(id);
    res.json({ message: "Routine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete routine" });
  }
});
```

**Remedy Endpoints:**

**POST /api/remedies** - Create remedy (admin only)
```typescript
app.post(api.remedies.list.path, authenticateAdmin, async (req, res) => {
  try {
    const data = insertRemedySchema.parse(req.body);
    const remedy = await storage.createRemedy(data);
    res.status(201).json(remedy);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Invalid remedy data" });
  }
});
```

**PUT /api/remedies/:id** - Update remedy (admin only)
```typescript
app.put("/api/remedies/:id", authenticateAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = insertRemedySchema.partial().parse(req.body);
    const remedy = await storage.updateRemedy(id, data);
    res.json(remedy);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Invalid remedy data" });
  }
});
```

**DELETE /api/remedies/:id** - Delete remedy (admin only)
```typescript
app.delete("/api/remedies/:id", authenticateAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await storage.deleteRemedy(id);
    res.json({ message: "Remedy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete remedy" });
  }
});
```

### ✅ Phase 2 - COMPLETED
- ✅ Routine CRUD methods added to Storage layer
- ✅ Remedy CRUD methods added to Storage layer
- ✅ All admin-protected endpoints implemented
- ✅ Zod schema validation on all POST/PUT requests
- ✅ Proper error handling and response codes

---

### Phase 3: Consolidate Data Source ✅ COMPLETED

#### Files Modified/Created:
- **client/src/lib/api.ts** - NEW unified API client
- **client/src/pages/Home.tsx** - Migrated from Supabase to API client

#### 3a. Unified API Client (client/src/lib/api.ts) - NEW FILE

Created centralized API client to replace direct Supabase queries:

```typescript
export const apiClient = {
  // Authentication methods
  async login(username: string, password: string) { ... }
  async logout() { ... }
  async checkAuth() { ... }

  // Article methods
  async getArticles(): Promise<Article[]> { ... }
  async createArticle(data: InsertArticle): Promise<Article> { ... }
  async updateArticle(id: number, data: Partial<InsertArticle>): Promise<Article> { ... }
  async deleteArticle(id: number): Promise<void> { ... }

  // Routine methods
  async getRoutines(): Promise<Routine[]> { ... }
  async createRoutine(data: InsertRoutine): Promise<Routine> { ... }
  async updateRoutine(id: number, data: Partial<InsertRoutine>): Promise<Routine> { ... }
  async deleteRoutine(id: number): Promise<void> { ... }

  // Remedy methods
  async getRemedies(): Promise<Remedy[]> { ... }
  async createRemedy(data: InsertRemedy): Promise<Remedy> { ... }
  async updateRemedy(id: number, data: Partial<InsertRemedy>): Promise<Remedy> { ... }
  async deleteRemedy(id: number): Promise<void> { ... }
};
```

#### 3b. Updated Home.tsx Component

**Migrated from:**
- Supabase direct queries
- Unused React Query hooks

**To:**
- Centralized apiClient
- Proper loading and error states

```typescript
import { apiClient } from "@/lib/api";

const fetchArticles = async () => {
  setIsLoading(true);
  try {
    const articles = await apiClient.getArticles();
    const latest = articles.sort((a, b) => b.id - a.id).slice(0, 3);
    setLocalArticles(latest);
  } catch (err) {
    setLocalArticles([]);
  } finally {
    setIsLoading(false);
  }
};
```

### ✅ Phase 3 - COMPLETED
- ✅ Unified API client created
- ✅ Home.tsx migrated from Supabase
- ✅ All API calls use centralized client

---

### ✅ Phase 4 - COMPLETED
- ✅ Remedies migrated from localStorage to database
- ✅ Remedies.tsx refactored to use apiClient
- ✅ Bilingual support added to Remedies form
- ✅ Error and loading states implemented
- ✅ Real authentication check integrated

---

### Phase 5: Security Hardening (HIGH Priority - CRITICAL)
- [ ] Implement bcrypt for password hashing (currently plain-text ⚠️)
- [ ] Add CSRF token protection to POST/PUT/DELETE endpoints
- [ ] Implement rate limiting on authentication endpoint
- [ ] Add security headers via Helmet.js
- [ ] Validate environment variables on startup

---

## 🗄️ ORIGINAL DATABASE SCHEMA (Reference)

### Core Tables

#### 9. article_tags
```sql
CREATE TABLE public.article_tags (
    article_id uuid NOT NULL REFERENCES public.articles(id),
    tag_id uuid NOT NULL REFERENCES public.tags(id),
    PRIMARY KEY (article_id, tag_id)
);
```

#### 10. comments
```sql
CREATE TABLE public.comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id uuid NOT NULL REFERENCES public.articles(id),
    content text NOT NULL,
    author_name text,
    author_email text,
    author_ip text,
    is_anonymous boolean NOT NULL DEFAULT true,
    is_visible boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
```

---

## 🔒 Security: Row-Level Security (RLS) Policies

### ⚠️ CRITICAL SECURITY FIXES REQUIRED

The following tables have RLS enabled but **NO policies** (major security vulnerability):
- `images`
- `routine_steps`
- `remedy_ingredients`
- `tags`
- `article_tags`

### Required RLS Policies to Add

Run these SQL statements in Supabase SQL Editor:

```sql
-- ============================================
-- IMAGES TABLE
-- ============================================
-- Public: Read all images
CREATE POLICY "images_public_select" 
ON public.images
FOR SELECT 
TO anon, authenticated
USING (true);

-- Admin: Full CRUD
CREATE POLICY "images_admin_all" 
ON public.images
FOR ALL 
TO authenticated
USING (auth.uid() = '48c66ca3-9e0b-4dce-9faa-d485bece6bf1'::uuid)
WITH CHECK (auth.uid() = '48c66ca3-9e0b-4dce-9faa-d485bece6bf1'::uuid);

-- ============================================
-- ROUTINE_STEPS TABLE
-- ============================================
-- Public: Read steps only from published routines
CREATE POLICY "routine_steps_public_select" 
ON public.routine_steps
FOR SELECT 
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.routines 
        WHERE routines.id = routine_steps.routine_id 
        AND routines.published_at IS NOT NULL
    )
);

-- Admin: Full CRUD
CREATE POLICY "routine_steps_admin_all" 
ON public.routine_steps
FOR ALL 
TO authenticated
USING (auth.uid() = '48c66ca3-9e0b-4dce-9faa-d485bece6bf1'::uuid)
WITH CHECK (auth.uid() = '48c66ca3-9e0b-4dce-9faa-d485bece6bf1'::uuid);

-- ============================================
-- REMEDY_INGREDIENTS TABLE
-- ============================================
-- Public: Read ingredients only from published remedies
CREATE POLICY "remedy_ingredients_public_select" 
ON public.remedy_ingredients
FOR SELECT 
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.remedies 
        WHERE remedies.id = remedy_ingredients.remedy_id 
        AND remedies.published_at IS NOT NULL
    )
);

-- Admin: Full CRUD
CREATE POLICY "remedy_ingredients_admin_all" 
ON public.remedy_ingredients
FOR ALL 
TO authenticated
USING (auth.uid() = '48c66ca3-9e0b-4dce-9faa-d485bece6bf1'::uuid)
WITH CHECK (auth.uid() = '48c66ca3-9e0b-4dce-9faa-d485bece6bf1'::uuid);

-- ============================================
-- TAGS TABLE
-- ============================================
-- Public: Read all tags
CREATE POLICY "tags_public_select" 
ON public.tags
FOR SELECT 
TO anon, authenticated
USING (true);

-- Admin: Full CRUD
CREATE POLICY "tags_admin_all" 
ON public.tags
FOR ALL 
TO authenticated
USING (auth.uid() = '48c66ca3-9e0b-4dce-9faa-d485bece6bf1'::uuid)
WITH CHECK (auth.uid() = '48c66ca3-9e0b-4dce-9faa-d485bece6bf1'::uuid);

-- ============================================
-- ARTICLE_TAGS TABLE
-- ============================================
-- Public: Read tags only from published articles
CREATE POLICY "article_tags_public_select" 
ON public.article_tags
FOR SELECT 
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.articles 
        WHERE articles.id = article_tags.article_id 
        AND articles.published_at IS NOT NULL
    )
);

-- Admin: Full CRUD
CREATE POLICY "article_tags_admin_all" 
ON public.article_tags
FOR ALL 
TO authenticated
USING (auth.uid() = '48c66ca3-9e0b-4dce-9faa-d485bece6bf1'::uuid)
WITH CHECK (auth.uid() = '48c66ca3-9e0b-4dce-9faa-d485bece6bf1'::uuid);
```

### Existing RLS Policies (Already Configured)

#### Categories
- ✅ Public can read all
- ✅ Admin has full CRUD

#### Articles
- ✅ Public can read only published (`published_at IS NOT NULL`)
- ✅ Admin has full CRUD
- ✅ Owner has full CRUD on their own content

#### Routines
- ✅ Public can read only published
- ✅ Admin has full CRUD

#### Remedies
- ✅ Public can read only published
- ✅ Admin has full CRUD

#### Comments
- ✅ Public can insert anonymous comments
- ✅ Public can read visible comments
- ✅ Admin can select/insert/update/delete all

---

## 🪣 Supabase Storage Configuration

### Create Storage Bucket

Run in Supabase SQL Editor or use Dashboard → Storage:

```sql
-- Create bucket for cached images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'beauty-blog-images',
    'beauty-blog-images',
    true,  -- Public bucket for cached images
    5242880,  -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;
```

### Storage RLS Policies

```sql
-- Public: Read all cached images
CREATE POLICY "beauty_images_public_select"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'beauty-blog-images');

-- Admin: Upload images
CREATE POLICY "beauty_images_admin_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'beauty-blog-images' 
    AND auth.uid() = '48c66ca3-9e0b-4dce-9faa-d485bece6bf1'::uuid
);

-- Admin: Delete images
CREATE POLICY "beauty_images_admin_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'beauty-blog-images' 
    AND auth.uid() = '48c66ca3-9e0b-4dce-9faa-d485bece6bf1'::uuid
);
```

---

## 🔧 Frontend Integration

### Environment Variables

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Security Note**: The anon key is safe to expose in frontend code. RLS policies prevent unauthorized writes.

### Install Dependencies

```bash
npm install @supabase/supabase-js
```

### Supabase Client Setup

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

---

## 📘 TypeScript Types

Create `src/lib/database.types.ts`:

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      images: {
        Row: {
          id: string
          bucket_id: string | null
          object_key: string | null
          url: string | null
          width: number | null
          height: number | null
          mime_type: string | null
          is_cached: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          bucket_id?: string | null
          object_key?: string | null
          url?: string | null
          width?: number | null
          height?: number | null
          mime_type?: string | null
          is_cached?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          bucket_id?: string | null
          object_key?: string | null
          url?: string | null
          width?: number | null
          height?: number | null
          mime_type?: string | null
          is_cached?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      articles: {
        Row: {
          id: string
          category_id: string | null
          title: string
          slug: string
          description: string
          body: string | null
          meta_description: string | null
          hero_image_id: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          slug: string
          description: string
          body?: string | null
          meta_description?: string | null
          hero_image_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string
          slug?: string
          description?: string
          body?: string | null
          meta_description?: string | null
          hero_image_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      routines: {
        Row: {
          id: string
          category_id: string | null
          title: string
          slug: string
          description: string | null
          meta_description: string | null
          hero_image_id: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          slug: string
          description?: string | null
          meta_description?: string | null
          hero_image_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string
          slug?: string
          description?: string | null
          meta_description?: string | null
          hero_image_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      routine_steps: {
        Row: {
          id: string
          routine_id: string
          step_order: number
          title: string | null
          content: string
          duration_minutes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          routine_id: string
          step_order: number
          title?: string | null
          content: string
          duration_minutes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          routine_id?: string
          step_order?: number
          title?: string | null
          content?: string
          duration_minutes?: number | null
          created_at?: string
        }
      }
      remedies: {
        Row: {
          id: string
          category_id: string | null
          title: string
          slug: string
          description: string
          preparation: string
          meta_description: string | null
          hero_image_id: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          slug: string
          description: string
          preparation: string
          meta_description?: string | null
          hero_image_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string
          slug?: string
          description?: string
          preparation?: string
          meta_description?: string | null
          hero_image_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      remedy_ingredients: {
        Row: {
          id: string
          remedy_id: string
          ingredient_order: number
          name: string
          quantity: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          remedy_id: string
          ingredient_order: number
          name: string
          quantity?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          remedy_id?: string
          ingredient_order?: number
          name?: string
          quantity?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
      }
      comments: {
        Row: {
          id: string
          article_id: string
          content: string
          author_name: string | null
          author_email: string | null
          author_ip: string | null
          is_anonymous: boolean
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          article_id: string
          content: string
          author_name?: string | null
          author_email?: string | null
          author_ip?: string | null
          is_anonymous?: boolean
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          content?: string
          author_name?: string | null
          author_email?: string | null
          author_ip?: string | null
          is_anonymous?: boolean
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
```

---

## 🔐 Authentication Implementation

### Admin Login Flow

Create `src/hooks/useAuth.ts`:

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

const ADMIN_UUID = '48c66ca3-9e0b-4dce-9faa-d485bece6bf1';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.id === ADMIN_UUID);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.id === ADMIN_UUID);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    if (data.user?.id !== ADMIN_UUID) {
      await supabase.auth.signOut();
      throw new Error('Unauthorized: Admin access only');
    }
    
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    isAdmin,
    loading,
    signIn,
    signOut,
  };
}
```

### Admin Login Component

Create `src/components/AdminLogin.tsx`:

```typescript
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        
        {error && <div className="error">{error}</div>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
```

### Protected Route Component

Create `src/components/ProtectedRoute.tsx`:

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

---

## 📝 CRUD Operations Examples

### Articles CRUD

Create `src/services/articles.ts`:

```typescript
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Article = Database['public']['Tables']['articles']['Row'];
type ArticleInsert = Database['public']['Tables']['articles']['Insert'];
type ArticleUpdate = Database['public']['Tables']['articles']['Update'];

// ============================================
// PUBLIC: Fetch published articles
// ============================================
export async function getPublishedArticles(limit = 20, offset = 0) {
  const { data, error, count } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      hero_image:images(*),
      tags:article_tags(tag:tags(*))
    `, { count: 'exact' })
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { data, count };
}

// ============================================
// PUBLIC: Fetch single published article by slug
// ============================================
export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      hero_image:images(*),
      tags:article_tags(tag:tags(*)),
      comments:comments(*)
    `)
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// ADMIN: Fetch all articles (including drafts)
// ============================================
export async function getAllArticles(limit = 50, offset = 0) {
  const { data, error, count } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      hero_image:images(*)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { data, count };
}

// ============================================
// ADMIN: Create article
// ============================================
export async function createArticle(article: ArticleInsert) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('articles')
    .insert({
      ...article,
      created_by: user?.id,
      updated_by: user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// ADMIN: Update article
// ============================================
export async function updateArticle(id: string, updates: ArticleUpdate) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('articles')
    .update({
      ...updates,
      updated_by: user?.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// ADMIN: Delete article
// ============================================
export async function deleteArticle(id: string) {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// ADMIN: Publish article (set published_at)
// ============================================
export async function publishArticle(id: string) {
  return updateArticle(id, {
    published_at: new Date().toISOString(),
  });
}

// ============================================
// ADMIN: Unpublish article (set published_at to null)
// ============================================
export async function unpublishArticle(id: string) {
  return updateArticle(id, {
    published_at: null,
  });
}
```

### Routines CRUD

Create `src/services/routines.ts`:

```typescript
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Routine = Database['public']['Tables']['routines']['Row'];
type RoutineInsert = Database['public']['Tables']['routines']['Insert'];
type RoutineUpdate = Database['public']['Tables']['routines']['Update'];
type RoutineStep = Database['public']['Tables']['routine_steps']['Row'];
type RoutineStepInsert = Database['public']['Tables']['routine_steps']['Insert'];

// ============================================
// PUBLIC: Fetch published routines
// ============================================
export async function getPublishedRoutines(limit = 20, offset = 0) {
  const { data, error, count } = await supabase
    .from('routines')
    .select(`
      *,
      category:categories(*),
      hero_image:images(*),
      steps:routine_steps(*)
    `, { count: 'exact' })
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  
  // Sort steps by step_order
  const routinesWithSortedSteps = data?.map(routine => ({
    ...routine,
    steps: routine.steps?.sort((a, b) => a.step_order - b.step_order) || []
  }));
  
  return { data: routinesWithSortedSteps, count };
}

// ============================================
// PUBLIC: Fetch single published routine by slug
// ============================================
export async function getRoutineBySlug(slug: string) {
  const { data, error } = await supabase
    .from('routines')
    .select(`
      *,
      category:categories(*),
      hero_image:images(*),
      steps:routine_steps(*)
    `)
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single();

  if (error) throw error;
  
  // Sort steps
  if (data?.steps) {
    data.steps.sort((a, b) => a.step_order - b.step_order);
  }
  
  return data;
}

// ============================================
// ADMIN: Create routine with steps
// ============================================
export async function createRoutine(
  routine: RoutineInsert,
  steps: Omit<RoutineStepInsert, 'routine_id'>[]
) {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Create routine
  const { data: newRoutine, error: routineError } = await supabase
    .from('routines')
    .insert({
      ...routine,
      created_by: user?.id,
      updated_by: user?.id,
    })
    .select()
    .single();

  if (routineError) throw routineError;

  // Create steps
  if (steps.length > 0) {
    const { error: stepsError } = await supabase
      .from('routine_steps')
      .insert(
        steps.map(step => ({
          ...step,
          routine_id: newRoutine.id,
        }))
      );

    if (stepsError) throw stepsError;
  }

  return newRoutine;
}

// ============================================
// ADMIN: Update routine and steps
// ============================================
export async function updateRoutine(
  id: string,
  updates: RoutineUpdate,
  steps?: Omit<RoutineStepInsert, 'routine_id'>[]
) {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Update routine
  const { data, error } = await supabase
    .from('routines')
    .update({
      ...updates,
      updated_by: user?.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Update steps if provided
  if (steps) {
    // Delete existing steps
    await supabase
      .from('routine_steps')
      .delete()
      .eq('routine_id', id);

    // Insert new steps
    if (steps.length > 0) {
      await supabase
        .from('routine_steps')
        .insert(
          steps.map(step => ({
            ...step,
            routine_id: id,
          }))
        );
    }
  }

  return data;
}

// ============================================
// ADMIN: Delete routine (cascades to steps)
// ============================================
export async function deleteRoutine(id: string) {
  const { error } = await supabase
    .from('routines')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
```

### Remedies CRUD

Create `src/services/remedies.ts`:

```typescript
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Remedy = Database['public']['Tables']['remedies']['Row'];
type RemedyInsert = Database['public']['Tables']['remedies']['Insert'];
type RemedyUpdate = Database['public']['Tables']['remedies']['Update'];
type RemedyIngredient = Database['public']['Tables']['remedy_ingredients']['Row'];
type RemedyIngredientInsert = Database['public']['Tables']['remedy_ingredients']['Insert'];

// ============================================
// PUBLIC: Fetch published remedies
// ============================================
export async function getPublishedRemedies(limit = 20, offset = 0) {
  const { data, error, count } = await supabase
    .from('remedies')
    .select(`
      *,
      category:categories(*),
      hero_image:images(*),
      ingredients:remedy_ingredients(*)
    `, { count: 'exact' })
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  
  // Sort ingredients by ingredient_order
  const remediesWithSortedIngredients = data?.map(remedy => ({
    ...remedy,
    ingredients: remedy.ingredients?.sort((a, b) => a.ingredient_order - b.ingredient_order) || []
  }));
  
  return { data: remediesWithSortedIngredients, count };
}

// ============================================
// ADMIN: Create remedy with ingredients
// ============================================
export async function createRemedy(
  remedy: RemedyInsert,
  ingredients: Omit<RemedyIngredientInsert, 'remedy_id'>[]
) {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Create remedy
  const { data: newRemedy, error: remedyError } = await supabase
    .from('remedies')
    .insert({
      ...remedy,
      created_by: user?.id,
      updated_by: user?.id,
    })
    .select()
    .single();

  if (remedyError) throw remedyError;

  // Create ingredients
  if (ingredients.length > 0) {
    const { error: ingredientsError } = await supabase
      .from('remedy_ingredients')
      .insert(
        ingredients.map(ingredient => ({
          ...ingredient,
          remedy_id: newRemedy.id,
        }))
      );

    if (ingredientsError) throw ingredientsError;
  }

  return newRemedy;
}

// ============================================
// ADMIN: Update remedy and ingredients
// ============================================
export async function updateRemedy(
  id: string,
  updates: RemedyUpdate,
  ingredients?: Omit<RemedyIngredientInsert, 'remedy_id'>[]
) {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Update remedy
  const { data, error } = await supabase
    .from('remedies')
    .update({
      ...updates,
      updated_by: user?.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Update ingredients if provided
  if (ingredients) {
    // Delete existing ingredients
    await supabase
      .from('remedy_ingredients')
      .delete()
      .eq('remedy_id', id);

    // Insert new ingredients
    if (ingredients.length > 0) {
      await supabase
        .from('remedy_ingredients')
        .insert(
          ingredients.map(ingredient => ({
            ...ingredient,
            remedy_id: id,
          }))
        );
    }
  }

  return data;
}

// ============================================
// ADMIN: Delete remedy (cascades to ingredients)
// ============================================
export async function deleteRemedy(id: string) {
  const { error } = await supabase
    .from('remedies')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
```

---

## 🖼️ Image Caching Implementation

### Image Upload and Caching Service

Create `src/services/images.ts`:

```typescript
import { supabase } from '../lib/supabase';

// ============================================
// Upload image to Supabase Storage
// ============================================
export async function uploadImage(file: File) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('beauty-blog-images')
    .upload(filePath, file, {
      cacheControl: '31536000', // 1 year
      upsert: false
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('beauty-blog-images')
    .getPublicUrl(filePath);

  // Create image record
  const { data, error } = await supabase
    .from('images')
    .insert({
      bucket_id: 'beauty-blog-images',
      object_key: filePath,
      url: publicUrl,
      mime_type: file.type,
      is_cached: true,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// Cache external image URL
// ============================================
export async function cacheExternalImage(externalUrl: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  try {
    // Fetch the external image
    const response = await fetch(externalUrl);
    if (!response.ok) throw new Error('Failed to fetch image');

    const blob = await response.blob();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Convert blob to File
    const fileExt = contentType.split('/')[1] || 'jpg';
    const fileName = `${Date.now()}-cached.${fileExt}`;
    const file = new File([blob], fileName, { type: contentType });

    // Upload using uploadImage function
    const imageRecord = await uploadImage(file);

    // Update record with original URL
    const { data, error } = await supabase
      .from('images')
      .update({
        url: imageRecord.url, // Supabase Storage URL (cached)
      })
      .eq('id', imageRecord.id)
      .select()
      .single();

    if (error) throw error;
    return data;

  } catch (error) {
    // If caching fails, store external URL as-is
    const { data, error: insertError } = await supabase
      .from('images')
      .insert({
        url: externalUrl,
        is_cached: false,
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return data;
  }
}

// ============================================
// Get image by ID
// ============================================
export async function getImage(id: string) {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// Delete image (from DB and Storage)
// ============================================
export async function deleteImage(id: string) {
  // Get image record
  const image = await getImage(id);

  // Delete from storage if cached
  if (image.is_cached && image.object_key) {
    await supabase.storage
      .from('beauty-blog-images')
      .remove([image.object_key]);
  }

  // Delete from database
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
```

---

## 🛠️ Helper Functions

### Slug Generation

Create `src/utils/slug.ts`:

```typescript
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Check if slug is unique
export async function isSlugUnique(
  table: 'articles' | 'routines' | 'remedies',
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const { supabase } = await import('../lib/supabase');
  
  let query = supabase
    .from(table)
    .select('id')
    .eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data.length === 0;
}

// Generate unique slug
export async function generateUniqueSlug(
  table: 'articles' | 'routines' | 'remedies',
  text: string,
  excludeId?: string
): Promise<string> {
  let slug = generateSlug(text);
  let counter = 1;
  let isUnique = await isSlugUnique(table, slug, excludeId);

  while (!isUnique) {
    slug = `${generateSlug(text)}-${counter}`;
    counter++;
    isUnique = await isSlugUnique(table, slug, excludeId);
  }

  return slug;
}
```

---

## 📋 Implementation Checklist

### Phase 1: Security & Setup (CRITICAL - DO FIRST)
- [ ] Run all RLS policy SQL statements in Supabase SQL Editor
- [ ] Create `beauty-blog-images` storage bucket
- [ ] Apply storage RLS policies
- [ ] Verify admin UUID: `48c66ca3-9e0b-4dce-9faa-d485bece6bf1`
- [ ] Test RLS by attempting unauthorized access (use anon key)

### Phase 2: Frontend Setup
- [ ] Install `@supabase/supabase-js`
- [ ] Create `.env` file with Supabase credentials
- [ ] Create `src/lib/supabase.ts`
- [ ] Create `src/lib/database.types.ts`
- [ ] Create `src/hooks/useAuth.ts`

### Phase 3: Authentication
- [ ] Create `AdminLogin.tsx` component
- [ ] Create `ProtectedRoute.tsx` component
- [ ] Refactor existing admin button to trigger login modal
- [ ] Implement logout functionality
- [ ] Test admin login flow

### Phase 4: CRUD Services
- [ ] Create `src/services/articles.ts`
- [ ] Create `src/services/routines.ts`
- [ ] Create `src/services/remedies.ts`
- [ ] Create `src/services/images.ts`
- [ ] Create `src/utils/slug.ts`

### Phase 5: Admin Panel UI
- [ ] Create admin dashboard layout
- [ ] Create article list/create/edit/delete views
- [ ] Create routine list/create/edit/delete views
- [ ] Create remedy list/create/edit/delete views
- [ ] Implement draft/publish toggle
- [ ] Add image upload/caching UI
- [ ] Implement pagination

### Phase 6: Public Views
- [ ] Update article listing to fetch from Supabase
- [ ] Update routine listing to fetch from Supabase
- [ ] Update remedy listing to fetch from Supabase
- [ ] Implement individual content pages
- [ ] Add SEO meta tags using `meta_description`
- [ ] Test responsive design

### Phase 7: Testing & Optimization
- [ ] Test all CRUD operations as admin
- [ ] Test public access (logged out)
- [ ] Test draft vs published visibility
- [ ] Test image caching flow
- [ ] Test pagination
- [ ] Performance optimization (add indexes if needed)
- [ ] Error handling and loading states

### Phase 8: Deployment
- [ ] Set environment variables in hosting platform
- [ ] Deploy frontend
- [ ] Verify Supabase connection in production
- [ ] Test admin login in production
- [ ] Monitor for errors

---

## 🚨 Security Reminders

1. **Never expose service_role key** in frontend code
2. **Always use anon key** - RLS policies protect data
3. **Test RLS thoroughly** - Try accessing data without auth
4. **Validate admin UUID** - Ensure it matches your account
5. **HTTPS only** - Never use HTTP in production
6. **Environment variables** - Never commit `.env` files

---

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [React Query + Supabase](https://tanstack.com/query/latest/docs/framework/react/overview) (recommended for data fetching)

---

## 🎯 Success Criteria

Implementation is complete when:
- ✅ Admin can log in with password
- ✅ Admin can create/edit/delete all content types
- ✅ Admin can save drafts and publish
- ✅ Admin can upload/cache images
- ✅ Public users can view published content only
- ✅ Public users cannot access admin panel
- ✅ RLS prevents unauthorized data access
- ✅ Images are cached to Supabase Storage
- ✅ SEO meta tags are properly set
- ✅ All CRUD operations work without errors

---

## 🔌 ENVIRONMENT & SUPABASE SETUP

### Database Configuration ✅

**Database System:** Supabase (managed PostgreSQL)

**Server Connection (Database):**
- Uses: `DATABASE_URL` environment variable
- Format: `postgresql://postgres.[PROJECT_ID]:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres`
- ORM: Drizzle ORM with PostgreSQL driver

**Frontend Connection (API):**
- Uses: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Purpose: Frontend Supabase client for authentication

**Environment Variables:**
- ✅ `.env` - Configured with Supabase connection template
- ✅ `.env.example` - Developer reference
- ✅ All VITE_* variables for frontend

### Documentation Created ✅

- ✅ [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Step-by-step credential guide
- ✅ [TEST_QUICK_START.md](TEST_QUICK_START.md) - Quick reference
- ✅ [TESTING_SETUP.md](TESTING_SETUP.md) - Detailed setup

### Next Steps for Testing

1. Get Supabase credentials from Dashboard (Settings → Database & API)
2. Fill in `.env` with actual values
3. Run `npm run db:push` to create tables
4. Run `npm run dev` to start testing

---

**End of Implementation Plan**

*Last Updated: January 30, 2026 - Supabase Configuration ✅*
