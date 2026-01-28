import { useState, useEffect } from "react";
import { Plus, Trash2, Leaf, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Remedies() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortDesc: "",
    ingredients: "",
    instructions: "",
  });

  useEffect(() => {
    setIsAdmin(localStorage.getItem("toma_admin") === "true");
    setItems(JSON.parse(localStorage.getItem("toma_remedies") || "[]"));
  }, []);

  const saveRemedy = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [{ ...formData, id: Date.now() }, ...items];
    localStorage.setItem("toma_remedies", JSON.stringify(updated));
    setItems(updated);
    setShowForm(false);
    setFormData({
      title: "",
      shortDesc: "",
      ingredients: "",
      instructions: "",
    });
  };

  const deleteItem = (id: number) => {
    if (confirm("حذف هذه الوصفة؟")) {
      const filtered = items.filter((i: any) => i.id !== id);
      localStorage.setItem("toma_remedies", JSON.stringify(filtered));
      setItems(filtered);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {items.map((item: any, i) => (
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
                {item.shortDesc}
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
                      <p className="text-gray-400 italic">{item.shortDesc}</p>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-[#f0f9f4] p-6 rounded-[2rem] border border-[#e8f5ed]">
                        <div className="flex items-center gap-2 text-[#4a9c6d] font-bold mb-4">
                          <Leaf size={18} /> <span>Ingredients</span>
                        </div>
                        <ul className="space-y-3 text-gray-700">
                          {(item.ingredients || "")
                            .split("\n")
                            .filter((l: any) => l.trim())
                            .map((line: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#4a9c6d] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#4a9c6d] shrink-0" />
                                <span>{line}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div className="px-2 pb-4">
                        <div className="flex items-center gap-2 text-[#4a9c6d] font-bold mb-4">
                          <Droplets size={18} className="text-blue-300" />{" "}
                          <span>Instructions</span>
                        </div>
                        <p className="text-gray-700 leading-[1.8] whitespace-pre-line">
                          {item.instructions || item.desc}
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
      </div>

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
              className="bg-white w-full max-w-lg p-10 rounded-[3rem] shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-[#a64d79] text-center font-serif">
                إضافة وصفة جديدة ✨
              </h2>
              <input
                placeholder="اسم الوصفة"
                className="w-full p-4 mb-3 bg-[#f9f9f9] rounded-2xl border-none outline-none"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <input
                placeholder="وصف قصير"
                className="w-full p-4 mb-3 bg-[#f9f9f9] rounded-2xl border-none outline-none"
                value={formData.shortDesc}
                onChange={(e) =>
                  setFormData({ ...formData, shortDesc: e.target.value })
                }
                required
              />
              <textarea
                placeholder="المكونات (كل مكون في سطر)"
                rows={3}
                className="w-full p-4 mb-3 bg-[#f9f9f9] rounded-2xl border-none outline-none"
                value={formData.ingredients}
                onChange={(e) =>
                  setFormData({ ...formData, ingredients: e.target.value })
                }
                required
              />
              <textarea
                placeholder="طريقة التحضير..."
                rows={4}
                className="w-full p-4 mb-6 bg-[#f9f9f9] rounded-2xl border-none outline-none"
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
                required
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
  );
}
