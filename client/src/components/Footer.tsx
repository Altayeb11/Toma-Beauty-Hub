import { useLanguage } from "@/hooks/use-language";
import { Sparkles, Instagram, Facebook, Twitter, Heart } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary/50 pt-16 pb-8 border-t border-purple-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-serif text-2xl font-bold text-gray-800">
                {t("Toma Beauty", "توما بيوتي")}
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed text-sm">
              {t(
                "Your daily destination for natural beauty, self-care routines, and expert wellness advice.",
                "وجهتك اليومية للجمال الطبيعي، روتين العناية، ونصائح العافية المتخصصة."
              )}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gray-800 mb-6">{t("Discover", "اكتشف")}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/articles" className="text-gray-500 hover:text-primary transition-colors">{t("Beauty Articles", "مقالات الجمال")}</Link></li>
              <li><Link href="/routines" className="text-gray-500 hover:text-primary transition-colors">{t("Daily Routines", "الروتين اليومي")}</Link></li>
              <li><Link href="/remedies" className="text-gray-500 hover:text-primary transition-colors">{t("Natural Remedies", "وصفات طبيعية")}</Link></li>
              <li><Link href="/about" className="text-gray-500 hover:text-primary transition-colors">{t("About Us", "من نحن")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-gray-800 mb-6">{t("Support", "الدعم")}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">{t("Contact Us", "اتصل بنا")}</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">{t("Privacy Policy", "سياسة الخصوصية")}</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">{t("Terms of Service", "شروط الاستخدام")}</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-gray-800 mb-6">{t("Connect", "تواصل معنا")}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-primary hover:shadow-md transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-primary hover:shadow-md transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-primary hover:shadow-md transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-200/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex flex-col gap-1">
            <p>© 2024 Toma Beauty. {t("All rights reserved.", "جميع الحقوق محفوظة.")}</p>
            <p>{t("Website designed by Engineer Al-Tayeb Idris", "تصميم الموقع بواسطة المهندس الطيب إدريس")}</p>
            <p>{t("Project Owner: Fatima Mohamed", "صاحبة المشروع: فاطمة محمد")}</p>
          </div>
          <div className="flex items-center gap-1">
            <span>{t("Made with", "صنع بـ")}</span>
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            <span>{t("for beauty lovers", "لعشاق الجمال")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
