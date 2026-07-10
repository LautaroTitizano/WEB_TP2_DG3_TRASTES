/* ══════════════════════════════════════════════════════════════════
   TRASTES — main.js
   Interacciones: nav, reveal on scroll, mapa de guitarra, acordeón
   "el arte", galería acordeón + cursor magnético, testimonios,
   FAQ, video, contador de stats.
   ══════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  /* ── Utilidad: colapsar/expandir con altura real ─────────────── */
  function expand(el){
    el.style.height = el.scrollHeight + 'px';
  }
  function collapse(el){
    el.style.height = '0px';
  }

  /* ══ 1. NAV — fondo al hacer scroll + menú mobile ═══════════════ */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  };
  document.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  function openMobileMenu(){
    mobileMenu.classList.add('mobile-menu--open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }
  function closeMobileMenu(){
    mobileMenu.classList.remove('mobile-menu--open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }
  if (burger && mobileMenu){
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('mobile-menu--open');
      isOpen ? closeMobileMenu() : openMobileMenu();
    });
    mobileClose && mobileClose.addEventListener('click', closeMobileMenu);
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  /* ══ 2. REVEAL ON SCROLL — IntersectionObserver ═════════════════ */
  const revealEls = document.querySelectorAll('.reveal, .clip-reveal');
  if ('IntersectionObserver' in window && revealEls.length){
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('reveal--visible'));
  }

  /* ══ 3. MAPA DE LA GUITARRA — click cambia info adyacente ══════ */
  const parteButtons = document.querySelectorAll('.parte__btn');
  const componentesImage = document.getElementById('componentesImage');

  function setActiveParte(btn){
    parteButtons.forEach(b => {
      const item = b.closest('.parte');
      const body = item.querySelector('.parte__body');
      const isTarget = b === btn;
      item.classList.toggle('parte--active', isTarget);
      b.setAttribute('aria-expanded', String(isTarget));
      if (isTarget){
        expand(body);
      } else {
        collapse(body);
      }
    });
  }

  parteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setActiveParte(btn);
      const src = btn.getAttribute('data-image');
      if (src && componentesImage && componentesImage.getAttribute('src') !== src){
        componentesImage.style.opacity = '0';
        window.setTimeout(() => {
          componentesImage.setAttribute('src', src);
          componentesImage.style.opacity = '1';
        }, 180);
      }
    });
  });
  // Estado inicial: abrir el primer ítem activo
  const initialActive = document.querySelector('.parte--active .parte__btn');
  if (initialActive) setActiveParte(initialActive);

  /* ══ 4. ACORDEÓN "EL ARTE DETRÁS DEL SONIDO" ════════════════════ */
  const arteHeaders = document.querySelectorAll('.arte__item-header');
  arteHeaders.forEach(header => {
    const item = header.closest('.arte__item');
    const body = item.querySelector('.arte__item-body');

    header.addEventListener('click', () => toggleArte(item, header, body));
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        toggleArte(item, header, body);
      }
    });
  });

  function toggleArte(item, header, body){
    const isOpen = item.classList.contains('arte__item--open');
    // Cerrar todos
    document.querySelectorAll('.arte__item--open').forEach(openItem => {
      if (openItem !== item){
        openItem.classList.remove('arte__item--open');
        openItem.querySelector('.arte__item-header').setAttribute('aria-expanded', 'false');
        collapse(openItem.querySelector('.arte__item-body'));
      }
    });
    if (isOpen){
      item.classList.remove('arte__item--open');
      header.setAttribute('aria-expanded', 'false');
      collapse(body);
    } else {
      item.classList.add('arte__item--open');
      header.setAttribute('aria-expanded', 'true');
      expand(body);
    }
  }

  // Abrir el primer ítem por defecto para dar contexto visual
  const firstArte = document.querySelector('.arte__item');
  if (firstArte){
    const h = firstArte.querySelector('.arte__item-header');
    const b = firstArte.querySelector('.arte__item-body');
    toggleArte(firstArte, h, b);
  }

  /* ══ 5. GALERÍA — acordeón horizontal + cursor magnético ═══════ */
  const galeriaAccordion = document.getElementById('galeriaAccordion');
  const galeriaCursor = document.getElementById('galeriaCursor');
  const galeriaCols = document.querySelectorAll('.galeria-col');

  function setGaleriaBackgrounds(){
    galeriaCols.forEach(col => {
      const bg = col.querySelector('.galeria-col__bg');
      const img = col.getAttribute('data-img');
      if (bg && img) bg.style.backgroundImage = `url("${img}")`;
    });
  }
  setGaleriaBackgrounds();

  function activateCol(col){
    galeriaCols.forEach(c => c.classList.toggle('is-active', c === col));
  }
  function deactivateAll(){
    galeriaCols.forEach(c => c.classList.remove('is-active'));
  }

  galeriaCols.forEach(col => {
    col.addEventListener('mouseenter', () => {
      if (window.matchMedia('(hover: hover)').matches) activateCol(col);
    });
    col.addEventListener('click', () => {
      const isActive = col.classList.contains('is-active');
      isActive ? deactivateAll() : activateCol(col);
    });
    col.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        const isActive = col.classList.contains('is-active');
        isActive ? deactivateAll() : activateCol(col);
      }
    });
    const closeBtn = col.querySelector('.galeria-col__close');
    closeBtn && closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deactivateAll();
    });
  });

  // Activar la primera columna al cargar (desktop) para dar contexto
  if (galeriaCols.length && window.matchMedia('(hover: hover)').matches){
    activateCol(galeriaCols[0]);
  }

  // Cursor magnético — sólo desktop con hover real
  if (galeriaAccordion && galeriaCursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    let rafId = null;
    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    function loopCursor(){
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      galeriaCursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%,-50%) scale(1)`;
      rafId = requestAnimationFrame(loopCursor);
    }

    galeriaAccordion.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      galeriaCursor.style.display = 'block';
      galeriaCursor.classList.add('galeria__cursor--visible');
      if (!rafId) loopCursor();
    });
    galeriaAccordion.addEventListener('mouseleave', () => {
      galeriaCursor.classList.remove('galeria__cursor--visible');
    });
  }

  /* ══ 6. TESTIMONIOS — carrusel con controles + dots ═════════════ */
  const carousel = document.getElementById('testimoniosCarousel');
  const prevBtn = document.getElementById('testimoniosPrev');
  const nextBtn = document.getElementById('testimoniosNext');
  const dotsWrap = document.getElementById('testimoniosDots');

  if (carousel){
    const cards = Array.from(carousel.querySelectorAll('.testimonio-card'));

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonios__dot';
      dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
      dot.addEventListener('click', () => scrollToCard(i));
      dotsWrap && dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

    function scrollToCard(i){
      const card = cards[i];
      if (!card) return;
      carousel.scrollTo({ left: card.offsetLeft - carousel.offsetLeft, behavior: 'smooth' });
    }

    function updateDots(){
      const scrollLeft = carousel.scrollLeft;
      let closest = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - carousel.offsetLeft - scrollLeft);
        if (dist < closestDist){ closestDist = dist; closest = i; }
      });
      dots.forEach((d, i) => d.classList.toggle('testimonios__dot--active', i === closest));
    }

    carousel.addEventListener('scroll', () => {
      window.clearTimeout(carousel._t);
      carousel._t = window.setTimeout(updateDots, 80);
    }, { passive: true });

    prevBtn && prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -(cards[0].offsetWidth + 20), behavior: 'smooth' });
    });
    nextBtn && nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: cards[0].offsetWidth + 20, behavior: 'smooth' });
    });

    updateDots();
  }

  /* ══ 7. FAQ — acordeón ═══════════════════════════════════════════ */
  document.querySelectorAll('.faq__item').forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq__question[aria-expanded="true"]').forEach(q => {
        if (q !== question){
          q.setAttribute('aria-expanded', 'false');
          collapse(q.closest('.faq__item').querySelector('.faq__answer'));
        }
      });
      question.setAttribute('aria-expanded', String(!isOpen));
      isOpen ? collapse(answer) : expand(answer);
    });
  });

  /* ══ 8. VIDEO DEL TALLER — reproducir al hacer clic ═════════════ */
  document.querySelectorAll('.video-wrapper').forEach(wrapper => {
    const video = wrapper.querySelector('video');
    if (!video) return;
    wrapper.addEventListener('click', () => {
      const playing = wrapper.classList.contains('is-playing');
      if (playing){
        video.pause();
        wrapper.classList.remove('is-playing');
      } else {
        video.play().catch(() => {});
        wrapper.classList.add('is-playing');
      }
    });
  });

  /* ══ 9. STATS — contador numérico al entrar en viewport ═════════ */
  const statValues = document.querySelectorAll('.stat-item__value');
  if ('IntersectionObserver' in window && statValues.length){
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statValues.forEach(el => statObserver.observe(el));
  }

  function animateCount(el){
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    function frame(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(frame);
  }

  /* ══ 10. PARALLAX SUAVE — imágenes de proceso de alta resolución ══
     Aplica un desplazamiento leve a .img-bw dentro de secciones con
     scroll normal (no a las sticky, que ya tienen su propio efecto). */
  const parallaxTargets = document.querySelectorAll('.arte__item-image img, .curso-card__image img');
  if (parallaxTargets.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches){
    let ticking = false;
    function updateParallax(){
      const vh = window.innerHeight;
      parallaxTargets.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
        img.style.transform = `translateY(${centerOffset * 18}px) scale(1.08)`;
      });
      ticking = false;
    }
    document.addEventListener('scroll', () => {
      if (!ticking){
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }

})();
