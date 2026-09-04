/* =========================================================================
   DATA LAYER
   -------------------------------------------------------------------------
   Every page calls the functions on `WJ.db` below instead of touching
   Firestore directly. When window.firebaseEnabled is true, they read from
   Firestore; otherwise they read from the DEMO_ARTICLES / DEMO_EPAPERS
   arrays in this same file, using identical filtering logic — so the
   front-end behaves exactly the same either way and there is nothing to
   rewrite once Firebase is switched on.
   ========================================================================= */

window.WJ = window.WJ || {};

/* ---------------- categories ---------------- */
WJ.CATEGORIES = [
  { slug: "hot-news",         name: "اہم خبریں",        short: "اہم خبریں",   showInNav: true },
  { slug: "srinagar-kashmir", name: "سرینگر و کشمیر",    short: "کشمیر",       showInNav: true },
  { slug: "local",            name: "علاقائی",           short: "علاقائی",     showInNav: true },
  { slug: "national",         name: "قومی",              short: "قومی",        showInNav: true },
  { slug: "international",    name: "بین الاقوامی",      short: "عالمی",       showInNav: true },
  { slug: "politics",         name: "سیاست",             short: "سیاست",       showInNav: true },
  { slug: "sports",           name: "کھیل",              short: "کھیل",        showInNav: true },
  { slug: "business",         name: "کاروبار",           short: "کاروبار",     showInNav: true },
  { slug: "entertainment",    name: "تفریح",             short: "تفریح",       showInNav: true },
  { slug: "technology",       name: "سائنس و ٹیکنالوجی", short: "ٹیکنالوجی",   showInNav: true },
  { slug: "education",        name: "تعلیم",             short: "تعلیم",       showInNav: true },
  { slug: "health",           name: "صحت",               short: "صحت",         showInNav: true },
  { slug: "editorial",        name: "اداریہ",            short: "اداریہ",      showInNav: true }
];

function catName(slug){
  const c = WJ.CATEGORIES.find(c => c.slug === slug);
  return c ? c.name : slug;
}
WJ.catName = catName;

/* ---------------- demo site settings ---------------- */
WJ.DEMO_SETTINGS = {
  siteName: "WEEKLY JANOON",
  tagline: "Aapki Awaaz, Aapki Khabar",
  taglineUr: "آپ کی آواز، آپ کی خبر",
  contactEmail: "info@weeklyjanoon.com",
  contactPhone: "+91 194 000 0000",
  contactAddress: "پریس کالونی، سرینگر، جموں و کشمیر",
  social: {
    facebook: "https://facebook.com/weeklyjanoon",
    twitter: "https://twitter.com/weeklyjanoon",
    youtube: "https://youtube.com/@weeklyjanoon",
    instagram: "https://instagram.com/weeklyjanoon"
  }
};

/* ---------------- demo articles ----------------
   Original placeholder copy written for this template — not reproduced
   from any reference site. Swap for real content via the admin panel. */
function img(seed, w, h){ return `https://picsum.photos/seed/${seed}/${w||800}/${h||500}`; }

const P1 = "یہ ایک نمائشی خبر ہے جو ویب سائٹ کے ڈیزائن اور ترتیب کو ظاہر کرنے کے لیے شامل کی گئی ہے۔ ایڈمن پینل کے ذریعے اس جگہ اصل خبر شائع کی جا سکتی ہے۔";
const P2 = "مقامی ذرائع کے مطابق حکام نے اس معاملے پر جلد ہی تفصیلی بیان جاری کرنے کا وعدہ کیا ہے۔ عوامی حلقوں میں اس پیش رفت کو مثبت انداز میں دیکھا جا رہا ہے۔";
const P3 = "ماہرین کا کہنا ہے کہ آنے والے دنوں میں صورتحال میں مزید بہتری متوقع ہے، تاہم اس کے لیے مربوط منصوبہ بندی ناگزیر قرار دی جا رہی ہے۔";

let _id = 1000;
function art(o){
  _id++;
  return Object.assign({
    id: String(_id),
    slug: o.slug || `article-${_id}`,
    author: o.author || "نیوز ڈیسک",
    status: "published",
    featured: false,
    breaking: false,
    trending: false,
    views: Math.floor(Math.random()*4000)+120,
    content: [P1, P2, P3]
  }, o);
}

WJ.DEMO_ARTICLES = [
  art({ slug:"tourism-sites-reopen", title:"وادی کشمیر کے بند سیاحتی مقامات دوبارہ کھولنے کا فیصلہ", excerpt:"انتظامیہ نے سیاحوں کی سہولت کے لیے کئی اہم مقامات دوبارہ کھولنے کا اعلان کیا ہے۔", category:"srinagar-kashmir", image:img("wj1"), date:"2026-02-12", breaking:true, featured:true, trending:true }),
  art({ slug:"budget-session-2026", title:"بجٹ اجلاس 2026: ترقیاتی منصوبوں پر حکومت کا زور", excerpt:"رواں مالی سال کے بجٹ اجلاس میں شفافیت اور عوامی سہولیات کو ترجیح دی گئی ہے۔", category:"politics", image:img("wj2"), date:"2026-02-11", breaking:true, featured:true }),
  art({ slug:"railway-expansion-halt", title:"وادی میں ریلوے توسیعی منصوبہ عارضی طور پر روک دیا گیا", excerpt:"محکمہ ریلوے نے تکنیکی وجوہات کی بنا پر منصوبے پر نظرثانی کا اعلان کیا ہے۔", category:"local", image:img("wj3"), date:"2026-02-10", breaking:true }),
  art({ slug:"literary-heritage-seminar", title:"اردو ادب کا بیش قیمت ورثہ: جامعہ میں یادگاری خطبہ", excerpt:"شعبہ اردو کے زیر اہتمام منعقدہ سیمینار میں ممتاز اساتذہ نے شرکت کی۔", category:"education", image:img("wj4"), date:"2026-02-12", featured:true }),
  art({ slug:"anganwadi-workers-issue", title:"آنگن واڈی ورکرز کے مسائل: ایک سنگین صورتحال", excerpt:"مقامی ورکرز نے تنخواہوں میں تاخیر پر انتظامیہ سے فوری توجہ کا مطالبہ کیا ہے۔", category:"local", image:img("wj5"), date:"2026-02-04", trending:true }),
  art({ slug:"solar-rooftop-subsidy", title:"سولر روف ٹاپ اسکیم پر بھاری سبسڈی کا اعلان", excerpt:"صارفین کم لاگت میں شمسی توانائی کی سہولت حاصل کر سکیں گے۔", category:"business", image:img("wj6"), date:"2024-07-18" }),
  art({ slug:"kashmiri-filmmaker-honour", title:"کشمیری فلم ساز کو بین الاقوامی میلے میں شرکت کی دعوت", excerpt:"مقامی فنکار کی محنت کو عالمی سطح پر سراہا جا رہا ہے۔", category:"entertainment", image:img("wj7"), date:"2024-08-02" }),
  art({ slug:"writers-forum-event", title:"رائٹرس فورم کے زیر اہتمام پروقار ادبی تقریب", excerpt:"تقریب میں نئے قلم کاروں کی کتابوں کی رونمائی کی گئی۔", category:"editorial", image:img("wj8"), date:"2024-09-01" }),
  art({ slug:"college-anti-corruption-program", title:"سرکاری کالج میں بدعنوانی کے خلاف بیداری پروگرام", excerpt:"طالبات نے شفافیت اور احتساب کے موضوع پر مباحثے میں حصہ لیا۔", category:"education", image:img("wj9"), date:"2023-11-20" }),
  art({ slug:"driverless-cars-future", title:"خودکار گاڑیاں کب تک سڑکوں پر نظر آئیں گی؟", excerpt:"ماہرین کے مطابق اگلی دہائی میں یہ ٹیکنالوجی عام صارفین تک پہنچ سکتی ہے۔", category:"technology", image:img("wj10"), date:"2023-12-30" }),
  art({ slug:"ai-health-tool", title:"صحت کے شعبے میں مصنوعی ذہانت کا نیا ٹول متعارف", excerpt:"نیا سافٹ ویئر ابتدائی تشخیص میں معالجین کی مدد کرے گا۔", category:"technology", image:img("wj11"), date:"2023-12-26", trending:true }),
  art({ slug:"smoking-brain-research", title:"سگریٹ نوشی اور دماغی صحت پر نئی تحقیق", excerpt:"سائنسدانوں نے طویل المدتی اثرات پر روشنی ڈالی ہے۔", category:"health", image:img("wj12"), date:"2023-12-15" }),
  art({ slug:"milk-quality-tips", title:"دودھ کے معیار کی جانچ کے چار آسان طریقے", excerpt:"گھریلو سطح پر ملاوٹ کی نشاندہی کیسے کی جائے، ماہرین کی رائے۔", category:"health", image:img("wj13"), date:"2021-09-03" }),
  art({ slug:"diabetes-causes-solutions", title:"ذیابیطس: وجوہات اور احتیاطی تدابیر", excerpt:"معالجین نے متوازن غذا اور روزمرہ ورزش کی اہمیت پر زور دیا۔", category:"health", image:img("wj14"), date:"2021-06-10" }),
  art({ slug:"gulf-labour-relief", title:"خلیجی ممالک میں مقیم کشمیری کارکنوں کے لیے نئی سہولت", excerpt:"سفری اور روزگار سے متعلق ضوابط میں نرمی کا اعلان کیا گیا ہے۔", category:"international", image:img("wj15"), date:"2024-01-05" }),
  art({ slug:"world-affairs-summary", title:"عالمی سفارتی پیش رفت: ہفتہ وار جائزہ", excerpt:"بین الاقوامی امور پر مختصر و جامع رپورٹ۔", category:"international", image:img("wj16"), date:"2024-01-01" }),
  art({ slug:"cricket-tournament-local", title:"مقامی سطح پر انٹر ڈسٹرکٹ کرکٹ ٹورنامنٹ کا آغاز", excerpt:"نوجوان کھلاڑیوں کی بھرپور شرکت، فائنل اگلے ہفتے متوقع۔", category:"sports", image:img("wj17"), date:"2026-01-20", featured:true }),
  art({ slug:"football-academy-launch", title:"وادی میں نئی فٹبال اکیڈمی کا افتتاح", excerpt:"نوجوانوں کو جدید تربیتی سہولیات میسر آئیں گی۔", category:"sports", image:img("wj18"), date:"2025-11-11" }),
  art({ slug:"budget-tax-relief", title:"تاجر برادری کے لیے ٹیکس میں نرمی کا مطالبہ", excerpt:"چیمبر آف کامرس نے آئندہ بجٹ میں رعایت کی درخواست کی ہے۔", category:"business", image:img("wj19"), date:"2026-01-15" }),
  art({ slug:"handicraft-export-growth", title:"کشمیری دستکاری کی برآمدات میں نمایاں اضافہ", excerpt:"بین الاقوامی منڈی میں مقامی مصنوعات کی طلب بڑھ رہی ہے۔", category:"business", image:img("wj20"), date:"2025-10-02" }),
  art({ slug:"editorial-precaution", title:"اداریہ: احتیاط آخر کب؟", excerpt:"سڑک حادثات میں اضافے پر ادارتی تبصرہ۔", category:"editorial", image:img("wj21"), date:"2024-06-20" }),
  art({ slug:"editorial-tourism-crores", title:"اداریہ: دو کروڑ سیاح، مگر بنیادی سہولیات کہاں؟", excerpt:"سیاحتی شعبے کی ترقی اور بنیادی ڈھانچے کے فرق پر رائے۔", category:"editorial", image:img("wj22"), date:"2024-05-10" }),
  art({ slug:"assembly-elections-prep", title:"آئندہ اسمبلی انتخابات کے لیے تیاریاں جاری", excerpt:"الیکشن کمیشن نے متعلقہ حکام کو ہدایات جاری کر دیں۔", category:"politics", image:img("wj23"), date:"2025-08-01" }),
  art({ slug:"new-drama-serial", title:"مقامی زبان میں نئے ڈرامہ سیریل کی شوٹنگ مکمل", excerpt:"ناظرین میں تجسس، جلد نشریات کا امکان۔", category:"entertainment", image:img("wj24"), date:"2025-09-14" }),
  art({ slug:"srinagar-heritage-walk", title:"سرینگر میں تاریخی ورثے کے تحفظ کے لیے واک کا انعقاد", excerpt:"شہریوں نے پرانے شہر کی عمارتوں کی بحالی پر زور دیا۔", category:"srinagar-kashmir", image:img("wj25"), date:"2026-01-28" }),
  art({ slug:"dal-lake-cleanliness", title:"ڈل جھیل کی صفائی کے لیے نئی مہم کا آغاز", excerpt:"رضاکاروں اور انتظامیہ نے مشترکہ کوششوں کا آغاز کیا۔", category:"srinagar-kashmir", image:img("wj26"), date:"2026-01-22", trending:true })
];

/* ---------------- demo e-papers ---------------- */
WJ.DEMO_EPAPERS = [
  { id:"ep1", title:"ہفتہ وار ایڈیشن", date:"2026-02-13", pages:[img("ep1a",700,990), img("ep1b",700,990), img("ep1c",700,990), img("ep1d",700,990)] },
  { id:"ep2", title:"ہفتہ وار ایڈیشن", date:"2026-02-06", pages:[img("ep2a",700,990), img("ep2b",700,990), img("ep2c",700,990), img("ep2d",700,990)] },
  { id:"ep3", title:"ہفتہ وار ایڈیشن", date:"2026-01-30", pages:[img("ep3a",700,990), img("ep3b",700,990), img("ep3c",700,990), img("ep3d",700,990)] },
  { id:"ep4", title:"ہفتہ وار ایڈیشن", date:"2026-01-23", pages:[img("ep4a",700,990), img("ep4b",700,990), img("ep4c",700,990), img("ep4d",700,990)] },
  { id:"ep5", title:"ہفتہ وار ایڈیشن", date:"2026-01-16", pages:[img("ep5a",700,990), img("ep5b",700,990), img("ep5c",700,990), img("ep5d",700,990)] }
];

/* =========================================================================
   DB ACCESS LAYER
   ========================================================================= */
WJ.db = {

  async getSettings(){
    if (window.firebaseEnabled){
      try{
        const snap = await window.fb.db.collection("settings").doc("site").get();
        if (snap.exists) return snap.data();
      }catch(e){ console.error(e); }
    }
    return WJ.DEMO_SETTINGS;
  },

  async getCategories(){
    if (window.firebaseEnabled){
      try{
        const snap = await window.fb.db.collection("categories").orderBy("order","asc").get();
        if (!snap.empty) return snap.docs.map(d=>({id:d.id, ...d.data()}));
      }catch(e){ console.error(e); }
    }
    return WJ.CATEGORIES;
  },

  async getArticles(opts={}){
    // opts: { category, featured, breaking, trending, limit, excludeId, status }
    let list;
    if (window.firebaseEnabled){
      try{
        let ref = window.fb.db.collection("articles").where("status","==", opts.status || "published");
        if (opts.category) ref = ref.where("category","==",opts.category);
        if (opts.featured) ref = ref.where("featured","==",true);
        if (opts.breaking) ref = ref.where("breaking","==",true);
        if (opts.trending) ref = ref.where("trending","==",true);
        ref = ref.orderBy("date","desc");
        if (opts.limit) ref = ref.limit(opts.limit);
        const snap = await ref.get();
        list = snap.docs.map(d=>({id:d.id, ...d.data()}));
      }catch(e){
        console.error("Firestore query failed, falling back to demo data:", e);
        list = null;
      }
    }
    if (!list){
      list = WJ.DEMO_ARTICLES.filter(a=>{
        if ((opts.status || "published") !== a.status) return false;
        if (opts.category && a.category !== opts.category) return false;
        if (opts.featured && !a.featured) return false;
        if (opts.breaking && !a.breaking) return false;
        if (opts.trending && !a.trending) return false;
        return true;
      }).sort((a,b)=> new Date(b.date) - new Date(a.date));
      if (opts.limit) list = list.slice(0, opts.limit);
    }
    if (opts.excludeId) list = list.filter(a=>a.id!==opts.excludeId && a.slug!==opts.excludeId);
    return list;
  },

  async getArticleBySlug(slug){
    if (window.firebaseEnabled){
      try{
        const snap = await window.fb.db.collection("articles").where("slug","==",slug).limit(1).get();
        if (!snap.empty){ const d = snap.docs[0]; return {id:d.id, ...d.data()}; }
      }catch(e){ console.error(e); }
    }
    return WJ.DEMO_ARTICLES.find(a=>a.slug===slug || a.id===slug) || null;
  },

  async searchArticles(q){
    q = (q||"").trim().toLowerCase();
    if (!q) return [];
    let list;
    if (window.firebaseEnabled){
      try{
        // Firestore has no native full-text search; fetch published set and filter client-side.
        const snap = await window.fb.db.collection("articles").where("status","==","published").get();
        list = snap.docs.map(d=>({id:d.id, ...d.data()}));
      }catch(e){ console.error(e); list = null; }
    }
    if (!list) list = WJ.DEMO_ARTICLES.filter(a=>a.status==="published");
    return list.filter(a=>
      (a.title||"").toLowerCase().includes(q) ||
      (a.excerpt||"").toLowerCase().includes(q) ||
      (catName(a.category)||"").toLowerCase().includes(q)
    ).sort((a,b)=> new Date(b.date) - new Date(a.date));
  },

  async getEpapers(){
    if (window.firebaseEnabled){
      try{
        const snap = await window.fb.db.collection("epapers").orderBy("date","desc").get();
        if (!snap.empty) return snap.docs.map(d=>({id:d.id, ...d.data()}));
      }catch(e){ console.error(e); }
    }
    return WJ.DEMO_EPAPERS;
  }
};

/* date formatting: Urdu-friendly, Gregorian */
WJ.formatDate = function(dateStr){
  try{
    const d = new Date(dateStr);
    return d.toLocaleDateString("ur-IN-u-nu-latn", { day:"numeric", month:"long", year:"numeric" });
  }catch(e){ return dateStr; }
};
