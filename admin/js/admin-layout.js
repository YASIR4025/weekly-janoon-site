/* =========================================================================
   ADMIN LAYOUT — sidebar nav + top bar, shared across every admin page.
   Also provides requireAuth(), used by every page except admin/index.html
   to redirect to login if nobody is signed in.
   ========================================================================= */

const ADMIN_NAV = [
  { href:"dashboard.html",       label:"ڈیش بورڈ",        icon:"📊" },
  { href:"articles.html",        label:"خبریں",           icon:"📰" },
  { href:"article-editor.html",  label:"نئی خبر شامل کریں", icon:"➕" },
  { href:"categories.html",      label:"زمرہ جات",         icon:"🗂️" },
  { href:"epaper.html",          label:"ای پیپر مینجمنٹ",  icon:"🗞️" },
  { href:"settings.html",        label:"سیٹنگز",          icon:"⚙️" }
];

function renderAdminShell(activePage){
  const page = document.location.pathname.split("/").pop();
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="admin-shell">
      <aside class="admin-sidebar">
        <div class="admin-brand">
          <div class="admin-brand-title">WEEKLY <span>JANOON</span></div>
          <div class="admin-brand-sub">ایڈمن پینل</div>
        </div>
        <nav class="admin-nav">
          ${ADMIN_NAV.map(item=>`
            <a href="${item.href}" class="${page===item.href?'active':''}">
              <span class="i">${item.icon}</span> ${item.label}
            </a>
          `).join("")}
        </nav>
        <div class="admin-sidebar-footer">
          <a href="../index.html" target="_blank">🔗 ویب سائٹ دیکھیں</a>
          <button id="adminLogoutBtn">🚪 لاگ آؤٹ</button>
        </div>
      </aside>
      <div class="admin-main">
        <header class="admin-topbar">
          <button id="adminSidebarToggle" class="admin-burger" aria-label="مینیو">☰</button>
          <div class="admin-topbar-title">${activePage||""}</div>
          <div class="admin-topbar-user" id="adminUserBadge"></div>
        </header>
        <div class="admin-content" id="adminContent"></div>
      </div>
    </div>
  `);

  document.getElementById("adminLogoutBtn").addEventListener("click", async ()=>{
    await WJ.admin.logout();
    location.href = "index.html";
  });
  document.getElementById("adminSidebarToggle").addEventListener("click", ()=>{
    document.querySelector(".admin-shell").classList.toggle("sidebar-open");
  });

  const email = WJ.admin.currentUserEmail();
  if (email) document.getElementById("adminUserBadge").textContent = "👤 " + email;
}

/** Call at the top of every protected admin page. Redirects to login if signed out,
 *  otherwise calls back(user) once auth state is known. */
function requireAuth(onReady){
  WJ.admin.onAuthChange(user=>{
    if (!user){
      location.href = "index.html";
      return;
    }
    onReady(user);
  });
}

function toast(msg, isError){
  let el = document.getElementById("wjToast");
  if (!el){
    el = document.createElement("div");
    el.id = "wjToast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = "wj-toast " + (isError ? "err" : "ok") + " show";
  clearTimeout(el._t);
  el._t = setTimeout(()=> el.classList.remove("show"), 3200);
}
