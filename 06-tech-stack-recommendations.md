# 06 — Tech Stack Recommendations

> **버전**: v1.0 / **최종 갱신**: 2026-05-18
> **사용자 결정**: 기술 스택은 codex가 판단. 본 문서는 **권장 후보와 평가 기준**만 제공한다.
> codex는 본 문서를 읽고 최종 스택을 결정한 뒤, 결정 사항을 `/STACK-DECISION.md`로 저장소 루트에 기록해야 한다.

---

## 1. 평가 축 (우선순위 순)

1. **SEO·AEO·GEO 친화도** — 정적 빌드 / SSR / JSON-LD 자동 주입 가능 여부
2. **LCP·INP 성능** — 모바일 4G에서 Lighthouse 90+ 달성 가능 여부
3. **DX (개발 경험)** — codex 단독 작업 시 빌드 속도·디버깅·타입 안전성
4. **호스팅 비용** — Phase 1은 무료~월 $20 이내
5. **Phase 2 확장성** — 결제·PDF·CMS 추가 시 마찰이 적은가
6. **한국어 폰트 처리** — Pretendard Variable·Korean serif 폰트 self-host 용이성

## 2. 권장 후보

### 후보 A — Next.js 14 (App Router) + Vercel ⭐ 1순위

**선택 이유**
- App Router의 RSC(React Server Components)로 도구를 제외한 모든 페이지를 정적 빌드
- `generateMetadata`로 페이지별 SEO 메타 자동 생성
- `next/font`로 Pretendard·Gowun Batang·Fraunces self-host (LCP 개선)
- `next/image`로 자동 이미지 최적화
- API Routes로 `/api/lead` 폼 핸들러 (별도 백엔드 불필요)
- Vercel과 1급 통합 (PR preview, 자동 배포, edge function)
- 한국 개발자 생태계 가장 두꺼움

**단점**
- App Router 학습 곡선 (Pages Router보다 복잡)
- 빌드 사이즈가 Astro 대비 큼

**스택 디테일**
- React 18+ / Next.js 14+ / TypeScript
- CSS: Tailwind CSS v3 + CSS variables (디자인 시스템 토큰)
- 차트: Recharts (참조 구현과 일치)
- 폼: react-hook-form + zod
- 아이콘: lucide-react
- 분석: @vercel/analytics
- 이메일: Resend Node SDK
- Slack: 단순 fetch POST

### 후보 B — Astro 4 + Vercel

**선택 이유**
- 정적 우선이라 LCP·번들 사이즈 최강
- 도구 페이지만 React island로 처리 → 나머지는 0KB JS
- 다중 프레임워크 가능 (React island 사용)
- 콘텐츠 사이트에 최적

**단점**
- App Router 수준의 metadata API 부재 (직접 컴포넌트로 처리)
- API Route는 별도 어댑터 필요
- 한국 도큐먼트 적음
- Recharts 등 React 라이브러리를 island로 격리해야 함 (DX 추가 비용)

### 후보 C — Framer (사용자가 Q1에서 옵션으로 제시)

**선택 이유**
- 노코드 빠른 출시
- 디자인 변경 즉시 반영

**단점**
- 도구 (자가 진단 + 시뮬레이터) 통합 시 제약 큼
- JSON-LD 직접 제어 어려움 (GEO 친화도 낮음)
- 폼 백엔드 통합이 외부 도구 의존 (Resend 직접 연동 어려움)
- 본 사이트의 핵심 목표 (GEO 자기 적용)가 약화됨

> **추천**: 후보 A를 1순위로, 빌드 도중 막히면 후보 B로 전환. 후보 C는 Phase 1 목표 (GEO 자기 적용)와 충돌하므로 비권장.

## 3. 라이브러리 권장

| 영역 | 권장 | 대안 | 비고 |
|---|---|---|---|
| 스타일링 | Tailwind CSS v3 + CSS 변수 | vanilla-extract | 디자인 시스템 토큰은 CSS variable로 등록 후 Tailwind theme.extend로 연결 |
| 컴포넌트 베이스 | Radix UI 또는 자체 작성 | shadcn/ui | shadcn 사용 시 디자인 시스템 토큰 강제 주입 필요 |
| 차트 | Recharts | Visx, ECharts | 참조 구현이 Recharts |
| 폼 | react-hook-form + zod | Formik | 타입 안전성 우수 |
| 아이콘 | lucide-react | Tabler, Phosphor | 트리 쉐이킹 우수, 일관성 |
| 애니메이션 | Framer Motion 또는 CSS only | — | Phase 1은 정적 우선, motion 최소화 |
| 날짜 | date-fns | dayjs | 사용량 적으면 의존성 추가하지 않아도 됨 |
| 분석 | @vercel/analytics + Vercel Speed Insights | PostHog | Phase 1은 Vercel 기본 |
| 폰트 | next/font (Next.js 시) / fontsource (Astro 시) | Google Fonts CDN | self-host 필수 |

## 4. 환경 변수 명세

`.env.local` (개발), Vercel Project Settings (프로덕션):

```bash
# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL="VELNOC <noreply@velnoc.com>"
RESEND_TO_OPERATOR="안상효 <ceo@velnoc.com>"  # 실제 주소는 운영자가 채움

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx

# Site
NEXT_PUBLIC_SITE_URL=https://velnoc.com
NEXT_PUBLIC_KAKAO_CHANNEL_URL=https://pf.kakao.com/_xxxxx  # 운영자가 채움

# Analytics (선택)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx  # PostHog 사용 시
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Rate Limit (Upstash Redis 사용 시, 선택)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

`README.md`에 환경변수 셋업 가이드 작성 의무.

## 5. 폴더 구조 권장 (Next.js 14 App Router)

```
velnoc-site/
├── app/
│   ├── layout.tsx              # 글로벌 레이아웃 (헤더·푸터·폰트)
│   ├── page.tsx                # /
│   ├── about/
│   │   ├── page.tsx
│   │   └── origin/page.tsx
│   ├── manifesto/page.tsx
│   ├── services/page.tsx
│   ├── cases/page.tsx
│   ├── process/page.tsx
│   ├── faq/page.tsx
│   ├── clients/
│   │   └── criteria/page.tsx
│   ├── tools/
│   │   ├── diagnosis/page.tsx
│   │   └── simulator/page.tsx
│   ├── contact/page.tsx
│   ├── legal/
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── api/
│   │   └── lead/route.ts       # POST 핸들러
│   ├── robots.ts               # robots.txt 자동 생성
│   ├── sitemap.ts              # sitemap.xml 자동 생성
│   ├── not-found.tsx           # 404
│   └── error.tsx               # 500
├── components/
│   ├── ui/                     # 디자인 시스템 컴포넌트 (Button, Card, ...)
│   ├── layout/                 # Header, Footer, Container
│   ├── sections/               # 페이지 섹션 단위 컴포넌트
│   ├── diagnosis/              # 자가 진단 (참조 구현 토큰화 재구성)
│   └── simulator/              # 시뮬레이터 (참조 구현 토큰화 재구성)
├── lib/
│   ├── analytics.ts            # 이벤트 트래킹 헬퍼
│   ├── resend.ts               # 이메일 발송
│   ├── slack.ts                # Slack webhook
│   ├── validation.ts           # zod 스키마
│   └── seo.ts                  # JSON-LD 생성 헬퍼
├── styles/
│   └── globals.css             # CSS variables (디자인 시스템 토큰)
├── content/                    # MDX 콘텐츠 (Phase 2)
├── public/
│   ├── fonts/                  # self-host 폰트 (선택)
│   ├── images/                 # 케이스 이미지 등
│   └── og/                     # OG 이미지
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md
└── STACK-DECISION.md           # codex가 최종 스택 결정 후 작성
```

## 6. 배포

- **호스팅**: Vercel (메인 추천)
- **대안**: Cloudflare Pages, Netlify
- **도메인 DNS**: Cloudflare (DDoS 보호, 캐싱)
- **메일 도메인 인증**: Resend 가이드 따라 SPF·DKIM·DMARC 셋업
- **분석**: Vercel Analytics 무료 티어로 시작

## 7. STACK-DECISION.md 템플릿 (codex가 채울 것)

빌드 시작 시 저장소 루트에 다음 형식으로 기록:

```markdown
# Stack Decision

- 결정자: codex
- 결정 일시: YYYY-MM-DD
- 프레임워크: [선택한 후보 + 버전]
- 호스팅: [Vercel / Cloudflare / etc.]
- 라이브러리 결정:
  - 스타일링: [...]
  - 차트: [...]
  - 폼: [...]
  - 아이콘: [...]
  - 분석: [...]
- 환경변수: `.env.local.example` 참조
- 비고: [후보 A 대신 B 선택 시 이유, 등]
```

## 8. codex 의사결정 가이드

다음 순서로 판단:

1. **사용자 환경 확인** — Node.js 버전, 패키지 매니저 (npm/pnpm/yarn) 기본값
2. **후보 A vs B 선택** — Phase 1 12개 페이지가 거의 정적이므로 둘 다 가능. Recharts 사용량 + 도구 페이지 복잡도 고려하면 후보 A가 안정적
3. **결정 후 STACK-DECISION.md 작성**
4. **빌드 시작** — `01-brand-context.md`, `02-design-system.md`, `03-site-prd.md`를 다시 한 번 통째로 읽고 시작
