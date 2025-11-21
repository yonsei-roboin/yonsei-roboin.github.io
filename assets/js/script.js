import { CONTENT_DATA, AWARDS_DATA, EVENTS_DATA, RESOURCES_DATA, RESOURCES_CONTENT } from "./content.js";

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
  renderAwards(lang);
  renderEvents(lang);
  renderResources(lang);
  
  // Award 모달도 언어 업데이트
  const awardModal = document.getElementById("award-modal");
  if (awardModal && !awardModal.classList.contains("hidden")) {
    const index = parseInt(awardModal.getAttribute("data-current-award"));
    if (!isNaN(index)) {
      const award = AWARDS_DATA[index];
      if (award) {
        const content = award[lang] || award.ko;
        const titleEl = awardModal.querySelector("#award-modal-title");
        const bodyEl = awardModal.querySelector("#award-modal-body");
        const captionEl = awardModal.querySelector("#award-modal-caption");
        if (titleEl) titleEl.textContent = content.title;
        if (bodyEl) bodyEl.textContent = content.body;
        if (captionEl) captionEl.textContent = content.caption;
      }
    }
  }
};

const handleLanguageToggle = () => {
  currentLang = currentLang === "ko" ? "en" : "ko";
  persistLanguage(currentLang);
  updateContent(currentLang);
  // updateContent에서 이미 renderAwards와 renderEvents를 호출하므로 여기서는 불필요
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

const renderAwards = (lang) => {
  const awardsContainer = document.querySelector(".award-list");
  if (!awardsContainer || !AWARDS_DATA) return;

  awardsContainer.innerHTML = AWARDS_DATA.map((award, index) => {
    const isOpen = index === 0 ? "open" : "";
    const content = award[lang] || award.ko; // 언어별 데이터 가져오기
    return `
      <details class="award-entry" ${isOpen} data-award-index="${index}">
        <summary>${content.title}</summary>
        <div class="award-entry-body">
          <p>${content.body}</p>
          <figure class="award-entry-figure" data-award-trigger="${index}">
            <img
              src="${award.image}"
              alt="${content.title}"
              loading="lazy"
            />
            <figcaption>${content.caption}</figcaption>
          </figure>
        </div>
      </details>
    `;
  }).join("");

  // Award 클릭 이벤트 설정
  initAwardModals(lang);
};

// 날짜 포맷팅 함수
const formatDate = (dateString, lang) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  
  if (lang === "ko") {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  } else {
    const months = ["January", "February", "March", "April", "May", "June", 
                   "July", "August", "September", "October", "November", "December"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
};

const renderEvents = (lang) => {
  const eventsTrack = document.querySelector(".event-slider-track");
  if (!eventsTrack || !EVENTS_DATA) return;

  eventsTrack.innerHTML = EVENTS_DATA.map((event, index) => {
    const content = event[lang] || event.ko; // 언어별 데이터 가져오기
    const formattedDate = event.date ? formatDate(event.date, lang) : "";
    return `
      <figure
        class="event-card"
        data-slider-item
        data-media-trigger
        data-media-src="${event.image}"
        data-media-date="${event.date || ''}"
        data-media-event-index="${index}"
        data-media-caption-key=""
        role="button"
        tabindex="0"
      >
        <img
          src="${event.image}"
          alt="${content.alt}"
          loading="lazy"
        />
        ${formattedDate ? `<p class="event-date">${formattedDate}</p>` : ''}
        <figcaption class="event-caption">${content.caption}</figcaption>
      </figure>
    `;
  }).join("");

  // 이벤트 리스너 재설정
  initMediaModal();
  initSliders();
};

const renderResources = (lang) => {
  const resourcesContainer = document.getElementById("resources-container");
  if (!resourcesContainer || !RESOURCES_DATA) return;

  const content = RESOURCES_CONTENT[lang] || RESOURCES_CONTENT.ko;
  
  // 카테고리별로 그룹화
  const categories = {
    computers: [],
    printers: [],
    embedded: [],
    components: [],
    tools: []
  };

  RESOURCES_DATA.forEach((resource) => {
    if (categories[resource.category]) {
      categories[resource.category].push(resource);
    }
  });

  // 카테고리 이름 매핑
  const categoryNames = {
    computers: content.resourcesCategoryComputers,
    printers: content.resourcesCategoryPrinters,
    embedded: content.resourcesCategoryEmbedded,
    components: content.resourcesCategoryComponents,
    tools: content.resourcesCategoryTools
  };

  // 상태 배지 스타일
  const statusStyles = {
    available: "bg-green-100 text-green-800",
    "in-use": "bg-yellow-100 text-yellow-800",
    maintenance: "bg-red-100 text-red-800"
  };

  const statusLabels = {
    available: content.resourcesAvailable,
    "in-use": content.resourcesInUse,
    maintenance: content.resourcesMaintenance
  };

  let html = "";

  // 각 카테고리별로 렌더링
  Object.keys(categories).forEach((categoryKey) => {
    const categoryResources = categories[categoryKey];
    if (categoryResources.length === 0) return;

    html += `
      <div class="lg:col-span-2 xl:col-span-3">
        <h3 class="text-2xl font-bold text-slate-900 mb-4">${categoryNames[categoryKey]}</h3>
      </div>
    `;

    categoryResources.forEach((resource) => {
      const resourceContent = resource[lang] || resource.ko;
      const statusStyle = statusStyles[resource.status] || statusStyles.available;
      const statusLabel = statusLabels[resource.status] || statusLabels.available;
      
      html += `
        <article class="resource-card">
          <div class="flex items-start justify-between mb-3">
            <h4 class="resource-card-title">${resourceContent.name}</h4>
            <span class="resource-status-badge ${statusStyle}">${statusLabel}</span>
          </div>
          <p class="resource-card-description">${resourceContent.description}</p>
          <div class="mt-4 space-y-2">
            <div class="flex items-center gap-2 text-sm text-slate-600">
              <span class="font-semibold">${lang === "ko" ? "수량:" : "Quantity:"}</span>
              <span>${resource.quantity}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-600">
              <span class="font-semibold">${lang === "ko" ? "사양:" : "Specs:"}</span>
              <span>${resourceContent.specs}</span>
            </div>
          </div>
        </article>
      `;
    });
  });

  resourcesContainer.innerHTML = html;
};

const init = () => {
  currentLang = getStoredLanguage();
  updateContent(currentLang);
  setupEventListeners();
  setupAwardModalClose();
  setupImageZoomClose();
};

const setupAwardModalClose = () => {
  const closeTargets = document.querySelectorAll("[data-award-close]");
  closeTargets.forEach((target) => {
    target.addEventListener("click", closeAwardModal);
  });
};

const setupImageZoomClose = () => {
  const closeTargets = document.querySelectorAll("[data-image-zoom-close]");
  closeTargets.forEach((target) => {
    target.addEventListener("click", closeImageZoom);
  });
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

const initAwardModals = (lang) => {
  const awardTriggers = document.querySelectorAll("[data-award-trigger]");
  
  awardTriggers.forEach((trigger) => {
    // 기존 이벤트 리스너 제거를 위해 클론
    const newTrigger = trigger.cloneNode(true);
    trigger.parentNode.replaceChild(newTrigger, trigger);
    
    newTrigger.addEventListener("click", (e) => {
      e.stopPropagation(); // details 토글 방지
      const index = parseInt(newTrigger.getAttribute("data-award-trigger"));
      const award = AWARDS_DATA[index];
      if (!award) return;
      
      const content = award[lang] || award.ko;
      openAwardModal(award.image, content.title, content.body, content.caption);
    });
  });
};

const openAwardModal = (imageSrc, title, body, caption) => {
  const modal = document.getElementById("award-modal");
  if (!modal) return;

  const img = modal.querySelector("#award-modal-img");
  const titleEl = modal.querySelector("#award-modal-title");
  const bodyEl = modal.querySelector("#award-modal-body");
  const captionEl = modal.querySelector("#award-modal-caption");

  img.src = imageSrc;
  titleEl.textContent = title || "";
  bodyEl.textContent = body || "";
  captionEl.textContent = caption || "";

  // 현재 award 인덱스 저장 (언어 변경 시 업데이트용)
  const awardIndex = AWARDS_DATA.findIndex(a => a.image === imageSrc);
  if (awardIndex !== -1) {
    modal.setAttribute("data-current-award", awardIndex);
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  
  // 이미지 클릭 시 추가 확대
  img.onclick = () => {
    openImageZoom(imageSrc);
  };
};

const openImageZoom = (imageSrc) => {
  const zoomModal = document.getElementById("image-zoom-modal");
  if (!zoomModal) return;

  const img = zoomModal.querySelector("#image-zoom-img");
  img.src = imageSrc;
  zoomModal.classList.remove("hidden");
  zoomModal.setAttribute("aria-hidden", "false");
};

const closeAwardModal = () => {
  const modal = document.getElementById("award-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
};

const closeImageZoom = () => {
  const zoomModal = document.getElementById("image-zoom-modal");
  if (!zoomModal) return;
  zoomModal.classList.add("hidden");
  zoomModal.setAttribute("aria-hidden", "true");
};

const initMediaModal = () => {
  const modal = document.getElementById("media-modal");
  if (!modal) return;

  const img = modal.querySelector("#media-modal-img");
  const titleEl = modal.querySelector("#media-modal-title");
  const dateEl = modal.querySelector("#media-modal-date");
  const descriptionEl = modal.querySelector("#media-modal-description");
  const closeTargets = modal.querySelectorAll("[data-media-close]");
  const triggers = document.querySelectorAll("[data-media-trigger]");

  const openModal = (src, title, date, description) => {
    if (!src) return;
    img.src = src;
    
    if (titleEl) {
      titleEl.textContent = title || "";
      titleEl.style.display = title ? "block" : "none";
    }
    
    if (dateEl) {
      if (date && date.trim() !== "") {
        dateEl.textContent = date;
        dateEl.style.display = "block";
      } else {
        dateEl.textContent = "";
        dateEl.style.display = "none";
      }
    }
    
    if (descriptionEl) {
      if (description && description.trim() !== "") {
        // 줄바꿈을 <br>로 변환
        descriptionEl.innerHTML = description.replace(/\n/g, "<br>");
        descriptionEl.style.display = "block";
      } else {
        descriptionEl.textContent = "";
        descriptionEl.style.display = "none";
      }
    }
    
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    img.src = "";
    if (titleEl) {
      titleEl.textContent = "";
      titleEl.style.display = "none";
    }
    if (dateEl) {
      dateEl.textContent = "";
      dateEl.style.display = "none";
    }
    if (descriptionEl) {
      descriptionEl.textContent = "";
      descriptionEl.style.display = "none";
    }
  };

  triggers.forEach((trigger) => {
    const handleActivate = () => {
      const src =
        trigger.getAttribute("data-media-src") ||
        trigger.querySelector("img")?.getAttribute("src");
      const eventIndex = trigger.getAttribute("data-media-event-index");
      
      // EVENTS_DATA에서 이벤트 정보 가져오기
      if (eventIndex !== null && EVENTS_DATA && EVENTS_DATA[parseInt(eventIndex)]) {
        const event = EVENTS_DATA[parseInt(eventIndex)];
        const content = event[currentLang] || event.ko;
        const dateString = event.date || "";
        const formattedDate = dateString ? formatDate(dateString, currentLang) : "";
        
        openModal(src, content.title || "", formattedDate, content.description || "");
      } else {
        // 기존 방식 (다른 곳에서 사용할 수 있음)
        const captionKey = trigger.getAttribute("data-media-caption-key");
        const dateString = trigger.getAttribute("data-media-date");
        const dictionary = CONTENT_DATA[currentLang];
        const fallbackCaption =
          trigger.querySelector("figcaption")?.textContent?.trim() || "";
        const caption = (captionKey && dictionary?.[captionKey]) || fallbackCaption;
        const formattedDate = dateString ? formatDate(dateString, currentLang) : "";
        openModal(src, caption, formattedDate, "");
      }
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
    if (event.key === "Escape") {
      if (!modal.classList.contains("hidden")) {
        closeModal();
      }
      const awardModal = document.getElementById("award-modal");
      if (awardModal && !awardModal.classList.contains("hidden")) {
        closeAwardModal();
      }
      const zoomModal = document.getElementById("image-zoom-modal");
      if (zoomModal && !zoomModal.classList.contains("hidden")) {
        closeImageZoom();
      }
    }
  });
};

document.addEventListener("DOMContentLoaded", init);

