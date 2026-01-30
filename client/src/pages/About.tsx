import { useLanguage } from "@/hooks/use-language";
import { useSections } from "@/hooks/use-content";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function About() {
  const { t, language } = useLanguage();
  // Note: sections might be empty initially, use fallback data
  
  // Fallback data if API returns empty
  const fallbackAbout = {
    titleEn: "About Toma Beauty",
    titleAr: "عن توما بيوتي",
    contentEn: "Toma Beauty is a sanctuary for those who believe in the power of natural beauty. We are dedicated to simplifying skincare and wellness through expert advice, curated routines, and homemade remedies. Our mission is to empower you to feel confident in your own skin.",
    contentAr: "توما بيوتي هو ملاذ لمن يؤمنون بقوة الجمال الطبيعي. نحن مكرسون لتبسيط العناية بالبشرة والعافية من خلال نصائح الخبراء، والروتين المنسق، والعلاجات المنزلية. مهمتنا هي تمكينك من الشعور بالثقة في بشرتك.",
    imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1000&auto=format&fit=crop"
  };

  const fallbackFounder = {
    titleEn: "Meet the Founder",
    titleAr: "تعرف على المؤسس",
    contentEn: "Founded with a passion for holistic wellness, our vision stems from the belief that beauty starts from within. After years of exploring natural ingredients and sustainable practices, I created this platform to share the secrets of timeless elegance.",
    contentAr: "تأسست بشغف للعافية الشاملة، رؤيتنا تنبع من الإيمان بأن الجمال يبدأ من الداخل. بعد سنوات من استكشاف المكونات الطبيعية والممارسات المستدامة، أنشأت هذه المنصة لمشاركة أسرار الأناقة الخالدة.",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1000&auto=format&fit=crop"
  };

  return (
    <div className="min-h-screen py-12 md:py-24">
      {/* About Section */}
      <div className="container mx-auto px-4 md:px-6 mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-2 md:order-1"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 font-serif">
              {language === 'en' 
                ? fallbackAbout.titleEn
                : fallbackAbout.titleAr}
            </h1>
            <div className="w-20 h-1 bg-primary mb-8 rounded-full" />
            <p className="text-lg text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
              {language === 'en' 
                ? fallbackAbout.contentEn
                : fallbackAbout.contentAr}
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="order-1 md:order-2 relative"
          >
            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src={fallbackAbout.imageUrl}
                alt="About Us" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -z-10 top-10 -right-10 w-full h-full border-2 border-primary/20 rounded-[2rem]" />
          </motion.div>
        </div>
      </div>

      {/* Founder Section */}
      <div className="bg-secondary/30 py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="relative"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl max-w-md mx-auto md:mx-0">
                <img 
                  src={fallbackFounder.imageUrl}
                  alt="Founder" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
              <Quote className="w-12 h-12 text-primary/30 mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 font-serif">
                {language === 'en' 
                  ? fallbackFounder.titleEn
                  : fallbackFounder.titleAr}
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed mb-8">
                <p>
                  {language === 'en' 
                    ? fallbackFounder.contentEn
                    : fallbackFounder.contentAr}
                </p>
                <div className="p-6 bg-white/50 rounded-2xl border border-primary/10 backdrop-blur-sm">
                  <p className="font-medium text-gray-900 mb-2">
                    {t(
                      "About the Project Owner:",
                      "حول صاحبة المشروع:"
                    )}
                  </p>
                  <p>
                    {t(
                      "Fatima Mohamed is a student at the University of Khartoum, Faculty of Medical Laboratories. She has extensive experience in this field and is also passionate about skincare and personal beauty care.",
                      "فاطمة محمد طالبة بجامعة الخرطوم، كلية المختبرات الطبية. لديها خبرة واسعة في هذا المجال وهي أيضاً شغوفة بالعناية بالبشرة والجمال الشخصي."
                    )}
                  </p>
                </div>
                <p className="text-sm italic text-gray-500">
                  {t(
                    "This website was designed by Engineer Al-Tayeb Idris.",
                    "تم تصميم هذا الموقع بواسطة المهندس الطيب إدريس."
                  )}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="h-px bg-gray-300 flex-grow max-w-[100px]" />
                 <span className="font-script text-2xl text-primary font-bold">
                    Toma
                 </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
