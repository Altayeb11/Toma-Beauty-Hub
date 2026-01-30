# 🔐 Admin Login - Quick Reference

## The Current System (At a Glance)

**Password:** `Toma2026`  
**Method:** Browser `prompt()` dialog  
**Storage:** Browser `localStorage`  
**Key:** `"toma_admin"`  
**Value:** `"true"` when logged in

---

## How to Login

1. Click the **Lock Icon** 🔒 (top right of navigation)
2. Enter password: `Toma2026`
3. Click OK
4. **+ button** appears on all pages (Remedies, Articles, Routines)
5. **Trash icons** appear on each item for deletion

---

## How to Logout

1. Click the **Red X button** (top right, replaces lock when logged in)
2. Page reloads
3. Admin buttons disappear

---

## Where Auth is Checked

| Location | Purpose |
|----------|---------|
| [Navigation.tsx](client/src/components/Navigation.tsx#L24) | Shows/hides Lock/Logout button |
| [Remedies.tsx](client/src/pages/Remedies.tsx#L40-45) | Shows + button when admin |
| [Articles.tsx](client/src/pages/Articles.tsx#L29-34) | Shows + button when admin |
| [Routines.tsx](client/src/pages/Routines.tsx#L34-39) | Shows + button when admin |

---

## Admin Features

✅ **Can see the + button** on:
- Remedies page (bottom right)
- Articles page (bottom right)  
- Routines page (bottom right)

✅ **Can click + to:**
- Fill bilingual form (Arabic + English)
- Add new remedy/article/routine
- Submit to database

✅ **Can delete items:**
- Click trash icon on any item
- Confirm deletion
- Item removed from database

---

## Security Status

🔴 **NOT PRODUCTION READY**
- Password visible in source code
- Stored in localStorage (can be read by scripts)
- No server-side authentication initially
- Single password for all admins
- No rate limiting
- No session timeout

✅ **Works for development/testing**

---

## API Calls

When submitting data, includes `credentials: "include"`:

```typescript
fetch("/api/remedies", {
  method: "POST",
  credentials: "include",  // ← Sends session
  body: JSON.stringify(data)
})
```

Server also checks:
```typescript
GET /api/auth/me
```

Returns 200 if authenticated, 401 if not

---

## Storage Events

Admin state syncs across browser tabs via:

```javascript
window.addEventListener("storage", checkAdmin);
```

**Result:** Login in one tab = appears in all tabs

---

## Files Related to Auth

- [Navigation.tsx](client/src/components/Navigation.tsx) - Login/Logout UI
- [Remedies.tsx](client/src/pages/Remedies.tsx) - Admin features
- [Articles.tsx](client/src/pages/Articles.tsx) - Admin features  
- [Routines.tsx](client/src/pages/Routines.tsx) - Admin features
- [use-auth.ts](client/src/hooks/use-auth.ts) - Auth utilities
- [auth-utils.ts](client/src/lib/auth-utils.ts) - Auth helpers

---

**Status:** ✅ Functional | 🔴 Not Production-Ready
