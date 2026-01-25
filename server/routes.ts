import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === API Routes ===

  // Sections
  app.get(api.sections.list.path, async (req, res) => {
    const sections = await storage.getSections();
    res.json(sections);
  });

  // Articles
  app.get(api.articles.list.path, async (req, res) => {
    const articles = await storage.getArticles();
    res.json(articles);
  });

  app.get(api.articles.get.path, async (req, res) => {
    const article = await storage.getArticle(Number(req.params.id));
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  });

  // Routines
  app.get(api.routines.list.path, async (req, res) => {
    const routines = await storage.getRoutines();
    res.json(routines);
  });

  // Remedies
  app.get(api.remedies.list.path, async (req, res) => {
    const remedies = await storage.getRemedies();
    res.json(remedies);
  });

  // Tips
  app.get(api.tips.list.path, async (req, res) => {
    const tips = await storage.getTips();
    res.json(tips);
  });

  // === Seeding ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const sections = await storage.getSections();
  if (sections.length === 0) {
    // 1. Sections
    await storage.createSection({
      key: "about",
      titleEn: "About Toma Beauty",
      titleAr: "عن توما بيوتي",
      contentEn: "Toma Beauty is your ultimate destination for everything related to beauty, skincare, and self-care. We believe that true beauty comes from within, and our mission is to empower you with natural, effective, and simple routines to enhance your natural glow.",
      contentAr: "توما بيوتي هي وجهتك المثالية لكل ما يتعلق بالجمال، العناية بالبشرة، والعناية الذاتية. نؤمن بأن الجمال الحقيقي ينبع من الداخل، ومهمتنا هي تمكينك من خلال روتين طبيعي وفعال وبسيط لتعزيز إشراقتك الطبيعية.",
      imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?auto=format&fit=crop&q=80"
    });

    await storage.createSection({
      key: "founder",
      titleEn: "Meet the Founder",
      titleAr: "تعرف على المؤسسة",
      contentEn: "Our founder is passionate about holistic wellness and sustainable beauty. With years of experience in the beauty industry, she created Toma Beauty to share her knowledge and inspire women everywhere to embrace their unique beauty.",
      contentAr: "مؤسستنا شغوفة بالعافية الشاملة والجمال المستدام. مع سنوات من الخبرة في صناعة التجميل، أنشأت توما بيوتي لمشاركة معرفتها وإلهام النساء في كل مكان لاحتضان جمالهن الفريد.",
      imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80"
    });

    await storage.createSection({
      key: "mission",
      titleEn: "Our Mission",
      titleAr: "مهمتنا",
      contentEn: "To provide every woman with the knowledge and natural tools she needs to feel confident and beautiful in her own skin, using sustainable and safe ingredients.",
      contentAr: "تزويد كل امرأة بالمعرفة والأدوات الطبيعية التي تحتاجها لتشعر بالثقة والجمال في بشرتها، باستخدام مكونات مستدامة وآمنة.",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80"
    });

    await storage.createSection({
      key: "vision",
      titleEn: "Our Vision",
      titleAr: "رؤيتنا",
      contentEn: "To become the leading global platform for natural beauty education, bridging ancient wisdom with modern science for a healthier, more beautiful world.",
      contentAr: "أن نصبح المنصة العالمية الرائدة للتعليم في مجال الجمال الطبيعي، ونجمع بين الحكمة القديمة والعلم الحديث من أجل عالم أكثر صحة وجمالاً.",
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80"
    });

    // 2. Articles
    await storage.createArticle({
      titleEn: "The Magic of Coffee Body Scrubs",
      titleAr: "سحر مقشرات الجسم بالقهوة",
      summaryEn: "Exfoliate and energize your skin with your favorite morning brew.",
      summaryAr: "قشري بشرتك ونشطيها باستخدام مشروبك الصباحي المفضل.",
      contentEn: "Coffee grounds are an incredible natural exfoliant. The caffeine helps stimulate blood flow and can temporarily reduce the appearance of cellulite, leaving your skin silky smooth.",
      contentAr: "تعتبر تفل القهوة مقشرًا طبيعيًا رائعًا. يساعد الكافيين على تحفيز تدفق الدم ويمكن أن يقلل مؤقتًا من ظهور السيلوليت، مما يترك بشرتك ناعمة كالحرير.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1600091106710-539077977681?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "DIY Coffee Eye Serum",
      titleAr: "سيروم العين بالقهوة منزلي الصنع",
      summaryEn: "Say goodbye to dark circles with the power of caffeine.",
      summaryAr: "ودعي الهالات السوداء بقوة الكافيين.",
      contentEn: "Infusing oil with coffee creates a powerful serum for the delicate under-eye area. It helps reduce puffiness and brightens tired eyes almost instantly.",
      contentAr: "يخلق نقع الزيت بالقهوة سيرومًا قويًا لمنطقة تحت العين الرقيقة. يساعد في تقليل الانتفاخ وتفتيح العيون المتعبة على الفور تقريبًا.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Coffee Scalp Scrub for Growth",
      titleAr: "مقشر فروة الرأس بالقهوة للنمو",
      summaryEn: "Stimulate your roots for thicker, healthier hair.",
      summaryAr: "حفزي جذورك لشعر أكثر كثافة وصحة.",
      contentEn: "Massaging coffee grounds into your scalp helps remove product buildup and stimulates hair follicles, encouraging faster and healthier hair growth.",
      contentAr: "يساعد تدليك تفل القهوة في فروة رأسك على إزالة تراكم المنتجات وتحفيز بصيلات الشعر، مما يشجع على نمو الشعر بشكل أسرع وأكثر صحة.",
      category: "haircare",
      imageUrl: "https://images.unsplash.com/photo-1559591937-e624c9629b3d?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "The Science of Green Tea in Beauty",
      titleAr: "علم الشاي الأخضر في الجمال",
      summaryEn: "Antioxidant protection for a youthful complexion.",
      summaryAr: "حماية مضادة للأكسدة لبشرة شبابية.",
      contentEn: "Green tea is packed with polyphenols that protect the skin from environmental damage and soothe inflammation, making it a must-have in your natural arsenal.",
      contentAr: "الشاي الأخضر مليء بالبوليفينول الذي يحمي البشرة من الأضرار البيئية ويهدئ الالتهاب، مما يجعله ضروريًا في ترسانتك الطبيعية.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Coconut Oil: The Ultimate Multi-Tasker",
      titleAr: "زيت جوز الهند: المهام المتعددة القصوى",
      summaryEn: "From makeup remover to deep conditioner.",
      summaryAr: "من مزيل للمكياج إلى بلسم عميق.",
      contentEn: "Coconut oil's lauric acid makes it antibacterial and highly moisturizing. It's the perfect natural solution for almost every beauty need.",
      contentAr: "حمض اللوريك الموجود في زيت جوز الهند يجعله مضادًا للبكتيريا ومرطبًا للغاية. إنه الحل الطبيعي المثالي لكل احتياجات الجمال تقريبًا.",
      category: "lifestyle",
      imageUrl: "https://images.unsplash.com/photo-1544126592-807daa215a75?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "5 Mistakes You Are Making with Your Hair",
      titleAr: "5 أخطاء ترتكبينها بحق شعرك",
      summaryEn: "Are you damaging your hair without knowing it?",
      summaryAr: "هل تقومين بإتلاف شعرك دون أن تعلمي؟",
      contentEn: "From over-washing to using too much heat, here are common pitfalls...",
      contentAr: "من الغسيل المفرط إلى استخدام الحرارة الزائدة، إليك الأخطاء الشائعة...",
      category: "haircare",
      imageUrl: "https://images.unsplash.com/photo-1516726817505-f5ed17dc40f2?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "The Benefits of Rose Water",
      titleAr: "فوائد ماء الورد",
      summaryEn: "A natural toner that has been used for centuries.",
      summaryAr: "تونر طبيعي يستخدم منذ قرون.",
      contentEn: "Rose water helps maintain the skin's pH balance and controls excess oil...",
      contentAr: "يساعد ماء الورد في الحفاظ على توازن درجة حموضة البشرة ويتحكم في الزيوت الزائدة...",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Sunscreen: Your Best Anti-Aging Tool",
      titleAr: "واقي الشمس: أفضل أداة لمكافحة الشيخوخة",
      summaryEn: "Protecting your skin from UV rays is non-negotiable.",
      summaryAr: "حماية بشرتك من الأشعة فوق البنفسجية أمر غير قابل للتفاوض.",
      contentEn: "90% of skin aging is caused by the sun. Here is how to choose the right one...",
      contentAr: "90% من شيخوخة الجلد سببها الشمس. إليك كيفية اختيار النوع المناسب...",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1556229162-5c63ed9c4ffb?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Nighttime Skincare Essentials",
      titleAr: "أساسيات العناية بالبشرة ليلاً",
      summaryEn: "How to maximize your skin's repair phase while you sleep.",
      summaryAr: "كيفية تعظيم مرحلة إصلاح بشرتك أثناء النوم.",
      contentEn: "Your skin regenerates at night. Using retinoids and thick creams can help...",
      contentAr: "تتجدد بشرتك في الليل. استخدام الرتينويدات والكريمات السميكة يمكن أن يساعد...",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Natural Oils for Healthy Hair",
      titleAr: "الزيوت الطبيعية لشعر صحي",
      summaryEn: "From Argan to Coconut, find the best oil for your hair type.",
      summaryAr: "من الأرغان إلى جوز الهند، ابحثي عن أفضل زيت لنوع شعرك.",
      contentEn: "Oiling your hair can provide deep nourishment and prevent breakage...",
      contentAr: "تزييت شعرك يمكن أن يوفر تغذية عميقة ويمنع التقصف...",
      category: "haircare",
      imageUrl: "https://images.unsplash.com/photo-1626015155682-198129e97911?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "The Importance of Scalp Health",
      titleAr: "أهمية صحة فروة الرأس",
      summaryEn: "Healthy hair starts at the root.",
      summaryAr: "الشعر الصحي يبدأ من الجذور.",
      contentEn: "Scalp exfoliation and massage can stimulate growth and reduce dandruff...",
      contentAr: "تقشير فروة الرأس وتدليكها يمكن أن يحفز النمو ويقلل من القشرة...",
      category: "haircare",
      imageUrl: "https://images.unsplash.com/photo-1532713107108-dfb5d8d2ebe4?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Clean Beauty: What You Need to Know",
      titleAr: "الجمال النظيف: ما تحتاجين لمعرفته",
      summaryEn: "A guide to understanding safe ingredients in your products.",
      summaryAr: "دليل لفهم المكونات الآمنة في منتجاتك.",
      contentEn: "Avoid parabens and sulfates. Look for natural alternatives...",
      contentAr: "تجنبي البارابين والكبريتات. ابحثي عن بدائل طبيعية...",
      category: "lifestyle",
      imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Mindful Beauty: Stress and Your Skin",
      titleAr: "الجمال الواعي: التوتر وبشرتك",
      summaryEn: "How your mental state affects your physical appearance.",
      summaryAr: "كيف تؤثر حالتك النفسية على مظهرك الجسدي.",
      contentEn: "Cortisol can break down collagen. Learn how to de-stress for better skin...",
      contentAr: "الكورتيزول يمكن أن يحطم الكولاجين. تعلمي كيفية تخفيف التوتر لبشرة أفضل...",
      category: "lifestyle",
      imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "The Power of Facial Massage",
      titleAr: "قوة تدليك الوجه",
      summaryEn: "Natural lifting and lymphatic drainage techniques.",
      summaryAr: "تقنيات الشد الطبيعي والتصريف اللمفاوي.",
      contentEn: "Using a Gua Sha or your fingers can help define your features...",
      contentAr: "استخدام الجواشا أو أصابعك يمكن أن يساعد في تحديد ملامحك...",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Natural Homemade Beauty Products",
      titleAr: "منتجات التجميل الطبيعية المصنوعة في المنزل – جمال آمن وصحي",
      summaryEn: "A guide to safe and healthy DIY beauty products.",
      summaryAr: "دليل لمنتجات تجميل منزلية الصنع آمنة وصحية.",
      contentEn: "In recent years, awareness has increased about the dangers of chemicals in commercial cosmetics, such as synthetic fragrances and parabens. Homemade products are safe, effective, and low-cost.",
      contentAr: "في السنوات الأخيرة زاد الوعي بأضرار المواد الكيميائية الموجودة في كثير من مستحضرات التجميل التجارية، مثل العطور الصناعية والبارابين. لذلك اتجه الكثيرون إلى استخدام منتجات التجميل المصنوعة في المنزل، لما تتميز به من أمان وفعالية وتكلفة منخفضة.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1601612620450-5eecebbd03ae?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Natural Face Masks from Your Kitchen",
      titleAr: "أقنعة الوجه الطبيعية – عناية فعالة من مطبخك",
      summaryEn: "Treat your skin problems with ingredients you already have.",
      summaryAr: "عالجي مشاكل بشرتك بمكونات موجودة بالفعل في مطبخك.",
      contentEn: "Natural face masks are one of the most common ways to care for your skin, treating issues like dryness, dullness, and acne. Consistency gives your skin a natural glow.",
      contentAr: "تُعد أقنعة الوجه الطبيعية من أكثر طرق العناية بالبشرة شيوعًا، لأنها تعالج مشاكل عديدة مثل الجفاف، البهتان، والحبوب. الاستمرار في استخدامها يمنح البشرة إشراقًا ونضارة طبيعية.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Hair Care with Natural Recipes",
      titleAr: "العناية بالشعر باستخدام وصفات طبيعية منزلية",
      summaryEn: "Protect your hair from daily damage with simple natural solutions.",
      summaryAr: "احمي شعرك من الأضرار اليومية بحلول طبيعية بسيطة.",
      contentEn: "Hair is exposed daily to damaging factors like heat and pollution. Natural recipes are an ideal solution to strengthen hair and stimulate growth without damage.",
      contentAr: "يتعرض الشعر يوميًا لعوامل تضر به مثل الحرارة، الصبغات، والتلوث. لذلك تُعد الوصفات الطبيعية حلًا مثاليًا لتقوية الشعر وتحفيز نموه دون إتلافه.",
      category: "haircare",
      imageUrl: "https://images.unsplash.com/photo-1444312645910-ffa973656eba?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Natural Homemade Soap",
      titleAr: "الصابون الطبيعي المنزلي – نظافة آمنة للبشرة",
      summaryEn: "A safe alternative to commercial soaps containing harsh chemicals.",
      summaryAr: "بديل آمن للصابون التجاري الذي يحتوي على مواد كيميائية قاسية.",
      contentEn: "Homemade natural soap is one of the best alternatives to commercial soap. It gently cleanses the skin and preserves its natural oils, with added beneficial ingredients like herbs and essential oils.",
      contentAr: "يُعد الصابون الطبيعي المصنوع في المنزل من أفضل البدائل للصابون التجاري الذي يحتوي غالبًا على مواد كيميائية تسبب الجفاف والتهيج. الصابون الطبيعي ينظف البشرة بلطف ويحافظ على الزيوت الطبيعية فيها، كما يمكن إضافة مكونات مفيدة مثل الأعشاب والزيوت العطرية.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Natural Lip Balm",
      titleAr: "بلسم الشفاه الطبيعي – حماية وترطيب دائم",
      summaryEn: "Deep hydration and protection for soft, smooth lips.",
      summaryAr: "ترطيب عميق وحماية لشفاه ناعمة وسلسة.",
      contentEn: "Lips are exposed to dryness and cracking due to weather and unsuitable products. Natural lip balm provides deep hydration and restores softness without synthetic materials.",
      contentAr: "تتعرض الشفاه للجفاف والتشقق بسبب الطقس واستخدام مستحضرات غير مناسبة. بلسم الشفاه الطبيعي يمنح ترطيبًا عميقًا ويعيد للشفاه نعومتها دون مواد صناعية.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1617350410111-f9b2d878701e?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Natural Oils for Skin and Hair",
      titleAr: "الزيوت الطبيعية للعناية بالبشرة والشعر",
      summaryEn: "Vitamins and fatty acids for a healthy, radiant look.",
      summaryAr: "فيتامينات وأحماض دهنية لمظهر صحي ومشرق.",
      contentEn: "Natural oils have been used since ancient times for beauty care, containing beneficial vitamins and fatty acids. Regular use helps moisturize the skin and strengthen the hair.",
      contentAr: "الزيوت الطبيعية تُستخدم منذ القدم في العناية بالجمال، لما تحتويه من فيتامينات وأحماض دهنية مفيدة. الاستخدام المنتظم للزيوت يساعد على ترطيب البشرة وتقوية الشعر ومنحه لمعانًا صحيًا.",
      category: "haircare",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Homemade Natural Deodorant",
      titleAr: "مزيل عرق طبيعي منزلي – انتعاش بلا مواد ضارة",
      summaryEn: "Stay fresh without irritating chemicals.",
      summaryAr: "حافظي على انتعاشك بدون مواد كيميائية مهيجة.",
      contentEn: "Most commercial deodorants contain substances that may cause skin irritation. A homemade natural alternative helps control odor and leaves a fresh feeling without harm.",
      contentAr: "تحتوي معظم مزيلات العرق التجارية على مواد قد تسبب تهيج الجلد. المزيل الطبيعي المنزلي يساعد على التحكم في الرائحة ويترك إحساسًا بالانتعاش دون ضرر.",
      category: "lifestyle",
      imageUrl: "https://images.unsplash.com/photo-1556228578-8c7c0f44bb0b?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Bakuchiol: Nature's Retinol",
      titleAr: "باكوتشيول: ريتينول الطبيعة",
      summaryEn: "A gentle, plant-derived alternative to retinol for anti-aging.",
      summaryAr: "بديل لطيف ومن أصل نباتي للريتينول لمكافحة الشيخوخة.",
      contentEn: "Bakuchiol is a natural alternative to retinol from the babchi plant. It offers anti-aging benefits like reduced wrinkles and improved skin texture without the typical irritation associated with retinol.",
      contentAr: "الباكوتشيول هو بديل طبيعي للريتينول مشتق من نبات البابتشي. يقدم فوائد مكافحة الشيخوخة مثل تقليل التجاعيد وتحسين ملمس البشرة دون التهيج المعتاد المرتبط بالريتينول.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "The Magic of Caffeine in Skincare",
      titleAr: "سحر الكافيين في العناية بالبشرة",
      summaryEn: "How caffeine helps de-puff eyes and boost circulation.",
      summaryAr: "كيف يساعد الكافيين في تخفيف انتفاخ العينين وتعزيز الدورة الدموية.",
      contentEn: "Caffeine constricts blood vessels, making it an excellent ingredient for de-puffing the under-eye area. It also helps improve overall skin radiance and microcirculation.",
      contentAr: "يعمل الكافيين على تضييق الأوعية الدموية، مما يجعله مكونًا ممتازًا لتخفيف انتفاخ منطقة تحت العين. كما يساعد في تحسين إشراق البشرة العام والدورة الدموية الدقيقة.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1544126592-807daa215a75?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Honey & Milk: Cleopatra's Beauty Secret",
      titleAr: "العسل والحليب: سر جمال كليوباترا",
      summaryEn: "Classic ancient recipes for soft and radiant skin.",
      summaryAr: "وصفات قديمة كلاسيكية لبشرة ناعمة ومشرقة.",
      contentEn: "The combination of lactic acid from milk and humectants from honey creates a powerful moisturizing and exfoliating treatment. It rejuvenates cells and leaves skin incredibly soft.",
      contentAr: "مزيج حمض اللاكتيك من الحليب والمرطبات من العسل يخلق علاجًا قويًا للترطيب والتقشير. يجدد الخلايا ويترك البشرة ناعمة بشكل لا يصدق.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1541416512301-35f1143ab7be?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Avocado & Olive Oil for Dry Skin",
      titleAr: "الأفوكادو وزيت الزيتون للبشرة الجافة",
      summaryEn: "Intense nourishment for dehydrated complexions.",
      summaryAr: "تغذية مكثفة للبشرة المصابة بالجفاف.",
      contentEn: "Rich in healthy fats and Vitamin E, avocado combined with olive oil provides a deep hydration boost, perfect for soothing dry and sensitive skin areas.",
      contentAr: "غني بالدهون الصحية وفيتامين E، يوفر الأفوكادو الممزوج مع زيت الزيتون دفعة ترطيب عميقة، مما يجعله مثاليًا لتهدئة مناطق البشرة الجافة والحساسة.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1523263685509-57c1d0ef862?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Lemon & Honey for Brightening",
      titleAr: "الليمون والعسل لتفتيح البشرة",
      summaryEn: "Natural Vitamin C for evening out skin tone.",
      summaryAr: "فيتامين سي طبيعي لتوحيد لون البشرة.",
      contentEn: "Lemon juice acts as a natural bleach and astringent, while honey antibacterial properties keep the skin clear. Use this carefully to brighten dark spots and even your complexion.",
      contentAr: "يعمل عصير الليمون كمبيض طبيعي وقابض للمسام، بينما تحافظ خصائص العسل المضادة للبكتيريا على نظافة البشرة. استخدمي هذه الوصفة بحذر لتفتيح البقع الداكنة وتوحيد لون بشرتك.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1529590000000-01dc93c046c?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Oatmeal & Almonds for Balanced Skin",
      titleAr: "الشوفان واللوز للبشرة المختلطة",
      summaryEn: "Gentle exfoliation and pore purification.",
      summaryAr: "تقشير لطيف وتنقية المسام.",
      contentEn: "Oatmeal is anti-inflammatory and gently exfoliates, while almond oil balances the skin's moisture levels. Perfect for sensitive or combination skin types.",
      contentAr: "الشوفان مضاد للالتهابات ويقشر بلطف، بينما يوازن زيت اللوز مستويات رطوبة البشرة. مثالي لأنواع البشرة الحساسة أو المختلطة.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1512413316925-fd4b93f31521?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Rice Water & Honey Glow",
      titleAr: "ماء الأرز والعسل للإشراق",
      summaryEn: "An Asian beauty secret for smooth, radiant skin.",
      summaryAr: "سر جمال آسيوي لبشرة ناعمة ومشرقة.",
      contentEn: "Rice water has been used for centuries to achieve a porcelain-like complexion. Combined with honey, it provides intense radiance and refines skin texture.",
      contentAr: "يُستخدم ماء الأرز منذ قرون للحصول على بشرة تشبه البورسلين. عند دمجه مع العسل، فإنه يوفر إشراقًا مكثفًا ويحسن ملمس البشرة.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Turmeric & Yogurt Anti-Inflammatory Mask",
      titleAr: "قناع الكركم والزبادي المضاد للالتهابات",
      summaryEn: "Reduce redness and boost your natural glow.",
      summaryAr: "تقليل الاحمرار وتعزيز توهجك الطبيعي.",
      contentEn: "Turmeric is a powerful anti-inflammatory that helps brighten skin, while the lactic acid in yogurt provides a gentle chemical exfoliation.",
      contentAr: "الكركم مضاد قوي للالتهابات يساعد على تفتيح البشرة، بينما يوفر حمض اللاكتيك في الزيادي تقشيرًا كيميائيًا لطيفًا.",
      category: "skincare",
      imageUrl: "https://images.unsplash.com/photo-1616671285324-9811303fb1d9?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Argan Oil: Liquid Gold for Hair",
      titleAr: "زيت الأرغان: الذهب السائل للشعر",
      summaryEn: "The ultimate solution for split ends and frizz.",
      summaryAr: "الحل الأمثل لتقصف الشعر وتجعده.",
      contentEn: "Argan oil is packed with Vitamin E and fatty acids that deeply penetrate the hair shaft, restoring shine and preventing breakage.",
      contentAr: "زيت الأرغان غني بفيتامين E والأحماض الدهنية التي تخترق بعمق جذع الشعرة، مما يعيد اللمعان ويمنع التقصف.",
      category: "haircare",
      imageUrl: "https://images.unsplash.com/photo-1608248547146-8249764b3917?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "Apple Cider Vinegar Hair Rinse",
      titleAr: "شطف الشعر بخل التفاح",
      summaryEn: "Restore pH balance and remove product buildup.",
      summaryAr: "استعادة توازن درجة الحموضة وإزالة تراكم المنتجات.",
      contentEn: "An ACV rinse closes the hair cuticle, adding incredible shine and making the hair easier to detangle. It also helps with scalp health by balancing its pH.",
      contentAr: "شطف الشعر بخل التفاح يغلق بصيلات الشعر، مما يضيف لمعانًا مذهلاً ويجعل الشعر أسهل في فك التشابك. كما يساعد في صحة فروة الرأس من خلال موازنة درجة حموضتها.",
      category: "haircare",
      imageUrl: "https://images.unsplash.com/photo-1595981267035-21a4ca262621?auto=format&fit=crop&q=80"
    });

    await storage.createArticle({
      titleEn: "The Benefits of Black Cumin Seed Oil",
      titleAr: "فوائد زيت حبة البركة",
      summaryEn: "An ancient remedy for skin and hair concerns.",
      summaryAr: "علاج قديم لمشاكل البشرة والشعر.",
      contentEn: "Known as the seed of blessing, black cumin oil is antibacterial and anti-inflammatory, making it perfect for treating acne and promoting hair growth.",
      contentAr: "يُعرف زيت حبة البركة بأنه حبة البركة، وهو مضاد للبكتيريا والالتهابات، مما يجعله مثاليًا لعلاج حب الشباب وتعزيز نمو الشعر.",
      category: "lifestyle",
      imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80"
    });

    // 3. Routines
    await storage.createRoutine({
      titleEn: "Morning Glow Routine",
      titleAr: "روتين إشراقة الصباح",
      frequency: "morning",
      stepsEn: ["Cleanse with a gentle foam", "Apply Vitamin C serum", "Moisturize", "Apply Sunscreen (SPF 50)"],
      stepsAr: ["اغسلي وجهك بغسول لطيف", "ضعي سيروم فيتامين سي", "رطبي بشرتك", "ضعي واقي الشمس (SPF 50)"]
    });

    await storage.createRoutine({
      titleEn: "Evening Restoration",
      titleAr: "روتين المساء المرمم",
      frequency: "evening",
      stepsEn: ["Double cleanse to remove makeup", "Apply Retinol or Night Cream", "Use Eye Cream"],
      stepsAr: ["تنظيف مزدوج لإزالة المكياج", "ضعي الريتينول أو كريم الليل", "استخدمي كريم العين"]
    });

    // 4. Remedies
    await storage.createRemedy({
      titleEn: "Honey & Turmeric Mask",
      titleAr: "قناع العسل والكركم",
      ingredientsEn: ["1 tbsp Honey", "1 pinch Turmeric", "1 tsp Yogurt"],
      ingredientsAr: ["ملعقة كبيرة عسل", "رشة كركم", "ملعقة صغيرة زبادي"],
      instructionsEn: "Mix all ingredients. Apply to face for 15 mins. Rinse with warm water.",
      instructionsAr: "اخلطي جميع المكونات. ضعيها على الوجه لمدة 15 دقيقة. اشطفيه بالماء الدافئ.",
      benefitsEn: "Brightens skin and reduces inflammation.",
      benefitsAr: "يفتح البشرة ويقلل الالتهاب."
    });

    // 5. Tips
    await storage.createTip({
      contentEn: "Always apply sunscreen, even on cloudy days!",
      contentAr: "ضعي واقي الشمس دائمًا، حتى في الأيام الغائمة!",
      category: "skincare"
    });
    await storage.createTip({
      contentEn: "Drink at least 2 liters of water daily for clear skin.",
      contentAr: "اشربي ما لا يقل عن 2 لتر من الماء يوميًا لبشرة صافية.",
      category: "health"
    });
  }
}
