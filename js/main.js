/**
 * main.js
 * Only For Seniors — GSAP animations, navigation, interactivity
 * Requires: GSAP 3.x + ScrollTrigger (loaded via CDN before this script)
 */

(function () {
  'use strict';

  /* ============================================================
     Utility — wait for GSAP + ScrollTrigger to be available
     ============================================================ */
  function waitForGSAP(cb, attempts) {
    attempts = attempts || 0;
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      cb();
    } else if (attempts < 60) {
      setTimeout(function () { waitForGSAP(cb, attempts + 1); }, 100);
    } else {
      // Graceful fallback — show everything without animation
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }

  /* ============================================================
     Footer — dynamic year
     ============================================================ */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     Navigation — scroll behaviour & hamburger menu
     ============================================================ */
  var navbar      = document.getElementById('navbar');
  var hamburger   = document.getElementById('hamburger-btn');
  var mobileMenu  = document.getElementById('mobile-menu');
  var menuOpen    = false;

  function closeMobileMenu() {
    menuOpen = false;
    if (hamburger)   { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
    if (mobileMenu)  { mobileMenu.classList.remove('open'); mobileMenu.setAttribute('aria-hidden', 'true'); }
    document.body.style.overflow = '';
  }

  // Expose globally so inline onclick can call it
  window.closeMobileMenu = closeMobileMenu;

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      menuOpen = !menuOpen;
      hamburger.classList.toggle('open', menuOpen);
      hamburger.setAttribute('aria-expanded', String(menuOpen));
      mobileMenu.classList.toggle('open', menuOpen);
      mobileMenu.setAttribute('aria-hidden', String(!menuOpen));
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });
  }

  // Keyboard: close mobile menu on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) closeMobileMenu();
  });

  // Navbar scroll state
  var lastScrollY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 60);
    lastScrollY = y;
  }, { passive: true });

  // Close mobile menu if viewport becomes desktop width
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024 && menuOpen) closeMobileMenu();
  });

  /* ============================================================
     GSAP — hero entrance
     ============================================================ */
  function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero elements stagger in on page load
    var heroTL = gsap.timeline({ delay: 0.3 });

    heroTL
      .from('.hero-badge', {
        opacity: 0, y: 30, duration: 0.7, ease: 'power3.out'
      })
      .from('.hero-title', {
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out'
      }, '-=0.4')
      .from('.hero-sub', {
        opacity: 0, y: 30, duration: 0.7, ease: 'power3.out'
      }, '-=0.5')
      .from('.hero-actions', {
        opacity: 0, y: 25, duration: 0.6, ease: 'power3.out'
      }, '-=0.45')
      .from('.hero-hint', {
        opacity: 0, duration: 0.5, ease: 'power2.out'
      }, '-=0.3')
      .from('.hero-stats', {
        opacity: 0, y: 20, duration: 0.6, ease: 'power3.out'
      }, '-=0.3')
      .from('.scroll-hint', {
        opacity: 0, duration: 0.5, ease: 'power2.out'
      }, '-=0.1');

    /* ── ScrollTrigger — section reveal (.reveal elements) ── */
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out'
        });
      },
      once: true
    });

    /* ── Category cards — stagger on scroll ── */
    gsap.utils.toArray('.cat-card').forEach(function (card, i) {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          gsap.fromTo(card,
            { opacity: 0, y: 50, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out', delay: (i % 3) * 0.08 }
          );
        }
      });
    });

    /* ── Category card hover — micro-spring ── */
    document.querySelectorAll('.cat-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        gsap.to(card, { y: -6, duration: 0.3, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      });
      // Keyboard support
      card.addEventListener('focus', function () {
        gsap.to(card, { y: -4, duration: 0.3, ease: 'power2.out' });
      });
      card.addEventListener('blur', function () {
        gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
      });
    });

    /* ── How It Works steps — slide in from sides ── */
    gsap.utils.toArray('.hiw-step').forEach(function (step, i) {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          gsap.fromTo(step,
            { opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 },
            { opacity: 1, x: 0, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.1 }
          );
        }
      });
    });

    /* ── Testimonial cards pop in ── */
    gsap.utils.toArray('.testi-card').forEach(function (card, i) {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          gsap.fromTo(card,
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'back.out(1.3)', delay: i * 0.12 }
          );
        }
      });
    });

    /* ── Trust band counter animation ── */
    ScrollTrigger.create({
      trigger: '#trust-band',
      start: 'top 85%',
      once: true,
      onEnter: function () {
        document.querySelectorAll('#trust-band .trust-num[data-count]').forEach(function (el) {
          var target = parseInt(el.getAttribute('data-count'), 10);
          var obj    = { val: 0 };
          var suffix = el.textContent.includes('+') ? '+' : '';
          var prefix = el.textContent.startsWith('$') ? '$' : '';
          gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = prefix + Math.round(obj.val) + suffix;
            },
            onComplete: function () {
              el.textContent = prefix + target + suffix;
            }
          });
        });
      }
    });

    /* ── Pricing card entrance ── */
    ScrollTrigger.create({
      trigger: '.pricing-card',
      start: 'top 85%',
      once: true,
      onEnter: function () {
        gsap.fromTo('.pricing-card',
          { opacity: 0, y: 60, rotateY: 8 },
          { opacity: 1, y: 0, rotateY: 0, duration: 0.85, ease: 'power3.out' }
        );
      }
    });

    /* ── CTA band parallax text ── */
    gsap.to('#cta-band .cta-title', {
      scrollTrigger: {
        trigger: '#cta-band',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -18,
      ease: 'none'
    });

    /* ── Navbar links hover underline spring ── */
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        gsap.to(link, { scale: 1.04, duration: 0.2, ease: 'power2.out' });
      });
      link.addEventListener('mouseleave', function () {
        gsap.to(link, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
      });
    });

    /* ── Button press ripple ── */
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('pointerdown', function () {
        gsap.to(btn, { scale: 0.96, duration: 0.1, ease: 'power2.in' });
      });
      btn.addEventListener('pointerup', function () {
        gsap.to(btn, { scale: 1, duration: 0.35, ease: 'elastic.out(1.2, 0.5)' });
      });
      btn.addEventListener('pointerleave', function () {
        gsap.to(btn, { scale: 1, duration: 0.25, ease: 'power2.out' });
      });
    });

    /* ── Info banner slide in ── */
    gsap.from('.info-banner', {
      y: -40, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.1
    });
  }

  /* ============================================================
     Search — filter categories by keyword
     ============================================================ */
  function initSearch() {
    var input = document.getElementById('service-search');
    if (!input) return;

    input.addEventListener('input', function () {
      var query  = input.value.trim().toLowerCase();
      var cards  = document.querySelectorAll('.cat-card');

      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          card.style.display = '';
          gsap.to(card, { opacity: 1, scale: 1, duration: 0.25 });
        } else {
          gsap.to(card, {
            opacity: 0.2, scale: 0.97, duration: 0.25,
            onComplete: function () { card.style.display = ''; }
          });
        }
      });
    });

    // Clear on Escape
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        input.blur();
      }
    });
  }

  /* ============================================================
     Category cards — click/tap "bounce" effect
     ============================================================ */
  function initCategoryCards() {
    document.querySelectorAll('.cat-card').forEach(function (card) {
      card.addEventListener('click', function () {
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(card,
            { scale: 0.96 },
            { scale: 1, duration: 0.5, ease: 'elastic.out(1.2, 0.5)' }
          );
        }
      });
    });
  }

  /* ============================================================
     Smooth scroll for anchor links (iOS fallback)
     ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          var offset = document.getElementById('navbar')
            ? document.getElementById('navbar').offsetHeight + 8
            : 72;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ============================================================
     Active nav link highlight on scroll
     ============================================================ */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function onScroll() {
      var scrollPos = window.scrollY + 120;
      sections.forEach(function (section) {
        if (
          scrollPos >= section.offsetTop &&
          scrollPos < section.offsetTop + section.offsetHeight
        ) {
          var id = '#' + section.getAttribute('id');
          navLinks.forEach(function (link) {
            var isActive = link.getAttribute('href') === id;
            link.style.color       = isActive ? 'var(--amber-400)' : '';
            link.style.background  = isActive ? 'rgba(255,255,255,.08)' : '';
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ============================================================
     Boot
     ============================================================ */
  function init() {
    initSearch();
    initCategoryCards();
    initSmoothScroll();
    initActiveNav();
    waitForGSAP(initGSAP);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
