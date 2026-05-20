"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { track } from "@/lib/analytics";

type GradeKey = "A" | "B" | "C" | "D" | "E" | "F";
type StageGrade = Exclude<GradeKey, "A">;
type Answers = Record<string, string | string[] | undefined>;
type IndustryKey = "retail" | "fnb" | "professional" | "education" | "b2b" | "industrial";
type IndustryExample = { keyword: string; customerQuestion: string; desiredMention: string };
type SiteInputs = {
  domain: string;
  brand: string;
  keyword: string;
  customerQuestion: string;
  desiredMention: string;
  competitors: string[];
};
type Option = { label: string; value: string };
type Question = {
  id: string;
  label: string;
  sublabel?: string;
  type: "single" | "multi";
  optional?: boolean;
  showIf?: (answers: Answers) => boolean;
  options: Option[];
};
type StepData = { stepNum: number; title: string; sub: string; icon: string; questions: Question[] };
type LeadForm = { name: string; company: string; email: string; phone: string };
type ScoreResult = {
  grade: GradeKey;
  T: number;
  D: number;
  M: number;
  S: number;
  O: number;
  sensitivity: boolean;
  channelBlock: boolean;
  blockedChannels: string[];
};

const STEP_DATA: StepData[] = [
  {
    stepNum: 1,
    title: "사업 기본 정보",
    sub: "사업의 규모와 운영 기간을 알려주세요.",
    icon: "01",
    questions: [
      {
        id: "duration",
        label: "사업 운영 기간은?",
        type: "single",
        options: [
          { label: "1년 미만", value: "u1" },
          { label: "1 ~ 3년", value: "1_3" },
          { label: "3 ~ 7년", value: "3_7" },
          { label: "7년 이상", value: "o7" }
        ]
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
          { label: "답변하지 않겠습니다", value: "skip" }
        ]
      }
    ]
  },
  {
    stepNum: 2,
    title: "디지털 자산 점검",
    sub: "현재 어떤 채널을 갖고 계신가요?",
    icon: "02",
    questions: [
      {
        id: "website",
        label: "현재 고객이 확인할 수 있는 온라인 거점은?",
        type: "single",
        options: [
          { label: "홈페이지 없음", value: "none" },
          { label: "외부 플랫폼만 사용 (스마트스토어·네이버예약 등)", value: "platform" },
          { label: "자사 사이트 있음 (기본 수준)", value: "basic" },
          { label: "자사 사이트 있음 + 외부 플랫폼 사용", value: "site_platform" },
          { label: "자사 사이트 + 블로그/콘텐츠 정기 발행", value: "active" }
        ]
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
          { label: "SNS DM 직접 주문 (인스타·카카오채널)", value: "sns_dm" }
        ]
      },
      {
        id: "sns",
        label: "SNS 콘텐츠 운영 현황은?",
        type: "single",
        options: [
          { label: "운영하지 않음", value: "none" },
          { label: "간헐적 (월 1~2회 이하)", value: "occasional" },
          { label: "정기적 (주 1회 이상)", value: "regular" }
        ]
      }
    ]
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
          { label: "대행사를 통해 진행한 적 있음", value: "agency" }
        ]
      },
      {
        id: "seo_practice",
        label: "검색 노출 관련 작업 경험은?",
        type: "single",
        options: [
          { label: "해본 적 없음 / 관심 없었음", value: "none" },
          { label: "가끔 직접 검색해서 순위 확인", value: "check" },
          { label: "정기적으로 SEO 작업·순위 관리 진행", value: "active" }
        ]
      },
      {
        id: "agency_sat",
        label: "대행사 활용 결과 만족도는?",
        sublabel: "대행사 이용 경험이 있는 경우에만 답해주세요",
        type: "single",
        optional: true,
        showIf: (answers) => answerString(answers, "ads") === "agency",
        options: [
          { label: "만족스러운 결과를 얻었다", value: "satisfied" },
          { label: "보통 / 애매했다", value: "neutral" },
          { label: "불만족 — 돈만 쓰고 결과 없었다", value: "unsatisfied" }
        ]
      }
    ]
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
          { label: "알고 있고 직접 적용하고 있다", value: "2" }
        ]
      },
      {
        id: "aeo_geo",
        label: "AEO(AI 답변 최적화) · GEO(AI 검색 최적화)를 들어보셨나요?",
        type: "single",
        options: [
          { label: "둘 다 처음 듣는다", value: "0" },
          { label: "들어봤지만 잘 모른다", value: "1" },
          { label: "알고 있고 우리 사업에 중요하다고 느낀다", value: "2" }
        ]
      },
      {
        id: "ai_search",
        label: "ChatGPT · Perplexity 같은 AI 검색에서 본인 사업을 검색해보셨나요?",
        type: "single",
        options: [
          { label: "AI 검색 자체를 써본 적 없다", value: "0" },
          { label: "개인 용도로는 쓰지만 자사 검색은 안 했다", value: "1" },
          { label: "검색해봤는데 우리 사업이 안 나왔다", value: "2" },
          { label: "검색해봤고 일부 나왔다", value: "3" }
        ]
      }
    ]
  }
];

const GRADE_CONFIG: Record<
  GradeKey,
  {
    stage: string | null;
    badgeLabel: string;
    typeName: string;
    name: string;
    tag: string;
    headline: string;
    body: string;
    cta: string;
    note: string;
    showEmail: boolean;
  }
> = {
  A: {
    stage: null,
    badgeLabel: "ALTERNATIVE PATH",
    typeName: "플랫폼 의존형",
    name: "벨녹 영역 아님",
    tag: "솔직한 안내",
    headline: "지금은 플랫폼 내 경쟁이 더 우선인 단계입니다",
    body: "모든 사업자가 지금 GEO/AEO를 최우선으로 해야 하는 것은 아닙니다. 매출의 대부분이 마켓플레이스·배달앱·SNS DM 같은 외부 플랫폼 내부 검색에서 발생한다면, 지금은 플랫폼 내 노출·전환 최적화가 더 우선입니다. SEO·AEO·GEO는 자사 채널과 장기 브랜드 자산을 만들 준비가 됐을 때 비로소 효과를 냅니다.",
    cta: "맞는 전문가 유형 알아보기",
    note: "선택하신 채널에 맞는 전문가 유형과 점검 항목을 안내해드립니다.",
    showEmail: false
  },
  B: {
    stage: "01",
    badgeLabel: "STAGE.01",
    typeName: "디지털 시작형",
    name: "시작 단계",
    tag: "Site + Pulse 추천",
    headline: "보이는 채널을 처음 짓는 단계입니다",
    body: "AI에게 인용되려면 먼저 'AI가 읽을 수 있는 사이트'가 필요합니다. 지금은 검색 최적화보다 자사 채널을 만들고, 콘텐츠를 모으는 일이 먼저입니다. VELNOC Site로 첫 자산을 짓고, 구독 Pulse로 SEO의 출발점을 잡아가는 흐름을 권합니다.",
    cta: "구독 Pulse 알아보기  ·  월 19만원",
    note: "사이트 제작부터 함께 시작하는 옵션도 있습니다.",
    showEmail: true
  },
  C: {
    stage: "02",
    badgeLabel: "STAGE.02",
    typeName: "검색 기반 구축형",
    name: "기본 확보 단계",
    tag: "Pulse 추천",
    headline: "사이트는 있지만, 검색·AI는 아직 비어 있습니다",
    body: "구글·네이버 검색에서는 가끔 노출되더라도, ChatGPT·Perplexity 같은 AI 검색에는 거의 인용되지 않고 있을 가능성이 높습니다. 이 단계에서는 SEO를 정착시키고 AEO(AI 답변 최적화)의 첫 발자국을 찍는 일이 우선입니다. 구독 Pulse가 가장 적합한 진입점입니다.",
    cta: "구독 Pulse 알아보기  ·  월 19만원",
    note: "ROI 시뮬레이터에서 벨녹과 함께할 때의 변화를 확인하세요.",
    showEmail: true
  },
  D: {
    stage: "03",
    badgeLabel: "STAGE.03",
    typeName: "AI 가시성 확장형",
    name: "성장 단계",
    tag: "Signal 추천",
    headline: "검색을 넘어 AI 가시성으로 확장할 때입니다",
    body: "SEO 기반은 어느 정도 자리잡았지만, AEO·GEO와 운영 자동화가 더해지지 않으면 AI 시대의 검색에서는 여전히 후순위에 머무릅니다. 콘텐츠 전략·검색 데이터 분석·운영 자동화를 하나로 묶어 설계하는 구독 Signal이 지금 단계에 가장 맞습니다.",
    cta: "구독 Signal 알아보기  ·  월 59만원",
    note: "현재 진행 중인 마케팅과 어떻게 연결되는지 먼저 진단합니다.",
    showEmail: true
  },
  E: {
    stage: "04",
    badgeLabel: "STAGE.04",
    typeName: "운영 시스템화 후보",
    name: "본격 운영 단계",
    tag: "Engine 추천",
    headline: "채널은 많지만, 따로 돌고 있을 가능성이 큽니다",
    body: "SEO·AEO·GEO·자동화·콘텐츠가 각자 굴러가는 단계에서는 노력 대비 결과가 누수됩니다. 채널을 하나의 엔진으로 통합해 운영을 시스템화해야 다음 레벨로 갑니다. 구독 Engine 또는 Studio(단발 설계 프로젝트)로 통합 설계를 시작하세요.",
    cta: "구독 Engine 알아보기  ·  월 169만원",
    note: "Studio(단발 설계 프로젝트) 옵션도 함께 안내드립니다.",
    showEmail: true
  },
  F: {
    stage: "05",
    badgeLabel: "STAGE.05",
    typeName: "산업 OS 후보",
    name: "OS 후보",
    tag: "별도 상담",
    headline: "마케팅이 아니라, 운영체제 자체를 다시 짤 때입니다",
    body: "단순 SEO·광고를 넘어 사업 운영 전체의 디지털 아키텍처를 재설계해야 하는 단계입니다. VELNOC OS는 업종 특화 운영 시스템을 처음부터 설계·구축하는 상위 프로젝트입니다. 범위와 견적은 별도 상담을 통해 산정합니다.",
    cta: "VELNOC OS 상담 신청하기",
    note: "현재 운영 구조 분석부터 무료로 시작합니다.",
    showEmail: true
  }
};

const STAGE_ORDER: StageGrade[] = ["B", "C", "D", "E", "F"];
type DiagnosisStageDetail = {
  label: string;
  name: string;
  headline: string;
  desc: string;
  nextStep: string;
  productLabel: string;
  gauge: string;
  details: string;
};

const DIAGNOSIS_STAGE_DETAILS: Record<StageGrade, DiagnosisStageDetail> = {
  B: {
    label: "STAGE 01 · 광고 100% · 자력 0%",
    name: "광고에만 의존",
    headline: "내 돈을 태워야만 손님이 들어오는 상태.",
    desc: "광고를 멈추는 순간 유입도 매출도 같이 멈춥니다. 매달 쓰는 돈이 자산으로 남지 않습니다.",
    nextStep: "먼저 우리 사업 정보를 검색이 읽을 수 있게 정리해야 합니다.",
    productLabel: "권장 시작점 · 무료 단계 진단부터",
    gauge: "광고 의존도 — 100% / 0%",
    details: `지금 이 단계에서 일어나는 일

광고 플랫폼이 매월 유입을 대신 만들어줍니다.
하지만 사이트 자체는 검색엔진과 AI에게 아직 낯선 가게로 남아 있습니다.
도메인 권위가 쌓이지 않고, 사업 정보도 구조화되어 있지 않아 AI가 이해할 단서가 부족합니다.

벨녹이 1단계에서 시작하는 일

① 도메인·페이지 구조 측정
② AI가 읽을 수 있는 메타데이터와 구조화 데이터 정비
③ 검색 노출의 기준선을 잡는 SEO 풀세팅

검색이 우리 사업을 인식해야, AI도 우리 사업을 후보에 넣기 시작합니다.`
  },
  C: {
    label: "STAGE 02 · 광고 80% · 자력 20%",
    name: "검색에 처음 보임",
    headline: "광고 없이도 한두 명씩 들어오기 시작한 상태.",
    desc: "첫 신호는 보이지만, 광고를 끄면 여전히 매출은 흔들립니다. 자산이 시작됐을 뿐 아직 자라지는 않고 있습니다.",
    nextStep: "이제 어떤 손님이, 어떤 검색어로 들어오는지 읽기 시작해야 합니다.",
    productLabel: "권장 제품 · Pulse 월 19만 원",
    gauge: "광고 의존도 — 80% / 20%",
    details: `지금 이 단계에서 일어나는 일

사이트 정보가 검색엔진에 인식되면서, 우리 가게 이름이나
업종 키워드로 들어오는 유입이 한두 명씩 나타납니다.
아직 우연에 가까운 노출이라 매출에 미치는 영향은 작지만,
광고가 만들지 않은 첫 손님이 생겼다는 것이 이 단계의 본질입니다.

벨녹이 2단계에서 하는 일

① 검색 유입 모니터링 — 어떤 키워드로 들어오는지 매주 확인
② AI 언급 신호 확인 — ChatGPT·Perplexity 등에서 우리 사업이 언급되는지 추적
③ 콘텐츠·메타데이터 미세 조정

신호를 측정하기 시작해야, 신호를 키우는 단계로 갈 수 있습니다.`
  },
  D: {
    label: "STAGE 03 · 광고 60% · 자력 40%",
    name: "검색 흐름이 보임",
    headline: "어떤 손님이, 어떤 검색어로 들어오는지 보이기 시작한 상태.",
    desc: "흐름은 보이지만, 아직 그 흐름을 키우는 방법은 모릅니다. 데이터만 쌓이고 매출은 천천히 움직입니다.",
    nextStep: "보이는 검색어를 콘텐츠로 키워야 합니다.",
    productLabel: "권장 제품 · Signal 월 59만 원",
    gauge: "광고 의존도 — 60% / 40%",
    details: `지금 이 단계에서 일어나는 일

검색 유입이 한두 명씩 들어오던 단계를 지나, 어떤 검색어가
반복적으로 우리 사이트로 사람을 데려오는지 데이터가 쌓입니다.
어떤 페이지가 잘 읽히고, 어떤 페이지에서 손님이 떠나는지도 보입니다.
처음으로 우리 사업이 검색 안에서 어떤 모습으로 존재하는지 그림이 나오기 시작합니다.

벨녹이 3단계에서 하는 일

① 검색 데이터 정기 분석 — 검색어·페이지·문의 흐름 매주 정리
② 키워드 전략 수립 — 우리 사업이 차지할 검색어를 선정하고 우선순위 설계
③ 콘텐츠 풀세팅 — 선정한 검색어를 우리 사이트 안에 자산으로 쌓는 작업

이 흐름이 쌓이면, 광고를 조금 줄여도 매출이 덜 흔들리는 4단계로 넘어갈 수 있습니다.`
  },
  E: {
    label: "STAGE 04 · 광고 30% · 자력 70%",
    name: "검색 자산이 쌓임",
    headline: "광고를 줄여도 손님이 끊기지 않는 상태.",
    desc: "검색에서는 자리를 잡았지만, AI가 먼저 추천하는 자리까지는 아직 가지 못했습니다. 쌓인 자산을 AI가 읽을 수 있게 연결해야 합니다.",
    nextStep: "이제 AI가 우리 사업을 후보가 아니라 신뢰할 수 있는 출처로 읽게 만들어야 합니다.",
    productLabel: "권장 제품 · Engine 월 169만 원",
    gauge: "광고 의존도 — 30% / 70%",
    details: `지금 이 단계에서 일어나는 일

3단계에서 키운 콘텐츠와 검색어가 우리 사이트 안에 자산으로
쌓이면서, 광고를 줄여도 유입이 일정 수준 유지됩니다.
사장님이 처음으로 광고 예산을 의식적으로 조정할 수 있는 단계입니다.
한편 AI는 우리 사업을 인식하긴 하지만, 아직 다른 출처와 동등한
후보 중 하나로만 다룹니다. 먼저 추천되는 출처는 따로 있습니다.

벨녹이 4단계에서 하는 일

① 경쟁사 추적 — 같은 검색어에서 누가 어떤 콘텐츠로 우리를 앞서는지 매주 점검
② AI 인용 추적 — ChatGPT·Perplexity·Gemini 답변에서 우리 사업이 어떻게 인용되는지 추적
③ 인용 신뢰 신호 강화 — 외부 평판·구조화 데이터·일관성 보강

이 작업이 누적되면, AI가 우리 사업을 후보 중 하나가 아니라 신뢰할 수 있는 출처로 읽기 시작합니다.`
  },
  F: {
    label: "STAGE 05 · 광고 10% · 자력 90%",
    name: "AI가 먼저 추천함",
    headline: "사장님이 잠든 사이에도, AI가 우리 사업을 추천 후보로 꺼내는 상태.",
    desc: "이 단계의 위험은 멈춤입니다. 시장과 AI의 기준은 계속 바뀌고, 한 번 만든 추천 자리는 관리하지 않으면 다른 사업이 채워갑니다.",
    nextStep: "이제부터는 다음 단계가 아니라, 이 자리를 지키는 운영이 필요합니다.",
    productLabel: "권장 제품 · Engine 월 169만 원",
    gauge: "광고 의존도 — 10% / 90%",
    details: `이 단계가 의미하는 것

검색은 우리 사업을 후보로 보여주는 자리,
AI는 우리 사업을 답으로 제시하는 자리입니다.
5단계는 두 자리를 모두 차지한 상태입니다.
누군가가 우리 업종을 검색해도, ChatGPT에 물어봐도,
우리 사업이 신뢰할 수 있는 출처로 함께 나옵니다.

벨녹이 5단계에서 하는 일

① 자리 유지 — 검색 순위와 AI 인용 위치를 주간 단위로 점검·방어
② 인용 패턴 분석 — AI가 어떤 맥락에서 우리 사업을 꺼내는지 읽고, 약한 맥락을 보강
③ 변화 대응 — 검색 알고리즘과 AI 모델 업데이트에 맞춰 신호와 콘텐츠를 재정렬

여기서 사장님은 더 이상 광고에 끌려다니지 않습니다.
광고는 필요할 때 켜는 선택지가 되고, 사업은 시장 안에서 스스로 자라기 시작합니다.`
  }
};
const PLACEHOLDER_TYPE_DELAY = 95;
const PLACEHOLDER_PAUSE_DELAY = 1700;
const DEFAULT_COMPETITORS = ["", ""];
const DOMAIN_MIN_LENGTH = 4;
const CUSTOMER_QUESTION_MIN_LENGTH = 8;
const COMPARISON_TARGET_MIN_LENGTH = 2;
const OWN_SITE_WEBSITE_VALUES = ["basic", "site_platform", "active"];
const NO_SITE_WEBSITE_VALUES = ["none", "platform"];

const INDUSTRY_OPTIONS: Array<Option & { value: IndustryKey }> = [
  { label: "소매 판매 (온·오프라인)", value: "retail" },
  { label: "F&B / 식음료", value: "fnb" },
  { label: "전문 서비스 (법무·세무·의료·컨설팅)", value: "professional" },
  { label: "교육 · 코칭 · 강의", value: "education" },
  { label: "B2B 서비스 · 제품", value: "b2b" },
  { label: "산업 특화 (제조·농업·물류·건설)", value: "industrial" }
];

const INDUSTRY_EXAMPLES: Record<IndustryKey, IndustryExample[]> = {
  retail: [
    {
      keyword: "온라인 쇼핑몰, 로컬 편집샵",
      customerQuestion: "30대 여성이 선물하기 좋은 감각적인 편집샵 추천해줘",
      desiredMention: "브랜드 스토리가 탄탄한 온라인 편집샵은 어디야?"
    },
    {
      keyword: "스마트스토어, 생활용품",
      customerQuestion: "신혼집에 어울리는 실용적인 생활용품 브랜드 추천해줘",
      desiredMention: "품질 좋은 생활용품을 판매하는 국내 쇼핑몰은?"
    },
    {
      keyword: "반려동물 용품, 자체몰",
      customerQuestion: "강아지 피부에 자극 적은 샴푸 브랜드 알려줘",
      desiredMention: "반려동물 용품을 믿고 살 수 있는 자체몰은?"
    },
    {
      keyword: "프리미엄 식품몰, 선물세트",
      customerQuestion: "명절 선물로 고급스러운 식품 세트 추천해줘",
      desiredMention: "기업 선물용 식품 세트를 잘 구성하는 브랜드는?"
    }
  ],
  fnb: [
    {
      keyword: "한식 다이닝, 가족 모임",
      customerQuestion: "강남에서 부모님 모시고 갈 조용한 한식집 추천해줘",
      desiredMention: "상견례나 가족 모임에 좋은 한식 다이닝은 어디야?"
    },
    {
      keyword: "디저트 카페, 예약",
      customerQuestion: "성수에서 분위기 좋고 디저트 맛있는 카페 알려줘",
      desiredMention: "기념일 케이크 예약하기 좋은 디저트 카페는?"
    },
    {
      keyword: "비건 레스토랑, 건강식",
      customerQuestion: "서울에서 비건 메뉴가 잘 갖춰진 레스토랑 추천해줘",
      desiredMention: "비건 고객도 편하게 갈 수 있는 건강식 식당은?"
    },
    {
      keyword: "로컬 맛집, 점심 회식",
      customerQuestion: "여의도에서 점심 회식하기 좋은 식당 어디야?",
      desiredMention: "직장인 회식 장소로 추천할 만한 로컬 맛집은?"
    }
  ],
  professional: [
    {
      keyword: "세무 기장, 스타트업",
      customerQuestion: "스타트업 세무 기장 믿고 맡길 곳 추천해줘",
      desiredMention: "초기 스타트업을 잘 이해하는 세무사는 누구야?"
    },
    {
      keyword: "노무 컨설팅, 근로계약",
      customerQuestion: "직원 채용 전에 노무 리스크 점검해주는 곳 있어?",
      desiredMention: "소규모 사업장 노무 세팅을 잘하는 전문가 추천해줘"
    },
    {
      keyword: "병원 마케팅, 개원 컨설팅",
      customerQuestion: "개원 병원 온라인 마케팅은 어디에 맡기면 좋아?",
      desiredMention: "의료 광고 규정을 잘 아는 병원 마케팅 회사는?"
    },
    {
      keyword: "법률 상담, 계약서 검토",
      customerQuestion: "서비스 계약서 검토 빠르게 해주는 변호사 추천해줘",
      desiredMention: "IT 계약서 검토 경험 많은 법률 사무소는 어디야?"
    }
  ],
  education: [
    {
      keyword: "영어 회화 코칭, 직장인",
      customerQuestion: "직장인 영어 회화 코칭 잘하는 곳 어디야?",
      desiredMention: "바쁜 직장인에게 맞는 영어 코칭 프로그램 추천해줘"
    },
    {
      keyword: "수학 학원, 중학생",
      customerQuestion: "중학생 내신 수학을 꼼꼼하게 봐주는 학원 추천해줘",
      desiredMention: "성적 관리와 학습 습관을 같이 잡아주는 수학 학원은?"
    },
    {
      keyword: "온라인 강의, 커리어 전환",
      customerQuestion: "비전공자가 데이터 분석을 배울 수 있는 강의 추천해줘",
      desiredMention: "커리어 전환용 실무 교육을 잘하는 온라인 강의는?"
    },
    {
      keyword: "코칭, 자격증 준비",
      customerQuestion: "혼자 공부하기 어려운 자격증 준비를 도와주는 코치 있어?",
      desiredMention: "자격증 합격 계획을 같이 짜주는 교육 서비스는?"
    }
  ],
  b2b: [
    {
      keyword: "B2B SaaS, 전환율 개선",
      customerQuestion: "B2B SaaS 홈페이지 전환율 개선 잘하는 팀은?",
      desiredMention: "B2B 리드 확보용 웹사이트를 잘 설계하는 회사는?"
    },
    {
      keyword: "업무 자동화, 내부 운영",
      customerQuestion: "소규모 팀 업무 자동화 구축은 어디에 맡기면 좋아?",
      desiredMention: "운영 프로세스 자동화를 끝까지 설계해주는 팀은?"
    },
    {
      keyword: "CRM 구축, 세일즈 파이프라인",
      customerQuestion: "영업팀 CRM 세팅과 파이프라인 관리를 도와주는 곳은?",
      desiredMention: "B2B 세일즈 운영 시스템을 잘 만드는 컨설팅사는?"
    },
    {
      keyword: "AI 도입 컨설팅, 생산성",
      customerQuestion: "회사에 AI를 실무적으로 도입하려면 어디서 시작해야 해?",
      desiredMention: "중소기업 AI 전환을 현실적으로 도와주는 파트너는?"
    }
  ],
  industrial: [
    {
      keyword: "스마트팜, 운영 자동화",
      customerQuestion: "스마트팜 운영 자동화 구축 사례 있는 업체는?",
      desiredMention: "농장 운영 데이터를 시스템화해주는 개발사는?"
    },
    {
      keyword: "제조 공정 관리, 재고",
      customerQuestion: "소규모 제조업 재고와 생산 일정을 관리할 방법 알려줘",
      desiredMention: "제조 현장에 맞는 운영 관리 시스템을 만드는 곳은?"
    },
    {
      keyword: "물류 관리, 배차 자동화",
      customerQuestion: "물류 배차와 입출고 관리를 자동화하려면 어디가 좋아?",
      desiredMention: "물류 운영 자동화 경험이 있는 시스템 구축사는?"
    },
    {
      keyword: "건설 현장 관리, 보고 자동화",
      customerQuestion: "건설 현장 일일 보고를 쉽게 관리하는 방법 알려줘",
      desiredMention: "현장 보고와 문서 관리를 자동화해주는 업체는?"
    }
  ]
};

const CHANNEL_GUIDANCE = {
  marketplace: {
    channelName: "마켓플레이스 (쿠팡·네이버쇼핑·11번가 등)",
    expertType: "쇼핑몰 광고 대행사 / 마켓플레이스 운영 컨설턴트",
    checklist: [
      "광고 효율(ROAS)을 채널별로 분리해서 보여주는가",
      "상품 상세페이지 최적화와 키워드 전략을 함께 다루는가",
      "여러 마켓플레이스(쿠팡·네이버·11번가)를 통합 관리할 수 있는가",
      "정산·매입 데이터를 광고 결과와 연결해 분석하는가"
    ],
    revisit: "자사 채널(홈페이지·자체 쇼핑몰)의 매출 비중이 30% 이상이 되면 다시 진단받으세요."
  },
  delivery: {
    channelName: "배달앱 (배달의민족·요기요 등)",
    expertType: "배달앱 광고 대행사 / F&B 마케팅 컨설턴트",
    checklist: [
      "배민·요기요·쿠팡이츠 광고 노출 데이터를 함께 분석하는가",
      "메뉴 구성·가격 전략을 데이터 기반으로 제안하는가",
      "리뷰 관리·답글 운영 노하우를 갖고 있는가",
      "오프라인 매장 운영과 배달 운영의 균형을 이해하는가"
    ],
    revisit: "자사 예약·주문 채널을 구축하셨다면 다시 진단받으세요."
  },
  sns_dm: {
    channelName: "SNS DM 직접 주문 (인스타·카카오채널)",
    expertType: "SNS 콘텐츠 에이전시 / DM·메신저 CRM 전문가",
    checklist: [
      "콘텐츠 기획·제작·게시 전 과정을 다루는가",
      "DM 응대를 자동화·표준화하는 시스템을 제안하는가",
      "팔로워 단순 증가가 아니라 매출 전환까지 추적하는가",
      "여러 채널(인스타·카카오채널) 동시 관리가 가능한가"
    ],
    revisit: "콘텐츠 운영이 안정되고 자사 사이트를 구축하시면 다시 진단받으세요."
  }
} as const;

function answerString(answers: Answers, key: string) {
  const value = answers[key];
  return Array.isArray(value) ? "" : value || "";
}

function normalizeDomain(input: string) {
  return input.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
}

function normalizeComparisonTarget(input: string) {
  return input.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/.*$/, "");
}

function normalizeComparisonTargets(competitors: string[]) {
  return competitors.map((competitor) => normalizeComparisonTarget(competitor)).filter(Boolean);
}

function hasComparisonTarget(input: string) {
  return normalizeComparisonTarget(input).length >= COMPARISON_TARGET_MIN_LENGTH;
}

function domainRequirementMessage(input: string) {
  const normalized = normalizeDomain(input);
  if (normalized.length === 0) return "자사 도메인을 입력해주세요.";
  if (normalized.length < DOMAIN_MIN_LENGTH) return "도메인은 최소 4자 이상 입력해주세요.";
  return "";
}

function customerQuestionRequirementMessage(input: string) {
  const value = input.trim();
  if (value.length === 0) return "예상 고객이 AI에게 물을 질문을 입력해주세요.";
  if (value.length < CUSTOMER_QUESTION_MIN_LENGTH) return "질문은 최소 8자 이상 문장으로 입력해주세요.";
  return "";
}

function comparisonRequirementMessage(inputs: string[]) {
  if (inputs.some(hasComparisonTarget)) return "";
  const hasPartialInput = inputs.some((input) => normalizeComparisonTarget(input).length > 0);
  if (hasPartialInput) return "브랜드명 또는 도메인은 최소 2자 이상 입력해주세요.";
  return "비교 브랜드/사이트를 1곳 이상 입력해주세요.";
}

function surveyRequirementMessage(question: Question, answers: Answers) {
  if (question.optional) return "";
  const value = answers[question.id];
  const hasAnswer = Array.isArray(value) ? value.length > 0 : Boolean(value);
  return hasAnswer ? "" : "필수 문항입니다. 선택 후 다음 단계로 이동할 수 있습니다.";
}

function emailRequirementMessage(email: string) {
  const value = email.trim();
  if (!value) return "상세 진단 결과를 받을 이메일을 입력해주세요.";
  if (!value.includes("@") || !value.includes(".")) return "올바른 이메일 주소를 입력해주세요.";
  return "";
}

function isNoSiteWebsiteAnswer(value: string) {
  return NO_SITE_WEBSITE_VALUES.includes(value);
}

function getWebsiteOptions(question: Question, hasOwnSite: boolean) {
  const allowedValues = hasOwnSite ? OWN_SITE_WEBSITE_VALUES : NO_SITE_WEBSITE_VALUES;
  return question.options.filter((option) => allowedValues.includes(option.value));
}

function answerIndustry(answers: Answers): IndustryKey | null {
  const value = answerString(answers, "industry");
  return INDUSTRY_OPTIONS.some((option) => option.value === value) ? (value as IndustryKey) : null;
}

function getIndustryExamples(industry: IndustryKey | null) {
  return INDUSTRY_EXAMPLES[industry || "b2b"];
}

function useStreamingExample(examples: string[] | undefined) {
  const normalizedExamples = useMemo(() => {
    const filtered = (examples || []).map((example) => example.trim()).filter(Boolean);
    return filtered;
  }, [examples]);
  const hasStreamingExamples = normalizedExamples.length > 0;
  const [exampleIndex, setExampleIndex] = useState(() => Math.floor(Math.random() * 1000));
  const [visibleLength, setVisibleLength] = useState(0);
  const activeExample = hasStreamingExamples ? normalizedExamples[exampleIndex % normalizedExamples.length] : "";

  useEffect(() => {
    if (!hasStreamingExamples || !activeExample) return;

    const delay = visibleLength < activeExample.length ? PLACEHOLDER_TYPE_DELAY : PLACEHOLDER_PAUSE_DELAY;
    const timer = window.setTimeout(() => {
      if (visibleLength < activeExample.length) {
        setVisibleLength((current) => Math.min(current + 1, activeExample.length));
        return;
      }

      setExampleIndex((current) => (current + 1) % normalizedExamples.length);
      setVisibleLength(0);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [activeExample, hasStreamingExamples, normalizedExamples.length, visibleLength]);

  if (!hasStreamingExamples) return "";

  const streamingLength = Math.max(1, visibleLength);
  return activeExample.slice(0, streamingLength);
}

function calcScore(answers: Answers): ScoreResult {
  const industrySpecial = ["professional", "b2b", "industrial"].includes(answerString(answers, "industry"));
  const highRevenue = answerString(answers, "revenue") === "very_high";
  const channels = Array.isArray(answers.channel) ? answers.channel : [];
  const blockedChannels = channels.filter((channel) => ["marketplace", "delivery", "sns_dm"].includes(channel));
  const channelBlock = blockedChannels.length >= 2;
  const D = ({ none: 0, platform: 1, basic: 2, site_platform: 2, active: 3 } as Record<string, number>)[answerString(answers, "website")] ?? 0;
  const snsM = ({ none: 0, occasional: 0, regular: 1 } as Record<string, number>)[answerString(answers, "sns")] ?? 0;
  const adsM = ({ none: 0, self: 1, agency: 2 } as Record<string, number>)[answerString(answers, "ads")] ?? 0;
  const M = Math.min(snsM + adsM, 3);
  const sp = ({ none: 0, check: 1, active: 2 } as Record<string, number>)[answerString(answers, "seo_practice")] ?? 0;
  const sk = ({ "0": 0, "1": 0, "2": 1 } as Record<string, number>)[answerString(answers, "seo_know")] ?? 0;
  const ag = ({ "0": 0, "1": 0, "2": 1 } as Record<string, number>)[answerString(answers, "aeo_geo")] ?? 0;
  const ai = ({ "0": 0, "1": 0, "2": 1, "3": 2 } as Record<string, number>)[answerString(answers, "ai_search")] ?? 0;
  const S = Math.min(sp + sk + ag + ai, 3);
  const dO = ({ u1: 0, "1_3": 1, "3_7": 1, o7: 2 } as Record<string, number>)[answerString(answers, "duration")] ?? 0;
  const rO = ({ low: 0, mid: 0, high: 1, very_high: 1, skip: 0 } as Record<string, number>)[answerString(answers, "revenue")] ?? 0;
  const O = Math.min(dO + rO, 2);
  const T = D + M + S + O;
  const sensitivity = answerString(answers, "agency_sat") === "unsatisfied";

  let grade: GradeKey;
  if (channelBlock) grade = "A";
  else if (T >= 9 && (industrySpecial || highRevenue)) grade = "F";
  else if (T <= 2) grade = "B";
  else if (T <= 5) grade = "C";
  else if (T <= 7) grade = "D";
  else if (T <= 9) grade = "E";
  else grade = "F";

  return { grade, T, D, M, S, O, sensitivity, channelBlock, blockedChannels };
}


function TextInput({
  label,
  sublabel,
  value,
  onChange,
  placeholder,
  placeholderExamples,
  prefix,
  required,
  error,
  type = "text"
}: {
  label: string;
  sublabel?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  placeholderExamples?: string[];
  prefix?: string;
  required?: boolean;
  error?: string;
  type?: string;
}) {
  const inputId = useId();
  const [isFocused, setIsFocused] = useState(false);
  const streamingExample = useStreamingExample(placeholderExamples);
  const shouldShowStreamingExample = Boolean(streamingExample && !value && !isFocused);
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const describedBy = [sublabel ? helpId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <label className={`vn-field ${error ? "has-error" : ""}`}>
      <span className="vn-label">
        {label}
        {required && <span className="vn-required"> *</span>}
      </span>
      {sublabel && <span id={helpId} className="vn-help">{sublabel}</span>}
      <span className="vn-input-shell">
        {prefix && <span className="vn-input-prefix vn-tabular">{prefix}</span>}
        <input
          className={`vn-input ${prefix ? "vn-input-prefixed" : ""}`}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={shouldShowStreamingExample ? "" : placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
        {shouldShowStreamingExample && (
          <span
            className={`vn-stream-placeholder ${prefix ? "is-prefixed" : ""}`}
            aria-hidden="true"
          >
            {streamingExample.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="vn-stream-placeholder-char"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {char}
              </span>
            ))}
          </span>
        )}
      </span>
      {error && <span id={errorId} className="vn-field-error">{error}</span>}
    </label>
  );
}

function OptionButton({
  option,
  selected,
  onClick
}: {
  option: Option;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={`vn-option-btn ${selected ? "selected" : ""}`}>
      <span className={`vn-option-marker ${selected ? "selected" : ""}`} aria-hidden="true">
        {selected ? "✓" : ""}
      </span>
      <span>{option.label}</span>
    </button>
  );
}

function ScoreBar({ label, val, max }: { label: string; val: number; max: number }) {
  return (
    <div className="vn-score-row">
      <div className="vn-score-row-head">
        <span className="vn-micro vn-text-tertiary">{label}</span>
        <span className="vn-tabular vn-small">
          {val} <span className="vn-text-tertiary">/ {max}</span>
        </span>
      </div>
      <progress className="vn-score-meter" value={val} max={max} />
    </div>
  );
}

function IntroScreen({ onSelect }: { onSelect: (hasOwnSite: boolean) => void }) {
  return (
    <div className="vn-tool-screen vn-tool-screen-center">
      <div className="vn-tool-container vn-fade-in">
        <p className="vn-micro vn-text-tertiary vn-center">VELNOC · 자가 진단</p>
        <h1 className="vn-head vn-hero-title vn-center">
          AI가 당신의 비즈니스를
          <br />
          읽을 수 있나요?
        </h1>
        <p className="vn-body vn-center">
          <span className="vn-text-tertiary">&quot;AI에 보이나요?&quot;</span>를 넘어,
          <br />
          <strong>&quot;AI가 추천할 만큼 사업 구조가 정리되어 있나요?&quot;</strong>
          <br />
          <span className="vn-text-tertiary">를 진단합니다.</span>
        </p>

        <div className="vn-stack-lg">
          <div className="vn-stack">
            <button type="button" onClick={() => onSelect(true)} className="vn-card vn-click-card">
              <p className="vn-micro vn-text-oak">OPTION 01</p>
              <h2 className="vn-click-card-title">사이트 또는 브랜드가 있습니다</h2>
              <p className="vn-click-card-body">도메인과 현재 상황을 남기면 1차 분류 후 상세 진단으로 이어집니다</p>
            </button>
            <button type="button" onClick={() => onSelect(false)} className="vn-card vn-click-card">
              <p className="vn-micro vn-text-oak">OPTION 02</p>
              <h2 className="vn-click-card-title">아직 사이트가 없습니다</h2>
              <p className="vn-click-card-body">비교 브랜드와 현재 채널을 기준으로 시작 단계를 먼저 판단합니다</p>
            </button>
          </div>
          <p className="vn-micro vn-text-tertiary vn-center vn-muted">무료 · 약 5분 소요 · 개인정보 별도 수집 없음</p>
        </div>
      </div>
    </div>
  );
}

function IndustryScreen({
  selectedIndustry,
  onSelect,
  onBack
}: {
  selectedIndustry: IndustryKey | null;
  onSelect: (industry: IndustryKey) => void;
  onBack: () => void;
}) {
  return (
    <div className="vn-tool-screen">
      <div className="vn-tool-container vn-fade-in">
        <div className="vn-tool-header">
          <span className="vn-micro vn-text-tertiary">VELNOC</span>
          <span className="vn-micro vn-text-tertiary">업종 선택</span>
        </div>

        <div className="vn-panel-stack">
          <div>
            <p className="vn-micro vn-text-oak">STEP 00</p>
            <h1 className="vn-head vn-section-title">어떤 사업을 운영하고 계신가요?</h1>
            <p className="vn-body">업종을 먼저 선택하면, 다음 화면의 AI 질문 예시가 해당 사업 맥락에 맞게 바뀝니다.</p>
          </div>

          <div className="vn-stack">
            {INDUSTRY_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                option={option}
                selected={selectedIndustry === option.value}
                onClick={() => onSelect(option.value)}
              />
            ))}
          </div>
        </div>

        <div className="vn-actions">
          <button type="button" onClick={onBack} className="vn-btn-secondary">← 처음으로</button>
        </div>
      </div>
    </div>
  );
}

function DomainInputScreen({
  hasOwnSite,
  inputs,
  setInputs,
  industry,
  onBack,
  onSubmit
}: {
  hasOwnSite: boolean;
  inputs: SiteInputs;
  setInputs: Dispatch<SetStateAction<SiteInputs>>;
  industry: IndustryKey | null;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const competitors = inputs.competitors;
  const examples = useMemo(() => getIndustryExamples(industry), [industry]);
  const keywordExamples = useMemo(() => examples.map((example) => example.keyword), [examples]);
  const customerQuestionExamples = useMemo(() => examples.map((example) => example.customerQuestion), [examples]);
  const desiredMentionExamples = useMemo(() => examples.map((example) => example.desiredMention), [examples]);
  const domainError = hasOwnSite ? domainRequirementMessage(inputs.domain) : "";
  const customerQuestionError = customerQuestionRequirementMessage(inputs.customerQuestion);
  const comparisonError = hasOwnSite ? "" : comparisonRequirementMessage(competitors);
  const requiredErrors = [domainError, customerQuestionError, comparisonError].filter(Boolean);
  const isValid = requiredErrors.length === 0;
  const update = (key: keyof SiteInputs, value: string) => setInputs((prev) => ({ ...prev, [key]: value }));
  const updateCompetitor = (index: number, value: string) => {
    setInputs((prev) => {
      const next = [...prev.competitors];
      next[index] = value;
      return { ...prev, competitors: next };
    });
  };

  return (
    <div className="vn-tool-screen">
      <div className="vn-tool-container vn-fade-in">
        <div className="vn-tool-header">
          <span className="vn-micro vn-text-tertiary">VELNOC</span>
          <span className="vn-micro vn-text-tertiary">분석 정보 입력</span>
        </div>

        <div className="vn-panel-stack">
          <div>
            <p className="vn-micro vn-text-oak">{hasOwnSite ? "OPTION 01" : "OPTION 02"}</p>
            <h1 className="vn-head vn-section-title">{hasOwnSite ? "자사 정보를 알려주세요" : "비교할 브랜드/사이트를 알려주세요"}</h1>
            <p className="vn-body">
              {hasOwnSite
                ? "입력하신 도메인과 설문 답변을 바탕으로 1차 결과를 보여드리고, 상세 진단은 VELNOC가 직접 검토해 회신드립니다."
                : "관심 있는 비교 대상 1곳이면 충분합니다. 도메인을 모르면 브랜드명만 적어도 됩니다."}
            </p>
          </div>

          {hasOwnSite ? (
            <>
              <TextInput
                label="자사 도메인"
                sublabel="https:// 없이 입력해도 됩니다 · 최소 4자"
                value={inputs.domain}
                onChange={(value) => update("domain", value)}
                placeholder="velnoc.com"
                prefix="https://"
                required
                error={domainError}
              />
              <TextInput label="브랜드명" sublabel="AI 검색에서 검색되는 정확한 이름" value={inputs.brand} onChange={(value) => update("brand", value)} placeholder="브랜드명 입력" />
              <TextInput label="핵심 서비스 / 키워드" sublabel="고객이 우리 사업을 찾을 때 쓰는 표현" value={inputs.keyword} onChange={(value) => update("keyword", value)} placeholder="핵심 서비스 입력" placeholderExamples={keywordExamples} />
              <TextInput
                label="예상 고객이 AI에게 물을 법한 질문"
                sublabel="고객이 ChatGPT·Perplexity에 실제로 입력할 문장 · 최소 8자"
                value={inputs.customerQuestion}
                onChange={(value) => update("customerQuestion", value)}
                placeholder="고객 질문 입력"
                placeholderExamples={customerQuestionExamples}
                required
                error={customerQuestionError}
              />
              <TextInput
                label="어떤 질문에서 우리 브랜드가 나오길 바라나요?"
                sublabel="브랜드가 추천되길 원하는 맥락을 문장으로 적어주세요"
                value={inputs.desiredMention}
                onChange={(value) => update("desiredMention", value)}
                placeholder="희망 노출 질문 입력"
                placeholderExamples={desiredMentionExamples}
              />
              <div className="vn-card vn-card-tight">
                <p className="vn-label">비교 브랜드/사이트 (선택사항)</p>
                <p className="vn-help">도메인을 모르면 브랜드명만 적어도 됩니다</p>
                <div className="vn-input-list">
                  {competitors.map((competitor, index) => (
                    <input
                      key={index}
                      type="text"
                      className="vn-input"
                      placeholder={index === 0 ? "브랜드명 또는 도메인" : "추가 비교 대상 (선택)"}
                      value={competitor}
                      onChange={(event) => updateCompetitor(index, event.target.value)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <TextInput label="브랜드명 / 준비 중인 서비스명" value={inputs.brand} onChange={(value) => update("brand", value)} placeholder="브랜드명 입력" />
              <TextInput label="핵심 서비스 / 키워드" sublabel="고객이 우리 사업을 찾을 때 쓰는 표현" value={inputs.keyword} onChange={(value) => update("keyword", value)} placeholder="핵심 서비스 입력" placeholderExamples={keywordExamples} />
              <TextInput
                label="예상 고객이 AI에게 물을 법한 질문"
                sublabel="고객이 ChatGPT·Perplexity에 실제로 입력할 문장 · 최소 8자"
                value={inputs.customerQuestion}
                onChange={(value) => update("customerQuestion", value)}
                placeholder="고객 질문 입력"
                placeholderExamples={customerQuestionExamples}
                required
                error={customerQuestionError}
              />
              <TextInput
                label="어떤 질문에서 우리 브랜드가 나오길 바라나요?"
                sublabel="브랜드가 추천되길 원하는 맥락을 문장으로 적어주세요"
                value={inputs.desiredMention}
                onChange={(value) => update("desiredMention", value)}
                placeholder="희망 노출 질문 입력"
                placeholderExamples={desiredMentionExamples}
              />
              <TextInput
                label="비교 브랜드/사이트"
                sublabel="도메인을 모르면 브랜드명만 적어도 됩니다 · 최소 2자"
                value={competitors[0] || ""}
                onChange={(value) => updateCompetitor(0, value)}
                placeholder="브랜드명 또는 도메인"
                required
                error={comparisonError}
              />
              <TextInput
                label="추가 비교 대상"
                sublabel="선택사항 · 하나만 더 적어도 충분합니다"
                value={competitors[1] || ""}
                onChange={(value) => updateCompetitor(1, value)}
                placeholder="브랜드명 또는 도메인"
              />
            </>
          )}

          <div className="vn-callout vn-callout-oak">
            <p className="vn-micro vn-text-oak">DIAGNOSIS COVERAGE</p>
            <p className="vn-small">
              <strong>즉시 확인</strong>: A~F 단계 분류 + 추천 다음 행동
              <br />
              <strong>후속 회신</strong>: 도메인·비교 브랜드·AI 검색 가시성 검토 + 상담 제안
            </p>
          </div>

          {requiredErrors.length > 0 && (
            <div id="diagnosis-required-errors" className="vn-validation-callout" role="status" aria-live="polite">
              <p className="vn-micro vn-text-danger">필수 입력 확인</p>
              <p className="vn-small">아래 항목을 채우면 다음 단계로 이동할 수 있습니다.</p>
              <ul>
                {requiredErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="vn-actions">
          <button type="button" onClick={onBack} className="vn-btn-secondary">← 처음으로</button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!isValid}
            className="vn-btn-primary vn-actions-main"
            aria-describedby={!isValid ? "diagnosis-required-errors" : undefined}
          >
            정보 입력 완료 + 설문 진행 →
          </button>
        </div>
      </div>
    </div>
  );
}

function SurveyScreen({
  step,
  answers,
  setAnswers,
  onBack,
  onNext,
  onFinish,
  hasOwnSite
}: {
  step: number;
  answers: Answers;
  setAnswers: Dispatch<SetStateAction<Answers>>;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  hasOwnSite: boolean;
}) {
  const stepData = STEP_DATA[step];
  const questions = stepData.questions
    .map((question) => {
      if (question.id === "website") {
        return { ...question, options: getWebsiteOptions(question, hasOwnSite) };
      }
      return question;
    })
    .filter((question) => !question.showIf || question.showIf(answers));
  const isComplete = questions.every((question) => {
    if (question.optional) return true;
    const value = answers[question.id];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });
  const missingSurveyQuestions = questions.filter((question) => surveyRequirementMessage(question, answers));
  const handleSingle = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }));
  const handleMulti = (id: string, value: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[id]) ? prev[id] : [];
      return { ...prev, [id]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] };
    });
  };

  return (
    <div className="vn-tool-screen">
      <div className="vn-tool-container vn-fade-in">
        <div className="vn-tool-header">
          <span className="vn-micro vn-text-tertiary">VELNOC</span>
          <span className="vn-micro vn-tabular vn-text-tertiary">{step + 1} / 4</span>
        </div>
        <div className="vn-step-track" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <span key={index} className={`vn-step-segment ${index <= step ? "is-active" : ""}`} />
          ))}
        </div>

        <div className="vn-panel-stack">
          <div>
            <p className="vn-micro vn-text-tertiary">STEP {stepData.icon}</p>
            <h1 className="vn-head vn-section-title">{stepData.title}</h1>
            <p className="vn-body">{stepData.sub}</p>
          </div>

          <div className="vn-stack-lg">
            {questions.map((question) => {
              const answerValue = answers[question.id];
              const selectedMulti: string[] = Array.isArray(answerValue) ? answerValue : [];
              const selectedSingle = typeof answerValue === "string" ? answerValue : "";
              return (
                <fieldset key={question.id} className={`vn-fieldset ${surveyRequirementMessage(question, answers) ? "has-error" : ""}`}>
                  <legend>{question.label}</legend>
                  {question.sublabel && <p className="vn-help">{question.sublabel}</p>}
                  <div className="vn-stack">
                    {question.options.map((option) => {
                      const selected = question.type === "multi" ? selectedMulti.includes(option.value) : selectedSingle === option.value;
                      return (
                        <OptionButton
                          key={option.value}
                          option={option}
                          selected={selected}
                          onClick={() => (question.type === "multi" ? handleMulti(question.id, option.value) : handleSingle(question.id, option.value))}
                        />
                      );
                    })}
                  </div>
                  {question.optional && <p className="vn-help">* 선택사항</p>}
                  {surveyRequirementMessage(question, answers) && (
                    <p className="vn-fieldset-error">{surveyRequirementMessage(question, answers)}</p>
                  )}
                </fieldset>
              );
            })}
          </div>

          {missingSurveyQuestions.length > 0 && (
            <div id="survey-required-errors" className="vn-validation-callout" role="status" aria-live="polite">
              <p className="vn-micro vn-text-danger">필수 문항 확인</p>
              <p className="vn-small">아래 문항을 선택하면 다음 단계로 이동할 수 있습니다.</p>
              <ul>
                {missingSurveyQuestions.map((question) => (
                  <li key={question.id}>{question.label}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="vn-actions">
          <button type="button" onClick={onBack} className="vn-btn-secondary">← 이전</button>
          <button
            type="button"
            onClick={step === 3 ? onFinish : onNext}
            disabled={!isComplete}
            className="vn-btn-primary vn-actions-main"
            aria-describedby={!isComplete ? "survey-required-errors" : undefined}
          >
            {step === 3 ? "결과 보기" : "다음 →"}
          </button>
        </div>
        <p className="vn-micro vn-text-tertiary vn-center vn-muted">약 5분 소요 · 개인정보 별도 수집 없음</p>
      </div>
    </div>
  );
}

function ChannelGuidanceCard({ channel }: { channel: string }) {
  const guidance = CHANNEL_GUIDANCE[channel as keyof typeof CHANNEL_GUIDANCE];
  if (!guidance) return null;

  return (
    <div className="vn-card vn-fade-in">
      <p className="vn-micro vn-text-tertiary">CHANNEL</p>
      <h3 className="vn-click-card-title">{guidance.channelName}</h3>
      <p className="vn-micro vn-text-tertiary">RECOMMENDED EXPERT</p>
      <p className="vn-body">
        <strong>{guidance.expertType}</strong>
      </p>
      <div className="vn-checklist">
        <p className="vn-micro vn-text-tertiary">전문가 점검 체크리스트</p>
        {guidance.checklist.map((item, index) => (
          <div key={item} className="vn-checklist-row">
            <span className="vn-micro vn-tabular vn-text-tertiary">{String(index + 1).padStart(2, "0")}</span>
            <p className="vn-small vn-text-secondary">{item}</p>
          </div>
        ))}
      </div>
      <div className="vn-callout vn-callout-oak">
        <p className="vn-micro vn-text-oak">REVISIT</p>
        <p className="vn-small">{guidance.revisit}</p>
      </div>
    </div>
  );
}

function ResultScreenTypeA({ result, onReset }: { result: ScoreResult; onReset: () => void }) {
  const [showGuidance, setShowGuidance] = useState(false);
  const cfg = GRADE_CONFIG.A;
  const channelNames = result.blockedChannels
    .map((channel) => ({ marketplace: "마켓플레이스", delivery: "배달앱", sns_dm: "SNS DM" })[channel])
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="vn-tool-screen">
      <div className="vn-tool-container vn-fade-in">
        <p className="vn-micro vn-text-tertiary vn-center">VELNOC · 자가 진단 결과</p>
        <div className="vn-center">
          <div className="vn-result-badge-danger">
            <span className="vn-micro vn-text-danger">{cfg.badgeLabel}</span>
            <span className="vn-head vn-section-title">{cfg.typeName}</span>
          </div>
          <h1 className="vn-head vn-click-card-title">{cfg.headline}</h1>
        </div>

        <div className="vn-panel-stack">
          {result.blockedChannels.length > 0 && (
            <div className="vn-card vn-card-tight">
              <p className="vn-micro vn-text-tertiary">왜 이 분류인가요?</p>
              <p className="vn-small">
                선택하신 매출 채널이 <strong>{channelNames}</strong> 중심이라, AI 검색 최적화(SEO·AEO·GEO)보다 각 채널 내 최적화 전략이 훨씬 효과적입니다.
              </p>
            </div>
          )}
          <div className="vn-card">
            <p className="vn-body">{cfg.body}</p>
          </div>

          {!showGuidance ? (
            <>
              <button type="button" onClick={() => setShowGuidance(true)} className="vn-btn-secondary">{cfg.cta} ↓</button>
              <p className="vn-small vn-text-tertiary vn-center">{cfg.note}</p>
            </>
          ) : (
            <div className="vn-panel-stack vn-fade-in">
              <div className="vn-row-between">
                <span className="vn-micro vn-text-tertiary">EXPERT GUIDANCE</span>
                <span className="vn-divider" />
                <span className="vn-micro vn-tabular vn-text-tertiary">{result.blockedChannels.length}개 채널</span>
              </div>
              {result.blockedChannels.map((channel) => <ChannelGuidanceCard key={channel} channel={channel} />)}
              <div className="vn-callout vn-callout-oak">
                <p className="vn-small">벨녹은 특정 대행사를 추천하지 않습니다. <strong>전문가를 고를 때 위의 점검 항목을 활용하세요.</strong> 그 후 자사 채널이 성장하면 벨녹 진단을 다시 받아보세요.</p>
              </div>
            </div>
          )}

          <div className="vn-center">
            <button type="button" onClick={onReset} className="vn-reset-button">처음부터 다시 진단하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function stageResultLabel(detail: DiagnosisStageDetail) {
  return `${detail.label.split(" · ")[0]} · ${detail.name}`;
}

function stageResultHelper(grade: StageGrade) {
  if (grade === "B") return "출발선에서 한 칸을 만들어가는 게 첫 작업입니다.";
  if (grade === "F") return "다음 단계가 아니라, 이 자리를 지키는 운영이 시작됩니다.";
  return "다음 한 칸은 정해져 있습니다. 이전/다음 단계와 함께 살펴보세요.";
}

function stageServiceHref(grade: StageGrade) {
  if (grade === "D") return "/services#signal";
  if (grade === "E" || grade === "F") return "/services#engine";
  return "/services#pulse";
}

function StageTimeline({ grade }: { grade: StageGrade }) {
  const activeIndex = STAGE_ORDER.indexOf(grade);
  const previousGrade = activeIndex > 0 ? STAGE_ORDER[activeIndex - 1] : null;
  const nextGrade = activeIndex < STAGE_ORDER.length - 1 ? STAGE_ORDER[activeIndex + 1] : null;

  return (
    <div className="vn-stage-timeline" role="list" aria-label="이전 단계, 내 단계, 다음 단계">
      {previousGrade ? (
        <StageTimelineCard position="before" memoLabel="한 칸 전 단계" detail={DIAGNOSIS_STAGE_DETAILS[previousGrade]} />
      ) : (
        <StageBoundaryCard
          position="before"
          memoLabel="시작 지점"
          title="출발선"
          body="지금 사장님 사업은 출발선에 있습니다. 다음 한 칸부터 시작합니다."
        />
      )}

      <StageTimelineCard position="current" memoLabel="현재 사장님 단계" detail={DIAGNOSIS_STAGE_DETAILS[grade]} isCurrent />

      {nextGrade ? (
        <StageTimelineCard position="after" memoLabel="한 칸 다음 단계" detail={DIAGNOSIS_STAGE_DETAILS[nextGrade]} />
      ) : (
        <StageBoundaryCard
          position="after"
          memoLabel="이 자리를 지키는 일"
          title="자리 지키기"
          body="여기서부터는 다음 단계가 아니라, 이 자리를 지키는 운영이 필요합니다."
        />
      )}
    </div>
  );
}

function StageBoundaryCard({
  position,
  memoLabel,
  title,
  body
}: {
  position: "before" | "after";
  memoLabel: string;
  title: string;
  body: string;
}) {
  return (
    <article role="listitem" className={`vn-stage-timeline-card vn-stage-empty is-context is-${position}`}>
      <p className="vn-stage-memo">{memoLabel}</p>
      <h2 className="vn-stage-context-title">{title}</h2>
      <p className="vn-stage-context-headline">{body}</p>
    </article>
  );
}

function StageTimelineCard({
  position,
  memoLabel,
  detail,
  isCurrent = false
}: {
  position: "before" | "current" | "after";
  memoLabel: string;
  detail: DiagnosisStageDetail;
  isCurrent?: boolean;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailId = `stage-detail-${detail.label.slice(6, 8)}`;

  return (
    <article
      role="listitem"
      aria-current={isCurrent ? "step" : undefined}
      className={`vn-stage-timeline-card ${isCurrent ? "is-current" : "is-context"} is-${position}`}
    >
      <p className="vn-stage-memo">{memoLabel}</p>
      <p className="vn-stage-label">{detail.label}</p>
      <h2 className={isCurrent ? "vn-stage-current-title" : "vn-stage-context-title"}>
        <strong>{stageResultLabel(detail)}</strong>
      </h2>
      <p className={isCurrent ? "vn-stage-current-headline" : "vn-stage-context-headline"}>{detail.headline}</p>

      {isCurrent && (
        <div className="vn-stage-slot-list">
          <div>
            <p className="vn-micro vn-text-tertiary">왜 위험한가</p>
            <p className="vn-small vn-text-secondary">{detail.desc}</p>
          </div>
          <div className="vn-stage-next-box">
            <p className="vn-micro vn-text-oak">다음 단계</p>
            <p className="vn-small">{detail.nextStep}</p>
          </div>
          <p className="vn-small vn-text-secondary">
            <strong>{detail.productLabel}</strong>
          </p>
          <p className="vn-micro vn-tabular vn-text-tertiary">{detail.gauge}</p>
        </div>
      )}

      {isCurrent && (
        <div className="vn-stage-detail">
          <button
            type="button"
            className="vn-stage-detail-toggle"
            onClick={() => setDetailsOpen((current) => !current)}
            aria-expanded={detailsOpen}
            aria-controls={detailId}
          >
            <span>세부 사항</span>
            <span>{detailsOpen ? "접기 ▲" : "더 보기 ▼"}</span>
          </button>
          {detailsOpen && (
            <div id={detailId} className="vn-stage-detail-content">
              {detail.details.split("\n\n").map((block) => (
                <p key={block}>{block}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function ResultScreenStage({
  result,
  siteInputs,
  answers,
  hasOwnSite,
  onConsult
}: {
  result: ScoreResult;
  siteInputs: SiteInputs;
  answers: Answers;
  hasOwnSite: boolean;
  onConsult: () => void;
}) {
  const cfg = GRADE_CONFIG[result.grade];
  const stageGrade = result.grade as StageGrade;
  const stageDetail = DIAGNOSIS_STAGE_DETAILS[stageGrade];
  const currentStageLabel = stageResultLabel(stageDetail);
  const [form, setForm] = useState<LeadForm>({
    name: "",
    company: "",
    email: "",
    phone: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const siteMeta = {
    hasOwnSite,
    domain: normalizeDomain(siteInputs.domain),
    brand: siteInputs.brand.trim(),
    keyword: siteInputs.keyword.trim(),
    customerQuestion: siteInputs.customerQuestion.trim(),
    desiredMention: siteInputs.desiredMention.trim(),
    competitors: normalizeComparisonTargets(siteInputs.competitors)
  };
  const target = siteMeta.domain || siteMeta.competitors[0] || "도메인 미입력";
  const summary = `${cfg.name} / ${cfg.typeName} / 총점 ${result.T}/11 / ${target}`;
  const dims = [
    { label: "DIGITAL ASSET", val: result.D, max: 3 },
    { label: "MARKETING EXP", val: result.M, max: 3 },
    { label: "AI VISIBILITY", val: result.S, max: 3 },
    { label: "OPERATION SCALE", val: result.O, max: 2 }
  ];
  const leadEmailError = emailRequirementMessage(form.email);
  const canSubmit = !leadEmailError;
  const consultationType = "무료 상세 진단";
  const resultHelper = stageResultHelper(stageGrade);
  const updateForm = (key: keyof LeadForm, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "diagnosis",
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          grade: result.grade,
          consultationType,
          summary,
          metadata: {
            site: siteMeta,
            score: {
              grade: result.grade,
              T: result.T,
              D: result.D,
              M: result.M,
              S: result.S,
              O: result.O,
              sensitivity: result.sensitivity,
              channelBlock: result.channelBlock,
              blockedChannels: result.blockedChannels
            },
            result: {
              grade: result.grade,
              stage: cfg.stage,
              typeName: cfg.typeName,
              name: cfg.name,
              recommendation: cfg.cta
            },
            answers
          }
        })
      });
      if (response.ok) {
        setSubmitted(true);
        track("lead_submit", { source: "diagnosis", grade: result.grade });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="vn-tool-screen">
      <div className="vn-tool-container vn-fade-in">
        <p className="vn-micro vn-text-tertiary vn-center">진단 결과</p>

        <div className="vn-center">
          <h1 className="vn-head vn-section-title">
            사장님 사업은 지금 <strong className="vn-text-oak">{currentStageLabel}</strong> 단계입니다.
          </h1>
          <p className="vn-body vn-text-secondary">{resultHelper}</p>
        </div>

        <div className="vn-panel-stack">
          <StageTimeline grade={stageGrade} />

          <div className="vn-card">
            <h2 className="vn-click-card-title">{cfg.headline}</h2>
            <p className="vn-body">{cfg.body}</p>
            {result.sensitivity && (
              <div className="vn-callout">
                <p className="vn-small">대행사에서 결과를 못 받으셨다면, 그건 예산이 부족해서가 아닙니다. 채널과 시스템이 연결되지 않아서입니다.</p>
              </div>
            )}
          </div>

          <div className="vn-callout vn-callout-oak">
            <p className="vn-micro vn-text-oak">VELNOC IS DIFFERENT</p>
            <p className="vn-small vn-text-secondary">다른 진단 도구는 <span className="vn-text-tertiary">&quot;AI에 보이나요?&quot;</span>를 묻습니다.</p>
            <p className="vn-display">&quot;AI가 추천할 만큼<br />사업 구조가 정리되어 있나요?&quot;</p>
            <p className="vn-small vn-text-secondary">벨녹은 한 단계 더 들어가 그것을 봅니다.</p>
          </div>

          <div className="vn-card">
            <div className="vn-row-between">
              <span className="vn-micro vn-text-oak">상세 검토 대기</span>
              <span className="vn-divider" />
            </div>
            <h3 className="vn-click-card-title">도메인과 비교 브랜드 정보는 상담자가 직접 확인합니다</h3>
            <p className="vn-body">
              자동 점수를 흉내 내지 않고, 입력하신 사이트·브랜드·키워드·비교 대상·설문 답변을 묶어 검토합니다. 상세 진단을 신청하시면 24시간 안에 상세 진단 결과와 우선순위 개선 항목을 보내드립니다.
            </p>
            <ul className="vn-list-plain vn-small vn-text-secondary">
              <li>✓ 도메인 기본 구조와 검색 노출 신호 검토</li>
              <li>✓ AI 검색에서 브랜드·서비스가 읽히는 방식 점검</li>
              <li>✓ 비교 브랜드 대비 콘텐츠·채널 구조 비교</li>
              <li>✓ 지금 단계에서 먼저 고쳐야 할 3가지 제안</li>
            </ul>
          </div>

          <div className="vn-card">
            <p className="vn-micro vn-text-tertiary">진단 점수 상세</p>
            {dims.map((dim) => <ScoreBar key={dim.label} {...dim} />)}
            <div className="vn-row-between">
              <span className="vn-micro vn-text-tertiary">TOTAL SCORE</span>
              <span className="vn-tabular vn-text-oak">{result.T} <span className="vn-text-tertiary">/ 11</span></span>
            </div>
          </div>

          {cfg.showEmail && (
            <form id="diagnosis-lead-form" className="vn-card" onSubmit={(event) => void submitLead(event)}>
              {!submitted ? (
                <>
                  <p className="vn-label">무료 상세 진단 신청</p>
                  <p className="vn-help">1차 결과와 입력 정보를 함께 보내주시면, 24시간 안에 상세 진단 결과와 상담 방향을 회신드립니다.</p>
                  <div className="vn-input-list">
                    <input className="vn-input" type="text" placeholder="이름" value={form.name} onChange={(event) => updateForm("name", event.target.value)} />
                    <input className="vn-input" type="text" placeholder="회사명 / 브랜드명" value={form.company} onChange={(event) => updateForm("company", event.target.value)} />
                    <input
                      id="diagnosis-lead-email"
                      className="vn-input"
                      type="email"
                      placeholder="이메일 주소 *"
                      value={form.email}
                      onChange={(event) => updateForm("email", event.target.value)}
                      required
                      aria-invalid={Boolean(leadEmailError)}
                      aria-describedby={leadEmailError ? "lead-email-error" : undefined}
                    />
                    {leadEmailError && <span id="lead-email-error" className="vn-field-error">{leadEmailError}</span>}
                    <input className="vn-input" type="tel" placeholder="연락처 (선택)" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} />
                  </div>
                  {leadEmailError && (
                    <div id="lead-required-errors" className="vn-validation-callout" role="status" aria-live="polite">
                      <p className="vn-micro vn-text-danger">필수 입력 확인</p>
                      <p className="vn-small">{leadEmailError}</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className="vn-btn-primary"
                    aria-describedby={!canSubmit ? "lead-required-errors" : undefined}
                  >
                    {submitting ? "전송 중..." : "상세 진단 신청하기 →"}
                  </button>
                </>
              ) : (
                <div className="vn-center">
                  <p className="vn-label">✓ 상세 진단 신청이 접수되었습니다</p>
                  <p className="vn-help">{form.email}로 24시간 안에 상세 진단 결과를 보내드릴게요.</p>
                </div>
              )}
            </form>
          )}

          <a href={stageServiceHref(stageGrade)} className="vn-btn-primary">
            이 단계에서 같이 일할 수 있는 방법 보기 →
          </a>
          <button type="button" onClick={onConsult} className="vn-note-action">상담 시작</button>
          <p className="vn-small vn-text-tertiary vn-center">무료 · 5분 소요 · 연락처 없이 기본 결과 확인</p>
          <div className="vn-center">
            <Link href="/diagnosis" className="vn-reset-button">다시 진단하기</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiagnosisTool() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "industry" | "domain" | "survey" | "result">("intro");
  const [hasOwnSite, setHasOwnSite] = useState<boolean | null>(null);
  const [siteInputs, setSiteInputs] = useState<SiteInputs>({
    domain: "",
    brand: "",
    keyword: "",
    customerQuestion: "",
    desiredMention: "",
    competitors: [...DEFAULT_COMPETITORS]
  });
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const selectedIndustry = answerIndustry(answers);
  const result = useMemo(() => calcScore(answers), [answers]);

  useEffect(() => {
    if (phase !== "result" || result.grade === "A") return;
    const stageIndex = STAGE_ORDER.indexOf(result.grade as StageGrade);
    if (stageIndex < 0) return;
    localStorage.setItem("velnoc:userStage", String(stageIndex + 1));
  }, [phase, result.grade]);

  function handleIntroSelect(ownSite: boolean) {
    setHasOwnSite(ownSite);
    setPhase("industry");
    track("diagnosis_start", { has_site: ownSite });
  }

  function handleIndustrySelect(industry: IndustryKey) {
    setAnswers((prev) => ({ ...prev, industry }));
    setPhase("domain");
  }

  function handleDomainSubmit() {
    setAnswers((prev) => {
      if (hasOwnSite === false) {
        const currentWebsite = answerString(prev, "website");
        return { ...prev, website: isNoSiteWebsiteAnswer(currentWebsite) ? currentWebsite : "none" };
      }

      if (hasOwnSite === true && !OWN_SITE_WEBSITE_VALUES.includes(answerString(prev, "website"))) {
        const { website, ...rest } = prev;
        return rest;
      }

      return prev;
    });
    setPhase("survey");
  }

  function goNext() {
    if (step < 3) {
      track("diagnosis_step_complete", { step_number: step + 1 });
      setStep((current) => current + 1);
    }
  }

  function goFinish() {
    track("diagnosis_result", { grade: result.grade, score: result.T });
    setPhase("result");
  }

  function goBack() {
    if (step > 0) {
      setStep((current) => current - 1);
    } else {
      setPhase("domain");
    }
  }

  function reset() {
    setPhase("intro");
    setHasOwnSite(null);
    setSiteInputs({
      domain: "",
      brand: "",
      keyword: "",
      customerQuestion: "",
      desiredMention: "",
      competitors: [...DEFAULT_COMPETITORS]
    });
    setStep(0);
    setAnswers({});
  }

  if (phase === "intro") return <IntroScreen onSelect={handleIntroSelect} />;

  if (phase === "industry" && hasOwnSite !== null) {
    return (
      <IndustryScreen
        selectedIndustry={selectedIndustry}
        onSelect={handleIndustrySelect}
        onBack={() => setPhase("intro")}
      />
    );
  }

  if (phase === "domain" && hasOwnSite !== null) {
    return (
      <DomainInputScreen
        hasOwnSite={hasOwnSite}
        inputs={siteInputs}
        setInputs={setSiteInputs}
        industry={selectedIndustry}
        onBack={() => setPhase("industry")}
        onSubmit={handleDomainSubmit}
      />
    );
  }

  if (phase === "survey" && hasOwnSite !== null) {
    return (
      <SurveyScreen
        step={step}
        answers={answers}
        setAnswers={setAnswers}
        onBack={goBack}
        onNext={goNext}
        onFinish={goFinish}
        hasOwnSite={hasOwnSite}
      />
    );
  }

  if (phase === "result" && hasOwnSite !== null) {
    if (result.grade === "A") return <ResultScreenTypeA result={result} onReset={reset} />;
    return (
      <ResultScreenStage
        result={result}
        siteInputs={siteInputs}
        answers={answers}
        hasOwnSite={hasOwnSite}
        onConsult={() => router.push(result.grade === "F" ? "/contact?type=os" : "/contact")}
      />
    );
  }

  return <IntroScreen onSelect={handleIntroSelect} />;
}
