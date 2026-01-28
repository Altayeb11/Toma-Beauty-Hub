import { useLanguage } from "@/hooks/use-language";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Sparkles, Lock, LogOut, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export function Navigation() {
  const { language, setLanguage } = useLanguage();
  const [location] = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const checkAdmin = () =>
      setIsAdmin(localStorage.getItem("toma_admin") === "true");
    checkAdmin();
    window.addEventListener("storage", checkAdmin);
    return () => window.removeEventListener("storage", checkAdmin);
  }, []);

  const handleAdminLogin = () => {
    const pass = prompt(
      language === "ar" ? "كلمة المرور الجميلة:" : "Enter your password:",
    );
    if (pass === "Toma2026") {
      localStorage.setItem("toma_admin", "true");
      window.dispatchEvent(new Event("storage"));
      setShowWelcome(true);
    } else if (pass !== null) {
      alert(language === "ar" ? "كلمة المرور غير صحيحة" : "Incorrect password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("toma_admin");
    window.dispatchEvent(new Event("storage"));
    window.location.reload();
  };

  const menuLinks = [
    { name: "الرئيسية", nameEn: "Home", href: "/" },
    { name: "المقالات", nameEn: "Articles", href: "/articles" },
    { name: "الروتين", nameEn: "Routines", href: "/routines" },
    { name: "وصفات", nameEn: "Remedies", href: "/remedies" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-md">
        <div className="container mx-auto px-3 flex flex-col items-center py-4 gap-4">
          {/* السطر الأول: اللوجو والتحكم */}
          <div className="w-full flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="bg-[#a64d79] p-1.5 rounded-lg shadow-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[#a64d79] font-serif tracking-tight">
                  Toma Beauty
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="text-[#a64d79] text-xs font-bold border-pink-200 hover:bg-pink-50 rounded-xl h-9 px-3"
              >
                {language === "en" ? "AR" : "EN"}
              </Button>

              {isAdmin ? (
                <button
                  onClick={handleLogout}
                  className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-xl shadow-sm border border-red-100"
                >
                  <LogOut size={18} />
                </button>
              ) : (
                <button
                  onClick={handleAdminLogin}
                  className="w-9 h-9 flex items-center justify-center bg-pink-50 text-[#a64d79] rounded-xl shadow-sm border border-pink-100"
                >
                  <Lock size={18} />
                </button>
              )}
            </div>
          </div>

          {/* السطر الثاني: روابط على شكل أزرار ملونة تملأ العرض */}
          <div className="grid grid-cols-4 gap-2 w-full pt-1">
            {menuLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  className={cn(
                    "cursor-pointer text-center py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 shadow-sm border",
                    location === link.href
                      ? "bg-[#a64d79] text-white border-[#a64d79] scale-[1.02] shadow-pink-200"
                      : "bg-pink-50/50 text-[#a64d79] border-pink-100 hover:bg-pink-100/50",
                  )}
                >
                  {language === "ar" ? link.name : link.nameEn}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* نافذة الترحيب */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-[85%] md:max-w-md bg-white rounded-[2.5rem] p-10 border-none text-center shadow-2xl outline-none">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center animate-pulse">
              <Heart className="text-[#a64d79] fill-[#a64d79]" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#a64d79] mb-4">
            أهلاً بكِ يا جميلة!
          </h2>
          <p className="text-gray-500 leading-relaxed mb-8 italic text-sm px-4">
            "جمالكِ يبدأ من الداخل، واليوم هو فرصة جديدة لتلهمي العالم بلمستكِ
            الخاصة."
          </p>
          <div className="border-t border-pink-50 pt-4">
            <span className="text-[#a64d79] font-serif text-2xl font-bold italic block">
              Toma
            </span>
            <span className="text-[10px] text-gray-300 uppercase tracking-widest block font-bold mt-1">
              Founder & Soul
            </span>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="mt-8 bg-[#a64d79] hover:bg-[#8e3e66] w-full rounded-2xl py-7 text-lg font-bold shadow-lg transition-transform active:scale-95"
          >
            ابدئي رحلة الجمال ✨
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
