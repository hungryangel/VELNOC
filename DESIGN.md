# VELNOC DESIGN.md v1

## 1️⃣ Overview

VELNOC은 소상공인을 위한 검색·AI 인프라 컨설팅이라는 직업적 정체성을 가진 브랜드다. 시각 시스템은 Replicate의 editorial-magazine 정신을 계승하되, 벨녹 고유의 두 요소를 보강한다 — (a) 세리프 디스플레이로 표현되는 인문체 신뢰, (b) STAGE 라벨·약정·진단 결과의 코드형 스펙 시트 결.

핵심 톤은 "따뜻한 인프라 (Warm Infra)"다. 광고 카피처럼 외치지 않고, 글로 설명하며, 측정 가능한 데이터로 증명한다.

핵심 특징:
- 디폴트 캔버스는 {colors.canvas} — #F4ECE0 (크림). 다크 모드 사용자에게는 {colors.canvas-dark} — #0E0D0C.
- 브랜드 액센트는 {colors.primary} — #C7402A (테라코타-레드). 스탬프처럼 절제, 뷰포트당 1회 원칙.
- 3-폰트 시스템: 디스플레이는 세리프, UI/본문은 산세리프, 가격·STAGE·진단 결과는 모노스페이스.
- 풀 라운드 인터랙티브 ({rounded.full} 9999px): 버튼·인풋·뱃지·아바타. 콘텐츠 카드는 {rounded.md} 10px / {rounded.lg} 16px.
- 컬러블록 엘리베이션: 그림자 대신 캔버스 색상 단차로 깊이 표현. 코드 웰·진단 결과 박스만 다크 인버전.
- 섹션 리듬: cream → orange hero → cream → dark code/STAGE band → cream → black footer.

## 2️⃣ Colors

### Brand & Accent
- {colors.primary} — #C7402A: 메인 CTA 배경, 히어로 밴드, 인라인 링크. 뷰포트당 1회 원칙.
- {colors.primary-pressed} — #A22F1E: button-primary 눌림 상태.
- {colors.hero-glow} — #E8694A: 히어로 방사형 메쉬의 중간 정거장.
- {colors.hero-warm} — #F2A88F: 히어로 밴드 하단 → 크림 전환부 워시.
- {colors.on-primary} — #FFFFFF: primary 위 라벨.

### Surface — Light (Default)
- {colors.canvas} — #F4ECE0: 페이지 디폴트 배경. 순백 금지.
- {colors.surface-bone} — #EBE1D2: inset 카드 그룹·가격 밴드·운영 정책 박스.
- {colors.surface-card} — #FFFFFF: 개별 카드·입력창. 흰색은 여기만.
- {colors.surface-dark} — #1B1916: 코드 웰·featured 가격 티어·STAGE 다이어그램.
- {colors.surface-deep} — #0A0908: 푸터·code-tab 스트립.
- {colors.hairline} — rgba(27,25,22,0.12): 크림 위 1px 디바이더.
- {colors.hairline-strong} — #1B1916: 버튼 아웃라인·포커스 인풋·구조 분할선.

### Surface — Dark (Opt-in)
- {colors.canvas-dark} — #0E0D0C: 다크 모드 디폴트 배경.
- {colors.surface-bone-dark} — #15110E
- {colors.surface-card-dark} — #1B1916
- {colors.surface-elev-dark} — #241F1A
- {colors.surface-deep-dark} — #000000
- {colors.hairline-dark} — rgba(244,236,224,0.10)
- {colors.hairline-strong-dark} — #3A3128

### Text — Light
- {colors.ink} — #1B1916: 본문 1순위.
- {colors.body} — #3A332D: 18px+ 장문.
- {colors.charcoal} — #5A4F46: 캡션·메타.
- {colors.mute} — #6E6155: 보조 텍스트.
- {colors.ash} — #8E8276: 3차 텍스트·플레이스홀더.
- {colors.stone} — #BCB1A4: 비활성 전경.

### Text — Dark
- {colors.on-dark} — #F4ECE0
- {colors.on-dark-mute} — rgba(244,236,224,0.72)
- {colors.on-dark-ash} — rgba(244,236,224,0.48)

### Semantic
- {colors.success} — #2F8E5A
- {colors.warning} — #C28A1E
- {colors.danger} — #9E2A1A
- {colors.link} — #C7402A (= primary)
- {colors.ring-focus} — rgba(199,64,42,0.45)

## 3️⃣ Typography

### Font Family
- Display (Serif): "Noto Serif KR", "Source Serif 4", Georgia, serif — H1·H2·슬로건·매니페스토 헤딩.
- UI/Body (Sans): "Pretendard Variable", "Inter", system-ui, sans-serif — 본문·버튼·캡션·네비.
- Mono: "JetBrains Mono", ui-monospace, Menlo, monospace — 가격·STAGE 라벨·진단 결과·코드 웰.

한국어 라인에 Mono 사용 금지. Mono는 영문·숫자·기호 전용.

### Hierarchy
| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| {typography.display-xxl} | 96px | 600 | 1.05 | -2.5px | 홈 히어로 1회 |
| {typography.display-xl} | 64px | 600 | 1.05 | -1.5px | 섹션 오프너 |
| {typography.display-lg} | 44px | 600 | 1.1 | -0.8px | 서브섹션·가격 티어명 |
| {typography.display-md} | 30px | 600 | 1.15 | -0.5px | 카드 타이틀 |
| {typography.heading-lg} | 24px | 600 | 1.3 | -0.3px | 카드 헤더 |
| {typography.heading-md} | 20px | 600 | 1.35 | -0.2px | 리스트 섹션 헤더 |
| {typography.heading-sm} | 18px | 600 | 1.4 | -0.15px | 폼 라벨·가격 라인 |
| {typography.subtitle} | 18px | 500 | 1.55 | 0 | 리드 문단 |
| {typography.body-lg} | 18px | 400 | 1.6 | 0 | 마케팅 산문 |
| {typography.body-md} | 16px | 400 | 1.55 | 0 | 디폴트 본문 |
| {typography.body-sm} | 14px | 400 | 1.5 | 0 | 캡션·메타 |
| {typography.button-md} | 16px | 600 | 1.0 | 0 | 버튼 라벨 |
| {typography.button-sm} | 14px | 600 | 1.0 | 0 | 컴팩트 버튼 |
| {typography.caption} | 12px | 400 | 1.4 | 0 | 푸터 |
| {typography.caption-strong} | 12px | 600 | 1.4 | -0.2px | 가격 행 강조 |
| {typography.code-md} | 14px | 400 | 1.5 | 0 | 코드·STAGE·가격 모노 |
| {typography.code-sm} | 12px | 400 | 1.5 | 0 | 코드 탭 |

### Principles
- 세리프(디스플레이) / 산세리프(본문) / 모노(코드) 3-차선. 강조는 굵기 변경이 아니라 패밀리 변경으로.
- 디스플레이 line-height 1.05 고정.
- 본문은 400, 강조는 600. 500은 사용하지 않음.
- 가격·STAGE는 반드시 모노. 한국어가 섞이면 본문체 + 영문 부기 모노 병기.

## 4️⃣ Layout

### Spacing
- {spacing.xxs} 2px · {spacing.xs} 4px · {spacing.sm} 8px · {spacing.md} 12px · {spacing.lg} 16px · {spacing.xl} 24px · {spacing.xxl} 32px · {spacing.xxxl} 48px · {spacing.section} 96px · {spacing.band} 144px.

### Container
- {container.body} — 1200px (본문 섹션)
- {container.hero} — 1360px (히어로)
- {container.read} — 720px (장문 페이지)

### Grid
- 케이스 그리드: desktop 3 / tablet 2 / mobile 1.
- 가격 그리드: desktop 5-up (Site/Seed/Pulse/Signal/Engine), <1280 4-up, <1024 stack. Signal은 featured 다크 인버전.

### Whitespace
- 크림 위 섹션 사이 {spacing.section} 96px. 히어로·매니페스토 {spacing.band} 144px.
- 카드 내부 16~32px.
- 그림자 대신 {colors.hairline} 헤어라인이 분할 담당.

## 5️⃣ Elevation & Depth

| Level | Token | Treatment | Use |
|---|---|---|---|
| 0 | {elevation.flat} | 그림자/보더 없음 | 캔버스, full-bleed |
| 1 | {elevation.outline} | 1px solid {colors.hairline} | 카드·가격 티어·FAQ |
| 2 | {elevation.inset} | 배경을 {colors.surface-bone}으로 한 단 | 운영 정책 박스·포함 그룹 |
| 3 | {elevation.invert} | {colors.surface-dark} 카드 | 코드 웰·featured·STAGE 다이어그램·진단 결과 |
| 4 | {elevation.drop} | 0 8px 24px rgba(27,25,22,0.08) | 호버 시 케이스 썸네일 |

### Decorative Depth
- 히어로 메쉬: {colors.primary} 코어 → {colors.hero-glow} 중간 → {colors.hero-warm} 외곽 → {colors.canvas}. 홈 한 곳만.
- 다크 모드: prefers-color-scheme: dark에서 canvas 토큰을 canvas-dark로 자동 치환. 히어로 메쉬와 featured 카드는 모드 무관 유지(다크에서는 메쉬가 더 깊은 burgundy로 자연 어두워짐).
- {texture.noise-grain}: 1~2% opacity 노이즈를 메쉬와 invert 카드 위에 깔아 디지털 광택 차단.

## 6️⃣ Shapes

| Token | Value | Use |
|---|---|---|
| {rounded.none} | 0px | 히어로·full-bleed·푸터 |
| {rounded.xs} | 4px | 코드 탭·inline 칩 |
| {rounded.sm} | 6px | 작은 인셋 칩 |
| {rounded.md} | 10px | 케이스·코드 웰 |
| {rounded.lg} | 16px | 가격 티어·큰 피처 카드 |
| {rounded.full} | 9999px | 모든 인터랙티브 |

## Motion

- {motion.duration-fast}: 120ms
- {motion.duration-base}: 180ms
- {motion.duration-slow}: 280ms
- {motion.ease-standard}: cubic-bezier(0.2, 0.75, 0.2, 1)
- {motion.ease-out}: cubic-bezier(0.16, 1, 0.3, 1)
- {motion.hover-lift}: translateY(-2px)
- {motion.card-lift}: translateY(-3px)

## 7️⃣ Components

### Buttons
- {component.button-primary}: BG {colors.primary}, label {colors.on-primary}, {typography.button-md}, padding 12px 24px, {rounded.full}, 44px. Pressed: BG {colors.primary-pressed}.
- {component.button-dark}: BG {colors.surface-dark}, label {colors.on-dark}, {typography.button-md}, {rounded.full}, 44px.
- {component.button-outline}: BG {colors.surface-card}, label {colors.ink}, 1px {colors.hairline-strong}, {rounded.full}, 44px.
- {component.button-ghost}: BG transparent, label {colors.ink}, no border, {rounded.full}, padding 8px 16px.
- {component.button-icon}: BG {colors.surface-card}, 1px {colors.hairline}, {rounded.full}, 36×36 (모바일 44×44).

### Cards
- {component.case-card}: BG {colors.surface-dark}, border 0.5px solid rgba(244,236,224,0.10), {rounded.md}, padding 28px 28px 24px. 메타 라벨 영역 모노.
  - meta-grid: key 96px, row-gap 6px, col-gap 16px.
  - stage-chip: 라벨/뱃지는 고유명사 표식이므로 한글 라벨도 모노 사용 가능. 본문/주석에는 모노 한국어 문단 금지 원칙 유지.
- {component.plan-card}: BG {colors.surface-card}, {rounded.lg}, padding {spacing.xxl}. STAGE 칩 모노, 티어명 세리프, 가격 모노.
- {component.plan-card-featured}: BG {colors.surface-dark}, label {colors.on-dark}, 동일 구조. Signal에 사용.
- {component.policy-block}: BG {colors.surface-bone}, {rounded.md}, padding {spacing.xl}. 헤더 모노 "# 운영 정책 — 모든 구독 공통", 본문 좌측 모노 + 우측 본문 두 컬럼.
- {component.code-block}: BG {colors.surface-dark}, label {colors.on-dark}, {rounded.md}, padding {spacing.xl}, {typography.code-md}.
- {component.code-tab}: BG {colors.surface-deep}, label {colors.on-dark-mute}, {typography.code-sm}, {rounded.xs}, padding 6px 12px. Active: label {colors.on-dark} + 2px {colors.primary} 언더라인.
- {component.hero-band}: BG 메쉬, title {typography.display-xxl} 세리프, subtitle {typography.subtitle} 산세리프.
- {component.faq-item}: BG {colors.surface-card}, {rounded.md}, padding {spacing.xl}, 1px {colors.hairline}. Question {typography.heading-sm} 산세리프, Answer {typography.body-md} 산세리프. 가격·기간만 모노.

### Inputs
- {component.text-input}: BG {colors.surface-card}, 1px {colors.hairline}, {rounded.full}, padding 12px 20px, 44px. Focus: 3px ring {colors.ring-focus}, border {colors.hairline-strong}.
- {component.textarea}: 동일 토큰, {rounded.md}.

### Navigation
- {component.nav-bar}: BG {colors.canvas} (다크 시 {colors.canvas-dark}), {typography.button-sm}, height 60px, 하단 1px {colors.hairline}. Left 워드마크, Center 서비스·케이스·진단, Right {component.button-primary}.
- {component.nav-bar-mobile}: 동일 60px, center를 햄버거로. 오버레이 {colors.canvas} full-screen.
- {component.sub-nav-pill}: BG {colors.canvas}, 1px {colors.hairline}, {typography.button-sm}, {rounded.full}, padding 8px 16px, 36px (모바일 40px). Active: BG {colors.ink}, label {colors.on-dark}.

### Signature
- {component.stage-label}: format [STAGE 01]~[STAGE 05]. {typography.code-md} 모노, color {colors.charcoal} (다크 {colors.on-dark-mute}).
- {component.diagnosis-result}: {component.code-block} 기반. 형식:
  $ velnoc diagnose
  ├─ stage     : 02  인지
  ├─ gaps      : 구조화 데이터, 인덱싱
  ├─ next      : 03  노출
  └─ suggested : Pulse 3개월부터
- {component.badge-status}: BG {colors.success}, label {colors.on-dark}, {typography.caption}, {rounded.full}, padding 4px 10px.
- {component.badge-tag}: BG {colors.canvas}, label {colors.ink}, 1px {colors.hairline}, {typography.caption}, {rounded.full}, padding 4px 10px.
- {component.footer}: BG {colors.surface-deep} (라이트/다크 공통 검정), label {colors.on-dark}, {typography.body-sm}, {rounded.none}, padding 64px 32px.

## 8️⃣ Do's and Don'ts

### Do
- {colors.canvas} 크림을 페이지 디폴트로. 다크는 OS prefers에 따라서만.
- {colors.primary}는 메인 CTA · 히어로 · 인라인 링크 — 이 셋만.
- 모든 인터랙티브에 {rounded.full}.
- 콘텐츠 카드는 {rounded.md} 또는 {rounded.lg}.
- 디스플레이는 항상 세리프, 가격·STAGE·코드는 항상 모노.
- 강조는 family 변경으로 (산세리프 → 세리프 또는 모노).
- 페이지 리듬: cream → orange hero → cream → dark code/STAGE → cream → black footer.

### Don't
- 페이지 배경을 순백 #FFFFFF으로 두지 말 것 (흰색은 카드 안에서만).
- 보조 브랜드 컬러 추가 금지.
- 디스플레이 line-height를 1.05 이상으로 풀지 말 것.
- 본문 굵기를 500으로 올리지 말 것 — family로 강조.
- 콘텐츠 카드에 {rounded.full} 적용 금지.
- 코드를 밝은 회색 박스에 넣지 말 것 — 항상 {colors.surface-dark}.
- {colors.primary}를 본문이나 큰 면적에 사용 금지.
- 크림 위에 드롭 섀도우 남발 금지 (호버 thumbnail 외).
- 한국어 문단에 모노 적용 금지.

## 9️⃣ Responsive

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Desktop XL | ≥1440px | 본문 max 1200, 히어로 full-bleed, 가격 5-up |
| Desktop | 1280–1439px | 컨테이너 축소, side padding {spacing.xl} |
| Tablet Large | 1024–1279px | 가격 4-up, 케이스 3-up |
| Tablet | 768–1023px | 가격 stack, 케이스 2-up, 코드 스토리 stack |
| Mobile Large | 426–767px | 케이스 1-up, 네비 햄버거, hero display 64px |
| Mobile | ≤425px | 모든 그리드 1-up, hero 48px, section 64px |

### Touch Targets
- 버튼 모바일 최소 44px. {component.button-icon} 36→44px on mobile.
- {component.sub-nav-pill} 36→40px on mobile.

### Collapsing
- nav center → 햄버거 at <1024px.
- 히어로 {typography.display-xxl} clamp: 96 → 80 → 64 → 48.
- 가격 5-up → 4-up → stack at <1280 / <1024.
- 코드 스토리 side-by-side → stacked at <1024px (코드 두 번째).
- 서브넵 칩: wrap → 가로 스크롤 at <768px.

### Image
- 케이스 썸네일 1.5× / 2× DPR. <768px에서 600×600.
- 히어로 메쉬는 CSS 그라데이션. 에셋 없음.
- 코드 블록은 <1024px에서 wrap, 가로 스크롤 없음.

## 🔟 Known Gaps

- Pressed/active 시각 상태는 {component.button-primary-pressed} 외 미정의. 나머지는 {colors.ring-focus}로 대체.
- 다크 모드 히어로 메쉬의 정확한 burgundy 값은 S2에서 측정 후 결정.
- 매니페스토·약관·About 장문 페이지의 본문 컬럼 폭(720px) 외 세부 톤은 별도 사이클에서 결정.
- 인증 후 화면(대시보드·결제)은 본 시스템 범위 밖. 별도 문서로 다룸.
- 한국어 세리프(`Noto Serif KR`)와 영문 세리프(`Source Serif 4`)의 시각 무게 차이가 큰 경우 letter-spacing 보정 필요 — S3에서 측정.
