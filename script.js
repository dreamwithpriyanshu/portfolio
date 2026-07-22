/* ============================================================
   Dream with Priyanshu — Portfolio Script
   ============================================================ */

(function () {
  'use strict';

  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  var scrollProgress = document.getElementById('scrollProgress');
  var particles = document.getElementById('particles');
  var ease = 'cubic-bezier(0.4, 0, 0.2, 1)';

  /* ----------------------------------------------------------
     INTRO TRANSITION — ~5s, typed feel
     ---------------------------------------------------------- */
  (function runIntro() {
    var overlay = document.getElementById('introOverlay');
    if (!overlay) return;

    var lines = [
      document.getElementById('introLine1'),
      document.getElementById('introLine2'),
      document.getElementById('introLine3')
    ];
    var brand = document.getElementById('introBrand');
    var track = document.querySelector('.intro-bar-track');
    var bar = document.getElementById('introBar');

    document.body.style.overflow = 'hidden';

    // Timing: each line shows for ~800ms, fades before next
    var startDelay = 500;   // initial pause
    var lineShow = 800;     // time each line is visible
    var fadeTime = 300;      // overlap between fade-out and next show

    setTimeout(function() {
      if(track) track.classList.add('visible');
    }, startDelay);

    lines.forEach(function (line, i) {
      if (!line) return;
      
      // Show line
      var showAt = startDelay + i * (lineShow + fadeTime);
      setTimeout(function () {
        line.classList.add('visible');
        if(bar) bar.style.width = ((i + 1) / lines.length) * 100 + '%';
      }, showAt);

      // Fade out line
      var fadeAt = showAt + lineShow;
      setTimeout(function () {
        line.classList.add('fade-out');
      }, fadeAt);
    });

    // Brand reveal after all lines
    var brandShowAt = startDelay + lines.length * (lineShow + fadeTime) + 200;
    setTimeout(function () {
      if(track) track.style.opacity = '0';
      if (brand) brand.classList.add('visible');
    }, brandShowAt);

    // Dismiss overlay
    var dismissAt = brandShowAt + 1200;
    setTimeout(function () {
      overlay.classList.add('done');
      document.body.style.overflow = '';
    }, dismissAt);
  })();

  /* ----------------------------------------------------------
     SCROLL HANDLERS — single rAF
     ---------------------------------------------------------- */
  var ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
        navbar.classList.toggle('scrolled', window.scrollY > 30);

        var sections = document.querySelectorAll('section[id]');
        var links = document.querySelectorAll('.navbar-links a[href^="#"]');
        var pos = window.scrollY + 100;
        var current = '';
        sections.forEach(function (s) {
          if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) current = s.id;
        });
        links.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ----------------------------------------------------------
     HAMBURGER
     ---------------------------------------------------------- */
  hamburger.addEventListener('click', function () {
    var open = mobileNav.classList.toggle('active');
    hamburger.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ----------------------------------------------------------
     SMOOTH SCROLL
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     REVEAL — IntersectionObserver
     ---------------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    reveals.forEach(function (el) { obs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ----------------------------------------------------------
     PARTICLES
     ---------------------------------------------------------- */
  if (particles && window.innerWidth >= 768) {
    for (var i = 0; i < 12; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var s = Math.random() * 2 + 0.5;
      p.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (Math.random() * 100) + '%;animation-duration:' + (Math.random() * 12 + 14) + 's;animation-delay:' + (Math.random() * 6) + 's;opacity:' + (Math.random() * 0.1 + 0.03);
      particles.appendChild(p);
    }
  }

  /* ----------------------------------------------------------
     HERO ENTRANCE
     ---------------------------------------------------------- */
  window.addEventListener('load', function () {
    var content = document.querySelector('.hero-content');
    var image = document.querySelector('.hero-image');

    if (content) {
      content.style.cssText = 'opacity:0;transform:translateY(24px);transition:opacity 0.7s ' + ease + ',transform 0.7s ' + ease;
      setTimeout(function () { content.style.cssText = 'opacity:1;transform:translateY(0);transition:opacity 0.7s ' + ease + ',transform 0.7s ' + ease; }, 100);
    }

    if (image) {
      image.style.cssText = 'opacity:0;transform:scale(0.92);transition:opacity 0.7s ' + ease + ' 0.2s,transform 0.7s ' + ease + ' 0.2s';
      setTimeout(function () { image.style.cssText = 'opacity:1;transform:scale(1);transition:opacity 0.7s ' + ease + ' 0.2s,transform 0.7s ' + ease + ' 0.2s'; }, 100);
    }
  });

  // Init
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  scrollProgress.style.width = '0%';

})();
