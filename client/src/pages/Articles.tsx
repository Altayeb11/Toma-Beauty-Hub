import { useLanguage } from "@/hooks/use-language";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Trash2,
  Key,
  Plus,
  X,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // هذا هو السطر الذي كان ينقصنا

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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("toma_articles") || "[]");
    setLocalArticles(saved);
  }, []);

  const handleAdminLogin = () => {
    const pass = prompt(
      language === "ar" ? "أدخل كلمة المرور:" : "Enter Password:",
    );
    if (pass === "1234") setIsAdmin(!isAdmin);
  };

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...newArticle,
      id: Date.now(),
      titleEn: newArticle.titleEn || newArticle.titleAr,
      descEn: newArticle.descEn || newArticle.descAr,
    };
    const updated = [newItem, ...localArticles];
    localStorage.setItem("toma_articles", JSON.stringify(updated));
    setLocalArticles(updated);
    setNewArticle({
      titleAr: "",
      titleEn: "",
      descAr: "",
      descEn: "",
      image: "",
    });
    setShowAddForm(false);
  };

  const deleteArticle = (id: number) => {
    if (confirm(t("Delete?", "حذف؟"))) {
      const updated = localArticles.filter((a: any) => a.id !== id);
      localStorage.setItem("toma_articles", JSON.stringify(updated));
      setLocalArticles(updated);
    }
  };

  return (
    <div
      className="min-h-screen pt-24 pb-12 bg-[#fffcfd] relative overflow-x-hidden text-right"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="fixed bottom-10 left-6 z-[9999] opacity-20 hover:opacity-100 transition-opacity">
          <button
            onClick={handleAdminLogin}
            className="w-12 h-12 rounded-full bg-[#a64d79] flex items-center justify-center shadow-lg text-white"
          >
            <Key className="w-5 h-5" />
          </button>
        </div>

        {isAdmin && (
          <div className="flex justify-center mb-10">
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-[#a64d79] hover:bg-pink-800 rounded-full px-8"
            >
              <Plus className="ml-2 w-5 h-5" />{" "}
              {t("Add New Article", "إضافة مقال جديد")}
            </Button>
          </div>
        )}

        <header className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-[#a64d79] font-serif">
            {t("Beauty Articles", "مقالات الجمال")}
          </h1>
          <div className="h-1.5 w-24 bg-pink-200 mx-auto rounded-full mt-4" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {localArticles.map((article: any, i: number) => (
            <div key={article.id} className="relative h-full text-right">
              {isAdmin && (
                <button
                  onClick={() => deleteArticle(article.id)}
                  className="absolute -top-3 -right-3 z-30 bg-red-500 text-white p-2 rounded-full shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <ArticleCard article={article} index={i} />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onSubmit={handleAddArticle}
              className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl text-right"
            >
              <h2 className="text-2xl font-bold text-[#a64d79] mb-6">
                إضافة مقال جديد ✨
              </h2>
              <input
                placeholder="عنوان المقال"
                className="w-full p-4 mb-4 bg-gray-50 rounded-2xl border-none outline-none"
                value={newArticle.titleAr}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, titleAr: e.target.value })
                }
                required
              />
              <textarea
                placeholder="نص المقال..."
                rows={6}
                className="w-full p-4 mb-4 bg-gray-50 rounded-2xl border-none outline-none"
                value={newArticle.descAr}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, descAr: e.target.value })
                }
                required
              />
              <input
                placeholder="رابط الصورة (اختياري)"
                className="w-full p-4 mb-6 bg-gray-50 rounded-2xl border-none outline-none"
                value={newArticle.image}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, image: e.target.value })
                }
              />
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 py-6 bg-[#a64d79] rounded-2xl font-bold"
                >
                  نشر
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  variant="ghost"
                  className="px-6 py-6"
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

function ArticleCard({ article, index }: { article: any; index: number }) {
  const { t, language } = useLanguage();
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;
  const hasImage = article.image && article.image.trim() !== "";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-pink-50 flex flex-col h-full group min-h-[450px]"
        >
          {hasImage ? (
            <div className="h-56 overflow-hidden">
              <img
                src={article.image}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt=""
              />
            </div>
          ) : (
            <div className="h-56 bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 flex items-center justify-center p-8 text-center relative overflow-hidden">
              <Sparkles className="absolute top-4 right-4 text-pink-200 w-8 h-8 opacity-50" />
              <h3 className="text-xl font-bold text-[#a64d79] font-serif leading-relaxed z-10">
                {language === "ar" ? article.titleAr : article.titleEn}
              </h3>
            </div>
          )}
          <div className="p-8 flex flex-col flex-1">
            {hasImage && (
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif text-right">
                {language === "ar" ? article.titleAr : article.titleEn}
              </h3>
            )}
            <p className="text-gray-500 text-sm mb-8 line-clamp-4 flex-1 italic text-right">
              {language === "ar" ? article.descAr : article.descEn}
            </p>
            <div className="text-[#a64d79] font-bold text-sm flex items-center justify-end gap-2 border-t border-pink-50 pt-6 group-hover:gap-4 transition-all">
              {t("Read Full Article", "قراءة المقال كاملاً")}{" "}
              <Arrow className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] bg-white rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
        <div className="overflow-y-auto max-h-[85vh] text-right" dir="rtl">
          {hasImage && (
            <div className="h-64 md:h-80 w-full">
              <img
                src={article.image}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
          )}
          <div className="p-8 md:p-14">
            <h2 className="text-3xl font-bold text-[#a64d79] font-serif mb-6">
              {language === "ar" ? article.titleAr : article.titleEn}
            </h2>
            <p className="text-xl text-gray-700 leading-[2.2] whitespace-pre-line">
              {language === "ar" ? article.descAr : article.descEn}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
