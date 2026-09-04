/* =========================================================================
   ADMIN DATA + AUTH LAYER
   -------------------------------------------------------------------------
   Same dual-mode pattern as the public site's assets/js/data.js:
     - window.firebaseEnabled === true  -> real Firebase Auth + Firestore + Storage
     - otherwise                        -> a localStorage-backed demo store,
       seeded from the same WJ.DEMO_ARTICLES / WJ.DEMO_EPAPERS you see on the
       public site, so the admin panel is fully clickable before you wire up
       a real backend. Demo login: admin@weeklyjanoon.com / demo12345
   ========================================================================= */

window.WJ = window.WJ || {};
const LS_KEY = "wj_demo_db_v1";
const LS_AUTH = "wj_demo_admin_auth";
const DEMO_ADMIN = { email: "admin@weeklyjanoon.com", password: "demo12345" };

function loadLocalDb(){
  const raw = localStorage.getItem(LS_KEY);
  if (raw){ try{ return JSON.parse(raw); }catch(e){} }
  const seeded = {
    articles: WJ.DEMO_ARTICLES.map(a=>({...a})),
    categories: WJ.CATEGORIES.map(c=>({...c})),
    epapers: WJ.DEMO_EPAPERS.map(e=>({...e})),
    settings: {...WJ.DEMO_SETTINGS}
  };
  localStorage.setItem(LS_KEY, JSON.stringify(seeded));
  return seeded;
}
function saveLocalDb(db){ localStorage.setItem(LS_KEY, JSON.stringify(db)); }
function uid(prefix){ return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

WJ.admin = {

  /* ---------------- auth ---------------- */
  async login(email, password){
    if (window.firebaseEnabled){
      await window.fb.auth.signInWithEmailAndPassword(email, password);
      return true;
    }
    if (email===DEMO_ADMIN.email && password===DEMO_ADMIN.password){
      sessionStorage.setItem(LS_AUTH, email);
      return true;
    }
    throw new Error("غلط ای میل یا پاس ورڈ۔ ڈیمو موڈ میں لاگ ان: admin@weeklyjanoon.com / demo12345");
  },

  async logout(){
    if (window.firebaseEnabled){ await window.fb.auth.signOut(); return; }
    sessionStorage.removeItem(LS_AUTH);
  },

  onAuthChange(cb){
    if (window.firebaseEnabled){
      window.fb.auth.onAuthStateChanged(user => cb(user ? {email:user.email} : null));
      return;
    }
    const email = sessionStorage.getItem(LS_AUTH);
    cb(email ? {email} : null);
  },

  currentUserEmail(){
    if (window.firebaseEnabled){ return window.fb.auth.currentUser ? window.fb.auth.currentUser.email : null; }
    return sessionStorage.getItem(LS_AUTH);
  },

  /* ---------------- articles ---------------- */
  async listArticles(){
    if (window.firebaseEnabled){
      const snap = await window.fb.db.collection("articles").orderBy("date","desc").get();
      return snap.docs.map(d=>({id:d.id, ...d.data()}));
    }
    return loadLocalDb().articles.sort((a,b)=> new Date(b.date)-new Date(a.date));
  },

  async getArticle(id){
    if (window.firebaseEnabled){
      const doc = await window.fb.db.collection("articles").doc(id).get();
      return doc.exists ? {id:doc.id, ...doc.data()} : null;
    }
    return loadLocalDb().articles.find(a=>a.id===id) || null;
  },

  async saveArticle(data, id){
    // data: {title, slug, category, excerpt, content(array of paragraphs), image, author,
    //         status, featured, breaking, trending, date}
    if (window.firebaseEnabled){
      if (id){
        await window.fb.db.collection("articles").doc(id).set(data, {merge:true});
        return id;
      }
      const ref = await window.fb.db.collection("articles").add({...data, views:0});
      return ref.id;
    }
    const db = loadLocalDb();
    if (id){
      const idx = db.articles.findIndex(a=>a.id===id);
      if (idx>-1) db.articles[idx] = {...db.articles[idx], ...data};
    } else {
      id = uid("art");
      db.articles.unshift({id, views:0, ...data});
    }
    saveLocalDb(db);
    return id;
  },

  async deleteArticle(id){
    if (window.firebaseEnabled){
      await window.fb.db.collection("articles").doc(id).delete();
      return;
    }
    const db = loadLocalDb();
    db.articles = db.articles.filter(a=>a.id!==id);
    saveLocalDb(db);
  },

  /* ---------------- categories ---------------- */
  async listCategories(){
    if (window.firebaseEnabled){
      const snap = await window.fb.db.collection("categories").orderBy("order","asc").get();
      return snap.docs.map(d=>({id:d.id, ...d.data()}));
    }
    return loadLocalDb().categories;
  },

  async saveCategory(data, id){
    if (window.firebaseEnabled){
      if (id){ await window.fb.db.collection("categories").doc(id).set(data,{merge:true}); return id; }
      const ref = await window.fb.db.collection("categories").add(data);
      return ref.id;
    }
    const db = loadLocalDb();
    if (id){
      const idx = db.categories.findIndex(c=>c.slug===id || c.id===id);
      if (idx>-1) db.categories[idx] = {...db.categories[idx], ...data};
    } else {
      db.categories.push({id:uid("cat"), ...data});
    }
    saveLocalDb(db);
    return id;
  },

  async deleteCategory(id){
    if (window.firebaseEnabled){ await window.fb.db.collection("categories").doc(id).delete(); return; }
    const db = loadLocalDb();
    db.categories = db.categories.filter(c=>c.slug!==id && c.id!==id);
    saveLocalDb(db);
  },

  /* ---------------- e-papers ---------------- */
  async listEpapers(){
    if (window.firebaseEnabled){
      const snap = await window.fb.db.collection("epapers").orderBy("date","desc").get();
      return snap.docs.map(d=>({id:d.id, ...d.data()}));
    }
    return loadLocalDb().epapers.sort((a,b)=> new Date(b.date)-new Date(a.date));
  },

  async saveEpaper(data, id){
    if (window.firebaseEnabled){
      if (id){ await window.fb.db.collection("epapers").doc(id).set(data,{merge:true}); return id; }
      const ref = await window.fb.db.collection("epapers").add(data);
      return ref.id;
    }
    const db = loadLocalDb();
    if (id){
      const idx = db.epapers.findIndex(e=>e.id===id);
      if (idx>-1) db.epapers[idx] = {...db.epapers[idx], ...data};
    } else {
      id = uid("ep");
      db.epapers.unshift({id, ...data});
    }
    saveLocalDb(db);
    return id;
  },

  async deleteEpaper(id){
    if (window.firebaseEnabled){ await window.fb.db.collection("epapers").doc(id).delete(); return; }
    const db = loadLocalDb();
    db.epapers = db.epapers.filter(e=>e.id!==id);
    saveLocalDb(db);
  },

  /* ---------------- settings ---------------- */
  async getSettings(){
    if (window.firebaseEnabled){
      const doc = await window.fb.db.collection("settings").doc("site").get();
      return doc.exists ? doc.data() : WJ.DEMO_SETTINGS;
    }
    return loadLocalDb().settings;
  },

  async saveSettings(data){
    if (window.firebaseEnabled){
      await window.fb.db.collection("settings").doc("site").set(data, {merge:true});
      return;
    }
    const db = loadLocalDb();
    db.settings = {...db.settings, ...data};
    saveLocalDb(db);
  },

  /* ---------------- image upload ---------------- */
  async uploadImage(file, pathHint){
    if (window.firebaseEnabled){
      const ref = window.fb.storage.ref().child(`uploads/${Date.now()}_${file.name}`);
      const snap = await ref.put(file);
      return await snap.ref.getDownloadURL();
    }
    // Demo mode: inline the image as a data URL (fine for previewing; real
    // deployments should configure Firebase Storage — see README).
    return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = ()=> resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

function slugify(text){
  return text.toString().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/--+/g, "-")
    .toLowerCase()
    .slice(0, 80) || uid("post");
}
WJ.slugify = slugify;
