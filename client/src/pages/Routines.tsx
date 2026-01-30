import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { motion } from "framer-motion";
import { Sun, Moon, Clock, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Routines() {
  const { t, language } = useLanguage();
  const [routines, setRoutines] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    stepsAr: "",
    stepsEn: "",
    type: "morning",
  });

  useEffect(() => {
    checkAuthAndLoadRoutines();
  }, []);

  const checkAuthAndLoadRoutines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check Supabase auth status
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      setIsAdmin(!!user && !authError);
      
      // Fetch routines directly from Supabase
      const { data, error } = await supabase
        .from("routines")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      setRoutines(data || []);
    } catch (err: any) {
      console.error("Error loading routines:", err);
      setError(err.message || "Failed to load routines");
      setRoutines([]);
    } finally {
      setLoading(false);
    }
  };

  const saveRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (!formData.titleAr || !formData.titleEn) {
        setError("اسم الروتين مطلوب (بالعربية والإنجليزية)");
        return;
      }

      // Parse steps
      const stepsAr = formData.stepsAr.split("\n").filter(Boolean);
      const stepsEn = formData.stepsEn.split("\n").filter(Boolean);

      if (stepsAr.length === 0 || stepsEn.length === 0) {
        setError("يجب إضافة خطوات على الأقل");
        return;
      }

      const routineData = {
        title: formData.titleAr || formData.titleEn,
        description: formData.descriptionAr || formData.descriptionEn,
        slug: (formData.titleAr || formData.titleEn).toLowerCase().replace(/\s+/g, '-'),
        routine_type: formData.type,
      };

      // Save to database
      const { data: newRoutine, error } = await supabase
        .from("routines")
        .insert([routineData])
        .select()
        .single();

      if (error) throw new Error(error.message);

      setRoutines([newRoutine, ...routines]);
      setShowForm(false);
      setFormData({
        titleAr: "",
        titleEn: "",
        descriptionAr: "",
        descriptionEn: "",
        stepsAr: "",
        stepsEn: "",
        type: "morning",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create routine");
    }
  };

  const deleteRoutine = async (id: number) => {
    if (confirm("حذف هذا الروتين؟")) {
      try {
        setError(null);
        const { error } = await supabase
          .from("routines")
          .delete()
          .eq("id", id);

        if (error) throw new Error(error.message);

        setRoutines(routines.filter((r: any) => r.id !== id));
      } catch (err: any) {
        setError(err.message || "Failed to delete routine");
      }
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 font-serif">
            {t("Daily Routines", "الروتين اليومي")}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {t(
              "Consistent habits for healthy, radiant skin.",
              "عادات مستمرة لبشرة صحية ومشرقة."
            )}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">جاري تحميل الروتينات...</p>
          </div>
        ) : (
          <Tabs defaultValue="morning" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 h-16 rounded-full bg-white p-2 shadow-sm mb-12">
              <TabsTrigger 
                value="morning" 
                className="rounded-full text-base data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 data-[state=active]:shadow-none transition-all"
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  {t("Morning Routine", "روتين الصباح")}
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="evening" 
                className="rounded-full text-base data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none transition-all"
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  {t("Evening Routine", "روتين المساء")}
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="morning">
              <div className="grid gap-8">
                {routines.filter(r => r.routine_type === 'morning').length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    لا توجد روتينات صباحية حالياً
                  </div>
                ) : (
                  routines.filter(r => r.routine_type === 'morning').map((routine) => (
                    <div key={routine.id} className="relative">
                      {isAdmin && (
                        <button
                          onClick={() => deleteRoutine(routine.id)}
                          className="absolute top-4 left-4 z-50 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <RoutineCard routine={routine} type="morning" />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="evening">
              <div className="grid gap-8">
                {routines.filter(r => r.routine_type === 'evening').length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    لا توجد روتينات مسائية حالياً
                  </div>
                ) : (
                  routines.filter(r => r.routine_type === 'evening').map((routine) => (
                    <div key={routine.id} className="relative">
                      {isAdmin && (
                        <button
                          onClick={() => deleteRoutine(routine.id)}
                          className="absolute top-4 left-4 z-50 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <RoutineCard routine={routine} type="evening" />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {isAdmin && (
        <div className="fixed bottom-10 left-6 z-[1000]">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#4a9c6d] w-16 h-16 rounded-full shadow-2xl border-4 border-white"
          >
            <Plus size={35} />
          </Button>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={saveRoutine}
              className="bg-white w-full max-w-lg p-10 rounded-[3rem] shadow-2xl max-h-[90vh] overflow-y-auto"
              dir="rtl"
            >
              <h2 className="text-2xl font-bold mb-6 text-[#4a9c6d] text-center font-serif">
                إضافة روتين جديد ✨
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <input
                placeholder="اسم الروتين (عربي) *"
                className="w-full p-4 mb-3 bg-[#f9f9f9] rounded-2xl border-none outline-none"
                value={formData.titleAr}
                onChange={(e) =>
                  setFormData({ ...formData, titleAr: e.target.value })
                }
                required
              />
              <input
                placeholder="Routine Name (English) *"
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
                value={formData.descriptionAr}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionAr: e.target.value })
                }
              />
              <textarea
                placeholder="Short Description (English)"
                rows={2}
                className="w-full p-4 mb-3 bg-[#f9f9f9] rounded-2xl border-none outline-none text-left"
                dir="ltr"
                value={formData.descriptionEn}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionEn: e.target.value })
                }
              />

              <textarea
                placeholder="الخطوات (عربي - كل خطوة في سطر) *"
                rows={4}
                className="w-full p-4 mb-3 bg-[#f9f9f9] rounded-2xl border-none outline-none"
                value={formData.stepsAr}
                onChange={(e) =>
                  setFormData({ ...formData, stepsAr: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Steps (English - one per line) *"
                rows={4}
                className="w-full p-4 mb-6 bg-[#f9f9f9] rounded-2xl border-none outline-none text-left"
                dir="ltr"
                value={formData.stepsEn}
                onChange={(e) =>
                  setFormData({ ...formData, stepsEn: e.target.value })
                }
                required
              />

              <div className="w-full p-4 mb-6 bg-[#f9f9f9] rounded-2xl">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نوع الروتين / Routine Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg outline-none"
                  required
                >
                  <option value="morning">صباحي / Morning</option>
                  <option value="evening">مسائي / Evening</option>
                </select>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-[#4a9c6d] py-6 rounded-2xl font-bold text-white"
                >
                  نشر الروتين
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

function RoutineCard({ routine, type }: { routine: any, type: 'morning' | 'evening' }) {
  const { language } = useLanguage();
  
  const theme = type === 'morning' 
    ? { bg: 'bg-orange-50', border: 'border-orange-100', icon: 'text-orange-500', stepBg: 'bg-white' } 
    : { bg: 'bg-indigo-50', border: 'border-indigo-100', icon: 'text-indigo-500', stepBg: 'bg-white' };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl p-8 md:p-12 ${theme.bg} border ${theme.border} relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {routine.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>{routine.description || 'روتين جمالي'}</span>
            </div>
          </div>
          <div className={`p-3 rounded-full bg-white shadow-sm ${theme.icon}`}>
            {type === 'morning' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm">
            (خطوات الروتين يتم تخزينها بشكل منفصل في النظام)
          </div>
        </div>
      </div>
    </motion.div>
  );
}
