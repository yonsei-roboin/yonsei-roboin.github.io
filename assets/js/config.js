/**
 * 애플리케이션 설정 상수
 */
export const CONFIG = {
  // 언어 설정
  STORAGE_KEY: "roboin-lang",
  DEFAULT_LANG: "ko",
  SUPPORTED_LANGS: ["ko", "en"],

  // 슬라이더 설정
  MAIN_SLIDER_INTERVAL: 5000, // 5초
  SLIDER_SCROLL_TOLERANCE: 2,

  // 모달 설정
  MODAL_ANIMATION_DELAY: 300,

  // 이미지 로딩 설정
  IMAGE_LOAD_DELAY: 300,
  RESIZE_DEBOUNCE_DELAY: 100,

  // 하이라이트 표시 개수
  HIGHLIGHTS: {
    AWARDS_INITIAL: 2,
    AWARDS_MORE: 2,
    EVENTS_INITIAL: 1,
    EVENTS_MORE: 1
  }
};

/**
 * DOM 셀렉터 상수
 */
export const SELECTORS = {
  // 언어 관련
  LANG_TOGGLE: "#lang-toggle",
  
  // 모바일 메뉴
  MOBILE_MENU_TOGGLE: "#mobile-menu-toggle",
  PRIMARY_NAV: "#primary-nav",
  MOBILE_LINKS: "#primary-nav a",
  
  // 콘텐츠 컨테이너
  AWARDS_CONTAINER: ".award-list",
  EVENTS_TRACK: ".event-slider-track",
  RESOURCES_CONTAINER: "#resources-container",
  OFFICERS_CONTAINER: "#officers-container",
  ARCHIVE_PROJECTS_CONTAINER: "#archive-projects-container",
  HONORARY_CONTAINER: "#honorary-members-container",
  MAIN_SLIDER: "#main-events-slider",
  MAIN_SLIDER_TRACK: "#main-events-slider-track",
  
  // 하이라이트 컨테이너
  HIGHLIGHTS_AWARDS: "#highlights-awards",
  HIGHLIGHTS_AWARDS_MORE: "#highlights-awards-more",
  HIGHLIGHTS_EVENTS: "#highlights-events",
  HIGHLIGHTS_EVENTS_MORE: "#highlights-events-more",
  
  // 모달
  MEDIA_MODAL: "#media-modal",
  AWARD_MODAL: "#award-modal",
  IMAGE_ZOOM_MODAL: "#image-zoom-modal",
  
  // 슬라이더
  SLIDERS: "[data-slider]",
  SHOW_MORE_BUTTONS: "[data-show-more]",
  
  // 트리거
  AWARD_TRIGGERS: "[data-award-trigger]",
  MEDIA_TRIGGERS: "[data-media-trigger]",
  MEDIA_CLOSE: "[data-media-close]",
  AWARD_CLOSE: "[data-award-close]",
  IMAGE_ZOOM_CLOSE: "[data-image-zoom-close]"
};

/**
 * CSS 클래스 상수
 */
export const CLASSES = {
  HIDDEN: "hidden",
  ACTIVE: "active",
  OPEN: "open"
};

/**
 * 상태 값 상수
 */
export const STATUS = {
  AVAILABLE: "available",
  IN_USE: "in-use",
  MAINTENANCE: "maintenance"
};

