import { useState, useMemo, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────
   VELNOC 자가 진단 도구 MVP v3
   - 등급 스펙트럼 A~F → STAGE.01~05 (A 분리)
   - A 분류 별도 화면 (성적표 인식 제거)
   - "벨녹이 다릅니다" 카피 구체화
   - A 분류 CTA → 채널별 전문가 안내 카드
   ───────────────────────────────────────────────────────── */

const FONT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; padding: 0; }
  .vn-root { font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', system-ui, sans-serif; }
  .vn-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
  .vn-fade-in { animation: vnFadeIn 0.4s ease forwards; }
  @keyframes vnFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .vn-bar-fill { transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
  .vn-btn-hover:hover { opacity: 0.88; }
  .vn-select-btn { transition: all 0.12s ease; }
  .vn-select-btn:hover { filter: brightness(1.15); }
  .vn-grade-badge { animation: vnPulse 2.5s ease-in-out infinite; }
  @keyframes vnPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.05); } 50% { box-shadow: 0 0 0 12px rgba(255,255,255,0); } }
  .vn-input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: white; transition: border-color 0.15s; }
  .vn-input:focus { outline: none; border-color: rgba(255,255,255,0.3); }
  .vn-input::placeholder { color: rgba(255,255,255,0.22); }
  .vn-progress-segment { transition: background-color 0.4s ease; }
  .vn-scroll { overflow-y: auto; scrollbar-width: none; }
  .vn-scroll::-webkit-scrollbar { display: none; }
  .vn-card-hover { transition: all 0.18s ease; cursor: pointer; }
  .vn-card-hover:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.25); transform: translateY(-2px); }
  .vn-spin { animation: vnSpin 1.4s linear infinite; }
  @keyframes vnSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .vn-dot-pulse { animation: vnDotPulse 1.4s ease-in-out infinite; }
  @keyframes vnDotPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
`;

/* ─────────────────────────────────────────────────────────
   설문 데이터 (Step 1~4)
   ───────────────────────────────────────────────────────── */
const STEP_DATA = [
  {
    stepNum: 1,
    title: "사업 기본 정보",
    sub: "어떤 사업을 운영하고 계신가요?",
    icon: "01",
    questions: [
      {
        id: "industry",
        label: "주요 업종을 선택해주세요",
        type: "single",
        options: [
          { label: "소매 판매 (온·오프라인)", value: "retail" },
          { label: "F&B / 식음료", value: "fnb" },
          { label: "전문 서비스 (법무·세무·의료·컨설팅)", value: "professional" },
          { label: "교육 · 코칭 · 강의", value: "education" },
          { label: "B2B 서비스 · 제품", value: "b2b" },
          { label: "산업 특화 (제조·농업·물류·건설)", value: "industrial" },
        ],
      },
      {
        id: "duration",
        label: "사업 운영 기간은?",
        type: "single",
        options: [
          { label: "1년 미만", value: "u1" },
          { label: "1 ~ 3년", value: "1_3" },
          { label: "3 ~ 7년", value: "3_7" },
          { label: "7년 이상", value: "o7" },
        ],
      },
      {
        id: "revenue",
        label: "월 평균 매출 구간",
        sublabel: "선택사항 · 정확도 향상을 위해 알려주시면 좋아요",
        type: "single",
        optional: true,
        options: [
          { label: "500만원 미만", value: "low" },
          { label: "500만 ~ 2,000만원", value: "mid" },
          { label: "2,000만 ~ 1억원", value: "high" },
          { label: "1억원 이상", value: "very_high" },
          { label: "답변하지 않겠습니다", value: "skip" },
        ],
      },
    ],
  },
  {
    stepNum: 2,
    title: "디지털 자산 점검",
    sub: "현재 어떤 채널을 갖고 계신가요?",
    icon: "02",
    questions: [
      {
        id: "website",
        label: "현재 자사 홈페이지 상태는?",
        type: "single",
        options: [
          { label: "홈페이지 없음", value: "none" },
          { label: "외부 플랫폼만 사용 (스마트스토어·네이버예약 등)", value: "platform" },
          { label: "자사 사이트 있음 (기본 수준)", value: "basic" },
          { label: "자사 사이트 + 블로그/콘텐츠 정기 발행", value: "active" },
        ],
      },
      {
        id: "channel",
        label: "주된 매출 채널을 모두 선택해주세요",
        sublabel: "벨녹 서비스 적합 여부를 판단하는 핵심 문항입니다",
        type: "multi",
        options: [
          { label: "자사 웹사이트", value: "own" },
          { label: "오프라인 직접 방문 / B2B 계약", value: "offline" },
          { label: "마켓플레이스 (쿠팡·네이버쇼핑·11번가 등)", value: "marketplace" },
          { label: "배달앱 (배달의민족·요기요 등)", value: "delivery" },
          { label: "SNS DM 직접 주문 (인스타·카카오채널)", value: "sns_dm" },
        ],
      },
      {
        id: "sns",
        label: "SNS 콘텐츠 운영 현황은?",
        type: "single",
        options: [
          { label: "운영하지 않음", value: "none" },
          { label: "간헐적 (월 1~2회 이하)", value: "occasional" },
          { label: "정기적 (주 1회 이상)", value: "regular" },
        ],
      },
    ],
  },
  {
    stepNum: 3,
    title: "마케팅 · 검색 경험",
    sub: "지금까지 어떤 방식으로 알려왔나요?",
    icon: "03",
    questions: [
      {
        id: "ads",
        label: "광고 집행 경험은?",
        type: "single",
        options: [
          { label: "광고를 진행한 적 없음", value: "none" },
          { label: "직접 진행 (메타·구글 셀프 광고)", value: "self" },
          { label: "대행사를 통해 진행한 적 있음", value: "agency" },
        ],
      },
      {
        id: "seo_practice",
        label: "검색 노출 관련 작업 경험은?",
        type: "single",
        options: [
          { label: "해본 적 없음 / 관심 없었음", value: "none" },
          { label: "가끔 직접 검색해서 순위 확인", value: "check" },
          { label: "정기적으로 SEO 작업·순위 관리 진행", value: "active" },
        ],
      },
      {
        id: "agency_sat",
        label: "대행사 활용 결과 만족도는?",
        sublabel: "대행사 이용 경험이 있는 경우에만 답해주세요",
        type: "single",
        optional: true,
        showIf: (a) => a.ads === "agency",
        options: [
          { label: "만족스러운 결과를 얻었다", value: "satisfied" },
          { label: "보통 / 애매했다", value: "neutral" },
          { label: "불만족 — 돈만 쓰고 결과 없었다", value: "unsatisfied" },
        ],
      },
    ],
  },
  {
    stepNum: 4,
    title: "AI 검색 가시성",
    sub: "AI 시대의 검색, 어디까지 알고 계신가요?",
    icon: "04",
    questions: [
      {
        id: "seo_know",
        label: "SEO(검색엔진 최적화)를 얼마나 알고 계신가요?",
        type: "single",
        options: [
          { label: "처음 듣는다", value: "0" },
          { label: "들어봤지만 잘 모른다", value: "1" },
          { label: "알고 있고 직접 적용하고 있다", value: "2" },
        ],
      },
      {
        id: "aeo_geo",
        label: "AEO(AI 답변 최적화) · GEO(AI 검색 최적화)를 들어보셨나요?",
        type: "single",
        options: [
          { label: "둘 다 처음 듣는다", value: "0" },
          { label: "들어봤지만 잘 모른다", value: "1" },
          { label: "알고 있고 우리 사업에 중요하다고 느낀다", value: "2" },
        ],
      },
      {
        id: "ai_search",
        label: "ChatGPT · Perplexity 같은 AI 검색에서 본인 사업을 검색해보셨나요?",
        type: "single",
        options: [
          { label: "AI 검색 자체를 써본 적 없다", value: "0" },
          { label: "개인 용도로는 쓰지만 자사 검색은 안 했다", value: "1" },
          { label: "검색해봤는데 우리 사업이 안 나왔다", value: "2" },
          { label: "검색해봤고 일부 나왔다", value: "3" },
        ],
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────
   설문 스코어링 → A~F 분류
   ───────────────────────────────────────────────────────── */
function calcScore(answers) {
  const industrySpecial = ["professional", "b2b", "industrial"].includes(answers.industry);
  const highRevenue = answers.revenue === "very_high";

  const channels = answers.channel || [];
  const blockCount = channels.filter((c) =>
    ["marketplace", "delivery", "sns_dm"].includes(c)
  ).length;
  const channelBlock = blockCount >= 2;

  // 차단 유발 채널 식별 (A 분류 시 안내 라우팅용)
  const blockedChannels = channels.filter((c) =>
    ["marketplace", "delivery", "sns_dm"].includes(c)
  );

  const D = ({ none: 0, platform: 1, basic: 2, active: 3 })[answers.website] ?? 0;

  const snsM = ({ none: 0, occasional: 0, regular: 1 })[answers.sns] ?? 0;
  const adsM = ({ none: 0, self: 1, agency: 2 })[answers.ads] ?? 0;
  const M = Math.min(snsM + adsM, 3);

  const sp = ({ none: 0, check: 1, active: 2 })[answers.seo_practice] ?? 0;
  const sk = ({ "0": 0, "1": 0, "2": 1 })[answers.seo_know] ?? 0;
  const ag = ({ "0": 0, "1": 0, "2": 1 })[answers.aeo_geo] ?? 0;
  const ai = ({ "0": 0, "1": 0, "2": 1, "3": 2 })[answers.ai_search] ?? 0;
  const S = Math.min(sp + sk + ag + ai, 3);

  const dO = ({ u1: 0, "1_3": 1, "3_7": 1, o7: 2 })[answers.duration] ?? 0;
  const rO = ({ low: 0, mid: 0, high: 1, very_high: 1, skip: 0 })[answers.revenue] ?? 0;
  const O = Math.min(dO + rO, 2);

  const T = D + M + S + O;
  const sensitivity = answers.agency_sat === "unsatisfied";

  let grade;
  if (channelBlock)                                       grade = "A";
  else if (T >= 9 && (industrySpecial || highRevenue))    grade = "F";
  else if (T <= 2)                                        grade = "B";
  else if (T <= 5)                                        grade = "C";
  else if (T <= 7)                                        grade = "D";
  else if (T <= 9)                                        grade = "E";
  else                                                    grade = "F";

  return { grade, T, D, M, S, O, sensitivity, channelBlock, blockedChannels };
}

/* ─────────────────────────────────────────────────────────
   등급별 설정 — STAGE.01~05 + A 분리
   ───────────────────────────────────────────────────────── */
const VELNOC_DIFFERENCE = "벨녹은 SEO·AEO·GEO·운영 자동화를 하나의 시스템으로 묶습니다. 채널을 따로 굴리던 대행사와는 출발점부터 다릅니다.";

const GRADE_CONFIG = {
  A: {
    color: "#9ca3af", colorDim: "rgba(156,163,175,0.10)", borderColor: "rgba(156,163,175,0.20)",
    stage: null, // 스테이지 표기 없음 — 등급이 아닌 "다른 길"
    badgeLabel: "ALTERNATIVE PATH",
    name: "벨녹 영역 아님",
    tag: "솔직한 안내",
    headline: "지금은 벨녹보다 맞는 전문가가 있습니다",
    body: "플랫폼·마켓플레이스·배달앱 중심의 매출 구조에서는 SEO·AEO·GEO보다 각 플랫폼 내 최적화 전략이 훨씬 효과적입니다. 벨녹은 맞지 않는 고객께 솔직하게 말씀드립니다. 억지로 맞추는 계약은 하지 않습니다.",
    difference: VELNOC_DIFFERENCE,
    cta: "맞는 전문가 유형 알아보기",
    note: "선택하신 채널에 맞는 전문가 유형과 점검 항목을 안내해드립니다.",
    showEmail: false, ctaInvert: false, showAIBlock: false,
  },
  B: {
    color: "#60a5fa", colorDim: "rgba(96,165,250,0.10)", borderColor: "rgba(96,165,250,0.25)",
    stage: "01", badgeLabel: "STAGE.01",
    name: "시작 단계", tag: "Site + Pulse 추천",
    headline: "디지털 기반을 처음 만드는 단계입니다",
    body: "검색·AI 가시성을 논하기 전에 자사 채널(홈페이지)과 콘텐츠 기반이 먼저 필요합니다. VELNOC Site로 탄탄한 출발점을 만들고, Subscribe Pulse로 SEO 첫 발자국을 찍는 것을 추천합니다.",
    difference: VELNOC_DIFFERENCE,
    cta: "Subscribe Pulse 알아보기  ·  월 19만원",
    note: "사이트 제작부터 함께 시작하는 옵션도 있습니다.",
    showEmail: true, ctaInvert: true, showAIBlock: true,
  },
  C: {
    color: "#a78bfa", colorDim: "rgba(167,139,250,0.10)", borderColor: "rgba(167,139,250,0.25)",
    stage: "02", badgeLabel: "STAGE.02",
    name: "기본 확보 단계", tag: "Pulse 추천",
    headline: "기반은 있습니다. 이제 보이게 만들 차례입니다",
    body: "자사 사이트는 있지만 검색·AI 노출이 아직 충분하지 않은 단계입니다. SEO 정착과 AEO 입문을 월 단위로 진행하는 Subscribe Pulse가 지금 가장 적합한 진입점입니다.",
    difference: VELNOC_DIFFERENCE,
    cta: "Subscribe Pulse 알아보기  ·  월 19만원",
    note: "3개월 후 AI 검색 가시성이 어떻게 달라지는지 확인하세요.",
    showEmail: true, ctaInvert: true, showAIBlock: true,
  },
  D: {
    color: "#34d399", colorDim: "rgba(52,211,153,0.10)", borderColor: "rgba(52,211,153,0.25)",
    stage: "03", badgeLabel: "STAGE.03",
    name: "성장 단계", tag: "Signal 추천",
    headline: "성장의 방향이 보이기 시작했습니다",
    body: "SEO 기반은 잡혀가고 있지만 AEO·GEO·운영 자동화가 추가돼야 다음 레벨로 갑니다. 콘텐츠 전략·검색 데이터 분석·자동화를 묶어 설계하는 Subscribe Signal이 지금 단계에 맞습니다.",
    difference: VELNOC_DIFFERENCE,
    cta: "Subscribe Signal 알아보기  ·  월 59만원",
    note: "현재 진행 중인 마케팅과 어떻게 연결되는지 먼저 진단합니다.",
    showEmail: true, ctaInvert: true, showAIBlock: true,
  },
  E: {
    color: "#fbbf24", colorDim: "rgba(251,191,36,0.10)", borderColor: "rgba(251,191,36,0.25)",
    stage: "04", badgeLabel: "STAGE.04",
    name: "본격 운영 단계", tag: "Engine 추천",
    headline: "본격적인 시스템이 필요한 단계입니다",
    body: "다채널 운영이 시작됐지만 각 채널이 연결되지 않고 따로 돌고 있을 가능성이 높습니다. SEO·AEO·GEO·자동화를 하나의 엔진으로 통합하는 Subscribe Engine 또는 Studio 설계 프로젝트를 추천합니다.",
    difference: VELNOC_DIFFERENCE,
    cta: "Subscribe Engine 알아보기  ·  월 169만원",
    note: "Studio(단발 설계 프로젝트) 옵션도 함께 안내드립니다.",
    showEmail: true, ctaInvert: true, showAIBlock: true,
  },
  F: {
    color: "#f87171", colorDim: "rgba(248,113,113,0.10)", borderColor: "rgba(248,113,113,0.25)",
    stage: "05", badgeLabel: "STAGE.05",
    name: "OS 후보", tag: "별도 상담",
    headline: "비즈니스 OS 수준의 설계가 필요합니다",
    body: "단순 마케팅·SEO를 넘어 사업 운영 전체의 디지털 아키텍처 재설계가 필요한 단계입니다. VELNOC OS는 업종 특화 운영 시스템 구축 프로젝트로, 별도 상담을 통해 범위와 견적을 산정합니다.",
    difference: VELNOC_DIFFERENCE,
    cta: "VELNOC OS 상담 신청하기",
    note: "현재 운영 구조 분석부터 무료로 시작합니다.",
    showEmail: true, ctaInvert: false, showAIBlock: true,
  },
};

// 스테이지 스펙트럼은 B~F만 (A 분리)
const STAGE_ORDER = ["B", "C", "D", "E", "F"];

/* ─────────────────────────────────────────────────────────
   A 분류용 채널별 전문가 안내
   ───────────────────────────────────────────────────────── */
const CHANNEL_GUIDANCE = {
  marketplace: {
    icon: "🛒",
    channelName: "마켓플레이스 (쿠팡·네이버쇼핑·11번가 등)",
    expertType: "쇼핑몰 광고 대행사 / 마켓플레이스 운영 컨설턴트",
    checklist: [
      "광고 효율(ROAS)을 채널별로 분리해서 보여주는가",
      "상품 상세페이지 최적화와 키워드 전략을 함께 다루는가",
      "여러 마켓플레이스(쿠팡·네이버·11번가)를 통합 관리할 수 있는가",
      "정산·매입 데이터를 광고 결과와 연결해 분석하는가",
    ],
    revisit: "자사 채널(홈페이지·자체 쇼핑몰)의 매출 비중이 30% 이상이 되면 다시 진단받으세요.",
  },
  delivery: {
    icon: "🍱",
    channelName: "배달앱 (배달의민족·요기요 등)",
    expertType: "배달앱 광고 대행사 / F&B 마케팅 컨설턴트",
    checklist: [
      "배민·요기요·쿠팡이츠 광고 노출 데이터를 함께 분석하는가",
      "메뉴 구성·가격 전략을 데이터 기반으로 제안하는가",
      "리뷰 관리·답글 운영 노하우를 갖고 있는가",
      "오프라인 매장 운영과 배달 운영의 균형을 이해하는가",
    ],
    revisit: "자사 예약·주문 채널을 구축하셨다면 다시 진단받으세요.",
  },
  sns_dm: {
    icon: "💬",
    channelName: "SNS DM 직접 주문 (인스타·카카오채널)",
    expertType: "SNS 콘텐츠 에이전시 / DM·메신저 CRM 전문가",
    checklist: [
      "콘텐츠 기획·제작·게시 전 과정을 다루는가",
      "DM 응대를 자동화·표준화하는 시스템을 제안하는가",
      "팔로워 단순 증가가 아니라 매출 전환까지 추적하는가",
      "여러 채널(인스타·카카오채널) 동시 관리가 가능한가",
    ],
    revisit: "콘텐츠 운영이 안정되고 자사 사이트를 구축하시면 다시 진단받으세요.",
  },
};

/* ─────────────────────────────────────────────────────────
   도메인 분석 엔진 (MVP: deterministic 시뮬레이션)
   ───────────────────────────────────────────────────────── */
function hashCode(str) {
  let hash = 0;
  if (!str) return 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function normalizeDomain(input) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

const BOTTLENECK_LIBRARY = [
  { key: "bot_block", title: "AI 봇 크롤링 차단", desc: "GPTBot · PerplexityBot · ClaudeBot 등 AI 크롤러가 사이트를 읽을 수 없도록 설정돼 있습니다. AI 검색에서 완전히 투명 인간 상태입니다.", severity: "critical" },
  { key: "no_schema", title: "구조화 데이터(Schema.org) 부재", desc: "AI가 비즈니스 정보(서비스·가격·위치·운영시간)를 정확히 인식할 수 있는 시맨틱 마크업이 없습니다.", severity: "warning" },
  { key: "weak_meta", title: "메타 정보 부족", desc: "검색·AI 인용에 필요한 메타 설명·Open Graph 태그가 충분하지 않습니다.", severity: "warning" },
  { key: "no_citation", title: "AI 검색 인용 기록 미흡", desc: "ChatGPT · Perplexity 검색 결과에서 본 사이트가 거의 인용되지 않고 있습니다.", severity: "critical" },
  { key: "img_heavy", title: "이미지 중심 콘텐츠 구조", desc: "텍스트 정보가 이미지에 포함되어 있어 AI가 읽을 수 없는 영역이 많습니다.", severity: "warning" },
  { key: "no_sitemap", title: "Sitemap · 색인 가이드 부재", desc: "검색엔진과 AI가 사이트 구조를 빠르게 파악하도록 돕는 sitemap.xml이 없거나 불완전합니다.", severity: "warning" },
];

async function performAnalysis(siteInputs, hasOwnSite) {
  await new Promise((r) => setTimeout(r, 1500));

  const targetRaw = hasOwnSite ? siteInputs.domain : (siteInputs.competitors.filter(Boolean)[0] || "");
  const target = normalizeDomain(targetRaw);

  if (!target) return { status: "failed", error: "분석할 도메인이 없습니다." };

  const hash = hashCode(target);
  const botAccess = hash % 100;
  const schema = (hash >> 4) % 100;
  const meta = (hash >> 8) % 100;
  const citation = (hash >> 12) % 100;

  const aiVisibility = Math.round(botAccess * 0.35 + schema * 0.30 + meta * 0.20 + citation * 0.15);

  const candidates = [
    { key: "bot_block", score: botAccess },
    { key: "no_schema", score: schema },
    { key: "weak_meta", score: meta },
    { key: "no_citation", score: citation },
  ];
  candidates.sort((a, b) => a.score - b.score);

  const visibleBottlenecks = candidates
    .filter((c) => c.score < 65)
    .slice(0, 3)
    .map((c) => BOTTLENECK_LIBRARY.find((b) => b.key === c.key));

  const hiddenBottleneckCount = 3 + (hash % 5);

  return {
    status: "complete", target, aiVisibility,
    breakdown: { botAccess, schema, meta, citation },
    visibleBottlenecks, hiddenBottleneckCount,
    hasCompetitors: (siteInputs.competitors || []).filter(Boolean).length > 0,
  };
}

/* ─────────────────────────────────────────────────────────
   공통 컴포넌트
   ───────────────────────────────────────────────────────── */
function ScoreBar({ label, val, max, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(max > 0 ? (val / max) * 100 : 0), delay);
    return () => clearTimeout(t);
  }, [val, max, delay]);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span className="vn-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>{label}</span>
        <span className="vn-mono" style={{ fontSize: 11, color, letterSpacing: "0.05em" }}>
          {val} <span style={{ color: "rgba(255,255,255,0.2)" }}>/ {max}</span>
        </span>
      </div>
      <div style={{ height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
        <div className="vn-bar-fill" style={{ height: "100%", width: `${width}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

function OptionButton({ option, selected, onClick, isMulti }) {
  return (
    <button onClick={onClick} className="vn-select-btn" style={{
      width: "100%", textAlign: "left", padding: "12px 16px", borderRadius: 10,
      border: `1px solid ${selected ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.08)"}`,
      background: selected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
      color: selected ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
      fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
      marginBottom: 6, fontFamily: "'Noto Sans KR', system-ui, sans-serif",
      fontWeight: selected ? 500 : 400,
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: isMulti ? 4 : "50%",
        border: `1.5px solid ${selected ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)"}`,
        background: selected ? "rgba(255,255,255,0.9)" : "transparent",
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.12s ease",
      }}>
        {selected && isMulti && <span style={{ fontSize: 9, color: "#0a0a0a", fontWeight: 700, lineHeight: 1 }}>✓</span>}
        {selected && !isMulti && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0a0a0a", display: "block" }} />}
      </span>
      {option.label}
    </button>
  );
}

function TextInput({ label, sublabel, value, onChange, placeholder, prefix, required }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: sublabel ? 3 : 8, lineHeight: 1.5 }}>
        {label}
        {required && <span style={{ color: "#f87171", marginLeft: 4 }}>*</span>}
      </p>
      {sublabel && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 8, lineHeight: 1.5 }}>{sublabel}</p>}
      <div style={{ position: "relative" }}>
        {prefix && <span className="vn-mono" style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          fontSize: 12, color: "rgba(255,255,255,0.25)", pointerEvents: "none",
        }}>{prefix}</span>}
        <input type="text" className="vn-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          style={{ width: "100%", padding: prefix ? "11px 14px 11px 44px" : "11px 14px", borderRadius: 9, fontSize: 13, fontFamily: "'Noto Sans KR', system-ui" }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Phase 1: 진입 화면
   ───────────────────────────────────────────────────────── */
function IntroScreen({ onSelect }) {
  return (
    <div className="vn-root vn-fade-in vn-scroll" style={{
      minHeight: "100vh", background: "#0a0a0a", display: "flex",
      flexDirection: "column", alignItems: "center", padding: "60px 20px 50px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <p className="vn-mono" style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)", marginBottom: 28, textTransform: "uppercase", textAlign: "center" }}>
          VELNOC · 자가 진단
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.95)", textAlign: "center", lineHeight: 1.4, marginBottom: 10 }}>
          AI가 당신의 비즈니스를<br />읽을 수 있나요?
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 1.6, marginBottom: 40 }}>
          5분 안에 현재 위치와 다음 단계를 알려드립니다.<br />검색을 넘어, AI에게 인용되는 비즈니스로.
        </p>
        <button onClick={() => onSelect(true)} className="vn-card-hover" style={{
          width: "100%", padding: "20px 22px", borderRadius: 14,
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
          textAlign: "left", marginBottom: 12, color: "white", fontFamily: "'Noto Sans KR', system-ui",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span className="vn-mono" style={{ fontSize: 10, color: "#34d399", letterSpacing: "0.15em" }}>OPTION 01</span>
            <div style={{ flex: 1, height: 1, background: "rgba(52,211,153,0.15)" }} />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "rgba(255,255,255,0.9)" }}>사이트 또는 브랜드가 있습니다</h3>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.55, margin: 0 }}>
            도메인을 입력하면 실제 AI 가시성 점수와 핵심 병목을 분석해드립니다
          </p>
        </button>
        <button onClick={() => onSelect(false)} className="vn-card-hover" style={{
          width: "100%", padding: "20px 22px", borderRadius: 14,
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
          textAlign: "left", marginBottom: 30, color: "white", fontFamily: "'Noto Sans KR', system-ui",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span className="vn-mono" style={{ fontSize: 10, color: "#60a5fa", letterSpacing: "0.15em" }}>OPTION 02</span>
            <div style={{ flex: 1, height: 1, background: "rgba(96,165,250,0.15)" }} />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "rgba(255,255,255,0.9)" }}>아직 사이트가 없습니다</h3>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.55, margin: 0 }}>
            경쟁사를 분석해서 시장의 AI 가시성 수준을 먼저 확인해드립니다
          </p>
        </button>
        <p className="vn-mono" style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: "0.05em" }}>
          무료  ·  약 5분 소요  ·  개인정보 별도 수집 없음
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Phase 2: 도메인 입력 화면
   ───────────────────────────────────────────────────────── */
function DomainInputScreen({ hasOwnSite, inputs, setInputs, onBack, onSubmit }) {
  const update = (key, value) => setInputs((p) => ({ ...p, [key]: value }));
  const updateCompetitor = (idx, value) => {
    setInputs((p) => {
      const next = [...(p.competitors || ["", "", ""])];
      next[idx] = value;
      return { ...p, competitors: next };
    });
  };
  const competitors = inputs.competitors || ["", "", ""];
  const isValid = hasOwnSite
    ? normalizeDomain(inputs.domain).length >= 4
    : competitors.filter((c) => normalizeDomain(c).length >= 4).length >= 1;

  return (
    <div className="vn-root vn-fade-in vn-scroll" style={{
      minHeight: "100vh", background: "#0a0a0a", display: "flex",
      flexDirection: "column", alignItems: "center", padding: "36px 20px 60px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <span className="vn-mono" style={{ fontSize: 11, letterSpacing: "0.25em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>VELNOC</span>
          <span className="vn-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>분석 정보 입력</span>
        </div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span className="vn-mono" style={{ fontSize: 10, color: hasOwnSite ? "#34d399" : "#60a5fa", letterSpacing: "0.15em" }}>
              {hasOwnSite ? "OPTION 01" : "OPTION 02"}
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.92)", marginBottom: 6 }}>
            {hasOwnSite ? "자사 정보를 알려주세요" : "분석할 경쟁사를 입력해주세요"}
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.55 }}>
            {hasOwnSite
              ? "도메인 분석은 자동으로 진행됩니다. 설문 작성 중 백그라운드에서 분석합니다."
              : "관심 있는 경쟁사 1곳 이상이면 충분합니다. 더 많이 입력할수록 시장 그림이 선명해집니다."}
          </p>
        </div>
        {hasOwnSite ? (
          <>
            <TextInput label="자사 도메인" value={inputs.domain} onChange={(v) => update("domain", v)} placeholder="velnoc.com" prefix="https://" required />
            <TextInput label="브랜드명" sublabel="AI 검색에서 검색되는 정확한 이름" value={inputs.brand} onChange={(v) => update("brand", v)} placeholder="벨녹" />
            <TextInput label="핵심 키워드" sublabel="고객이 우리 사업을 찾을 때 쓰는 검색어" value={inputs.keyword} onChange={(v) => update("keyword", v)} placeholder="AI 검색 최적화" />
            <div style={{ marginTop: 24, padding: "16px 18px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: 3 }}>경쟁사 (선택사항)</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 14, lineHeight: 1.5 }}>입력하시면 무료 리포트에 비교 분석이 일부 포함됩니다</p>
              {[0, 1, 2].map((i) => (
                <input key={i} type="text" className="vn-input" placeholder={`경쟁사 ${i + 1} 도메인 (예: competitor.com)`}
                  value={competitors[i] || ""} onChange={(e) => updateCompetitor(i, e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, fontSize: 12, fontFamily: "'Noto Sans KR', system-ui", marginBottom: i < 2 ? 8 : 0 }}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <TextInput label="경쟁사 1" sublabel="가장 비교해보고 싶은 곳을 먼저 입력하세요" value={competitors[0] || ""} onChange={(v) => updateCompetitor(0, v)} placeholder="competitor.com" prefix="https://" required />
            <TextInput label="경쟁사 2" value={competitors[1] || ""} onChange={(v) => updateCompetitor(1, v)} placeholder="competitor2.com" prefix="https://" />
            <TextInput label="경쟁사 3" value={competitors[2] || ""} onChange={(v) => updateCompetitor(2, v)} placeholder="competitor3.com" prefix="https://" />
          </>
        )}
        <div style={{ marginTop: 24, padding: "12px 14px", borderRadius: 10, background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.15)" }}>
          <p className="vn-mono" style={{ fontSize: 10, color: "#60a5fa", letterSpacing: "0.15em", marginBottom: 6 }}>💡 ANALYSIS COVERAGE</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            <strong style={{ color: "rgba(255,255,255,0.75)" }}>무료</strong>: AI 가시성 종합 점수 + 핵심 병목 3가지<br/>
            <strong style={{ color: "rgba(255,255,255,0.75)" }}>유료 리포트</strong>: 전체 병목 + 경쟁사 정밀 비교 + 실행 가이드
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 32 }}>
          <button onClick={onBack} style={{
            flex: 1, padding: "14px 0", borderRadius: 12, background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)",
            fontSize: 13, cursor: "pointer", fontFamily: "'Noto Sans KR', system-ui",
          }}>← 처음으로</button>
          <button onClick={isValid ? onSubmit : undefined} disabled={!isValid} style={{
            flex: 2, padding: "14px 0", borderRadius: 12,
            background: isValid ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.07)",
            border: "none", color: isValid ? "#0a0a0a" : "rgba(255,255,255,0.2)",
            fontSize: 13, fontWeight: 700, cursor: isValid ? "pointer" : "not-allowed",
            fontFamily: "'Noto Sans KR', system-ui",
          }}>분석 시작 + 설문 진행 →</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Phase 3: 설문 화면
   ───────────────────────────────────────────────────────── */
function AnalysisIndicator({ status }) {
  if (status === "idle" || !status) return null;
  const config = {
    analyzing: { label: "도메인 분석 중", color: "#60a5fa", bg: "rgba(96,165,250,0.06)", border: "rgba(96,165,250,0.18)", dot: true },
    complete: { label: "분석 완료 · 결과에 반영됩니다", color: "#34d399", bg: "rgba(52,211,153,0.06)", border: "rgba(52,211,153,0.18)", dot: false },
    failed: { label: "일부 분석 항목 제한 (도메인 점검 후 재시도)", color: "#fbbf24", bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.18)", dot: false },
  }[status];
  if (!config) return null;
  return (
    <div className="vn-fade-in" style={{
      padding: "8px 12px", borderRadius: 8, background: config.bg, border: `1px solid ${config.border}`, marginBottom: 14,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      {config.dot
        ? <span className="vn-dot-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: config.color }} />
        : <span style={{ fontSize: 10, color: config.color }}>✓</span>}
      <span className="vn-mono" style={{ fontSize: 10, color: config.color, letterSpacing: "0.1em" }}>{config.label}</span>
    </div>
  );
}

function SurveyScreen({ step, answers, setAnswers, onBack, onNext, onFinish, animKey, analysisStatus, hasOwnSite }) {
  const sd = STEP_DATA[step];
  const filteredQuestions = sd.questions.map((q) => {
    if (q.id === "website" && hasOwnSite) {
      return { ...q, options: q.options.filter((o) => o.value === "basic" || o.value === "active") };
    }
    return q;
  });
  const isComplete = filteredQuestions.every((q) => {
    if (q.showIf && !q.showIf(answers)) return true;
    if (q.optional) return true;
    if (q.type === "multi") return (answers[q.id] || []).length > 0;
    return !!answers[q.id];
  });
  const handleSingle = (id, val) => setAnswers((p) => ({ ...p, [id]: val }));
  const handleMulti = (id, val) => {
    setAnswers((p) => {
      const cur = p[id] || [];
      return { ...p, [id]: cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val] };
    });
  };

  return (
    <div className="vn-root vn-scroll" style={{
      minHeight: "100vh", background: "#0a0a0a", display: "flex",
      flexDirection: "column", alignItems: "center", padding: "36px 20px 60px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span className="vn-mono" style={{ fontSize: 11, letterSpacing: "0.25em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>VELNOC</span>
          <span className="vn-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
            {step + 1} <span style={{ color: "rgba(255,255,255,0.1)" }}>/ 4</span>
          </span>
        </div>
        <AnalysisIndicator status={analysisStatus} />
        <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="vn-progress-segment" style={{
              flex: 1, height: 2, borderRadius: 2,
              background: i <= step ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.1)",
            }} />
          ))}
        </div>
        <div key={`header-${animKey}`} className="vn-fade-in" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span className="vn-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>STEP {sd.icon}</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.92)", marginBottom: 6 }}>{sd.title}</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>{sd.sub}</p>
        </div>
        <div key={`questions-${animKey}`} className="vn-fade-in" style={{ marginBottom: 32 }}>
          {filteredQuestions.map((q, qi) => {
            if (q.showIf && !q.showIf(answers)) return null;
            const selectedSingle = answers[q.id];
            const selectedMulti = answers[q.id] || [];
            return (
              <div key={q.id} style={{ marginBottom: qi < filteredQuestions.length - 1 ? 28 : 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: q.sublabel ? 4 : 12, lineHeight: 1.5 }}>{q.label}</p>
                {q.sublabel && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 12, lineHeight: 1.5 }}>{q.sublabel}</p>}
                {q.options.map((opt) => {
                  const sel = q.type === "multi" ? selectedMulti.includes(opt.value) : selectedSingle === opt.value;
                  return <OptionButton key={opt.value} option={opt} selected={sel} isMulti={q.type === "multi"}
                    onClick={() => q.type === "multi" ? handleMulti(q.id, opt.value) : handleSingle(q.id, opt.value)} />;
                })}
                {q.optional && <p style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", marginTop: 6 }}>* 선택사항</p>}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onBack} style={{
            flex: 1, padding: "14px 0", borderRadius: 12, background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)",
            fontSize: 13, cursor: "pointer", fontFamily: "'Noto Sans KR', system-ui",
          }}>← 이전</button>
          <button onClick={isComplete ? (step === 3 ? onFinish : onNext) : undefined} disabled={!isComplete} style={{
            flex: 2, padding: "14px 0", borderRadius: 12,
            background: isComplete ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.07)",
            border: "none", color: isComplete ? "#0a0a0a" : "rgba(255,255,255,0.2)",
            fontSize: 13, fontWeight: 700, cursor: isComplete ? "pointer" : "not-allowed",
            fontFamily: "'Noto Sans KR', system-ui",
          }}>{step === 3 ? "결과 보기" : "다음 →"}</button>
        </div>
        <p className="vn-mono" style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.12)", marginTop: 24, letterSpacing: "0.05em" }}>
          약 5분 소요  ·  개인정보 별도 수집 없음
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Phase 4-A: A 분류 전용 결과 화면 (성적표 인식 제거)
   ───────────────────────────────────────────────────────── */
function ChannelGuidanceCard({ channel }) {
  const g = CHANNEL_GUIDANCE[channel];
  if (!g) return null;
  return (
    <div className="vn-fade-in" style={{
      padding: "20px 22px", borderRadius: 14,
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>{g.icon}</span>
        <div style={{ flex: 1 }}>
          <p className="vn-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 2 }}>CHANNEL</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{g.channelName}</p>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <p className="vn-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 4 }}>RECOMMENDED EXPERT</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: 700, lineHeight: 1.5 }}>{g.expertType}</p>
      </div>

      <div style={{ marginBottom: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="vn-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 10 }}>전문가 점검 체크리스트</p>
        {g.checklist.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
            <span className="vn-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.5, paddingTop: 1 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: 0 }}>{item}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.12)" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.55, margin: 0 }}>
          <span className="vn-mono" style={{ color: "#60a5fa", fontSize: 9, letterSpacing: "0.1em" }}>↻ REVISIT</span><br/>
          {g.revisit}
        </p>
      </div>
    </div>
  );
}

function ResultScreenTypeA({ result, answers, onReset }) {
  const [showGuidance, setShowGuidance] = useState(false);
  const cfg = GRADE_CONFIG.A;
  const blockedChannels = result.blockedChannels || [];

  return (
    <div className="vn-root vn-fade-in vn-scroll" style={{
      minHeight: "100vh", background: "#0a0a0a", display: "flex",
      flexDirection: "column", alignItems: "center", padding: "48px 20px 60px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <p className="vn-mono" style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)", marginBottom: 32, textTransform: "uppercase", textAlign: "center" }}>
          VELNOC · 자가 진단 결과
        </p>

        {/* A 단독 배지 — 등급 스펙트럼 제거 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center",
            padding: "20px 32px", borderRadius: 14,
            background: cfg.colorDim, border: `1px solid ${cfg.borderColor}`,
            marginBottom: 18,
          }}>
            <span style={{ fontSize: 22, color: cfg.color, marginBottom: 6 }}>⊘</span>
            <span className="vn-mono" style={{ fontSize: 9, letterSpacing: "0.25em", color: cfg.color, opacity: 0.7, textTransform: "uppercase" }}>
              {cfg.badgeLabel}
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.92)", lineHeight: 1.4, textAlign: "center" }}>
            {cfg.headline}
          </h1>
        </div>

        {/* 분류 이유 — 어떤 채널이 이 결과를 만들었는지 */}
        {blockedChannels.length > 0 && (
          <div style={{
            padding: "14px 18px", borderRadius: 12, marginBottom: 16,
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <p className="vn-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 6 }}>
              왜 이 분류인가요?
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>
              선택하신 매출 채널이 <strong style={{ color: "rgba(255,255,255,0.9)" }}>
              {blockedChannels.map((c) => {
                if (c === "marketplace") return "마켓플레이스";
                if (c === "delivery") return "배달앱";
                if (c === "sns_dm") return "SNS DM";
                return "";
              }).filter(Boolean).join(" · ")}
              </strong> 중심이라, AI 검색 최적화(SEO·AEO·GEO)보다 각 채널 내 최적화 전략이 훨씬 효과적입니다.
            </p>
          </div>
        )}

        {/* 설명 카드 */}
        <div style={{
          padding: "20px 22px", borderRadius: 14, background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)", marginBottom: 20,
        }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>
            {cfg.body}
          </p>

          {/* "벨녹이 어떻게 다른가" — 구체화된 차이 */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="vn-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 6 }}>
              VELNOC IS DIFFERENT
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, margin: 0 }}>
              {cfg.difference}
            </p>
          </div>
        </div>

        {/* CTA — 펼치기 */}
        {!showGuidance ? (
          <>
            <button
              onClick={() => setShowGuidance(true)}
              className="vn-btn-hover"
              style={{
                width: "100%", padding: "15px 20px", borderRadius: 12,
                background: "rgba(255,255,255,0.06)", color: cfg.color,
                border: `1px solid ${cfg.borderColor}`, fontSize: 13, fontWeight: 700,
                cursor: "pointer", marginBottom: 10, fontFamily: "'Noto Sans KR', system-ui",
              }}
            >
              {cfg.cta} ↓
            </button>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", marginBottom: 36, lineHeight: 1.5 }}>
              {cfg.note}
            </p>
          </>
        ) : (
          <div className="vn-fade-in" style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span className="vn-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em" }}>
                EXPERT GUIDANCE
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <span className="vn-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                {blockedChannels.length}개 채널
              </span>
            </div>
            {blockedChannels.map((ch) => (
              <ChannelGuidanceCard key={ch} channel={ch} />
            ))}
            <div style={{
              padding: "14px 16px", borderRadius: 10, marginTop: 8,
              background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.12)",
            }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
                벨녹은 특정 대행사를 추천하지 않습니다. <strong style={{ color: "rgba(255,255,255,0.85)" }}>전문가를 고를 때 위의 점검 항목을 활용하세요.</strong> 그 후 자사 채널이 성장하면 벨녹 진단을 다시 받아보세요.
              </p>
            </div>
          </div>
        )}

        {/* 다시 진단하기 */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={onReset} style={{
            background: "none", border: "none", fontSize: 11, color: "rgba(255,255,255,0.2)",
            cursor: "pointer", textDecoration: "underline", fontFamily: "'Noto Sans KR', system-ui",
          }}>처음부터 다시 진단하기</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Phase 4-B: STAGE 분류 결과 화면 (B~F)
   ───────────────────────────────────────────────────────── */
function ResultScreenStage({ result, analysis, hasOwnSite, siteInputs, onReset }) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const cfg = GRADE_CONFIG[result.grade];

  const dims = [
    { label: "DIGITAL ASSET", val: result.D, max: 3 },
    { label: "MARKETING EXP", val: result.M, max: 3 },
    { label: "AI VISIBILITY", val: result.S, max: 3 },
    { label: "OPERATION SCALE", val: result.O, max: 2 },
  ];

  const handleEmailSend = () => {
    if (email.includes("@") && email.includes(".")) setEmailSent(true);
  };

  const aiScore = analysis?.aiVisibility ?? 0;
  const getAIScoreColor = (s) => s >= 75 ? "#34d399" : s >= 50 ? "#fbbf24" : s >= 25 ? "#fb923c" : "#f87171";
  const getAIScoreLabel = (s) => s >= 75 ? "양호" : s >= 50 ? "주의" : s >= 25 ? "위험" : "심각";
  const aiColor = getAIScoreColor(aiScore);
  const aiLabel = getAIScoreLabel(aiScore);

  return (
    <div className="vn-root vn-fade-in vn-scroll" style={{
      minHeight: "100vh", background: "#0a0a0a", display: "flex",
      flexDirection: "column", alignItems: "center", padding: "48px 20px 60px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <p className="vn-mono" style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)", marginBottom: 28, textTransform: "uppercase", textAlign: "center" }}>
          VELNOC · 자가 진단 결과
        </p>

        {/* STAGE 스펙트럼 (B~F) */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 8 }}>
            {STAGE_ORDER.map((g) => {
              const isActive = g === result.grade;
              const gcfg = GRADE_CONFIG[g];
              return (
                <div key={g} className="vn-mono" style={{
                  width: 48, height: 36, borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: isActive ? 12 : 10, fontWeight: isActive ? 700 : 400,
                  color: isActive ? gcfg.color : "rgba(255,255,255,0.15)",
                  background: isActive ? gcfg.colorDim : "transparent",
                  border: `1px solid ${isActive ? gcfg.borderColor : "rgba(255,255,255,0.06)"}`,
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.02em",
                }}>{gcfg.stage}</div>
              );
            })}
          </div>
          <p className="vn-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: "0.25em", marginBottom: 28 }}>
            VELNOC GROWTH STAGE
          </p>

          {/* 메인 배지 — STAGE 강조 */}
          <div className="vn-grade-badge" style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center",
            padding: "22px 40px", borderRadius: 16, background: cfg.colorDim,
            border: `1px solid ${cfg.borderColor}`, marginBottom: 18,
          }}>
            <span className="vn-mono" style={{ fontSize: 48, fontWeight: 700, color: cfg.color, lineHeight: 1, marginBottom: 4 }}>
              {cfg.stage}
            </span>
            <span className="vn-mono" style={{ fontSize: 9, letterSpacing: "0.25em", color: cfg.color, opacity: 0.65, textTransform: "uppercase", marginBottom: 8 }}>
              STAGE
            </span>
            <span className="vn-mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: cfg.color, opacity: 0.7, textTransform: "uppercase", paddingTop: 8, borderTop: `1px solid ${cfg.borderColor}` }}>
              {cfg.tag}
            </span>
          </div>

          <h1 style={{ fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.92)", marginBottom: 4, lineHeight: 1.4 }}>{cfg.name}</h1>
        </div>

        {/* 설명 카드 */}
        <div style={{
          padding: "20px 22px", borderRadius: 14, background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)", marginBottom: 20,
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.88)", marginBottom: 10, lineHeight: 1.5 }}>{cfg.headline}</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>{cfg.body}</p>

          {/* sensitivity 메시지 — 강화된 카피 */}
          {result.sensitivity && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0, marginBottom: 10 }}>
                💡 대행사에서 결과를 못 받으셨다면, 그건 예산이 부족해서가 아닙니다. 채널과 시스템이 연결되지 않아서입니다.
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                {cfg.difference}
              </p>
            </div>
          )}
        </div>

        {/* AI 가시성 분석 블록 */}
        {cfg.showAIBlock && analysis && analysis.status === "complete" && (
          <>
            <div style={{
              padding: "22px 22px", borderRadius: 14,
              background: `linear-gradient(135deg, ${aiColor}11 0%, rgba(255,255,255,0.02) 100%)`,
              border: `1px solid ${aiColor}33`, marginBottom: 14,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span className="vn-mono" style={{ fontSize: 10, color: aiColor, letterSpacing: "0.15em" }}>
                  AI VISIBILITY · 실시간 분석
                </span>
                <div style={{ flex: 1, height: 1, background: `${aiColor}22` }} />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6, marginBottom: 8 }}>
                <span className="vn-mono" style={{ fontSize: 56, fontWeight: 700, color: aiColor, lineHeight: 1 }}>{aiScore}</span>
                <span className="vn-mono" style={{ fontSize: 16, color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>/ 100</span>
              </div>
              <p style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: aiColor, marginBottom: 4 }}>{aiLabel} 단계</p>
              <p className="vn-mono" style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>{analysis.target}</p>
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <ScoreBar label="BOT ACCESS" val={Math.round(analysis.breakdown.botAccess / 10)} max={10} color={aiColor} delay={0} />
                <ScoreBar label="SCHEMA STRUCTURE" val={Math.round(analysis.breakdown.schema / 10)} max={10} color={aiColor} delay={150} />
                <ScoreBar label="META INFO" val={Math.round(analysis.breakdown.meta / 10)} max={10} color={aiColor} delay={300} />
                <ScoreBar label="AI CITATION" val={Math.round(analysis.breakdown.citation / 10)} max={10} color={aiColor} delay={450} />
              </div>
            </div>

            {analysis.visibleBottlenecks && analysis.visibleBottlenecks.length > 0 && (
              <div style={{
                padding: "20px 22px", borderRadius: 14, background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)", marginBottom: 14,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span className="vn-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}>
                    핵심 병목 {analysis.visibleBottlenecks.length}가지
                  </span>
                  <span className="vn-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>FREE TIER</span>
                </div>
                {analysis.visibleBottlenecks.map((b, i) => (
                  <div key={b.key} style={{
                    padding: "12px 14px", borderRadius: 10, marginBottom: i < analysis.visibleBottlenecks.length - 1 ? 8 : 0,
                    background: b.severity === "critical" ? "rgba(248,113,113,0.05)" : "rgba(251,191,36,0.04)",
                    border: `1px solid ${b.severity === "critical" ? "rgba(248,113,113,0.15)" : "rgba(251,191,36,0.13)"}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span className="vn-mono" style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                        color: b.severity === "critical" ? "#f87171" : "#fbbf24",
                        background: b.severity === "critical" ? "rgba(248,113,113,0.12)" : "rgba(251,191,36,0.1)",
                        letterSpacing: "0.05em",
                      }}>{b.severity === "critical" ? "CRITICAL" : "WARNING"}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{b.title}</span>
                    </div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.55, margin: 0 }}>{b.desc}</p>
                  </div>
                ))}
                {analysis.hiddenBottleneckCount > 0 && (
                  <div style={{
                    marginTop: 12, padding: "12px 14px", borderRadius: 10,
                    background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.15)",
                  }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>
                      <span className="vn-mono" style={{ color: cfg.color, fontWeight: 700 }}>+{analysis.hiddenBottleneckCount}개</span>의 추가 병목 항목 · 정밀 분석 데이터 · 수정 가이드가 <strong style={{ color: "rgba(255,255,255,0.7)" }}>유료 리포트</strong>에서 공개됩니다
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 점수 상세 */}
        <div style={{
          padding: "20px 22px", borderRadius: 14, background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20,
        }}>
          <p className="vn-mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", marginBottom: 18, textTransform: "uppercase" }}>
            진단 점수 상세
          </p>
          {dims.map((d, i) => <ScoreBar key={d.label} {...d} color={cfg.color} delay={i * 120} />)}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 4 }}>
            <span className="vn-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>TOTAL SCORE</span>
            <span className="vn-mono" style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>
              {result.T} <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400 }}>/ 11</span>
            </span>
          </div>
        </div>

        {/* 유료 리포트 CTA */}
        {cfg.showAIBlock && analysis && analysis.status === "complete" && (
          <div style={{
            padding: "22px", borderRadius: 14,
            background: `linear-gradient(135deg, ${cfg.color}10 0%, rgba(255,255,255,0.02) 100%)`,
            border: `1px solid ${cfg.borderColor}`, marginBottom: 18,
          }}>
            <p className="vn-mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: cfg.color, marginBottom: 10 }}>📄 PAID REPORT</p>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 8 }}>전체 병목 + 경쟁사 비교 + 실행 로드맵</h3>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 14 }}>
              결제 시점에 추가 정밀 분석이 실행됩니다. PDF로 발송되며, 상담 계약 시 결제액 전액 환불됩니다.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
              <div>✓ 전체 병목 항목 {analysis.visibleBottlenecks.length + analysis.hiddenBottleneckCount}개 + 우선순위</div>
              <div>✓ Schema · robots.txt · 메타 수정 가이드</div>
              <div>✓ 경쟁사 정밀 비교 ({hasOwnSite ? "입력 시" : "포함"})</div>
              <div>✓ 단계별 실행 로드맵 (90일)</div>
              <div>✓ 상담 계약 시 결제액 환불</div>
            </div>
            <button className="vn-btn-hover" style={{
              width: "100%", padding: "13px", borderRadius: 10, background: cfg.color,
              color: "#0a0a0a", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
              fontFamily: "'Noto Sans KR', system-ui",
            }}>상세 리포트 결제하고 받기 →</button>
          </div>
        )}

        {/* 이메일 캡처 */}
        {cfg.showEmail && (
          <div style={{
            padding: "18px 20px", borderRadius: 14, background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)", marginBottom: 16,
          }}>
            {!emailSent ? (
              <>
                <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 4 }}>무료 진단 결과를 이메일로 받기</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>결과 요약 + 단계별 가이드 무료 발송</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="email" className="vn-input" placeholder="이메일 주소 입력"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailSend()}
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 8, fontSize: 13, fontFamily: "'Noto Sans KR', system-ui" }}
                  />
                  <button onClick={handleEmailSend} className="vn-btn-hover" style={{
                    padding: "10px 18px", borderRadius: 8, background: cfg.color, color: "#0a0a0a",
                    fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
                    fontFamily: "'Noto Sans KR', system-ui", whiteSpace: "nowrap",
                  }}>발송</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>✓ 결과가 이메일로 발송되었습니다</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{email}</p>
              </div>
            )}
          </div>
        )}

        <button className="vn-btn-hover" style={{
          width: "100%", padding: "15px 20px", borderRadius: 12,
          background: cfg.ctaInvert ? cfg.color : "rgba(255,255,255,0.06)",
          color: cfg.ctaInvert ? "#0a0a0a" : cfg.color,
          border: cfg.ctaInvert ? "none" : `1px solid ${cfg.borderColor}`,
          fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 10,
          fontFamily: "'Noto Sans KR', system-ui", letterSpacing: "0.01em",
        }}>{cfg.cta} →</button>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", marginBottom: 36, lineHeight: 1.5 }}>{cfg.note}</p>

        <div style={{ textAlign: "center" }}>
          <button onClick={onReset} style={{
            background: "none", border: "none", fontSize: 11, color: "rgba(255,255,255,0.2)",
            cursor: "pointer", textDecoration: "underline", fontFamily: "'Noto Sans KR', system-ui",
          }}>처음부터 다시 진단하기</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   결과 화면 라우터: A vs STAGE
   ───────────────────────────────────────────────────────── */
function ResultScreen({ result, analysis, hasOwnSite, siteInputs, answers, onReset }) {
  if (result.grade === "A") {
    return <ResultScreenTypeA result={result} answers={answers} onReset={onReset} />;
  }
  return <ResultScreenStage result={result} analysis={analysis} hasOwnSite={hasOwnSite} siteInputs={siteInputs} onReset={onReset} />;
}

/* ─────────────────────────────────────────────────────────
   메인 컴포넌트
   ───────────────────────────────────────────────────────── */
export default function VelnocDiagnosisV3() {
  const [phase, setPhase] = useState("intro");
  const [hasOwnSite, setHasOwnSite] = useState(null);
  const [siteInputs, setSiteInputs] = useState({ domain: "", brand: "", keyword: "", competitors: ["", "", ""] });
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animKey, setAnimKey] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState("idle");
  const [analysisResult, setAnalysisResult] = useState(null);
  const analysisStartedRef = useRef(false);

  const result = useMemo(() => calcScore(answers), [answers]);

  const handleIntroSelect = (own) => { setHasOwnSite(own); setPhase("domain"); };

  const handleDomainSubmit = async () => {
    setPhase("survey");
    setAnimKey((k) => k + 1);
    if (!analysisStartedRef.current) {
      analysisStartedRef.current = true;
      setAnalysisStatus("analyzing");
      try {
        const res = await performAnalysis(siteInputs, hasOwnSite);
        setAnalysisResult(res);
        setAnalysisStatus(res.status === "complete" ? "complete" : "failed");
      } catch (e) {
        setAnalysisStatus("failed");
      }
    }
  };

  const goNext = () => { if (step < 3) { setAnimKey((k) => k + 1); setStep(step + 1); } };
  const goBack = () => {
    if (step > 0) { setAnimKey((k) => k + 1); setStep(step - 1); }
    else setPhase("domain");
  };
  const goFinish = () => setPhase("result");

  const reset = () => {
    setPhase("intro");
    setHasOwnSite(null);
    setSiteInputs({ domain: "", brand: "", keyword: "", competitors: ["", "", ""] });
    setStep(0);
    setAnswers({});
    setAnalysisStatus("idle");
    setAnalysisResult(null);
    analysisStartedRef.current = false;
    setAnimKey((k) => k + 1);
  };

  return (
    <>
      <style>{FONT_CSS}</style>
      {phase === "intro" && <IntroScreen onSelect={handleIntroSelect} />}
      {phase === "domain" && (
        <DomainInputScreen hasOwnSite={hasOwnSite} inputs={siteInputs} setInputs={setSiteInputs}
          onBack={() => setPhase("intro")} onSubmit={handleDomainSubmit} />
      )}
      {phase === "survey" && (
        <SurveyScreen step={step} answers={answers} setAnswers={setAnswers}
          onBack={goBack} onNext={goNext} onFinish={goFinish}
          animKey={animKey} analysisStatus={analysisStatus} hasOwnSite={hasOwnSite} />
      )}
      {phase === "result" && (
        <ResultScreen result={result} analysis={analysisResult} hasOwnSite={hasOwnSite}
          siteInputs={siteInputs} answers={answers} onReset={reset} />
      )}
    </>
  );
}
