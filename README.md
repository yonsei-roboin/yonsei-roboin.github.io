# Roboin Homepage

연세대학교 로봇 동아리 Roboin의 공식 홈페이지입니다.

## 프로젝트 구조

```
homepage/
├── index.html              # 메인 페이지
├── archive.html            # 아카이브 페이지 (수상 실적, 이벤트 갤러리 등)
├── resources.html          # 리소스 페이지 (동아리방 장비 목록)
├── assets/
│   ├── css/
│   │   └── styles.css     # 커스텀 CSS 스타일
│   ├── js/
│   │   ├── content.js     # 모든 텍스트 콘텐츠 및 데이터 (가장 중요!)
│   │   └── script.js      # 메인 JavaScript 로직
│   └── images/
│       ├── awards/         # 수상 실적 이미지
│       ├── events/         # 이벤트/행사 이미지
│       ├── logo.jpg        # 로고 이미지
│       └── logo_with_text.png
└── README.md
```

## 파일 구조 상세 설명

### `index.html`
메인 페이지로, 다음 섹션들을 포함합니다:
- Hero 섹션 (히어로 배너)
- About 섹션 (동아리 소개)
- Activities 섹션 (활동 소개 및 하이라이트)
- Recruitment 섹션 (모집 안내)
- Keywords 섹션 (주요 키워드)
- Contact 섹션 (연락처 및 SNS 링크)

### `archive.html`
아카이브 페이지로, 다음 내용을 포함합니다:
- 수상 실적 목록 (AWARDS_DATA 기반)
- 이벤트 갤러리 (EVENTS_DATA 기반)
- 커리큘럼 상세 정보
- 명예 회원 및 현재 임원진 정보

### `resources.html`
리소스 페이지로, 동아리방에서 사용 가능한 장비 목록을 표시합니다:
- 컴퓨터
- 3D 프린터
- 임베디드 시스템
- 부품
- 도구

### `assets/js/content.js` ⚠️ 중요
**이 파일이 가장 중요합니다!** 모든 텍스트 콘텐츠와 데이터가 여기에 저장되어 있습니다.

주요 export:
- `CONTENT_DATA`: 페이지의 모든 텍스트 (한국어/영어)
- `AWARDS_DATA`: 수상 실적 데이터
- `EVENTS_DATA`: 이벤트/행사 데이터
- `RESOURCES_DATA`: 리소스 장비 데이터
- `RESOURCES_CONTENT`: 리소스 페이지 텍스트
- `OFFICERS_DATA`: 현재 임원진 정보
- `HONORARY_MEMBERS_DATA`: 명예 회원 정보

### `assets/js/script.js`
메인 JavaScript 로직을 담당합니다:
- 언어 전환 기능
- 동적 콘텐츠 렌더링 (수상, 이벤트, 리소스 등)
- 모달 관리 (이미지 확대, 수상 상세 보기)
- 슬라이더 기능
- 모바일 메뉴 토글

### `assets/css/styles.css`
Tailwind CSS로 커버되지 않는 커스텀 스타일을 정의합니다:
- Hero 섹션 그라데이션
- 카드 스타일
- 모달 스타일
- 슬라이더 스타일
- 애니메이션 효과

## 콘텐츠 수정 가이드

### 텍스트 수정하기

1. **HTML에서 텍스트를 수정하려면:**
   - HTML 파일에서 해당 요소에 `data-key` 속성이 있는지 확인
   - `data-key`가 있다면 → `assets/js/content.js`의 `CONTENT_DATA`에서 해당 키를 찾아 수정
   - `data-key`가 없다면 → HTML에서 직접 수정하거나, 새로 `data-key`를 추가하고 `content.js`에 등록

2. **예시: 메인 타이틀 수정**
   ```html
   <!-- index.html -->
   <h1 data-key="heroTitle">...</h1>
   ```
   ```javascript
   // assets/js/content.js
   export const CONTENT_DATA = {
     ko: {
       heroTitle: "수정할 텍스트",
       // ...
     },
     en: {
       heroTitle: "Modified text",
       // ...
     }
   };
   ```

3. **새로운 텍스트 추가하기**
   - HTML에 `data-key="newKeyName"` 추가
   - `content.js`의 `CONTENT_DATA.ko`와 `CONTENT_DATA.en` 모두에 동일한 키 추가
   - **중요**: 한국어와 영어 모두 추가해야 합니다!

### 수상 실적 추가/수정하기

`assets/js/content.js`의 `AWARDS_DATA` 배열을 수정합니다:

```javascript
export const AWARDS_DATA = [
  {
    image: "assets/images/awards/새로운_수상_이미지.jpg",
    ko: {
      title: "수상 제목",
      body: "수상 설명",
      caption: "이미지 캡션"
    },
    en: {
      title: "Award Title",
      body: "Award Description",
      caption: "Image Caption"
    }
  },
  // ... 기존 항목들
];
```

### 이벤트 추가/수정하기

`assets/js/content.js`의 `EVENTS_DATA` 배열을 수정합니다:

```javascript
export const EVENTS_DATA = [
  {
    date: "2025-01-15", // YYYY-MM-DD 형식
    image: "assets/images/events/새로운_이벤트.jpg",
    ko: {
      title: "이벤트 제목",
      caption: "이벤트 설명",
      description: "상세 설명 (선택사항)",
      alt: "대체 텍스트"
    },
    en: {
      title: "Event Title",
      caption: "Event Description",
      description: "Detailed description (optional)",
      alt: "Alt text"
    }
  },
  // ... 기존 항목들
];
```

### 리소스 장비 추가/수정하기

`assets/js/content.js`의 `RESOURCES_DATA` 배열을 수정합니다:

```javascript
export const RESOURCES_DATA = [
  {
    category: "computers", // computers, printers, embedded, components, tools 중 하나
    ko: {
      name: "장비 이름",
      description: "장비 설명",
      specs: "사양 정보"
    },
    en: {
      name: "Equipment Name",
      description: "Equipment Description",
      specs: "Specifications"
    },
    quantity: 1, // 수량
    status: "available", // available, in-use, maintenance 중 하나
    image: null // 이미지 경로 (선택사항)
  },
  // ... 기존 항목들
];
```

### 임원진 정보 수정하기

`assets/js/content.js`의 `OFFICERS_DATA` 배열을 수정합니다:

```javascript
export const OFFICERS_DATA = [
  {
    ko: {
      role: "회장", // 회장, 부회장, 임원진 중 하나
      name: "이름",
      major: "전공",
      email: "이메일@example.com" // 선택사항
    },
    en: {
      role: "President",
      name: "Name",
      major: "Major",
      email: "email@example.com"
    }
  },
  // ... 기존 항목들
];
```

## 이미지 추가 가이드

### 수상 실적 이미지 추가

1. 이미지를 `assets/images/awards/` 디렉토리에 추가
2. **파일명 규칙**: `001_대회명_상이름.jpg` 형식
   - `001`부터 시간 순서대로 숫자를 붙입니다
   - `_` 뒤에 대회명과 상 이름을 작성합니다
   - 예시: `001_7회 EDISON 우수.jpg`, `002_8회 EDISON 최우수.jpg`
3. `content.js`의 `AWARDS_DATA`에서 해당 이미지 경로를 참조

### 이벤트 이미지 추가

1. 이미지를 `assets/images/events/` 디렉토리에 추가
2. **파일명 규칙**: `YYMMDD_행사명.jpg` 형식
   - 날짜는 YYMMDD 형식 (예: 250101 = 2025년 1월 1일)
   - `_` 뒤에 행사명을 작성합니다
   - 예시: `250101_개총.jpg`, `250521_유학 세미나.jpg`
3. `content.js`의 `EVENTS_DATA`에서 해당 이미지 경로를 참조

### 이미지 최적화 권장사항

- **형식**: JPG 또는 PNG
- **크기**: 웹 최적화를 위해 가능한 한 작게 (일반적으로 1920px 이하)
- **이름**: 한글 파일명도 가능하지만, 영문 파일명을 권장 (호환성)

## 배포 방법

### GitHub Pages 배포

1. GitHub 저장소에 코드 푸시
2. 저장소 Settings → Pages로 이동
3. Source를 "Deploy from a branch" 선택
4. Branch를 `main` (또는 `master`) 선택
5. Save 클릭
6. 몇 분 후 `https://<username>.github.io/<repository-name>/`에서 확인

### 주의사항

- `index.html`이 루트 디렉토리에 있어야 합니다
- 상대 경로를 사용하고 있으므로 서브디렉토리에 배포할 경우 경로 수정이 필요할 수 있습니다
- 이미지 파일도 함께 커밋되어야 합니다

## 유지보수 체크리스트

매 학기기 업데이트 할 사항:
- [ ] 학기별 회원 수 업데이트 (`heroStatsMembers`)
- [ ] 모집 일정 업데이트 (`recruitmentScheduleBody`)
- [ ] 임원진 정보 업데이트 (`OFFICERS_DATA`)
- [ ] 연락처 및 SNS 링크 등 정보 확인

수시로 업데이트 할 사항:
- [ ] 새로운 수상 실적 추가 (`AWARDS_DATA`)
- [ ] 새로운 이벤트 추가 (`EVENTS_DATA`)
- [ ] 리소스 상태 업데이트 (`RESOURCES_DATA`의 `status` 필드)

## 참고사항

- 모든 텍스트는 `content.js`에서 관리하는 것이 좋습니다 (다국어 지원 및 유지보수 편의성)
- 이미지는 가능한 한 최적화하여 사용하세요 (로딩 속도 개선)
- 새로운 기능 추가 시 접근성(ARIA 속성 등)을 고려하세요

---

Roboin · Yonsei University Robotics Student Society
