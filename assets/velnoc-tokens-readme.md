# VELNOC Design Tokens v1.0

벨녹 디자인 시스템의 모든 토큰과 공통 컴포넌트 클래스를 담은 단일 CSS 모듈.

> **상위 명세**
> - `velnoc-brand-context-v2.4.md` (브랜드 컨텍스트 마스터)
> - `velnoc-design-system-v1.0.md` (디자인 시스템 명세)
>
> **본 모듈은 두 문서의 코드 구현체**이며, 토큰 값 변경 시 두 문서와 동기화돼야 합니다.

---

## 1. 적용 대상

| 자산 | 상태 | 비고 |
|---|---|---|
| `velnoc.com` 메인 사이트 | 신규 빌드 시 적용 | Default 모드 |
| `velnoc-diagnosis` 자가 진단 도구 v7+ | 적용 완료 | Default 모드 |
| `velnoc-simulator` ROI 시뮬레이터 v7.1+ | 적용 완료 | Default + Display 1회 |
| `velnoc-os` OS 대시보드 | 향후 | `.vn-os` 변형 적용 |
| `velnoc-quant` Quant/Trading | 향후 | PART 5-5 명세 |
| `/manifesto`, `/about/origin` | 향후 | Display 모드 켜짐 |

---

## 2. 설치 / Import 방법

### Vite · Webpack · Next.js · CRA

```js
// 앱 진입점 (App.tsx, _app.tsx, main.jsx 등)
import './velnoc-tokens.css';
```

### Astro · Remix

```astro
---
import './velnoc-tokens.css';
---
```

### HTML 단독

```html
<link rel="stylesheet" href="./velnoc-tokens.css">
```

### Framer / Webflow (외부 코드)

CDN에 호스팅 후 사이트 settings에서 link 추가:

```html
<link rel="stylesheet" href="https://cdn.velnoc.com/tokens/v1.0/velnoc-tokens.css">
```

### React 컴포넌트 단독 사용 (build 환경 없는 경우)

이미 인라인 `<style>`로 토큰을 자체 선언한 컴포넌트(`velnoc-diagnosis-v7.jsx`, `velnoc-simulator-v7.1-aligned.jsx`)는 본 파일을 import하지 않아도 동작합니다. 동시에 import해도 같은 값이라 충돌 없음.

---

## 3. 사용법 — 컨테이너 스코프

토큰은 `.vn-root` 클래스 안에서만 활성화됩니다. 격리를 위해 body 전역이 아닌 컨테이너 스코프를 사용:

```jsx
<div className="vn-root">
  {/* 시스템 토큰이 적용된 영역 */}
  <h1 className="vn-head">제목</h1>
  <button className="vn-btn-primary">CTA</button>
</div>
```

---

## 4. 토큰 명세

### Surface (배경)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--velnoc-stone` | `#F2F1ED` | 페이지 베이스 배경 |
| `--velnoc-surface` | `#FAFAF8` | 카드, 폼, 컨테이너 |
| `--velnoc-paper` | `#FFFFFF` | 발색용 (드물게) |

### Ink (텍스트)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--velnoc-ink-primary` | `#1A1A18` | 헤드라인, 본문 메인 |
| `--velnoc-ink-secondary` | `#585854` | 본문 보조, 라벨 |
| `--velnoc-ink-tertiary` | `#7A7872` | 메타, 캡션, 비활성 |

### Accents

**Primary — 오크 그린 (모든 일반 액션)**

| 토큰 | 값 | 용도 |
|---|---|---|
| `--velnoc-oak` | `#2D5F4E` | CTA, 링크, 데이터 강조 |
| `--velnoc-oak-soft` | `#E5EFEA` | 호버 배경, 라이트 영역 |
| `--velnoc-oak-deep` | `#1F4337` | 액티브, 강한 강조 |

**Editorial — 테라코타 (한정 사용 · 페이지당 1곳)**

| 토큰 | 값 | 용도 |
|---|---|---|
| `--velnoc-terracotta` | `#C4633C` | 결정타 카피, Manifesto, Origin |
| `--velnoc-terracotta-soft` | `#F4E2D6` | 인용 블록 배경 |

### Functional

| 토큰 | 값 | 용도 |
|---|---|---|
| `--velnoc-divider` | `rgba(26,26,24,0.08)` | 가벼운 구분선 |
| `--velnoc-border` | `rgba(26,26,24,0.12)` | 일반 보더 |
| `--velnoc-border-strong` | `rgba(26,26,24,0.2)` | 강조 보더 |
| `--velnoc-danger` | `#B91C1C` | 거절·경고 (극히 제한적) |
| `--velnoc-danger-soft` | `rgba(185,28,28,0.06)` | 거절·경고 배경 |
| `--velnoc-focus-ring` | `rgba(45,95,78,0.25)` | 포커스 링 (oak 알파) |

### Typography Stacks

| 토큰 | 폰트 스택 | 용도 |
|---|---|---|
| `--velnoc-font-kr-head` | `Gowun Batang` → `Noto Serif KR` | 일반 헤딩 (한글) |
| `--velnoc-font-en-head` | `Fraunces` → `Gowun Batang` | 일반 헤딩 (영문) |
| `--velnoc-font-kr-display` | `Noto Serif KR` | Display 모드 (한정) |
| `--velnoc-font-en-display` | `Instrument Serif` | Display 모드 (영문) |
| `--velnoc-font-body` | `Pretendard Variable` → system | 본문 전체 |
| `--velnoc-font-mono` | `ui-monospace` → system | 코드, 마이크로 라벨 |

### Spacing (8px Grid)

`--velnoc-space-1` (4px) ~ `--velnoc-space-32` (128px). 자세한 값은 CSS 파일 참조.

### Radius

| 토큰 | 값 | 용도 |
|---|---|---|
| `--velnoc-radius-sm` | 4px | 작은 칩, 배지, 인풋 |
| `--velnoc-radius-md` | 6px | 버튼 |
| `--velnoc-radius-lg` | 8px | 카드 |
| `--velnoc-radius-xl` | 12px | 큰 컨테이너 |

---

## 5. 컴포넌트 클래스

### 타이포 유틸리티

| 클래스 | 의미 |
|---|---|
| `.vn-head` | 헤딩 (Gowun Batang 400) |
| `.vn-display` | Display 모드 (Noto Serif KR 700, 한정 사용) |
| `.vn-micro` | 11px 모노 라벨 uppercase tracking 0.16em |
| `.vn-tabular` | `font-variant-numeric: tabular-nums` |

### 버튼

| 클래스 | 의미 |
|---|---|
| `.vn-btn-primary` | 오크 배경 + 흰 텍스트 (기본 CTA) |
| `.vn-btn-secondary` | 아웃라인 |
| `.vn-btn-editorial` | 테라코타 (Manifesto·Origin·결과 페이지만) |
| `.vn-link-ghost` | 텍스트 링크 (오크 + underline) |

### 입력

| 클래스 | 의미 |
|---|---|
| `.vn-input` | 표준 텍스트 입력 |
| `.vn-option-btn` | 라디오/체크박스 대체 (선택 시 `.selected` 추가) |

### 카드

| 클래스 | 의미 |
|---|---|
| `.vn-card` | 기본 카드 |
| `.vn-card-featured` | 상단 oak strap (가격, 추천 영역) |
| `.vn-card-editorial` | Display 카드 (테라코타-soft, 한정) |

### 인용

| 클래스 | 의미 |
|---|---|
| `.vn-quote` | 일반 Pull Quote (oak 좌측 보더) |
| `.vn-quote-display` | Display Pull Quote (테라코타-soft 배경) |

### 애니메이션·유틸

| 클래스 | 의미 |
|---|---|
| `.vn-fade-in` | 0.4s ease 페이드 인 + 위로 6px |
| `.vn-dot-pulse` | 0.4 → 1 opacity 펄스 (분석 인디케이터용) |
| `.vn-bar-fill` | 1.1s cubic-bezier 너비 트랜지션 |
| `.vn-scroll` | 스크롤바 숨김 |
| `.vn-grain` | 미세 노이즈 그레인 텍스처 |

---

## 6. 사용 규칙 (PART 8 LLM 지침 준수)

1. **컬러는 토큰명으로 호출** — hex 직접 입력 금지
   - 옳음: `style={{ color: 'var(--velnoc-oak)' }}`
   - 틀림: `style={{ color: '#2D5F4E' }}`

2. **테라코타·Display 모드는 페이지당 1회 한정**
   - 시뮬레이터 페이지: 기회비용 섹션에 한 번 사용 중
   - 진단 페이지: VELNOC IS DIFFERENT 카드에 한 번 사용 중

3. **숫자 표시는 항상 `vn-tabular`** 
   - 큰 금액·점수·날짜는 `font-variant-numeric: tabular-nums` 필수

4. **모든 폰트 사이즈·여백은 토큰만 사용**
   - 임의 px 금지

5. **그라데이션·다크모드 그림자·네온 금지**

6. **GEO 경쟁사 톤 모방 금지**
   - 다크 + 네온 + 그라데이션 조합 일체 금지

---

## 7. OS 대시보드 확장 명세 (PART 5-4)

OS 대시보드는 데이터 밀도가 높아 별도 스코프 변형(`.vn-os`)을 제공합니다.

```jsx
<div className="vn-root vn-os">
  {/* 자동으로 spacing·radius·font-size 한 단계 축소 */}
</div>
```

**자동 적용 변경:**
- 본문 폰트 16px → 14px
- 카드 padding 24px → 16px
- 카드 radius 8px → 6px
- 버튼 padding/font 한 단계 축소
- 테라코타 컴포넌트 자동 숨김 (`.vn-btn-editorial`, `.vn-card-editorial`)

**추가 권장 사항 (수동 적용):**
- 헤딩은 H3 이하 위주 사용
- 데이터 시각화 컬러는 oak + 회색 계열만 (PART 5-5와 동일 원칙)
- 차트 multi-color 시퀀스는 별도 정의 시까지 oak 음영으로

---

## 8. Quant/Trading 사이트 변형 (PART 5-5)

향후 AlphaBridge 류 사이트는 다음 변형 적용 예정:

- Display 모드 미사용
- Stone 비중↓, Surface 비중↑
- 헤드라인 weight 살짝 무겁게 (Gowun Batang 500 가능 시)
- 차트 컬러 oak + 회색만

별도 `.vn-quant` 변형 스코프는 해당 사이트 빌드 시 추가 예정.

---

## 9. 버전 관리

| 버전 | 날짜 | 변경 |
|---|---|---|
| v1.0 | 2026-05-18 | 최초 추출. 디자인 시스템 v1.0 전체 토큰화 |

**v1.x 호환 정책:**
- 토큰 값은 마이너 버전 내에서 변경되지 않음
- 새 토큰 추가는 마이너 버전 업 (v1.1, v1.2...)
- 토큰 값 변경은 메이저 버전 업 (v2.0)

---

## 10. 결정 보류 항목

- 데이터 시각화 multi-color 시퀀스 (시뮬레이터·차트용)
- 일러스트레이션·아이콘 시스템 (Tabler / Lucide 등)
- 모션·트랜지션 가이드 (v1.1 분리 예정)
- 다크모드 정책 (현재 light only, OS 대시보드는 옵션 검토 가능)

---

## 11. 빠른 점검 체크리스트

신규 페이지·도구 빌드 시 확인:

- [ ] `.vn-root` 컨테이너로 감쌌는가
- [ ] hex 직접 입력 없이 모두 `var(--velnoc-*)` 토큰 호출인가
- [ ] 테라코타는 페이지당 0~1회인가
- [ ] Display 모드는 페이지당 0~1회인가
- [ ] 숫자에 `vn-tabular`가 적용됐는가
- [ ] 그라데이션·네온·다크 그림자 없는가
- [ ] 헤딩이 한글이면 Gowun Batang(또는 vn-head), 본문은 Pretendard인가
- [ ] CTA 색은 모두 oak인가 (분류별 다채색 금지)
- [ ] 거절/경고에만 danger 사용했는가
