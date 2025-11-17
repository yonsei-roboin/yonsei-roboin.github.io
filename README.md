## Roboin Homepage

연세대학교 로봇 동아리 **Roboin**의 공식 소개 페이지입니다. GitHub Pages에서 배포하기 쉬운 정적 아키텍처를 기반으로 하며, Tailwind CSS와 바닐라 JavaScript만으로 다국어 전환 기능을 제공합니다.

### 주요 기능

- 한국어/영어 전환 버튼 제공 (`localStorage`로 언어 상태 유지)
- 반응형 레이아웃(헤더/히어로/활동/모집/문의 섹션)
- 모바일 네비게이션 토글 및 접근성 개선(스킵 링크, ARIA 속성)
- 콘텐츠-프레젠테이션 분리를 위한 `content.js` 데이터 설계

### 프로젝트 구조

```
Roboin-Homepage/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── content.js
│       └── script.js
└── README.md
```

### 개발 가이드

1. **로컬 미리보기**
   ```bash
   # 예시: VS Code Live Server 또는 간단한 http 서버
   npx serve .
   ```
2. **Tailwind CSS**
   - CDN(Play) 버전을 사용하므로 별도 빌드 과정 없이 바로 수정 가능합니다.
   - 필요 시 `assets/css/styles.css`에 커스텀 스타일을 확장하세요.
3. **콘텐츠 추가**
   - 새 텍스트 요소에는 `data-key`를 부여하고 `assets/js/content.js`에 동일한 키를 추가합니다.
   - 번역 누락을 방지하기 위해 `ko`, `en` 두 섹션을 항상 동기화하세요.
4. **배포**
   - `index.html`이 루트에 있어 GitHub Pages(`main` 브랜치)로 바로 호스팅할 수 있습니다.

### TODO

- [ ] 활동 사진/프로젝트 이미지 추가 (`assets/images/`)
- [ ] 실제 일정·연락처 정보로 업데이트
- [ ] Lighthouse 기반 성능/접근성 점검

필요한 기능이나 콘텐트가 있다면 이슈/PR로 제안해주세요! 🚀

