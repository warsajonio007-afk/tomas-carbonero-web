import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─── Data ──────────────────────────────────────────────────────
const LABELS = ['Floral', 'Frutal', 'Dulzor', 'Acidez', 'Cuerpo', 'Persistencia'];

const PISCOS = [
  {
    name: 'Italia', uva: 'Uva Italia', sub: 'Floral · elegante',
    desc: 'Floral y elegante. Notas de jazmín, durazno y lichi. La variedad más aromática del valle, destilada a baja presión para preservar cada matiz.',
    notas: ['Jazmín', 'Durazno', 'Lichi', 'Flores blancas', 'Pasas rubias'],
    nariz: 'Aromas florales intensos. Jazmín, durazno y notas de lichi. Limpio y perfumado.',
    paladar: 'Sedoso y delicado. Lúcuma, pecana y un toque mineral del valle de Cañete.',
    final: 'Largo y elegante, con calidez que recuerda las tardes del río.',
    scores: [9, 7, 5, 5, 6, 8],
    color: '#7EB89A', fill: 'rgba(126,184,154,',   // verde · fresco · floral
  },
  {
    name: 'Quebranta', uva: 'Uva Quebranta', sub: 'Robusto · redondo',
    desc: 'Robusto y redondo. Notas de mora, ciruelas maduras y chocolate negro. La uva que resistió la filoxera y se quedó en el valle para siempre.',
    notas: ['Mora', 'Ciruela madura', 'Chocolate negro', 'Tierra húmeda', 'Especias'],
    nariz: 'Intenso y profundo. Ciruela madura, cacao y notas terrosas del suelo arcilloso.',
    paladar: 'Pleno y redondo. Chocolate negro, mora y una sutil mineralidad persistente.',
    final: 'Largo y cálido, con retrogusto de frutas oscuras que perdura en copa.',
    scores: [3, 9, 7, 4, 9, 7],
    color: '#A08CC8', fill: 'rgba(160,140,200,',   // lavanda · profundo · oscuro
  },
  {
    name: 'Torontel', uva: 'Uva Torontel', sub: 'Vibrante · fresco',
    desc: 'Vibrante y fresco. Notas de mandarina, rosas y miel. Un pisco que despierta los sentidos con cada sorbo y deja un final largo e inconfundible.',
    notas: ['Mandarina', 'Rosas', 'Miel', 'Cítricos', 'Hierbas frescas'],
    nariz: 'Vibrante y expresivo. Mandarina, pétalos de rosa y un sutil toque de miel.',
    paladar: 'Fresco y ligero. Cítricos vivos, flores y una dulzura natural bien integrada.',
    final: 'Final largo, floral y refrescante con notas de miel que se prolongan.',
    scores: [8, 6, 8, 7, 5, 9],
    color: '#C8A96E', fill: 'rgba(200,169,110,',   // dorado · luminoso · vibrante
  },
  {
    name: 'Acholado', uva: 'Blend · Italia · Quebranta · Torontel', sub: 'Blend · complejo & versátil',
    desc: 'Un blend magistral de tres cepas que se fusionan para crear algo mayor que cada una por separado. Complejo, equilibrado y versátil. Cosecha 2025.',
    notas: ['Frutas tropicales', 'Flores', 'Ciruela', 'Miel', 'Especias sutiles'],
    nariz: 'Complejo y seductor. Aromas frutales, florales y especiados en perfecta armonía.',
    paladar: 'Equilibrado y versátil. Expresa la riqueza completa del valle de Lunahuaná.',
    final: 'Final prolongado y complejo, con múltiples capas que evolucionan en copa.',
    scores: [7, 8, 7, 6, 8, 8],
    color: '#C87D6E', fill: 'rgba(200,125,110,',   // terracota · cálido · terroso
  },
];

// ─── Main init ─────────────────────────────────────────────────
export function initPerfil() {
  const section      = document.getElementById('perfil');
  if (!section) return;

  const canvas       = document.getElementById('perfil-canvas');
  const tabsEl       = document.getElementById('perfil-tabs');
  const metaEl       = document.getElementById('perfil-meta');
  const barsEl       = document.getElementById('perfil-bars');
  const cmpBtn       = document.getElementById('perfil-cmp-btn');
  const toggleBtn    = document.getElementById('perfil-chart-toggle');
  const toggleLabel  = document.getElementById('perfil-toggle-label');
  const collapsible  = document.getElementById('perfil-chart-collapsible');
  if (!canvas || !tabsEl || !metaEl) return;

  let activeIdx  = 0;
  let comparing  = false;
  let animProg   = 0;
  let ctx        = null;
  let cw = 0, ch = 0;
  let chartReady = false;
  let chartOpen  = false;

  const isMobile = window.matchMedia('(max-width: 799px)').matches;

  // ─── Canvas setup ────────────────────────────────────
  function setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = canvas.offsetWidth;
    ch = canvas.offsetHeight;
    if (!cw || !ch) return false;
    canvas.width  = cw * dpr;
    canvas.height = ch * dpr;
    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return true;
  }

  function ensureChart() {
    if (chartReady) return true;
    if (!setupCanvas()) return false;
    draw(0);
    chartReady = true;
    return true;
  }

  // ─── Draw ────────────────────────────────────────────
  function draw(progress) {
    if (progress !== undefined) animProg = progress;
    if (!ctx || !cw || !ch) return;

    ctx.clearRect(0, 0, cw, ch);

    const cx = cw / 2;
    const cy = ch / 2;
    const n  = LABELS.length;
    const da = (Math.PI * 2) / n;
    const a0 = -Math.PI / 2; // Floral at top

    // Radar radius: 65 % of half-size, enough margin for labels
    const r  = Math.min(cx, cy) * 0.65;
    const lr = r + Math.min(cx, cy) * 0.24;
    // Font: slightly larger + bolder for readability
    const fs = Math.max(10, Math.round(Math.min(cw, ch) * 0.034));

    // ── Grid rings
    for (let ring = 1; ring <= 5; ring++) {
      const rr = (ring / 5) * r;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const a = a0 + i * da;
        i === 0
          ? ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr)
          : ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.strokeStyle = ring === 3 ? 'rgba(200,169,110,0.18)' : 'rgba(200,169,110,0.09)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // ── Axis lines
    for (let i = 0; i < n; i++) {
      const a = a0 + i * da;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.strokeStyle = 'rgba(200,169,110,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // ── Labels — high-contrast for readability
    ctx.font = `600 ${fs}px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < n; i++) {
      const a = a0 + i * da;
      ctx.fillStyle = 'rgba(232,218,190,0.88)';
      ctx.fillText(LABELS[i], cx + Math.cos(a) * lr, cy + Math.sin(a) * lr);
    }

    // ── Datasets: fills first, borders on top
    const datasets  = comparing ? PISCOS : [PISCOS[activeIdx]];
    const fillAlpha = comparing ? '0.07)' : '0.16)';

    datasets.forEach(p => {
      const pts = p.scores.map((v, i) => {
        const a  = a0 + i * da;
        const rv = (v / 10) * r * animProg;
        return [cx + Math.cos(a) * rv, cy + Math.sin(a) * rv];
      });
      ctx.beginPath();
      pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.closePath();
      ctx.fillStyle = p.fill + fillAlpha;
      ctx.fill();
    });

    datasets.forEach(p => {
      const pts = p.scores.map((v, i) => {
        const a  = a0 + i * da;
        const rv = (v / 10) * r * animProg;
        return [cx + Math.cos(a) * rv, cy + Math.sin(a) * rv];
      });
      ctx.beginPath();
      pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.closePath();
      ctx.strokeStyle = p.color;
      ctx.lineWidth   = comparing ? 1.5 : 2.2;
      ctx.stroke();

      pts.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, comparing ? 2.5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
    });
  }

  // ─── Meta ────────────────────────────────────────────
  function renderMeta(instant) {
    const doUpdate = () => {
      if (comparing) {
        metaEl.innerHTML = `
          <div class="pm-legend">
            ${PISCOS.map(p => `
              <span class="pm-legend-item">
                <span class="pm-legend-dot" style="background:${p.color}"></span>
                <span>${p.name}</span>
              </span>`).join('')}
          </div>
          <p class="pm-compare-hint">Superposición de los cuatro perfiles.<br/>Cada color representa una cepa.</p>`;
        if (barsEl) barsEl.innerHTML = '';
      } else {
        const p = PISCOS[activeIdx];
        metaEl.innerHTML = `
          <p class="pm-name" style="--dot:${p.color}">${p.name}</p>
          <p class="pm-uva">${p.uva}</p>
          <p class="pm-desc">${p.desc}</p>
          <div class="pm-notes">${p.notas.map(n => `<span class="pm-note">${n}</span>`).join('')}</div>
          <div class="pm-profiles">
            <div class="pm-profile"><span class="pm-key">Nariz</span><span class="pm-val">${p.nariz}</span></div>
            <div class="pm-profile"><span class="pm-key">Paladar</span><span class="pm-val">${p.paladar}</span></div>
            <div class="pm-profile"><span class="pm-key">Final</span><span class="pm-val">${p.final}</span></div>
          </div>
          <a href="#contacto" class="pm-cta">Adquirir ${p.name}</a>`;
        if (barsEl) {
          barsEl.innerHTML = LABELS.map((label, i) => `
            <div class="pm-bar-row">
              <span class="pm-bar-label">${label}</span>
              <div class="pm-bar-bg">
                <div class="pm-bar-fill" data-val="${p.scores[i] * 10}"
                     style="width:0%;background:${p.color}"></div>
              </div>
              <span class="pm-bar-val">${p.scores[i]}</span>
            </div>`).join('');
          setTimeout(() => {
            if (!barsEl) return;
            barsEl.querySelectorAll('.pm-bar-fill').forEach(bar => {
              bar.style.transition = 'width 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';
              bar.style.width = bar.dataset.val + '%';
            });
          }, 60);
        }
      }
      gsap.fromTo(metaEl, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      if (barsEl) gsap.fromTo(barsEl, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.08 });
    };

    if (instant) { doUpdate(); return; }
    gsap.to(metaEl, { opacity: 0, duration: 0.18, onComplete: doUpdate });
    if (barsEl) gsap.to(barsEl, { opacity: 0, duration: 0.14 });
  }

  // ─── Tabs sync ───────────────────────────────────────
  function syncTabs() {
    tabsEl.querySelectorAll('[data-i]').forEach((t, i) => {
      t.classList.toggle('pr-tab--active', !comparing && i === activeIdx);
      t.setAttribute('aria-selected', (!comparing && i === activeIdx).toString());
    });
  }

  // ─── Scroll entrance animation ───────────────────────
  function fireEntranceAnim() {
    const prog = { val: 0 };
    gsap.to(prog, {
      val: 1,
      duration: 1.5,
      ease: 'power3.out',
      onUpdate() { draw(prog.val); },
    });
  }

  // ─── Boot ────────────────────────────────────────────
  renderMeta(true);

  if (isMobile && collapsible) {
    // Mobile: collapse chart area, wait for toggle
    gsap.set(collapsible, { height: 0, opacity: 0, overflow: 'hidden' });
  } else {
    // Desktop: init immediately + scroll trigger
    if (!ensureChart()) requestAnimationFrame(() => { ensureChart(); });
    ScrollTrigger.create({
      trigger: section,
      start: 'top 72%',
      once: true,
      onEnter: fireEntranceAnim,
    });
  }

  // ─── Mobile accordion toggle ─────────────────────────
  if (toggleBtn && collapsible) {
    toggleBtn.addEventListener('click', () => {
      chartOpen = !chartOpen;
      toggleBtn.setAttribute('aria-expanded', chartOpen.toString());
      toggleBtn.classList.toggle('pct--open', chartOpen);

      if (chartOpen) {
        // Expand
        gsap.to(collapsible, {
          height: 'auto', opacity: 1, duration: 0.58, ease: 'power3.out',
          onComplete() { gsap.set(collapsible, { overflow: 'visible' }); },
        });
        if (!chartReady) {
          setTimeout(() => {
            if (ensureChart()) fireEntranceAnim();
          }, 80);
        }
        if (toggleLabel) toggleLabel.textContent = 'Ocultar perfil sensorial';
      } else {
        // Collapse
        gsap.set(collapsible, { overflow: 'hidden' });
        gsap.to(collapsible, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' });
        if (toggleLabel) toggleLabel.textContent = 'Descubrir el perfil sensorial';
      }
    });
  }

  // ─── Events ──────────────────────────────────────────
  tabsEl.addEventListener('click', e => {
    const tab = e.target.closest('[data-i]');
    if (!tab) return;
    comparing = false;
    activeIdx = +tab.dataset.i;
    if (cmpBtn) { cmpBtn.classList.remove('pr-cmp--active'); cmpBtn.textContent = 'Comparar todas'; }
    syncTabs();
    draw();
    renderMeta();
  });

  cmpBtn?.addEventListener('click', () => {
    comparing = !comparing;
    cmpBtn.classList.toggle('pr-cmp--active', comparing);
    cmpBtn.textContent = comparing ? 'Ver individualmente' : 'Comparar todas';
    syncTabs();

    // En móvil: si se activa "comparar", abrir el acordeón del radar obligatoriamente
    if (comparing && !chartOpen && collapsible && toggleBtn) {
      chartOpen = true;
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.classList.add('pct--open');
      gsap.to(collapsible, {
        height: 'auto', opacity: 1, duration: 0.55, ease: 'power3.out',
        onComplete() { gsap.set(collapsible, { overflow: 'visible' }); },
      });
      if (!chartReady) {
        setTimeout(() => { if (ensureChart()) fireEntranceAnim(); }, 80);
      }
      if (toggleLabel) toggleLabel.textContent = 'Ocultar perfil sensorial';
    }

    draw();
    renderMeta();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (chartReady) { setupCanvas(); draw(); }
    }, 200);
  });
}
