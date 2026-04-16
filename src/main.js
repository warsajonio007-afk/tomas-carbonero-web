import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from 'lenis';
import { initHero }     from './hero.js';
import { initSelector } from './selector.js';
import { initGallery }  from './gallery.js';
import { initPerfil }   from './perfil.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ============================================================
// NAV
// ============================================================
function initNav() {
  const nav = document.getElementById('nav');
  const menuBtn = document.querySelector('.nav-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  ScrollTrigger.create({
    start: '80px top',
    onEnter: () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });

  menuBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ============================================================
// HERO ANIMATIONS — reveal en cascada por línea
// ============================================================
function initHeroAnimations() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    // Respeto total a la preferencia del sistema — iOS Accesibilidad incluido
    gsap.from(
      ['.hero-eyebrow', '.hero-title-line', '.hero-sub', '.hero-cta', '.hero-scroll-hint'],
      { opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', clearProps: 'all' }
    );
    return;
  }

  // Wipe de abajo hacia arriba (clip-path) + desplazamiento sutil
  // Cada elemento "nace" individualmente — eyebrow → línea 1 → línea 2 → sub → cta
  // GSAP maneja -webkit-clip-path automáticamente en Safari
  const tl = gsap.timeline({ delay: 0.3 });

  tl.from('.hero-eyebrow', {
    clipPath: 'inset(0 0 100% 0)',
    y: 10,
    opacity: 0,
    duration: 0.75,
    ease: 'power3.out',
    clearProps: 'all'
  })
  .from('.hero-title-line', {
    clipPath: 'inset(0 0 100% 0)',
    y: 16,
    opacity: 0,
    duration: 0.92,
    ease: 'power3.out',
    stagger: 0.13,
    clearProps: 'all'
  }, '-=0.42')
  .from('.hero-sub', {
    clipPath: 'inset(0 0 100% 0)',
    y: 8,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
    clearProps: 'all'
  }, '-=0.5')
  .from('.hero-cta', {
    opacity: 0,
    y: 8,
    duration: 0.55,
    ease: 'power2.out',
    clearProps: 'all'
  }, '-=0.32')
  .from('.hero-scroll-hint', {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
    clearProps: 'all'
  }, '-=0.25');
}

// ============================================================
// SCROLL ANIMATIONS
// ============================================================
function splitWords(el) {
  if (!el) return [];
  const text = el.innerHTML;
  const words = text.split(/(\s+|<br\s*\/?>)/gi);
  el.innerHTML = words.map(w => {
    if (!w.trim() || w.match(/<br/i)) return w;
    return `<span class="word-wrap"><span class="word">${w}</span></span>`;
  }).join('');
  return el.querySelectorAll('.word');
}

function initScrollAnimations() {
  const phraseWords = splitWords(document.querySelector('.frase-text'));
  if (phraseWords.length) {
    gsap.from(phraseWords, {
      opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
      stagger: 0.04, immediateRender: false, clearProps: 'all',
      scrollTrigger: { trigger: '#frase', start: 'top 70%', toggleActions: 'play none none none' }
    });
  }

  gsap.from('.valle-text', {
    x: -50, opacity: 0, duration: 1.1, ease: 'power3.out',
    immediateRender: false, clearProps: 'all',
    scrollTrigger: { trigger: '#valle', start: 'top 78%' }
  });
  gsap.from('.valle-img-wrap', {
    scale: 0.85, opacity: 0, duration: 1.2, ease: 'power3.out',
    immediateRender: false, clearProps: 'all',
    scrollTrigger: { trigger: '#valle', start: 'top 72%' }, delay: 0.2,
  });

  gsap.utils.toArray('.pisco-slide').forEach(slide => {
    const bottle = slide.querySelector('.pisco-bottle');
    const info   = slide.querySelector('.pisco-info');
    if (bottle) {
      gsap.from(bottle, {
        scale: 0.82, opacity: 0, duration: 1, ease: 'power3.out',
        immediateRender: false, clearProps: 'all',
        scrollTrigger: { trigger: slide, start: 'top 80%', toggleActions: 'play none none none' }
      });
    }
    if (info) {
      gsap.from(info, {
        x: 50, opacity: 0, duration: 1, ease: 'power3.out',
        immediateRender: false, clearProps: 'all',
        scrollTrigger: { trigger: slide, start: 'top 75%', toggleActions: 'play none none none' }, delay: 0.18,
      });
    }
  });

  gsap.from('.servicio-card', {
    y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
    stagger: 0.15, immediateRender: false, clearProps: 'all',
    scrollTrigger: { trigger: '#servicios', start: 'top 75%', toggleActions: 'play none none none' }
  });

  gsap.from('.clientes-header', {
    y: 30, opacity: 0, duration: 0.9, ease: 'power3.out',
    immediateRender: false, clearProps: 'all',
    scrollTrigger: { trigger: '#clientes', start: 'top 80%' }
  });

  gsap.utils.toArray('.proceso-step').forEach((step, i) => {
    gsap.from(step, {
      x: -40, opacity: 0, duration: 0.8, ease: 'power3.out',
      immediateRender: false, clearProps: 'all', delay: i * 0.08,
      scrollTrigger: { trigger: step, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });

  gsap.from('.quote-text', {
    y: 40, opacity: 0, duration: 1.4, ease: 'power3.out',
    immediateRender: false, clearProps: 'all',
    scrollTrigger: { trigger: '#quote', start: 'top 72%' }
  });

  gsap.from('.contacto-left', {
    x: -40, opacity: 0, duration: 1, ease: 'power3.out',
    immediateRender: false, clearProps: 'all',
    scrollTrigger: { trigger: '#contacto', start: 'top 78%' }
  });
  gsap.from('.contacto-right', {
    x: 40, opacity: 0, duration: 1, ease: 'power3.out',
    immediateRender: false, clearProps: 'all',
    scrollTrigger: { trigger: '#contacto', start: 'top 78%' }, delay: 0.15,
  });

  // Perfil header entrance
  const perfilHeader = document.querySelector('.perfil-header');
  if (perfilHeader) {
    ScrollTrigger.create({
      trigger: perfilHeader,
      start: 'top 82%',
      once: true,
      onEnter: () => perfilHeader.classList.add('is-visible'),
    });
  }

  gsap.utils.toArray('.piscos-header h2, .servicios-header h2, .clientes-header h2, .proceso-header h2').forEach(el => {
    gsap.from(el, {
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
      immediateRender: false, clearProps: 'all',
      scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' }
    });
  });
}

// ============================================================
// CURSOR
// ============================================================
function initCursor() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    ring.style.left   = rx + 'px'; ring.style.top   = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '16px'; cursor.style.height = '16px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width =  '8px'; cursor.style.height =  '8px'; });
  });
}

// ============================================================
// LIGHTBOX (servicios empresas + overlay)
// ============================================================
function initLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  const lbImg   = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  if (!overlay) return;

  // History API: push state on open so browser back closes lightbox, not navigates away
  const close = () => {
    if (!overlay.classList.contains('open')) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Remove the state we pushed (if still current)
    if (history.state && history.state.lightbox) history.back();
  };

  window.openLightbox = src => {
    lbImg.src = src;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Push a history entry so back button closes the lightbox
    history.pushState({ lightbox: true }, '');
  };

  // When browser back is pressed while lightbox is open
  window.addEventListener('popstate', e => {
    if (overlay.classList.contains('open')) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      // Don't call history.back() here — popstate already moved back
    }
  });

  lbClose?.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Lightbox thumbnails (empresas)
  const thumbs  = document.querySelectorAll('.lb-thumb');
  const mainImg = document.getElementById('lb-main-emp');
  if (thumbs.length && mainImg) {
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.dataset.src;
        mainImg.style.opacity = '0';
        setTimeout(() => { mainImg.src = src; mainImg.style.opacity = '1'; }, 200);
        thumbs.forEach(t => t.classList.remove('lb-thumb--active'));
        thumb.classList.add('lb-thumb--active');
      });
    });
    mainImg.addEventListener('click', () => window.openLightbox(mainImg.src));
  }

  // Restaurante lightbox
  const restImg = document.getElementById('rest-lightbox-img');
  restImg?.addEventListener('click', () => window.openLightbox(restImg.src));
}

// ============================================================
// LENIS SMOOTH SCROLL
// ============================================================
function initLenis() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lenis = new Lenis({
    // lerp más alto en móvil táctil para no interferir con el scroll nativo de iOS
    // Lenis en touch usa requestAnimationFrame pero respeta la física nativa
    lerp: 0.1,
    smoothWheel: true,
    // En touch (móvil/tablet) delegamos a Lenis que normaliza los eventos
    // pero no fuerza suavizado artificial que pelearía con el momentum de iOS
    touchMultiplier: 1.2,
    infinite: false,
  });

  if (reduced) {
    // Accesibilidad: scroll instantáneo si el usuario lo pidió en el sistema
    lenis.destroy();
    return null;
  }

  // Integración con GSAP ScrollTrigger — el canal oficial recomendado
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

// ============================================================
// BACK TO TOP
// ============================================================
function initBackToTop(lenis) {
  const btn    = document.getElementById('back-to-top');
  const footer = document.getElementById('footer');
  if (!btn || !footer) return;

  // IntersectionObserver: aparece cuando el footer entra en pantalla
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      btn.classList.add('visible');
      gsap.to(btn, {
        opacity: 1, scale: 1,
        duration: 0.55, ease: 'power3.out',
      });
    } else {
      gsap.to(btn, {
        opacity: 0, scale: 0.85,
        duration: 0.4, ease: 'power2.in',
        onComplete: () => btn.classList.remove('visible'),
      });
    }
  }, { threshold: 0.15 });

  observer.observe(footer);

  btn.addEventListener('click', () => {
    if (lenis) {
      // Lenis scroll premium: duración 1.6s, easing exponencial
      lenis.scrollTo(0, {
        duration: 1.6,
        easing: (t) => 1 - Math.pow(1 - t, 5), // easeOutQuint
      });
    } else {
      // Fallback sin Lenis (reduced motion o fallo)
      gsap.to(window, {
        scrollTo: { y: 0 },
        duration: 1.4,
        ease: 'power4.inOut',
      });
    }
  });
}

// ============================================================
// FORM VALIDATION + SANITIZATION
// ============================================================
function initFormValidation() {
  const form   = document.getElementById('contact-form');
  const btn    = document.getElementById('form-submit-btn');
  if (!form) return;

  // Strip tags and trim — prevents XSS / script injection in field values
  function sanitize(str) {
    return str
      .replace(/[<>]/g, '')          // strip < >
      .replace(/javascript:/gi, '')  // kill js: URIs
      .replace(/on\w+\s*=/gi, '')    // kill inline event attrs
      .trim();
  }

  // Email format validation (RFC-lite)
  function validEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
  }

  function showError(id, msg) {
    const el = document.getElementById('error-' + id);
    const input = document.getElementById(id);
    if (el) el.textContent = msg;
    if (input) input.classList.toggle('field-error', !!msg);
  }

  function clearErrors() {
    ['nombre', 'correo'].forEach(id => showError(id, ''));
  }

  // Real-time: clear error once user starts fixing the field
  ['nombre', 'correo'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => showError(id, ''));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const nombre  = sanitize(document.getElementById('nombre')?.value || '');
    const correo  = sanitize(document.getElementById('correo')?.value || '');
    const telefono = sanitize(document.getElementById('telefono')?.value || '');
    const mensaje = sanitize(document.getElementById('mensaje')?.value || '');

    let valid = true;

    if (nombre.length < 2) {
      showError('nombre', 'Por favor ingresa tu nombre o empresa.');
      valid = false;
    }
    if (!validEmail(correo)) {
      showError('correo', 'Ingresa un correo electrónico válido.');
      valid = false;
    }

    if (!valid) return;

    // Write sanitized values back before submit
    document.getElementById('nombre').value   = nombre;
    document.getElementById('correo').value   = correo;
    document.getElementById('telefono').value = telefono;
    document.getElementById('mensaje').value  = mensaje;

    if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
    form.submit();
  });
}

// ============================================================
// CLIENTES MARQUEE — touch scroll + pause/resume
// ============================================================
function initClientesTouch() {
  const wrap   = document.querySelector('.clientes-track-wrap');
  const tracks = document.querySelectorAll('.clientes-track');
  if (!tracks.length) return;

  let pausedItem  = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let isDragging  = false;
  // Accumulated manual offset while dragging
  let manualOffset = 0;
  // Animation position snapshot when drag starts
  let animOffset   = 0;

  // Helper — read current CSS translateX of first track via computed style
  function getAnimX(el) {
    const st = window.getComputedStyle(el);
    const mx = new DOMMatrix(st.transform);
    return mx.m41; // translateX
  }

  tracks.forEach(track => {
    track.addEventListener('touchstart', e => {
      const t = e.touches[0];
      touchStartX   = t.clientX;
      touchStartY   = t.clientY;
      isDragging    = false;
      animOffset    = getAnimX(track);
      manualOffset  = 0;
    }, { passive: true });

    track.addEventListener('touchmove', e => {
      const t   = e.touches[0];
      const dx  = t.clientX - touchStartX;
      const dy  = t.clientY - touchStartY;

      // Only hijack horizontal drags (> 8px X, less than 2× Y movement)
      if (!isDragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        isDragging = true;
        // Pause CSS animation and take manual control
        tracks.forEach(tr => {
          tr.style.animationPlayState = 'paused';
          tr.style.willChange = 'transform';
        });
        // Clear any active logo highlight
        if (pausedItem) {
          pausedItem.querySelector('img')?.style.setProperty('opacity', '');
          pausedItem = null;
        }
      }
      if (!isDragging) return;

      manualOffset = dx;
      const totalX = animOffset + manualOffset;
      tracks.forEach(tr => {
        tr.style.transform = `translateX(${totalX}px)`;
      });
    }, { passive: true });

    track.addEventListener('touchend', e => {
      if (isDragging) {
        // Resume animation from where we left off — momentum-style: just restart
        tracks.forEach(tr => {
          tr.style.transform = '';
          tr.style.willChange = '';
          tr.style.animationPlayState = 'running';
        });
        isDragging = false;
        return;
      }

      // Tap (no drag) — pause/resume logo highlight
      const item = e.target.closest('.cliente-item');
      if (!item) return;

      if (pausedItem === item) {
        tracks.forEach(tr => tr.style.animationPlayState = 'running');
        item.querySelector('img')?.style.setProperty('opacity', '');
        pausedItem = null;
      } else {
        if (pausedItem) pausedItem.querySelector('img')?.style.setProperty('opacity', '');
        tracks.forEach(tr => tr.style.animationPlayState = 'paused');
        item.querySelector('img')?.style.setProperty('opacity', '0.9', 'important');
        pausedItem = item;
      }
    }, { passive: true });
  });

  // Tap outside logo → resume
  document.addEventListener('touchstart', e => {
    if (!pausedItem) return;
    if (!e.target.closest('.cliente-item')) {
      tracks.forEach(t => t.style.animationPlayState = 'running');
      pausedItem.querySelector('img')?.style.setProperty('opacity', '');
      pausedItem = null;
    }
  }, { passive: true });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const lenis = initLenis();
  initNav();
  initHeroAnimations();
  initScrollAnimations();
  initCursor();
  initLightbox();
  initHero();
  initSelector();
  initGallery();
  initPerfil();
  initClientesTouch();
  initFormValidation();
  initBackToTop(lenis);
});
