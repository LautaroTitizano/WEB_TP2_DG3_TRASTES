/**
 * TRASTE — Luthería Artesanal
 * main.js
 *
 * Módulos:
 *  1. Accordion — método de trabajo (una sola sección abierta a la vez)
 *  2. Scroll fade-up — revelado de elementos al hacer scroll
 *  3. Nav hide/show — oculta el nav al scrollear hacia abajo
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   1. ACCORDION
   ══════════════════════════════════════════════════════════ */

(function initAccordion() {
  const items    = document.querySelectorAll('.accordion__item');
  const triggers = document.querySelectorAll('.accordion__trigger');

  if (!triggers.length) return;

  /**
   * Abre un item y cierra el resto.
   * @param {Element} targetItem - El .accordion__item a abrir.
   */
  function openItem(targetItem) {
    items.forEach(function (item) {
      const trigger = item.querySelector('.accordion__trigger');
      const isTarget = item === targetItem;

      if (isTarget) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * Cierra un item abierto (toggle off).
   * @param {Element} item - El .accordion__item a cerrar.
   */
  function closeItem(item) {
    item.classList.remove('open');
    item.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const item   = trigger.closest('.accordion__item');
      const isOpen = item.classList.contains('open');

      if (isOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  });
})();


/* ══════════════════════════════════════════════════════════
   2. SCROLL FADE-UP
   ══════════════════════════════════════════════════════════ */

(function initFadeUp() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  // Respeta la preferencia de movimiento reducido del sistema operativo
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // Marca todos como visibles de inmediato sin animación
    elements.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) { observer.observe(el); });
})();


/* ══════════════════════════════════════════════════════════
   3. NAV HIDE / SHOW AL SCROLLEAR
   ══════════════════════════════════════════════════════════ */

(function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  let lastScrollY = 0;
  let ticking     = false;

  function updateNav() {
    const currentY = window.scrollY;

    if (currentY < 80) {
      // Siempre visible cerca del top
      nav.style.transform  = 'translateY(0)';
      nav.style.transition = 'none';
    } else if (currentY > lastScrollY) {
      // Scrolleando hacia abajo → ocultar
      nav.style.transform  = 'translateY(-100%)';
      nav.style.transition = 'transform 0.35s ease';
    } else {
      // Scrolleando hacia arriba → mostrar
      nav.style.transform  = 'translateY(0)';
      nav.style.transition = 'transform 0.35s ease';
    }

    lastScrollY = currentY;
    ticking     = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
})();


/* ══════════════════════════════════════════════════════════
   4. SMOOTH SCROLL para links internos (fallback navegadores
      que no soportan scroll-behavior: smooth nativo)
   ══════════════════════════════════════════════════════════ */

(function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');

  anchors.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href   = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('navbar')
        ? document.getElementById('navbar').offsetHeight
        : 0;

      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();
