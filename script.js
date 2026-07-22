/* ============================================================
   Dream with Priyanshu — Portfolio Script
   ============================================================ */

(function () {
  'use strict';

  // --- DOM Elements ---
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const scrollProgress = document.getElementById('scrollProgress');
  const particlesContainer = document.getElementById('particles');

  // --- Scroll Progress Bar ---
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // --- Navbar Scroll Effect ---
  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // --- Active Nav Link Highlighting ---
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-links a[href^="#"]');
    const scrollPos = window.scrollY + 120;

    let currentSection = '';

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  // --- Combined Scroll Handler (debounced via rAF) ---
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateScrollProgress();
        updateNavbar();
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Hamburger Menu ---
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile nav when a link is clicked
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Scroll Reveal Animation (IntersectionObserver) ---
  function initRevealAnimations() {
    var reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all
      reveals.forEach(function (el) {
        el.classList.add('revealed');
      });
    }
  }

  initRevealAnimations();

  // --- Floating Particles ---
  function createParticles() {
    if (!particlesContainer) return;
    // Only on larger screens
    if (window.innerWidth < 768) return;

    var count = 20;

    for (var i = 0; i < count; i++) {
      var particle = document.createElement('div');
      particle.classList.add('particle');

      var size = Math.random() * 3 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = Math.random() * 15 + 10 + 's';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.opacity = Math.random() * 0.3 + 0.05;

      particlesContainer.appendChild(particle);
    }
  }

  createParticles();

  // --- Hero Typing Effect ---
  function initTypingEffect() {
    var heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    // Add a subtle cursor blink to the period/accent
    var accentDot = heroTitle.querySelector('.accent');
    if (accentDot) {
      accentDot.style.animation = 'blink 1s step-end infinite';
    }
  }

  // Add blink keyframes dynamically
  var blinkStyle = document.createElement('style');
  blinkStyle.textContent = '@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }';
  document.head.appendChild(blinkStyle);

  // Delay typing effect for a nice entrance
  setTimeout(initTypingEffect, 1000);

  // --- Initial Calls ---
  updateNavbar();
  updateScrollProgress();

  // --- Hero entrance animation ---
  window.addEventListener('load', function () {
    var heroContent = document.querySelector('.hero-content');
    var heroImage = document.querySelector('.hero-image');

    if (heroContent) {
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(30px)';
      heroContent.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

      setTimeout(function () {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      }, 200);
    }

    if (heroImage) {
      heroImage.style.opacity = '0';
      heroImage.style.transform = 'scale(0.9)';
      heroImage.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s';

      setTimeout(function () {
        heroImage.style.opacity = '1';
        heroImage.style.transform = 'scale(1)';
      }, 200);
    }
  });

})();
