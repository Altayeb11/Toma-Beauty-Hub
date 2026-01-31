import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/hooks/use-admin";

export default function Articles() {
  const { t, language } = useLanguage();
  const { isAdmin } = useAdmin();
  const [articles, setArticles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newArt, setNewArt] = useState({ 
    titleAr: "", 
    titleEn: "",
    descAr: "", 
    descEn: "",
    image: "" 
  });

  useEffect(() => {
    checkAuthAndLoadArticles();
  }, []);

  const checkAuthAndLoadArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("articles")
        .select(`*, image:images(url)`)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      setArticles(data || []);
    } catch (err: any) {
      console.error("Error loading articles:", err);
      setError(err.message || "Failed to load articles");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newArt.titleAr.trim() || !newArt.titleEn.trim() || !newArt.descAr.trim() || !newArt.descEn.trim()) {
      setError("جميع الحقول مطلوبة (بالعربية والإنجليزية)");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let imageRecord = null;
      
      if (newArt.image.trim()) {
        try {
          const response = await fetch(newArt.image);
          if (!response.ok) throw new Error("Failed to fetch image");
          
          const blob = await response.blob();
          const fileName = `cached-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("article-images")
            .upload(fileName, blob, {
              contentType: blob.type || "image/jpeg",
              cacheControl: "3600",
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("article-images")
            .getPublicUrl(fileName);

          const { data: img, error: imgError } = await supabase
            .from("images")
            .insert([{
              url: publicUrl,
              object_key: fileName,
              bucket_id: "article-images",
              mime_type: blob.type || "image/jpeg",
              is_cached: true,
            }])
            .select()
            .single();
          
          if (imgError) throw imgError;
          imageRecord = img;
        } catch (imgErr: any) {
          console.warn("Image caching failed:", imgErr);
          setError(`Image caching failed: ${imgErr.message}`);
          return;
        }
      }
      
      const articleData = {
        title: newArt.titleAr || newArt.titleEn,
        description: newArt.descAr || newArt.descEn,
        slug: (newArt.titleAr || newArt.titleEn).toLowerCase().replace(/\s+/g, '-'),
        body: newArt.descAr || newArt.descEn,
        meta_description: newArt.descAr || newArt.descEn,
        published_at: new Date().toISOString(),
        hero_image_id: imageRecord?.id || null,
      };

      const { data: newArticle, error } = await supabase
        .from("articles")
        .insert([articleData])
        .select()
        .single();

      if (error) throw new Error(error.message);

      setArticles([newArticle, ...articles]);
      setShowForm(false);
      setNewArt({ titleAr: "", titleEn: "", descAr: "", descEn: "", image: "" });
    } catch (err: any) {
      setError(err.message || "Failed to add article");
    }
  };

  const deleteArt = async (id: any) => {
    if (!isAdmin) {
      setError("غير مصرح");
      return;
    }

    if (!confirm("حذف المقال؟")) return;

    setError(null);
    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw new Error(error.message);

      setArticles(articles.filter((a: any) => a.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete article");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#fffcfd]" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[#a64d79] font-serif">
            {language === "ar" ? "مقالات الجمال" : "Beauty Articles"}
          </h1>
          <div className="h-1.5 w-20 bg-pink-200 mx-auto rounded-full mt-4" />
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">جاري تحميل المقالات...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                لا توجد مقالات حالياً
              </div>
            ) : (
              articles.map((art: any, i: number) => (
                <div key={art.id} className="relative">
                  {/* تعديل: زر الحذف ثابت ومرئي دائمًا */}
                  {isAdmin && (
                    <div className="absolute top-4 left-4 z-[999] pointer-events-auto">
                      <button
                        onClick={() => deleteArt(art.id)}
                        className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <ArticleCard article={art} index={i} language={language} />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="fixed bottom-10 right-6 z-[1000] flex flex-col items-end gap-3">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#a64d79] w-16 h-16 rounded-full shadow-2xl border-4 border-white"
          >
            <Plus size={35} />
          </Button>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.form
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onSubmit={handleAdd}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-[#a64d79] mb-6 text-center">
                إضافة مقال ✨
              </h2>
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
              
              <input
                placeholder="العنوان (عربي) *"
                className="w-full p-4 mb-4 bg-gray-50 rounded-xl border"
                value={newArt.titleAr}
                onChange={(e) =>
                  setNewArt({ ...newArt, titleAr: e.target.value })
                }
                required
              />
              
              <input
                placeholder="Title (English) *"
                className="w-full p-4 mb-4 bg-gray-50 rounded-xl border text-left"
                dir="ltr"
                value={newArt.titleEn}
                onChange={(e) =>
                  setNewArt({ ...newArt, titleEn: e.target.value })
                }
                required
              />
              
              <textarea
                placeholder="المحتوى (عربي) *"
                rows={4}
                className="w-full p-4 mb-4 bg-gray-50 rounded-xl border"
                value={newArt.descAr}
                onChange={(e) =>
                  setNewArt({ ...newArt, descAr: e.target.value })
                }
                required
              />
              
              <textarea
                placeholder="Content (English) *"
                rows={4}
                className="w-full p-4 mb-4 bg-gray-50 rounded-xl border text-left"
                dir="ltr"
                value={newArt.descEn}
                onChange={(e) =>
                  setNewArt({ ...newArt, descEn: e.target.value })
                }
                required
              />
              
              <input
                placeholder="رابط الصورة (اختياري)"
                className="w-full p-4 mb-6 bg-gray-50 rounded-xl border"
                value={newArt.image}
                onChange={(e) =>
                  setNewArt({ ...newArt, image: e.target.value })
                }
              />
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-[#a64d79] py-6 rounded-xl"
                >
                  نشر
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="ghost"
                >
                  إلغاء
                </Button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArticleCard({ article, index, language }: any) {
  const title = language === "ar" ? (article.title_ar || article.title) : (article.title_en || article.title);
  const content = language === "ar" ? (article.content_ar || article.description || article.body) : (article.content_en || article.description || article.body);

  const imageUrl = article.image?.url || '';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-pink-50 h-[420px] cursor-pointer flex flex-col group pointer-events-auto"
        >
          <div className="h-52 overflow-hidden bg-pink-50 relative z-50">
            {imageUrl && imageUrl.trim() !== "" ? (
              <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={title} loading="lazy" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 flex items-center justify-center p-4 text-center">
                <h3 className="text-lg font-bold text-[#a64d79] font-serif">
                  {title}
                </h3>
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col flex-1 relative">
            <h3 className="font-bold text-xl mb-3 text-gray-900 font-serif leading-tight">
              {title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-4 mb-4">
              {content}
            </p>
            <div className="mt-auto text-[#a64d79] font-bold text-xs">
              {language === "ar" ? "اقرئي المزيد ←" : "Read More →"}
            </div>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent
        className="max-w-3xl bg-white rounded-[2.5rem] p-0 overflow-hidden"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{content}</DialogDescription>
        <div className="max-h-[85vh] overflow-y-auto relative">
          {imageUrl && imageUrl.trim() !== "" && (
            <img src={imageUrl} className="w-full h-72 object-cover" alt={title} loading="lazy" />
          )}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-[#a64d79] mb-6 font-serif">
              {title}
            </h2>
            <p className="text-gray-700 text-lg leading-[2] whitespace-pre-line">
              {content}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
