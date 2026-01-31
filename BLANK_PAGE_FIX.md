# حل الصفحة البيضاء - HTTP 401

## المشكلة
- صفحة بيضاء فارغة بدلاً من المحتوى
- سبب: Supabase RLS (Row-Level Security) محمي ولا يسمح بالقراءة

## الحل (5 دقائق)

### 1️⃣ افتح Supabase
- https://supabase.com
- سجل دخول → اختر مشروعك

### 2️⃣ افتح SQL Editor
- من القائمة اليسرى → **SQL Editor**
- اضغط **New Query**

### 3️⃣ انسخ وشغّل هذا الكود:

```sql
-- تفعيل RLS للسماح بالقراءة العامة

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "articles_public_read" ON public.articles FOR SELECT USING (true);

ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "routines_public_read" ON public.routines FOR SELECT USING (true);

ALTER TABLE public.remedies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "remedies_public_read" ON public.remedies FOR SELECT USING (true);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_public_read" ON public.comments FOR SELECT USING (true);
```

### 4️⃣ اضغط RUN

### 5️⃣ رجّع تحميل الصفحة (Ctrl+F5)

✅ يجب أن تظهر المحتويات الآن!

---

## إذا استمرت المشكلة

- تأكد من تشغيل الكود في **Supabase SQL Editor** (وليس محرر آخر)
- تأكد من ظهور ✅ **Success** بعد التشغيل
- افتح المتصفح في وضع خاص (Incognito)
- امسح الـ Cache: Ctrl+Shift+Delete
