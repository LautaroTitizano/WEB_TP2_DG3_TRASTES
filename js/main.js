/* =============================================
   TRASTES — LUTHERÍA DE AUTOR
   main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAV SHADOW ON SCROLL ───────────────────────────────────
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 30
      ? '0 2px 24px rgba(13,13,13,0.08)'
      : 'none';
  }, { passive: true });


  // ─── ACCORDION ──────────────────────────────────────────────
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all
      accordionItems.forEach(i => i.classList.remove('active'));
      // Open clicked if it was closed
      if (!isActive) item.classList.add('active');
    });
  });


  // ─── TESTIMONIALS CAROUSEL ──────────────────────────────────
  const track     = document.getElementById('testimonios-track');
  const prevBtn   = document.getElementById('t-prev');
  const nextBtn   = document.getElementById('t-next');
  const cards     = track ? track.querySelectorAll('.testimonio-card') : [];
  let   currentIndex = 0;

  function getCardsVisible() {
    return window.innerWidth <= 640 ? 1 : 2;
  }

  function updateCarousel() {
    if (!track || cards.length === 0) return;
    const visible  = getCardsVisible();
    const maxIndex = Math.max(0, cards.length - visible);
    currentIndex   = Math.min(Math.max(currentIndex, 0), maxIndex);

    // Calculate offset based on first card width + gap
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap       = 24; // 1.5rem gap
    const offset    = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => { currentIndex--; updateCarousel(); });
    nextBtn.addEventListener('click', () => { currentIndex++; updateCarousel(); });
    window.addEventListener('resize', updateCarousel, { passive: true });
  }


  // ─── SCROLL REVEAL ──────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.section-title, .section-eyebrow, .accordion-item, .modelo-card, ' +
    '.pieza-item, .timeline-step, .testimonio-card, .galeria-item, ' +
    '.nosotros-manifesto, .nosotros-stats, .stat, .contacto-title'
  );

  // Add reveal class
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger siblings in grid containers
    const parent = el.parentElement;
    if (parent) {
      const siblings = parent.querySelectorAll(':scope > *');
      siblings.forEach((sib, idx) => {
        if (sib === el) {
          const delay = Math.min(idx, 5);
          if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
        }
      });
    }
  });

  // IntersectionObserver for performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));


  // ─── GALERÍA LIGHTBOX (simple) ──────────────────────────────
  const galeriaItems = document.querySelectorAll('.galeria-item');
  let   lightbox     = null;

  function createLightbox(content) {
    const lb = document.createElement('div');
    lb.style.cssText = `
      position: fixed; inset: 0; z-index: 999;
      background: rgba(13,13,13,0.96);
      display: flex; align-items: center; justify-content: center;
      cursor: zoom-out;
      animation: fadeIn 0.25s ease;
    `;
    const style = document.createElement('style');
    style.textContent = '@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }';
    lb.appendChild(style);

    const inner = document.createElement('div');
    inner.style.cssText = `
      max-width: 80vw; max-height: 80vh;
      background: #1a1510;
      border-radius: 12px;
      overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      min-width: 400px; min-height: 300px;
    `;
    inner.innerHTML = content;
    lb.appendChild(inner);

    lb.addEventListener('click', () => {
      document.body.removeChild(lb);
      lightbox = null;
    });

    document.body.appendChild(lb);
    lightbox = lb;
  }

  galeriaItems.forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      if (lightbox) return;
      const placeholder = item.querySelector('.galeria-placeholder');
      const label = placeholder ? placeholder.querySelector('span').textContent : '';
      const bg    = getComputedStyle(placeholder).background;
      createLightbox(`
        <div style="
          width: 70vw; height: 60vh;
          background: ${bg};
          display: flex; align-items: flex-end;
          padding: 2rem;
          font-family: 'Geist', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        ">${label}</div>
      `);
    });
  });


  // ─── CURSOR ACCENT (desktop only) ───────────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 8px; height: 8px;
      background: #E8430A;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.15s ease, width 0.25s ease, height 0.25s ease;
      transform: translate(-50%, -50%);
      mix-blend-mode: multiply;
    `;
    document.body.appendChild(cursor);

    let cx = 0, cy = 0;
    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    }, { passive: true });

    // Expand on interactive elements
    const interactives = document.querySelectorAll('a, button, .accordion-header, .galeria-item, .modelo-card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width  = '24px';
        cursor.style.height = '24px';
        cursor.style.opacity = '0.5';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width  = '8px';
        cursor.style.height = '8px';
        cursor.style.opacity = '1';
      });
    });
  }

});
