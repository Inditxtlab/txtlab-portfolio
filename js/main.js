/* PRÉFÉRENCE DE MOUVEMENT (partagée par les apparitions et la section À propos) */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* FADE-IN AU CHARGEMENT */
document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(".hero");

  setTimeout(() => {
    fadeElements.forEach((el) => {
      el.classList.add("is-visible");
    });
  }, 100);
});

/* APPARITION AU SCROLL */
function revealOnScroll(selector, delay = 150) {
  const elements = document.querySelectorAll(selector);

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    let batchIndex = 0;
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      if (!reduceMotion.matches) {
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
}

revealOnScroll(".timeline__item");
revealOnScroll(".project-row");
revealOnScroll(".card-neutral, .card-accent");
revealOnScroll(".skill", 80);

/* LIGNE DE LA TIMELINE (un seul observateur) */
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
    { threshold: 0.15 },
  );

  timelineObserver.observe(timeline);
}

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

/* SCROLL À PROPOS */

const section = document.querySelector(".about");

if (section) {
  const textItems = [...section.querySelectorAll(".about-text > *")];
  const media = section.querySelector(".about__media");
  // Même condition que le CSS : sur petit écran, la section n'est plus
  // épinglée et tout est visible tout de suite (pas d'effet de scroll).
  const stacked = window.matchMedia("(max-width: 768px), (max-height: 560px)");

  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  const isStatic = () => !media || reduceMotion.matches || stacked.matches;

  let shown = false;
  let ticking = false;

  function showAll() {
    [...textItems, media].filter(Boolean).forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  function updateAbout() {
    ticking = false;

    if (isStatic()) {
      if (!shown) {
        showAll();
        shown = true;
      }
      return;
    }
    shown = false;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const lead = vh * 0.3;
    const total = Math.max(1, rect.height - vh + lead);
    const progress = clamp((lead - rect.top) / total);

    textItems.forEach((el, index) => {
      const progressItem = clamp((progress - index * 0.08) / 0.14);

      el.style.opacity = progressItem;
      el.style.transform = `translateY(${(1 - progressItem) * 16}px)`;
    });

    const photoProgress = clamp((progress - 0.3) / 0.4);

    media.style.opacity = photoProgress;
    media.style.transform = `translateX(${(1 - photoProgress) * 28}px)`;
  }

  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateAbout);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  reduceMotion.addEventListener("change", requestUpdate);
  stacked.addEventListener("change", requestUpdate);
  updateAbout();
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

// CURSEUR PERSONNALISÉ
(() => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!finePointer.matches || reduceMotion.matches) return;

  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursor);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let animationFrame;

  function animateCursor() {
    // Léger retard pour un mouvement plus fluide
    cursorX += (mouseX - cursorX) * 0.35;
    cursorY += (mouseY - cursorY) * 0.35;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    if (Math.abs(mouseX - cursorX) > 0.1 || Math.abs(mouseY - cursorY) > 0.1) {
      animationFrame = requestAnimationFrame(animateCursor);
    } else {
      animationFrame = null;
    }
  }

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    cursor.classList.add("is-visible");

    if (!animationFrame) {
      cursorX = mouseX;
      cursorY = mouseY;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      animationFrame = requestAnimationFrame(animateCursor);
    }
  });

  document.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-visible");
  });

  document.addEventListener("mouseenter", () => {
    cursor.classList.add("is-visible");
  });

  const interactiveElements = document.querySelectorAll(
    "a, button, input, textarea, select, [role='button']",
  );

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.classList.add("is-hovering");
    });

    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-hovering");
    });
  });
})();
/* CABECIÈRE : ombre dès que la page défile */
(() => {
  const siteHeader = document.querySelector(".site-header");
  if (!siteHeader) return;
  const update = () =>
    siteHeader.classList.toggle("site-header--stuck", window.scrollY > 8);
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

/* ASTÉRISQUE DU HERO : monte depuis le bas au scroll */
(() => {
  const hero = document.querySelector(".hero");
  const deco = document.querySelector(".hero__deco");
  if (!hero || !deco) return;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  let ticking = false;
  const SPEED = 0.3;
  const ROTATION = 50;
  function update() {
    ticking = false;
    if (reduceMotion.matches) return;

    const heroH = hero.offsetHeight;
    const decoH = deco.offsetHeight;
    const linear = clamp((window.scrollY / heroH) * SPEED);
    const progress = 1 - Math.pow(1 - linear, 3);

    const start = decoH;
    const end = -(heroH - decoH);
    const y = start + (end - start) * progress;
    deco.style.opacity = clamp(linear * 18);
    deco.style.transform =
      `translateY(${y}px) rotate(${progress * ROTATION}deg)`;
  }
  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
})();