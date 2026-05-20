import { useState, useMemo, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────
   VELNOC 자가 진단 도구 MVP v7
   ─────────────────────────────────────────────────────────
   디자인 시스템 v1.0 완전 정렬판
   - 다크 모드 제거 → light only (시스템 PART 9 준수)
   - 분류별 다채색 제거 → oak 단일 + A만 danger 절제 (옵션 B)
   - 그라데이션·박스 글로우 전면 제거
   - 헤딩 Gowun Batang · 본문 Pretendard
   - 결과 화면 결정타에 Display Mode 1회 (Noto Serif KR Bold)
   - 모든 색·여백·반경·폰트 = 시스템 토큰
   ───────────────────────────────────────────────────────── */

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Noto+Serif+KR:wght@400;700&display=swap');
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');

  :root {
    --velnoc-stone: #F2F1ED;
    --velnoc-surface: #FAFAF8;
    --velnoc-paper: #FFFFFF;
    --velnoc-ink-primary: #1A1A18;
    --velnoc-ink-secondary: #585854;
    --velnoc-ink-tertiary: #7A7872;
    --velnoc-oak: #2D5F4E;
    --velnoc-oak-soft: #E5EFEA;
    --velnoc-oak-deep: #1F4337;
    --velnoc-danger: #B91C1C;
    --velnoc-danger-soft: rgba(185, 28, 28, 0.06);
    --velnoc-divider: rgba(26, 26, 24, 0.08);
    --velnoc-border: rgba(26, 26, 24, 0.12);
    --velnoc-border-strong: rgba(26, 26, 24, 0.2);
    --velnoc-focus-ring: rgba(45, 95, 78, 0.25);
    --font-kr-head: 'Gowun Batang', 'Noto Serif KR', serif;
    --font-kr-display: 'Noto Serif KR', serif;
    --font-body: 'Pretendard Variable', 'Pretendard', system-ui, sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; padding: 0; }

  .vn-root {
    font-family: var(--font-body);
    background: var(--velnoc-stone);
    color: var(--velnoc-ink-primary);
    -webkit-font-smoothing: antialiased;
  }
  .vn-root, .vn-root * { font-family: var(--font-body); letter-spacing: -0.005em; }
  .vn-head { font-family: var(--font-kr-head); font-weight: 400; letter-spacing: -0.015em; }
  .vn-display { font-family: var(--font-kr-display); font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; }
  .vn-micro { font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; }
  .vn-tabular { font-variant-numeric: tabular-nums; }

  .vn-fade-in { animation: vnFadeIn 0.4s ease forwards; }
  @keyframes vnFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .vn-bar-fill { transition: width 1.1s cubic-bezier(0.16, 1, 0.3, 1); }

  .vn-btn-primary {
    background: var(--velnoc-oak); color: var(--velnoc-surface);
    padding: 14px 22px; border: none; border-radius: 6px;
    font: 500 15px/1 var(--font-body); letter-spacing: -0.005em;
    cursor: pointer; transition: background 150ms ease; width: 100%;
  }
  .vn-btn-primary:hover { background: var(--velnoc-oak-deep); }
  .vn-btn-primary:disabled { background: var(--velnoc-divider); color: var(--velnoc-ink-tertiary); cursor: not-allowed; }
  .vn-btn-primary:focus { outline: none; box-shadow: 0 0 0 3px var(--velnoc-focus-ring); }

  .vn-btn-secondary {
    background: transparent; color: var(--velnoc-ink-primary);
    padding: 14px 22px; border: 0.5px solid var(--velnoc-border-strong); border-radius: 6px;
    font: 500 15px/1 var(--font-body); letter-spacing: -0.005em;
    cursor: pointer; transition: background 150ms ease; width: 100%;
  }
  .vn-btn-secondary:hover { background: var(--velnoc-oak-soft); }

  .vn-input {
    background: var(--velnoc-paper); color: var(--velnoc-ink-primary);
    border: 0.5px solid var(--velnoc-border); border-radius: 6px;
    padding: 11px 14px; font: 400 14px/1 var(--font-body);
    width: 100%; transition: border-color 150ms ease;
  }
  .vn-input:focus { outline: none; border-color: var(--velnoc-oak); box-shadow: 0 0 0 3px var(--velnoc-focus-ring); }
  .vn-input::placeholder { color: var(--velnoc-ink-tertiary); }

  .vn-option-btn {
    width: 100%; text-align: left; padding: 14px 16px;
    background: var(--velnoc-surface); color: var(--velnoc-ink-secondary);
    border: 0.5px solid var(--velnoc-divider); border-radius: 6px;
    font: 400 14px/1.4 var(--font-body); cursor: pointer;
    transition: all 120ms ease; display: flex; align-items: center; gap: 12px;
    margin-bottom: 6px;
  }
  .vn-option-btn:hover { border-color: var(--velnoc-border-strong); color: var(--velnoc-ink-primary); }
  .vn-option-btn.selected {
    background: var(--velnoc-oak-soft); color: var(--velnoc-ink-primary);
    border-color: var(--velnoc-oak); font-weight: 500;
  }

  .vn-card {
    background: var(--velnoc-surface);
    border: 0.5px solid var(--velnoc-divider);
    border-radius: 8px;
    padding: 24px;
  }
  .vn-card-featured {
    background: var(--velnoc-surface);
    border: 0.5px solid var(--velnoc-divider);
    border-top: 2px solid var(--velnoc-oak);
    border-radius: 0 0 8px 8px;
    padding: 24px;
  }

  .vn-scroll { overflow-y: auto; scrollbar-width: none; }
  .vn-scroll::-webkit-scrollbar { display: none; }

  .vn-dot-pulse { animation: vnDotPulse 1.4s ease-in-out infinite; }
  @keyframes vnDotPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
`;

/* ─────────────────────────────────────────────────────────
   설문 데이터 — v6에서 변경 없음
   ───────────────────────────────────────────────────────── */
const STEP_DATA = [
  {
    stepNum: 1, title: "사업 기본 정보", sub: "어떤 사업을 운영하고 계신가요?", icon: "01",
    questions: [
      {
        id: "industry", label: "주요 업종을 선택해주세요", type: "single",
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
        id: "duration", label: "사업 운영 기간은?", type: "single",
        options: [
          { label: "1년 미만", value: "u1" },
          { label: "1 ~ 3년", value: "1_3" },
          { label: "3 ~ 7년", value: "3_7" },
          { label: "7년 이상", value: "o7" },
        ],
      },
      {
        id: "revenue", label: "월 평균 매출 구간",
        sublabel: "선택사항 · 정확도 향상을 위해 알려주시면 좋아요",
        type: "single", optional: true,
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
    stepNum: 2, title: "디지털 자산 점검", sub: "현재 어떤 채널을 갖고 계신가요?", icon: "02",
    questions: [
      {
        id: "website", label: "현재 자사 홈페이지 상태는?", type: "single",
        options: [
          { label: "홈페이지 없음", value: "none" },
          { label: "외부 플랫폼만 사용 (스마트스토어·네이버예약 등)", value: "platform" },
          { label: "자사 사이트 있음 (기본 수준)", value: "basic" },
          { label: "자사 사이트 + 블로그/콘텐츠 정기 발행", value: "active" },
        ],
      },
      {
        id: "channel", label: "주된 매출 채널을 모두 선택해주세요",
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
        id: "sns", label: "SNS 콘텐츠 운영 현황은?", type: "single",
        options: [
          { label: "운영하지 않음", value: "none" },
          { label: "간헐적 (월 1~2회 이하)", value: "occasional" },
          { label: "정기적 (주 1회 이상)", value: "regular" },
        ],
      },
    ],
  },
  {
    stepNum: 3, title: "마케팅 · 검색 경험", sub: "지금까지 어떤 방식으로 알려왔나요?", icon: "03",
    questions: [
      {
        id: "ads", label: "광고 집행 경험은?", type: "single",
        options: [
          { label: "광고를 진행한 적 없음", value: "none" },
          { label: "직접 진행 (메타·구글 셀프 광고)", value: "self" },
          { label: "대행사를 통해 진행한 적 있음", value: "agency" },
        ],
      },
      {
        id: "seo_practice", label: "검색 노출 관련 작업 경험은?", type: "single",
        options: [
          { label: "해본 적 없음 / 관심 없었음", value: "none" },
          { label: "가끔 직접 검색해서 순위 확인", value: "check" },
          { label: "정기적으로 SEO 작업·순위 관리 진행", value: "active" },
        ],
      },
      {
        id: "agency_sat", label: "대행사 활용 결과 만족도는?",
        sublabel: "대행사 이용 경험이 있는 경우에만 답해주세요",
        type: "single", optional: true,
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
    stepNum: 4, title: "AI 검색 가시성", sub: "AI 시대의 검색, 어디까지 알고 계신가요?", icon: "04",
    questions: [
      {
        id: "seo_know", label: "SEO(검색엔진 최적화)를 얼마나 알고 계신가요?", type: "single",
        options: [
          { label: "처음 듣는다", value: "0" },
          { label: "들어봤지만 잘 모른다", value: "1" },
          { label: "알고 있고 직접 적용하고 있다", value: "2" },
        ],
      },
      {
        id: "aeo_geo", label: "AEO(AI 답변 최적화) · GEO(AI 검색 최적화)를 들어보셨나요?", type: "single",
        options: [
          { label: "둘 다 처음 듣는다", value: "0" },
          { label: "들어봤지만 잘 모른다", value: "1" },
          { label: "알고 있고 우리 사업에 중요하다고 느낀다", value: "2" },
        ],
      },
      {
        id: "ai_search", label: "ChatGPT · Perplexity 같은 AI 검색에서 본인 사업을 검색해보셨나요?", type: "single",
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
   스코어링 — v6에서 변경 없음
   ───────────────────────────────────────────────────────── */
function calcScore(answers) {
  const industrySpecial = ["professional", "b2b", "industrial"].includes(answers.industry);
  const highRevenue = answers.revenue === "very_high";
  const channels = answers.channel || [];
  const blockCount = channels.filter((c) => ["marketplace", "delivery", "sns_dm"].includes(c)).length;
  const channelBlock = blockCount >= 2;
  const blockedChannels = channels.filter((c) => ["marketplace", "delivery", "sns_dm"].includes(c));

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
   분류 설정 — 옵션 B: oak 단일 + A만 danger
   ───────────────────────────────────────────────────────── */
const GRADE_CONFIG = {
  A: {
    isException: true, // A는 oak 시스템에서 분리
    stage: null,
    badgeLabel: "ALTERNATIVE PATH",
    typeName: "플랫폼 의존형",
    name: "벨녹 영역 아님",
    tag: "솔직한 안내",
    headline: "지금은 플랫폼 내 경쟁이 더 우선인 단계입니다",
    body: "모든 사업자가 지금 GEO/AEO를 최우선으로 해야 하는 것은 아닙니다. 매출의 대부분이 마켓플레이스·배달앱·SNS DM 같은 외부 플랫폼 내부 검색에서 발생한다면, 지금은 플랫폼 내 노출·전환 최적화가 더 우선입니다. SEO·AEO·GEO는 자사 채널과 장기 브랜드 자산을 만들 준비가 됐을 때 비로소 효과를 냅니다.",
    cta: "맞는 전문가 유형 알아보기",
    note: "선택하신 채널에 맞는 전문가 유형과 점검 항목을 안내해드립니다.",
    showEmail: false, showAIBlock: false,
  },
  B: {
    stage: "01", badgeLabel: "STAGE.01",
    typeName: "디지털 시작형",
    name: "시작 단계", tag: "Site + Pulse 추천",
    headline: "보이는 채널을 처음 짓는 단계입니다",
    body: "AI에게 인용되려면 먼저 'AI가 읽을 수 있는 사이트'가 필요합니다. 지금은 검색 최적화보다 자사 채널을 만들고, 콘텐츠를 모으는 일이 먼저입니다. VELNOC Site로 첫 자산을 짓고, Subscribe Pulse로 SEO의 출발점을 잡아가는 흐름을 권합니다.",
    cta: "Subscribe Pulse 알아보기  ·  월 19만원",
    note: "사이트 제작부터 함께 시작하는 옵션도 있습니다.",
    showEmail: true, showAIBlock: true,
  },
  C: {
    stage: "02", badgeLabel: "STAGE.02",
    typeName: "검색 기반 구축형",
    name: "기본 확보 단계", tag: "Pulse 추천",
    headline: "사이트는 있지만, 검색·AI는 아직 비어 있습니다",
    body: "구글·네이버 검색에서는 가끔 노출되더라도, ChatGPT·Perplexity 같은 AI 검색에는 거의 인용되지 않고 있을 가능성이 높습니다. 이 단계에서는 SEO를 정착시키고 AEO(AI 답변 최적화)의 첫 발자국을 찍는 일이 우선입니다. Subscribe Pulse가 가장 적합한 진입점입니다.",
    cta: "Subscribe Pulse 알아보기  ·  월 19만원",
    note: "3개월 후 AI 검색 가시성이 어떻게 달라지는지 확인하세요.",
    showEmail: true, showAIBlock: true,
  },
  D: {
    stage: "03", badgeLabel: "STAGE.03",
    typeName: "AI 가시성 확장형",
    name: "성장 단계", tag: "Signal 추천",
    headline: "검색을 넘어 AI 가시성으로 확장할 때입니다",
    body: "SEO 기반은 어느 정도 자리잡았지만, AEO·GEO와 운영 자동화가 더해지지 않으면 AI 시대의 검색에서는 여전히 후순위에 머무릅니다. 콘텐츠 전략·검색 데이터 분석·운영 자동화를 하나로 묶어 설계하는 Subscribe Signal이 지금 단계에 가장 맞습니다.",
    cta: "Subscribe Signal 알아보기  ·  월 59만원",
    note: "현재 진행 중인 마케팅과 어떻게 연결되는지 먼저 진단합니다.",
    showEmail: true, showAIBlock: true,
  },
  E: {
    stage: "04", badgeLabel: "STAGE.04",
    typeName: "운영 시스템화 후보",
    name: "본격 운영 단계", tag: "Engine 추천",
    headline: "채널은 많지만, 따로 돌고 있을 가능성이 큽니다",
    body: "SEO·AEO·GEO·자동화·콘텐츠가 각자 굴러가는 단계에서는 노력 대비 결과가 누수됩니다. 채널을 하나의 엔진으로 통합해 운영을 시스템화해야 다음 레벨로 갑니다. Subscribe Engine 구독 또는 Studio(단발 설계 프로젝트)로 통합 설계를 시작하세요.",
    cta: "Subscribe Engine 알아보기  ·  월 169만원",
    note: "Studio(단발 설계 프로젝트) 옵션도 함께 안내드립니다.",
    showEmail: true, showAIBlock: true,
  },
  F: {
    stage: "05", badgeLabel: "STAGE.05",
    typeName: "산업 OS 후보",
    name: "OS 후보", tag: "별도 상담",
    headline: "마케팅이 아니라, 운영체제 자체를 다시 짤 때입니다",
    body: "단순 SEO·광고를 넘어 사업 운영 전체의 디지털 아키텍처를 재설계해야 하는 단계입니다. VELNOC OS는 업종 특화 운영 시스템을 처음부터 설계·구축하는 상위 프로젝트입니다. 범위와 견적은 별도 상담을 통해 산정합니다.",
    cta: "VELNOC OS 상담 신청하기",
    note: "현재 운영 구조 분석부터 무료로 시작합니다.",
    showEmail: true, showAIBlock: true,
  },
};

const STAGE_ORDER = ["B", "C", "D", "E", "F"];

/* ─────────────────────────────────────────────────────────
   A 분류 채널별 가이던스
   ───────────────────────────────────────────────────────── */
const CHANNEL_GUIDANCE = {
  marketplace: {
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
   도메인 분석 엔진 (시뮬레이션)
   ───────────────────────────────────────────────────────── */
function hashCode(str) {
  let hash = 0;
  if (!str) return 0;
  for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
  return Math.abs(hash);
}
function normalizeDomain(input) {
  return (input || "").toLowerCase().trim().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
}
const BOTTLENECK_LIBRARY = [
  { key: "bot_block", title: "AI 봇 크롤링 차단", desc: "GPTBot · PerplexityBot · ClaudeBot 등 AI 크롤러가 사이트를 읽을 수 없도록 설정돼 있습니다. AI 검색에서 완전히 투명 인간 상태입니다.", severity: "critical" },
  { key: "no_schema", title: "구조화 데이터(Schema.org) 부재", desc: "AI가 비즈니스 정보(서비스·가격·위치·운영시간)를 정확히 인식할 수 있는 시맨틱 마크업이 없습니다.", severity: "warning" },
  { key: "weak_meta", title: "메타 정보 부족", desc: "검색·AI 인용에 필요한 메타 설명·Open Graph 태그가 충분하지 않습니다.", severity: "warning" },
  { key: "no_citation", title: "AI 검색 인용 기록 미흡", desc: "ChatGPT · Perplexity 검색 결과에서 본 사이트가 거의 인용되지 않고 있습니다.", severity: "critical" },
];
async function performAnalysis(siteInputs, hasOwnSite) {
  await new Promise((r) => setTimeout(r, 1500));
  const targetRaw = hasOwnSite ? siteInputs.domain : (siteInputs.competitors.filter(Boolean)[0] || "");
  const target = normalizeDomain(targetRaw);
  if (!target) return { status: "failed" };
  const hash = hashCode(target);
  const botAccess = hash % 100;
  const schema = (hash >> 4) % 100;
  const meta = (hash >> 8) % 100;
  const citation = (hash >> 12) % 100;
  const aiVisibility = Math.round(botAccess * 0.35 + schema * 0.30 + meta * 0.20 + citation * 0.15);
  const candidates = [
    { key: "bot_block", score: botAccess }, { key: "no_schema", score: schema },
    { key: "weak_meta", score: meta }, { key: "no_citation", score: citation },
  ];
  candidates.sort((a, b) => a.score - b.score);
  const visibleBottlenecks = candidates.filter((c) => c.score < 65).slice(0, 3)
    .map((c) => BOTTLENECK_LIBRARY.find((b) => b.key === c.key));
  const hiddenBottleneckCount = 3 + (hash % 5);
  return {
    status: "complete", target, aiVisibility,
    breakdown: { botAccess, schema, meta, citation },
    visibleBottlenecks, hiddenBottleneckCount,
  };
}

/* ─────────────────────────────────────────────────────────
   공통 컴포넌트
   ───────────────────────────────────────────────────────── */
function ScoreBar({ label, val, max, accent = "var(--velnoc-oak)", delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(max > 0 ? (val / max) * 100 : 0), delay);
    return () => clearTimeout(t);
  }, [val, max, delay]);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)" }}>{label}</span>
        <span className="vn-tabular" style={{ fontSize: 13, fontWeight: 500, color: "var(--velnoc-ink-primary)" }}>
          {val} <span style={{ color: "var(--velnoc-ink-tertiary)", fontWeight: 400 }}>/ {max}</span>
        </span>
      </div>
      <div style={{ height: 3, background: "var(--velnoc-divider)", borderRadius: 2, overflow: "hidden" }}>
        <div className="vn-bar-fill" style={{ height: "100%", width: `${width}%`, background: accent, borderRadius: 2 }} />
      </div>
    </div>
  );
}

function OptionButton({ option, selected, onClick, isMulti }) {
  return (
    <button onClick={onClick} className={`vn-option-btn ${selected ? "selected" : ""}`}>
      <span style={{
        width: 18, height: 18, flexShrink: 0,
        borderRadius: isMulti ? 4 : "50%",
        border: `1.5px solid ${selected ? "var(--velnoc-oak)" : "var(--velnoc-border)"}`,
        background: selected ? "var(--velnoc-oak)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 120ms ease",
      }}>
        {selected && isMulti && <span style={{ fontSize: 10, color: "var(--velnoc-surface)", fontWeight: 700 }}>✓</span>}
        {selected && !isMulti && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--velnoc-surface)" }} />}
      </span>
      {option.label}
    </button>
  );
}

function TextInput({ label, sublabel, value, onChange, placeholder, prefix, required }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--velnoc-ink-primary)", marginBottom: sublabel ? 3 : 8 }}>
        {label}{required && <span style={{ color: "var(--velnoc-danger)", marginLeft: 4 }}>*</span>}
      </label>
      {sublabel && <p style={{ fontSize: 12, color: "var(--velnoc-ink-tertiary)", marginBottom: 8, margin: "0 0 8px 0", lineHeight: 1.5 }}>{sublabel}</p>}
      <div style={{ position: "relative" }}>
        {prefix && (
          <span className="vn-tabular" style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 13, color: "var(--velnoc-ink-tertiary)", pointerEvents: "none",
          }}>{prefix}</span>
        )}
        <input type="text" className="vn-input" value={value}
          onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          style={{ paddingLeft: prefix ? 56 : 14 }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Phase 1: 진입 화면
   ───────────────────────────────────────────────────────── */
function IntroScreen({ onSelect }) {
  return (
    <div className="vn-root vn-fade-in vn-scroll" style={{ minHeight: "100vh", padding: "64px 24px 48px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <p className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)", textAlign: "center", marginBottom: 32 }}>
          VELNOC · 자가 진단
        </p>

        <h1 className="vn-head" style={{ fontSize: 32, lineHeight: 1.3, textAlign: "center", marginBottom: 16, margin: "0 0 16px" }}>
          AI가 당신의 비즈니스를<br />읽을 수 있나요?
        </h1>

        <p style={{ fontSize: 14, color: "var(--velnoc-ink-secondary)", textAlign: "center", lineHeight: 1.75, marginBottom: 48 }}>
          <span style={{ color: "var(--velnoc-ink-tertiary)" }}>"AI에 보이나요?"</span>를 넘어,<br />
          <strong style={{ color: "var(--velnoc-ink-primary)", fontWeight: 600 }}>"AI가 추천할 만큼 사업 구조가 정리되어 있나요?"</strong><br />
          <span style={{ color: "var(--velnoc-ink-tertiary)" }}>를 진단합니다.</span>
        </p>

        <button onClick={() => onSelect(true)} className="vn-card" style={{
          width: "100%", textAlign: "left", cursor: "pointer", marginBottom: 12,
          transition: "all 150ms ease", border: "0.5px solid var(--velnoc-border)",
        }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--velnoc-oak)"; e.currentTarget.style.background = "var(--velnoc-oak-soft)"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--velnoc-border)"; e.currentTarget.style.background = "var(--velnoc-surface)"; }}
        >
          <p className="vn-micro" style={{ color: "var(--velnoc-oak)", marginBottom: 8 }}>OPTION 01</p>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--velnoc-ink-primary)", margin: "0 0 6px" }}>
            사이트 또는 브랜드가 있습니다
          </h3>
          <p style={{ fontSize: 13, color: "var(--velnoc-ink-secondary)", lineHeight: 1.55, margin: 0 }}>
            도메인을 입력하면 실제 AI 가시성 점수와 핵심 병목을 분석해드립니다
          </p>
        </button>

        <button onClick={() => onSelect(false)} className="vn-card" style={{
          width: "100%", textAlign: "left", cursor: "pointer", marginBottom: 32,
          transition: "all 150ms ease", border: "0.5px solid var(--velnoc-border)",
        }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--velnoc-oak)"; e.currentTarget.style.background = "var(--velnoc-oak-soft)"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--velnoc-border)"; e.currentTarget.style.background = "var(--velnoc-surface)"; }}
        >
          <p className="vn-micro" style={{ color: "var(--velnoc-oak)", marginBottom: 8 }}>OPTION 02</p>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--velnoc-ink-primary)", margin: "0 0 6px" }}>
            아직 사이트가 없습니다
          </h3>
          <p style={{ fontSize: 13, color: "var(--velnoc-ink-secondary)", lineHeight: 1.55, margin: 0 }}>
            경쟁사를 분석해서 시장의 AI 가시성 수준을 먼저 확인해드립니다
          </p>
        </button>

        <p className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)", textAlign: "center", opacity: 0.7 }}>
          무료  ·  약 5분 소요  ·  개인정보 별도 수집 없음
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Phase 2: 도메인 입력
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
    <div className="vn-root vn-fade-in vn-scroll" style={{ minHeight: "100vh", padding: "40px 24px 64px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
          <span className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)" }}>VELNOC</span>
          <span className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)" }}>분석 정보 입력</span>
        </div>

        <div style={{ marginBottom: 28 }}>
          <p className="vn-micro" style={{ color: "var(--velnoc-oak)", marginBottom: 12 }}>
            {hasOwnSite ? "OPTION 01" : "OPTION 02"}
          </p>
          <h2 className="vn-head" style={{ fontSize: 24, lineHeight: 1.3, margin: "0 0 8px" }}>
            {hasOwnSite ? "자사 정보를 알려주세요" : "분석할 경쟁사를 입력해주세요"}
          </h2>
          <p style={{ fontSize: 13, color: "var(--velnoc-ink-secondary)", lineHeight: 1.6, margin: 0 }}>
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
            <div className="vn-card" style={{ marginTop: 24, padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--velnoc-ink-primary)", margin: "0 0 4px" }}>경쟁사 (선택사항)</p>
              <p style={{ fontSize: 12, color: "var(--velnoc-ink-tertiary)", margin: "0 0 14px", lineHeight: 1.5 }}>
                입력하시면 무료 리포트에 비교 분석이 일부 포함됩니다
              </p>
              {[0, 1, 2].map((i) => (
                <input key={i} type="text" className="vn-input"
                  placeholder={`경쟁사 ${i + 1} 도메인 (예: competitor.com)`}
                  value={competitors[i] || ""}
                  onChange={(e) => updateCompetitor(i, e.target.value)}
                  style={{ marginBottom: i < 2 ? 8 : 0 }} />
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

        <div style={{ marginTop: 24, padding: "14px 16px", borderRadius: 6, background: "var(--velnoc-oak-soft)", border: "0.5px solid var(--velnoc-oak)" }}>
          <p className="vn-micro" style={{ color: "var(--velnoc-oak-deep)", marginBottom: 6 }}>ANALYSIS COVERAGE</p>
          <p style={{ fontSize: 12, color: "var(--velnoc-ink-primary)", lineHeight: 1.65, margin: 0 }}>
            <strong style={{ fontWeight: 600 }}>무료</strong>: AI 가시성 종합 점수 + 핵심 병목 3가지<br/>
            <strong style={{ fontWeight: 600 }}>유료 리포트</strong>: 전체 병목 + 경쟁사 정밀 비교 + 실행 가이드
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 32 }}>
          <button onClick={onBack} className="vn-btn-secondary" style={{ flex: 1 }}>← 처음으로</button>
          <button onClick={isValid ? onSubmit : undefined} disabled={!isValid} className="vn-btn-primary" style={{ flex: 2 }}>
            분석 시작 + 설문 진행 →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   분석 인디케이터
   ───────────────────────────────────────────────────────── */
function AnalysisIndicator({ status }) {
  if (status === "idle" || !status) return null;
  const config = {
    analyzing: { label: "도메인 분석 중", bg: "var(--velnoc-oak-soft)", color: "var(--velnoc-oak-deep)", border: "var(--velnoc-oak)", dot: true },
    complete: { label: "분석 완료 · 결과에 반영됩니다", bg: "var(--velnoc-oak-soft)", color: "var(--velnoc-oak-deep)", border: "var(--velnoc-oak)", dot: false },
    failed: { label: "일부 분석 항목 제한 (도메인 점검 후 재시도)", bg: "var(--velnoc-danger-soft)", color: "var(--velnoc-danger)", border: "var(--velnoc-danger)", dot: false },
  }[status];
  if (!config) return null;
  return (
    <div className="vn-fade-in" style={{
      padding: "8px 12px", borderRadius: 4, background: config.bg,
      border: `0.5px solid ${config.border}`, marginBottom: 16,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      {config.dot
        ? <span className="vn-dot-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: config.color }} />
        : <span style={{ fontSize: 10, color: config.color, lineHeight: 1 }}>✓</span>}
      <span className="vn-micro" style={{ color: config.color }}>{config.label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Phase 3: 설문 화면
   ───────────────────────────────────────────────────────── */
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
    <div className="vn-root vn-scroll" style={{ minHeight: "100vh", padding: "40px 24px 64px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)" }}>VELNOC</span>
          <span className="vn-micro vn-tabular" style={{ color: "var(--velnoc-ink-tertiary)" }}>
            {step + 1} / 4
          </span>
        </div>

        <AnalysisIndicator status={analysisStatus} />

        <div style={{ display: "flex", gap: 4, marginBottom: 36 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{
              flex: 1, height: 2, borderRadius: 1,
              background: i <= step ? "var(--velnoc-oak)" : "var(--velnoc-divider)",
              transition: "background 300ms ease",
            }} />
          ))}
        </div>

        <div key={`header-${animKey}`} className="vn-fade-in" style={{ marginBottom: 36 }}>
          <p className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)", marginBottom: 10 }}>STEP {sd.icon}</p>
          <h2 className="vn-head" style={{ fontSize: 28, lineHeight: 1.3, margin: "0 0 8px" }}>
            {sd.title}
          </h2>
          <p style={{ fontSize: 14, color: "var(--velnoc-ink-secondary)", lineHeight: 1.6, margin: 0 }}>
            {sd.sub}
          </p>
        </div>

        <div key={`questions-${animKey}`} className="vn-fade-in" style={{ marginBottom: 32 }}>
          {filteredQuestions.map((q, qi) => {
            if (q.showIf && !q.showIf(answers)) return null;
            const selectedSingle = answers[q.id];
            const selectedMulti = answers[q.id] || [];
            return (
              <div key={q.id} style={{ marginBottom: qi < filteredQuestions.length - 1 ? 32 : 0 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--velnoc-ink-primary)", margin: "0 0 4px", lineHeight: 1.5 }}>
                  {q.label}
                </p>
                {q.sublabel && <p style={{ fontSize: 12, color: "var(--velnoc-ink-tertiary)", margin: "0 0 12px", lineHeight: 1.5 }}>{q.sublabel}</p>}
                {!q.sublabel && <div style={{ marginBottom: 12 }} />}
                {q.options.map((opt) => {
                  const sel = q.type === "multi" ? selectedMulti.includes(opt.value) : selectedSingle === opt.value;
                  return <OptionButton key={opt.value} option={opt} selected={sel} isMulti={q.type === "multi"}
                    onClick={() => q.type === "multi" ? handleMulti(q.id, opt.value) : handleSingle(q.id, opt.value)} />;
                })}
                {q.optional && <p style={{ fontSize: 11, color: "var(--velnoc-ink-tertiary)", margin: "8px 0 0" }}>* 선택사항</p>}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onBack} className="vn-btn-secondary" style={{ flex: 1 }}>← 이전</button>
          <button onClick={isComplete ? (step === 3 ? onFinish : onNext) : undefined} disabled={!isComplete} className="vn-btn-primary" style={{ flex: 2 }}>
            {step === 3 ? "결과 보기" : "다음 →"}
          </button>
        </div>

        <p className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)", textAlign: "center", marginTop: 24, opacity: 0.6 }}>
          약 5분 소요 · 개인정보 별도 수집 없음
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Phase 4-A: A 분류 결과 화면 (danger 절제)
   ───────────────────────────────────────────────────────── */
function ChannelGuidanceCard({ channel }) {
  const g = CHANNEL_GUIDANCE[channel];
  if (!g) return null;
  return (
    <div className="vn-fade-in vn-card" style={{ marginBottom: 12 }}>
      <p className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)", marginBottom: 8 }}>CHANNEL</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--velnoc-ink-primary)", margin: "0 0 16px", lineHeight: 1.5 }}>
        {g.channelName}
      </p>

      <p className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)", marginBottom: 6 }}>RECOMMENDED EXPERT</p>
      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--velnoc-ink-primary)", margin: "0 0 20px", lineHeight: 1.5 }}>
        {g.expertType}
      </p>

      <div style={{ paddingTop: 16, borderTop: "0.5px solid var(--velnoc-divider)", marginBottom: 16 }}>
        <p className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)", marginBottom: 12 }}>전문가 점검 체크리스트</p>
        {g.checklist.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
            <span className="vn-micro vn-tabular" style={{ color: "var(--velnoc-ink-tertiary)", paddingTop: 2 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <p style={{ fontSize: 13, color: "var(--velnoc-ink-secondary)", lineHeight: 1.6, margin: 0 }}>{item}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 14px", borderRadius: 4, background: "var(--velnoc-oak-soft)" }}>
        <p className="vn-micro" style={{ color: "var(--velnoc-oak-deep)", marginBottom: 6 }}>↻ REVISIT</p>
        <p style={{ fontSize: 12, color: "var(--velnoc-ink-primary)", lineHeight: 1.6, margin: 0 }}>{g.revisit}</p>
      </div>
    </div>
  );
}

function ResultScreenTypeA({ result, onReset }) {
  const [showGuidance, setShowGuidance] = useState(false);
  const cfg = GRADE_CONFIG.A;
  const blockedChannels = result.blockedChannels || [];

  return (
    <div className="vn-root vn-fade-in vn-scroll" style={{ minHeight: "100vh", padding: "48px 24px 64px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <p className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)", textAlign: "center", marginBottom: 36 }}>
          VELNOC · 자가 진단 결과
        </p>

        {/* A 단독 배지 — danger 절제 */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center",
            padding: "28px 36px", borderRadius: 8, background: "var(--velnoc-danger-soft)",
            border: "0.5px solid var(--velnoc-danger)", marginBottom: 18, minWidth: 280,
          }}>
            <span className="vn-micro" style={{ color: "var(--velnoc-danger)", marginBottom: 14 }}>
              {cfg.badgeLabel}
            </span>
            <span className="vn-head" style={{
              fontSize: 26, fontWeight: 400, color: "var(--velnoc-ink-primary)",
              textAlign: "center", lineHeight: 1.3,
            }}>
              {cfg.typeName}
            </span>
          </div>
          <h1 className="vn-head" style={{ fontSize: 20, lineHeight: 1.4, margin: 0 }}>
            {cfg.headline}
          </h1>
        </div>

        {/* 분류 이유 */}
        {blockedChannels.length > 0 && (
          <div className="vn-card" style={{ marginBottom: 16, padding: "16px 20px" }}>
            <p className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)", marginBottom: 8 }}>왜 이 분류인가요?</p>
            <p style={{ fontSize: 13, color: "var(--velnoc-ink-primary)", lineHeight: 1.7, margin: 0 }}>
              선택하신 매출 채널이 <strong style={{ fontWeight: 600 }}>
              {blockedChannels.map((c) => ({ marketplace: "마켓플레이스", delivery: "배달앱", sns_dm: "SNS DM" })[c]).filter(Boolean).join(" · ")}
              </strong> 중심이라, AI 검색 최적화(SEO·AEO·GEO)보다 각 채널 내 최적화 전략이 훨씬 효과적입니다.
            </p>
          </div>
        )}

        {/* 설명 카드 */}
        <div className="vn-card" style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 14, color: "var(--velnoc-ink-secondary)", lineHeight: 1.75, margin: 0 }}>
            {cfg.body}
          </p>
        </div>

        {/* CTA — 펼치기 */}
        {!showGuidance ? (
          <>
            <button onClick={() => setShowGuidance(true)} className="vn-btn-secondary" style={{ marginBottom: 10 }}>
              {cfg.cta} ↓
            </button>
            <p style={{ fontSize: 12, color: "var(--velnoc-ink-tertiary)", textAlign: "center", margin: "0 0 36px", lineHeight: 1.6 }}>
              {cfg.note}
            </p>
          </>
        ) : (
          <div className="vn-fade-in" style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)" }}>EXPERT GUIDANCE</span>
              <div style={{ flex: 1, height: 1, background: "var(--velnoc-divider)" }} />
              <span className="vn-micro vn-tabular" style={{ color: "var(--velnoc-ink-tertiary)" }}>{blockedChannels.length}개 채널</span>
            </div>
            {blockedChannels.map((ch) => <ChannelGuidanceCard key={ch} channel={ch} />)}
            <div style={{ padding: "14px 16px", borderRadius: 6, background: "var(--velnoc-oak-soft)", marginTop: 8 }}>
              <p style={{ fontSize: 12, color: "var(--velnoc-ink-primary)", lineHeight: 1.65, margin: 0 }}>
                벨녹은 특정 대행사를 추천하지 않습니다. <strong style={{ fontWeight: 600 }}>전문가를 고를 때 위의 점검 항목을 활용하세요.</strong> 그 후 자사 채널이 성장하면 벨녹 진단을 다시 받아보세요.
              </p>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={onReset} style={{
            background: "none", border: "none", fontSize: 12, color: "var(--velnoc-ink-tertiary)",
            cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, padding: 8,
            fontFamily: "var(--font-body)",
          }}>처음부터 다시 진단하기</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Phase 4-B: STAGE 결과 화면 (B~F, oak 단일)
   ───────────────────────────────────────────────────────── */
function ResultScreenStage({ result, analysis, hasOwnSite, onReset }) {
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
  const getAILabel = (s) => s >= 75 ? "양호" : s >= 50 ? "주의" : s >= 25 ? "위험" : "심각";

  return (
    <div className="vn-root vn-fade-in vn-scroll" style={{ minHeight: "100vh", padding: "48px 24px 64px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <p className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)", textAlign: "center", marginBottom: 32 }}>
          VELNOC · 자가 진단 결과
        </p>

        {/* STAGE 스펙트럼 — 모두 oak 톤, 활성만 강조 */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 10 }}>
            {STAGE_ORDER.map((g) => {
              const isActive = g === result.grade;
              const gcfg = GRADE_CONFIG[g];
              return (
                <div key={g} className="vn-tabular" style={{
                  width: 50, height: 36, borderRadius: 4,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: isActive ? 13 : 11,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--velnoc-oak)" : "var(--velnoc-ink-tertiary)",
                  background: isActive ? "var(--velnoc-oak-soft)" : "transparent",
                  border: `0.5px solid ${isActive ? "var(--velnoc-oak)" : "var(--velnoc-divider)"}`,
                  transition: "all 200ms ease",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.05em",
                }}>{gcfg.stage}</div>
              );
            })}
          </div>
          <p className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)", opacity: 0.5, marginBottom: 32 }}>
            VELNOC GROWTH STAGE
          </p>

          {/* 메인 배지 — Featured 카드 + Display 헤딩 */}
          <div className="vn-card-featured" style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center",
            padding: "24px 36px", marginBottom: 16, minWidth: 280,
          }}>
            <p className="vn-micro" style={{ color: "var(--velnoc-oak)", marginBottom: 14 }}>
              {cfg.badgeLabel}
            </p>
            <h1 className="vn-head" style={{
              fontSize: 28, fontWeight: 400, color: "var(--velnoc-ink-primary)",
              textAlign: "center", lineHeight: 1.25, margin: 0, marginBottom: 14,
            }}>
              {cfg.typeName}
            </h1>
            <p className="vn-micro" style={{
              color: "var(--velnoc-oak)", paddingTop: 14,
              borderTop: "0.5px solid var(--velnoc-divider)",
              alignSelf: "stretch", textAlign: "center",
            }}>
              {cfg.tag}
            </p>
          </div>

          <p style={{ fontSize: 13, color: "var(--velnoc-ink-tertiary)", margin: 0 }}>{cfg.name}</p>
        </div>

        {/* 설명 카드 */}
        <div className="vn-card" style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--velnoc-ink-primary)", margin: "0 0 12px", lineHeight: 1.5 }}>
            {cfg.headline}
          </h2>
          <p style={{ fontSize: 14, color: "var(--velnoc-ink-secondary)", lineHeight: 1.75, margin: 0 }}>
            {cfg.body}
          </p>

          {result.sensitivity && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "0.5px solid var(--velnoc-divider)" }}>
              <p style={{ fontSize: 13, color: "var(--velnoc-ink-secondary)", lineHeight: 1.65, margin: 0 }}>
                💡 대행사에서 결과를 못 받으셨다면, 그건 예산이 부족해서가 아닙니다. 채널과 시스템이 연결되지 않아서입니다.
              </p>
            </div>
          )}
        </div>

        {/* VELNOC IS DIFFERENT — Display Mode 1회 (시스템 PART 5-3 허용) */}
        <div style={{
          padding: "24px 22px", borderRadius: 8,
          background: "var(--velnoc-oak-soft)", marginBottom: 20,
          border: "0.5px solid var(--velnoc-oak)",
        }}>
          <p className="vn-micro" style={{ color: "var(--velnoc-oak-deep)", marginBottom: 14 }}>
            VELNOC IS DIFFERENT
          </p>
          <p style={{ fontSize: 13, color: "var(--velnoc-ink-secondary)", lineHeight: 1.75, margin: "0 0 12px" }}>
            다른 진단 도구는 <span style={{ color: "var(--velnoc-ink-tertiary)" }}>"AI에 보이나요?"</span>를 묻습니다.
          </p>
          <p className="vn-display" style={{
            fontSize: 22, color: "var(--velnoc-ink-primary)", lineHeight: 1.4, margin: 0,
          }}>
            "AI가 추천할 만큼<br />사업 구조가 정리되어 있나요?"
          </p>
          <p style={{ fontSize: 13, color: "var(--velnoc-ink-secondary)", margin: "12px 0 0", lineHeight: 1.6 }}>
            벨녹은 한 단계 더 들어가 그것을 봅니다.
          </p>
        </div>

        {/* AI 가시성 분석 */}
        {cfg.showAIBlock && analysis && analysis.status === "complete" && (
          <>
            <div className="vn-card" style={{ marginBottom: 14, padding: "24px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span className="vn-micro" style={{ color: "var(--velnoc-oak)" }}>AI VISIBILITY · 실시간 분석</span>
                <div style={{ flex: 1, height: 1, background: "var(--velnoc-divider)" }} />
              </div>

              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6, marginBottom: 6 }}>
                <span className="vn-tabular" style={{
                  fontSize: 56, fontWeight: 500, color: "var(--velnoc-oak)",
                  lineHeight: 1, fontFamily: "var(--font-body)",
                }}>{aiScore}</span>
                <span className="vn-tabular" style={{ fontSize: 18, color: "var(--velnoc-ink-tertiary)", fontWeight: 400 }}>/ 100</span>
              </div>
              <p style={{ textAlign: "center", fontSize: 13, fontWeight: 500, color: "var(--velnoc-ink-primary)", margin: "0 0 4px" }}>
                {getAILabel(aiScore)} 단계
              </p>
              <p className="vn-micro vn-tabular" style={{ textAlign: "center", color: "var(--velnoc-ink-tertiary)", opacity: 0.7 }}>
                {analysis.target}
              </p>

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "0.5px solid var(--velnoc-divider)" }}>
                <ScoreBar label="BOT ACCESS" val={Math.round(analysis.breakdown.botAccess / 10)} max={10} delay={0} />
                <ScoreBar label="SCHEMA STRUCTURE" val={Math.round(analysis.breakdown.schema / 10)} max={10} delay={150} />
                <ScoreBar label="META INFO" val={Math.round(analysis.breakdown.meta / 10)} max={10} delay={300} />
                <ScoreBar label="AI CITATION" val={Math.round(analysis.breakdown.citation / 10)} max={10} delay={450} />
              </div>
            </div>

            {/* 핵심 병목 */}
            {analysis.visibleBottlenecks && analysis.visibleBottlenecks.length > 0 && (
              <div className="vn-card" style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <span className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)" }}>
                    핵심 병목 {analysis.visibleBottlenecks.length}가지
                  </span>
                  <span className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)", opacity: 0.6 }}>FREE TIER</span>
                </div>
                {analysis.visibleBottlenecks.map((b, i) => {
                  const isCrit = b.severity === "critical";
                  return (
                    <div key={b.key} style={{
                      padding: "14px 16px", borderRadius: 6,
                      marginBottom: i < analysis.visibleBottlenecks.length - 1 ? 8 : 0,
                      background: isCrit ? "var(--velnoc-danger-soft)" : "var(--velnoc-stone)",
                      border: `0.5px solid ${isCrit ? "var(--velnoc-danger)" : "var(--velnoc-border)"}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span className="vn-micro" style={{
                          padding: "2px 6px", borderRadius: 3,
                          color: isCrit ? "var(--velnoc-danger)" : "var(--velnoc-ink-secondary)",
                          background: isCrit ? "rgba(185,28,28,0.1)" : "var(--velnoc-divider)",
                          fontSize: 10, letterSpacing: "0.1em",
                        }}>{isCrit ? "CRITICAL" : "WARNING"}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--velnoc-ink-primary)" }}>{b.title}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "var(--velnoc-ink-secondary)", lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
                    </div>
                  );
                })}
                {analysis.hiddenBottleneckCount > 0 && (
                  <div style={{
                    marginTop: 12, padding: "12px 14px", borderRadius: 6,
                    background: "var(--velnoc-stone)",
                    border: "0.5px dashed var(--velnoc-border-strong)",
                  }}>
                    <p style={{ fontSize: 12, color: "var(--velnoc-ink-secondary)", lineHeight: 1.6, margin: 0 }}>
                      <span className="vn-tabular" style={{ color: "var(--velnoc-oak)", fontWeight: 600 }}>+{analysis.hiddenBottleneckCount}개</span>의 추가 병목 항목 · 정밀 분석 · 수정 가이드가 <strong style={{ fontWeight: 600, color: "var(--velnoc-ink-primary)" }}>유료 리포트</strong>에서 공개됩니다
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 진단 점수 상세 */}
        <div className="vn-card" style={{ marginBottom: 20 }}>
          <p className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)", marginBottom: 18 }}>진단 점수 상세</p>
          {dims.map((d, i) => <ScoreBar key={d.label} {...d} delay={i * 100} />)}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, borderTop: "0.5px solid var(--velnoc-divider)" }}>
            <span className="vn-micro" style={{ color: "var(--velnoc-ink-tertiary)" }}>TOTAL SCORE</span>
            <span className="vn-tabular" style={{ fontSize: 14, fontWeight: 600, color: "var(--velnoc-oak)" }}>
              {result.T} <span style={{ color: "var(--velnoc-ink-tertiary)", fontWeight: 400 }}>/ 11</span>
            </span>
          </div>
        </div>

        {/* 유료 리포트 CTA */}
        {cfg.showAIBlock && analysis && analysis.status === "complete" && (
          <div className="vn-card-featured" style={{ marginBottom: 18 }}>
            <p className="vn-micro" style={{ color: "var(--velnoc-oak)", marginBottom: 12 }}>PAID REPORT</p>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--velnoc-ink-primary)", margin: "0 0 8px" }}>
              전체 병목 + 경쟁사 비교 + 실행 로드맵
            </h3>
            <p style={{ fontSize: 13, color: "var(--velnoc-ink-secondary)", lineHeight: 1.65, margin: "0 0 16px" }}>
              결제 시점에 추가 정밀 분석이 실행됩니다. PDF로 발송되며, 상담 계약 시 결제액 전액 환불됩니다.
            </p>
            <div style={{ fontSize: 12, color: "var(--velnoc-ink-secondary)", lineHeight: 2, marginBottom: 16 }}>
              <div>✓ 전체 병목 항목 {analysis.visibleBottlenecks.length + analysis.hiddenBottleneckCount}개 + 우선순위</div>
              <div>✓ Schema · robots.txt · 메타 수정 가이드</div>
              <div>✓ 경쟁사 정밀 비교 ({hasOwnSite ? "입력 시" : "포함"})</div>
              <div>✓ 단계별 실행 로드맵 (90일)</div>
              <div>✓ 상담 계약 시 결제액 환불</div>
            </div>
            <button className="vn-btn-primary">상세 리포트 결제하고 받기 →</button>
          </div>
        )}

        {/* 이메일 캡처 */}
        {cfg.showEmail && (
          <div className="vn-card" style={{ marginBottom: 16 }}>
            {!emailSent ? (
              <>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--velnoc-ink-primary)", margin: "0 0 4px" }}>
                  무료 진단 결과를 이메일로 받기
                </p>
                <p style={{ fontSize: 12, color: "var(--velnoc-ink-tertiary)", margin: "0 0 14px" }}>
                  결과 요약 + 단계별 가이드 무료 발송
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="email" className="vn-input" placeholder="이메일 주소 입력"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailSend()}
                    style={{ flex: 1 }} />
                  <button onClick={handleEmailSend} className="vn-btn-primary" style={{ width: "auto", padding: "11px 18px", flex: "none" }}>발송</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <p style={{ fontSize: 14, color: "var(--velnoc-ink-primary)", margin: "0 0 4px" }}>✓ 결과가 이메일로 발송되었습니다</p>
                <p style={{ fontSize: 12, color: "var(--velnoc-ink-tertiary)", margin: 0 }}>{email}</p>
              </div>
            )}
          </div>
        )}

        {/* 최종 CTA */}
        <button className="vn-btn-primary" style={{ marginBottom: 10 }}>{cfg.cta} →</button>
        <p style={{ fontSize: 12, color: "var(--velnoc-ink-tertiary)", textAlign: "center", margin: "0 0 36px", lineHeight: 1.6 }}>
          {cfg.note}
        </p>

        <div style={{ textAlign: "center" }}>
          <button onClick={onReset} style={{
            background: "none", border: "none", fontSize: 12, color: "var(--velnoc-ink-tertiary)",
            cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, padding: 8,
            fontFamily: "var(--font-body)",
          }}>처음부터 다시 진단하기</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   결과 라우터
   ───────────────────────────────────────────────────────── */
function ResultScreen({ result, analysis, hasOwnSite, onReset }) {
  if (result.grade === "A") {
    return <ResultScreenTypeA result={result} onReset={onReset} />;
  }
  return <ResultScreenStage result={result} analysis={analysis} hasOwnSite={hasOwnSite} onReset={onReset} />;
}

/* ─────────────────────────────────────────────────────────
   메인 컴포넌트
   ───────────────────────────────────────────────────────── */
export default function VelnocDiagnosisV7() {
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
      <style>{STYLES}</style>
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
        <ResultScreen result={result} analysis={analysisResult} hasOwnSite={hasOwnSite} onReset={reset} />
      )}
    </>
  );
}
