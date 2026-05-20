# 03 — VELNOC Site PRD (Product Requirements Document)

> **버전**: v1.0 / **최종 갱신**: 2026-05-18
> **상위 문서**: `01-brand-context.md`, `02-design-system.md`
> **본 문서의 역할**: codex가 빌드를 시작하기 전 합의해야 하는 사이트 요구사항 명세. 본 문서와 상위 두 문서가 충돌하면 상위 문서를 따른다.

---

## 1. 목적 (Why)

벨녹의 첫 공식 디지털 자산. 다음 5가지가 동시에 작동해야 한다.

1. **GEO 자산화** — 사이트 자체가 SEO·AEO·GEO 모범 사례여야 함. 벨녹이 클라이언트에게 약속하는 것을 자기 사이트로 증명.
2. **Lead Generation** — 자가 진단과 시뮬레이터를 통해 진성 리드 확보. 폼 캡처 → Resend 발송 + Slack 알림.
3. **신뢰 자산화** — 케이스(AlphaBridge·돼지농장OS·파나요·First Pilot)와 거절 기준 공개로 차별화된 신뢰 신호 발신.
4. **메시지 결정타 발사대** — Manifesto, Origin Story, 받지 않는 의뢰가 클라이언트의 가치 정렬을 즉시 검증.
5. **운영 단순성** — 1인 운영 가능한 구조. CMS 없이 코드 저장소만으로 변경·배포 가능.

## 2. Phase 1 범위

### 2-1. In-Scope (반드시 포함)

| 카테고리 | 항목 |
|---|---|
| **페이지** | 홈 / About / Origin / Manifesto / Services / Cases / Process / FAQ / Clients Criteria(받지 않는 의뢰) / Tools(Diagnosis, Simulator) / Contact / Legal |
| **인터랙티브 도구** | 자가 진단 (도메인 분석 + A~F 분류 + 결과 화면), ROI 시뮬레이터 (5년 비교 + 자산 누적 시각화) |
| **백엔드** | 폼 캡처 API (도구 결과·연락처) → Resend 이메일 + Slack webhook |
| **SEO·AEO·GEO** | metadata·OG·schema.org Organization/Person/Service/FAQPage/Review 마크업 |
| **분석** | Vercel Analytics (또는 PostHog) + 핵심 이벤트 트래킹 |
| **i18n** | 한국어 단일 (en은 hreflang만 예비) |
| **반응형** | 모바일 우선, 320px ~ 1440px |
| **접근성** | WCAG 2.2 AA (키보드 네비, 명도 대비, ARIA) |

### 2-2. Out-of-Scope (Phase 2 이후)

- 결제 시스템 (토스페이먼츠 등)
- 상세 리포트 PDF 자동 생성·발송
- CMS 또는 Notion/Sanity 연동
- 다국어 영문 완전판
- 회원 가입·로그인
- 카카오톡 공유 위젯 (자가 진단 결과 카드)
- 비공개 Verified 등재 페이지 (PART 10 비전)
- 블로그·뉴스레터 발행 시스템
- A/B 테스트 인프라

## 3. 핵심 기능 요구사항 (Functional)

### 3-1. 자가 진단 도구 (`/tools/diagnosis`)

**필수 동작**
- 진입 분기: "사이트 있음 / 없음" 선택
- 도메인·브랜드·키워드·경쟁사 입력 (있음 분기) / 경쟁사 1~3개 (없음 분기, 필수)
- 4 Step 설문 진행 (사업 기본·디지털 자산·마케팅 경험·AI 가시성 인지도)
- 백그라운드 도메인 분석 (Phase 1 MVP는 deterministic 시뮬레이션 — 별도 백엔드 없이 서버리스 함수 내부 처리)
- 결과: A~F 분류 + 핵심 병목 3개 + AI 가시성 점수
- A 분류는 "벨녹 영역 아님" 단독 화면, 채널별 추천 전문가 가이드 카드 펼침
- B~F 분류는 시뮬레이터 진입 CTA 표시
- 이메일 캡처 (선택), 캡처 시 Resend로 자동 회신 + Slack 알림

**자산 소스**: `assets/velnoc-diagnosis-v3.jsx` (참조 구현, 별도 대화에서 작성됨)

### 3-2. ROI 시뮬레이터 (`/tools/simulator`)

**필수 동작**
- 진단 결과에서 진입 시 분류별 프리셋 자동 적용 (`?preset=C|D|E` 쿼리)
- 직접 진입 시 4 Step 입력 (현재 상황 프리셋·슬라이더·기간 토글·리드 캡처)
- 5년 비교 누적 비용 곡선 (현재/단발/벨녹 3선) — Recharts
- 자산 누적 시각화 (SEO 키워드·AI 인용·콘텐츠·자동화) — S-curve area chart
- 인플레이션 가정 투명 공개 (광고비 토글 0/10/20%, 나머지 연 3%)
- 결과 페이지에 Display 모드 한정 결정타 카피 1회 (디자인 시스템 PART 5 준수)
- 이메일 캡처 → Resend + Slack

**자산 소스**: `assets/velnoc-simulator-v7.jsx` (참조 구현, 별도 대화에서 작성됨)

### 3-3. 두 도구의 연결 (PART 7-7)

진단 → 시뮬레이터 동선이 끊기지 않아야 한다.

- 진단 결과에서 "5년 후엔 어떻게 달라질까요?" CTA → `/tools/simulator?preset={A~F}&from=diagnosis`
- 시뮬레이터에서 직접 진입 시 "그런데 우리 사업은 지금 어디 단계일까요?" CTA → `/tools/diagnosis`
- A 분류는 시뮬레이터 비노출 (브랜드 컨텍스트 PART 7-7-3)
- F 분류는 시뮬레이터 대신 `/contact?type=os` 분기

### 3-4. 폼·이메일·알림

**모든 폼**: 자가 진단 리드 / 시뮬레이터 리드 / Contact 폼

| 단계 | 동작 |
|---|---|
| 1. 제출 | 클라이언트 검증 → `/api/lead` POST |
| 2. 서버 | 입력 sanitize → Resend로 사용자에게 자동 회신 + 운영자에게 알림 메일 |
| 3. 알림 | Slack incoming webhook으로 채널 알림 (이름·유형·요약 한 줄) |
| 4. 응답 | 클라이언트에 성공 화면 표시 (이메일 확인 안내) |
| 5. 실패 처리 | Resend 실패 시 fallback으로 Slack에만 raw payload 전송 |

**환경변수** (`.env.local`):
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (예: `노트북 <noreply@velnoc.com>`)
- `RESEND_TO_OPERATOR` (안상효 대표 메일)
- `SLACK_WEBHOOK_URL`
- `NEXT_PUBLIC_SITE_URL`

### 3-5. SEO·AEO·GEO 마크업 (자기 적용)

벨녹 사이트가 GEO 모범 사례가 되어야 한다. 다음을 빠짐없이 구현.

- 모든 페이지 `<title>` `<meta description>` `<link rel="canonical">` 고유 설정
- OG/Twitter card 메타 (페이지별)
- `robots.txt`로 GPTBot·ClaudeBot·PerplexityBot·Google-Extended 명시적 Allow
- `sitemap.xml` 자동 생성
- JSON-LD schema.org 마크업
  - 모든 페이지: `Organization` (founder, sameAs)
  - About: `Person` (안상효 대표)
  - Services: `Service` × 라인업 수
  - Cases: `CreativeWork` 또는 `Project`
  - FAQ: `FAQPage`
  - Pricing 표시 시: `Offer` + `PriceSpecification`
- 시맨틱 HTML (`<article>` `<section>` `<nav>` `<main>` `<aside>`)
- 헤딩 위계 (h1 1개, h2-h6 순차)
- 모든 이미지 `alt` 텍스트
- 텍스트는 이미지에 묻지 않을 것 (디자인 시스템 PART 0 준수)

### 3-6. 분석 이벤트

| 이벤트명 | 트리거 | 속성 |
|---|---|---|
| `page_view` | 모든 페이지 진입 | path, referrer |
| `diagnosis_start` | 진단 진입 분기 선택 | has_site (boolean) |
| `diagnosis_step_complete` | 각 step 완료 | step_number |
| `diagnosis_result` | 결과 화면 도달 | grade (A~F), score |
| `simulator_start` | 시뮬레이터 진입 | preset (A~F or none), from |
| `simulator_result` | 결과 페이지 도달 | savings_won, years |
| `lead_submit` | 폼 제출 성공 | source (diagnosis/simulator/contact), grade |
| `cta_click` | 주요 CTA 클릭 | cta_name, page |

## 4. 비기능 요구사항 (Non-functional)

### 4-1. 성능

- LCP < 2.5s (모바일 4G 기준)
- CLS < 0.1
- INP < 200ms
- 폰트는 self-host 및 `font-display: swap`
- 도구 페이지를 제외한 모든 페이지는 SSG (정적 빌드)
- 도구 페이지는 클라이언트 컴포넌트, 입력 상태는 URL state로 유지 가능하게 설계 (시뮬레이터 결과 공유 대비)

### 4-2. 접근성

- WCAG 2.2 AA
- 모든 인터랙티브 요소 키보드 접근 가능
- 포커스 링 (디자인 시스템 PART 1-4 토큰 사용)
- 폼 라벨 명시
- 슬라이더는 `<input type="range">` 또는 키보드 지원 ARIA 슬라이더
- 컬러만으로 정보 전달 금지 (오크 그린 + 텍스트 라벨 병행)

### 4-3. 보안

- 모든 폼 입력 서버사이드 sanitize
- Rate limit: 폼 제출 IP당 분당 5회 (Vercel Edge Middleware 또는 Upstash)
- CSP 헤더 설정
- HTTPS 강제 (Vercel 기본)
- 이메일 주소 검증 (RFC 5322 정규식 + DNS MX 선택)
- Honeypot 필드 (스팸 방지)

### 4-4. 운영·배포

- Git 저장소 (GitHub 권장)
- 메인 브랜치 → 프로덕션 자동 배포
- PR → preview deployment
- 환경 분리: development / preview / production
- 환경변수는 호스팅 플랫폼에서 관리 (.env.local은 .gitignore)

### 4-5. 도메인·DNS

- `velnoc.com` — 메인 도메인 (apex + www → apex)
- `velnocworks.com` — 301 permanent redirect → `velnoc.com`
- DNS는 Cloudflare 권장 (DDoS 보호, 캐싱)
- 이메일 SPF·DKIM·DMARC 설정 (Resend 송신을 위해)

## 5. 성공 기준 (Definition of Done)

Phase 1 출시 시 다음 모두 충족.

| 영역 | 기준 |
|---|---|
| 페이지 | 12개 페이지 모두 SSG 빌드 성공 |
| 도구 | 진단·시뮬레이터 처음부터 끝까지 동작 (이메일 캡처 포함) |
| 폼 | 3종 폼 제출 시 Resend 메일 + Slack 알림 모두 도착 |
| 성능 | Lighthouse Performance ≥ 90 (모바일) |
| 접근성 | Lighthouse Accessibility = 100 |
| SEO | Lighthouse SEO = 100 |
| GEO | robots.txt에서 AI 크롤러 허용 확인, JSON-LD 검증 (Google Rich Results Test 통과) |
| 메타 | 12개 페이지 모두 고유 title/description/canonical |
| 모바일 | 320px ~ 1440px 모든 페이지 깨지지 않음 |
| 폼 보안 | Rate limit + honeypot 동작 확인 |

## 6. 결정 보류 (codex 빌드 중 결정 가능)

- 아이콘셋: Lucide React 권장 (디자인 시스템 PART 8 참조)
- 차트 라이브러리: Recharts 권장 (참조 구현이 Recharts 사용)
- 폼 라이브러리: react-hook-form + zod 권장
- 분석: Vercel Analytics vs PostHog (호스팅 정해진 후 결정)
- 이미지: Next.js 사용 시 `next/image`, 그 외 `<img loading="lazy">` + 사이즈 명시

## 7. codex에게 명시적으로 지시할 것

1. **본 문서·01·02를 먼저 통째로 읽고 빌드 시작할 것**
2. **참조 구현 `assets/*.jsx`는 *명세*이지 *그대로 복사할 코드*가 아님**. 디자인 시스템 v1.0 토큰으로 재구성해야 함 (참조 구현은 별도 컬러 시스템을 쓰고 있음)
3. **카피 변경 권한 없음** — `05-page-content-sheets.md`의 카피를 그대로 사용. 의역·축약·확장 모두 금지
4. **새 페이지 추가 권한 없음** — Phase 1 범위 외 페이지는 만들지 않음
5. **브랜드 컨텍스트 PART 4-2 (Banned Phrases)와 6-2 (절대 하지 말 것)는 hard rule**
6. **빌드 중 의문점은 README의 "결정 보류" 항목에 추가 후 진행** — 빌드를 멈추지 않음
