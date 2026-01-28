import { useLanguage } from "@/hooks/use-language";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Articles() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newArt, setNewArt] = useState({ titleAr: "", descAr: "", image: "" });

  useEffect(() => {
    setIsAdmin(localStorage.getItem("toma_admin") === "true");
    setArticles(JSON.parse(localStorage.getItem("toma_articles") || "[]"));
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [{ ...newArt, id: Date.now() }, ...articles];
    localStorage.setItem("toma_articles", JSON.stringify(updated));
    setArticles(updated);
    setShowForm(false);
    setNewArt({ titleAr: "", descAr: "", image: "" });
  };

  const deleteArt = (id: number) => {
    if (confirm("حذف المقال؟")) {
      const filtered = articles.filter((a: any) => a.id !== id);
      localStorage.setItem("toma_articles", JSON.stringify(filtered));
      setArticles(filtered);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#fffcfd] text-right" dir="rtl">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[#a64d79] font-serif">
            مقالات الجمال
          </h1>
          <div className="h-1.5 w-20 bg-pink-200 mx-auto rounded-full mt-4" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art: any, i: number) => (
            <div key={art.id} className="relative">
              {isAdmin && (
                <button
                  onClick={() => deleteArt(art.id)}
                  className="absolute top-4 left-4 z-50 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <ArticleCard article={art} index={i} />
            </div>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className="fixed bottom-10 right-6 z-[1000] flex flex-col items-end gap-3">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#a64d79] w-16 h-16 rounded-full shadow-2xl animate-bounce border-4 border-white"
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
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8"
            >
              <h2 className="text-2xl font-bold text-[#a64d79] mb-6 text-center">
                إضافة مقال ✨
              </h2>
              <input
                placeholder="العنوان"
                className="w-full p-4 mb-4 bg-gray-50 rounded-xl border"
                value={newArt.titleAr}
                onChange={(e) =>
                  setNewArt({ ...newArt, titleAr: e.target.value })
                }
                required
              />
              <textarea
                placeholder="النص..."
                rows={5}
                className="w-full p-4 mb-4 bg-gray-50 rounded-xl border"
                value={newArt.descAr}
                onChange={(e) =>
                  setNewArt({ ...newArt, descAr: e.target.value })
                }
                required
              />
              <input
                placeholder="رابط الصورة"
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

function ArticleCard({ article, index }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-pink-50 h-[420px] cursor-pointer flex flex-col"
        >
          <div className="h-52 overflow-hidden bg-pink-50">
            {article.image && (
              <img src={article.image} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="p-6 flex flex-col flex-1">
            <h3 className="font-bold text-xl mb-3 text-gray-900 font-serif leading-tight">
              {article.titleAr}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-4 italic mb-4">
              {article.descAr}
            </p>
            <div className="mt-auto text-[#a64d79] font-bold text-xs">
              اقرئي المزيد ←
            </div>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent
        className="max-w-3xl bg-white rounded-[2.5rem] p-0 overflow-hidden text-right"
        dir="rtl"
      >
        <div className="max-h-[85vh] overflow-y-auto">
          {article.image && (
            <img src={article.image} className="w-full h-72 object-cover" />
          )}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-[#a64d79] mb-6 font-serif">
              {article.titleAr}
            </h2>
            <p className="text-gray-700 text-lg leading-[2] whitespace-pre-line">
              {article.descAr}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
