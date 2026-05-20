# VELNOC 5단계 프레임워크 — 서비스 페이지 통합 명세서

> Codex (또는 다른 개발 LLM)에게 그대로 전달 가능한 자체완결 문서  
> 버전: 1.0 · 2026.05.18  
> 첨부 참조 파일: `velnoc-framework-infographic-v4.jsx` (React 구현체)

---

## 0. 이 문서를 사용하는 방법

이 문서는 두 부분으로 구성됩니다:

- **Part A (1~9절)**: 명세 — Codex가 구현에 참고할 모든 데이터·디자인·인터랙션
- **Part B (10절)**: Codex에게 보낼 프롬프트 — 그대로 복사해서 전달

먼저 Part A를 읽고, Part B 프롬프트와 함께 Codex에 전달하세요. 가능하면 참조 React 구현체(`velnoc-framework-infographic-v4.jsx`)도 같이 첨부.

---

# PART A. 명세

## 1. 개요

### 무엇을
서비스 페이지(또는 메인 페이지) 안에 **5단계 프레임워크 섹션**을 추가합니다. 사장님이 광고 의존(100%)에서 검색 독립(0%)으로 가는 5단계 여정을 시각화합니다.

### 어디에
페이지 흐름:
```
Hero → 문제 제기 섹션 → [5단계 프레임워크] ← 새로 추가
     → 시뮬레이터 → 가격 → CTA
```

### 왜
- **차별화**: ROCIO·페이지오류·마케팅 대행사가 어느 지점에서 멈추는지 시각적으로 보여줍니다
- **신뢰**: "벨녹만의 방법론"이 가격 페이지보다 먼저 나와 신뢰를 쌓습니다
- **가격 정당화**: 각 단계가 어떤 제품(Pulse/Signal/Engine)으로 가는지 자연스럽게 연결됩니다

---

## 2. 5단계 데이터 (완전체)

각 단계는 다음 필드를 가집니다. 모든 카피는 한국어 그대로 사용하세요.

### Stage 01

```yaml
id: 1
name: "광고만 운영"
subtitle: "광고 100% · 자력 0%"
headline: "대부분의 사장님이 시작하는 자리"
desc: "광고비 매월 지출 / 자산은 0. 광고를 끄는 순간 유입과 매출이 사라집니다."
nextStep: "도메인 권위와 사이트 구조부터 측정합니다. AI가 읽을 수 있도록 schema.org 마크업과 메타데이터 정비를 시작합니다."
details:
  - "광고비 = 월세 (매월 사라짐)"
  - "SEO · AEO · GEO 자산 0"
  - "광고 멈추면 매출 즉시 하락"
productLabel: "시작점 — 무료 자가 진단부터"
accent: "#B91C1C"
selfPower: 0
```

### Stage 02

```yaml
id: 2
name: "사이트 완성"
subtitle: "광고 90% · 자력 10%"
headline: "홈페이지를 갖춘 상태"
desc: "도메인 권위, 사이트 구조, 기초 SEO 세팅. 자산 형성의 첫 걸음."
nextStep: "매월 콘텐츠 3~5개를 발행하고, 키워드를 사이트에 심습니다. 6개월 후 자연 유입이 시작됩니다."
details:
  - "사이트 구조 + 메타데이터 정비"
  - "schema.org 마크업 시작"
  - "기초 SEO 키워드 매핑"
productLabel: "벨녹 Pulse · 월 19만 원 (3개월 약정)"
accent: "#A8A29E"
selfPower: 10
```

### Stage 03

```yaml
id: 3
name: "SEO 작동"
subtitle: "광고 60% · 자력 40%"
headline: "SEO 운영으로 자연 유입 시작"
desc: "블로그·콘텐츠가 검색 결과에 노출. 광고 외 첫 매출 채널이 생깁니다."
nextStep: "AEO/GEO 스키마를 적용하고, AI 인용을 추적합니다. 외부 권위 신호도 함께 쌓습니다."
details:
  - "월 5~20개 키워드 상위 노출"
  - "자연 유입 트래픽 본격화"
  - "광고 외 첫 매출 채널 확보"
productLabel: "벨녹 Pulse 누적 또는 Signal 진입"
accent: "#D97706"
selfPower: 40
```

### Stage 04

```yaml
id: 4
name: "AEO 인용"
subtitle: "광고 30% · 자력 70%"
headline: "AI가 사이트를 출처로 인식"
desc: "GPT · Gemini · Perplexity 답변에 사이트가 인용됩니다. AEO/GEO 구조의 결실."
nextStep: "자동화 워크플로우를 도입하고, 광고비를 단계적으로 줄여갑니다."
details:
  - "GPT · Gemini · Perplexity 인용"
  - "구글 AI 개요 · 네이버 AI 브리핑 노출"
  - "AI 검색 권위 출처로 등재"
productLabel: "벨녹 Signal · 월 59만 원 (6개월 약정)"
accent: "#15803D"
selfPower: 70
```

### Stage 05

```yaml
id: 5
name: "검색 독립"
subtitle: "광고 0% · 자력 100%"
headline: "벨녹만 도달하는 정상"
desc: "광고 없이도 사업이 굴러갑니다. 시스템이 자가 운영됩니다."
nextStep: "매월 새 콘텐츠와 새 자동화로 자산이 계속 자랍니다. 한번 도달하면 유지는 자동입니다."
details:
  - "광고비 0 (또는 선택적 운영)"
  - "자동화 워크플로우 2~3건 가동"
  - "자산이 매월 자라는 시스템 완성"
productLabel: "벨녹 Engine · 월 169만 원 (12개월 약정)"
accent: "#0F4C3A"
selfPower: 100
```

---

## 3. 경쟁사 종착 데이터

특정 단계에서 멈추는 경쟁 서비스 카테고리. **실제 회사 이름은 절대 거론하지 않습니다** (페이지오·ROCIO 등 직접 호명 금지). 가격대와 특성으로만 식별.

### Stage 2에서 멈추는 서비스

```yaml
afterStageId: 2
name: "단발 홈페이지 제작 업체"
priceRange: "50~150만 원대 1회 패키지"
desc: "제작 후 6개월~1년 안에 사이트가 잠듭니다. 사장님은 다시 광고로 돌아갑니다."
```

### Stage 3에서 멈추는 서비스

```yaml
afterStageId: 3
name: "일반 마케팅 대행사"
priceRange: "월 100~300만 원 광고·콘텐츠 운영"
desc: "광고·콘텐츠 운영까지가 한계. 사이트 기술 자산은 본인 소유 X."
```

### Stage 4에서 멈추는 서비스

```yaml
afterStageId: 4
name: "단발 AEO/GEO 업체"
priceRange: "100~550만 원대 1회 패키지 + 단기 관리"
desc: "인용 한 번 받고 관리 종료. 이후 자동 유지 안 됨."
```

### Stage 5 (벨녹만)

```yaml
afterStageId: 5
isVelnocOnly: true
calloutCopy: "★ 벨녹만 도달하는 정상\n다른 모든 서비스는 중간에서 멈춥니다.\n벨녹은 사장님을 광고 의존 0%까지 데려가는 유일한 구독 모델입니다."
```

---

## 4. 디자인 토큰

벨녹 디자인 시스템과 일관성 유지. 가능하면 기존 사이트의 토큰을 재사용.

### 색상

```css
--velnoc-bg:           #F7F5F0;  /* 크림 페이퍼 배경 */
--velnoc-text:         #0A0A0A;  /* 본문 텍스트 */
--velnoc-text-muted:   #78716C;  /* 보조 텍스트 */
--velnoc-text-subtle:  #A8A29E;  /* 더 약한 보조 */
--velnoc-border:       #E7E5E0;  /* 라인·구분선 */
--velnoc-surface:      #FFFFFF;  /* 카드 배경 */
--velnoc-surface-alt:  #FAFAF7;  /* 보조 카드 배경 */

--velnoc-red:          #B91C1C;  /* 광고 의존·경고 */
--velnoc-red-bg:       #FEF2F2;  /* 경고 박스 배경 */
--velnoc-red-border:   #FCA5A5;  /* 경고 박스 보더 */

--velnoc-green:        #0F4C3A;  /* 벨녹 액센트 (deep emerald) */
--velnoc-green-bg:     #F0FDF4;  /* 성공 박스 배경 */
--velnoc-green-border: #6EE7B7;  /* 성공 박스 보더 */
```

### 폰트

```css
font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

/* CDN import */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');

/* 숫자에는 항상 tabular-nums */
.tabular { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }

/* 디스플레이 텍스트는 letter-spacing 더 좁게 */
.display { letter-spacing: -0.035em; }
```

### 텍스처 (선택)

```css
/* 미세한 grain (배경 위에) */
.grain {
  background-image: radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px);
  background-size: 3px 3px;
}
```

---

## 5. 레이아웃 & 인터랙션 명세

### 핵심 인터랙션 패턴: Sticky Pinned Section

자연스러운 스크롤로 카드가 한 장씩 넘어가는 패턴. **스크롤 가로채기는 절대 사용하지 않습니다**.

```
페이지 흐름:
  [상단 인트로]            ← 일반 스크롤
  
  [600vh 섹션 시작]
    └ [100vh sticky 카드]  ← 화면 고정, 스크롤에 따라 단계만 바뀜
    ← 100vh 스크롤 = Stage 1 → 2
    ← 100vh 스크롤 = Stage 2 → 3
    ← 100vh 스크롤 = Stage 3 → 4
    ← 100vh 스크롤 = Stage 4 → 5
  [600vh 섹션 종료]
  
  [다음 섹션 (시뮬레이터)] ← 일반 스크롤 재개
```

### 구현 핵심

- 외부 섹션: `height: (5 + 1) * 100vh = 600vh; position: relative; isolation: isolate;`
- 내부 카드 컨테이너: `position: sticky; top: 0; height: 100vh; overflow: hidden;`
- 스크롤 진행도 추적: `window.scroll` 이벤트 + `getBoundingClientRect()` + `requestAnimationFrame` 쓰로틀
- 활성 단계 계산: `floor(progress * 5) + 1` (progress는 0~0.9999)

### Framer/사이트 헤더 충돌 방지 (중요)

만약 사이트에 `position: sticky` 헤더가 있다면:

```css
.velnoc-framework {
  --site-header-height: 64px;  /* 실제 헤더 높이로 조정 */
}

.framework-sticky-container {
  top: var(--site-header-height, 0px);
  height: calc(100vh - var(--site-header-height, 0px));
}
```

헤더가 없으면 `--site-header-height: 0px` 유지.

### 단계 전환 애니메이션

```css
@keyframes fadeInStage {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.stage-card { animation: fadeInStage 0.55s cubic-bezier(0.4, 0, 0.2, 1); }
```

키(`key={activeId}`)로 단계 변경 시 re-mount → 자연스러운 fade-in.

### prefers-reduced-motion 대응

```css
@media (prefers-reduced-motion: reduce) {
  .stage-card { animation: none; }
  .scroll-hint-arrow { animation: none; }
}
```

---

## 6. 카드 콘텐츠 구조 (5요소 + 1 아코디언)

각 100vh 카드는 다음 요소를 위에서 아래로 배치:

### 1) 프로그레스 인디케이터 (상단)

5개 막대 + 진행 텍스트.

```
▰ ▱ ▱ ▱ ▱   01 / 05
```

- 활성: width 36px, 검정 배경
- 지난 단계: width 12px, stone-500 배경
- 미래 단계: width 12px, stone-300 배경
- 클릭 시 해당 단계로 부드러운 스크롤 이동

### 2) STAGE 레이블 + 큰 이름

```
STAGE 02 ──────────────  광고 90% · 자력 10%

사이트 완성
```

- 레이블: `text-xs uppercase tracking-[0.25em]` accent 색상
- 이름: `display text-4xl md:text-6xl font-black leading-[0.95]`

### 3) 핵심 메시지

```
홈페이지를 갖춘 상태

도메인 권위, 사이트 구조, 기초 SEO 세팅. 자산 형성의 첫 걸음.
```

- 헤드라인: `display text-lg md:text-2xl font-black`
- 설명: `text-sm md:text-base text-stone-600`

### 4) "다음으로 가는 방법" 박스 ⭐ (핵심)

```
┌─────────────────────────────────────┐
│ → 다음 단계로 가는 방법              │
│                                     │
│ 매월 콘텐츠 3~5개를 발행하고,        │
│ 키워드를 사이트에 심습니다.          │
│ 6개월 후 자연 유입이 시작됩니다.     │
│                                     │
│ 권장 제품 · 벨녹 Pulse · 월 19만 원  │
└─────────────────────────────────────┘
```

- 배경: `rgba(15, 76, 58, 0.04)` (미세한 emerald tint)
- 좌측 보더: 3px solid `accent`
- 패딩: 16~20px
- Stage 5는 라벨이 "이 상태를 유지하는 방법"

### 5) 광고 의존도 게이지

```
광고 의존도              90% / 10%
████████████████████░░░
```

- 빨강 → 녹색 그래디언트 막대
- 높이 2px (얇게, 컴팩트)
- 양쪽 끝에 % 숫자 표기

### 6) 경쟁사 종착 콜아웃 OR Stage 5 정상 CTA

**Stage 2, 3, 4 (경쟁사 종착):**
```
┌─────────────────────────────────────┐
│ ✗ 이 단계에서 멈추는 서비스          │
│                                     │
│ 단발 홈페이지 제작 업체              │
│ 50~150만 원대 1회 패키지             │
│                                     │
│ 제작 후 6개월~1년 안에 사이트가      │
│ 잠듭니다. 사장님은 다시 광고로       │
│ 돌아갑니다.                         │
└─────────────────────────────────────┘
```
- 배경: `--velnoc-red-bg`
- 보더: 1px solid `--velnoc-red-border`

**Stage 5 (정상 CTA):**
```
┌─────────────────────────────────────┐
│ ★ 벨녹만 도달하는 정상               │
│                                     │
│ 지금 어느 단계인지                   │
│ 5초 만에 확인하세요.                 │
│                                     │
│ [ 무료 단계 진단 시작 → ]            │
└─────────────────────────────────────┘
```
- 배경: 검정 `#0A0A0A`
- 텍스트: 크림 `#F7F5F0`
- 액센트 텍스트: emerald 또는 emerald-400
- 버튼: emerald 채움
- 클릭 시: 시뮬레이터 섹션으로 부드러운 스크롤

### 7) 디테일 아코디언 (접힘 기본)

```
[ 세부 사항                          더 보기 ▼ ]
```

- 클릭 시 펼침 (`fade-in 0.3s`)
- 펼친 상태에서 `details` 배열의 항목들 표시 (작은 dot bullet)
- 단계 전환 시 자동으로 다시 접힘

### 8) 스크롤 힌트 (Stage 1~4, Stage 5 제외)

```
다음 단계로 스크롤   ↓
```

- `text-xs uppercase tracking-[0.25em]`
- 화살표는 위아래로 부드러운 펄스 애니메이션

---

## 7. 접근성 & 기술 호환성

### 필수 사항

- [x] **스크롤 가로채기 절대 금지**: 브라우저 기본 스크롤 그대로 사용
- [x] `prefers-reduced-motion: reduce`에서 모든 애니메이션 OFF
- [x] 프로그레스 막대는 클릭 가능한 button (aria-label 포함)
- [x] 스크린리더가 카드 내용을 정상적으로 읽도록 sticky 컨테이너 내부에 의미 있는 구조 유지
- [x] 키보드 네비게이션: Tab으로 인터랙티브 요소(프로그레스 막대, Stage 5 CTA, 아코디언) 순회 가능

### 모바일 고려사항

- 모바일 디바이스에서도 600vh 패턴 정상 작동
- 6번 정도 스와이프 = 5단계 다 보기
- 터치 스크롤 부드럽게 (스냅 X, 자연스러운 관성)
- 모바일에서 폰트 크기: `text-4xl` (큰 이름), `text-lg` (헤드라인), `text-sm`/`text-base` (본문)

### 성능

- `window.scroll` 이벤트는 `requestAnimationFrame`으로 쓰로틀 (필수)
- 카드 콘텐츠가 화면 밖에 있을 때 렌더링하지 않음 (sticky 패턴으로 자연스럽게 처리됨)

---

## 8. 통합 지점 (페이지 흐름)

### 페이지 안에서의 위치

```
1. Hero (문제 제기 + 시뮬레이터 CTA)
2. Problem (기존 섹션 — 마케팅·개발·디자인 따로 발주 이슈)
3. [5단계 프레임워크] ← 여기 추가
4. Simulator (시뮬레이터)
5. Pricing (Pulse/Signal/Engine)
6. Comparison (비교표)
7. Process
8. Final CTA
9. Footer
```

**Solution 섹션(버드뷰·통합 실행·무한 책임)** 뒤, **시뮬레이터** 앞에 배치하는 게 가장 자연스럽습니다. "벨녹의 접근"을 추상 원칙(Solution)에서 구체 여정(Framework)으로 자연스럽게 좁혀줍니다.

### 앞뒤 섹션과의 연결

**프레임워크 진입 인트로 (섹션 시작 부분):**
```
[Eyebrow]
VELNOC FRAMEWORK

[Headline]
검색 독립까지의
5단계

[Sub]
대부분의 서비스는 중간에서 멈춥니다.
벨녹은 사장님을 정상까지 데려갑니다.

[Scroll Hint]
↓ 아래로 스크롤
```

**프레임워크 종료 후 시뮬레이터 진입:**

Stage 5 카드의 검정 CTA 박스 클릭 시 시뮬레이터 섹션의 첫 입력 단계로 부드러운 스크롤.

또는 600vh 섹션이 끝난 직후 자연스러운 시뮬레이터 헤더가 등장하도록 페이지 흐름 설계.

---

## 9. 참조 구현 파일

이미 React (JSX) 구현체가 있습니다:

**파일**: `velnoc-framework-infographic-v4.jsx`

이 파일은 위의 모든 명세를 그대로 구현하고 있습니다. Codex가 다음 작업을 할 수 있습니다:

### Option 1: 그대로 채용
React/Next.js 사이트라면 이 컴포넌트를 그대로 import해서 페이지에 배치 + props로 콜백 연결.

```jsx
import VelnocFramework from '@/components/VelnocFramework';

<VelnocFramework
  onSimulatorClick={() => scrollToSection('simulator')}
/>
```

### Option 2: 다른 프레임워크로 변환
Vue, Svelte, 또는 Astro 사이트라면 이 React 구현을 참조해서 같은 동작을 해당 프레임워크 문법으로 옮김.

### Option 3: 디자인 시스템에 맞춰 리팩토링
사이트의 기존 디자인 토큰·컴포넌트 라이브러리에 맞춰 재작성. 단, 5단계 데이터·인터랙션 패턴·핵심 카피는 변경 금지.

---

# PART B. Codex 프롬프트 (Ready to paste)

> 아래 텍스트를 그대로 복사해서 Codex(또는 다른 LLM)에게 전달하세요.  
> `velnoc-framework-infographic-v4.jsx` 파일도 함께 첨부하면 좋습니다.

---

```
# 작업 요청: VELNOC 서비스 페이지에 5단계 프레임워크 섹션 추가

## 컨텍스트
지금 작업하는 벨녹(VELNOC) 사이트의 서비스 페이지에 새로운 섹션을 추가해줘.
이 섹션은 "광고 의존(100%)에서 검색 독립(0%)까지" 가는 사장님의 5단계 여정을 시각화하는 핵심 차별화 자산이야.

## 핵심 요구사항

### 1. 위치
페이지 흐름에서 "Solution(벨녹의 접근)" 섹션 뒤, "Simulator(시뮬레이터)" 섹션 앞에 배치.

### 2. 인터랙션 패턴 (핵심)
"Sticky Pinned Section" 패턴을 사용해. Apple, Linear 같은 사이트가 쓰는 스토리텔링 스크롤이야.

- 외부 섹션 높이: `(5 + 1) * 100vh = 600vh`
- 내부 카드 컨테이너는 `position: sticky; top: 0; height: 100vh`로 화면에 고정
- 사용자가 스크롤할 때마다 카드 내용이 Stage 1 → 2 → 3 → 4 → 5로 한 장씩 바뀜
- 모든 카드 보고 나면 자연스럽게 다음 섹션으로 스크롤 이어짐
- **스크롤 가로채기(scroll hijacking)는 절대 사용하지 마**. 브라우저 기본 스크롤을 그대로 써.
- 스크롤 진행도는 `window.scroll` + `getBoundingClientRect()` + `requestAnimationFrame`으로 추적
- 활성 단계: `Math.floor(progress * 5) + 1` (progress는 0~0.9999)

### 3. 사이트 헤더 충돌 방지
사이트에 sticky 헤더가 있다면 CSS 변수로 offset 처리해줘:

```css
.velnoc-framework {
  --site-header-height: 64px; /* 실제 헤더 높이로 조정 */
}
.framework-sticky-container {
  top: var(--site-header-height, 0px);
  height: calc(100vh - var(--site-header-height, 0px));
}
```

### 4. 5단계 데이터 (이 카피를 그대로 사용)

#### Stage 01: 광고만 운영
- 부제: "광고 100% · 자력 0%"
- 헤드라인: "대부분의 사장님이 시작하는 자리"
- 설명: "광고비 매월 지출 / 자산은 0. 광고를 끄는 순간 유입과 매출이 사라집니다."
- 다음으로 가는 방법: "도메인 권위와 사이트 구조부터 측정합니다. AI가 읽을 수 있도록 schema.org 마크업과 메타데이터 정비를 시작합니다."
- 세부사항: ["광고비 = 월세 (매월 사라짐)", "SEO · AEO · GEO 자산 0", "광고 멈추면 매출 즉시 하락"]
- 권장 제품: "시작점 — 무료 자가 진단부터"
- 액센트 색상: #B91C1C
- selfPower: 0

#### Stage 02: 사이트 완성
- 부제: "광고 90% · 자력 10%"
- 헤드라인: "홈페이지를 갖춘 상태"
- 설명: "도메인 권위, 사이트 구조, 기초 SEO 세팅. 자산 형성의 첫 걸음."
- 다음으로 가는 방법: "매월 콘텐츠 3~5개를 발행하고, 키워드를 사이트에 심습니다. 6개월 후 자연 유입이 시작됩니다."
- 세부사항: ["사이트 구조 + 메타데이터 정비", "schema.org 마크업 시작", "기초 SEO 키워드 매핑"]
- 권장 제품: "벨녹 Pulse · 월 19만 원 (3개월 약정)"
- 액센트 색상: #A8A29E
- selfPower: 10

#### Stage 03: SEO 작동
- 부제: "광고 60% · 자력 40%"
- 헤드라인: "SEO 운영으로 자연 유입 시작"
- 설명: "블로그·콘텐츠가 검색 결과에 노출. 광고 외 첫 매출 채널이 생깁니다."
- 다음으로 가는 방법: "AEO/GEO 스키마를 적용하고, AI 인용을 추적합니다. 외부 권위 신호도 함께 쌓습니다."
- 세부사항: ["월 5~20개 키워드 상위 노출", "자연 유입 트래픽 본격화", "광고 외 첫 매출 채널 확보"]
- 권장 제품: "벨녹 Pulse 누적 또는 Signal 진입"
- 액센트 색상: #D97706
- selfPower: 40

#### Stage 04: AEO 인용
- 부제: "광고 30% · 자력 70%"
- 헤드라인: "AI가 사이트를 출처로 인식"
- 설명: "GPT · Gemini · Perplexity 답변에 사이트가 인용됩니다. AEO/GEO 구조의 결실."
- 다음으로 가는 방법: "자동화 워크플로우를 도입하고, 광고비를 단계적으로 줄여갑니다."
- 세부사항: ["GPT · Gemini · Perplexity 인용", "구글 AI 개요 · 네이버 AI 브리핑 노출", "AI 검색 권위 출처로 등재"]
- 권장 제품: "벨녹 Signal · 월 59만 원 (6개월 약정)"
- 액센트 색상: #15803D
- selfPower: 70

#### Stage 05: 검색 독립
- 부제: "광고 0% · 자력 100%"
- 헤드라인: "벨녹만 도달하는 정상"
- 설명: "광고 없이도 사업이 굴러갑니다. 시스템이 자가 운영됩니다."
- 다음으로 가는 방법: "매월 새 콘텐츠와 새 자동화로 자산이 계속 자랍니다. 한번 도달하면 유지는 자동입니다."
- 세부사항: ["광고비 0 (또는 선택적 운영)", "자동화 워크플로우 2~3건 가동", "자산이 매월 자라는 시스템 완성"]
- 권장 제품: "벨녹 Engine · 월 169만 원 (12개월 약정)"
- 액센트 색상: #0F4C3A
- selfPower: 100

### 5. 경쟁사 종착 데이터

Stage 2, 3, 4 카드 각각에 "이 단계에서 멈추는 서비스" 콜아웃 박스를 표시해.
**중요**: 실제 회사 이름(페이지오, ROCIO 등)은 절대 거론하지 마. 카테고리 + 가격대로만 식별.

#### Stage 2 종착 ← 단발 홈페이지 제작 업체
- 가격대: "50~150만 원대 1회 패키지"
- 설명: "제작 후 6개월~1년 안에 사이트가 잠듭니다. 사장님은 다시 광고로 돌아갑니다."

#### Stage 3 종착 ← 일반 마케팅 대행사
- 가격대: "월 100~300만 원 광고·콘텐츠 운영"
- 설명: "광고·콘텐츠 운영까지가 한계. 사이트 기술 자산은 본인 소유 X."

#### Stage 4 종착 ← 단발 AEO/GEO 업체
- 가격대: "100~550만 원대 1회 패키지 + 단기 관리"
- 설명: "인용 한 번 받고 관리 종료. 이후 자동 유지 안 됨."

#### Stage 5 정상 ← 벨녹만 도달
- 카피: "★ 벨녹만 도달하는 정상\n다른 모든 서비스는 중간에서 멈춥니다.\n벨녹은 사장님을 광고 의존 0%까지 데려가는 유일한 구독 모델입니다."

### 6. 카드 콘텐츠 구조 (각 단계 카드)

위에서 아래로 다음 요소들을 배치:

1. **프로그레스 인디케이터** (상단): 5개 막대 + "01 / 05" 텍스트. 활성 막대 너비 36px (검정), 비활성 12px (회색). 클릭하면 해당 단계로 스크롤.

2. **STAGE 레이블 + 큰 이름**: 
   - "STAGE 02 ──── 광고 90% · 자력 10%" 헤더 (액센트 색상, uppercase, tracking-widest)
   - 큰 이름: "사이트 완성" (display, text-4xl md:text-6xl, font-black)

3. **핵심 메시지**: 
   - 헤드라인 (text-lg md:text-2xl, font-black)
   - 짧은 설명 (text-sm md:text-base)

4. **"다음 단계로 가는 방법" 박스** ⭐ (중요):
   - 배경: rgba(15, 76, 58, 0.04) (미세한 emerald tint)
   - 좌측 보더: 3px solid 액센트 색상
   - 라벨: "→ 다음 단계로 가는 방법" (Stage 5는 "이 상태를 유지하는 방법")
   - 본문: nextStep 텍스트
   - 하단: "권장 제품 · [productLabel]" 작은 텍스트

5. **광고 의존도 게이지**: 
   - 양쪽 끝에 "광고 90% / 자력 10%" 텍스트
   - 빨강 → 녹색 막대 (높이 2px)

6. **경쟁사 종착 콜아웃 박스 (Stage 2, 3, 4)** 또는 **정상 CTA (Stage 5)**:
   - 경쟁사: 빨강 배경 + 보더, ✗ 아이콘 + "이 단계에서 멈추는 서비스" 라벨
   - Stage 5: 검정 배경 + emerald 액센트 텍스트 + "무료 단계 진단 시작 →" 버튼 (클릭 시 시뮬레이터로 스크롤)

7. **디테일 아코디언** (접힘 기본):
   - "세부 사항 ─ 더 보기 ▼" 버튼
   - 펼치면 details 배열의 항목들이 dot bullet으로 표시
   - 단계 전환 시 자동으로 다시 접힘

8. **스크롤 힌트** (Stage 1~4, Stage 5 제외): "다음 단계로 스크롤 ↓" + 펄스 애니메이션 화살표

### 7. 디자인 토큰

색상:
- 배경: #F7F5F0 (cream paper)
- 텍스트: #0A0A0A
- 보더: #E7E5E0
- 흰 카드 배경: #FFFFFF
- 보조 카드 배경: #FAFAF7
- 경고 (빨강): #B91C1C / 배경 #FEF2F2 / 보더 #FCA5A5
- 성공 (녹색): #0F4C3A / 배경 #F0FDF4 / 보더 #6EE7B7

폰트: Pretendard Variable
- CDN: `@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');`
- 숫자에는 `font-variant-numeric: tabular-nums; letter-spacing: -0.02em;`
- 디스플레이 텍스트에는 `letter-spacing: -0.035em;`

배경 텍스처 (선택):
```css
background-image: radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px);
background-size: 3px 3px;
```

### 8. 섹션 진입 인트로 (sticky 시작 전)

sticky 600vh 섹션 시작 위에 일반 스크롤 인트로:

```
[Eyebrow]   VELNOC FRAMEWORK

[Headline]  검색 독립까지의
            5단계
            (단어 "검색 독립"만 #0F4C3A emerald)

[Sub]       대부분의 서비스는 중간에서 멈춥니다.
            벨녹은 사장님을 정상까지 데려갑니다.

[Scroll Hint] 아래로 스크롤 ↓
```

### 9. 접근성 요구사항

- prefers-reduced-motion: reduce 미디어 쿼리에서 모든 애니메이션 OFF
- 프로그레스 막대는 button 요소 (aria-label 포함)
- 키보드 네비게이션 가능
- 스크롤 가로채기 절대 금지

### 10. 사용 기술

사이트의 기존 기술 스택에 맞춰서 구현해줘. 만약 React/Next.js 기반이라면 함수형 컴포넌트 + Hooks 사용. 첨부한 `velnoc-framework-infographic-v4.jsx`를 참조 구현체로 사용 가능해.

### 11. Stage 5 CTA 핸들러

Stage 5의 "무료 단계 진단 시작 →" 버튼은 페이지의 시뮬레이터 섹션으로 부드러운 스크롤로 이동해야 해. 시뮬레이터 섹션에 `id="simulator"` 또는 사이트 컨벤션에 맞는 ID를 부여하고, 이 버튼이 그쪽으로 scroll.

### 12. 최종 산출물

1. 컴포넌트 코드 (사이트의 디렉토리 구조에 맞춰 배치)
2. 페이지에 import + 배치 코드
3. 만약 새로운 CSS 토큰이 추가됐다면 글로벌 스타일에 반영
4. 모바일/데스크탑 둘 다 정상 작동 확인

추가 질문 있으면 물어봐. 작업 시작해줘.
```

---

# PART C. 보조 자료

## 자주 발생할 수 있는 이슈와 해결

### Q1. 600vh가 너무 길어 보여요
A: 정상입니다. sticky 패턴의 본질이에요. 600vh는 5단계 × 100vh + 1 viewport buffer. 사용자가 빠르게 스크롤하면 한 번에 다 지나갈 수 있고, 천천히 스크롤하면 각 단계가 한 화면씩 보입니다.

### Q2. 스크롤 진행도 계산이 부정확해요
A: viewport height가 변할 때 (예: 모바일 키보드 열림) 재계산 필요. `window.resize` 이벤트도 같이 listen하고 진행도 다시 계산.

### Q3. Framer/Webflow 같은 노코드 도구로 만들 수 있나요?
A: Custom Code 임베드로 가능. 단, sticky 패턴이 다른 sticky 요소(헤더 등)와 충돌할 수 있어 CSS 변수로 offset 처리 필수.

### Q4. 모바일에서 빠른 스와이프가 단계를 건너뛰어요
A: 정상 동작입니다. 사용자의 의도를 존중하는 디자인. 천천히 보고 싶은 사용자는 천천히 스크롤하면 됩니다.

### Q5. 다른 단계로 점프하고 싶어요
A: 프로그레스 막대(상단)를 클릭하면 해당 단계로 부드러운 스크롤. `scrollToStage` 함수 활용.

## 참조 파일

- `velnoc-framework-infographic-v4.jsx` — React 참조 구현체 (이 명세서의 모든 사양 적용됨)
- `velnoc-design-system-v1.0.md` — 벨녹 디자인 시스템 (브랜드 컨텍스트)
- `velnoc-brand-context-v2.4.md` — 브랜드 컨텍스트 (Pulse/Signal/Engine 정의)

## 검수 체크리스트 (Codex 작업 완료 후)

- [ ] 페이지 흐름에서 Solution 뒤, Simulator 앞에 배치됨
- [ ] 600vh sticky 섹션이 정상 작동 (스크롤 시 카드 한 장씩 전환)
- [ ] 스크롤 가로채기 없음 (브라우저 기본 스크롤 그대로)
- [ ] 5단계 카피 모두 정확하게 들어감 (특히 "다음으로 가는 방법" 신규 요소)
- [ ] 경쟁사 종착 콜아웃에 실제 회사 이름 없음 (카테고리만)
- [ ] 권장 제품 라벨이 정확함 (Pulse 19만 / Signal 59만 / Engine 169만)
- [ ] Stage 5 검정 박스 CTA → 시뮬레이터 섹션 스크롤
- [ ] prefers-reduced-motion 대응
- [ ] 모바일 정상 작동 (6번 정도 스와이프 = 5단계 다 보기)
- [ ] 사이트 헤더와 sticky 충돌 없음
- [ ] 디자인 토큰 일관성 (Pretendard, 컬러, 텍스처)

---

문서 끝. 이 명세서를 Codex와 함께 사용하시면 됩니다.
