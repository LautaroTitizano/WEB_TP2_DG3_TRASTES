/* ══════════════════════════════════════════════════════════════════
   TRASTES — main.js
   Interacciones: nav, reveal on scroll, mapa de guitarra, acordeón
   "el arte" (hover/tap), galería acordeón + cursor magnético,
   testimonios, FAQ, video, contador de stats.

   Todo el sitio vive en un único archivo a propósito: cada bloque de
   funcionalidad está aislado en su propia función/IIFE con nombre, así
   que se puede leer, tocar o borrar una sección sin afectar al resto.
   ══════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  /* ── Utilidad compartida: colapsar/expandir con altura real ──────
     La usan el mapa de la guitarra y el FAQ (paneles simples que sí
     pueden animarse con height:auto vía JS, a diferencia del acordeón
     "El arte", que mide y anima con GSAP más abajo). */
  function expand(el){
    el.style.height = el.scrollHeight + 'px';
  }
  function collapse(el){
    el.style.height = '0px';
  }

  /* ══ 1. NAV — fondo al hacer scroll + menú mobile ═══════════════
     El breakpoint que decide "desktop vs mobile" vive en una sola
     fuente de verdad (matchMedia acá, la misma cifra que el @media
     de css/styles.css). Además de la clase que ya pone el CSS, se
     fuerza un estado explícito con JS en cada resize/zoom: así, aunque
     el navegador redondee mal el viewport en algún nivel de zoom,
     nunca pueden quedar visibles el menú desktop y el botón mobile al
     mismo tiempo — uno de los dos siempre gana. ══ */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  // Mismo corte que el @media (max-width: 1024px) de css/styles.css —
  // si alguna vez se cambia el breakpoint, hay que tocarlo en los dos lados.
  const navDesktopMQ = window.matchMedia('(min-width: 1025px)');

  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  };
  document.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  function syncNavMode(){
    if (!nav) return;
    const isDesktop = navDesktopMQ.matches;
    nav.classList.toggle('nav--is-desktop', isDesktop);
    nav.classList.toggle('nav--is-mobile', !isDesktop);
    // Si el viewport cruza a desktop mientras el overlay mobile está
    // abierto, se cierra: evita el doble menú al cambiar de tamaño.
    if (isDesktop) closeMobileMenu();
  }
  navDesktopMQ.addEventListener('change', syncNavMode);

  function openMobileMenu(){
    mobileMenu.classList.add('mobile-menu--open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }
  function closeMobileMenu(){
    if (!mobileMenu) return;
    mobileMenu.classList.remove('mobile-menu--open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burger && burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }
  syncNavMode();
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

  /* ══ 3b. MADERAS — flip táctil en mobile ═════════════════════════
     El flip 3D normalmente lo dispara :hover (CSS puro). En touch no
     hay hover real, así que un tap agrega/saca .is-flipped. */
  document.querySelectorAll('.pick-card').forEach(card => {
    card.addEventListener('click', () => {
      if (!window.matchMedia('(hover: none)').matches) return; // sólo en touch
      card.classList.toggle('is-flipped');
    });
  });

  /* ══════════════════════════════════════════════════════════════════
     4. "EL ARTE DETRÁS DEL SONIDO" — panel interactivo (hover/tap)
     ══════════════════════════════════════════════════════════════════
     Vive en su propia función con nombre para que se pueda leer y
     tocar de forma aislada del resto del archivo (antes vivía en un
     arte-accordion.js separado; se unificó todo acá adentro, pero
     sigue siendo un módulo autocontenido).

     - Desktop (hover: hover): pasar el mouse expande el panel; los
       demás se atenúan. Sólo un panel abierto a la vez.
     - Mobile / touch: tap para abrir/cerrar. Nada de scroll-jacking.
     - Animaciones con GSAP si está disponible (transform + opacity +
       filter, nunca "top/left"); si no, degrada a un toggle de altura
       simple con la transición ya definida en CSS.
     - El número gigante de fondo hace un crossfade con blur al cambiar
       de etapa, sólo en desktop (en mobile el propio CSS lo oculta).
     ══════════════════════════════════════════════════════════════════ */
  function initArteAccordion(){
    const section = document.querySelector('.arte');
    if (!section) return;

    const items = Array.from(section.querySelectorAll('.arte__item'));
    if (!items.length) return;
    const numEl = document.getElementById('arteNum');
    const hasGSAP = typeof window.gsap !== 'undefined';
    const desktopHover = () => window.matchMedia('(hover: hover) and (min-width: 901px)').matches;

    let activeIndex = 0;

    function measure(item){
      const inner = item.querySelector('.arte__item-inner');
      return inner ? inner.getBoundingClientRect().height : 0;
    }

    function plingUnderline(item, grow){
      const underline = item.querySelector('.arte__item-title-underline');
      if (!underline) return;
      if (!hasGSAP){ underline.style.transform = grow ? 'scaleX(1)' : 'scaleX(0)'; return; }
      gsap.killTweensOf(underline);
      if (grow){
        gsap.fromTo(underline, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'elastic.out(1, 0.4)' });
      } else {
        gsap.to(underline, { scaleX: 0, duration: .3, ease: 'power2.in' });
      }
    }

    function setNumber(index){
      if (!numEl || !desktopHover()) return;
      const next = String(index + 1).padStart(2, '0');
      if (numEl.textContent.trim() === next) return;

      if (!hasGSAP){ numEl.textContent = next; return; }

      gsap.to(numEl, {
        opacity: 0, y: -18, filter: 'blur(8px)', duration: .35, ease: 'power2.in',
        onComplete: () => {
          numEl.textContent = next;
          gsap.fromTo(numEl,
            { opacity: 0, y: 18, filter: 'blur(8px)' },
            { opacity: .08, y: 0, filter: 'blur(0px)', duration: .55, ease: 'power2.out' }
          );
        }
      });
    }

    function openItem(index){
      if (index === activeIndex && items[index].classList.contains('arte__item--active')) return;
      activeIndex = index;

      items.forEach((item, i) => {
        const header = item.querySelector('.arte__item-header');
        const body   = item.querySelector('.arte__item-body');
        const inner  = item.querySelector('.arte__item-inner');
        const isTarget = i === index;

        header.setAttribute('aria-expanded', String(isTarget));
        item.classList.toggle('arte__item--active', isTarget);
        plingUnderline(item, isTarget);

        if (isTarget){
          const h = measure(item);
          if (hasGSAP){
            gsap.to(body, { height: h, duration: .7, ease: 'power3.out' });
            gsap.fromTo(inner,
              { opacity: 0, y: 26, filter: 'blur(6px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6, delay: .12, ease: 'power2.out' }
            );
          } else {
            body.style.height = h + 'px';
          }
        } else if (hasGSAP){
          gsap.to(body, { height: 0, duration: .5, ease: 'power2.inOut' });
        } else {
          body.style.height = '0px';
        }
      });

      setNumber(index);
    }

    function closeAll(){
      items.forEach(item => {
        item.querySelector('.arte__item-header').setAttribute('aria-expanded', 'false');
        item.classList.remove('arte__item--active');
        const body = item.querySelector('.arte__item-body');
        if (hasGSAP) gsap.to(body, { height: 0, duration: .4, ease: 'power2.inOut' });
        else body.style.height = '0px';
        plingUnderline(item, false);
      });
    }

    function openFirstImmediately(){
      const first = items[0];
      const body = first.querySelector('.arte__item-body');
      const h = measure(first);
      if (hasGSAP){
        gsap.set(body, { height: h });
        gsap.set(first.querySelector('.arte__item-title-underline'), { scaleX: 1 });
      } else {
        body.style.height = h + 'px';
      }
    }

    /* Desktop: hover abre (pasar a otro panel ya reemplaza al activo).
       Mobile/touch: tap abre o cierra el propio panel. */
    items.forEach((item, i) => {
      const header = item.querySelector('.arte__item-header');

      header.addEventListener('mouseenter', () => {
        if (!desktopHover()) return;
        items.forEach((other, j) => { if (j !== i) other.classList.add('arte__item--dimmed'); });
        openItem(i);
      });
      header.addEventListener('mouseleave', () => {
        if (!desktopHover()) return;
        items.forEach(other => other.classList.remove('arte__item--dimmed'));
      });

      header.addEventListener('click', () => {
        if (desktopHover()) return; // desktop ya abre con hover
        const isOpen = item.classList.contains('arte__item--active');
        isOpen ? closeAll() : openItem(i);
      });
      header.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        const isOpen = item.classList.contains('arte__item--active');
        isOpen ? closeAll() : openItem(i);
      });
    });

    window.addEventListener('resize', () => {
      const activeItem = items[activeIndex];
      if (activeItem && activeItem.classList.contains('arte__item--active')){
        const body = activeItem.querySelector('.arte__item-body');
        if (hasGSAP) gsap.set(body, { height: measure(activeItem) });
        else body.style.height = measure(activeItem) + 'px';
      }
    });

    if (document.readyState === 'complete') openFirstImmediately();
    else window.addEventListener('load', openFirstImmediately);
  }
  initArteAccordion();

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

  /* ══ 8. VIDEO DEL TALLER ═════════════════════════════════════════
     - mouseenter → arranca el video si no está pausado manualmente.
     - NO se pausa al salir el mouse (a propósito): sólo un click/tap
       lo pausa o lo vuelve a reproducir.
     - Enter/Espacio hacen lo mismo que un click (accesible por teclado). */
  document.querySelectorAll('.video-wrapper').forEach(wrapper => {
    const video = wrapper.querySelector('video');
    if (!video) return;

    let userPaused = false; // true sólo cuando el usuario pausó a propósito

    function play(){
      video.play().catch(() => {}); // catch: autoplay con sonido puede ser bloqueado, el video ya está muted
      wrapper.classList.add('is-playing');
    }
    function pause(){
      video.pause();
      wrapper.classList.remove('is-playing');
    }
    function toggle(){
      if (video.paused){ userPaused = false; play(); }
      else { userPaused = true; pause(); }
    }

    wrapper.addEventListener('mouseenter', () => {
      if (!userPaused) play();
    });
    wrapper.addEventListener('click', toggle);
    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        toggle();
      }
    });
  });

  /* ══════════════════════════════════════════════════════════════════
     8b. VIDEO-SECTION — transición claro↔oscuro con barrido circular
     ══════════════════════════════════════════════════════════════════
     Antes exigía que la sección cubriera el 98% del viewport para
     activarse — eso obligaba al usuario a quedar "justo" en la
     posición exacta, y muchas veces no pasaba. Ahora el disparador es
     una única línea invisible en el centro vertical del viewport
     (rootMargin: -50% arriba y abajo): apenas la sección la cruza, se
     activa, sin importar cuánto cubra en ese momento. Funciona igual
     de bien bajando que subiendo.

     Al activarse (en cualquier dirección) se dispara además el
     barrido circular (.theme-wipe): un círculo sólido que crece desde
     el centro con el mismo timing/easing que el hover de los botones,
     tapa la pantalla un instante, y se desvanece revelando el
     contenido ya en su color final — todas las secciones después del
     video ya son oscuras de forma permanente (ver CSS), así que no
     hace falta "sostener" nada: el barrido sólo disimula el instante
     del cambio para que nunca se sienta como un salto.
     ══════════════════════════════════════════════════════════════════ */
  function initVideoThemeTransition(){
    const videoSection = document.querySelector('.video-section');
    const wipe = document.getElementById('themeWipe');
    if (!videoSection || !('IntersectionObserver' in window)) return;

    let wipeTimers = [];
    function clearWipeTimers(){ wipeTimers.forEach(window.clearTimeout); wipeTimers = []; }

    function fireWipe(toDark){
      if (!wipe) return;
      clearWipeTimers();
      wipe.classList.remove('is-fading');
      wipe.classList.toggle('is-light', !toDark);
      void wipe.offsetWidth; // fuerza reflow: sin esto el navegador puede "fusionar" el reset con la próxima transición y saltearla
      wipe.classList.add('is-covering');
      wipeTimers.push(window.setTimeout(() => {
        wipe.classList.add('is-fading');
        wipeTimers.push(window.setTimeout(() => {
          wipe.classList.remove('is-covering', 'is-fading');
        }, 320));
      }, 600));
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const toDark = entry.isIntersecting;
        if (videoSection.classList.contains('is-inview') === toDark) return;
        videoSection.classList.toggle('is-inview', toDark);
        fireWipe(toDark);
      });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

    observer.observe(videoSection);
  }
  initVideoThemeTransition();

  /* ══ 8c. GRUPOS DE PALABRAS DESTACADAS (.hl--group) ══════════════
     Varias ".hl" pueden convivir en un mismo título (ej: "DE LA IDEA
     / AL INSTRUMENTO"). Pasar el mouse por una baja la opacidad de
     las demás del mismo título — le da protagonismo a una sin que
     haga falta tocar el layout. */
  document.querySelectorAll('.hl--group').forEach(word => {
    const heading = word.closest('h1, h2, h3, h4') || word.parentElement;
    const siblings = Array.from(heading.querySelectorAll('.hl--group')).filter(w => w !== word);
    word.addEventListener('mouseenter', () => siblings.forEach(s => s.classList.add('is-dimmed')));
    word.addEventListener('mouseleave', () => siblings.forEach(s => s.classList.remove('is-dimmed')));
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

  /* ══════════════════════════════════════════════════════════════════
     11. FORMULARIO DE CONTACTO — "Poné en marcha tu proyecto"
     ══════════════════════════════════════════════════════════════════
     Validación en vivo (blur + input), mensajes de error por campo,
     envío simulado con estado de carga en el botón (spinner) y un
     mensaje final accesible (aria-live). No hay backend acá: cuando
     el proyecto tenga uno, sólo hace falta reemplazar el `setTimeout`
     de fakeSubmit() por el fetch/POST real — toda la UI ya está lista.
     ══════════════════════════════════════════════════════════════════ */
  function initContactForm(){
    const form = document.getElementById('contacto-form');
    if (!form) return;

    const submitBtn = document.getElementById('contacto-submit');
    const note = document.getElementById('contacto-note');

    const fields = {
      nombre:  { el: document.getElementById('c-nombre'),  err: document.getElementById('c-nombre-error') },
      email:   { el: document.getElementById('c-email'),   err: document.getElementById('c-email-error') },
      mensaje: { el: document.getElementById('c-mensaje'), err: document.getElementById('c-mensaje-error') }
    };

    const validators = {
      nombre: (v) => v.trim().length >= 2 ? '' : 'Contanos tu nombre (mínimo 2 caracteres).',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Ingresá un email válido.',
      mensaje: (v) => v.trim().length >= 10 ? '' : 'Contanos un poco más (mínimo 10 caracteres).'
    };

    function setFieldError(key, message){
      const { el, err } = fields[key];
      const field = el.closest('.form-field');
      if (message){
        field.classList.add('has-error');
        el.setAttribute('aria-invalid', 'true');
        err.textContent = message;
      } else {
        field.classList.remove('has-error');
        el.removeAttribute('aria-invalid');
        err.textContent = '';
      }
      return !message;
    }

    function validateField(key){
      const value = fields[key].el.value;
      return setFieldError(key, validators[key](value));
    }

    Object.keys(fields).forEach(key => {
      const { el } = fields[key];
      el.addEventListener('blur', () => validateField(key));
      // Mientras escribe, sólo limpia el error (no lo vuelve a mostrar
      // hasta el próximo blur/submit) — molesta menos que validar en cada tecla.
      el.addEventListener('input', () => {
        if (el.closest('.form-field').classList.contains('has-error')) validateField(key);
      });
    });

    function setNote(message, type){
      note.textContent = message;
      note.classList.remove('form-note--ok', 'form-note--error');
      if (type) note.classList.add(type === 'ok' ? 'form-note--ok' : 'form-note--error');
      note.classList.toggle('is-visible', Boolean(message));
    }

    function fakeSubmit(){
      // Simula una llamada a servidor. Reemplazar por un fetch real
      // cuando exista un backend/endpoint de contacto.
      return new Promise((resolve) => window.setTimeout(resolve, 1100));
    }

    let isSubmitting = false;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      const results = Object.keys(fields).map(validateField);
      const firstInvalid = Object.keys(fields).find(key => fields[key].el.closest('.form-field').classList.contains('has-error'));
      if (!results.every(Boolean)){
        fields[firstInvalid].el.focus();
        setNote('Revisá los campos marcados antes de enviar.', 'error');
        return;
      }

      isSubmitting = true;
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
      setNote('', null);

      try {
        await fakeSubmit();
        setNote('¡Listo! Te vamos a responder a la brevedad.', 'ok');
        form.reset();
      } catch {
        setNote('Algo salió mal. Probá de nuevo en unos minutos.', 'error');
      } finally {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        isSubmitting = false;
      }
    });
  }
  initContactForm();

})();