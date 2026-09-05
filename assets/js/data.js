/* =========================================================================
   DATA LAYER
   -------------------------------------------------------------------------
   Every page calls the functions on WJ.db below instead of touching
   Firestore directly.
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

/* ---------------- fallback settings (used only if Firestore settings doc is empty) ---------------- */
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
    let list = [];
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
        console.error("Firestore query failed:", e);
        list = [];
      }
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
    return null;
  },

  async searchArticles(q){
    q = (q||"").trim().toLowerCase();
    if (!q) return [];
    let list = [];
    if (window.firebaseEnabled){
      try{
        // Firestore has no native full-text search; fetch published set and filter client-side.
        const snap = await window.fb.db.collection("articles").where("status","==","published").get();
        list = snap.docs.map(d=>({id:d.id, ...d.data()}));
      }catch(e){ console.error(e); list = []; }
    }
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
    return [];
  }
};

/* date formatting: Urdu-friendly, Gregorian */
WJ.formatDate = function(dateStr){
  try{
    const d = new Date(dateStr);
    return d.toLocaleDateString("ur-IN-u-nu-latn", { day:"numeric", month:"long", year:"numeric" });
  }catch(e){ return dateStr; }
};