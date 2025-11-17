import { CONTENT_DATA } from "./content.js";

const STORAGE_KEY = "roboin-lang";
const DEFAULT_LANG = "ko";

let currentLang = DEFAULT_LANG;

const getStoredLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && Object.prototype.hasOwnProperty.call(CONTENT_DATA, stored)) {
      return stored;
    }
  } catch (error) {
    console.warn("Unable to read language preference:", error);
  }
  return DEFAULT_LANG;
};

const persistLanguage = (lang) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    console.warn("Unable to persist language preference:", error);
  }
};

const updateLangToggleA11y = (lang) => {
  const toggle = document.getElementById("lang-toggle");
  const ariaLabel = CONTENT_DATA[lang]?.langToggleAria;
  if (toggle && ariaLabel) {
    toggle.setAttribute("aria-label", ariaLabel);
  }
};

const updateContent = (lang) => {
  const dictionary = CONTENT_DATA[lang];
  if (!dictionary) return;

  document.documentElement.lang = lang;
  document.title = dictionary.pageTitle || document.title;

  const targets = document.querySelectorAll("[data-key]");
  targets.forEach((element) => {
    const key = element.getAttribute("data-key");
    const value = dictionary[key];
    if (!value) return;

    if (element.matches("input, textarea")) {
      element.setAttribute("placeholder", value);
    } else if (element.hasAttribute("data-show-more")) {
      const expandedKey = element.getAttribute("data-show-more-label-expanded");
      const isExpanded = element.getAttribute("aria-expanded") === "true";
      const labelKey = isExpanded && expandedKey ? expandedKey : key;
      const labelValue = dictionary[labelKey] || value;
      element.textContent = labelValue;
    } else {
      element.textContent = value;
    }
  });

  updateLangToggleA11y(lang);
};

const handleLanguageToggle = () => {
  currentLang = currentLang === "ko" ? "en" : "ko";
  persistLanguage(currentLang);
  updateContent(currentLang);
};

const toggleMobileMenu = () => {
  const nav = document.getElementById("primary-nav");
  const toggle = document.getElementById("mobile-menu-toggle");
  if (!nav || !toggle) return;

  nav.classList.toggle("hidden");
  const expanded = !nav.classList.contains("hidden");
  toggle.setAttribute("aria-expanded", String(expanded));
};

const closeMobileMenuOnNavigate = () => {
  const nav = document.getElementById("primary-nav");
  const toggle = document.getElementById("mobile-menu-toggle");
  if (!nav || !toggle) return;

  nav.classList.add("hidden");
  toggle.setAttribute("aria-expanded", "false");
};

const setupEventListeners = () => {
  const langToggle = document.getElementById("lang-toggle");
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileLinks = document.querySelectorAll("#primary-nav a");
  const showMoreButtons = document.querySelectorAll("[data-show-more]");

  if (langToggle) {
    langToggle.addEventListener("click", handleLanguageToggle);
  }

  if (mobileToggle) {
    mobileToggle.addEventListener("click", toggleMobileMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenuOnNavigate);
  });

  showMoreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-show-more");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const nextState = !isExpanded;
      button.setAttribute("aria-expanded", String(nextState));
      target.classList.toggle("hidden", !nextState);

      const collapsedKey = button.getAttribute("data-key");
      const expandedKey = button.getAttribute("data-show-more-label-expanded");
      const dictionary = CONTENT_DATA[currentLang];
      if (!dictionary || !collapsedKey) return;
      const nextLabelKey = nextState && expandedKey ? expandedKey : collapsedKey;
      const nextLabel = dictionary[nextLabelKey] || dictionary[collapsedKey];
      if (nextLabel) {
        button.textContent = nextLabel;
      }
    });
  });

  initSliders();
  initMediaModal();
};

const init = () => {
  currentLang = getStoredLanguage();
  updateContent(currentLang);
  setupEventListeners();
};

const initSliders = () => {
  const sliders = document.querySelectorAll("[data-slider]");
  sliders.forEach((slider) => {
    const track = slider.querySelector("[data-slider-track]");
    const prevBtn = slider.querySelector("[data-slider-prev]");
    const nextBtn = slider.querySelector("[data-slider-next]");
    if (!track || !prevBtn || !nextBtn) return;

    const getGap = () => {
      const style = window.getComputedStyle(track);
      const gapValue = parseFloat(style.columnGap || style.gap || "0");
      return Number.isNaN(gapValue) ? 0 : gapValue;
    };

    const getStep = () => {
      const firstItem = track.querySelector("[data-slider-item]");
      if (!firstItem) return track.clientWidth;
      const itemRect = firstItem.getBoundingClientRect();
      return itemRect.width + getGap();
    };

    const scrollByStep = (direction) => {
      const left = track.scrollLeft + direction * getStep();
      track.scrollTo({ left, behavior: "smooth" });
    };

    const updateButtons = () => {
      const maxScroll = Math.max(track.scrollWidth - track.clientWidth - 1, 0);
      const tolerance = 2;
      prevBtn.disabled = track.scrollLeft <= tolerance;
      nextBtn.disabled = track.scrollLeft >= maxScroll - tolerance;
    };

    prevBtn.addEventListener("click", () => scrollByStep(-1));
    nextBtn.addEventListener("click", () => scrollByStep(1));

    track.addEventListener("scroll", () => window.requestAnimationFrame(updateButtons));
    window.addEventListener("resize", () => window.requestAnimationFrame(updateButtons));
    updateButtons();
  });
};

const initMediaModal = () => {
  const modal = document.getElementById("media-modal");
  if (!modal) return;

  const img = modal.querySelector("#media-modal-img");
  const captionEl = modal.querySelector("#media-modal-caption");
  const closeTargets = modal.querySelectorAll("[data-media-close]");
  const triggers = document.querySelectorAll("[data-media-trigger]");

  const openModal = (src, caption) => {
    if (!src) return;
    img.src = src;
    captionEl.textContent = caption || "";
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    img.src = "";
  };

  triggers.forEach((trigger) => {
    const handleActivate = () => {
      const src =
        trigger.getAttribute("data-media-src") ||
        trigger.querySelector("img")?.getAttribute("src");
      const captionKey = trigger.getAttribute("data-media-caption-key");
      const dictionary = CONTENT_DATA[currentLang];
      const fallbackCaption =
        trigger.querySelector("figcaption")?.textContent?.trim() || "";
      const caption = (captionKey && dictionary?.[captionKey]) || fallbackCaption;
      openModal(src, caption);
    };

    trigger.addEventListener("click", handleActivate);
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleActivate();
      }
    });
  });

  closeTargets.forEach((target) => {
    target.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
};

document.addEventListener("DOMContentLoaded", init);

