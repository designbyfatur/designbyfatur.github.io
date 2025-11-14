// js/script.js

// -------------------------------
// 1) Footer year
// -------------------------------
(function setYear() {
  const yearEl = document.getElementById('year');
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
})();

// -------------------------------
// 2) Theme toggle (light / dark)
// -------------------------------
(function themeSetup() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const THEME_KEY = 'portfolio-theme';

  if (!toggleBtn) return;

  function applyTheme(theme) {
    const safe = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', safe);
    try {
      localStorage.setItem(THEME_KEY, safe);
    } catch (_) {
      // ignore
    }
  }

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {
      // ignore
    }
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      return 'light';
    }
    return 'dark';
  }

  // initial
  applyTheme(getInitialTheme());

  // click toggle
  toggleBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
  });

  // optional: toggle via keyboard "T"
  window.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
    }
  });
})();

// -------------------------------
// 3) Smooth scroll with header offset
// -------------------------------
(function smoothNavScroll() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.header-nav a, .logo');

  if (!header || !navLinks.length) return;

  function scrollToTarget(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const headerHeight = header.offsetHeight || 68;
    const offset = window.scrollY + rect.top - (headerHeight + 8);

    window.scrollTo({
      top: offset,
      behavior: 'smooth',
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      scrollToTarget(href);
    });
  });
})();

// -------------------------------
// 4) Horizontal scroll with mouse wheel
//    for capabilities & work track
// -------------------------------
(function horizontalScrollEnhance() {
  const tracks = document.querySelectorAll('.capabilities-track, .work-track');
  if (!tracks.length) return;

  tracks.forEach((track) => {
    track.addEventListener(
      'wheel',
      (e) => {
        // only hijack if horizontal scroll is relevant
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          track.scrollLeft += e.deltaY * 0.8;
        }
      },
      { passive: false }
    );
  });
})();

// -------------------------------
// 5) Scroll reveal animations
// -------------------------------
(function scrollReveal() {
  const revealEls = [
    ...document.querySelectorAll('.cap-card'),
    ...document.querySelectorAll('.work-card'),
    ...document.querySelectorAll('.about-block'),
    ...document.querySelectorAll('.experience-block'),
    ...document.querySelectorAll('.contact-main'),
    ...document.querySelectorAll('.contact-side'),
  ];

  if (!revealEls.length) return;

  // set initial state inline (no need to change CSS)
  revealEls.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
  });

  function revealElement(el, delayIndex) {
    const delay = Math.min(delayIndex * 80, 240); // max 240ms extra
    el.style.transitionDelay = delay + 'ms';
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const index = revealEls.indexOf(el);
          revealElement(el, index === -1 ? 0 : index);
          observer.unobserve(el);
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15,
      }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // fallback: show everything if no IntersectionObserver
    revealEls.forEach((el, idx) => revealElement(el, idx));
  }
})();

// -------------------------------
// 6) Hero photo subtle parallax
// -------------------------------
(function heroParallax() {
  const frame = document.querySelector('.hero-photo-frame');
  if (!frame) return;

  let lastX = 0;
  let lastY = 0;
  let ticking = false;

  function onMove(e) {
    const rect = frame.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    lastX = x;
    lastY = y;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rotateX = lastY * -6; // angle small
        const rotateY = lastX * 6;
        const translateY = lastY * -4;

        frame.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        frame.style.transformStyle = 'preserve-3d';
        frame.style.transition = 'transform 0.14s ease-out';

        ticking = false;
      });
      ticking = true;
    }
  }

  function reset() {
    frame.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    frame.style.transition = 'transform 0.25s ease-out';
  }

  frame.addEventListener('mousemove', onMove);
  frame.addEventListener('mouseleave', reset);
})();
