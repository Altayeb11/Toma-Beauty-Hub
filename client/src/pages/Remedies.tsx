import { useLanguage } from "@/hooks/use-language";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Leaf, Sprout, Trash2, Key, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Remedies() {
  const { t, language } = useLanguage();
  const [localRemedies, setLocalRemedies] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // حالة الوصفة الجديدة
  const [newRemedy, setNewRemedy] = useState({
    titleAr: "",
    titleEn: "",
    benefitsAr: "",
    benefitsEn: "",
    instructionsAr: "",
    instructionsEn: "",
    ingredientsAr: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("toma_remedies") || "[]");
    setLocalRemedies(saved);
  }, []);

  const handleAdminLogin = () => {
    const pass = prompt(language === "ar" ? "كلمة المرور:" : "Password:");
    if (pass === "1234") setIsAdmin(!isAdmin);
  };

  const handleAddRemedy = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...newRemedy,
      id: Date.now(),
      // إذا كان الإنجليزي فارغاً، يستخدم العربي تلقائياً
      titleEn: newRemedy.titleEn || newRemedy.titleAr,
      benefitsEn: newRemedy.benefitsEn || newRemedy.benefitsAr,
      instructionsEn: newRemedy.instructionsEn || newRemedy.instructionsAr,
      ingredientsAr: newRemedy.ingredientsAr.split("\n"), // تحويل النص إلى قائمة
      ingredientsEn: newRemedy.ingredientsAr.split("\n"), // حالياً نستخدم نفس القائمة للجهتين لتبسيط الإضافة
    };
    const updated = [newItem, ...localRemedies];
    localStorage.setItem("toma_remedies", JSON.stringify(updated));
    setLocalRemedies(updated);
    setShowAddForm(false);
    setNewRemedy({
      titleAr: "",
      titleEn: "",
      benefitsAr: "",
      benefitsEn: "",
      instructionsAr: "",
      instructionsEn: "",
      ingredientsAr: "",
    });
  };

  const deleteRemedy = (id: number) => {
    if (confirm(t("Delete?", "حذف؟"))) {
      const updated = localRemedies.filter((r: any) => r.id !== id);
      localStorage.setItem("toma_remedies", JSON.stringify(updated));
      setLocalRemedies(updated);
    }
  };

  // البيانات التجريبية الأصلية + البيانات التي تضيفينها
  const demoRemedies = [
    {
      id: 1,
      titleEn: "Honey & Yogurt Mask",
      titleAr: "قناع العسل والزبادي",
      ingredientsAr: ["١ ملعقة عسل خام", "٢ ملعقة زبادي يوناني"],
      ingredientsEn: ["1 tbsp raw honey", "2 tbsp greek yogurt"],
      instructionsAr: "اخلطي جميع المكونات ووضعيها على وجه نظيف.",
      instructionsEn: "Mix all ingredients and apply to clean face.",
      benefitsAr: "مرطب مهدئ.",
      benefitsEn: "Moisturizing soothing.",
    },
  ];

  const displayRemedies = localRemedies.length ? localRemedies : demoRemedies;

  return (
    <div className="min-h-screen py-24 bg-green-50/30 relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* --- المفتاح السري (مرتفع وباهت) --- */}
        <div className="fixed bottom-32 left-6 z-[9999] opacity-10 hover:opacity-100 transition-opacity">
          <div className="flex flex-col-reverse gap-3 items-center">
            <button
              onClick={handleAdminLogin}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${isAdmin ? "bg-green-500" : "bg-[#a64d79] text-white"}`}
            >
              <Key className="w-5 h-5 text-white" />
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-white text-[#a64d79] p-3 rounded-xl shadow-md border border-pink-100 flex items-center gap-2 text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> {t("Add", "إضافة")}
              </button>
            )}
          </div>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-green-100 rounded-full text-green-700">
            <Leaf className="w-6 h-6" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 font-serif">
            {t("Natural Remedies", "وصفات طبيعية")}
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayRemedies.map((remedy, i) => (
            <div key={remedy.id} className="relative">
              {isAdmin && (
                <button
                  onClick={() => deleteRemedy(remedy.id)}
                  className="absolute -top-2 -right-2 z-20 bg-red-500 text-white p-2 rounded-full shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <RemedyCard remedy={remedy} index={i} />
            </div>
          ))}
        </div>
      </div>

      {/* نموذج الإضافة */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.form
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onSubmit={handleAddRemedy}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]"
            >
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="absolute top-6 left-6"
              >
                <X />
              </button>
              <h2 className="text-xl font-bold text-[#a64d79] mb-6 text-center">
                إضافة وصفة جديدة
              </h2>
              <div className="space-y-3">
                <input
                  placeholder="اسم الوصفة بالعربي"
                  required
                  className="w-full p-4 bg-gray-50 rounded-2xl"
                  value={newRemedy.titleAr}
                  onChange={(e) =>
                    setNewRemedy({ ...newRemedy, titleAr: e.target.value })
                  }
                />
                <input
                  placeholder="Name in English (Optional)"
                  className="w-full p-4 bg-gray-50 rounded-2xl text-left"
                  value={newRemedy.titleEn}
                  onChange={(e) =>
                    setNewRemedy({ ...newRemedy, titleEn: e.target.value })
                  }
                />
                <textarea
                  placeholder="المكونات (كل مكون في سطر)"
                  required
                  className="w-full p-4 bg-gray-50 rounded-2xl"
                  value={newRemedy.ingredientsAr}
                  onChange={(e) =>
                    setNewRemedy({
                      ...newRemedy,
                      ingredientsAr: e.target.value,
                    })
                  }
                />
                <textarea
                  placeholder="طريقة التحضير بالعربي"
                  required
                  className="w-full p-4 bg-gray-50 rounded-2xl"
                  value={newRemedy.instructionsAr}
                  onChange={(e) =>
                    setNewRemedy({
                      ...newRemedy,
                      instructionsAr: e.target.value,
                    })
                  }
                />
                <textarea
                  placeholder="Instructions in English (Optional)"
                  className="w-full p-4 bg-gray-50 rounded-2xl text-left"
                  value={newRemedy.instructionsEn}
                  onChange={(e) =>
                    setNewRemedy({
                      ...newRemedy,
                      instructionsEn: e.target.value,
                    })
                  }
                />
                <input
                  placeholder="فوائد الوصفة بالعربي"
                  required
                  className="w-full p-4 bg-gray-50 rounded-2xl"
                  value={newRemedy.benefitsAr}
                  onChange={(e) =>
                    setNewRemedy({ ...newRemedy, benefitsAr: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full mt-6 py-4 bg-[#a64d79] text-white rounded-2xl font-bold"
              >
                حفظ الوصفة ✨
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RemedyCard({ remedy, index }: { remedy: any; index: number }) {
  const { t, language } = useLanguage();
  const ingredients = Array.isArray(remedy.ingredientsAr)
    ? language === "en"
      ? remedy.ingredientsEn
      : remedy.ingredientsAr
    : [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-green-100 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
            {language === "en" ? remedy.titleEn : remedy.titleAr}
          </h3>
          <p className="text-gray-500 text-sm mb-6 line-clamp-2">
            {language === "en" ? remedy.benefitsEn : remedy.benefitsAr}
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-green-700">
            {t("View Recipe", "عرض الوصفة")}
          </div>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#a64d79]">
            {language === "en" ? remedy.titleEn : remedy.titleAr}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-500 mt-2">
            {language === "en" ? remedy.benefitsEn : remedy.benefitsAr}
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 mt-6">
          <div className="bg-green-50/50 p-6 rounded-2xl">
            <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
              <Leaf className="w-4 h-4" /> {t("Ingredients", "المكونات")}
            </h4>
            <ul className="space-y-2">
              {ingredients.map((ing: string, i: number) => (
                <li
                  key={i}
                  className="text-gray-700 flex items-start gap-2 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-blue-400" />{" "}
              {t("Instructions", "طريقة التحضير")}
            </h4>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
              {language === "en"
                ? remedy.instructionsEn
                : remedy.instructionsAr}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
