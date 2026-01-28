import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const { t, language, toggleLanguage } = useLanguage();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // تم تعديل الرابط هنا من /#articles-section إلى /articles
  const links = [
    { href: "/", label: t("Home", "الرئيسية") },
    { href: "/articles", label: t("Articles", "المقالات") },
    { href: "/routines", label: t("Routines", "الروتين اليومي") },
    { href: "/remedies", label: t("Remedies", "وصفات طبيعية") },
    { href: "/about", label: t("About", "من نحن") },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    // تم تنظيف الدالة لتعمل كروابط مباشرة فقط
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-purple-100">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            {t("Toma Beauty", "توما بيوتي")}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                location === link.href
                  ? "text-primary font-semibold"
                  : "text-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="font-medium text-primary hover:bg-primary/10 hover:text-primary"
          >
            {language === "en" ? "العربية" : "English"}
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="font-medium text-primary text-xs"
          >
            {language === "en" ? "AR" : "EN"}
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={language === "ar" ? "right" : "left"}
              className="w-[300px] sm:w-[400px]"
            >
              <div className="flex flex-col gap-6 mt-8">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`text-lg font-medium transition-colors hover:text-primary cursor-pointer ${
                      location === link.href
                        ? "text-primary font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
