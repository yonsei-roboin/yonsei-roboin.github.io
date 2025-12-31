/**
 * 슬라이더 관리 모듈
 */
import { CONFIG, SELECTORS } from "./config.js";
import { EVENTS_DATA } from "./content.js";
import { debounce, elementExists } from "./utils.js";

let mainSliderInterval = null;
let currentMainSlideIndex = 0;

/**
 * 메인 이벤트 슬라이더 높이 조정
 */
const adjustMainSliderHeight = () => {
  const sliderContainer = document.querySelector(SELECTORS.MAIN_SLIDER);
  const sliderTrack = document.querySelector(SELECTORS.MAIN_SLIDER_TRACK);
  if (!sliderContainer || !sliderTrack) return;

  const mainSection = sliderContainer.closest('#main');
  const gridContainer = mainSection?.querySelector('.grid');
  
  let targetHeight = 0;
  if (mainSection) {
    targetHeight = mainSection.offsetHeight;
  } else if (gridContainer) {
    targetHeight = gridContainer.offsetHeight;
  }
  
  if (targetHeight > 0) {
    sliderContainer.style.height = `${targetHeight}px`;
    sliderTrack.style.height = `${targetHeight}px`;
    
    const items = sliderTrack.querySelectorAll('.main-events-slider-item');
    items.forEach(item => {
      item.style.height = `${targetHeight}px`;
      item.style.minHeight = `${targetHeight}px`;
      const img = item.querySelector('img');
      if (img) {
        img.style.height = `${targetHeight}px`;
        img.style.minHeight = `${targetHeight}px`;
      }
    });
  }
};

/**
 * 메인 이벤트 슬라이더 초기화
 */
export const initMainEventsSlider = () => {
  const sliderContainer = document.querySelector(SELECTORS.MAIN_SLIDER);
  const sliderTrack = document.querySelector(SELECTORS.MAIN_SLIDER_TRACK);
  if (!sliderContainer || !sliderTrack) return;

  // 기존 인터벌 정리
  if (mainSliderInterval) {
    clearInterval(mainSliderInterval);
    mainSliderInterval = null;
  }

  // 초기 높이 설정
  setTimeout(() => {
    adjustMainSliderHeight();
  }, 0);

  // 이미지 로드 후 높이 재조정
  const images = sliderContainer.querySelectorAll('img');
  let loadedCount = 0;
  const totalImages = images.length;
  
  const forceImageHeight = () => {
    adjustMainSliderHeight();
    images.forEach((img) => {
      const item = img.closest('.main-events-slider-item');
      if (item && item.offsetHeight > 0) {
        img.style.height = `${item.offsetHeight}px`;
        img.style.minHeight = `${item.offsetHeight}px`;
      }
    });
  };
  
  if (totalImages > 0) {
    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
        if (loadedCount === totalImages) {
          setTimeout(forceImageHeight, CONFIG.IMAGE_LOAD_DELAY);
        }
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setTimeout(forceImageHeight, CONFIG.IMAGE_LOAD_DELAY);
          }
        });
      }
    });
  } else {
    setTimeout(forceImageHeight, CONFIG.IMAGE_LOAD_DELAY);
  }

  // 슬라이드 업데이트 함수
  const updateSlide = () => {
    if (sliderTrack) {
      sliderTrack.style.transform = `translateY(-${currentMainSlideIndex * 100}%)`;
    }
  };

  // 초기 슬라이드 설정
  currentMainSlideIndex = 0;
  updateSlide();

  // 자동 슬라이드 시작
  const slideCount = EVENTS_DATA ? EVENTS_DATA.length : 0;
  if (slideCount > 0) {
    mainSliderInterval = setInterval(() => {
      currentMainSlideIndex = (currentMainSlideIndex + 1) % slideCount;
      updateSlide();
    }, CONFIG.MAIN_SLIDER_INTERVAL);
  }

  // 리사이즈 이벤트 리스너 설정
  const mainSection = sliderContainer.closest('#main');
  const gridContainer = mainSection?.querySelector('.grid');
  
  const handleResize = debounce(() => {
    adjustMainSliderHeight();
    setTimeout(() => {
      const images = sliderContainer.querySelectorAll('img');
      images.forEach((img) => {
        const item = img.closest('.main-events-slider-item');
        if (item && item.offsetHeight > 0) {
          img.style.height = `${item.offsetHeight}px`;
          img.style.minHeight = `${item.offsetHeight}px`;
        }
      });
    }, CONFIG.RESIZE_DEBOUNCE_DELAY);
  }, CONFIG.RESIZE_DEBOUNCE_DELAY);

  window.addEventListener('resize', handleResize);
  
  if (mainSection) {
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mainSection);
  }
  if (gridContainer) {
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(gridContainer);
  }
};

/**
 * 일반 슬라이더 초기화
 */
export const initSliders = () => {
  const sliders = document.querySelectorAll(SELECTORS.SLIDERS);
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
      const tolerance = CONFIG.SLIDER_SCROLL_TOLERANCE;
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

