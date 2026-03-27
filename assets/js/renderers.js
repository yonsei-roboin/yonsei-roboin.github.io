/**
 * 콘텐츠 렌더링 모듈
 */
import { 
  AWARDS_DATA, 
  EVENTS_DATA, 
  RESOURCES_DATA, 
  RESOURCES_CONTENT, 
  OFFICERS_DATA, 
  HONORARY_MEMBERS_DATA,
  ARCHIVE_PROJECTS_DATA,
  CONTENT_DATA 
} from "./content.js";
import { CONFIG, SELECTORS } from "./config.js";
import { formatDate, shuffleArray, elementExists, getEventImageUrls } from "./utils.js";

/**
 * 수상 실적 렌더링
 * @param {string} lang - 언어 코드
 * @param {Function} initAwardModals - Award 모달 초기화 함수 (옵션)
 */
export const renderAwards = (lang, initAwardModals = null) => {
  const awardsContainer = document.querySelector(SELECTORS.AWARDS_CONTAINER);
  if (!awardsContainer || !AWARDS_DATA) return;

  awardsContainer.innerHTML = AWARDS_DATA.map((award, index) => {
    const isOpen = index === 0 ? "open" : "";
    const content = award[lang] || award.ko;
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

  // Award 모달 이벤트 리스너 설정
  if (initAwardModals) {
    initAwardModals(lang);
  }
};

/**
 * 이벤트 렌더링
 * @param {string} lang - 언어 코드
 * @param {Function} initMediaModal - Media 모달 초기화 함수 (옵션)
 * @param {Function} initSliders - 슬라이더 초기화 함수 (옵션)
 */
export const renderEvents = (lang, initMediaModal = null, initSliders = null) => {
  const eventsTrack = document.querySelector(SELECTORS.EVENTS_TRACK);
  if (!eventsTrack || !EVENTS_DATA) return;

  eventsTrack.innerHTML = EVENTS_DATA.map((event, index) => {
    const content = event[lang] || event.ko;
    const formattedDate = event.date ? formatDate(event.date, lang) : "";
    const imageUrls = getEventImageUrls(event);
    const primarySrc = imageUrls[0] || "";
    return `
      <figure
        class="event-card"
        data-slider-item
        data-media-trigger
        data-media-src="${primarySrc}"
        data-media-date="${event.date || ''}"
        data-media-event-index="${index}"
        data-media-caption-key=""
        role="button"
        tabindex="0"
      >
        <img
          src="${primarySrc}"
          alt="${content.alt}"
          loading="lazy"
        />
        ${formattedDate ? `<p class="event-date">${formattedDate}</p>` : ''}
        <figcaption class="event-caption">${content.caption}</figcaption>
      </figure>
    `;
  }).join("");

  // 이벤트 리스너 재설정
  if (initMediaModal) {
    initMediaModal();
  }
  if (initSliders) {
    initSliders();
  }
};

/**
 * 하이라이트 섹션 렌더링
 * @param {string} lang - 언어 코드
 * @param {Function} initAwardModals - Award 모달 초기화 함수 (옵션)
 * @param {Function} initMediaModal - Media 모달 초기화 함수 (옵션)
 */
export const renderHighlights = (lang, initAwardModals = null, initMediaModal = null) => {
  const { AWARDS_INITIAL, AWARDS_MORE, EVENTS_INITIAL, EVENTS_MORE } = CONFIG.HIGHLIGHTS;

  // 수상실적 하이라이트
  renderAwardsHighlights(lang, AWARDS_INITIAL, AWARDS_MORE, initAwardModals);
  
  // 이벤트 하이라이트
  renderEventsHighlights(lang, EVENTS_INITIAL, EVENTS_MORE, initMediaModal);
};

/**
 * 수상실적 하이라이트 렌더링
 * @param {string} lang - 언어 코드
 * @param {number} initialCount - 초기 표시 개수
 * @param {number} moreCount - 더 보기 표시 개수
 * @param {Function} initAwardModals - Award 모달 초기화 함수 (옵션)
 */
const renderAwardsHighlights = (lang, initialCount, moreCount, initAwardModals = null) => {
  const awardsContainer = document.querySelector(SELECTORS.HIGHLIGHTS_AWARDS);
  const awardsMoreContainer = document.querySelector(SELECTORS.HIGHLIGHTS_AWARDS_MORE);
  
  if (!awardsContainer || !AWARDS_DATA || AWARDS_DATA.length === 0) return;

  const topAwards = AWARDS_DATA.slice(0, initialCount);
  const moreAwards = AWARDS_DATA.slice(initialCount, initialCount + moreCount);
  
  awardsContainer.innerHTML = topAwards.map((award, index) => {
    const content = award[lang] || award.ko;
    return `
      <article class="award-card block hover:opacity-90 transition-opacity cursor-pointer" data-award-trigger="${index}">
        <span class="award-badge">${content.title.split(' ')[0] || 'Award'}</span>
        <h4 class="award-title">${content.title}</h4>
        <p class="award-body">${content.body || content.caption || ''}</p>
      </article>
    `;
    }).join("");
    
    // Award 모달 이벤트 리스너 설정
    if (initAwardModals) {
      initAwardModals(lang);
    }
    
    if (awardsMoreContainer && moreAwards.length > 0) {
      awardsMoreContainer.innerHTML = moreAwards.map((award, index) => {
        const actualIndex = index + initialCount;
        const content = award[lang] || award.ko;
        return `
          <article class="award-card block hover:opacity-90 transition-opacity cursor-pointer" data-award-trigger="${actualIndex}">
            <span class="award-badge">${content.title.split(' ')[0] || 'Award'}</span>
            <h4 class="award-title">${content.title}</h4>
            <p class="award-body">${content.body || content.caption || ''}</p>
          </article>
        `;
      }).join("");
      
      // 더 보기 항목에도 모달 이벤트 리스너 설정
      if (initAwardModals) {
        initAwardModals(lang);
      }
    }
  };

/**
 * 이벤트 하이라이트 렌더링
 * @param {string} lang - 언어 코드
 * @param {number} initialCount - 초기 표시 개수
 * @param {number} moreCount - 더 보기 표시 개수
 * @param {Function} initMediaModal - Media 모달 초기화 함수 (옵션)
 */
const renderEventsHighlights = (lang, initialCount, moreCount, initMediaModal = null) => {
  const eventsContainer = document.querySelector(SELECTORS.HIGHLIGHTS_EVENTS);
  const eventsMoreContainer = document.querySelector(SELECTORS.HIGHLIGHTS_EVENTS_MORE);
  
  if (!eventsContainer || !EVENTS_DATA || EVENTS_DATA.length === 0) return;

  const topEvents = EVENTS_DATA.slice(0, initialCount);
  const moreEvents = EVENTS_DATA.slice(initialCount, initialCount + moreCount);
  
  eventsContainer.innerHTML = topEvents.map((event, index) => {
    const content = event[lang] || event.ko;
    const formattedDate = event.date ? formatDate(event.date, lang) : "";
    const imageUrls = getEventImageUrls(event);
    const primarySrc = imageUrls[0] || "";
    return `
      <figure
        class="event-card block hover:opacity-90 transition-opacity cursor-pointer"
        data-media-trigger
        data-media-src="${primarySrc}"
        data-media-date="${event.date || ''}"
        data-media-event-index="${index}"
        role="button"
        tabindex="0"
      >
        <img
          src="${primarySrc}"
          alt="${content.alt || content.title || content.caption}"
          loading="lazy"
        />
        ${formattedDate ? `<p class="event-date">${formattedDate}</p>` : ''}
        <figcaption class="event-caption">${content.title || content.caption}</figcaption>
      </figure>
    `;
    }).join("");
  
  // 모달 이벤트 리스너 재설정
  if (initMediaModal) {
    initMediaModal();
  }
  
  if (eventsMoreContainer && moreEvents.length > 0) {
    eventsMoreContainer.innerHTML = moreEvents.map((event, index) => {
      const actualIndex = index + initialCount;
      const content = event[lang] || event.ko;
      const formattedDate = event.date ? formatDate(event.date, lang) : "";
      const imageUrls = getEventImageUrls(event);
      const primarySrc = imageUrls[0] || "";
      return `
        <figure
          class="event-card block hover:opacity-90 transition-opacity cursor-pointer"
          data-media-trigger
          data-media-src="${primarySrc}"
          data-media-date="${event.date || ''}"
          data-media-event-index="${actualIndex}"
          role="button"
          tabindex="0"
        >
          <img
            src="${primarySrc}"
            alt="${content.alt || content.title || content.caption}"
            loading="lazy"
          />
          ${formattedDate ? `<p class="event-date">${formattedDate}</p>` : ''}
          <figcaption class="event-caption">${content.title || content.caption}</figcaption>
        </figure>
      `;
    }).join("");
    
    // 더 보기 항목에도 모달 이벤트 리스너 재설정
    if (initMediaModal) {
      initMediaModal();
    }
  }
};

/**
 * 리소스 렌더링
 * @param {string} lang - 언어 코드
 */
export const renderResources = (lang) => {
  const resourcesContainer = document.querySelector(SELECTORS.RESOURCES_CONTAINER);
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
      
      // 다이나믹셀의 경우 특별한 카드 그리드 형태로 표시
      if (resource.isDynamixel && resource.dynamixelMotors) {
        html += renderDynamixelResource(resource, resourceContent, lang);
      } else {
        // 일반 리소스는 기존 방식대로 표시
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
      }
    });
  });

  resourcesContainer.innerHTML = html;
};

/**
 * 아카이브 우수 프로젝트 렌더링 (content.js의 ARCHIVE_PROJECTS_DATA 사용)
 * @param {string} lang - 언어 코드
 */
export const renderArchiveProjects = (lang) => {
  const container = document.querySelector(SELECTORS.ARCHIVE_PROJECTS_CONTAINER);
  if (!container || !ARCHIVE_PROJECTS_DATA) return;

  container.innerHTML = ARCHIVE_PROJECTS_DATA.map((project) => {
    const content = project[lang] || project.ko;
    const isVideo = project.mediaType === "video";
    const mediaHtml = isVideo
      ? `<div class="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-black">
           <video class="w-full h-auto" src="${project.src}" controls playsinline></video>
         </div>`
      : `<div class="mt-4 rounded-2xl overflow-hidden border border-slate-200">
           <img class="w-full h-auto" src="${project.src}" alt="${content.title}" loading="lazy" />
         </div>`;
    return `
      <article class="activity-card">
        <h3 class="activity-title">${content.title}</h3>
        <p class="activity-body">${content.body}</p>
        ${mediaHtml}
      </article>
    `;
  }).join("");
};

/**
 * 다이나믹셀 리소스 렌더링
 * @param {Object} resource - 리소스 데이터
 * @param {Object} resourceContent - 리소스 콘텐츠
 * @param {string} lang - 언어 코드
 * @returns {string} HTML 문자열
 */
const renderDynamixelResource = (resource, resourceContent, lang) => {
  const totalDynamixelCount = resource.dynamixelMotors.reduce(
    (sum, motor) => sum + motor.units.length, 
    0
  );
  
  let html = `
    <article class="resource-card">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h4 class="resource-card-title">${resourceContent.name}</h4>
          <p class="resource-card-description mt-1">${resourceContent.description}</p>
          <p class="text-sm text-slate-600 mt-2">
            <span class="font-semibold">${lang === "ko" ? "전체 " : "Total "}</span>
            <span>${totalDynamixelCount}${lang === "ko" ? "개" : ""}</span>
          </p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
  `;
  
  resource.dynamixelMotors.forEach((motor) => {
    // 프로젝트별로 그룹화
    const projectGroups = {};
    motor.units.forEach((unit) => {
      const key = unit.project || "available";
      if (!projectGroups[key]) {
        projectGroups[key] = { count: 0, status: unit.status };
      }
      projectGroups[key].count++;
    });
    
    const totalUnits = motor.units.length;
    const availableCount = motor.units.filter(u => u.status === "available").length;
    
    const statusBadgeClass = availableCount > 0 
      ? "bg-green-100 text-green-800" 
      : "bg-yellow-100 text-yellow-800";
    const statusBadgeText = availableCount > 0 
      ? (lang === "ko" ? "사용 가능" : "Available")
      : (lang === "ko" ? "사용 중" : "In Use");
    
    html += `
      <div class="dynamixel-motor-card bg-slate-50 border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between mb-2">
          <h5 class="font-bold text-slate-900 text-base">${motor.model}</h5>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadgeClass}">
            ${statusBadgeText}
          </span>
        </div>
        <div class="space-y-1.5">
          <div class="text-xs text-slate-600">
            <span class="font-semibold">${lang === "ko" ? "총 " : "Total "}</span>
            <span>${totalUnits}${lang === "ko" ? "개" : ""}</span>
          </div>
    `;
    
    Object.entries(projectGroups)
      .sort(([a], [b]) => {
        if (a === "available") return 1;
        if (b === "available") return -1;
        return 0;
      })
      .forEach(([project, info]) => {
        const projectName = project === "available" 
          ? (lang === "ko" ? "사용 가능" : "Available")
          : project;
        const projectBadgeClass = project === "available"
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-blue-50 text-blue-700 border-blue-200";
        
        html += `
          <div class="flex items-center justify-between text-xs">
            <span class="px-1.5 py-0.5 rounded border ${projectBadgeClass} font-medium text-xs">
              ${projectName}
            </span>
            <span class="text-slate-600 font-semibold text-xs">${info.count}${lang === "ko" ? "개" : ""}</span>
          </div>
        `;
      });
    
    html += `
        </div>
      </div>
    `;
  });
  
  html += `
      </div>
    </article>
  `;
  
  return html;
};

/**
 * 임원진 렌더링
 * @param {string} lang - 언어 코드
 */
export const renderOfficers = (lang) => {
  const officersContainer = document.querySelector(SELECTORS.OFFICERS_CONTAINER);
  if (!officersContainer || !OFFICERS_DATA) return;

  const presidents = OFFICERS_DATA.filter((o) => o?.ko?.role === "회장");
  const vicePresidents = OFFICERS_DATA.filter((o) => o?.ko?.role === "부회장");
  const officers = OFFICERS_DATA.filter((o) => o?.ko?.role === "임원진");

  let html = "";

  presidents.forEach((president) => {
    const content = president[lang] || president.ko;
    html += `
      <div>
        <p class="stack-card-label">${CONTENT_DATA[lang].archiveOfficersSectionPresidentLabel || "회장"}</p>
        <p class="stack-card-note">
          ${content.name} · ${content.major}
          ${content.email ? `<br><a href="mailto:${content.email}" class="text-blue-600 hover:underline text-sm">${content.email}</a>` : ''}
        </p>
      </div>
    `;
  });

  vicePresidents.forEach((vicePresident) => {
    const content = vicePresident[lang] || vicePresident.ko;
    html += `
      <div>
        <p class="stack-card-label">${CONTENT_DATA[lang].archiveOfficersSectionViceLabel || "부회장"}</p>
        <p class="stack-card-note">
          ${content.name} · ${content.major}
          ${content.email ? `<br><a href="mailto:${content.email}" class="text-blue-600 hover:underline text-sm">${content.email}</a>` : ''}
        </p>
      </div>
    `;
  });

  officers.forEach((officer) => {
    const content = officer[lang] || officer.ko;
    html += `
      <div>
        <p class="stack-card-label">${CONTENT_DATA[lang].archiveOfficersSectionOfficerLabel || "임원진"}</p>
        <p class="stack-card-note">
          ${content.name} · ${content.major}
          ${content.email ? `<br><a href="mailto:${content.email}" class="text-blue-600 hover:underline text-sm">${content.email}</a>` : ''}
        </p>
      </div>
    `;
  });

  officersContainer.innerHTML = html;
};

/**
 * 명예 회원 렌더링
 * @param {string} lang - 언어 코드
 */
export const renderHonoraryMembers = (lang) => {
  const honoraryContainer = document.querySelector(SELECTORS.HONORARY_CONTAINER);
  if (!honoraryContainer || !HONORARY_MEMBERS_DATA) return;

  const html = HONORARY_MEMBERS_DATA.map((member) => {
    const content = member[lang] || member.ko;
    return `
      <li>
        <p class="stack-card-label">${content.name}</p>
        <p class="stack-card-note">${content.affiliation}</p>
      </li>
    `;
  }).join("");

  honoraryContainer.innerHTML = html;
};

/**
 * 메인 이벤트 슬라이더 렌더링
 * @param {string} lang - 언어 코드
 * @param {Function} initMainEventsSlider - 메인 슬라이더 초기화 함수 (옵션)
 */
export const renderMainEventsSlider = (lang, initMainEventsSlider = null) => {
  const sliderContainer = document.querySelector(SELECTORS.MAIN_SLIDER);
  if (!sliderContainer || !EVENTS_DATA || EVENTS_DATA.length === 0) return;

  // 이벤트 데이터를 랜덤하게 섞기
  const shuffledEvents = shuffleArray(EVENTS_DATA);

  // 슬라이더 HTML 생성
  const sliderHTML = `
    <div class="main-events-slider-track" id="main-events-slider-track">
      ${shuffledEvents.map((event, index) => {
        const content = event[lang] || event.ko;
        const primarySrc = getEventImageUrls(event)[0] || "";
        return `
          <div 
            class="main-events-slider-item" 
            data-slide-index="${index}"
          >
            <img
              src="${primarySrc}"
              alt="${content.alt || content.title || content.caption || ''}"
              loading="lazy"
            />
          </div>
        `;
      }).join("")}
    </div>
  `;

  sliderContainer.innerHTML = sliderHTML;

  // 높이 조정 및 슬라이더 초기화
  if (initMainEventsSlider) {
    initMainEventsSlider();
  }
};

