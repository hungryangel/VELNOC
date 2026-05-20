# Build Notes / 결정 보류

- `03-site-prd.md`는 성공 기준에서 12개 페이지라고 쓰지만, `04-information-architecture.md`와 `05-page-content-sheets.md`는 `/legal/privacy`, `/legal/terms`를 별도 라우트로 요구합니다. 빌드는 실제 IA 라우트 기준으로 14개 라우트를 포함합니다.
- `/legal/privacy`, `/legal/terms`는 Phase 1 placeholder이며 법무 검토가 필요합니다.
- Resend 발신 도메인, 운영자 이메일, Slack webhook, Kakao 채널 URL은 실제 운영 환경변수 입력이 필요합니다.
- 폰트 self-host는 최종 폰트 파일 또는 font package 확정 후 완전 검증해야 합니다. 현재 빌드는 CSS font stack과 외부 font URL 허용 CSP로 시작합니다.
- npm audit 기준 Next.js 14 계열 high 취약점 때문에 Next.js 16.2.6으로 상향했습니다. 다만 Next 내부 고정 `postcss@8.4.31`로 인한 moderate advisory는 남아 있으며, 현재 npm이 제시하는 자동 수정은 부정확한 breaking 경로라 적용하지 않았습니다.
