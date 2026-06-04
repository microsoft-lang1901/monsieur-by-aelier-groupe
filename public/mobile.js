/* ============================================================
   MONSIEUR — mobile app: screens + router
   ============================================================ */
const isDark = t => t.includes('navy')||t.includes('black')||t.includes('charcoal')||t.includes('brown')||t.includes('olive');
const cls = t => (isDark(t)?'photo ':'tex ') + t;
const WKEY = 'm-wardrobe';
const getWard = () => window.Backend ? window.Backend.getWardrobe() : JSON.parse(localStorage.getItem(WKEY) || '[]');
const setWard = list => localStorage.setItem(WKEY, JSON.stringify(list));
const inWard = id => getWard().some(x=>x.id===id);
function addWard(g){ const item={...g}; if(window.Backend){ const r=window.Backend.addWardrobe(item); mtoast(r.alreadySaved?'Already in your wardrobe':'Added to your wardrobe'); return; } const l=getWard(); if(l.find(x=>x.id===g.id)){ mtoast('Already in your wardrobe'); return; } l.push(item); setWard(l); mtoast('Added to your wardrobe'); }
function rmWard(id){ if(window.Backend){ window.Backend.removeWardrobe(id); return; } setWard(getWard().filter(x=>x.id!==id)); }

const SCREENS = [
  ['home','Homepage Hero','A warm welcome into natural luxury.'],
  ['collections','Material Library','Discover premium materials & qualities.'],
  ['product','Product Detail','Craftsmanship, fit and thoughtful details.'],
  ['search','Material Search','Find the perfect fabric for your needs.'],
  ['wardrobe','Wardrobe Archive','Saved pieces & styling inspiration.'],
  ['dossier','Private Client Dossier','Your journey, preferences and activity.'],
  ['checkout','Checkout','A seamless and secure journey.'],
  ['passport','Fibre Passport','Transparency on origin & composition.'],
  ['mtm','Made to Measure','Personalised sizing for a perfect fit.'],
  ['complete','Complete Experience','Everything at your fingertips.'],
];

/* ---- chrome pieces ---- */
const SIG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 8.5C7 4 17 4 22 8.5"/><path d="M5 12c4-3.2 10-3.2 14 0" opacity=".75"/><path d="M8.5 15.4c2.2-1.7 4.8-1.7 7 0" opacity=".5"/></svg>';
function statusbar(photo){
  return `<div class="sbar ${photo?'on-photo':''}">
    <span class="time">9:41</span>
    <span class="si">
      <svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="13" width="3" height="6" rx="1"/><rect x="7" y="9" width="3" height="10" rx="1"/><rect x="12" y="5" width="3" height="14" rx="1"/><rect x="17" y="2" width="3" height="17" rx="1" opacity=".4"/></svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 8.5C7 4 17 4 22 8.5M5 12c4-3.2 10-3.2 14 0M8.5 15.4c2.2-1.7 4.8-1.7 7 0"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/></svg>
      <svg viewBox="0 0 28 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="8" width="20" height="9" rx="2.5"/><rect x="4" y="10" width="14" height="5" rx="1" fill="currentColor"/><path d="M24 11v3" stroke-linecap="round"/></svg>
    </span></div>`;
}
function appbarMark({photo,back,right}={}){
  return `<div class="abar ${photo?'on-photo':''}">
    <div class="ab-l">${back?`<button class="ab-btn" data-go="${back}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 6l-6 6 6 6"/></svg></button>`:`<button class="ab-btn" data-menu><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>`}</div>
    <div class="ab-mark"><div class="w">monsieur</div><div class="b">by Aelier Groupe</div></div>
    <div class="ab-r">${right||`<button class="ab-btn" data-go="wardrobe"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></svg></button>`}</div>
  </div>`;
}
function appbarTitle(title, back='home'){
  return `<div class="abar bordered">
    <div class="ab-l"><button class="ab-btn" data-go="${back}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 6l-6 6 6 6"/></svg></button></div>
    <div class="ab-mark"><span class="ab-title">${title}</span></div>
    <div class="ab-r"></div></div>`;
}
function tabbar(active, dark){
  const tabs = [
    ['home','Home','<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5"/>'],
    ['collections','Collections','<path d="M5 4h6v16H5zM13 4h6v16h-6"/>'],
    ['search','Search','<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'],
    ['wardrobe','Wardrobe','<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>'],
    ['dossier','Account','<circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>'],
  ];
  const wn = getWard().length;
  return `<div class="tabbar ${dark?'on-dark':''}">${tabs.map(([id,label,p])=>`
    <button class="tab ${active===id?'on':''}" data-go="${id}" style="position:relative">
      ${id==='wardrobe'&&wn?`<span class="badge2">${wn}</span>`:''}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${p}</svg><span>${label}</span>
    </button>`).join('')}</div>`;
}

/* ---- screens ---- */
const S = {};

S.home = () => `
  ${statusbar(true)}
  ${appbarMark({photo:true, right:`<button class="ab-btn" data-go="wardrobe"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></svg></button>`})}
  <div class="vp flush"><div class="mhero">
    <div class="photo"></div><div class="veil"></div>
    <div class="mh-in">
      <div class="mh-eye">A digital experience, refined</div>
      <h1>Timeless by nature.<br /><em>Made for you.</em></h1>
      <p>A warm welcome into the world of natural luxury.</p>
      <button class="mbtn mbtn-cream" data-go="collections" style="margin-bottom:11px;">Discover Collection</button>
      <button class="mbtn mbtn-ghost-l" data-go="mtm">Made to Measure</button>
    </div>
  </div></div>
  ${tabbar('home')}`;

S.collections = () => `
  ${statusbar()} ${appbarMark({})}
  <div class="vp"><div class="s-pad">
    <div class="s-eyebrow">Material Library</div>
    <div class="s-title">Material Library</div>
    <p class="s-intro">Explore the world's finest natural fibres. Each material is selected for its character, performance and timeless quality.</p>
    <div class="mmat" style="margin-top:20px;">${MATERIALS.slice(0,6).map(m=>`
      <div class="mc" data-go="product"><div class="tex ${m.tone}"></div><div class="ov"></div>
        <div class="cap"><b>${m.name}</b><span>${m.line}</span></div></div>`).join('')}</div>
  </div></div>
  ${tabbar('collections')}`;

S.product = () => { const g = findGarment('silk-cashmere-rollneck'); const tones=['t-cashmere','t-stone','t-ivory','t-camel']; return `
  ${statusbar()}
  ${appbarMark({back:'collections', right:`<button class="ab-btn" data-fav><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20s-7-4.4-9.2-8.4C1 8 2.6 4.8 6 4.8c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.4 0 5 3.2 3.2 6.8C19 15.6 12 20 12 20Z"/></svg></button><button class="ab-btn" data-go="checkout"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></svg></button>`})}
  <div class="vp">
    <div class="mp-stage"><div class="tx photo t-cashmere" id="mpStage"></div>
      <div class="mp-thumbs">${tones.map((t,i)=>`<div class="th ${i===0?'on':''}" data-tone="${t}"><div class="tx tex ${t}"></div></div>`).join('')}</div>
    </div>
    <div class="mp-info">
      <div class="house">Knitwear</div>
      <h2>Silk Cashmere Rollneck</h2>
      <div class="sub">Ivory · 70% Silk · 30% Cashmere</div>
      <div class="price">${fmtPrice(g.price)}</div>
      <div class="mtabs"><button class="mtab on" data-mt="d">Description</button><button class="mtab" data-mt="x">Details</button><button class="mtab" data-mt="c">Care</button><button class="mtab" data-mt="v">Delivery</button></div>
      <div id="mpTab"><p class="mp-desc">An icon of understated luxury. Crafted from a premium blend of silk and cashmere for exceptional softness, lightness and warmth.</p></div>
      <div class="s-eyebrow" style="margin:20px 0 10px;">Select Size</div>
      <div class="msizes">${['S','M','L','XL'].map((s,i)=>`<div class="msize ${i===1?'on':''}" data-sz="${s}">${s}</div>`).join('')}</div>
      <a data-go="passport" class="mlink" style="margin:4px 0 4px;">View Fibre Passport →</a>
    </div>
  </div>
  <div class="s-action"><button class="mbtn mbtn-dark" data-add="${g.id}">Add to Wardrobe</button></div>`; };

S.search = () => `
  ${statusbar()} ${appbarTitle('Material Search','collections')}
  <div class="vp"><div class="s-pad">
    <div class="msearch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input placeholder="Search materials, fibres, qualities…" /></div>
    <div class="mfilters">${['Natural Fibres','Warm','Lightweight','Cool'].map((f,i)=>`<span class="mfilter ${i===0?'on':''}">${f}</span>`).join('')}</div>
    <div class="s-eyebrow" style="margin:18px 0 4px;">Recommended Materials</div>
    <div>${MATERIALS.slice(0,5).map(m=>`
      <div class="mmatrow" data-go="product"><span class="sw"><span class="tex ${m.tone}"></span></span>
        <div class="mt"><b>${m.name}</b><span>${m.desc}</span></div></div>`).join('')}</div>
  </div></div>
  ${tabbar('search')}`;

S.wardrobe = () => { const w=getWard(); const seed=GARMENTS.slice(0,3); const saved = w.length?w:seed.map(g=>({id:g.id,name:g.name,tone:g.tone,price:g.price})); const expr=GARMENTS.slice(3,7); return `
  ${statusbar()} ${appbarMark({})}
  <div class="vp"><div class="s-pad">
    <div class="s-eyebrow">Wardrobe Archive</div>
    <div class="s-title">Wardrobe Archive</div>
    <p class="s-intro">Your saved pieces. A personal archive of timeless garments and future expressions.</p>
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin:24px 0 12px;">
      <span class="s-eyebrow">Saved Pieces</span><span class="mlink" style="margin:0;" data-go="collections">View All</span></div>
    <div class="msaved">${saved.slice(0,3).map(s=>`
      <div class="mtile" data-go="product"><div class="ph"><div class="tx ${cls(s.tone)}"></div></div><div class="nm">${s.name}</div><div class="pr">${fmtPrice(s.price)}</div></div>`).join('')}</div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin:26px 0 12px;">
      <span class="s-eyebrow">Complete the Expression</span><span class="mlink" style="margin:0;" data-go="collections">View All</span></div>
    <div class="mexpr">${expr.map(g=>`<div class="et" data-go="product"><div class="tx ${cls(g.tone)}"></div><span class="p"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></span></div>`).join('')}</div>
    <button class="mbtn mbtn-dark" data-go="checkout" style="margin-top:24px;">Proceed to Checkout</button>
  </div></div>
  ${tabbar('wardrobe')}`; };

S.dossier = () => `
  ${statusbar()} ${appbarMark({})}
  <div class="vp flush">
    <div class="mdoss-top">
      <div class="pc">Private Client</div>
      <h2>${DOSSIER.name}</h2>
      <p>This is your personal dossier — a curated record of your journey with Monsieur by Aelier Groupe. Client since ${DOSSIER.since}.</p>
      <div class="mov">${DOSSIER.overview.map(o=>`<div class="o"><b>${o.v}</b><span>${o.k.split(' ')[0]}</span></div>`).join('')}</div>
    </div>
    <div class="s-pad">
      <div class="s-eyebrow" style="margin-bottom:8px;">Recent Activity</div>
      <div>${DOSSIER.activity.map(a=>`<div class="mact"><span class="ai"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 7h14l-1 13H6L5 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg></span><div class="ab"><b>${a.t}</b><span>${a.s}</span></div><span class="w">${a.w}</span></div>`).join('')}</div>
      <button class="mbtn mbtn-dark" data-go="mtm" style="margin-top:20px;">Book a Fitting</button>
      <button class="mbtn mbtn-ghost" data-go="complete" style="margin-top:11px;">The Complete Experience</button>
    </div>
  </div>
  ${tabbar('dossier')}`;

S.checkout = () => { const w=getWard(); const items = w.length?w:[{name:'Silk Cashmere Rollneck',material:'Ivory · Qty 1',tone:'t-cashmere',price:1550}]; const sub=items.reduce((s,i)=>s+i.price,0); return `
  ${statusbar()} ${appbarTitle('Checkout','wardrobe')}
  <div class="vp"><div class="s-pad">
    <div class="s-eyebrow">Payment · Step 2 of 3</div>
    <div class="s-title" style="font-size:24px;">Payment</div>
    <div class="s-eyebrow" style="margin:18px 0 12px;">Payment Method</div>
    <div class="mpm">
      <div class="mpm-opt on" data-pm="apple"><span class="rd"></span><span class="nm">Apple Pay</span><span class="pill">Pay</span></div>
      <div class="mpm-opt" data-pm="card"><span class="rd"></span><span class="nm">Credit or Debit Card</span><span class="pill alt">VISA</span></div>
      <div class="mpm-opt" data-pm="other"><span class="rd"></span><span class="nm">Other Payment Methods</span></div>
    </div>
    <div class="s-eyebrow" style="margin:24px 0 4px;">Order Summary</div>
    <div class="morder">${items.map(it=>`<div class="moitem"><span class="sw"><span class="tx ${cls(it.tone)}"></span></span><div class="oi"><b>${it.name}</b><span>${it.material||it.house||''} · Qty 1</span></div><span class="pr">${fmtPrice(it.price)}</span></div>`).join('')}
      <div class="mtot">
        <div class="tr"><span>Subtotal</span><span>${fmtPrice(sub)}</span></div>
        <div class="tr"><span>Shipping</span><span class="free">Complimentary</span></div>
        <div class="tr"><span>Tax</span><span>$0</span></div>
        <div class="gr"><span class="gl">Total</span><span class="gv">${fmtPrice(sub)}</span></div>
      </div>
    </div>
  </div></div>
  <div class="s-action"><button class="mbtn mbtn-dark" data-pay><svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;"><path d="M17 4c-1 0-2 .6-2.6 1.4C13.7 6.2 13 7.3 13 8.4c1.1.1 2.1-.6 2.7-1.4.6-.8 1.1-1.9 1-3M19 17c-.6 1.3-1.3 2.6-2.4 2.6-1 0-1.4-.7-2.6-.7s-1.6.7-2.6.7c-1.1 0-1.9-1.4-2.5-2.7-1.3-2.7-1-6 .9-7.3.9-.6 2-.6 2.8-.2.8.3 1.3.6 1.9.6.5 0 1.3-.4 2.2-.6.6-.1 1.6-.1 2.4.6-2.1 1.3-1.8 4.6.4 5.6"/></svg> Pay with Apple Pay</button></div>`; };

S.passport = () => `
  ${statusbar()} ${appbarTitle('Fibre Passport','product')}
  <div class="vp flush">
    <div class="mfp-head">
      <span class="seal"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1"><circle cx="20" cy="20" r="15"/><circle cx="20" cy="20" r="10"/><path d="M20 10v20M10 20h20"/></svg></span>
      <h2>Fibre Passport</h2>
      <div class="sub">Digital Certificate of Origin &amp; Craftsmanship</div>
      <div class="code">${PASSPORT.code}</div>
    </div>
    <div class="mfp-hero"><span class="sw"><span class="tex t-cashmere"></span></span>
      <div><h3>Silk Cashmere Rollneck</h3><div class="comp">70% Silk · 30% Cashmere — Ivory</div></div></div>
    <div class="mfp-sec"><h4>Material Origin</h4>${PASSPORT.origin.map(o=>`<div class="mkv"><span class="k">${o.k}</span><span class="v">${o.v}</span></div>`).join('')}</div>
    <div class="mfp-sec"><h4>Fibre Specifications</h4>${PASSPORT.spec.map(o=>`<div class="mkv"><span class="k">${o.k}</span><span class="v">${o.v}</span></div>`).join('')}</div>
    <div class="mfp-craft"><h4 style="font-family:var(--sans);font-size:10px;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:12px;">Craftsmanship</h4>
      <p>Fully fashioned and hand-linked in Perugia, Italy, by master knitters — each panel knitted to shape, then washed and pressed in Tuscany.</p>
      <div class="sig">Aelier Groupe</div></div>
  </div>`;

S.mtm = () => `
  ${statusbar()} ${appbarTitle('Made to Measure','dossier')}
  <div class="vp flush">
    <div class="mstepper">${MTM.steps.map((s,i)=>`<div class="mstep ${i===3?'on':''} ${i<3?'done':''}"><span class="d">${i<3?'✓':'0'+(i+1)}</span><span class="l">${s}</span></div>${i<MTM.steps.length-1?'<span class="bar"></span>':''}`).join('')}</div>
    <div class="mfig"><div class="photo"></div></div>
    <div class="s-pad" style="padding-top:0;">
      <div class="s-eyebrow" style="margin-bottom:10px;">Step 04 — Measurements</div>
      <div class="mmeas">${MTM.measurements.map(m=>`<div class="r"><span class="k">${m.k}</span><span class="v">${m.v}</span></div>`).join('')}</div>
      <button class="mbtn mbtn-dark" data-go="dossier" data-mobile-commission style="margin-top:20px;">Save &amp; Continue</button>
      <a class="mlink" data-go="dossier" data-mobile-fitting>Schedule a Fitting →</a>
    </div>
  </div>`;

S.complete = () => `
  ${statusbar(true)} ${appbarMark({photo:true, right:`<button class="ab-btn" data-go="home"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 18L18 6M6 6l12 12"/></svg></button>`})}
  <div class="vp flush"><div class="mcomplete">
    <h2>The complete experience.<br /><em>In the palm of your hand.</em></h2>
    <div style="margin-top:24px;">
      <div class="cl"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg></span><div><b>Curated Materials</b><p>The world's finest natural fibres.</p></div></div>
      <div class="cl"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 4h6v16H5zM13 4h6v16h-6"/></svg></span><div><b>Timeless Collections</b><p>Designed to be worn for years, not seasons.</p></div></div>
      <div class="cl"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></svg></span><div><b>Personal Service</b><p>Tailored guidance at every step.</p></div></div>
      <div class="cl"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 3c3 3 6 4 6 4v5c0 4-3 7-6 9-3-2-6-5-6-9V7s3-1 6-4Z"/></svg></span><div><b>Exclusive Privileges</b><p>Private releases and client-only access.</p></div></div>
    </div>
    <div class="mstores">
      <div class="mstore"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 4c-1 0-2 .6-2.6 1.4C13.7 6.2 13 7.3 13 8.4c1.1.1 2.1-.6 2.7-1.4.6-.8 1.1-1.9 1-3M19 17c-.6 1.3-1.3 2.6-2.4 2.6-1 0-1.4-.7-2.6-.7s-1.6.7-2.6.7c-1.1 0-1.9-1.4-2.5-2.7-1.3-2.7-1-6 .9-7.3.9-.6 2-.6 2.8-.2.8.3 1.3.6 1.9.6.5 0 1.3-.4 2.2-.6.6-.1 1.6-.1 2.4.6-2.1 1.3-1.8 4.6.4 5.6"/></svg><div class="st"><small>Download on the</small><b>App Store</b></div></div>
      <div class="mstore"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3l11 9L4 21V3zM15 12l4-2.3M15 12l4 2.3"/></svg><div class="st"><small>Get it on</small><b>Google Play</b></div></div>
    </div>
  </div></div>`;

/* ---- toast (inside device) ---- */
function mtoast(msg){
  const sc = document.getElementById('screen');
  let t = sc.querySelector('.mtoast');
  if(!t){ t=document.createElement('div'); t.className='mtoast'; sc.appendChild(t); }
  t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:15px;height:15px;color:var(--bronze-soft)"><path d="M4 12l5 5L20 6"/></svg> ${msg}`;
  t.classList.add('show'); clearTimeout(window.__mmt); window.__mmt=setTimeout(()=>t.classList.remove('show'),2200);
}

/* ---- router ---- */
let current = 'home';
function go(id){ if(!S[id]) return; current = id; render(); document.querySelector('.vp')?.scrollTo(0,0); }
function render(){
  document.getElementById('screen').innerHTML = S[current]();
  // rail active
  document.querySelectorAll('.rail .ri').forEach(r=>r.classList.toggle('on', r.dataset.s===current));
  bind();
}
function bind(){
  const sc = document.getElementById('screen');
  sc.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.go)));
  sc.querySelectorAll('[data-menu]').forEach(el=>el.addEventListener('click',()=>go('collections')));
  sc.querySelectorAll('[data-add]').forEach(el=>el.addEventListener('click',()=>{ addWard(findGarment(el.dataset.add)); setTimeout(()=>go('wardrobe'),650); }));
  sc.querySelectorAll('[data-fav]').forEach(el=>el.addEventListener('click',()=>{ el.classList.toggle('faved'); el.querySelector('path')?.setAttribute('fill', el.classList.contains('faved')?'currentColor':'none'); mtoast(el.classList.contains('faved')?'Saved to wardrobe':'Removed'); }));
  sc.querySelectorAll('[data-pay]').forEach(el=>el.addEventListener('click',()=>{ mtoast('Order confirmed — thank you'); setTimeout(()=>go('dossier'),1100); }));
  sc.querySelectorAll('[data-mobile-fitting]').forEach(el=>el.addEventListener('click',()=>{ if(window.Backend) window.Backend.createFittingRequest({ note:'Mobile made-to-measure fitting requested.' }); }));
  sc.querySelectorAll('[data-mobile-commission]').forEach(el=>el.addEventListener('click',()=>{ if(window.Backend) window.Backend.createCommission({ style:'Mobile MTM', fabric:'Saved measurement profile', details:['Mobile flow'] }); }));
  // product gallery + tabs + sizes
  sc.querySelectorAll('.mp-thumbs .th').forEach(th=>th.addEventListener('click',()=>{ sc.querySelectorAll('.mp-thumbs .th').forEach(x=>x.classList.remove('on')); th.classList.add('on'); document.getElementById('mpStage').className='tx '+cls(th.dataset.tone); }));
  const tabContent = { d:'<p class="mp-desc">An icon of understated luxury. Crafted from a premium blend of silk and cashmere for exceptional softness, lightness and warmth.</p>',
    x:'<p class="mp-desc">70% Mulberry Silk · 30% Grade-A Cashmere. 12-gauge, fully fashioned. 320g. Knitted in Perugia, Italy.</p>',
    c:'<p class="mp-desc">Hand wash cold or specialist dry clean. Dry flat, reshape while damp. Store folded; avoid hanging.</p>',
    v:'<p class="mp-desc">Complimentary insured delivery worldwide within two business days, with its Fibre Passport enclosed.</p>' };
  sc.querySelectorAll('.mtab').forEach(t=>t.addEventListener('click',()=>{ sc.querySelectorAll('.mtab').forEach(x=>x.classList.remove('on')); t.classList.add('on'); document.getElementById('mpTab').innerHTML=tabContent[t.dataset.mt]; }));
  sc.querySelectorAll('.msize').forEach(s=>s.addEventListener('click',()=>{ sc.querySelectorAll('.msize').forEach(x=>x.classList.remove('on')); s.classList.add('on'); }));
  sc.querySelectorAll('.mfilter').forEach(f=>f.addEventListener('click',()=>f.classList.toggle('on')));
  sc.querySelectorAll('.mpm-opt').forEach(o=>o.addEventListener('click',()=>{ sc.querySelectorAll('.mpm-opt').forEach(x=>x.classList.remove('on')); o.classList.add('on'); const lbl={apple:'Pay with Apple Pay',card:'Pay Securely',other:'Continue'}[o.dataset.pm]; const pb=sc.querySelector('[data-pay]'); if(pb) pb.lastChild.textContent=' '+lbl; }));
}

/* ---- rail ---- */
document.getElementById('railList').innerHTML = SCREENS.map(([id,t,d],i)=>`
  <div class="ri ${id==='home'?'on':''}" data-s="${id}"><span class="rn">${(i+1).toString().padStart(2,'0')}</span><div><div class="rt">${t}</div><div class="rd">${d}</div></div></div>`).join('');
document.querySelectorAll('.rail .ri').forEach(r=>r.addEventListener('click',()=>go(r.dataset.s)));

/* mtoast style injection */
const st = document.createElement('style');
st.textContent = `.mtoast{position:absolute;left:50%;bottom:96px;transform:translateX(-50%) translateY(14px);z-index:60;display:inline-flex;align-items:center;gap:8px;background:var(--dark);color:var(--on-dark);padding:11px 18px;border-radius:3px;font-family:var(--sans);font-size:11.5px;letter-spacing:0.03em;white-space:nowrap;opacity:0;visibility:hidden;transition:all .3s cubic-bezier(.2,.8,.2,1);box-shadow:var(--shadow-pop);} .mtoast.show{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0);}`;
document.head.appendChild(st);

render();
