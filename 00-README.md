# VELNOC Site Build Package — codex 빌드 명세

> **이 패키지의 목적**: 벨녹(VELNOC)의 첫 공식 사이트(velnoc.com)를 codex가 한 번에 빌드할 수 있도록 모든 결정사항·명세·카피·자산을 묶었습니다.
> **패키지 버전**: 1.0 / 2026-05-18
> **빌드 대상**: Phase 1 — 메인 사이트(13개 페이지) + 자가 진단 + ROI 시뮬레이터 + 폼 백엔드

---

## 0. codex에게 — 먼저 읽기

### 0-1. 절대 규칙

1. **본 README → 01 → 02 → 03 → 04 → 05 → 06 → 07 순서로 통째로 읽고 빌드 시작**
2. **카피·메시지·페이지 구조 변경 권한 없음**. 변경 필요 시 사용자에게 먼저 확인
3. **Phase 1 범위 외 페이지 추가 금지** (03 PRD PART 2 참조)
4. **브랜드 컨텍스트 PART 4-2 (Banned Phrases) 및 PART 6-2 (절대 하지 말 것)는 hard rule**
5. **디자인 시스템 토큰만 사용**, hex·임의 사이즈·임의 여백 금지
6. **빌드 중 의문점은 README 마지막 섹션 "결정 보류"에 추가** — 빌드를 멈추지 말 것

### 0-2. 첫 30분 권장 순서

```
1) 본 README 읽기                          (5분)
2) 01-brand-context.md 읽기                (10분)  ← 가장 길고 가장 중요
3) 02-design-system.md 읽기                (5분)
4) 03-site-prd.md 읽기                     (5분)
5) STACK-DECISION.md 작성 후 빌드 시작     (5분)
```

---

## 1. 사용자 결정사항 (잠금)

| # | 항목 | 결정 |
|---|---|---|
| Q1 | 기술 스택 | codex 판단. 권장 1순위 Next.js 14 + Vercel (자세히는 `06-tech-stack-recommendations.md`) |
| Q2 | Phase 1 범위 | 메인 사이트 + 자가 진단 + ROI 시뮬레이터 모두 포함 |
| Q3 | 도메인 | `velnoc.com` 단일 + `/tools/*` 경로. `velnocworks.com` → 301 redirect |
| Q4 | 폼·이메일·결제 백엔드 | 폼 캡처 + Resend 이메일 + Slack 알림만. 결제는 Phase 2 |
| Q5 | CMS / 콘텐츠 관리 | 하드코딩. CMS는 Phase 2 결정 |

이 결정사항은 빌드 도중 변경하지 않는다. 변경이 필요하면 사용자에게 먼저 확인.

---

## 2. 패키지 구성

```
velnoc-codex-package/
├── 00-README.md                       ← 이 파일 (진입점)
├── 01-brand-context.md                ← 브랜드 마스터 (v2.4)
├── 02-design-system.md                ← 디자인 시스템 v1.0
├── 03-site-prd.md                     ← 사이트 요구사항
├── 04-information-architecture.md     ← 사이트맵·URL·메타·schema
├── 05-page-content-sheets.md          ← 13개 페이지 카피·CTA·구조
├── 06-tech-stack-recommendations.md   ← 스택 후보·평가축·라이브러리
├── 07-handoff-checklist.md            ← 빌드 시작·중간·출시 체크리스트
└── assets/
    ├── ASSETS-README.md               ← 참조 구현 안내·토큰화 가이드
    ├── velnoc-diagnosis-v3.jsx        ← 자가 진단 참조 구현 (1,316줄)
    ├── velnoc-simulator-v7.jsx        ← ROI 시뮬레이터 참조 구현 (964줄)
    └── velnoc-design-system-demo.html ← 디자인 시스템 living guide (961줄)
```

## 3. 각 문서 한 줄 요약

| 파일 | 역할 |
|---|---|
| **01-brand-context.md** | 벨녹의 정체성·미션·5가지 원칙·타겟·서비스 라인업·톤앤매너·받지 않는 의뢰·장기 비전. 모든 결정의 상위 레이어 |
| **02-design-system.md** | 컬러 토큰·타이포 시스템·layout·컴포넌트 명세. 빌드 시 시각 표준 |
| **03-site-prd.md** | Phase 1 범위·페이지·기능·비기능 요구사항·성공 기준 |
| **04-information-architecture.md** | 사이트맵·URL·네비·메타·JSON-LD·robots·sitemap |
| **05-page-content-sheets.md** | 13개 페이지의 모든 카피·섹션·CTA. **그대로 사용** |
| **06-tech-stack-recommendations.md** | Next.js vs Astro 후보·라이브러리·폴더 구조·환경변수 |
| **07-handoff-checklist.md** | 빌드 전·중·출시 직전·출시 직후 체크리스트 |

---

## 4. 핵심 빌드 산출물 (Definition of Done)

빌드 완료 시 다음이 모두 충족되어야 한다 (`07-handoff-checklist.md` 참조).

| 영역 | 목표 |
|---|---|
| 페이지 | 13개 페이지 SSG 빌드 성공 |
| 도구 | 자가 진단·시뮬레이터 종단 동작 |
| 폼 | Resend 메일 + Slack 알림 도착 확인 |
| Lighthouse 모바일 | Performance ≥ 90, Accessibility = 100, SEO = 100 |
| GEO | AI 크롤러 허용 + JSON-LD 검증 통과 |
| 메타 | 13개 페이지 모두 고유 title/description/canonical |

---

## 5. codex가 빌드 시작 시 작성할 파일

빌드 시작과 동시에 저장소 루트에 다음 파일들을 만들어야 한다:

- `STACK-DECISION.md` — 최종 스택 결정 사유 (`06-tech-stack-recommendations.md` PART 7 템플릿 사용)
- `README.md` — 셋업 가이드 + 환경변수 + `npm run dev` 등 명령
- `.env.local.example` — 환경변수 템플릿 (`06` PART 4 참조)
- `.gitignore` — 표준

빌드 진행 중 결정 보류된 항목은 본 README의 "9. 결정 보류" 섹션에 추가하거나, 별도 `BLOCKERS.md` 파일에 기록.

---

## 6. 자산 (참조 구현) 핸드오프

`assets/` 폴더의 `ASSETS-README.md`를 먼저 읽을 것.

**포함된 자산** (3종, 합계 약 3,200줄):
- `velnoc-diagnosis-v3.jsx` — 자가 진단 참조 구현
- `velnoc-simulator-v7.jsx` — ROI 시뮬레이터 참조 구현
- `velnoc-design-system-demo.html` — 디자인 시스템 v1.0 living guide (브라우저에서 토큰 시각 검증용)

**핵심 원칙**: 세 파일은 **그대로 복사하지 않는다**. 참조 구현은 별도 컬러 시스템(다크 + 보라/네온)을 쓰므로 본 패키지의 디자인 시스템과 충돌. codex는 **동작 명세·로직·카피·UX 구조만 가져오고, 컬러·타이포·여백은 `02-design-system.md` 토큰으로 재구성**한다. 매핑 가이드는 `assets/ASSETS-README.md` PART 3 참조.

---

## 7. 빌드 후 사용자(안상효 대표)에게 보고할 것

`07-handoff-checklist.md` PART E 참조. 핵심:

1. `STACK-DECISION.md` 최종 내용
2. 빌드된 페이지 목록 + Vercel preview URL
3. 환경변수 셋업 필요 항목 (Resend·Slack)
4. 도메인 연결 가이드 (Cloudflare DNS)
5. 검색엔진 등록 가이드 (Google·Naver·Bing)
6. Phase 2로 미룬 항목 리스트
7. 빌드 중 결정 보류된 항목 리스트

---

## 8. 우선순위 (시간 부족할 때)

만약 빌드 시간이 부족해 모두를 같은 깊이로 만들 수 없다면, 다음 우선순위로 진행:

| Tier | 페이지·기능 | 비고 |
|---|---|---|
| **P0 (필수)** | `/`, `/tools/diagnosis`, `/tools/simulator`, `/contact`, `/services`, `robots.txt`, `sitemap.xml`, JSON-LD, 폼 백엔드 | 이게 안 되면 출시 불가 |
| **P1 (강추)** | `/cases`, `/about`, `/about/origin`, `/manifesto`, `/clients/criteria`, `/faq` | 신뢰·메시지 자산. 늦어도 출시 후 1주 |
| **P2 (선택)** | `/process`, `/legal/*`, `/404`, `/500` | 출시 후 1주 내 |

P0 페이지의 코드 품질을 P1·P2보다 우선. P1·P2는 카피만 정확하면 정적 페이지 1개로도 충분.

---

## 9. 결정 보류 (codex 빌드 중 채울 것)

빌드 중 사용자에게 확인이 필요하지만 빌드는 멈추지 말아야 하는 항목을 여기 추가:

- [ ] `03-site-prd.md`는 성공 기준에서 12개 페이지라고 쓰지만, `04-information-architecture.md`와 `05-page-content-sheets.md`는 `/legal/privacy`, `/legal/terms`를 별도 라우트로 요구합니다. 빌드는 실제 IA 라우트 기준으로 14개 라우트를 포함합니다.
- [ ] `/legal/privacy`, `/legal/terms`는 Phase 1 placeholder이며 법무 검토가 필요합니다.
- [ ] Resend 발신 도메인, 운영자 이메일, Slack webhook, Kakao 채널 URL은 실제 운영 환경변수 입력이 필요합니다.
- [ ] 폰트 self-host는 최종 폰트 파일 또는 font package 확정 후 완전 검증해야 합니다. 현재 빌드는 CSS font stack과 외부 font URL 허용 CSP로 시작합니다.
- [ ] npm audit 기준 Next.js 14 계열 high 취약점 때문에 Next.js 16.2.6으로 상향했습니다. 다만 Next 내부 고정 `postcss@8.4.31`로 인한 moderate advisory는 남아 있으며, 현재 npm이 제시하는 자동 수정은 부정확한 breaking 경로라 적용하지 않았습니다.

---

## 10. 빌드 시작 후 사용자에게 첫 응답 권장 형식

빌드 시작 직후 codex가 사용자에게 보낼 첫 메시지 예시:

```
패키지 8개 문서 읽기 완료.
스택 결정: Next.js 14 + Vercel (이유: ...).

다음 순서로 빌드합니다:
  1. 디자인 시스템 토큰 등록 + 폰트 셋업
  2. 글로벌 레이아웃 (헤더·푸터)
  3. P0 페이지 5개 + 폼 백엔드
  4. P1 페이지 6개
  5. P2 페이지 2개 + 404/500
  6. 최종 QA + 핸드오프 체크

빌드 중 막히는 부분은 README의 "결정 보류"에 추가합니다.
시작합니다.
```

---

## 11. 끝맺음

본 패키지의 모든 문서는 codex가 한 사람의 빌더로서 막힘 없이 작업할 수 있게 설계되었다.

막히면 두 가지 중 하나:
- 본 패키지의 다른 문서를 다시 읽기 (대부분 답이 거기 있음)
- 사용자에게 명확한 질문 한 가지로 물어보기 (여러 개 동시 금지)

벨녹의 사이트는 단순한 회사 소개가 아니라 **벨녹이 클라이언트에게 약속하는 것을 자기 사이트로 증명하는 자산**이다. 잘 만들면 그 자체가 가장 큰 GEO 자산이 된다.

**시작해도 좋다.**
