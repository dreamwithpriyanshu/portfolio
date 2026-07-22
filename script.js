document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------
  // 1. One-time Intro Loading Screen
  // --------------------------------------------------------
  const loader = document.getElementById('loader');
  const typewriter = document.getElementById('typewriter');
  
  // Check if loader has already been shown in this session
  if (!sessionStorage.getItem('introPlayed')) {
    // We need to play the intro
    document.body.style.overflow = 'hidden'; // Prevent scrolling during loader
    
    const textToType = "Designing products...";
    let i = 0;
    
    // Typing effect function
    function typeWriterEffect() {
      if (i < textToType.length) {
        typewriter.innerHTML += textToType.charAt(i);
        i++;
        setTimeout(typeWriterEffect, 100);
      } else {
        // Wait a bit after typing is done, then fade out
        setTimeout(() => {
          loader.style.opacity = '0';
          loader.style.visibility = 'hidden';
          document.body.style.overflow = 'auto'; // Restore scrolling
          sessionStorage.setItem('introPlayed', 'true');
          
          // Trigger reveals that are immediately visible
          triggerReveals();
        }, 1000);
      }
    }
    
    // Start typing after a short delay
    setTimeout(typeWriterEffect, 500);
    
  } else {
    // Intro already played, hide loader immediately
    loader.style.display = 'none';
    document.body.style.overflow = 'auto';
    triggerReveals();
  }

  // --------------------------------------------------------
  // 2. Intersection Observer for Scroll Animations
  // --------------------------------------------------------
  const reveals = document.querySelectorAll('.reveal');
  
  function triggerReveals() {
    const windowHeight = window.innerHeight;
    const elementVisible = 100; // Trigger when element is 100px visible
    
    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', triggerReveals);
  // Initial check on load
  triggerReveals();

  // --------------------------------------------------------
  // 3. Dynamic Footer Year
  // --------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------
  // 4. Smooth Scroll for Anchor Links (polyfill/fallback)
  // --------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

});
