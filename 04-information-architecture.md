# 04 — Information Architecture

> **버전**: v1.0 / **최종 갱신**: 2026-05-18
> **상위 문서**: `03-site-prd.md`

---

## 1. Sitemap (Phase 1)

```
velnoc.com/
├── /                       (홈)
├── /about                  (About — 절제된 자기 소개)
├── /about/origin           (Origin Story — 장모님 홍삼 가게)
├── /manifesto              (Manifesto — Why)
├── /services               (4개 라인업: Subscribe + Site + Studio + OS)
├── /cases                  (4개 케이스: First Pilot, AlphaBridge, 돼지농장OS, 파나요)
├── /process                (진행 방식 4단계)
├── /faq                    (FAQ)
├── /clients/criteria       (받지 않는 의뢰 — 거절 기준 공개)
├── /tools/diagnosis        (자가 진단)
├── /tools/simulator        (ROI 시뮬레이터)
├── /contact                (Contact 폼)
└── /legal
    ├── /privacy            (개인정보처리방침)
    └── /terms              (이용약관)
```

총 **13개 페이지** (legal 2개 포함). 모두 SSG.

## 2. URL 명세

| URL | 라우트 종류 | 메타 |
|---|---|---|
| `/` | static | index, follow |
| `/about` | static | index, follow |
| `/about/origin` | static | index, follow |
| `/manifesto` | static | index, follow |
| `/services` | static | index, follow |
| `/cases` | static | index, follow |
| `/process` | static | index, follow |
| `/faq` | static | index, follow |
| `/clients/criteria` | static | index, follow |
| `/tools/diagnosis` | dynamic (client) | index, follow |
| `/tools/simulator` | dynamic (client) | index, follow |
| `/contact` | static + form | index, follow |
| `/legal/privacy` | static | noindex, follow |
| `/legal/terms` | static | noindex, follow |

**파라미터 규칙**
- `/tools/simulator?preset={A|B|C|D|E|F}&from=diagnosis` — 진단에서 진입
- `/contact?type={general|os|partner|press}` — 진입 컨텍스트
- 모든 쿼리는 캐노니컬 URL에 포함하지 않음 (`<link rel="canonical">`은 쿼리 제거 버전)

## 3. Global Navigation

### 3-1. 헤더 (모든 페이지)

```
[VELNOC 로고]                                   서비스  케이스  진단  시뮬레이터  [상담 시작 →]
```

| 항목 | 링크 | 비고 |
|---|---|---|
| VELNOC 로고 | `/` | 워드마크 또는 미니멀 심볼 |
| 서비스 | `/services` | — |
| 케이스 | `/cases` | — |
| 진단 | `/tools/diagnosis` | Primary 진입점 |
| 시뮬레이터 | `/tools/simulator` | — |
| 상담 시작 | `/contact` | Primary CTA 버튼 (오크 그린) |

**모바일**: 햄버거 메뉴. CTA 버튼은 상단에 sticky 유지.

**About·Manifesto·Process·FAQ·받지 않는 의뢰**는 헤더에 노출하지 않음. 푸터와 본문 내부 링크로만 접근.

### 3-2. 푸터 (모든 페이지)

```
─────────────────────────────────────────────────────────────
서비스                  회사                  도구              연락
─ Subscribe             ─ About               ─ 자가 진단        ─ Contact
─ Site                  ─ Origin Story        ─ ROI 시뮬레이터    ─ 카카오톡(외부)
─ Studio                ─ Manifesto                              
─ OS                    ─ Process                                
                        ─ 받지 않는 의뢰                           
                        ─ FAQ                                    
─────────────────────────────────────────────────────────────
VELNOC — 보이게 만들고, 흐르게 설계합니다.
© 2026 VELNOC | 개인정보처리방침 | 이용약관
─────────────────────────────────────────────────────────────
```

## 4. 메타 정보 (페이지별)

> 모든 메타는 `05-page-content-sheets.md`에 페이지별로 정확한 카피가 있다. 본 표는 구조 명세.

| 페이지 | `<title>` 패턴 | description 가이드 |
|---|---|---|
| `/` | `VELNOC — 보이게 만들고, 흐르게 설계합니다.` | 1줄: SEO·AEO·GEO + 운영 자동화 + 매월 자라는 시스템 |
| `/about` | `About — VELNOC` | 안상효 대표 + 통합형 비즈니스 아키텍트 + 검증된 자산 |
| `/about/origin` | `Origin Story — 진짜가 가짜에게 다시 이기는 게임` | 장모님 홍삼 가게 + 정직한 진짜 + GEO 윤리적 기회 |
| `/manifesto` | `Manifesto — VELNOC` | 5가지 원칙 + 미션 + 진짜 평판 번역 |
| `/services` | `서비스 — Subscribe·Site·Studio·OS` | 4개 라인업 + 가격 + 적합 단계 |
| `/cases` | `케이스 — VELNOC` | First Pilot·AlphaBridge·돼지농장OS·파나요 |
| `/process` | `진행 방식 — 무료 진단부터 첫 30일 win까지` | 4단계 + 환불 정책 |
| `/faq` | `FAQ — VELNOC` | 5개 핵심 질문 |
| `/clients/criteria` | `받지 않는 의뢰 — VELNOC` | Hard No 기준 6개 + 미션 우선 |
| `/tools/diagnosis` | `자가 진단 — 5분 안에 AI 검색 시대 위치 확인` | 무료 자가 진단 + A~F 분류 + 추천 패키지 |
| `/tools/simulator` | `ROI 시뮬레이터 — 5년 후 광고비 vs 자산` | 5년 비교 + 자산 누적 + 인플레이션 반영 |
| `/contact` | `상담 시작 — VELNOC` | 무료 30분 상담 + 첫 응답 24h |

## 5. JSON-LD schema.org 마크업

### 5-1. 모든 페이지 공통 (`Organization`)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VELNOC",
  "alternateName": "벨녹",
  "url": "https://velnoc.com",
  "logo": "https://velnoc.com/logo.png",
  "founder": {
    "@type": "Person",
    "name": "안상효",
    "jobTitle": "Founder & Business Architect"
  },
  "foundingDate": "2026",
  "description": "벨녹은 SEO·AEO·GEO와 운영 자동화를 묶어 매월 자라는 비즈니스 시스템을 설계하는 통합형 아키텍트입니다.",
  "sameAs": []
}
```

`sameAs`는 운영 계정(LinkedIn, GitHub, 카카오채널 등) 확보되는 대로 추가.

### 5-2. About / Origin (`Person`)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "안상효",
  "jobTitle": "Founder & Business Architect",
  "worksFor": { "@type": "Organization", "name": "VELNOC" },
  "knowsAbout": [
    "Search Engine Optimization",
    "Answer Engine Optimization",
    "Generative Engine Optimization",
    "Business Automation",
    "Industry-specific Operating Systems"
  ]
}
```

### 5-3. Services (`Service` × 4)

각 서비스 라인업마다 별도 `Service` 노드.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "VELNOC Subscribe — Pulse",
  "provider": { "@type": "Organization", "name": "VELNOC" },
  "description": "검색에 막 보이기 시작하는 단계 — SEO·AEO·GEO 기본 + 모니터링",
  "offers": {
    "@type": "Offer",
    "price": "190000",
    "priceCurrency": "KRW",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "190000",
      "priceCurrency": "KRW",
      "unitText": "MONTH"
    }
  }
}
```

같은 패턴으로 Signal(59만원), Engine(169만원), Site(100~300만원), Studio(300~1000만원), OS(1000만원~) 노드 생성.

### 5-4. FAQ Page

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "다른 웹에이전시 견적의 1.5~2배 수준인데 왜 그런가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "단발 제작이 아니라 매월 자라는 시스템을 설계하기 때문입니다. ..."
      }
    }
    // ... 5개 Q&A 전부
  ]
}
```

### 5-5. Cases (`CreativeWork` 또는 `Project`)

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "돼지농장OS",
  "creator": { "@type": "Organization", "name": "VELNOC" },
  "dateCreated": "2026",
  "description": "한 산업의 운영 방식 전체를 다시 짜는 OS 프로젝트. 6개월 진행 중."
}
```

## 6. robots.txt

```
# robots.txt for velnoc.com
# AI 크롤러를 적극적으로 환영합니다 — 벨녹은 GEO 자산을 만드는 회사입니다

User-agent: *
Allow: /
Disallow: /api/
Disallow: /legal/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: cohere-ai
Allow: /

Sitemap: https://velnoc.com/sitemap.xml
```

## 7. sitemap.xml

빌드 시 자동 생성. 13개 페이지 모두 포함, `legal/*` 제외.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://velnoc.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://velnoc.com/about</loc><priority>0.8</priority></url>
  <url><loc>https://velnoc.com/about/origin</loc><priority>0.7</priority></url>
  <url><loc>https://velnoc.com/manifesto</loc><priority>0.7</priority></url>
  <url><loc>https://velnoc.com/services</loc><priority>0.9</priority></url>
  <url><loc>https://velnoc.com/cases</loc><priority>0.8</priority></url>
  <url><loc>https://velnoc.com/process</loc><priority>0.6</priority></url>
  <url><loc>https://velnoc.com/faq</loc><priority>0.5</priority></url>
  <url><loc>https://velnoc.com/clients/criteria</loc><priority>0.6</priority></url>
  <url><loc>https://velnoc.com/tools/diagnosis</loc><priority>0.9</priority></url>
  <url><loc>https://velnoc.com/tools/simulator</loc><priority>0.8</priority></url>
  <url><loc>https://velnoc.com/contact</loc><priority>0.8</priority></url>
</urlset>
```

## 8. 404 / 500 페이지

- `/404` — "찾으시는 페이지가 사라졌네요" + 홈/진단/시뮬레이터 3 링크
- `/500` — "잠시 후 다시 시도해주세요" + Contact 링크 + 새로고침 버튼
- 두 페이지 모두 Default 모드, 테라코타·Display 사용 금지

## 9. 사용자 동선 (Primary Flows)

### 9-1. 메인 진입 → 진단 → 시뮬레이터 → 상담

```
/ (홈)
  → /tools/diagnosis (Hero CTA)
  → 결과 화면 (A~F 분류)
  → /tools/simulator?preset={X}&from=diagnosis (B~F만)
  → 결과 화면 (5년 비교 + 자산 누적)
  → /contact (CTA)
  → 폼 제출 → Resend + Slack
```

### 9-2. 직접 진입 → 케이스 확인 → 상담

```
/ (홈)
  → /cases
  → /services
  → /contact
```

### 9-3. 거절 검토 (자기 검증)

```
/ 또는 어디든
  → /clients/criteria (받지 않는 의뢰)
  → 자기 판단 → /contact 또는 이탈
```

## 10. 캐싱·재검증

- 모든 정적 페이지: edge 캐시 1년 + `s-maxage=86400` (하루)
- 도구 페이지: edge 캐시 무효 (`Cache-Control: no-store`)
- API (`/api/lead`): 캐시 없음
- 이미지: `immutable, max-age=31536000`
- 폰트: `immutable, max-age=31536000`
