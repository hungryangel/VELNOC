import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const page = readFileSync("app/page.tsx", "utf8");
const casesPage = readFileSync("app/cases/page.tsx", "utf8");
const aboutPage = readFileSync("app/about/page.tsx", "utf8");
const faqPage = readFileSync("app/faq/page.tsx", "utf8");
const servicesPage = readFileSync("app/services/page.tsx", "utf8");
const layout = readFileSync("app/layout.tsx", "utf8");
const footer = readFileSync("components/layout/Footer.tsx", "utf8");
const styles = readFileSync("styles/globals.css", "utf8");
const content = readFileSync("lib/content.ts", "utf8");
const site = readFileSync("lib/site.tsx", "utf8");
const allText = [page, casesPage, aboutPage, faqPage, servicesPage, content, site].join("\n");

const masterCaseTitles = [
  "홍삼 전문점 (가칭: 정선당)",
  "비공개 금융교육 플랫폼",
  "돼지농장 운영 OS",
  "파나요"
];

const masterFaqQuestions = [
  "다른 곳보다 비싸지 않나요?",
  "검색·AI 노출이 우리 업종에도 정말 필요한가요?",
  "벨녹(VELNOC)은 왜 대규모 조직이 아닌 소수 정예 팀 단위로 프로젝트를 진행하나요?",
  "구독은 최소 몇 개월부터인가요?",
  "계약 후 결과가 기대만큼 안 나오면요?",
  "진단 후 벨녹과 안 맞는 사업으로 분류되면요?"
];

test("case names are anonymized and consistent across global content", () => {
  assert.doesNotMatch(allText, /AlphaBridge|알파브릿지|선물거래/);

  for (const title of masterCaseTitles) {
    assert.match(content, new RegExp(title.replace(/[()]/g, "\\$&")));
  }

  assert.match(page, /import \{[^}]*caseItems[^}]*\} from "@\/lib\/content"/);
  assert.match(content, /id:\s*"case-jeongseondang"/);
  assert.match(content, /id:\s*"case-finedu"/);
  assert.match(content, /id:\s*"case-farmos"/);
  assert.match(content, /id:\s*"case-panayo"/);
  assert.equal((content.match(/disclosure:/g) || []).length, 4);
  assert.match(page, /케이스 전체 보기 →/);
  assert.match(page, /href="\/cases"/);
});

test("faq data is a single source shared by home and faq page", () => {
  assert.ok(existsSync("lib/faq.tsx"));
  const faqSource = readFileSync("lib/faq.tsx", "utf8");

  assert.match(page, /import \{ faqItems \} from "@\/lib\/faq"/);
  assert.match(faqPage, /from "@\/lib\/faq"/);
  assert.doesNotMatch(content, /export const faqItems/);
  assert.doesNotMatch(faqPage, /1\.5~2배|AEO·GEO|1인 사업자라고 들었는데/);
  assert.match(faqPage, /계약·진단·결과에 대해 자주 받는 질문들을 정리했습니다\./);
  assert.match(faqPage, /내 단계 진단 시작 →/);
  assert.match(faqPage, /이미 단계가 명확하시다면 → 상담 시작/);
  assert.equal((faqSource.match(/\n\s+q:/g) || []).length, 6);

  for (const question of masterFaqQuestions) {
    assert.match(faqSource, new RegExp(question.replace(/[()]/g, "\\$&")));
  }

  const minimumCycleIndex = faqSource.indexOf("구독은 최소 몇 개월부터인가요?");
  const resultQuestionIndex = faqSource.indexOf("계약 후 결과가 기대만큼 안 나오면요?");
  assert.ok(minimumCycleIndex > -1);
  assert.ok(resultQuestionIndex > minimumCycleIndex);
});

test("service labels and plan details use explicit Korean naming", () => {
  assert.match(content, /automation:\s*"미포함"/);
  assert.doesNotMatch(content, /automation:\s*"—"/);
  assert.match(content, /STAGE 04~05 인용·신뢰 도달/);
  assert.match(content, /minCycle:\s*"최소 3개월부터"/);
  assert.match(content, /minCycle:\s*"최소 6개월부터"/);
  assert.match(content, /초기 셋업 1개월 \+ 운영 5개월/);
  assert.match(content, /초기 셋업 1~2개월 \+ 운영 4~5개월/);
  assert.match(page, /운영 사이클은 Pulse 3개월부터, Signal·Engine 6개월부터 시작합니다\./);
  assert.match(servicesPage, /운영 정책 — 모든 구독 공통/);
  assert.match(servicesPage, /운영 일시정지 가능/);
  assert.match(servicesPage, /월 단위 갱신/);
  assert.match(servicesPage, /Site 구매로 Seed 12개월을 마친/);
  assert.match(page, /벨녹 자가 진단 \(5분, 무료\)/);
  assert.match(page, /href: "\/tools\/diagnosis"/);
  assert.match(content, /name:\s*"VELNOC Site"/);
  assert.match(content, /Site · Retrofit — 기존 홈페이지·랜딩페이지 구조 정비 80~150만원 \(1회\)/);
  assert.match(content, /name:\s*"Seed"/);
  assert.match(content, /Site 구매자 12개월 자동 부여/);
  assert.match(content, /정기 코칭, 콘텐츠 제작, 키워드 전략은 Pulse부터\./);
  assert.match(site, /label:\s*"구독"/);
  assert.doesNotMatch(site, /label:\s*"Subscribe"/);
  assert.doesNotMatch(site, /AlphaBridge/);
  assert.doesNotMatch(site, /왜 1\.5~2배 가격인가/);
});

test("root metadata includes the requested Naver site verification tag", () => {
  assert.match(layout, /verification:\s*\{\s*other:\s*\{\s*"naver-site-verification":\s*"e45f8581b78d59204eda9eecc7f180ef6bed5e76"/s);
});

test("root layout renders global JSON-LD in the document head", () => {
  assert.match(layout, /<head>\s*<JsonLd data=\{organizationJsonLd\(\)\} \/>\s*<\/head>/);
});

test("global JSON-LD connects the existing Organization to a WebSite graph", () => {
  assert.match(site, /"@graph":\s*\[/);
  assert.match(site, /"@type":\s*"Organization"/);
  assert.match(site, /"@id":\s*"https:\/\/velnoc\.com\/#org"/);
  assert.match(site, /name:\s*"VELNOC"/);
  assert.match(site, /alternateName:\s*"벨녹"/);
  assert.match(site, /url:\s*SITE_URL/);
  assert.match(site, /logo:\s*`\$\{SITE_URL\}\/logo\.png`/);
  assert.match(site, /founder:\s*\{[\s\S]*"@type":\s*"Person"[\s\S]*name:\s*"안상효"[\s\S]*jobTitle:\s*"Founder & Business Architect"[\s\S]*\}/);
  assert.match(site, /foundingDate:\s*"2026"/);
  assert.match(site, /description:\s*"벨녹은 SEO·AEO·GEO와 운영 자동화를 묶어 매월 자라는 비즈니스 시스템을 설계하는 통합형 아키텍트입니다\."/);
  assert.match(site, /"@type":\s*"WebSite"/);
  assert.match(site, /"@id":\s*"https:\/\/velnoc\.com\/#website"/);
  assert.match(site, /url:\s*"https:\/\/velnoc\.com"/);
  assert.match(site, /name:\s*"VELNOC"/);
  assert.match(site, /inLanguage:\s*"ko-KR"/);
  assert.match(site, /publisher:\s*\{\s*"@id":\s*"https:\/\/velnoc\.com\/#org"\s*\}/);
});

test("footer exposes VELNOC Works as a separated service link", () => {
  const serviceGroup = site.match(/title:\s*"서비스"[\s\S]*?title:\s*"회사"/)?.[0] ?? "";
  const contactGroup = site.match(/title:\s*"연락"[\s\S]*?\n\s+\}\n\];/)?.[0] ?? "";

  assert.match(serviceGroup, /label:\s*"벨녹웍스 — 홈페이지 제작"/);
  assert.match(serviceGroup, /href:\s*"https:\/\/site\.velnoc\.com"/);
  assert.match(serviceGroup, /separateBefore:\s*true/);
  assert.doesNotMatch(contactGroup, /벨녹웍스/);
  assert.match(footer, /link\.separateBefore \? "footer-link footer-link-separated" : "footer-link"/);
  assert.match(styles, /\.footer-link-separated\s*\{[\s\S]*border-top:\s*0\.5px solid var\(--velnoc-divider\)/);
  assert.doesNotMatch(site, /nofollow/);
});
