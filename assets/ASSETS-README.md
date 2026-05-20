# assets/ — 참조 구현 (Reference Implementations)

> **본 폴더에는 자가 진단·시뮬레이터의 *참조 구현(reference implementation)* 이 포함되어 있습니다.**
> codex는 본 폴더의 .jsx 파일을 **명세로만** 활용하고, 디자인 시스템 토큰으로 재구성합니다.

---

## 1. 포함된 파일

| 파일 | 줄 수 | 출처 | 역할 |
|---|---:|---|---|
| `velnoc-diagnosis-v3.jsx` | 1,316 | 대화 "벨녹 자가 진단 도구 MVP 설계" | 자가 진단 도구 참조 구현 |
| `velnoc-simulator-v7.jsx` | 964 | 대화 "벨녹 경쟁사 분석 및 고객 확보 전략" | ROI 시뮬레이터 참조 구현 |
| `velnoc-design-system-demo.html` | 961 | 대화 "벨녹 브랜드 디자인 가이드 결정" | 디자인 시스템 v1.0 living guide |

세 파일 모두 **단일 파일 React/HTML로 동작하는 self-contained 구현체**입니다. 그대로 빌드에 복사하는 것이 아니라, 빌드 시 명세로 참조합니다.

## 2. 참조 구현을 *그대로 복사하지 마라*

`velnoc-diagnosis-v3.jsx`는 별도 컬러 시스템(다크 + 보라/네온 분류 색상)을 사용합니다. 본 패키지의 `02-design-system.md`(스톤 + 오크 그린 + 테라코타)와 충돌합니다. 빌드 결과물에 그대로 들어가면 디자인 시스템이 깨집니다.

**codex는 참조 구현을 다음 관점에서만 활용해야 합니다.**

| 활용 | ✅ / ❌ | 비고 |
|---|:---:|---|
| 동작 명세 (step 흐름, 데이터 흐름) | ✅ | 그대로 가져오기 |
| 로직 (A~F 분류 알고리즘, 인플레이션 계산, 자산 누적 모델) | ✅ | 함수 단위로 가져오기 |
| 카피 (분류별 결과 문구, 결정타 메시지) | ✅ | 정확히 그대로 |
| UX 구조 (진입 분기, 결과 화면 분기, A 분류 단독 처리) | ✅ | 분기 구조 그대로 |
| 컬러·타이포 | ❌ | 디자인 시스템 토큰으로 교체 |
| 여백·radius·shadow | ❌ | 디자인 시스템 spacing scale·radius·shadow 토큰으로 교체 |
| 임의 hex 값 | ❌ | 모든 hex는 `02-design-system.md` PART 1 토큰으로 교체 |
| 인라인 style 객체 | ❌ | Tailwind 클래스 또는 CSS variable로 재작성 |

## 3. 토큰화 재구성 가이드

### 3-1. `velnoc-diagnosis-v3.jsx` 매핑

| 참조 구현에서 사용 | 디자인 시스템 토큰으로 교체 |
|---|---|
| 다크 배경 (`#0a0a0a`, `#1a1a1a` 등) | `var(--velnoc-stone)` 또는 `var(--velnoc-surface)` |
| 흰색 텍스트 (`rgba(255,255,255,0.92)` 등) | `var(--velnoc-ink-primary)` |
| 보조 텍스트 (`rgba(255,255,255,0.5)` 등) | `var(--velnoc-ink-secondary)` |
| 비활성 텍스트 (`rgba(255,255,255,0.2)` 등) | `var(--velnoc-ink-tertiary)` |
| 카드 배경 (`rgba(255,255,255,0.07)` 등) | `var(--velnoc-surface)` + `0.5px solid var(--velnoc-divider)` |
| 모노 폰트 (IBM Plex Mono) | `var(--font-mono)` — 단, 결과 숫자는 Pretendard tabular-nums 우선 |
| Noto Sans KR 본문 | `var(--font-body)` (Pretendard) |

**분류별 색상 재설계** (한 페이지에 6개 색이 동시에 노출되지 않게):

| 분류 | 의미 | 디자인 토큰 |
|---|---|---|
| A (영역 아님) | 회색·중립 | `--velnoc-ink-tertiary` 텍스트 + `--velnoc-stone` 배경 |
| B (시작) | 시작 톤 | `--velnoc-oak-soft` 액센트 |
| C (Pulse) | 표준 액션 | `--velnoc-oak` 액센트 |
| D (Signal) | 강조 | `--velnoc-oak` + 굵은 weight |
| E (Engine) | 깊은 강조 | `--velnoc-oak-deep` 액센트 |
| F (OS) | 결정 분기 | 테라코타 1회 허용 (`--velnoc-terracotta`) — F는 메인 동선에서 빠지는 단독 분기이므로 |

### 3-2. `velnoc-simulator-v7.jsx` 매핑

| 참조 구현에서 사용 | 디자인 시스템 토큰으로 교체 |
|---|---|
| 크림 배경 (`#FAF7F2` 또는 유사) | `var(--velnoc-stone)` |
| Deep emerald (`#0F4C3A`) | `var(--velnoc-oak)` 또는 `var(--velnoc-oak-deep)` — 토큰명 사용 강제 |
| Red 계열 (`#B91C1C` 등) | `var(--velnoc-danger)` |
| 회색 점선 (단발 업체 선) | `var(--velnoc-ink-tertiary)` + `stroke-dasharray="4 4"` |
| 검정 결론 밴드 | `var(--velnoc-ink-primary)` 배경 + `var(--velnoc-stone)` 텍스트 |
| 인라인 Tailwind 클래스 | 그대로 유지 가능. 단 임의 hex는 토큰으로 |

**차트 컬러 3색** (Recharts):
- 현재 방식 (악화 곡선): `var(--velnoc-danger)`
- 단발 업체 (정체 곡선): `var(--velnoc-ink-tertiary)` + dashed
- 벨녹 (개선 곡선): `var(--velnoc-oak)`

**자산 누적 시각화** (Area chart):
- 영역: `var(--velnoc-oak-soft)`
- 곡선: `var(--velnoc-oak)`
- 비교 baseline: `var(--velnoc-ink-tertiary)`

### 3-3. `velnoc-design-system-demo.html`

이 HTML 파일은 디자인 시스템 v1.0의 **시각 검증용 living guide**입니다. 브라우저에서 열면 모든 토큰·컴포넌트·페이지 모드 변주가 실제로 어떻게 보이는지 확인됩니다.

**활용**:
- ✅ 토큰의 시각 검증 ("이 색이 실제로 어떻게 보이지?")
- ✅ 컴포넌트 (버튼·카드·비교표·Pull quote)의 실제 렌더링 참조
- ✅ Default vs Editorial 모드의 시각 차이 직접 비교
- ❌ 이 HTML을 그대로 페이지로 사용하지 말 것 — 본 패키지의 `05-page-content-sheets.md`가 정확한 페이지별 카피·구조

빌드 중 "이 토큰이 어떻게 보이는지 헷갈린다" 싶으면 이 파일을 브라우저에서 열어 확인.

## 4. 핵심 로직 요약 (재구성용 빠른 참조)

전체 파일을 다 읽기 전에 빠르게 핵심 로직만 확인하고 싶을 때 사용.

### 4-1. 자가 진단 A~F 분류 알고리즘

```
1. 채널 차단 검사:
   - 마켓플레이스/배달앱/SNS DM 중 2개 이상이 주력 채널이면 → A (벨녹 영역 아님)

2. 4차원 스코어링:
   - D (디지털 자산, 0~3): 사이트 보유 + 플랫폼만 + 외부 플랫폼 + 콘텐츠 발행
   - M (마케팅 경험, 0~3): SNS 운영 + 광고 집행 경험 합산 cap
   - S (AI 가시성, 0~3): SEO 실행 + AEO/GEO 인지 + AI 검색 경험 합산 cap
   - O (운영 규모, 0~2): 기간 + 매출 구간

3. 총점 T = D + M + S + O

4. 분류:
   - T ≤ 2: B (시작 단계)
   - T 3~5: C (기본 확보 단계) → Pulse 추천
   - T 6~8: D (성장 단계) → Signal 추천
   - T ≥ 9: E (본격 운영 단계) → Engine 추천

5. 특수 분기:
   - T ≥ 9 + 특수 업종(농업·제조·B2B 산업 특화) 또는 고매출 → F (OS 후보)
```

자세한 로직은 `velnoc-diagnosis-v3.jsx` 참조.

### 4-2. 시뮬레이터 5년 비교 계산

```
연차별 누적:
  현재 방식:
    월 비용 = (호스팅 + 광고 + 콘텐츠 + 도구) × 인플레이션 누적
    광고비: (1 + 광고 인플레이션 토글)^년차  ← 사용자 선택 0% / 10% / 20%
    그 외: (1.03)^년차                        ← 고정
    누적 = Σ 월 비용 × 12

  단발 업체:
    초기 = 1,500,000
    월 = 30,000 × (1.03)^년차
    3년차에 리뉴얼 비용 1,500,000 × (1.03)^3 추가

  벨녹:
    초기 = 0
    월 = 190,000 × (1.03)^년차  ← 구독료 인플레이션 정직 반영
    누적 = Σ 월 비용 × 12

자산 가치 (S-curve):
  현재 방식: 3점 평평 (광고 의존, 누적 X)
  단발 업체: 8~15점 정체 (사이트는 있지만 누적 X)
  벨녹: 100 × (1 - e^(-0.4 × y))  ← 5년차 약 86점, 10년차 98점

벨녹 누적 디지털 자산 (시뮬레이션):
  SEO 상위 키워드: 1년 7개 → 3년 27개 → 5년 35개
  AI 검색 인용: 1년 3회 → 3년 27회 → 5년 75회
  자체 콘텐츠: 1년 12편 → 3년 36편 → 5년 60편
  자동화 워크플로우: 1년 1개 → 3년 3개 → 5년 5개
```

자세한 로직은 `velnoc-simulator-v7.jsx` 참조.

## 5. 빌드 시 권장 워크플로

1. `velnoc-diagnosis-v3.jsx`와 `velnoc-simulator-v7.jsx`를 한 번 통째로 읽기 (각 약 1,000줄)
2. 동작 흐름·로직·카피 추출
3. `velnoc-design-system-demo.html`을 브라우저에서 열어 토큰 시각 검증
4. 디자인 시스템 토큰으로 새 컴포넌트 작성 (참조 구현 코드 그대로 옮기지 말 것)
5. Recharts 그래프는 참조 구현의 데이터 구조 그대로, 색상만 디자인 시스템 토큰 적용
6. 모든 폼·이메일 캡처 부분은 본 패키지의 `03-site-prd.md` PART 3-4 명세로 백엔드 연결

빌드 산출물에 참조 구현 파일이 그대로 들어가서는 안 됩니다 — 본 폴더의 파일은 *읽기 전용 참조*입니다.
