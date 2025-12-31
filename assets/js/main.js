/**
 * 메인 애플리케이션 초기화 모듈
 */
import { CONFIG, SELECTORS } from "./config.js";
import { CONTENT_DATA } from "./content.js";
import { 
  initLanguage, 
  getCurrentLanguage, 
  setCurrentLanguage, 
  persistLanguage, 
  updateContent 
} from "./language.js";
import {
  renderAwards,
  renderEvents,
  renderResources,
  renderHighlights,
  renderOfficers,
  renderHonoraryMembers,
  renderMainEventsSlider
} from "./renderers.js";
import {
  initAwardModals,
  setupAwardModalClose,
  setupImageZoomClose,
  initMediaModal
} from "./modals.js";
import {
  initSliders,
  initMainEventsSlider
} from "./sliders.js";

/**
 * 언어 토글 핸들러
 */
const handleLanguageToggle = () => {
  const currentLang = getCurrentLanguage();
  const newLang = currentLang === "ko" ? "en" : "ko";
  
  setCurrentLanguage(newLang);
  persistLanguage(newLang);
  
  updateContent(newLang, {
    renderAwards: (l) => renderAwards(l, initAwardModals),
    renderEvents: (l) => renderEvents(l, initMediaModal, initSliders),
    renderResources,
    renderHighlights: (l) => renderHighlights(l, initAwardModals, initMediaModal),
    renderOfficers,
    renderHonoraryMembers,
    renderMainEventsSlider: (l) => renderMainEventsSlider(l, initMainEventsSlider)
  });
  
  // 모달 및 슬라이더 재초기화
  initAwardModals(newLang);
  initMediaModal();
  initSliders();
  initMainEventsSlider();
};

/**
 * 모바일 메뉴 토글
 */
const toggleMobileMenu = () => {
  const nav = document.querySelector(SELECTORS.PRIMARY_NAV);
  const toggle = document.querySelector(SELECTORS.MOBILE_MENU_TOGGLE);
  if (!nav || !toggle) return;

  nav.classList.toggle("hidden");
  const expanded = !nav.classList.contains("hidden");
  toggle.setAttribute("aria-expanded", String(expanded));
};

/**
 * 모바일 메뉴 닫기 (네비게이션 시)
 */
const closeMobileMenuOnNavigate = () => {
  const nav = document.querySelector(SELECTORS.PRIMARY_NAV);
  const toggle = document.querySelector(SELECTORS.MOBILE_MENU_TOGGLE);
  if (!nav || !toggle) return;

  nav.classList.add("hidden");
  toggle.setAttribute("aria-expanded", "false");
};

/**
 * Show More 버튼 핸들러
 */
const setupShowMoreButtons = () => {
  const showMoreButtons = document.querySelectorAll(SELECTORS.SHOW_MORE_BUTTONS);
  const currentLang = getCurrentLanguage();

  showMoreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-show-more");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const nextState = !isExpanded;
      button.setAttribute("aria-expanded", String(nextState));
      target.classList.toggle("hidden", !nextState);

      // 버튼 텍스트 업데이트
      const collapsedKey = button.getAttribute("data-key");
      const expandedKey = button.getAttribute("data-show-more-label-expanded");
      const dictionary = CONTENT_DATA[currentLang];
      if (dictionary && collapsedKey) {
        const nextLabelKey = nextState && expandedKey ? expandedKey : collapsedKey;
        const nextLabel = dictionary[nextLabelKey] || dictionary[collapsedKey];
        if (nextLabel) {
          button.textContent = nextLabel;
        }
      }
    });
  });
};

/**
 * 이벤트 리스너 설정
 */
const setupEventListeners = () => {
  // 언어 전환 버튼
  const langToggle = document.querySelector(SELECTORS.LANG_TOGGLE);
  if (langToggle) {
    // 기존 이벤트 리스너 제거 후 재등록 (중복 방지)
    const newLangToggle = langToggle.cloneNode(true);
    langToggle.parentNode.replaceChild(newLangToggle, langToggle);
    newLangToggle.addEventListener("click", handleLanguageToggle);
  }

  // 모바일 메뉴 토글
  const mobileToggle = document.querySelector(SELECTORS.MOBILE_MENU_TOGGLE);
  if (mobileToggle) {
    mobileToggle.addEventListener("click", toggleMobileMenu);
  }

  // 모바일 메뉴 링크 클릭 시 메뉴 닫기
  const mobileLinks = document.querySelectorAll(SELECTORS.MOBILE_LINKS);
  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenuOnNavigate);
  });

  // Show More 버튼
  setupShowMoreButtons();
};

/**
 * 애플리케이션 초기화
 */
const init = () => {
  // 언어 초기화
  const lang = initLanguage();
  
  // 이벤트 리스너 설정
  setupEventListeners();
  
  // 콘텐츠 업데이트 (렌더러 함수들을 콜백으로 전달)
  updateContent(lang, {
    renderAwards: (l) => renderAwards(l, initAwardModals),
    renderEvents: (l) => renderEvents(l, initMediaModal, initSliders),
    renderResources,
    renderHighlights: (l) => renderHighlights(l, initAwardModals, initMediaModal),
    renderOfficers,
    renderHonoraryMembers,
    renderMainEventsSlider: (l) => renderMainEventsSlider(l, initMainEventsSlider)
  });
  
  // 모달 초기화
  setupAwardModalClose();
  setupImageZoomClose();
  initAwardModals(lang);
  initMediaModal();
  
  // 슬라이더 초기화
  initSliders();
  initMainEventsSlider();
};

// DOM 로드 완료 후 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  // DOM이 이미 로드된 경우
  init();
}

