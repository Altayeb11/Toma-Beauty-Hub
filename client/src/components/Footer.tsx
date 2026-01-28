import { useLanguage } from "@/hooks/use-language";
import { Sparkles, Instagram, Facebook, Heart } from "lucide-react";
import { Link } from "wouter";
import { SiWhatsapp } from "react-icons/si"; // استيراد أيقونة واتساب الحقيقية

export function Footer() {
  const { t } = useLanguage();

  const whatsappNumber = "+201143539189";
  const facebookUrl = "https://www.facebook.com/share/1TnNbvsXdu/";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace("+", "")}`;

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-pink-100 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-center md:text-right">
          {/* Brand - شعار توما */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2">
              <div className="bg-pink-50 p-2 rounded-full">
                <Sparkles className="w-5 h-5 text-[#a64d79]" />
              </div>
              <span className="font-serif text-2xl font-bold text-[#a64d79]">
                {t("Toma Beauty", "توما بيوتي")}
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed text-sm max-w-xs">
              {t(
                "Your daily destination for natural beauty, self-care routines, and expert wellness advice.",
                "وجهتك اليومية للجمال الطبيعي، روتين العناية، ونصائح العافية المتخصصة.",
              )}
            </p>
          </div>

          {/* Links - روابط سريعة */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-gray-800 mb-6 border-b-2 border-pink-100 pb-1">
              {t("Discover", "اكتشف")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/articles"
                  className="text-gray-500 hover:text-[#a64d79] transition-colors font-medium"
                >
                  {t("Beauty Articles", "مقالات الجمال")}
                </Link>
              </li>
              <li>
                <Link
                  href="/routines"
                  className="text-gray-500 hover:text-[#a64d79] transition-colors font-medium"
                >
                  {t("Daily Routines", "الروتين اليومي")}
                </Link>
              </li>
              <li>
                <Link
                  href="/remedies"
                  className="text-gray-500 hover:text-[#a64d79] transition-colors font-medium"
                >
                  {t("Natural Remedies", "وصفات طبيعية")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-500 hover:text-[#a64d79] transition-colors font-medium"
                >
                  {t("About Us", "من نحن")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support - الدعم */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-gray-800 mb-6 border-b-2 border-pink-100 pb-1">
              {t("Support", "الدعم")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#a64d79] transition-colors font-medium"
                >
                  {t("Contact Us", "اتصل بنا")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#a64d79] transition-colors"
                >
                  {t("Privacy Policy", "سياسة الخصوصية")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#a64d79] transition-colors"
                >
                  {t("Terms of Service", "شروط الاستخدام")}
                </a>
              </li>
            </ul>
          </div>

          {/* Social - التواصل الاجتماعي المشرق */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-gray-800 mb-6 border-b-2 border-pink-100 pb-1">
              {t("Connect", "تواصل معنا")}
            </h4>
            <div className="flex gap-4">
              {/* واتساب حقيقي بلون مشرق */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#25D366] shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
                title="WhatsApp"
              >
                <SiWhatsapp className="w-6 h-6" />
              </a>

              {/* فيسبوك */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#1877F2] shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
                title="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>

              {/* إنستغرام بتدرج ملون */}
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
                title="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* حقوق النشر والتوقيع */}
        <div className="border-t border-pink-50 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-400">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <p>
              © 2026 Toma Beauty.{" "}
              {t("All rights reserved.", "جميع الحقوق محفوظة.")}
            </p>
            <p className="font-medium">
              {t("Project Owner: Fatima Mohamed", "صاحبة المشروع: فاطمة محمد")}
            </p>
            <p className="opacity-70">
              {t(
                "Website designed by Engineer Al-Tayeb Idris",
                "تصميم الموقع بواسطة المهندس الطيب إدريس",
              )}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-pink-50 px-4 py-2 rounded-full">
            <span className="text-[#a64d79] font-medium">
              {t("Made with", "صنع بـ")}
            </span>
            <Heart className="w-3 h-3 text-red-400 fill-red-400 animate-pulse" />
            <span className="text-[#a64d79] font-medium">
              {t("for beauty lovers", "لعشاق الجمال")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
