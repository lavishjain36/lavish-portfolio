/**
 * Full Stack Java Developer - Portfolio
 * Sticky nav, theme toggle, smooth scroll, section animations
 */

(function () {
  'use strict';

  const NAV = document.getElementById('navbar');
  const THEME_TOGGLE = document.getElementById('theme-toggle');
  const MOBILE_MENU_BTN = document.getElementById('mobile-menu-btn');
  const MOBILE_MENU = document.getElementById('mobile-menu');
  const NAV_LINKS = document.querySelectorAll('.nav-link');
  const MOBILE_NAV_LINKS = document.querySelectorAll('.mobile-nav-link');
  const SECTIONS = document.querySelectorAll('section[id]');
  const FOOTER_YEAR = document.getElementById('year');

  // ----- Theme (Dark / Light) -----
  function getPreferredTheme() {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }

  function initTheme() {
    setTheme(getPreferredTheme());
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    setTheme(isDark ? 'dark' : 'light');
  }

  if (THEME_TOGGLE) {
    THEME_TOGGLE.addEventListener('click', toggleTheme);
  }

  initTheme();

  // ----- Sticky Nav & Scroll -----
  function updateNavbar() {
    if (!NAV) return;
    if (window.scrollY > 20) {
      NAV.classList.add('scrolled');
    } else {
      NAV.classList.remove('scrolled');
    }
  }

  function setActiveNavLink() {
    const scrollY = window.scrollY + 100;
    let current = '';
    SECTIONS.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height && id) {
        current = id;
      }
    });
    NAV_LINKS.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  function handleSmoothScroll(e) {
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (MOBILE_MENU && MOBILE_MENU.classList.contains('hidden') === false) {
          MOBILE_MENU.classList.add('hidden');
        }
      }
    }
  }

  NAV_LINKS.forEach(function (link) {
    link.addEventListener('click', handleSmoothScroll);
  });
  MOBILE_NAV_LINKS.forEach(function (link) {
    link.addEventListener('click', handleSmoothScroll);
  });

  window.addEventListener('scroll', function () {
    updateNavbar();
    setActiveNavLink();
  });
  window.addEventListener('load', updateNavbar);

  // ----- Mobile Menu -----
  if (MOBILE_MENU_BTN && MOBILE_MENU) {
    MOBILE_MENU_BTN.addEventListener('click', function () {
      MOBILE_MENU.classList.toggle('hidden');
    });
  }

  // ----- Section animations (Intersection Observer) -----
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section-animate').forEach(function (el) {
    observer.observe(el);
  });

  // ----- Footer year -----
  if (FOOTER_YEAR) {
    FOOTER_YEAR.textContent = new Date().getFullYear();
  }

  // ----- Certifications carousel -----
  const certTrack = document.getElementById('cert-track');
  const certPrev = document.getElementById('cert-prev');
  const certNext = document.getElementById('cert-next');
  const certDotsContainer = document.getElementById('cert-dots');

  if (certTrack && certDotsContainer) {
    const slides = certTrack.querySelectorAll('.cert-slide');
    const total = slides.length;
    let currentIndex = 0;

    function updateCertCarousel() {
      if (!certTrack) return;
      const offset = -currentIndex * 100;
      certTrack.style.transform = 'translateX(' + offset + '%)';
      certDotsContainer.querySelectorAll('.cert-dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
        dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
      });
    }

    function buildDots() {
      certDotsContainer.innerHTML = '';
      for (var i = 0; i < total; i++) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cert-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', 'Go to certification ' + (i + 1));
        btn.setAttribute('aria-current', i === 0 ? 'true' : 'false');
        (function (idx) {
          btn.addEventListener('click', function () {
            currentIndex = idx;
            updateCertCarousel();
          });
        })(i);
        certDotsContainer.appendChild(btn);
      }
    }

    if (certPrev) {
      certPrev.addEventListener('click', function () {
        currentIndex = currentIndex <= 0 ? total - 1 : currentIndex - 1;
        updateCertCarousel();
      });
    }
    if (certNext) {
      certNext.addEventListener('click', function () {
        currentIndex = currentIndex >= total - 1 ? 0 : currentIndex + 1;
        updateCertCarousel();
      });
    }

    buildDots();
    updateCertCarousel();
  }
})();
