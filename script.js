const loaderPhrases = [
  "Shipping ideas into reality",
  "Always building something new",
  "Dream with Priyanshu",
];

const loaderLine = document.querySelector("[data-loader-line]");
const siteLoader = document.querySelector(".site-loader");
const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const revealItems = [...document.querySelectorAll("[data-reveal]")];
const yearTarget = document.querySelector("[data-current-year]");

const closeNavigation = () => {
  if (!navToggle || !siteNav) {
    return;
  }

  navToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
};

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (loaderLine && siteLoader) {
  let loaderIndex = 0;

  const phraseTimer = window.setInterval(() => {
    loaderIndex = (loaderIndex + 1) % loaderPhrases.length;
    loaderLine.textContent = loaderPhrases[loaderIndex];
  }, 900);

  const hideLoader = () => {
    window.setTimeout(() => {
      window.clearInterval(phraseTimer);
      siteLoader.classList.add("is-hidden");
      document.body.classList.remove("is-locked");
    }, 1800);
  };

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNavigation = siteNav.contains(event.target);
    const clickedToggle = navToggle.contains(event.target);

    if (!clickedInsideNavigation && !clickedToggle) {
      closeNavigation();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });
}

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if (navLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          const isMatch = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", isMatch);

          if (isMatch) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    {
      threshold: 0.45,
    },
  );

  navLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (target) {
      sectionObserver.observe(target);
    }
  });
}
