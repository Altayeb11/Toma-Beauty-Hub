import { useState, useEffect } from "react";
import { Plus, Trash2, Leaf, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

// Helper function to safely handle ingredients (string or array)
const parseIngredients = (ingredients: any): string[] => {
  if (Array.isArray(ingredients)) {
    return ingredients;
  }
  if (typeof ingredients === "string") {
    return ingredients.split("\n").filter((l: string) => l.trim());
  }
  return [];
};

export default function Remedies() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titleAr: "",
    titleEn: "",
    descAr: "",
    descEn: "",
    ingredientsAr: "",
    ingredientsEn: "",
    instructionsAr: "",
    instructionsEn: "",
  });

  useEffect(() => {
    checkAuthAndLoadRemedies();
  }, []);

  const checkAuthAndLoadRemedies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check Supabase auth status
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      setIsAdmin(!!user && !authError);
      
      // Fetch remedies directly from Supabase
      const { data, error } = await supabase
        .from("remedies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      setItems(data || []);
    } catch (err: any) {
      console.error("Error loading remedies:", err);
      setError(err.message || "Failed to load remedies");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const saveRemedy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (!formData.titleAr || !formData.titleEn) {
        setError("اسم الوصفة مطلوب (بالعربية والإنجليزية)");
        return;
      }

      // Prepare data
      const remedyData = {
        title: formData.titleAr || formData.titleEn,
        description: formData.descAr || formData.descEn,
        preparation: formData.instructionsAr || formData.instructionsEn,
        slug: (formData.titleAr || formData.titleEn).toLowerCase().replace(/\s+/g, '-'),
      };

      // Save to database
      const { data: newRemedy, error } = await supabase
        .from("remedies")
        .insert([remedyData])
        .select()
        .single();

      if (error) throw new Error(error.message);

      setItems([newRemedy, ...items]);
      setShowForm(false);
      setFormData({
        titleAr: "",
        titleEn: "",
        descAr: "",
        descEn: "",
        ingredientsAr: "",
        ingredientsEn: "",
        instructionsAr: "",
        instructionsEn: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create remedy");
    }
  };

  const deleteItem = async (id: number) => {
    if (confirm("حذف هذه الوصفة؟")) {
      try {
        setError(null);
        const { error } = await supabase
          .from("remedies")
          .delete()
          .eq("id", id);

        if (error) throw new Error(error.message);

        setItems(items.filter((i: any) => i.id !== id));
      } catch (err: any) {
        setError(err.message || "Failed to delete remedy");
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#fdfdfd] text-left">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <div className="w-12 h-12 bg-[#f0f9f4] rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="text-[#4a9c6d] w-6 h-6" />
          </div>
          <h1 className="text-5xl font-bold text-[#1a1a1a] font-serif mb-4">
            Natural Remedies
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto italic">
            Pure, simple ingredients from your kitchen for radiant beauty.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">جاري تحميل الوصفات...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {items.map((item: any) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={item.id}
                className="bg-white p-10 rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#f5f5f5] flex flex-col h-full transition-all hover:shadow-lg"
              >
                <div className="w-10 h-10 bg-[#f0f9f4] rounded-xl flex items-center justify-center mb-6">
                  <Leaf className="text-[#4a9c6d] w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a1a] font-serif mb-3 leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed italic">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <Dialog>
                    <DialogTrigger asChild>
                      <span className="text-[#4a9c6d] font-semibold text-sm cursor-pointer hover:underline">
                        View Recipe
                      </span>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white rounded-[3rem] p-8 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
                      <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-[#a64d79] font-serif mb-2">
                          {item.title}
                        </h2>
                        <p className="text-gray-400 italic">
                          {item.description}
                        </p>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-[#f0f9f4] p-6 rounded-[2rem] border border-[#e8f5ed]">
                          <div className="flex items-center gap-2 text-[#4a9c6d] font-bold mb-4">
                            <Leaf size={18} /> <span>Ingredients</span>
                          </div>
                          <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-2 text-gray-500 italic text-sm">
                              (تفاصيل المكونات يتم تخزينها بشكل منفصل في النظام)
                            </li>
                          </ul>
                        </div>
                        <div className="px-2 pb-4">
                          <div className="flex items-center gap-2 text-[#4a9c6d] font-bold mb-4">
                            <Droplets size={18} className="text-blue-300" />{" "}
                            <span>Instructions</span>
                          </div>
                          <p className="text-gray-700 leading-[1.8] whitespace-pre-line">
                            {item.preparation}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {isAdmin && (
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-100 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      {isAdmin && (
        <div className="fixed bottom-10 left-6 z-[1000]">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#a64d79] w-16 h-16 rounded-full shadow-2xl border-4 border-white transition-transform active:scale-95"
          >
            <Plus size={35} className="text-white" />
          </Button>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <div
            className="fixed inset-0 bg-black/40 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm"
            dir="rtl"
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={saveRemedy}
              className="bg-white w-full max-w-lg p-10 rounded-[3rem] shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6 text-[#a64d79] text-center font-serif">
                إضافة وصفة جديدة ✨
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <input
                placeholder="اسم الوصفة (عربي) *"
                className="w-full p-4 mb-3 bg-[#f9f9f9] rounded-2xl border-none outline-none"
                value={formData.titleAr}
                onChange={(e) =>
                  setFormData({ ...formData, titleAr: e.target.value })
                }
                required
              />
              <input
                placeholder="Recipe Name (English) *"
                className="w-full p-4 mb-3 bg-[#f9f9f9] rounded-2xl border-none outline-none text-left"
                dir="ltr"
                value={formData.titleEn}
                onChange={(e) =>
                  setFormData({ ...formData, titleEn: e.target.value })
                }
                required
              />

              <textarea
                placeholder="وصف قصير (عربي)"
                rows={2}
                className="w-full p-4 mb-3 bg-[#f9f9f9] rounded-2xl border-none outline-none"
                value={formData.descAr}
                onChange={(e) =>
                  setFormData({ ...formData, descAr: e.target.value })
                }
              />
              <textarea
                placeholder="Short Description (English)"
                rows={2}
                className="w-full p-4 mb-3 bg-[#f9f9f9] rounded-2xl border-none outline-none text-left"
                dir="ltr"
                value={formData.descEn}
                onChange={(e) =>
                  setFormData({ ...formData, descEn: e.target.value })
                }
              />

              <textarea
                placeholder="المكونات (عربي - كل مكون في سطر)"
                rows={3}
                className="w-full p-4 mb-3 bg-[#f9f9f9] rounded-2xl border-none outline-none"
                value={formData.ingredientsAr}
                onChange={(e) =>
                  setFormData({ ...formData, ingredientsAr: e.target.value })
                }
              />
              <textarea
                placeholder="Ingredients (English - one per line)"
                rows={3}
                className="w-full p-4 mb-3 bg-[#f9f9f9] rounded-2xl border-none outline-none text-left"
                dir="ltr"
                value={formData.ingredientsEn}
                onChange={(e) =>
                  setFormData({ ...formData, ingredientsEn: e.target.value })
                }
              />

              <textarea
                placeholder="طريقة التحضير (عربي)..."
                rows={4}
                className="w-full p-4 mb-3 bg-[#f9f9f9] rounded-2xl border-none outline-none"
                value={formData.instructionsAr}
                onChange={(e) =>
                  setFormData({ ...formData, instructionsAr: e.target.value })
                }
              />
              <textarea
                placeholder="Instructions (English)..."
                rows={4}
                className="w-full p-4 mb-6 bg-[#f9f9f9] rounded-2xl border-none outline-none text-left"
                dir="ltr"
                value={formData.instructionsEn}
                onChange={(e) =>
                  setFormData({ ...formData, instructionsEn: e.target.value })
                }
              />

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-[#4a9c6d] py-6 rounded-2xl font-bold text-white"
                >
                  نشر الوصفة
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="ghost"
                  className="py-6 rounded-2xl text-gray-400"
                >
                  إلغاء
                </Button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
