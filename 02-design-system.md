# VELNOC 디자인 시스템 v1.0

> **사용 목적**
> 본 문서는 두 가지 용도로 동시에 작동합니다.
> ① **AI/LLM 사전 컨텍스트** — 벨녹 사이트·도구·콘텐츠를 만드는 모든 LLM 세션의 디자인 표준
> ② **개발/디자인 reference** — 토큰·컴포넌트·패턴을 코드 또는 Figma로 그대로 옮길 수 있는 시스템 명세
>
> **버전**: v1.0 / **최종 갱신**: 2026-05-18
> **상위 문서**: `velnoc-brand-context-v2.4.md` (브랜드 컨텍스트 마스터)
> **결정 이력**: L1 톤 보정 / L2 컬러 시스템 / L3 타이포 시스템

---

## PART 0. 시스템의 작동 원리

### 0-1. 핵심 원리: "따뜻하지만 타협하지 않는"

본 디자인 시스템은 단일 톤이 아닌 **2-레이어 강도 시스템**으로 작동합니다.

| 레이어 | 적용 비중 | 시각적 특성 | 메시지 강도 |
|---|---|---|---|
| **Default** (절제) | ~80% | 스톤 + 오크 + Gowun Batang | 차분한 신뢰 |
| **Editorial** (한정) | ~20% | + 테라코타 + Display 타이포 | 칼날 메시지 |

평소엔 Default로 절제된 따뜻함을 유지하다가, **결정적 순간에만 Editorial 레이어가 등장**합니다. 컬러도 타이포도 같은 리듬으로 작동.

### 0-2. 적용 리듬 원칙

> **한 페이지에 강한 게 너무 많으면 결국 강하지 않다.**

- 한 페이지에 Display 헤드라인: **최대 1회**
- 한 페이지에 테라코타: **최대 1곳** (없어도 됨)
- 한 페이지에 Editorial CTA: **0~1회**
- 절제 70% / 강조 30%가 기본 배분

이 리듬이 깨지면 시각 시스템 전체가 흐트러집니다. 같은 색·폰트라도 페이지별 분배가 어긋나면 일관성이 사라짐.

---

## PART 1. Color Tokens

### 1-1. Surface Colors (배경/서피스)

| 토큰 | Hex | 용도 |
|---|---|---|
| `--velnoc-stone` | `#F2F1ED` | 페이지 베이스 배경 |
| `--velnoc-surface` | `#FAFAF8` | 카드, 폼, 컨테이너 표면 |
| `--velnoc-paper` | `#FFFFFF` | 발색이 필요한 곳 (드물게) |

### 1-2. Ink Colors (텍스트)

| 토큰 | Hex | 용도 |
|---|---|---|
| `--velnoc-ink-primary` | `#1A1A18` | 헤드라인, 본문 메인 |
| `--velnoc-ink-secondary` | `#585854` | 본문 보조, 라벨 |
| `--velnoc-ink-tertiary` | `#7A7872` | 메타, 캡션, 비활성 |

### 1-3. Accent Colors

**Primary Accent — 오크 그린** (모든 일반 액션 컬러)

| 토큰 | Hex | 용도 |
|---|---|---|
| `--velnoc-oak` | `#2D5F4E` | CTA 버튼, 링크, 데이터 강조 |
| `--velnoc-oak-soft` | `#E5EFEA` | 호버 배경, 라이트 영역 |
| `--velnoc-oak-deep` | `#1F4337` | 액티브 상태, 강한 강조 |

**Editorial Accent — 테라코타** (한정 사용)

| 토큰 | Hex | 용도 |
|---|---|---|
| `--velnoc-terracotta` | `#C4633C` | Manifesto·Origin·결정타 카피 |
| `--velnoc-terracotta-soft` | `#F4E2D6` | 인용 블록 배경 |

### 1-4. Functional Colors

| 토큰 | 값 | 용도 |
|---|---|---|
| `--velnoc-divider` | `rgba(26, 26, 24, 0.08)` | 가벼운 구분선 |
| `--velnoc-border` | `rgba(26, 26, 24, 0.12)` | 일반 보더 |
| `--velnoc-border-strong` | `rgba(26, 26, 24, 0.2)` | 강조 보더 |
| `--velnoc-danger` | `#B91C1C` | 거절·경고 (극히 제한적) |
| `--velnoc-focus-ring` | `rgba(45, 95, 78, 0.25)` | 포커스 링 (오크 알파) |

### 1-5. Color Usage Rules

1. **테라코타는 한 페이지에 한 곳만** — 결정타 한 번
2. **오크 그린이 디폴트 액션 컬러** — 모든 CTA·링크의 기본
3. **데이터 비교 강조도 오크 그린** — 시뮬레이터·진단 결과
4. **거절·경고는 danger 컬러** — 그러나 극히 제한적
5. **금지**: 그라데이션, 다크모드 그림자, 네온 효과, 컬러풀한 액센트

---

## PART 2. Typography System

### 2-1. Font Stack

**Default Mode (일반)**

```css
--font-kr-head: 'Gowun Batang', 'Noto Serif KR', serif;
--font-en-head: 'Fraunces', 'Gowun Batang', serif;
--font-body: 'Pretendard Variable', 'Pretendard', system-ui, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
```

**Display Mode (특별 모먼트 한정)**

```css
--font-kr-display: 'Noto Serif KR', serif;
--font-en-display: 'Instrument Serif', 'Noto Serif KR', serif;
```

### 2-2. Font Sources

| 폰트 | 라이선스 | CDN |
|---|---|---|
| Gowun Batang | OFL (무료) | Google Fonts / fontsource |
| Fraunces | OFL (무료, Variable) | Google Fonts |
| Noto Serif KR | OFL (무료) | Google Fonts / fontsource |
| Instrument Serif | OFL (무료) | Google Fonts |
| Pretendard Variable | OFL (무료) | `cdn.jsdelivr.net/gh/orioncactus/pretendard` |

Production에서는 self-host 권장 (CDN 의존성 제거 + LCP 개선).

### 2-3. Type Scale — Default Mode

| 이름 | 크기 | weight | line-height | 폰트 | 용도 |
|---|---|---|---|---|---|
| Display 60 | 60px | KR 400 / EN 500 | 1.15 | KR Head / EN Head | Hero 메인 |
| H1 | 48px | KR 400 / EN 500 | 1.2 | KR Head / EN Head | 페이지 타이틀 |
| H2 | 36px | KR 400 / EN 500 | 1.25 | KR Head / EN Head | 섹션 헤딩 |
| H3 | 24px | KR 400 / EN 500 | 1.3 | KR Head / EN Head | 서브섹션 |
| H4 | 18px | 500 | 1.4 | Body | 작은 헤딩 (산세리프) |
| Body Large | 18px | 400 | 1.7 | Body | 리드 단락 |
| Body | 16px | 400 | 1.7 | Body | 본문 |
| Body Small | 14px | 400 | 1.65 | Body | 보조 텍스트 |
| Caption | 13px | 400 | 1.5 | Body | 라벨, 메타 |
| Micro | 11px | 500 | 1.3 | Mono, letter-spacing 0.12em | 카테고리 태그 |

### 2-4. Type Scale — Display Mode (한정)

| 이름 | 크기 | weight | line-height | 폰트 | 용도 |
|---|---|---|---|---|---|
| Display Heavy 72 | 72px | KR 700 / EN italic | 1.1 | KR Display / EN Display | Manifesto 표지 |
| Display Heavy 56 | 56px | KR 700 / EN italic | 1.15 | KR Display / EN Display | Origin·결정타 |
| Display Heavy 40 | 40px | KR 700 / EN italic | 1.25 | KR Display / EN Display | Pull quote 큰 인용 |

### 2-5. Tracking 표준

| 사이즈 영역 | letter-spacing |
|---|---|
| Display (40px↑) | `-0.02em` |
| H1~H3 (24-48px) | `-0.015em` |
| Body (14-18px) | `-0.005em` |
| Micro (11px caps) | `+0.12em` ~ `+0.18em` |

### 2-6. Display Mode 적용 규칙

✅ **Display 모드를 쓰는 곳**
- `/manifesto` Manifesto 페이지
- `/about/origin` Origin Story 히어로
- 시뮬레이터 결과 페이지의 결정타 메시지 ("5년 후, 광고비는 사라지고 자산은 남습니다")
- `/clients/criteria` 거절 기준 페이지 헤딩
- Pull quote 큰 인용

❌ **Display 모드를 쓰지 않는 곳**
- 홈, 서비스, 가격, FAQ 등 모든 일반 페이지
- 도구 화면 (시뮬레이터 입력부, 진단 폼, OS 대시보드)
- 본문, 캡션, 라벨 (어떤 경우에도)

---

## PART 3. Layout System

### 3-1. Spacing Scale (8px Grid)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--space-1` | 4px | 마이크로 갭 |
| `--space-2` | 8px | 인라인 갭 |
| `--space-3` | 12px | 컴포넌트 내부 |
| `--space-4` | 16px | 컴포넌트 인접 |
| `--space-6` | 24px | 그룹 간격 |
| `--space-8` | 32px | 섹션 내부 |
| `--space-12` | 48px | 섹션 간 작은 간격 |
| `--space-16` | 64px | 섹션 간 일반 |
| `--space-24` | 96px | 큰 챕터 간격 |
| `--space-32` | 128px | 페이지 hero 위아래 |

### 3-2. Container Width

| 토큰 | 값 | 용도 |
|---|---|---|
| `--container-narrow` | 680px | 긴 본문 텍스트 (Reading line) |
| `--container-default` | 960px | 일반 콘텐츠 |
| `--container-wide` | 1200px | 와이드 콘텐츠 (그리드, 비교표) |
| `--container-full` | 100% | 풀블리드 (이미지·데이터 시각화) |

### 3-3. Border Radius

| 토큰 | 값 | 용도 |
|---|---|---|
| `--radius-sm` | 4px | 작은 칩, 배지, 인풋 |
| `--radius-md` | 6px | 버튼 |
| `--radius-lg` | 8px | 카드 |
| `--radius-xl` | 12px | 큰 컨테이너 |

### 3-4. Borders

- **기본**: `0.5px solid var(--velnoc-divider)`
- **강조**: `1px solid var(--velnoc-border)`
- **카드**: `0.5px solid rgba(26,26,24,0.08)` + `--radius-lg`
- **Featured 카드**: 같은 구조 + `border-top: 2px solid var(--velnoc-oak)`

### 3-5. Shadows (최소화 원칙)

- **기본**: 없음 (평면 우선)
- **Hover 미세 elevation**: `0 1px 2px rgba(0,0,0,0.04)`
- **Focus ring**: `0 0 0 3px var(--velnoc-focus-ring)`
- **금지**: drop shadow, blur, glow 일체

---

## PART 4. Components

### 4-1. Buttons

**Primary CTA (오크 그린, 기본)**
```css
background: var(--velnoc-oak);
color: var(--velnoc-surface);
padding: 12px 22px;
font: 500 15px/1 var(--font-body);
border-radius: var(--radius-md);
letter-spacing: -0.005em;
border: none;
transition: background 150ms ease;
```
- Hover: `background: var(--velnoc-oak-deep)`
- Focus: `box-shadow: 0 0 0 3px var(--velnoc-focus-ring)`

**Secondary (아웃라인)**
```css
background: transparent;
color: var(--velnoc-ink-primary);
border: 0.5px solid var(--velnoc-border-strong);
padding: 12px 22px;
font: 500 15px/1 var(--font-body);
border-radius: var(--radius-md);
```
- Hover: `background: var(--velnoc-oak-soft)`

**Editorial CTA (테라코타, 한정 사용)**
```css
background: var(--velnoc-terracotta);
color: var(--velnoc-surface);
```
- Manifesto·Origin Story·시뮬레이터 결과 페이지에서만
- 일반 페이지에서 사용 시 시스템 위반

**Ghost (텍스트 링크)**
```css
color: var(--velnoc-oak);
text-decoration: underline;
text-underline-offset: 3px;
text-decoration-thickness: 0.5px;
```

### 4-2. Cards

**Default Card**
```css
background: var(--velnoc-surface);
border: 0.5px solid var(--velnoc-divider);
border-radius: var(--radius-lg);
padding: 24px;
```

**Featured Card**
- Default + `border-top: 2px solid var(--velnoc-oak); border-top-left-radius: 0; border-top-right-radius: 0;`
- 또는 상단 외부에 작은 배지 ("Recommended" 등)

**Editorial Block (Display 모드용)**
- Default + Display 타이포 + 적절한 여백 증가
- 페이지당 1개 한정

### 4-3. Hero Pattern

```
┌────────────────────────────────────────┐
│ [Micro label — 11px mono uppercase,    │
│  velnoc-oak 또는 velnoc-ink-tertiary]   │
│                                        │
│ [Big Headline — Display 60 or H1]      │
│ Gowun Batang 400, ink-primary          │
│                                        │
│ [Subhead — Body Large 18px]            │
│ Pretendard 400, ink-secondary          │
│                                        │
│ [Primary CTA] [Secondary CTA]          │
└────────────────────────────────────────┘
```

여백: 위아래 `--space-32` (128px), 그룹 간격 `--space-6` (24px)

### 4-4. Data Card (시뮬레이터·진단 전용)

```
┌─────────────────────┐
│ [MICRO LABEL]       │  ← 11px mono, ink-tertiary
│                     │
│ ₩54,000,000         │  ← H1 48px, Pretendard 500
│                     │     font-variant-numeric: tabular-nums
│ 벨녹 구독 5년       │  ← 14px, ink-secondary
│ ₩7,200,000          │  ← 14px 500, velnoc-oak
└─────────────────────┘
```

`background: var(--velnoc-surface)`, `padding: 20px`, `border-radius: var(--radius-md)`.

### 4-5. Pull Quote (인용 블록)

**일반 인용 (Default mode)**
```css
font: italic 500 24px/1.4 var(--font-en-head);
/* 한글: Gowun Batang 400 24px */
color: var(--velnoc-ink-primary);
border-left: 2px solid var(--velnoc-oak);
padding: 8px 0 8px 20px;
margin: 32px 0;
```

**Display 인용 (한정 사용, Manifesto 등)**
```css
font: italic 400 40px/1.25 var(--font-en-display);
/* 한글: Noto Serif KR 700 40px */
color: var(--velnoc-ink-primary);
background: var(--velnoc-terracotta-soft);
padding: 40px;
border-radius: var(--radius-lg);
```

### 4-6. Pricing Card (Pulse / Signal / Engine)

3-column grid, Signal이 Featured.

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Pulse   │ │ ▔Signal▔ │ │  Engine  │
│          │ │ Featured │ │          │
│  ₩19만   │ │  ₩59만   │ │ ₩169만   │
│  /월     │ │  /월     │ │  /월     │
│          │ │          │ │          │
│ ✓ ...    │ │ ✓ ...    │ │ ✓ ...    │
│ ✓ ...    │ │ ✓ ...    │ │ ✓ ...    │
│          │ │          │ │          │
│ [선택]   │ │ [선택]   │ │ [선택]   │
└──────────┘ └──────────┘ └──────────┘
```

- 가격: H1 48px Pretendard 500, tabular-nums
- 단위 (/월): Body 14px, ink-tertiary, baseline 정렬
- Featured (Signal): `border-top: 2px solid var(--velnoc-oak)` + 상단 배지

### 4-7. Comparison Table (벨녹 비교표 — 핵심 컴포넌트)

```
| 항목              | 단발 업체 | 마케팅 대행사 | VELNOC |
| AEO (음성·스니펫) |    ❌    |      ❌      |   ✅   |
| GEO (AI 인용)     |    ❌    |      ❌      |   ✅   |
```

- 헤더 행: `background: var(--velnoc-stone)`, font 500
- ✅/❌/△: 폰트 사이즈 18px, 가운데 정렬
- 벨녹 컬럼: `background: var(--velnoc-oak-soft)` 미세 강조
- 행 구분: `0.5px solid var(--velnoc-divider)`

---

## PART 5. Page Templates (도메인별 변주)

같은 시스템을 페이지 성격에 맞춰 어떻게 조절하는지의 명세.

### 5-1. velnoc.com (메인 사이트)

- **Mode**: Default 우선
- **Display 모드**: Hero 1개에만 허용 (또는 일반 H1)
- **컬러**: 스톤 베이스 + 오크 액센트
- **테라코타**: Origin Story 미리보기 섹션 1곳에만

### 5-2. /manifesto, /about/origin

- **Mode**: Display 모드 켜짐
- **타이포**: Noto Serif KR Bold + Instrument Serif Italic 적극 사용
- **테라코타**: 2-3곳 허용 (Pull quote, 강조 단락)
- **레이아웃**: `--container-narrow` (680px), 읽기 우선

### 5-3. /tools/simulator, /diagnosis

- **Mode**: Default 모드
- **데이터 카드 위계 중요**: 라벨 → 큰 숫자 → 비교
- **컬러**: 비교 강조에 오크 그린 (`벨녹 구독: ₩7.2M` 형식)
- **숫자**: Pretendard tabular-nums 필수
- **예외**: 결과 페이지의 최종 메시지에 Display mode 1회 허용

### 5-4. /os 또는 OS 대시보드 자체

- **Mode**: Default 모드 + 더 절제
- **헤딩**: H3 이하 위주
- **본문**: Pretendard 가독성 최우선
- **여백**: 데이터 밀도 위해 spacing scale 한 단계 작게
- **테라코타**: 미사용

### 5-5. Quant/Trading 사이트 (AlphaBridge 류, 향후)

- **Mode**: Default 모드
- **컬러**: 같은 시스템 + surface 비중↑ (스톤 비중↓)
- **숫자**: tabular-nums 표시 강화, 차트 컬러는 오크 + 회색 계열만
- **타이포**: 헤드라인도 Gowun Batang은 유지하되 weight 살짝 무겁게(500 가능 시)
- **Display 모드**: 미사용

---

## PART 6. CSS 변수 빠른 복붙

```css
:root {
  /* === Surfaces === */
  --velnoc-stone: #F2F1ED;
  --velnoc-surface: #FAFAF8;
  --velnoc-paper: #FFFFFF;

  /* === Ink === */
  --velnoc-ink-primary: #1A1A18;
  --velnoc-ink-secondary: #585854;
  --velnoc-ink-tertiary: #7A7872;

  /* === Accents === */
  --velnoc-oak: #2D5F4E;
  --velnoc-oak-soft: #E5EFEA;
  --velnoc-oak-deep: #1F4337;
  --velnoc-terracotta: #C4633C;
  --velnoc-terracotta-soft: #F4E2D6;

  /* === Functional === */
  --velnoc-divider: rgba(26, 26, 24, 0.08);
  --velnoc-border: rgba(26, 26, 24, 0.12);
  --velnoc-border-strong: rgba(26, 26, 24, 0.2);
  --velnoc-danger: #B91C1C;
  --velnoc-focus-ring: rgba(45, 95, 78, 0.25);

  /* === Typography === */
  --font-kr-head: 'Gowun Batang', 'Noto Serif KR', serif;
  --font-en-head: 'Fraunces', 'Gowun Batang', serif;
  --font-kr-display: 'Noto Serif KR', serif;
  --font-en-display: 'Instrument Serif', 'Noto Serif KR', serif;
  --font-body: 'Pretendard Variable', 'Pretendard', system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;

  /* === Radius === */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* === Spacing (8px grid) === */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;

  /* === Container === */
  --container-narrow: 680px;
  --container-default: 960px;
  --container-wide: 1200px;
}

body {
  background: var(--velnoc-stone);
  color: var(--velnoc-ink-primary);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.7;
  letter-spacing: -0.005em;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-kr-head);
  font-weight: 400;
  color: var(--velnoc-ink-primary);
  letter-spacing: -0.015em;
}

h1 { font-size: 48px; line-height: 1.2; }
h2 { font-size: 36px; line-height: 1.25; }
h3 { font-size: 24px; line-height: 1.3; }
```

---

## PART 7. Font Loading (Production HTML 헤드)

```html
<!-- Pretendard Variable -->
<link rel="stylesheet" as="style" crossorigin
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css">

<!-- Google Fonts: Gowun Batang, Fraunces, Noto Serif KR, Instrument Serif -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Noto+Serif+KR:wght@300;700&family=Instrument+Serif:ital@0;1&display=swap">
```

---

## PART 8. LLM 지침 — 사이트 빌드 시

본 디자인 시스템을 입력으로 받은 LLM/디자이너가 작업할 때 지킬 것:

1. **컬러는 토큰명으로 호출** — hex 직접 입력 금지 (`var(--velnoc-oak)`)
2. **테라코타·Display 모드는 명시적 승인 받기** — 무단 적용 금지
3. **페이지마다 강도 리듬 점검** — "이 페이지에 강한 게 너무 많은가?"
4. **GEO 경쟁사 톤 절대 모방 금지** — 다크 + 네온 + 그라데이션
5. **일관성은 색·폰트가 아니라 리듬에서 나옴** — 같은 토큰이라도 페이지별 분배가 어긋나면 일관성 깨짐
6. **숫자 표시는 항상 tabular-nums** — Pretendard `font-variant-numeric: tabular-nums`
7. **모든 폰트 사이즈는 type scale 토큰만 사용** — 임의 사이즈 금지
8. **여백은 spacing scale 토큰만 사용** — 임의 px 금지

---

## PART 9. 결정 보류 항목

- Display Mode를 어떤 페이지에서 정확히 트리거할지의 최종 리스트 (Manifesto·Origin Story 외 추가 후보 검토 필요)
- Dark mode 정책 — 현재는 light only. OS 대시보드만 옵션으로 검토 가능
- 일러스트레이션·아이콘 시스템 — 본 v1에서는 아이콘셋(Tabler / Lucide) 선택 보류, 다음 버전에서 결정
- 모션·트랜지션 가이드 — 본 v1에서는 정적 시스템만. 모션은 v1.1로 분리
- 데이터 시각화 컬러 시퀀스 — 시뮬레이터 차트용 multi-color 시퀀스 별도 정의 필요
