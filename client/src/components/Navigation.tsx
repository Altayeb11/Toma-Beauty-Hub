import { useLanguage } from "@/hooks/use-language";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Sparkles, Lock, LogOut, Heart, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";


export function Navigation() {
  const { language, setLanguage } = useLanguage();
  const [location] = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      console.log('🔐 Attempting sign-in with:', { email: loginEmail });
      console.log('📍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('🔑 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      console.log('✅ Sign-in response:', { data, error });

      if (error) {
        console.error('❌ Sign-in error:', error);
        setLoginError(error.message);
        return;
      }

      if (data.user) {
        console.log('✨ Login successful:', data.user);
        setShowLoginForm(false);
        setLoginEmail("");
        setLoginPassword("");
        setShowWelcome(true);
      }
    } catch (err: any) {
      console.error('💥 Unexpected error:', err);
      setLoginError(err.message || "Failed to sign in");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowWelcome(false);
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



              {isLoading ? (
                <div className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200 animate-pulse" />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600 px-2 py-1 bg-pink-50 rounded-lg">
                    {user?.email?.split("@")[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-xl shadow-sm border border-red-100 hover:bg-red-100 transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="w-9 h-9 flex items-center justify-center bg-pink-50 text-[#a64d79] rounded-xl shadow-sm border border-pink-100 hover:bg-pink-100 transition-colors"
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

      {/* Login Dialog */}
      <Dialog open={showLoginForm} onOpenChange={setShowLoginForm}>
        <DialogContent className="max-w-[85%] md:max-w-md bg-white rounded-[2.5rem] p-10 border-none shadow-2xl outline-none">
          <div className="sr-only">
            <h2>{language === "ar" ? "دخول المسؤول" : "Admin Login"}</h2>
            <p>{language === "ar" ? "تسجيل الدخول باستخدام حسابك في Supabase" : "Sign in with your Supabase account"}</p>
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center">
              <Mail className="text-[#a64d79]" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#a64d79] mb-2 text-center">
            {language === "ar" ? "دخول المسؤول" : "Admin Login"}
          </h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            {language === "ar" 
              ? "تسجيل الدخول باستخدام حسابك في Supabase" 
              : "Sign in with your Supabase account"}
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <input
              type="email"
              placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"}
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#a64d79] outline-none transition-colors"
              required
            />
            <input
              type="password"
              placeholder={language === "ar" ? "كلمة المرور" : "Password"}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#a64d79] outline-none transition-colors"
              required
            />

            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#a64d79] hover:bg-[#8e3e66] rounded-xl py-3 font-bold text-white disabled:opacity-50"
            >
              {isLoggingIn ? (
                language === "ar" ? "جاري التسجيل..." : "Signing in..."
              ) : (
                language === "ar" ? "دخول" : "Sign In"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowLoginForm(false)}
              className="w-full text-gray-500 rounded-xl"
            >
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-[85%] md:max-w-md bg-white rounded-[2.5rem] p-10 border-none text-center shadow-2xl outline-none">
          <div className="sr-only">
            <h2>{language === "ar" ? "أهلاً بكِ يا جميلة!" : "Welcome!"}</h2>
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center animate-pulse">
              <Heart className="text-[#a64d79] fill-[#a64d79]" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#a64d79] mb-4">
            {language === "ar" ? "أهلاً بكِ يا جميلة!" : "Welcome!"}
          </h2>
          <p className="text-gray-500 leading-relaxed mb-8 italic text-sm px-4">
            {language === "ar"
              ? '"جمالكِ يبدأ من الداخل، واليوم هو فرصة جديدة لتلهمي العالم بلمستكِ الخاصة."'
              : '"Beauty begins within. Today is your chance to inspire the world with your unique touch."'}
          </p>
          <div className="border-t border-pink-50 pt-4">
            <span className="text-[#a64d79] font-serif text-2xl font-bold italic block">
              Toma
            </span>
            <span className="text-[10px] text-gray-300 uppercase tracking-widest block font-bold mt-1">
              {language === "ar" ? "المؤسسة" : "Founder & Soul"}
            </span>
          </div>
          <Button
            onClick={() => setShowWelcome(false)}
            className="mt-8 bg-[#a64d79] hover:bg-[#8e3e66] w-full rounded-2xl py-7 text-lg font-bold shadow-lg transition-transform active:scale-95"
          >
            {language === "ar" ? "ابدئي رحلة الجمال ✨" : "Start Your Journey ✨"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
