/**
 * 언어 관리 모듈
 */
import { CONTENT_DATA } from "./content.js";
import { CONFIG, SELECTORS } from "./config.js";
import { safeGetStorage, safeSetStorage } from "./utils.js";

let currentLang = CONFIG.DEFAULT_LANG;

/**
 * 저장된 언어 설정 가져오기
 * @returns {string} 언어 코드
 */
export const getStoredLanguage = () => {
  const stored = safeGetStorage(CONFIG.STORAGE_KEY, CONFIG.DEFAULT_LANG);
  if (CONFIG.SUPPORTED_LANGS.includes(stored)) {
    return stored;
  }
  return CONFIG.DEFAULT_LANG;
};

/**
 * 언어 설정 저장하기
 * @param {string} lang - 언어 코드
 */
export const persistLanguage = (lang) => {
  if (CONFIG.SUPPORTED_LANGS.includes(lang)) {
    safeSetStorage(CONFIG.STORAGE_KEY, lang);
  }
};

/**
 * 현재 언어 가져오기
 * @returns {string} 현재 언어 코드
 */
export const getCurrentLanguage = () => currentLang;

/**
 * 언어 설정하기
 * @param {string} lang - 언어 코드
 */
export const setCurrentLanguage = (lang) => {
  if (CONFIG.SUPPORTED_LANGS.includes(lang)) {
    currentLang = lang;
  }
};

/**
 * 언어 토글 버튼의 접근성 속성 업데이트
 * @param {string} lang - 언어 코드
 */
const updateLangToggleA11y = (lang) => {
  const toggle = document.querySelector(SELECTORS.LANG_TOGGLE);
  const ariaLabel = CONTENT_DATA[lang]?.langToggleAria;
  if (toggle && ariaLabel) {
    toggle.setAttribute("aria-label", ariaLabel);
  }
};

/**
 * data-key 속성을 가진 모든 요소의 텍스트 업데이트
 * @param {string} lang - 언어 코드
 */
const updateDataKeyElements = (lang) => {
  const dictionary = CONTENT_DATA[lang];
  if (!dictionary) return;

  const targets = document.querySelectorAll("[data-key]");
  targets.forEach((element) => {
    const key = element.getAttribute("data-key");
    const value = dictionary[key];
    if (!value) return;

    // img 태그는 건너뛰기
    if (element.tagName === "IMG") return;

    // 언어 전환 버튼은 별도 처리
    if (element.id === "lang-toggle") {
      element.textContent = value;
      return;
    }

    // input, textarea는 placeholder 설정
    if (element.matches("input, textarea")) {
      element.setAttribute("placeholder", value);
      return;
    }

    // show-more 버튼은 확장 상태에 따라 다른 라벨 사용
    if (element.hasAttribute("data-show-more")) {
      const expandedKey = element.getAttribute("data-show-more-label-expanded");
      const isExpanded = element.getAttribute("aria-expanded") === "true";
      const labelKey = isExpanded && expandedKey ? expandedKey : key;
      const labelValue = dictionary[labelKey] || value;
      element.textContent = labelValue;
      return;
    }

    // 기본적으로 textContent 설정
    element.textContent = value;
  });
};

/**
 * 문서 언어 및 제목 업데이트
 * @param {string} lang - 언어 코드
 */
const updateDocumentMetadata = (lang) => {
  const dictionary = CONTENT_DATA[lang];
  if (!dictionary) return;

  document.documentElement.lang = lang;
  if (dictionary.pageTitle) {
    document.title = dictionary.pageTitle;
  }
};

/**
 * 콘텐츠 업데이트 (렌더러 함수들을 콜백으로 받음)
 * @param {string} lang - 언어 코드
 * @param {Object} renderers - 렌더러 함수 객체
 */
export const updateContent = (lang, renderers = {}) => {
  const dictionary = CONTENT_DATA[lang];
  if (!dictionary) {
    console.warn(`Language data not found for: ${lang}`);
    return;
  }

  // 문서 메타데이터 업데이트
  updateDocumentMetadata(lang);

  // data-key 요소들 업데이트
  updateDataKeyElements(lang);

  // 언어 토글 접근성 업데이트
  updateLangToggleA11y(lang);

  // 각종 렌더러 호출 (함수인 경우 호출)
  Object.keys(renderers).forEach(key => {
    const renderer = renderers[key];
    if (typeof renderer === 'function') {
      renderer(lang);
    }
  });

  // 열려있는 모달이 있으면 언어 업데이트
  updateOpenModals(lang);
};

/**
 * 열려있는 모달의 언어 업데이트
 * @param {string} lang - 언어 코드
 */
const updateOpenModals = (lang) => {
  const awardModal = document.querySelector(SELECTORS.AWARD_MODAL);
  if (awardModal && !awardModal.classList.contains("hidden")) {
    const index = parseInt(awardModal.getAttribute("data-current-award"));
    if (!isNaN(index) && window.updateAwardModalLanguage) {
      window.updateAwardModalLanguage(index, lang);
    }
  }
};

/**
 * 언어 초기화
 * @returns {string} 초기화된 언어 코드
 */
export const initLanguage = () => {
  currentLang = getStoredLanguage();
  persistLanguage(currentLang);
  return currentLang;
};

