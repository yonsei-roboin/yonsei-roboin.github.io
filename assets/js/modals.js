/**
 * 모달 관리 모듈
 */
import { AWARDS_DATA, EVENTS_DATA, CONTENT_DATA } from "./content.js";
import { CONFIG, SELECTORS } from "./config.js";
import { formatDate, nl2br, elementExists, getEventImageUrls } from "./utils.js";
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
 * @param {HTMLElement} modal
 * @param {string[]} urls
 * @param {number} index
 */
const updateMediaModalGalleryIndex = (modal, urls, index) => {
  const img = modal.querySelector("#media-modal-img");
  const thumbs = modal.querySelector("#media-modal-thumbs");
  if (img && urls[index]) img.src = urls[index];
  modal.dataset.mediaGalleryIndex = String(index);
  if (thumbs) {
    thumbs.querySelectorAll(".media-modal-thumb").forEach((btn, i) => {
      btn.classList.toggle("is-active", i === index);
    });
  }
};

/**
 * Media 모달 열기
 * @param {string} src - 이미지 경로
 * @param {string} title - 제목
 * @param {string} date - 날짜
 * @param {string} description - 설명
 * @param {string[] | null} galleryUrls - 여러 장일 때 전체 URL (모달에서 썸네일·화살표로 전환)
 */
const openMediaModal = (src, title, date, description, galleryUrls = null) => {
  const modal = document.querySelector(SELECTORS.MEDIA_MODAL);
  if (!modal || !src) return;

  const img = modal.querySelector("#media-modal-img");
  const titleEl = modal.querySelector("#media-modal-title");
  const dateEl = modal.querySelector("#media-modal-date");
  const descriptionEl = modal.querySelector("#media-modal-description");
  const thumbs = modal.querySelector("#media-modal-thumbs");

  const urls =
    galleryUrls && galleryUrls.length > 1 ? galleryUrls : null;

  if (urls) {
    modal.dataset.mediaGallery = JSON.stringify(urls);
    let idx = urls.indexOf(src);
    if (idx < 0) idx = 0;
    modal.dataset.mediaGalleryIndex = String(idx);
    if (img) img.src = urls[idx];
    if (thumbs) {
      thumbs.classList.remove("hidden");
      thumbs.innerHTML = urls
        .map(
          (url, i) => `
        <button type="button" class="media-modal-thumb ${i === idx ? "is-active" : ""}" data-thumb-index="${i}" aria-label="${i + 1} / ${urls.length}">
          <img src="${url}" alt="" loading="lazy" />
        </button>
      `
        )
        .join("");
      thumbs.onclick = (e) => {
        const btn = e.target.closest("[data-thumb-index]");
        if (!btn) return;
        const i = parseInt(btn.getAttribute("data-thumb-index"), 10);
        updateMediaModalGalleryIndex(modal, urls, i);
      };
    }
  } else {
    delete modal.dataset.mediaGallery;
    delete modal.dataset.mediaGalleryIndex;
    if (img) img.src = src;
    if (thumbs) {
      thumbs.classList.add("hidden");
      thumbs.innerHTML = "";
      thumbs.onclick = null;
    }
  }

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
  delete modal.dataset.mediaGallery;
  delete modal.dataset.mediaGalleryIndex;
  const thumbs = modal.querySelector("#media-modal-thumbs");
  if (thumbs) {
    thumbs.classList.add("hidden");
    thumbs.innerHTML = "";
    thumbs.onclick = null;
  }
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
      const imageUrls = getEventImageUrls(event);
      const primary = imageUrls[0] || src;
      const gallery =
        imageUrls.length > 1 ? imageUrls : null;

      openMediaModal(
        primary,
        content.title || "",
        formattedDate,
        content.description || "",
        gallery
      );
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

  // ESC 키로 모달 닫기, 갤러리 좌우 화살표
  document.addEventListener("keydown", (event) => {
    if (
      (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
      modal &&
      !modal.classList.contains("hidden")
    ) {
      const raw = modal.dataset.mediaGallery;
      if (raw) {
        let urls;
        try {
          urls = JSON.parse(raw);
        } catch {
          urls = null;
        }
        if (urls && urls.length > 1) {
          event.preventDefault();
          let idx = parseInt(modal.dataset.mediaGalleryIndex || "0", 10);
          if (event.key === "ArrowLeft") {
            idx = (idx - 1 + urls.length) % urls.length;
          } else {
            idx = (idx + 1) % urls.length;
          }
          updateMediaModalGalleryIndex(modal, urls, idx);
          return;
        }
      }
    }
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

