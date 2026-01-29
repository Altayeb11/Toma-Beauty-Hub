import { supabase } from '/supabase.js';

export default function Articles() {
  const { t, language } = useLanguage();
  const [localArticles, setLocalArticles] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newArticle, setNewArticle] = useState({
    titleAr: "",
    titleEn: "",
    descAr: "",
    descEn: "",
    image: "",
  });

  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching articles:', error);
    } else {
      setLocalArticles(data || []);
    }
  };

  const handleAdminLogin = () => {
    const pass = prompt(
      language === "ar" ? "أدخل كلمة المرور:" : "Enter Password:",
    );
    if (pass === "1234") {
      setIsAdmin(!isAdmin);
    } else {
      alert(language === "ar" ? "خطأ!" : "Wrong!");
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('articles')
      .insert([
        {
          title_ar: newArticle.titleAr,
          title_en: newArticle.titleEn.trim() || newArticle.titleAr,
          content_ar: newArticle.descAr,
          content_en: newArticle.descEn.trim() || newArticle.descAr,
          image_url: newArticle.image,
        }
      ]);

    if (error) {
      alert("Error adding article: " + error.message);
    } else {
      fetchArticles();
      setNewArticle({
        titleAr: "",
        titleEn: "",
        descAr: "",
        descEn: "",
        image: "",
      });
      setShowAddForm(false);
    }
  };

  const deleteArticle = async (id: any) => {
    if (confirm(t("Delete?", "حذف؟"))) {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) {
        alert("Error deleting article: " + error.message);
      } else {
        fetchArticles();
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#fffcfd] relative">
      <div className="container mx-auto px-4">
        {/* --- المفتاح السري (مرتفع للأعلى وباهت جداً) --- */}
        <div className="fixed bottom-32 left-6 z-[99999] opacity-20 hover:opacity-100 transition-opacity duration-500">
          <div className="flex flex-col-reverse gap-3 items-center">
            <button
              onClick={handleAdminLogin}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-white ${isAdmin ? "bg-green-500 text-white" : "bg-[#a64d79] text-white"}`}
            >
              <Key className="w-5 h-5" />
            </button>

            {isAdmin && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setShowAddForm(true)}
                className="bg-white text-[#a64d79] p-3 rounded-xl shadow-md border border-pink-100 flex items-center gap-2 text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> {t("Add", "إضافة")}
              </motion.button>
            )}
          </div>
        </div>

        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#a64d79]">
            {t("Beauty Articles", "مقالات الجمال")}
          </h1>
        </header>

        {/* نموذج الإضافة */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            >
              <form
                onSubmit={handleAddArticle}
                className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative"
              >
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="absolute top-6 left-6 text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-[#a64d79] mb-6 text-center">
                  {t("Add Content", "إضافة محتوى جديد")}
                </h2>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="العنوان بالعربي (مطلوب)"
                    required
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-pink-200"
                    value={newArticle.titleAr}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, titleAr: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    placeholder="English Title (Optional - اختياري)"
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-left"
                    value={newArticle.titleEn}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, titleEn: e.target.value })
                    }
                  />

                  <textarea
                    placeholder="الوصف بالعربي (مطلوب)"
                    required
                    rows={3}
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                    value={newArticle.descAr}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, descAr: e.target.value })
                    }
                  />

                  <textarea
                    placeholder="English Description (Optional - اختياري)"
                    rows={3}
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-left"
                    value={newArticle.descEn}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, descEn: e.target.value })
                    }
                  />

                  <input
                    type="url"
                    placeholder="رابط الصورة"
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                    value={newArticle.image}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, image: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-4 bg-[#a64d79] text-white rounded-2xl font-bold hover:bg-pink-800"
                >
                  {t("Publish", "نشر الآن ✨")}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* عرض البطاقات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {localArticles.map((article: any) => (
            <div
              key={article.id}
              className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-pink-50 flex flex-col h-full"
            >
              {isAdmin && (
                <button
                  onClick={() => deleteArticle(article.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-red-500 text-white rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              {article.image_url && (
                <div className="h-52 overflow-hidden">
                  <img
                    src={article.image_url}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              )}
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#a64d79] mb-4">
                  {language === "ar" ? article.title_ar : article.title_en}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-4 flex-1">
                  {language === "ar" ? article.content_ar : article.content_en}
                </p>
                <div className="text-[#a64d79] font-bold text-xs flex items-center gap-2 mt-auto">
                  {t("More", "المزيد")} <Arrow className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useLanguage } from "@/hooks/use-language";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Trash2,
  Key,
  Plus,
  X,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
