# WEEKLY JANOON — News / E-Paper Website

A complete, production-ready Urdu-language news website with a working admin CMS,
modeled on the structure of srinagarsamachar.net (masthead, category rails, breaking
ticker, e-paper viewer) but built as an original, client-ready product under the
**WEEKLY JANOON** brand ("Aapki Awaaz, Aapki Khabar").

Plain HTML/CSS/JS + Firebase — no build step, no npm required. Open `index.html`
in a browser and it works immediately in demo mode. Connect Firebase and it becomes
a real multi-user backend.

## What's included

**Public site** (RTL, Urdu-first, fully responsive):
- `index.html` — homepage: breaking ticker, lead story, latest-news rail, editorial box,
  YouTube box, then a cascading list of category sections (mirrors the reference site's layout)
- `article.html` — article detail page with related stories and social share
- `category.html` — paginated category listing
- `epaper.html` — page-by-page e-paper viewer + edition switcher + archive
- `search.html` — live keyword search across published articles
- `contact.html` — contact form (wired to mailto by default; swap in a form
  backend of your choice — see "Contact form" below)
- `404.html`

**Admin panel** (English, LTR dashboard UI) — under `/admin/`:
- `index.html` — login
- `dashboard.html` — stats + recent articles
- `articles.html` — full article list with filters, edit/delete
- `article-editor.html` — add/edit article: title, excerpt, multi-paragraph content,
  category, author, date, featured image upload, breaking/featured/trending flags,
  draft or publish
- `categories.html` — add/edit/delete categories, toggle menu visibility
- `epaper.html` — upload new e-paper editions (multi-image page upload), manage archive
- `settings.html` — site name, tagline, contact info, social links

## How it runs right now (demo mode)

Every page checks `window.firebaseEnabled`. Until you add real Firebase keys, the
whole site — public pages **and** the admin panel — runs on:
- Public site: the sample articles/e-papers in `assets/js/data.js`
- Admin panel: a `localStorage`-backed store seeded from the same data, so every
  admin feature (add/edit/delete/publish/upload) is fully clickable and testable
  in the browser before you connect a real backend.

Demo admin login: **admin@weeklyjanoon.com** / **demo12345**

This means you can preview and demo the entire product to a client today, with
zero setup.

## Going live: connect Firebase (15–20 minutes)

1. Go to https://console.firebase.google.com → **Add project** → name it (e.g. "weekly-janoon").
2. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable.**
   Then **Users → Add user** and create your admin's email + password.
3. **Build → Firestore Database → Create database** → start in **production mode**.
4. **Build → Storage → Get started** (for uploaded images/e-paper pages).
5. **Project settings → General → Your apps → Add app → Web (</>)** → register the app
   → copy the `firebaseConfig` object it gives you.
6. Paste those values into `assets/js/firebase-config.js`, replacing the `YOUR_...`
   placeholders. Save. Reload the site — `window.firebaseEnabled` will now be `true`
   and every page automatically switches from demo data to live Firestore/Storage.
7. Log into `/admin/` with the email/password you created in step 2, and publish your
   first real article — it will now appear on the live public site for every visitor.

### Firestore security rules

In **Firestore → Rules**, use:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /articles/{doc} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null;
    }
    match /categories/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /epapers/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /settings/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

This lets any visitor read published content, but only a signed-in admin can write.

### Storage security rules

In **Storage → Rules**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### One-time data seeding (optional)

The site works fine if you just start publishing fresh articles from the admin
panel — you don't have to import the demo content. If you'd like the demo
articles/categories as a starting point in Firestore, you can copy the arrays
in `assets/js/data.js` (`WJ.DEMO_ARTICLES`, `WJ.CATEGORIES`, `WJ.DEMO_EPAPERS`)
into Firestore manually via the console, or write a small one-off script using
the Firebase Admin SDK.

## Deployment

This is a static site — deploy it anywhere that serves static files:

**Firebase Hosting (recommended, same project as your backend):**
```
npm install -g firebase-tools
firebase login
firebase init hosting     # choose this project, public dir = "." , single-page app = No
firebase deploy
```

**Or:** Netlify / Vercel / GitHub Pages / any static host — just upload the folder as-is.
No build step needed.

## Replacing placeholder assets

- All demo photos use `https://picsum.photos/...` placeholders — replace with real
  photography once you have it (admin panel image upload handles this per-article).
- The site currently uses text-based social icons (f / X / Y / IG) and a plain
  wordmark instead of a logo file. Drop a real logo file in and update the `.brand`
  block in `assets/js/layout.js` if the client provides branded artwork.
- Update `assets/js/data.js` → `WJ.DEMO_SETTINGS` and/or the live Settings page with
  the client's real contact details and social URLs.

## Contact form note

The contact form currently opens the visitor's email client via a `mailto:` link
(no backend needed, always works). If you want form submissions saved to Firestore
or emailed automatically, that's a small addition once Firebase is connected —
happy to wire that up on request.

## Categories included

اہم خبریں (Top News) · سرینگر و کشمیر (Srinagar/Kashmir) · علاقائی (Local) ·
قومی (National) · بین الاقوامی (International) · سیاست (Politics) · کھیل (Sports) ·
کاروبار (Business) · تفریح (Entertainment) · سائنس و ٹیکنالوجی (Technology) ·
تعلیم (Education) · صحت (Health) · اداریہ (Editorial)

All manageable (add/rename/hide/delete) from Admin → Categories.
