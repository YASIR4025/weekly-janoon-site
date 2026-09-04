/* =========================================================================
   SHARED LAYOUT — header, nav, breaking ticker, footer
   Injected into #site-header / #site-footer on every public page.
   ========================================================================= */

function navItemsHtml(activeSlug){
  const items = WJ.CATEGORIES.filter(c=>c.showInNav);
  return items.map(c=>{
    const active = c.slug===activeSlug ? "active" : "";
    return `<li class="${active}"><a href="category.html?cat=${c.slug}">${c.name}</a></li>`;
  }).join("");
}

async function renderHeader(activeSlug){
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const settings = await WJ.db.getSettings();
  mount.innerHTML = `
    <div class="skip-link"><a href="#main">مواد پر جائیں</a></div>
    <div class="topbar">
      <div class="container">
        <div class="topbar-date">${new Date().toLocaleDateString("en-GB",{weekday:"long", day:"numeric", month:"long", year:"numeric"})}</div>
        <div class="topbar-links">
          <span class="hide-mobile"><a href="contact.html">ہم سے رابطہ کریں</a></span>
          <a href="epaper.html" style="color:#f3d98a;font-weight:700;">E-PAPER</a>
          <div class="social-icons">
            <a href="${settings.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">f</a>
            <a href="${settings.social.twitter}" target="_blank" rel="noopener" aria-label="Twitter">X</a>
            <a href="${settings.social.youtube}" target="_blank" rel="noopener" aria-label="YouTube">Y</a>
            <a href="${settings.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">IG</a>
          </div>
        </div>
      </div>
    </div>

    <header class="masthead">
      <div class="container">
        <div style="width:110px" class="hide-mobile"></div>
        <a href="index.html" class="brand" style="justify-content:center;flex:1;">
          <div class="brand-text">
           <div class="brand-title-wrap" style="display:flex; justify-content:space-between; align-items:center; width:100%;">
  <span style="font-size:24px; font-weight:bold;">WEEKLY JANOON</span>
  <span style="font-size:36px; font-family:'Noto Nastaliq Urdu', serif;">جنون</span>
</div>
            <div class="brand-tagline">${settings.taglineUr} <span style="opacity:.6">— ${settings.tagline}</span></div>
          </div>
        </a>
        <div class="masthead-meta">
          <div class="masthead-edition">ہفتہ وار ای پیپر دستیاب ہے</div>
          <form class="masthead-search" action="search.html" method="get">
            <input type="search" name="q" placeholder="خبر تلاش کریں...">
            <button type="submit" aria-label="تلاش">🔍</button>
          </form>
        </div>
      </div>
    </header>

    <nav class="primary-nav" aria-label="بنیادی مینیو">
      <div class="container">
        <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navList">☰</button>
        <ul class="nav-list" id="navList">
          <li class="${!activeSlug ? "active":""}"><a href="index.html">صفحہ اوّل</a></li>
          ${navItemsHtml(activeSlug)}
          <li><a href="epaper.html" style="background:var(--maroon-2)">E-PAPER</a></li>
        </ul>
      </div>
    </nav>

    <div class="ticker">
      <div class="container">
        <span class="ticker-tag">اہم خبریں</span>
        <div class="ticker-track" id="tickerTrack"><ul id="tickerList"></ul></div>
      </div>
    </div>
  `;

  document.getElementById("navToggle").addEventListener("click", ()=>{
    const list = document.getElementById("navList");
    const open = list.classList.toggle("open");
    document.getElementById("navToggle").setAttribute("aria-expanded", open);
  });

  WJ.db.getArticles({breaking:true, limit:10}).then(items=>{
    if (!items.length) items = WJ.DEMO_ARTICLES.slice(0,6);
    const list = document.getElementById("tickerList");
    list.innerHTML = items.map(a=>`<li><a href="article.html?slug=${a.slug}">${a.title}</a></li>`).join("");
  });
}

async function renderFooter(){
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  const settings = await WJ.db.getSettings();
  const cats = WJ.CATEGORIES.filter(c=>c.showInNav).slice(0,6);
  mount.innerHTML = `
    <footer class="site-footer">
      <div class="footer-top container">
        <div class="footer-grid">
          <div class="footer-col footer-brand">
           <div class="brand-title-wrap" style="display:flex; justify-content:space-between; align-items:center; width:100%;">
  <span style="font-size:24px; font-weight:bold;">WEEKLY JANOON</span>
  <span style="font-size:36px; font-family:'Noto Nastaliq Urdu', serif;">جنون</span>
</div>
            <p>${settings.taglineUr} — ${settings.tagline}. سرینگر سے شائع ہونے والا ایک آزاد ہفت روزہ اخبار، تازہ ترین اور معتبر خبریں فراہم کرنے کے عزم کے ساتھ۔</p>
            <div class="footer-social">
              <a href="${settings.social.facebook}" target="_blank" rel="noopener">f</a>
              <a href="${settings.social.twitter}" target="_blank" rel="noopener">X</a>
              <a href="${settings.social.youtube}" target="_blank" rel="noopener">Y</a>
              <a href="${settings.social.instagram}" target="_blank" rel="noopener">IG</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>اہم زمرے</h4>
            <ul>${cats.map(c=>`<li><a href="category.html?cat=${c.slug}">${c.name}</a></li>`).join("")}</ul>
          </div>
          <div class="footer-col">
            <h4>رسائی</h4>
            <ul>
              <li><a href="index.html">صفحہ اوّل</a></li>
              <li><a href="epaper.html">ای پیپر</a></li>
              <li><a href="search.html">تلاش</a></li>
              <li><a href="contact.html">رابطہ</a></li>
              <li><a href="admin/index.html">ایڈمن لاگ ان</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>رابطہ کی تفصیلات</h4>
            <ul>
              <li>${settings.contactAddress}</li>
              <li style="direction:ltr;text-align:right">${settings.contactPhone}</li>
              <li style="direction:ltr;text-align:right">${settings.contactEmail}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">© ${new Date().getFullYear()} Weekly Janoon. All Rights Reserved.</div>
    </footer>
  `;
}

function storyMetaHtml(a){
  return `<span>${WJ.formatDate(a.date)}</span><span>${WJ.catName(a.category)}</span><span>${a.author||""}</span>`;
}
