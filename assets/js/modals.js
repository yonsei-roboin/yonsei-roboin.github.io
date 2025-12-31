/**
 * 모달 관리 모듈
 */
import { AWARDS_DATA, EVENTS_DATA, CONTENT_DATA } from "./content.js";
import { CONFIG, SELECTORS } from "./config.js";
import { formatDate, nl2br, elementExists } from "./utils.js";
import { getCurrentLanguage } from "./language.js";

/**
 * Award 모달 열기
 * @param {string} imageSrc - 이미지 경로
 * @param {string} title - 제목
 * @param {string} body - 본문
 * @param {string} caption - 캡션
 */
export const openAwardModal = (imageSrc, title, body, caption) => {
  const modal = document.querySelector(SELECTORS.AWARD_MODAL);
  if (!modal) return;

  const img = modal.querySelector("#award-modal-img");
  const titleEl = modal.querySelector("#award-modal-title");
  const bodyEl = modal.querySelector("#award-modal-body");
  const captionEl = modal.querySelector("#award-modal-caption");

  if (img) img.src = imageSrc;
  if (titleEl) titleEl.textContent = title || "";
  if (bodyEl) bodyEl.textContent = body || "";
  if (captionEl) captionEl.textContent = caption || "";

  // 현재 award 인덱스 저장 (언어 변경 시 업데이트용)
  const awardIndex = AWARDS_DATA.findIndex(a => a.image === imageSrc);
  if (awardIndex !== -1) {
    modal.setAttribute("data-current-award", awardIndex);
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  
  // 이미지 클릭 시 추가 확대
  if (img) {
    img.onclick = () => {
      openImageZoom(imageSrc);
    };
  }
};

/**
 * Award 모달 닫기
 */
export const closeAwardModal = () => {
  const modal = document.querySelector(SELECTORS.AWARD_MODAL);
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
};

/**
 * Award 모달 언어 업데이트 (전역 함수로 등록)
 * @param {number} index - Award 인덱스
 * @param {string} lang - 언어 코드
 */
window.updateAwardModalLanguage = (index, lang) => {
  const award = AWARDS_DATA[index];
  if (!award) return;
  
  const content = award[lang] || award.ko;
  const modal = document.querySelector(SELECTORS.AWARD_MODAL);
  if (!modal) return;

  const titleEl = modal.querySelector("#award-modal-title");
  const bodyEl = modal.querySelector("#award-modal-body");
  const captionEl = modal.querySelector("#award-modal-caption");
  
  if (titleEl) titleEl.textContent = content.title;
  if (bodyEl) bodyEl.textContent = content.body;
  if (captionEl) captionEl.textContent = content.caption;
};

/**
 * Award 모달 이벤트 리스너 초기화
 * @param {string} lang - 언어 코드
 */
export const initAwardModals = (lang) => {
  const awardTriggers = document.querySelectorAll(SELECTORS.AWARD_TRIGGERS);
  
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

/**
 * Award 모달 닫기 이벤트 리스너 설정
 */
export const setupAwardModalClose = () => {
  const closeTargets = document.querySelectorAll(SELECTORS.AWARD_CLOSE);
  closeTargets.forEach((target) => {
    target.addEventListener("click", closeAwardModal);
  });
};

/**
 * 이미지 확대 모달 열기
 * @param {string} imageSrc - 이미지 경로
 */
export const openImageZoom = (imageSrc) => {
  const zoomModal = document.querySelector(SELECTORS.IMAGE_ZOOM_MODAL);
  if (!zoomModal) return;

  const img = zoomModal.querySelector("#image-zoom-img");
  if (img) img.src = imageSrc;
  
  zoomModal.classList.remove("hidden");
  zoomModal.setAttribute("aria-hidden", "false");
};

/**
 * 이미지 확대 모달 닫기
 */
export const closeImageZoom = () => {
  const zoomModal = document.querySelector(SELECTORS.IMAGE_ZOOM_MODAL);
  if (!zoomModal) return;
  zoomModal.classList.add("hidden");
  zoomModal.setAttribute("aria-hidden", "true");
};

/**
 * 이미지 확대 모달 닫기 이벤트 리스너 설정
 */
export const setupImageZoomClose = () => {
  const closeTargets = document.querySelectorAll(SELECTORS.IMAGE_ZOOM_CLOSE);
  closeTargets.forEach((target) => {
    target.addEventListener("click", closeImageZoom);
  });
};

/**
 * Media 모달 열기
 * @param {string} src - 이미지 경로
 * @param {string} title - 제목
 * @param {string} date - 날짜
 * @param {string} description - 설명
 */
const openMediaModal = (src, title, date, description) => {
  const modal = document.querySelector(SELECTORS.MEDIA_MODAL);
  if (!modal || !src) return;

  const img = modal.querySelector("#media-modal-img");
  const titleEl = modal.querySelector("#media-modal-title");
  const dateEl = modal.querySelector("#media-modal-date");
  const descriptionEl = modal.querySelector("#media-modal-description");

  if (img) img.src = src;
  
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
      descriptionEl.innerHTML = nl2br(description);
      descriptionEl.style.display = "block";
    } else {
      descriptionEl.textContent = "";
      descriptionEl.style.display = "none";
    }
  }
  
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
};

/**
 * Media 모달 닫기
 */
const closeMediaModal = () => {
  const modal = document.querySelector(SELECTORS.MEDIA_MODAL);
  if (!modal) return;
  
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  
  const img = modal.querySelector("#media-modal-img");
  const titleEl = modal.querySelector("#media-modal-title");
  const dateEl = modal.querySelector("#media-modal-date");
  const descriptionEl = modal.querySelector("#media-modal-description");
  
  if (img) img.src = "";
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

/**
 * Media 모달 이벤트 리스너 초기화
 */
export const initMediaModal = () => {
  const modal = document.querySelector(SELECTORS.MEDIA_MODAL);
  if (!modal) return;

  const triggers = document.querySelectorAll(SELECTORS.MEDIA_TRIGGERS);
  const closeTargets = document.querySelectorAll(SELECTORS.MEDIA_CLOSE);

  const handleActivate = (trigger) => {
    const src = trigger.getAttribute("data-media-src") || 
                trigger.querySelector("img")?.getAttribute("src");
    const eventIndex = trigger.getAttribute("data-media-event-index");
    
    // EVENTS_DATA에서 이벤트 정보 가져오기
    if (eventIndex !== null && EVENTS_DATA && EVENTS_DATA[parseInt(eventIndex)]) {
      const event = EVENTS_DATA[parseInt(eventIndex)];
      const lang = getCurrentLanguage();
      const content = event[lang] || event.ko;
      const dateString = event.date || "";
      const formattedDate = dateString ? formatDate(dateString, lang) : "";
      
      openMediaModal(src, content.title || "", formattedDate, content.description || "");
    } else {
      // 기존 방식 (다른 곳에서 사용할 수 있음)
      const captionKey = trigger.getAttribute("data-media-caption-key");
      const dateString = trigger.getAttribute("data-media-date");
      const lang = getCurrentLanguage();
      const dictionary = CONTENT_DATA[lang];
      const fallbackCaption = trigger.querySelector("figcaption")?.textContent?.trim() || "";
      const caption = (captionKey && dictionary?.[captionKey]) || fallbackCaption;
      const formattedDate = dateString ? formatDate(dateString, lang) : "";
      openMediaModal(src, caption, formattedDate, "");
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => handleActivate(trigger));
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleActivate(trigger);
      }
    });
  });

  closeTargets.forEach((target) => {
    target.addEventListener("click", closeMediaModal);
  });

  // ESC 키로 모달 닫기
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (modal && !modal.classList.contains("hidden")) {
        closeMediaModal();
      }
      const awardModal = document.querySelector(SELECTORS.AWARD_MODAL);
      if (awardModal && !awardModal.classList.contains("hidden")) {
        closeAwardModal();
      }
      const zoomModal = document.querySelector(SELECTORS.IMAGE_ZOOM_MODAL);
      if (zoomModal && !zoomModal.classList.contains("hidden")) {
        closeImageZoom();
      }
    }
  });
};

