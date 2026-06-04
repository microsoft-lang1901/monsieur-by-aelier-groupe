/* ============================================================
   MONSIEUR — shared web chrome
   <div id="m-header" data-active="collections"></div>
   <div id="m-footer"></div>
   ============================================================ */
(function () {
  const ward = JSON.parse(localStorage.getItem('m-wardrobe') || '[]');
  const head = document.getElementById('m-header');
  const active = head ? (head.dataset.active || '') : '';
  const dark = head ? head.dataset.theme === 'dark' : false;

  const MARK = (cls='') => `
    <a class="mark ${cls}" href="home.html">
      <span class="word">monsieur</span>
      <span class="by">by Aelier Groupe</span>
    </a>`;

  const NAV = [
    ['collections','Collections','collections.html','The seasonal soul of the house'],
    ['materials','Materials','materials.html','The world\u2019s finest natural fibres'],
    ['mtm','Made to Measure','made-to-measure.html','Crafted uniquely to you'],
    ['wardrobe','Wardrobe','wardrobe.html','Your personal archive of pieces'],
    ['house','The House','house.html','The story of Aelier Groupe'],
  ];

  function drawerNav() {
    return NAV.map(([k,label,href,desc],i) => `
      <a href="${href}" class="${active===k?'active':''}">
        <span class="d-idx">0${i+1}</span>
        <span class="d-main">${label}<em>${desc}</em></span>
        <span class="d-arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      </a>`).join('');
  }

  if (head) {
    if (dark) head.classList.add('head-dark');
    head.innerHTML = `
      <div class="m-ann">A digital experience as refined as what we create · <em>Curated. Personal. Timeless.</em></div>
      <header class="m-head">
        <div class="wrap bar">
          <button class="m-menu" id="m-menu-btn" aria-label="Menu">
            <span class="mln"><i></i><i></i><i></i></span><span class="mlt">Menu</span>
          </button>
          ${MARK(dark ? 'on-dark' : '')}
          <div class="m-right">
            <button class="m-ico" id="m-search-btn" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
            </button>
            <a class="m-ico" href="wardrobe.html" aria-label="Wardrobe" style="position:relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3a3 3 0 0 0-3 3v1H5l-1 14h16L19 7h-4V6a3 3 0 0 0-3-3Z"/></svg>
              <span class="m-badge" id="m-ward-badge"${ward.length?'':' hidden'}>${ward.length}</span>
            </a>
            <a class="m-ico" href="dossier.html" aria-label="Account">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
            </a>
          </div>
        </div>
      </header>
      <div class="m-drawer" id="m-drawer">
        <div class="m-scrim" id="m-scrim"></div>
        <aside class="m-panel">
          <div class="m-panel-top">
            ${MARK('left')}
            <button class="m-close" id="m-close" aria-label="Close">&times;</button>
          </div>
          <nav class="m-dnav">${drawerNav()}</nav>
          <div class="m-dsec">
            <h6>The Atelier</h6>
            <a href="made-to-measure.html">Book a Fitting</a>
            <a href="dossier.html">Private Client Dossier</a>
            <a href="house.html">Craftsmanship &amp; Provenance</a>
            <a href="house.html#contact">Client Services</a>
          </div>
          <div class="m-dfoot">
            <a href="made-to-measure.html" class="btn btn-dark btn-block">Begin Made to Measure</a>
            <div class="m-dcoord">Curated · Personal · Timeless</div>
          </div>
        </aside>
      </div>`;

    document.getElementById('m-search-btn').addEventListener('click', openSearch);
    const dr = document.getElementById('m-drawer');
    const open = () => { dr.classList.add('open'); document.body.style.overflow='hidden'; };
    const close = () => { dr.classList.remove('open'); document.body.style.overflow=''; };
    document.getElementById('m-menu-btn').addEventListener('click', open);
    document.getElementById('m-close').addEventListener('click', close);
    document.getElementById('m-scrim').addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key==='Escape') close(); });
  }

  const foot = document.getElementById('m-footer');
  if (foot) {
    foot.innerHTML = `
    <footer class="foot">
      <div class="wrap">
        <div class="fgrid">
          <div class="fcol fintro">
            ${MARK('on-dark left')}
            <p>A digital experience as refined as what we create. Exceptional materials, expert craftsmanship, and a personal service built to last a lifetime.</p>
          </div>
          <div class="fcol"><h5>Maison</h5><a href="collections.html">Collections</a><a href="materials.html">Material Library</a><a href="made-to-measure.html">Made to Measure</a><a href="house.html">The House</a></div>
          <div class="fcol"><h5>Client</h5><a href="dossier.html">Private Client Dossier</a><a href="wardrobe.html">Wardrobe Archive</a><a href="house.html#contact">Client Services</a><a href="made-to-measure.html">Book a Fitting</a></div>
          <div class="fcol"><h5>The House</h5><a href="house.html">Our Story</a><a href="house.html">Craftsmanship</a><a href="house.html">Provenance</a><a href="house.html#contact">Contact</a></div>
        </div>
        <div class="fbase">
          <span>© 2026 Monsieur · by Aelier Groupe</span>
          <span class="ital">Curated. Personal. Timeless.</span>
          <span>Terms · Privacy · Provenance</span>
        </div>
      </div>
    </footer>`;
  }

  function openSearch(){
    let o = document.getElementById('m-search-ov');
    if (!o) {
      o = document.createElement('div'); o.id = 'm-search-ov';
      o.innerHTML = `
        <div class="m-search-in">
          <button class="m-search-x" aria-label="Close">&times;</button>
          <span class="eyebrow">Material Search</span>
          <form><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
            <input type="text" placeholder="Search materials, fibres, qualities\u2026" autocomplete="off" /></form>
          <div class="m-search-tags"><span>Cashmere</span><span>Tropical Wool</span><span>Linen</span><span>Vicu\u00f1a</span><span>Sea Island Cotton</span><span>Made to Measure</span></div>
        </div>`;
      document.body.appendChild(o);
      o.querySelector('.m-search-x').onclick = () => o.classList.remove('open');
      o.onclick = e => { if (e.target===o) o.classList.remove('open'); };
      o.querySelector('form').onsubmit = e => { e.preventDefault(); const q=o.querySelector('input').value.trim(); location.href='materials.html'+(q?'?q='+encodeURIComponent(q):''); };
      o.querySelectorAll('.m-search-tags span').forEach(s => s.onclick = () => location.href='materials.html?q='+encodeURIComponent(s.textContent));
      document.addEventListener('keydown', e => { if (e.key==='Escape') o.classList.remove('open'); });
    }
    o.classList.add('open'); setTimeout(()=>o.querySelector('input').focus(),60);
  }
})();

/* ---- global wardrobe + toast ---- */
window.MN = {
  getWard: () => JSON.parse(localStorage.getItem('m-wardrobe') || '[]'),
  inWard(id){ return this.getWard().some(x => x.id === id); },
  addWard(item){
    const list = this.getWard();
    if (list.find(x => x.id === item.id)) { toast(`“${item.name}” is already in your wardrobe`); return false; }
    list.push(item); localStorage.setItem('m-wardrobe', JSON.stringify(list));
    refreshWard(list.length); toast(`Added “${item.name}” to your wardrobe`); return true;
  },
  removeWard(id){ const list = this.getWard().filter(x => x.id !== id); localStorage.setItem('m-wardrobe', JSON.stringify(list)); refreshWard(list.length); return list; },
};
function refreshWard(n){ const b=document.getElementById('m-ward-badge'); if(b){ b.textContent=n; if(n) b.removeAttribute('hidden'); else b.setAttribute('hidden',''); } }
function toast(msg){
  let t=document.getElementById('m-toast');
  if(!t){ t=document.createElement('div'); t.id='m-toast'; document.body.appendChild(t); }
  t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12l5 5L20 6"/></svg> ${msg}`;
  t.classList.add('show'); clearTimeout(window.__mt); window.__mt=setTimeout(()=>t.classList.remove('show'),2600);
}
window.toast = toast;
