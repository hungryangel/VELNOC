# 07 — Handoff Checklist

> **버전**: v1.0 / **최종 갱신**: 2026-05-18
> **본 문서의 사용법**: codex가 빌드 시작 전, 중간 체크포인트, 출시 직전에 본 체크리스트를 그대로 따라 확인한다. 모든 항목이 ✅이 되어야 Phase 1 출시.

---

## A. 빌드 시작 전 (Pre-build)

### A-1. 문서 숙지
- [ ] `00-README.md` 한 번 읽음
- [ ] `01-brand-context.md` 통째로 읽음
- [ ] `02-design-system.md` 통째로 읽음
- [ ] `03-site-prd.md` 통째로 읽음
- [ ] `04-information-architecture.md` 통째로 읽음
- [ ] `05-page-content-sheets.md` 12개 페이지 카피 확인
- [ ] `06-tech-stack-recommendations.md` 읽고 스택 결정

### A-2. 환경 확인
- [ ] Node.js 20+ 설치 확인
- [ ] 패키지 매니저 결정 (pnpm 권장)
- [ ] Git 저장소 초기화
- [ ] GitHub repo 생성 (private 권장 Phase 1)
- [ ] `.gitignore` 설정 (`.env.local`, `node_modules`, `.next`, `out` 등)

### A-3. 결정 기록
- [ ] `STACK-DECISION.md` 작성 후 커밋
- [ ] `README.md` 최소 셋업 가이드 작성
- [ ] `.env.local.example` 작성

### A-4. 자산 확보
- [ ] `assets/velnoc-diagnosis-v3.jsx` 확인 또는 사용자에게 첨부 요청
- [ ] `assets/velnoc-simulator-v7.jsx` 확인 또는 사용자에게 첨부 요청
- [ ] 자산 없으면 `assets/ASSETS-README.md`의 안내대로 진행

---

## B. 빌드 중 체크포인트 (Mid-build)

### B-1. 디자인 시스템 적용
- [ ] CSS variables 등록 완료 (`styles/globals.css`)
- [ ] Tailwind theme.extend로 토큰 연결 완료
- [ ] 폰트 self-host 또는 next/font 셋업 완료
- [ ] 모든 컴포넌트가 토큰만 사용 (hex 직접 입력 0건)
- [ ] Display Mode 페이지 외 Display 타이포 사용 0건
- [ ] 테라코타 사용 페이지가 디자인 시스템 PART 5 표와 일치

### B-2. 페이지 빌드
- [ ] `/` 빌드 완료, Lighthouse 90+ 확인
- [ ] `/about`, `/about/origin` 빌드 완료 (Origin은 Editorial 모드)
- [ ] `/manifesto` 빌드 완료 (Editorial 모드)
- [ ] `/services` 빌드 완료 (3-tier pricing card)
- [ ] `/cases` 빌드 완료 (4개 케이스, anchor 동작)
- [ ] `/process` 빌드 완료
- [ ] `/faq` 빌드 완료 (FAQPage schema 마크업)
- [ ] `/clients/criteria` 빌드 완료 (Editorial 모드, Hard No/Strong Yes 표)
- [ ] `/contact` 빌드 완료 (폼 동작)
- [ ] `/legal/privacy`, `/legal/terms` 빌드 완료 (noindex)
- [ ] `/404`, `/500` 빌드 완료

### B-3. 도구 빌드
- [ ] `/tools/diagnosis` 빌드 완료
  - 4 Step 진행 동작
  - 도메인 분석 시뮬레이션 동작
  - A~F 분류 동작
  - A 분류 단독 화면 동작
  - 이메일 캡처 → Resend + Slack 동작
  - B~F 분류 → 시뮬레이터 진입 CTA 동작
- [ ] `/tools/simulator` 빌드 완료
  - `?preset=` 쿼리 적용 동작
  - 4 Step 입력 동작
  - 5년 비교 그래프 동작
  - 자산 누적 시각화 동작
  - 인플레이션 토글 동작
  - 결과 Display Mode 결정타 카피 표시
  - 이메일 캡처 → Resend + Slack 동작

### B-4. SEO·AEO·GEO
- [ ] 12개 페이지 모두 고유 `<title>`, `<meta description>`
- [ ] `<link rel="canonical">` 모든 페이지
- [ ] Open Graph 메타 모든 페이지
- [ ] `robots.txt` AI 크롤러 허용 명시 (`04-information-architecture.md` PART 6)
- [ ] `sitemap.xml` 자동 생성
- [ ] JSON-LD: Organization (모든 페이지)
- [ ] JSON-LD: Person (About)
- [ ] JSON-LD: Service × 6 (Services)
- [ ] JSON-LD: FAQPage (FAQ)
- [ ] JSON-LD: CreativeWork × 4 (Cases)
- [ ] Google Rich Results Test 통과

### B-5. 백엔드 (`/api/lead`)
- [ ] zod 스키마 검증 동작
- [ ] Honeypot 동작
- [ ] Rate limit 동작 (IP당 분당 5회)
- [ ] Resend 사용자 자동 회신 발송 확인
- [ ] Resend 운영자 알림 메일 확인
- [ ] Slack webhook 알림 확인
- [ ] 실패 시 fallback 동작 확인

### B-6. 분석
- [ ] Vercel Analytics 또는 PostHog 셋업
- [ ] `page_view` 이벤트 동작
- [ ] `diagnosis_start`, `diagnosis_step_complete`, `diagnosis_result` 동작
- [ ] `simulator_start`, `simulator_result` 동작
- [ ] `lead_submit` 동작
- [ ] `cta_click` 동작

### B-7. 접근성
- [ ] 키보드만으로 모든 페이지 네비게이션 가능
- [ ] 폼 라벨 명시
- [ ] 슬라이더 키보드 동작
- [ ] 포커스 링 표시
- [ ] 색만으로 정보 전달 0건
- [ ] alt 텍스트 모든 이미지
- [ ] Lighthouse Accessibility = 100

### B-8. 반응형
- [ ] 320px (iPhone SE) 모든 페이지 깨지지 않음
- [ ] 768px (iPad) 모든 페이지 정상
- [ ] 1024px (데스크탑) 모든 페이지 정상
- [ ] 1440px+ 모든 페이지 정상

---

## C. 출시 직전 (Pre-launch)

### C-1. 도메인·DNS
- [ ] `velnoc.com` Vercel 프로젝트에 연결
- [ ] `www.velnoc.com` → `velnoc.com` 리다이렉트
- [ ] `velnocworks.com` → `velnoc.com` 301 permanent redirect
- [ ] Cloudflare 또는 호스팅사 DNS 설정 완료
- [ ] HTTPS 인증서 발급 확인

### C-2. 메일 인프라
- [ ] Resend 도메인 인증 완료 (`velnoc.com`)
- [ ] SPF 레코드 추가
- [ ] DKIM 레코드 추가
- [ ] DMARC 레코드 추가 (`p=quarantine` 권장)
- [ ] 실제 메일 발송 테스트 (스팸함 들어가지 않는지 확인)

### C-3. 폼 종단 테스트
- [ ] 자가 진단 결과에서 이메일 캡처 → 실제 메일 수신 확인
- [ ] 시뮬레이터 결과에서 이메일 캡처 → 실제 메일 수신 확인
- [ ] Contact 폼 제출 → 실제 메일 + Slack 수신 확인
- [ ] Rate limit 동작 확인 (의도적 5회 초과)
- [ ] Honeypot 동작 확인 (hidden 필드 채워서 제출)

### C-4. 검색엔진 등록
- [ ] Google Search Console 등록 + sitemap 제출
- [ ] Naver Search Advisor 등록 + sitemap 제출
- [ ] Bing Webmaster Tools 등록

### C-5. 최종 QA
- [ ] Lighthouse 모바일 Performance ≥ 90
- [ ] Lighthouse Accessibility = 100
- [ ] Lighthouse SEO = 100
- [ ] Lighthouse Best Practices ≥ 95
- [ ] 4개 주요 브라우저 확인 (Chrome, Safari, Firefox, Edge)
- [ ] 모바일 Safari 확인 (iOS 사용자 비중 큼)
- [ ] Korean 폰트 렌더링 모든 페이지에서 정상
- [ ] 모든 외부 링크 동작 (카카오톡 채널 URL 등)

### C-6. 분석 검증
- [ ] 페이지 진입 시 이벤트 발화 확인
- [ ] 폼 제출 시 `lead_submit` 발화 확인
- [ ] CTA 클릭 시 `cta_click` 발화 확인

### C-7. 백업·롤백 준비
- [ ] 모든 환경변수 안전한 저장소에 백업 (1Password 등)
- [ ] 롤백 절차 README에 작성
- [ ] Vercel 이전 deployment promote 가능 확인

---

## D. 출시 직후 (Post-launch, 24시간)

- [ ] 자가 진단 1회 직접 완주 (운영자 본인)
- [ ] 시뮬레이터 1회 직접 완주
- [ ] Contact 폼 1회 직접 제출
- [ ] 모든 메일 도착 확인
- [ ] Slack 알림 모두 확인
- [ ] Vercel Analytics 첫 데이터 도달 확인
- [ ] Google Search Console 인덱싱 시작 확인
- [ ] ChatGPT/Perplexity에 `site:velnoc.com` 검색 시도 (인덱싱 시작 전이라도 일부 표시될 수 있음)

---

## E. 빌드 후 사용자에게 핸드오프

codex는 빌드 완료 시 사용자(안상효 대표)에게 다음을 보고:

1. **STACK-DECISION.md** 최종 내용
2. **빌드된 페이지 목록 + URL**
3. **환경변수 셋업 필요 항목** (Resend·Slack)
4. **Vercel 배포 URL**
5. **Google Search Console / Naver / Bing 등록 가이드**
6. **Phase 2로 미룬 항목 리스트** — 본 패키지의 `03-site-prd.md` PART 2-2 그대로
7. **빌드 중 결정 보류된 항목 리스트** — 본 문서 빌드 중 추가
