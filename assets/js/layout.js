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
  <a href="${settings.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
  </a>
  <a href="${settings.social.twitter}" target="_blank" rel="noopener" aria-label="Twitter">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.65h2.039L6.486 3.24H4.298Z"/></svg>
  </a>
  <a href="${settings.social.youtube}" target="_blank" rel="noopener" aria-label="YouTube">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2s-.23-1.64-.94-2.36c-.9-.94-1.9-.94-2.36-1C17.06 2.5 12 2.5 12 2.5h-.01s-5.06 0-8.2.34c-.46.06-1.46.06-2.36 1C.72 4.56.5 6.2.5 6.2S.27 8.12.27 10.04v1.8c0 1.92.23 3.84.23 3.84s.23 1.64.93 2.36c.9.94 2.08.9 2.6 1 1.9.18 8 .24 8 .24s5.06-.01 8.2-.35c.46-.06 1.46-.06 2.36-1 .71-.72.94-2.36.94-2.36s.23-1.92.23-3.84v-1.8c0-1.92-.23-3.84-.23-3.84ZM9.75 14.85V7.35l6.5 3.75Z"/></svg>
  </a>
  <a href="${settings.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.9 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16Zm0 5.19a4.65 4.65 0 1 0 0 9.3 4.65 4.65 0 0 0 0-9.3Zm0 7.67a3.02 3.02 0 1 1 0-6.04 3.02 3.02 0 0 1 0 6.04Zm5.92-7.85a1.09 1.09 0 1 1-2.17 0 1.09 1.09 0 0 1 2.17 0Z"/></svg>
  </a>
</div>
        </div>
      </div>
    </div>

    <header class="masthead">
      <div class="container">
        <div style="width:110px" class="hide-mobile"></div>
        <a href="index.html" class="brand" style="justify-content:center;flex:1;">
          <div class="brand-text">
         <span style="font-size:36px; font-weight:bold; color:var(--maroon); display:block; text-align:center;">WEEKLY JANOON</span>
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
          <span style="font-size:24px; font-weight:bold; color:#fff; display:block; text-align:center;">WEEKLY JANOON</span>
            <p>${settings.taglineUr} — ${settings.tagline}. سرینگر سے شائع ہونے والا ایک آزاد ہفت روزہ اخبار، تازہ ترین اور معتبر خبریں فراہم کرنے کے عزم کے ساتھ۔</p>
           <div class="footer-social">
  <a href="${settings.social.facebook}" target="_blank" rel="noopener">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
  </a>
  <a href="${settings.social.twitter}" target="_blank" rel="noopener">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.65h2.039L6.486 3.24H4.298Z"/></svg>
  </a>
  <a href="${settings.social.youtube}" target="_blank" rel="noopener">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2s-.23-1.64-.94-2.36c-.9-.94-1.9-.94-2.36-1C17.06 2.5 12 2.5 12 2.5h-.01s-5.06 0-8.2.34c-.46.06-1.46.06-2.36 1C.72 4.56.5 6.2.5 6.2S.27 8.12.27 10.04v1.8c0 1.92.23 3.84.23 3.84s.23 1.64.93 2.36c.9.94 2.08.9 2.6 1 1.9.18 8 .24 8 .24s5.06-.01 8.2-.35c.46-.06 1.46-.06 2.36-1 .71-.72.94-2.36.94-2.36s.23-1.92.23-3.84v-1.8c0-1.92-.23-3.84-.23-3.84ZM9.75 14.85V7.35l6.5 3.75Z"/></svg>
  </a>
  <a href="${settings.social.instagram}" target="_blank" rel="noopener">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.9 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16Zm0 5.19a4.65 4.65 0 1 0 0 9.3 4.65 4.65 0 0 0 0-9.3Zm0 7.67a3.02 3.02 0 1 1 0-6.04 3.02 3.02 0 0 1 0 6.04Zm5.92-7.85a1.09 1.09 0 1 1-2.17 0 1.09 1.09 0 0 1 2.17 0Z"/></svg>
  </a>
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
