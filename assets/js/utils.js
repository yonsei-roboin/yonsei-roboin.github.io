/**
 * 유틸리티 함수 모음
 */

/**
 * 날짜 포맷팅 함수
 * @param {string} dateString - YYYY-MM-DD 형식의 날짜 문자열
 * @param {string} lang - 언어 코드 ('ko' | 'en')
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDate = (dateString, lang) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  
  if (lang === "ko") {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  } else {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
};

/**
 * 배열을 랜덤하게 섞기 (Fisher-Yates 알고리즘)
 * @param {Array} array - 섞을 배열
 * @returns {Array} 섞인 새 배열
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * 디바운스 함수
 * @param {Function} func - 실행할 함수
 * @param {number} wait - 대기 시간 (ms)
 * @returns {Function} 디바운스된 함수
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 안전하게 DOM 요소 가져오기
 * @param {string} selector - CSS 셀렉터
 * @param {HTMLElement} parent - 부모 요소 (기본값: document)
 * @returns {HTMLElement | null} 찾은 요소 또는 null
 */
export const safeQuerySelector = (selector, parent = document) => {
  try {
    return parent.querySelector(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return null;
  }
};

/**
 * 안전하게 여러 DOM 요소 가져오기
 * @param {string} selector - CSS 셀렉터
 * @param {HTMLElement} parent - 부모 요소 (기본값: document)
 * @returns {NodeList} 찾은 요소들
 */
export const safeQuerySelectorAll = (selector, parent = document) => {
  try {
    return parent.querySelectorAll(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return [];
  }
};

/**
 * 요소가 존재하는지 확인
 * @param {HTMLElement | null} element - 확인할 요소
 * @returns {boolean} 요소 존재 여부
 */
export const elementExists = (element) => {
  return element !== null && element !== undefined;
};

/**
 * 안전하게 로컬 스토리지에서 값 가져오기
 * @param {string} key - 스토리지 키
 * @param {*} defaultValue - 기본값
 * @returns {*} 저장된 값 또는 기본값
 */
export const safeGetStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Unable to read from localStorage: ${key}`, error);
    return defaultValue;
  }
};

/**
 * 안전하게 로컬 스토리지에 값 저장하기
 * @param {string} key - 스토리지 키
 * @param {*} value - 저장할 값
 * @returns {boolean} 저장 성공 여부
 */
export const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Unable to write to localStorage: ${key}`, error);
    return false;
  }
};

/**
 * HTML 이스케이프 처리
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
export const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

/**
 * 줄바꿈을 <br> 태그로 변환
 * @param {string} text - 변환할 텍스트
 * @returns {string} 변환된 HTML
 */
export const nl2br = (text) => {
  if (!text) return "";
  return escapeHtml(text).replace(/\n/g, "<br>");
};

