/* FADE-IN AL CARGAR */

document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(".hero");

  setTimeout(() => {
    fadeElements.forEach((el) => {
      el.classList.add("is-visible");
    });
  }, 100);

  const timeline = document.querySelector(".timeline");

if (timeline) {
  const timelineObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          timeline.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  timelineObserver.observe(timeline);
}
});


const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
function revealOnScroll(selector, delay = 150) {
  const elements = document.querySelectorAll(selector);

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {

    let batchIndex = 0; 
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      if (!prefersReducedMotion) {
        entry.target.style.transitionDelay = `${batchIndex * delay}ms`;
        batchIndex += 1;

        entry.target.addEventListener(
          "transitionend",
          () => {
            entry.target.style.transitionDelay = "";
          },
          { once: true },
        );
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  });

  elements.forEach((element) => observer.observe(element));

  const timeline = document.querySelector(".timeline");

if (timeline) {
  const timelineObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          timeline.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  timelineObserver.observe(timeline);
}
}

revealOnScroll(".timeline__item");
revealOnScroll(".project-row");
revealOnScroll(".card-neutral, .card-accent");
revealOnScroll(".skill", 80);

/*CHANGEMENT DE DATE */
const yearElement = document.querySelector("#year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/*  MENU*/
const header = document.querySelector(".site-header");
if (header) {
  function showHeader() {
    header.classList.remove("site-header--hidden");
  }

  function hideHeader() {
    if (window.matchMedia("(max-width: 55rem), (hover: none)").matches) {
      showHeader();
      return;
    }
    const atTop = window.scrollY < 100;
    const inUse =
      header.matches(":hover") || header.querySelector(":focus-visible");
    if (atTop || inUse) return;
    header.classList.add("site-header--hidden");
  }
  window.addEventListener("scroll", hideHeader, { passive: true });
  document.addEventListener("mousemove", (event) => {
    if (event.movementX !== 0 || event.movementY !== 0) showHeader();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") showHeader();
  });
  header.addEventListener("focusin", showHeader);
}

/*MODAL MENTIONS LÉGALES */
const mentionsModal = document.getElementById("mentions-modal");
const mentionsClose = document.getElementById("mentions-close");

let lastFocused = null;

function closeMentions() {
  if (!mentionsModal) return;

  mentionsModal.hidden = true;
  lastFocused?.focus();
}

function trapFocus(event) {
  if (!mentionsModal || mentionsModal.hidden) return;
  if (event.key !== "Tab") return;

  const focusable = mentionsModal.querySelectorAll(
    'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
  );

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
document.querySelectorAll("[data-open-mentions]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    if (mentionsModal && mentionsClose) {
      lastFocused = document.activeElement;
      mentionsModal.hidden = false;
      mentionsClose.focus();
    }
  });
});

mentionsClose?.addEventListener("click", closeMentions);

mentionsModal?.addEventListener("click", (event) => {
  if (event.target === mentionsModal) closeMentions();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mentionsModal && !mentionsModal.hidden) {
    closeMentions();
  }
});

document.addEventListener("keydown", trapFocus);

const scrollProgress = document.querySelector(".scroll-progress");

if (scrollProgress) {
  const updateProgress = () => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

    scrollProgress.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
}

/* scroll a propos*/

const section = document.querySelector(".about");

if (section) {
  const textItems = [
    ...section.querySelectorAll(".about-text > *"),
  ];
  const media = section.querySelector(".about__media");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  function showAll() {
    [...textItems, media].filter(Boolean).forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  if (!media || reduceMotion.matches) {
    showAll();
  } else {

    let ticking = false;

    function updateAbout() {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const lead = vh * 0.3;
      const total = Math.max(1, rect.height - vh + lead);
      const progress = clamp((lead - rect.top) / total);

      textItems.forEach((el, index) => {
        const progressItem = clamp(
          (progress - index * 0.08) / 0.14
        );

        el.style.opacity = progressItem;
        el.style.transform =
          `translateY(${(1 - progressItem) * 16}px)`;
      });

      const photoProgress = clamp((progress - 0.3) / 0.4);

      media.style.opacity = photoProgress;
      media.style.transform =
        `translateX(${(1 - photoProgress) * 28}px)`;

      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateAbout);
        ticking = true;
      }
    }

    window.addEventListener("scroll", requestUpdate, {
      passive: true,
    });
    window.addEventListener("resize", requestUpdate);
    updateAbout();

    reduceMotion.addEventListener("change", (event) => {
      if (event.matches) {
        showAll();
      } else {
        requestUpdate();
      }
    });
  }
}

/*
   LOGIQUE DU BOUTON MODE SOMBRE / CLAIR */

const themeToggleBtn = document.getElementById("theme-toggle");
if (themeToggleBtn) {
  const root = document.documentElement;
  const render = () => {
    const dark = root.dataset.theme === "dark";
    themeToggleBtn.textContent = dark ? "☀️" : "🌙";
    themeToggleBtn.setAttribute(
      "aria-label",
      dark ? "Passer au mode clair" : "Passer au mode sombre",
    );
  };
  render();
  themeToggleBtn.addEventListener("click", () => {
    const dark = root.dataset.theme === "dark";
    if (dark) delete root.dataset.theme;
    else root.dataset.theme = "dark";
    try {
      localStorage.setItem("theme", dark ? "light" : "dark");
    } catch (e) {}
    render();
  });
}