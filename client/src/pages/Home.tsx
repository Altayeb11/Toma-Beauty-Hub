import { useLanguage } from "@/hooks/use-language";
import { useArticles } from "@/hooks/use-content";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { SectionCard } from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Home() {
  const { t, language } = useLanguage();
  const { data: articlesData } = useArticles();
  const [localArticles, setLocalArticles] = useState([]);

  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;
  const heroImage =
    "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2000&auto=format&fit=crop";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("toma_articles") || "[]");
    setLocalArticles(saved);
  }, []);

  return (
    <div className="min-h-screen bg-[#fffcfd]">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-100/40 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-100/40 blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-start"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-pink-100 backdrop-blur-sm shadow-sm text-sm text-[#a64d79] mb-6 font-bold">
              <Sparkles className="w-4 h-4" />
              {t("Welcome to your beauty haven", "مرحباً بك في عالم جمالك")}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900 font-serif">
              {t("Natural Beauty,", "الجمال الطبيعي،")} <br />
              <span className="text-[#a64d79]">
                {t("Refined Elegance", "وأناقة راقية")}
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
              {t(
                "Discover expert skincare tips, daily routines, and natural remedies tailored for your unique glow.",
                "اكتشفي نصائح العناية بالبشرة، الروتين اليومي، والوصفات الطبيعية المصممة لإشراقتك الفريدة.",
              )}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link href="/articles">
                <Button
                  size="lg"
                  className="rounded-full px-10 h-14 text-lg bg-[#a64d79] hover:bg-pink-800 shadow-lg shadow-pink-200 transition-all"
                >
                  {t("Start Reading", "ابدأ القراءة")}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img
                src={heroImage}
                alt="Beauty"
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Stories Section */}
      <section className="py-24 bg-white/50 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-4 text-center md:text-right">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-serif mb-2">
                {t("Latest Stories", "أحدث المقالات")}
              </h2>
              <p className="text-gray-500 italic">
                {t("Explore our beauty secrets", "استكشفي أسرار الجمال لدينا")}
              </p>
            </div>

            <Link href="/articles">
              <Button
                variant="outline"
                className="rounded-full border-[#a64d79] text-[#a64d79] hover:bg-pink-50 flex items-center gap-2 font-bold px-6"
              >
                {t("View All Articles", "مشاهدة جميع المقالات")}
                <Arrow className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* عرض المقالات المضافة يدوياً بتنسيق ذكي */}
            {localArticles.slice(0, 3).map((article: any, i: number) => (
              <Link key={`local-${article.id}`} href="/articles">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-pink-50 flex flex-col h-full group min-h-[420px]"
                >
                  {/* التحقق من الصورة: إذا لم توجد، يظهر التصميم الملون */}
                  {article.image && article.image.trim() !== "" ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={article.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 flex items-center justify-center p-6 text-center relative overflow-hidden">
                      <Sparkles className="absolute top-4 right-4 text-pink-200 w-6 h-6 opacity-40" />
                      <h3 className="text-lg font-bold text-[#a64d79] font-serif leading-relaxed z-10">
                        {language === "ar" ? article.titleAr : article.titleEn}
                      </h3>
                      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/40 rounded-full blur-2xl" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1 text-right">
                    {article.image && article.image.trim() !== "" && (
                      <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
                        {language === "ar" ? article.titleAr : article.titleEn}
                      </h3>
                    )}
                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1 italic">
                      {language === "ar" ? article.descAr : article.descEn}
                    </p>
                    <div className="text-[#a64d79] font-bold text-xs flex items-center justify-end gap-2 border-t border-pink-50 pt-4 group-hover:gap-3 transition-all">
                      {t("Read More", "اقرئي المزيد")}{" "}
                      <Arrow className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}

            {/* عرض المقالات الأساسية (نفس المنطق) */}
            {articlesData
              ?.slice(0, Math.max(0, 3 - localArticles.length))
              .map((article, i) => (
                <SectionCard
                  key={article.id}
                  title={language === "en" ? article.titleEn : article.titleAr}
                  description={
                    language === "en" ? article.summaryEn : article.summaryAr
                  }
                  image={
                    article.imageUrl ||
                    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800"
                  }
                  href="/articles"
                  delay={(i + localArticles.length) * 0.1}
                />
              ))}
          </div>

          {localArticles.length === 0 && !articlesData && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-pink-100 mx-auto mb-4" />
              <p className="text-gray-400 italic">
                لا توجد مقالات لعرضها حالياً
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
