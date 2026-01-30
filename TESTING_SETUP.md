# 🧪 TESTING SETUP GUIDE - TOMA BEAUTY HUB (SUPABASE)

**Status:** Ready to test Phase 1-4 implementations  
**Date:** January 30, 2026  
**Database:** Supabase PostgreSQL

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Node.js 20+ installed
- ✅ Supabase account and project created
- ✅ All dependencies installed: `npm install`

---

## 🔧 Environment Setup

### Step 1: Create `.env` File

**Location:** Root directory of the project (`/workspaces/Toma-Beauty/.env`)

Copy the example file:
```bash
cp .env.example .env
```

### Step 2: Get Supabase Credentials

#### Get DATABASE_URL (Server-side)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings → Database**
4. Under "Connection string", select **Transaction mode**
5. Copy the connection string

**Format:** `postgresql://postgres.[PROJECT_ID]:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres`

**Add to .env:**
```env
DATABASE_URL=postgresql://postgres.abc123:your_password_here@db.abc123.supabase.co:5432/postgres
```

#### Get API Keys (Frontend)
1. In Supabase Dashboard, click **Settings → API**
2. Copy:
   - **Project URL** 
   - **Anon public key**

**Add to .env:**
```env
VITE_SUPABASE_URL=https://abc123.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Configure Server Variables

```env
PORT=5000
NODE_ENV=development
SESSION_SECRET=your_super_secret_key_change_this_min_32_chars
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
```

### Step 4: Configure Frontend Variables

```env
VITE_API_URL=http://localhost:5000
```

### Complete `.env` Example

```env
# Supabase Database Connection
DATABASE_URL=postgresql://postgres.abc123:your_password@db.abc123.supabase.co:5432/postgres

# Server
PORT=5000
NODE_ENV=development
SESSION_SECRET=my_super_secret_session_key_change_this_in_production_min_32_chars

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123

# Supabase API (Frontend)
VITE_SUPABASE_URL=https://abc123.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Frontend
VITE_API_URL=http://localhost:5000

# Logging
LOG_LEVEL=info
DEBUG=false
```

---

## 🚀 Running the Application

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Push Database Schema to Supabase
```bash
npm run db:push
```

This creates all necessary tables in your Supabase database:
- users
- articles
- routines
- remedies
- sections
- tips
- sessions

### Step 3: Start Development Server

```bash
npm run dev
```

Expected output:
```
12:34:56 PM [express] Server running on http://localhost:5000
```

### Step 4: Access the App

In your browser, visit:
```
http://localhost:5000
```

---

## 🧪 Testing Checklist

### Test 1: Homepage Access
- [ ] Visit http://localhost:5000
- [ ] Homepage loads successfully
- [ ] Articles displayed

### Test 2: Authentication System

**Login:**
```bash
# Navigate to Articles page and login with:
Username: admin
Password: password123
```

- [ ] Login form appears
- [ ] Can login with credentials
- [ ] Session created (check browser cookies)
- [ ] Redirected to admin panel

**Logout:**
- [ ] Click logout button
- [ ] Session destroyed
- [ ] Redirected to homepage
- [ ] Cannot access admin features

### Test 3: Articles CRUD

**Create Article:**
- [ ] Navigate to Articles page (as admin)
- [ ] Click "Add Article" button
- [ ] Fill in bilingual fields:
  - Title (Arabic & English)
  - Description (Arabic & English)
  - Content (Arabic & English)
  - Category
- [ ] Submit form
- [ ] Article appears in list
- [ ] Check console for success message

**Read Articles:**
- [ ] Homepage shows latest 3 articles
- [ ] Article detail page accessible
- [ ] All fields display correctly

**Update Article:**
- [ ] Click edit on existing article
- [ ] Modify fields
- [ ] Save changes
- [ ] Verify updates persisted

**Delete Article:**
- [ ] Click delete button
- [ ] Confirm deletion
- [ ] Article removed from list
- [ ] Check database to confirm

### Test 4: Remedies Migration

**View Remedies:**
- [ ] Navigate to Remedies page
- [ ] Remedies load from database
- [ ] No console errors
- [ ] Loading state shows while fetching

**Create Remedy (as admin):**
- [ ] Click "+" button (bottom left)
- [ ] Fill bilingual form:
  - Title (Arabic & English)
  - Description (Arabic & English)
  - Ingredients (Arabic & English)
  - Instructions (Arabic & English)
- [ ] Submit
- [ ] Remedy appears in list
- [ ] Check database for persistence

**View Recipe Details:**
- [ ] Click "View Recipe" on remedy card
- [ ] Dialog opens with full details
- [ ] All bilingual content displays

**Delete Remedy:**
- [ ] Click trash icon
- [ ] Confirm deletion
- [ ] Remedy removed
- [ ] Database updated

### Test 5: API Endpoints

Test endpoints with curl or Postman:

**Public Endpoints:**
```bash
# Get all articles
curl http://localhost:5000/api/articles

# Get all remedies
curl http://localhost:5000/api/remedies

# Get all routines
curl http://localhost:5000/api/routines

# Get all sections
curl http://localhost:5000/api/sections
```

**Authentication:**
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  -c cookies.txt

# Check auth status
curl http://localhost:5000/api/auth/me \
  -b cookies.txt

# Logout
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

**Admin Endpoints (requires authentication):**
```bash
# Create article (use cookie from login)
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "titleAr":"مقالة","titleEn":"Article",
    "descAr":"وصف","descEn":"Description",
    "contentAr":"محتوى","contentEn":"Content",
    "category":"skincare"
  }'

# Update article
curl -X PUT http://localhost:5000/api/articles/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"titleAr":"مقالة محدثة"}'

# Delete article
curl -X DELETE http://localhost:5000/api/articles/1 \
  -b cookies.txt
```

---

## 🐛 Troubleshooting

### Issue: "DATABASE_URL is missing"
**Solution:** 
- Ensure `.env` file exists in root directory
- Check DATABASE_URL is set correctly
- Verify PostgreSQL is running

### Issue: "Cannot connect to database"
**Solution:**
- Check PostgreSQL is running: `psql --version`
- Verify credentials in DATABASE_URL
- For Replit: Check Replit Database settings
- Try individual PG variables instead of connection string

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port:
PORT=5001 npm run dev
```

### Issue: "Cannot find module" errors
**Solution:**
```bash
# Reinstall dependencies
npm install

# Check TypeScript
npm run check
```

### Issue: Session not persisting
**Solution:**
- Verify SESSION_SECRET is set in `.env`
- Check browser cookies are enabled
- Ensure session database table exists
- Check PostgreSQL connection

### Issue: API returns 401/403
**Solution:**
- Ensure you're logged in with admin credentials
- Check session cookie is being sent
- Verify ADMIN_USERNAME and ADMIN_PASSWORD match database

---

## 📊 Database Setup

### Create Database (if not exists)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE toma_beauty;

# Exit
\q
```

### Initialize Schema

```bash
# Push Drizzle schema to database
npm run db:push
```

This creates all necessary tables:
- users
- articles
- routines
- remedies
- sections
- tips
- sessions

---

## 📝 Default Admin Credentials

**Set in `.env`:**
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
```

**First Time Setup:**
The admin user should be created automatically on first database push, or you can insert manually:

```sql
INSERT INTO users (username, password, email, role) 
VALUES ('admin', 'password123', 'admin@toma.com', 'admin');
```

---

## 🔍 Monitoring & Logs

### Server Logs

Server logs API requests and responses:
```
12:34:56 PM [express] GET /api/articles 200 in 42ms
12:34:57 PM [express] POST /api/auth/login 200 in 125ms
```

### Browser Console

Check for API errors and debugging info:
```javascript
// Test API client in browser console
await apiClient.checkAuth()
await apiClient.getArticles()
```

### Database Logs

Monitor database queries:
```bash
# In another terminal
psql toma_beauty -c "SELECT * FROM users;"
psql toma_beauty -c "SELECT * FROM articles;"
```

---

## ✅ Success Indicators

- ✅ Server starts without errors
- ✅ Frontend loads at http://localhost:5000
- ✅ Admin can login with credentials
- ✅ CRUD operations work for Articles and Remedies
- ✅ API endpoints return correct data
- ✅ Session persists across page reloads
- ✅ Logout clears session
- ✅ Database stores and retrieves data

---

## 🚀 Next Steps After Testing

1. **Document Issues**: Note any bugs or unexpected behavior
2. **Performance Testing**: Load test with multiple users
3. **Security Testing**: Try attacking the API (after Phase 5)
4. **Phase 5**: Implement security hardening
5. **Staging Deployment**: Deploy to staging environment
6. **Production**: Deploy to production

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Database Setup](https://supabase.com/docs/guides/database)
- [Express Documentation](https://expressjs.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [React Documentation](https://react.dev/)
