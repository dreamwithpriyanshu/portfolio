/* ============================================================
   Dream with Priyanshu — Portfolio Scripts
   Organized into logical modules, each handling one concern.
   ============================================================ */

(function () {
  'use strict';


  /* ──────────────────────────────────────────────
     1. SCROLL ENGINE
     Handles scroll progress bar and navbar state.
     Uses rAF to avoid layout thrashing.
     ────────────────────────────────────────────── */
  var ScrollEngine = (function () {
    var nav       = document.getElementById('siteNav');
    var track     = document.getElementById('scrollTrack');
    var ticking   = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        updateProgress();
        updateNavbar();
        highlightActiveLink();
        ticking = false;
      });
    }

    function updateProgress() {
      var scrolled = window.scrollY;
      var total    = document.documentElement.scrollHeight - window.innerHeight;
      var ratio    = total > 0 ? scrolled / total : 0;
      track.style.transform = 'scaleX(' + ratio + ')';
    }

    function updateNavbar() {
      nav.classList.toggle('pinned', window.scrollY > 60);
    }

    function highlightActiveLink() {
      var links   = document.querySelectorAll('.nav-menu a[href^="#"]');
      var scrollY = window.scrollY + 140;
      var current = '';

      document.querySelectorAll('section[id]').forEach(function (sec) {
        if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
          current = sec.id;
        }
      });

      links.forEach(function (link) {
        link.classList.toggle('lit', link.getAttribute('href') === '#' + current);
      });
    }

    function init() {
      window.addEventListener('scroll', onScroll, { passive: true });
      updateNavbar();
      updateProgress();
    }

    return { init: init };
  })();


  /* ──────────────────────────────────────────────
     2. NAVIGATION
     Mobile menu toggle and smooth anchor scrolling.
     ────────────────────────────────────────────── */
  var Navigation = (function () {
    var burger  = document.getElementById('burger');
    var overlay = document.getElementById('mobileOverlay');

    function toggleMenu() {
      var isOpen = overlay.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      overlay.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }

    function smoothScroll(e) {
      var href = this.getAttribute('href');
      if (!href || href.charAt(0) !== '#' || href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      closeMenu();

      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }

    function init() {
      burger.addEventListener('click', toggleMenu);

      overlay.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });

      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', smoothScroll);
      });
    }

    return { init: init };
  })();


  /* ──────────────────────────────────────────────
     3. REVEAL ENGINE
     IntersectionObserver for 5 animation styles:
       .reveal-fade   — translateY(28px)
       .reveal-left   — translateX(-40px)
       .reveal-right  — translateX(40px)
       .reveal-scale  — scale(0.92)
       .reveal-pop    — scale(0.7)
     Each gets its own timing from CSS; we just
     toggle the `.in-view` class.
     ────────────────────────────────────────────── */
  var RevealEngine = (function () {
    var SELECTOR = '.reveal-fade, .reveal-left, .reveal-right, .reveal-scale, .reveal-pop';

    function init() {
      var elements = document.querySelectorAll(SELECTOR);

      if (!('IntersectionObserver' in window)) {
        // Fallback: show everything immediately
        elements.forEach(function (el) { el.classList.add('in-view'); });
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      });

      elements.forEach(function (el) { observer.observe(el); });
    }

    return { init: init };
  })();


  /* ──────────────────────────────────────────────
     4. STAGGER PILLS
     When a skill-group scrolls into view, its
     child .skill-pill elements get staggered
     delays so they pop in one after another.
     ────────────────────────────────────────────── */
  var StaggerPills = (function () {
    function init() {
      var groups = document.querySelectorAll('[data-stagger-pills]');

      if (!('IntersectionObserver' in window)) return;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var pills = entry.target.querySelectorAll('.reveal-pop');
          pills.forEach(function (pill, i) {
            pill.style.transitionDelay = (i * 80) + 'ms';
            pill.classList.add('in-view');
          });

          observer.unobserve(entry.target);
        });
      }, { threshold: 0.15 });

      groups.forEach(function (g) { observer.observe(g); });
    }

    return { init: init };
  })();


  /* ──────────────────────────────────────────────
     5. JOURNEY LINE DRAW
     When the timeline section scrolls into view,
     the SVG rail's stroke-dashoffset animates to 0,
     creating a "line drawing" effect.
     ────────────────────────────────────────────── */
  var JourneyLineDraw = (function () {
    function init() {
      var rail = document.getElementById('journeyRail');
      if (!rail) return;

      // Set the dasharray to match the actual height
      var fillLine = rail.querySelector('.rail-fill');
      if (!fillLine) return;

      if (!('IntersectionObserver' in window)) {
        rail.classList.add('drawn');
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Measure actual rail height
            var height = rail.getBoundingClientRect().height;
            fillLine.style.strokeDasharray = height;
            fillLine.style.strokeDashoffset = height;

            // Trigger draw on next frame
            requestAnimationFrame(function () {
              rail.classList.add('drawn');
            });

            observer.unobserve(rail);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(rail);
    }

    return { init: init };
  })();


  /* ──────────────────────────────────────────────
     6. HERO PARTICLES
     Spawns small floating dots in the hero for
     subtle ambiance. Desktop only (>768px).
     ────────────────────────────────────────────── */
  var HeroParticles = (function () {
    function init() {
      if (window.innerWidth < 768) return;

      var container = document.getElementById('heroParticles');
      if (!container) return;

      var count = 16;
      for (var i = 0; i < count; i++) {
        var mote = document.createElement('div');
        mote.className = 'mote';

        var size = (Math.random() * 2.5 + 1).toFixed(1);
        mote.style.width  = size + 'px';
        mote.style.height = size + 'px';
        mote.style.left   = (Math.random() * 100).toFixed(1) + '%';
        mote.style.animationDuration = (Math.random() * 14 + 10).toFixed(1) + 's';
        mote.style.animationDelay    = (Math.random() * 8).toFixed(1) + 's';

        container.appendChild(mote);
      }
    }

    return { init: init };
  })();


  /* ──────────────────────────────────────────────
     7. HERO CODE CARD — typing animation
     Types out a JS object character by character
     with syntax highlighting.
     ────────────────────────────────────────────── */
  var CodeCardTyping = (function () {
    // Each token: [text, cssClass]
    var tokens = [
      ['const ', 'kw'],
      ['priyanshu', 'fn'],
      [' = {\n', 'punc'],
      ['  role',    'fn'],  [': ',    'punc'], ['"Frontend Developer"', 'str'], [',\n', 'punc'],
      ['  passion', 'fn'],  [': ',    'punc'], ['"Building the web"',   'str'], [',\n', 'punc'],
      ['  motto',   'fn'],  [': ',    'punc'], ['"Ship fast, learn faster"', 'str'], [',\n', 'punc'],
      ['  status',  'fn'],  [': ',    'punc'], ['"Open to opportunities"',  'str'], ['\n',  'punc'],
      ['};',       'punc'],
      ['\n\n',      ''],
      ['// ', 'cm'], ['Carpe Diem ✦', 'cm']
    ];

    var charDelay   = 32;   // ms per character
    var tokenPause  = 60;   // extra pause between tokens

    function init() {
      var body = document.getElementById('codeBody');
      if (!body) return;

      // Clear the initial cursor
      body.innerHTML = '';

      var cursor = document.createElement('span');
      cursor.className = 'code-cursor';

      var tokenIdx = 0;
      var charIdx  = 0;
      var currentSpan = null;

      function typeNext() {
        if (tokenIdx >= tokens.length) {
          // Done — leave cursor blinking
          body.appendChild(cursor);
          return;
        }

        var text = tokens[tokenIdx][0];
        var cls  = tokens[tokenIdx][1];

        if (charIdx === 0) {
          currentSpan = document.createElement('span');
          if (cls) currentSpan.className = cls;
          body.appendChild(currentSpan);
        }

        var char = text.charAt(charIdx);

        if (char === '\n') {
          currentSpan.appendChild(document.createElement('br'));
        } else {
          currentSpan.appendChild(document.createTextNode(char));
        }

        // Move cursor to end
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        body.appendChild(cursor);

        charIdx++;

        if (charIdx >= text.length) {
          // Move to next token
          tokenIdx++;
          charIdx = 0;
          setTimeout(typeNext, tokenPause);
        } else {
          setTimeout(typeNext, charDelay);
        }
      }

      // Start typing after hero entrance settles
      setTimeout(typeNext, 1200);
    }

    return { init: init };
  })();


  /* ──────────────────────────────────────────────
     8. MAGNETIC BUTTONS
     Buttons with [data-magnetic] subtly follow
     the cursor within their bounds.
     ────────────────────────────────────────────── */
  var MagneticButtons = (function () {
    var STRENGTH = 0.3;  // how far the button follows (fraction)

    function init() {
      if (window.innerWidth < 768) return; // skip on mobile

      document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
          var rect = btn.getBoundingClientRect();
          var x = e.clientX - rect.left - rect.width / 2;
          var y = e.clientY - rect.top  - rect.height / 2;
          btn.style.transform = 'translate(' + (x * STRENGTH) + 'px, ' + (y * STRENGTH) + 'px)';
        });

        btn.addEventListener('mouseleave', function () {
          btn.style.transform = '';
          btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
          setTimeout(function () { btn.style.transition = ''; }, 500);
        });
      });
    }

    return { init: init };
  })();


  /* ──────────────────────────────────────────────
     9. CURSOR GLOW
     A large, soft radial gradient that subtly
     follows the mouse across the page (desktop).
     ────────────────────────────────────────────── */
  var CursorGlow = (function () {
    var glow = document.getElementById('cursorGlow');
    var visible = false;

    function init() {
      if (!glow || window.innerWidth < 1024) return;

      document.addEventListener('mousemove', function (e) {
        if (!visible) {
          glow.classList.add('visible');
          visible = true;
        }
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
      });

      document.addEventListener('mouseleave', function () {
        glow.classList.remove('visible');
        visible = false;
      });
    }

    return { init: init };
  })();


  /* ──────────────────────────────────────────────
     10. HERO ENTRANCE
     Staggers the hero-intro and hero-visual
     with slightly different timings and easing
     so it doesn't feel simultaneous.
     ────────────────────────────────────────────── */
  var HeroEntrance = (function () {
    function init() {
      var intro  = document.getElementById('heroIntro');
      var visual = document.getElementById('heroVisual');

      if (intro) {
        intro.style.opacity   = '0';
        intro.style.transform = 'translateY(32px)';
        intro.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
      }

      if (visual) {
        visual.style.opacity   = '0';
        visual.style.transform = 'translateY(20px) scale(0.96)';
        visual.style.transition = 'opacity 0.85s cubic-bezier(0.16,1,0.3,1) 0.25s, transform 0.85s cubic-bezier(0.34,1.56,0.64,1) 0.25s';
      }

      window.addEventListener('load', function () {
        // Intro fades in first
        setTimeout(function () {
          if (intro) {
            intro.style.opacity   = '1';
            intro.style.transform = 'translateY(0)';
          }
        }, 100);

        // Visual follows with a slight offset
        setTimeout(function () {
          if (visual) {
            visual.style.opacity   = '1';
            visual.style.transform = 'translateY(0) scale(1)';
          }
        }, 250);
      });
    }

    return { init: init };
  })();


  /* ──────────────────────────────────────────────
     BOOT
     ────────────────────────────────────────────── */
  ScrollEngine.init();
  Navigation.init();
  RevealEngine.init();
  StaggerPills.init();
  JourneyLineDraw.init();
  HeroParticles.init();
  CodeCardTyping.init();
  MagneticButtons.init();
  CursorGlow.init();
  HeroEntrance.init();

})();
