(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const features = [
    {
      title: 'Ogni immobile sotto controllo',
      copy: 'Centralizza dati anagrafici, costi fissi, performance, conformità e rendimento di ogni struttura.',
      detail: 'Immobili, costi fissi e rendimento',
      label: 'Immobili'
    },
    {
      title: 'Dal soggiorno al margine reale',
      copy: 'Controlla prenotazioni, canali, notti, ricavi, commissioni e contribuzione di ogni soggiorno.',
      detail: 'Prenotazioni, ricavi e costi diretti',
      label: 'Prenotazioni'
    },
    {
      title: 'Disponibilità e blocchi in una sola vista',
      copy: 'Leggi occupazione, soggiorni, uso proprietario e manutenzioni direttamente sul calendario.',
      detail: 'Occupazione, blocchi e disponibilità',
      label: 'Calendario'
    },
    {
      title: 'Ricavi, costi e utile senza fogli paralleli',
      copy: 'HOST OS costruisce automaticamente il quadro economico con margini, ROI, ADR, RevPAR e punto di pareggio.',
      detail: 'Ricavi, costi, utile e rendimento',
      label: 'Redditività'
    }
  ];

  const tabs = $$('.feature-tabs button');
  const screens = $$('.scroll-screen');
  const featureCopy = $('#feature-panel .feature-copy');
  const featureTitle = $('#feature-panel .feature-copy h3');
  const featureParagraph = $('#feature-panel .feature-copy p');
  const featureDetail = $('#feature-panel .feature-detail');
  const featureBottom = $('#feature-panel .screen-bottom > span');
  const screenStage = $('#feature-panel .screen-stage');
  const chapterProgress = $('#feature-panel .chapter-progress span');
  const explorerSection = $('.explorer-section');

  let currentFeature = -1;
  let explorerProgress = 0;
  let scrollTicking = false;

  function selectFeature(index, options = {}) {
    const next = Math.max(0, Math.min(features.length - 1, Number(index) || 0));
    if (next === currentFeature && !options.force) return;

    currentFeature = next;
    const feature = features[next];

    tabs.forEach((button, i) => {
      const active = i === next;
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.tabIndex = active ? 0 : -1;
    });

    screens.forEach((image, i) => {
      const active = i === next;
      image.style.opacity = active ? '1' : '0';
      image.style.transform = active ? 'translateY(0) scale(1)' : 'translateY(18px) scale(.982)';
      image.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    if (featureCopy) featureCopy.classList.add('is-switching');
    if (screenStage) {
      screenStage.classList.remove('is-changing');
      void screenStage.offsetWidth;
      screenStage.classList.add('is-changing');
    }

    const applyText = () => {
      if (featureTitle) featureTitle.textContent = feature.title;
      if (featureParagraph) featureParagraph.textContent = feature.copy;
      if (featureDetail) featureDetail.textContent = feature.detail;
      if (featureBottom) featureBottom.textContent = feature.label;
      if (featureCopy) featureCopy.classList.remove('is-switching');
    };

    if (reduceMotion) applyText();
    else window.setTimeout(applyText, 125);
  }

  function setChapterProgress(progress) {
    explorerProgress = clamp(progress);
    if (chapterProgress) chapterProgress.style.transform = `scaleX(${explorerProgress})`;
  }

  function explorerMetrics() {
    if (!explorerSection || window.innerWidth < 768) return null;
    const top = explorerSection.offsetTop;
    const travel = Math.max(1, explorerSection.offsetHeight - window.innerHeight);
    const y = clamp((window.scrollY - top + 110) / travel);
    return { progress: y, travel, top };
  }

  function updateExplorerFromScroll() {
    const metrics = explorerMetrics();
    if (!metrics) return;
    const scaled = metrics.progress * features.length;
    const index = Math.min(features.length - 1, Math.floor(scaled));
    selectFeature(index, { fromScroll: true });
    setChapterProgress(metrics.progress);
  }

  function scrollToFeature(index) {
    if (!explorerSection || window.innerWidth < 768) {
      selectFeature(index, { force: true });
      return;
    }
    const travel = Math.max(1, explorerSection.offsetHeight - window.innerHeight);
    const targetProgress = (index + 0.12) / features.length;
    const target = explorerSection.offsetTop + targetProgress * travel - 105;
    window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  tabs.forEach((button, index) => {
    button.addEventListener('click', () => scrollToFeature(index));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % features.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + features.length) % features.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = features.length - 1;
      tabs[next]?.focus();
      scrollToFeature(next);
    });
  });

  selectFeature(0, { force: true });
  setChapterProgress(0);

  // Scroll-driven luminous workflow.
  const flowSection = $('#come-funziona');
  const flowTrack = flowSection ? $('.flow-track', flowSection) : null;
  const flowItems = flowSection ? $$('.flow-line li', flowSection) : [];

  function updateFlow() {
    if (!flowSection || !flowTrack) return;
    const rect = flowSection.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    const start = viewport * 0.78;
    const end = Math.min(viewport * 0.26, rect.height * 0.16);
    const denominator = Math.max(1, rect.height + start - end);
    const progress = clamp((start - rect.top) / denominator);

    flowTrack.style.setProperty('--flow-progress', progress.toFixed(4));

    flowItems.forEach((item, index) => {
      const threshold = flowItems.length <= 1 ? 0 : index / (flowItems.length - 1);
      item.classList.toggle('is-active', progress + 0.04 >= threshold);
    });
  }

  // Premium reveal system with stagger.
  const revealTargets = [
    ...$$('.hero-copy > *'),
    ...$$('.section-intro'),
    ...$$('.dual-card'),
    ...$$('.analytics-surface'),
    ...$$('.included-list li'),
    ...$$('.package-display'),
    ...$$('.film-stage'),
    ...$$('.pricing-layout'),
    ...$$('.pricing-reassurance'),
    ...$$('.faq-item'),
    ...$$('.footer-top')
  ];

  revealTargets.forEach((element, index) => {
    if (element.closest('.explorer-sticky')) return;
    element.classList.add('reveal-on-scroll');
    if (element.matches('.dual-card,.analytics-surface,.package-display,.film-stage')) {
      element.classList.add('reveal-scale');
    }
    element.style.setProperty('--reveal-delay', `${Math.min((index % 5) * 55, 220)}ms`);
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    revealTargets.forEach(element => revealObserver.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add('is-revealed'));
  }

  // FAQ.
  $$('.faq-trigger').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const answer = $('.faq-answer', item);
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', open ? 'false' : 'true');
    item.classList.toggle('open', !open);
    if (answer) answer.hidden = open;
  }));

  // Dialog helpers.
  const purchaseDialog = $('#purchase-dialog');
  function openDialog(dialog) {
    if (dialog && !dialog.open) dialog.showModal();
  }
  $$('.nav-buy,.hero-buy,.price-buy,.cart-trigger').forEach(button => {
    button.addEventListener('click', () => openDialog(purchaseDialog));
  });
  $$('dialog .dialog-close').forEach(button => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  });
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  });

  // Contact dialog. Legal pages now use dedicated HTML pages.
  const infoDialog = $('#info-dialog-custom');
  const infoTitle = $('#info-dialog-title');
  const infoCopy = $('#info-dialog-copy');
  const infoData = {
    contatti: [
      'Contatti',
      'Il contatto di supporto definitivo verrà inserito prima dell’apertura del checkout. Per ora questa pagina è una preview commerciale.'
    ]
  };
  $$('[data-info]').forEach(button => button.addEventListener('click', () => {
    const data = infoData[button.dataset.info];
    if (!data) return;
    if (infoTitle) infoTitle.textContent = data[0];
    if (infoCopy) infoCopy.innerHTML = `<p>${data[1]}</p>`;
    openDialog(infoDialog);
  }));

  // Image viewer.
  const imageDialog = $('#image-dialog-custom');
  const imageView = imageDialog ? $('.image-viewer-img', imageDialog) : null;
  const imageTitle = $('#image-dialog-title');
  function showImage(image, title) {
    if (!image || !imageView) return;
    imageView.src = image.src;
    imageView.alt = image.alt || 'Schermata HOST OS';
    if (imageTitle) imageTitle.textContent = title || 'HOST OS';
    openDialog(imageDialog);
  }

  const dashboardImage = $('.dashboard-frame img');
  const analyticsImage = $('#analytics-visual img');
  $('.dashboard-frame')?.addEventListener('click', () => showImage(dashboardImage, 'Panoramica HOST OS'));
  $('#analytics-visual')?.addEventListener('click', () => showImage(analyticsImage, 'Analytics HOST OS'));
  $('.analytics-open-caption')?.addEventListener('click', () => showImage(analyticsImage, 'Analytics HOST OS'));
  $('#explorer-zoom')?.addEventListener('click', () => {
    const selected = Math.max(0, currentFeature);
    showImage(screens[selected], features[selected].label);
  });
  $$('.image-open').forEach(button => {
    if (button.id === 'explorer-zoom' || button.classList.contains('analytics-open-caption')) return;
    if (button.closest('.hero-product')) {
      button.addEventListener('click', () => showImage(dashboardImage, 'Panoramica HOST OS'));
    }
  });

  // Mobile nav.
  const menuToggle = $('.menu-toggle');
  const mobilePanel = $('#mobile-panel');
  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener('click', () => {
      const open = mobilePanel.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', mobilePanel).forEach(link => link.addEventListener('click', () => {
      mobilePanel.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Smooth in-page anchors only.
  $$('a[href^="#"]').forEach(anchor => anchor.addEventListener('click', event => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = $(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));

  // Header state + all scroll-driven effects in one rAF loop.
  const header = $('.site-header');
  function updateScrollEffects() {
    scrollTicking = false;
    header?.classList.toggle('is-scrolled', window.scrollY > 16);
    updateExplorerFromScroll();
    updateFlow();
  }
  function requestScrollUpdate() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateScrollEffects);
  }
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  updateScrollEffects();
})();
