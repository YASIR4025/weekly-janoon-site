const firebaseConfig = {
  apiKey: "AIzaSyBYIlX-4q2IrylmlRJrgiwz6X7SoQ-B0S4",
  authDomain: "weekly-janoon-652ad.firebaseapp.com",
  projectId: "weekly-janoon-652ad",
  storageBucket: "weekly-janoon-652ad.firebasestorage.app",
  messagingSenderId: "873167354305",
  appId: "1:873167354305:web:9fa0fe25012b2a78551740"
};

window.firebaseEnabled = false;
window.fb = { app: null, auth: null, db: null, storage: null };

(function initFirebase(){
  const isConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_");
  if (!isConfigured) {
    console.info("[Weekly Janoon] Firebase is not configured yet — running on demo data. See assets/js/firebase-config.js");
    return;
  }
  try {
    firebase.initializeApp(firebaseConfig);
    window.fb.app = firebase.app();
    window.fb.auth = firebase.auth();
    window.fb.db = firebase.firestore();
    window.fb.storage = firebase.storage();
    window.firebaseEnabled = true;
    console.log("[Weekly Janoon] Firebase initialized successfully");
  } catch (err) {
    console.error("[Weekly Janoon] Firebase failed to initialize, falling back to demo data.", err);
    window.firebaseEnabled = false;
  }
})();