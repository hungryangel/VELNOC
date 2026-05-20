# VELNOC Site

VELNOC Phase 1 공식 사이트 빌드입니다. `00-README.md`부터 `07-handoff-checklist.md`까지의 패키지 명세를 기준으로 Next.js App Router + Vercel 구조로 구현합니다.

## Setup

```bash
npm install
npm run dev
```

로컬 주소:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment Variables

`.env.local.example`을 참고해 `.env.local`을 만듭니다.

필수 운영 변수:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_TO_OPERATOR`
- `SLACK_WEBHOOK_URL`
- `NEXT_PUBLIC_SITE_URL`

선택 변수:

- `NEXT_PUBLIC_KAKAO_CHANNEL_URL`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Phase 1 Routes

- `/`
- `/about`
- `/about/origin`
- `/manifesto`
- `/services`
- `/cases`
- `/process`
- `/faq`
- `/clients/criteria`
- `/tools/diagnosis`
- `/tools/simulator`
- `/contact`
- `/legal/privacy`
- `/legal/terms`

`/404`, `/500`, `robots.txt`, `sitemap.xml`, `/api/lead`도 포함합니다.

## Rollback

Vercel 배포 후 문제가 생기면 Vercel Dashboard의 Deployments에서 이전 deployment를 Promote합니다. 환경변수 변경으로 생긴 문제는 Project Settings에서 직전 값으로 되돌린 뒤 재배포합니다.
