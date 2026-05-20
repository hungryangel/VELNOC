"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { track } from "@/lib/analytics";

const PRESETS = {
  none: { label: "홈페이지 없음", sub: "만들 예정", defaults: { hosting: 0, ads: 0, content: 0, tools: 0 } },
  websiteOnly: { label: "홈페이지만 있음", sub: "별도 마케팅 X", defaults: { hosting: 30000, ads: 0, content: 0, tools: 50000 } },
  withMarketing: { label: "홈페이지 + 마케팅", sub: "외주 병행", defaults: { hosting: 30000, ads: 1500000, content: 300000, tools: 100000 } },
  multipleVendors: { label: "여러 업체 동시", sub: "디자인·광고·콘텐츠 분리", defaults: { hosting: 50000, ads: 2500000, content: 800000, tools: 200000 } }
};

const INDUSTRIES = {
  medical: { label: "병원·의료미용", note: "강남 격전지, CPC 최고 수준", defaults: { hosting: 100000, ads: 8000000, content: 1000000, tools: 300000 }, inflation: 0.2 },
  legal: { label: "법무·세무", note: "경쟁 키워드 단가 폭증 중", defaults: { hosting: 50000, ads: 5000000, content: 300000, tools: 100000 }, inflation: 0.18 },
  realestate: { label: "부동산", note: "매물 광고 의존도 높음", defaults: { hosting: 50000, ads: 3000000, content: 500000, tools: 100000 }, inflation: 0.15 },
  saasB2b: { label: "IT · SaaS B2B", note: "콘텐츠 비중 큰 업종", defaults: { hosting: 100000, ads: 2000000, content: 1000000, tools: 500000 }, inflation: 0.12 },
  lodging: { label: "펜션 · 숙박", note: "OTA 수수료 별도", defaults: { hosting: 50000, ads: 1000000, content: 200000, tools: 50000 }, inflation: 0.1 },
  academy: { label: "학원 · 교육", note: "시즌별 광고 집중", defaults: { hosting: 30000, ads: 2000000, content: 300000, tools: 50000 }, inflation: 0.1 },
  fitness: { label: "헬스장 · 뷰티샵", note: "지역 검색 의존", defaults: { hosting: 30000, ads: 800000, content: 200000, tools: 50000 }, inflation: 0.08 },
  fnb: { label: "식당 · 카페", note: "리뷰·플랫폼 의존", defaults: { hosting: 30000, ads: 300000, content: 100000, tools: 30000 }, inflation: 0.05 }
};

const INFLATION_OPTIONS = [
  { value: 0, label: "정체", sub: "0%", desc: "광고비가 그대로 유지" },
  { value: 0.1, label: "현실적", sub: "+10%/년", desc: "업계 평균 인상률" },
  { value: 0.2, label: "고경쟁", sub: "+20%/년", desc: "의료·법무·강남 격전지" }
];

const VELNOC_MONTHLY = 190000;
const SINGLESHOT_INITIAL = 1500000;
const SINGLESHOT_HOSTING = 30000;
const SINGLESHOT_OPERATION = 500000;
const SINGLESHOT_RENEWAL_INTERVAL = 3;
const SINGLESHOT_RENEWAL_COST = 1500000;
const BASE_INFLATION = 0.03;
const DRAW_DURATION = 3500;
const HOLD_DURATION = 2500;
const RESET_GAP = 400;

type PresetKey = keyof typeof PRESETS;
type IndustryKey = keyof typeof INDUSTRIES;
type ChartTooltipPayload = { dataKey?: string | number; name?: string | number; value?: number | string | null };
type ChartTooltipProps = { active?: boolean; label?: string | number; payload?: ChartTooltipPayload[] };

function formatWonNatural(n: number) {
  if (n === 0) return "0원";
  const rounded = Math.round(n);
  const eok = Math.floor(rounded / 100000000);
  const manRemainder = Math.round((rounded % 100000000) / 10000);
  if (eok >= 1) return manRemainder > 0 ? `${eok}억 ${manRemainder.toLocaleString("ko-KR")}만 원` : `${eok}억 원`;
  const man = Math.round(rounded / 10000);
  if (man > 0) return `${man.toLocaleString("ko-KR")}만 원`;
  return `${rounded.toLocaleString("ko-KR")}원`;
}

function formatWonAxis(n: number) {
  if (n === 0) return "0";
  if (n >= 100000000) return `${(n / 100000000).toFixed(1).replace(/\.0$/, "")}억`;
  if (n >= 10000) return `${Math.round(n / 10000).toLocaleString("ko-KR")}만`;
  return `${Math.round(n)}`;
}

function inflatedCumulative(monthly: number, years: number, rate: number) {
  if (monthly === 0 || years === 0) return 0;
  if (rate === 0) return monthly * 12 * years;
  return (monthly * 12 * (Math.pow(1 + rate, years) - 1)) / Math.log(1 + rate);
}

function calcCurrent(hosting: number, ads: number, content: number, tools: number, years: number, adsRate: number) {
  return inflatedCumulative(hosting, years, BASE_INFLATION) + inflatedCumulative(content, years, BASE_INFLATION) + inflatedCumulative(tools, years, BASE_INFLATION) + inflatedCumulative(ads, years, adsRate);
}

function calcVelnoc(years: number) {
  return inflatedCumulative(VELNOC_MONTHLY, years, BASE_INFLATION);
}

function calcSingleshot(years: number) {
  const renewals = Math.floor(years / SINGLESHOT_RENEWAL_INTERVAL);
  let renewalCumulative = 0;
  for (let i = 1; i <= renewals; i += 1) {
    renewalCumulative += SINGLESHOT_RENEWAL_COST * Math.pow(1 + BASE_INFLATION, i * SINGLESHOT_RENEWAL_INTERVAL);
  }
  return SINGLESHOT_INITIAL + inflatedCumulative(SINGLESHOT_HOSTING, years, BASE_INFLATION) + inflatedCumulative(SINGLESHOT_OPERATION, years, BASE_INFLATION) + renewalCumulative;
}

const velnocAssetScore = (years: number) => 100 * (1 - Math.exp(-0.4 * years));
const currentAssetScore = (years: number) => Math.round(35 * Math.exp(-0.45 * years) * Math.abs(Math.sin(years * 2.8)));
const singleshotAssetScore = (years: number) => Math.min(15, 8 + years * 0.5);
const velnocAssets = (years: number) => ({
  seoKeywords: Math.floor(years * 7 * (1 + years * 0.1)),
  aiCitations: Math.floor(years * years * 3),
  contents: Math.floor(years * 12),
  automations: Math.min(5, Math.floor(years * 1.2))
});

function assetScore(value: number, maxValue: number) {
  if (maxValue <= 0) return 0;
  return Math.round((Math.min(value, maxValue) / maxValue) * 100);
}

type AssetInsightKey = keyof ReturnType<typeof velnocAssets>;

const ASSET_INSIGHTS: Array<{
  key: AssetInsightKey;
  label: string;
  unit: string;
  maxValue: number;
  driver: string;
  evidence: string;
  strength?: string;
}> = [
  {
    key: "seoKeywords",
    label: "SEO 상위 키워드",
    unit: "개",
    maxValue: 50,
    driver: "기술 SEO · 정보 구조 · 검색 의도 기반 콘텐츠",
    evidence: "사이트 구조와 페이지 주제를 정리하고, 월간 콘텐츠를 검색 의도에 맞춰 개선해 검색 진입면을 늘립니다."
  },
  {
    key: "aiCitations",
    label: "AI 검색 인용 누적",
    unit: "회",
    maxValue: 100,
    driver: "FAQ · 근거형 콘텐츠 · 구조화 데이터 · 엔티티 정리",
    evidence: "AI가 답변에 인용할 수 있도록 질문-답변, 서비스 근거, 지역/업종 맥락을 읽기 쉬운 형태로 축적합니다."
  },
  {
    key: "contents",
    label: "자체 콘텐츠",
    unit: "편",
    maxValue: 120,
    driver: "월간 발행 · 리라이트 · 사례/FAQ 업데이트",
    evidence: "광고가 끝나면 사라지는 노출이 아니라, 사이트 안에 남아 반복해서 발견되는 콘텐츠 자산을 쌓습니다."
  },
  {
    key: "automations",
    label: "자동화 워크플로우",
    unit: "개",
    maxValue: 5,
    driver: "벨녹만의 강점 · 문의 수집 · 리드 분류 · 알림 · 후속 응대 흐름",
    evidence: "사이트 제작에서 끝나지 않고 반복 운영 업무까지 시스템화해, 문의와 데이터가 누락되지 않고 다음 개선의 입력값으로 남게 만듭니다.",
    strength: "벨녹만의 강점: 사이트 운영까지 자동화"
  }
];

function currentSignalSnapshot(years: number) {
  const adPulse = Math.round(42 * Math.exp(-0.38 * years) * Math.abs(Math.sin(years * 2.9)));
  const platformSignal = Math.round(32 * Math.exp(-0.32 * years) * Math.abs(Math.sin(years * 2.2 + 0.9)));
  const ownedAsset = Math.round(4 * Math.exp(-0.8 * years));
  return { adPulse, platformSignal, ownedAsset };
}

function situationFromDiagnosis(preset: string | null): PresetKey {
  if (preset === "B") return "none";
  if (preset === "C") return "websiteOnly";
  if (preset === "D") return "withMarketing";
  if (preset === "E") return "multipleVendors";
  return "withMarketing";
}

function industryMonthlyAvg(key: IndustryKey | null) {
  if (!key) return null;
  const defaults = INDUSTRIES[key].defaults;
  return defaults.hosting + defaults.ads + defaults.content + defaults.tools;
}

function getOpportunityCosts(amount: number) {
  if (amount >= 5000000000) return [
    { label: "강남 신축 아파트", value: `약 ${(amount / 4000000000).toFixed(1)}채` },
    { label: "직원 1년 인건비", value: `${Math.floor(amount / 50000000).toLocaleString("ko-KR")}명분 (연봉 5천만 기준)` },
    { label: "서울 외곽 빌딩", value: "1동 (시세 약 30~50억)" }
  ];
  if (amount >= 1000000000) return [
    { label: "서울 외곽 아파트", value: `약 ${(amount / 1200000000).toFixed(1)}채` },
    { label: "직원 5년 고용 (연봉 4천만)", value: `${Math.floor(amount / 200000000).toLocaleString("ko-KR")}명` },
    { label: "매장 추가 오픈", value: `${Math.floor(amount / 300000000)}~${Math.floor(amount / 200000000)}곳` }
  ];
  if (amount >= 500000000) return [
    { label: "지방 신축 아파트", value: "1채 (시세 약 3~5억)" },
    { label: "직원 1년 인건비", value: `${Math.floor(amount / 50000000).toLocaleString("ko-KR")}명분` },
    { label: "자녀 미국 유학", value: "1명 4년 (연 1억 기준)" }
  ];
  if (amount >= 200000000) return [
    { label: "서울 아파트 전세 보증금", value: "1채 (수도권 기준)" },
    { label: "벤츠 E클래스", value: `${Math.floor(amount / 80000000)}대` },
    { label: "직원 5년 인건비", value: `${Math.floor(amount / 40000000).toLocaleString("ko-KR")}명분 (신입 기준)` }
  ];
  if (amount >= 100000000) return [
    { label: "BMW 5시리즈", value: `${Math.floor(amount / 70000000)}대` },
    { label: "신입 직원 1년 고용", value: `${Math.floor(amount / 40000000)}명` },
    { label: "가족 5인 유럽 여행", value: `${Math.floor(amount / 15000000)}회` }
  ];
  if (amount >= 50000000) return [
    { label: "현대 그랜저", value: `${Math.floor(amount / 50000000)}대` },
    { label: "신입 직원 1년 고용", value: `약 ${Math.floor(amount / 40000000)}명` },
    { label: "자녀 대학 학비", value: `${Math.floor(amount / 25000000)}년치 (연 2,500만 기준)` }
  ];
  if (amount >= 20000000) return [
    { label: "가족 4인 유럽 여행", value: `${Math.floor(amount / 10000000)}회` },
    { label: "자녀 사교육비", value: `${Math.floor(amount / 8000000)}년치` },
    { label: "iPhone 16 Pro Max", value: `${Math.floor(amount / 2000000)}대` }
  ];
  if (amount >= 5000000) return [
    { label: "가족 4인 일본 여행", value: `${Math.floor(amount / 3000000)}회` },
    { label: "맥북 Pro 16인치", value: `${Math.floor(amount / 4000000)}대` },
    { label: "자녀 1년 학원비", value: `약 ${(amount / 3600000).toFixed(1)}년분` }
  ];
  if (amount >= 1000000) return [
    { label: "iPhone 16", value: `${Math.floor(amount / 1500000)}대` },
    { label: "가족 외식", value: `${Math.floor(amount / 100000)}회 (10만원 기준)` }
  ];
  return [];
}

function StepLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="vn-step-label">
      <span className="vn-micro vn-tabular vn-text-tertiary">{num}</span>
      <span className="vn-step-line" />
      <span className="vn-micro">{title}</span>
    </div>
  );
}

function SliderInput({
  label,
  value,
  setValue,
  max,
  step,
  highlight
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  max: number;
  step: number;
  highlight?: boolean;
}) {
  const id = `slider-${label.replace(/\s+/g, "-")}`;
  return (
    <div className="vn-slider-row">
      <div className="vn-slider-head">
        <label htmlFor={id} className="vn-label">
          {label}
          {highlight && <span className="vn-badge is-danger vn-highlight-badge">인플레이션 영향</span>}
        </label>
        <span className="vn-tabular vn-text-oak"><strong>{formatWonNatural(value)}</strong></span>
      </div>
      <input id={id} className="vn-range" type="range" min={0} max={max} step={step} value={value} onChange={(event) => setValue(Number(event.target.value))} />
    </div>
  );
}

function LegendDot({ variant, label, dashed = false }: { variant: "current" | "single" | "velnoc"; label: string; dashed?: boolean }) {
  return (
    <span className="vn-legend-item">
      <span className={`vn-legend-line is-${variant} ${dashed ? "is-dashed" : ""}`} />
      <span>{label}</span>
    </span>
  );
}

function DefRow({ variant, title, children }: { variant: "current" | "single" | "velnoc"; title: string; children: React.ReactNode }) {
  return (
    <div className="vn-def-row">
      <span className={`vn-def-stripe is-${variant}`} />
      <div>
        <strong>{title}</strong>
        <div>{children}</div>
      </div>
    </div>
  );
}

function CurrentSignalRow({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="vn-current-signal-row">
      <div className="vn-row-between">
        <strong>{label}</strong>
        <span className="vn-tabular vn-data-value-small vn-text-danger"><strong>{value}점</strong></span>
      </div>
      <progress className="vn-progress vn-progress-danger" value={value} max={100} />
      <p className="vn-help">{note}</p>
    </div>
  );
}

function CurrentRiskPanel() {
  return (
    <div className="vn-asset-risk-panel">
      <p className="vn-micro vn-text-danger">왜 줄어드는가</p>
      <strong>광고비가 신호를 빌려올 뿐, 자산으로 고정하지 못합니다</strong>
      <p className="vn-help">
        경쟁이 심화될수록 같은 예산으로 얻는 노출은 줄고, 사이트 안에 남는 SEO·AEO·GEO 맥락은 쌓이지 않습니다.
      </p>
    </div>
  );
}

function AssetRow({
  label,
  value,
  unit,
  maxValue,
  strength,
  active,
  onSelect
}: {
  label: string;
  value: number;
  unit: string;
  maxValue: number;
  strength?: string;
  active: boolean;
  onSelect: () => void;
}) {
  const score = assetScore(value, maxValue);
  return (
    <button type="button" onClick={onSelect} className={`vn-asset-row vn-asset-button ${active ? "is-active" : ""}`}>
      <div className="vn-row-between">
        <strong>{label}</strong>
        <span className="vn-tabular vn-data-value-small vn-text-oak"><strong>{score}점</strong></span>
      </div>
      {strength && <p className="vn-asset-strength">{strength}</p>}
      <progress className="vn-progress" value={score} max={100} />
      <p className="vn-help vn-asset-evidence">실제 축적: {label} {value.toLocaleString("ko-KR")}{unit}</p>
    </button>
  );
}

function AssetInsightPanel({ insight, value }: { insight: (typeof ASSET_INSIGHTS)[number]; value: number }) {
  const score = assetScore(value, insight.maxValue);
  return (
    <div className="vn-asset-insight-panel">
      <p className="vn-micro vn-text-oak">왜 늘어나는가</p>
      <p className="vn-asset-score-meta">
        <strong className="vn-tabular">{score}점</strong>
        <span> · 실제 축적 {value.toLocaleString("ko-KR")}{insight.unit}</span>
      </p>
      {insight.strength && <p className="vn-asset-strength">{insight.strength}</p>}
      <strong>{insight.driver}</strong>
      <p className="vn-help">{insight.evidence}</p>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  required
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="vn-field">
      <span className="vn-label">
        {label}
        {required && <span className="vn-required"> *</span>}
      </span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} className="vn-input" />
    </label>
  );
}

function CostTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const labels: Record<string, string> = { current: "현재 방식", singleshot: "단발 업체", velnoc: "벨녹 구독" };
  return (
    <div className="vn-chart-tooltip">
      <span className="vn-chart-tooltip-label">{Number(label).toFixed(1)}년 차</span>
      {payload.map((item) => {
        if (item.value == null || item.dataKey == null) return null;
        return (
          <span key={String(item.dataKey)} className="vn-tabular">
            {labels[String(item.dataKey)] || String(item.name)}: {formatWonNatural(Number(item.value))}
          </span>
        );
      })}
    </div>
  );
}

function AssetTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const labels: Record<string, string> = { currentAsset: "현재 방식 자산", singleshotAsset: "단발 업체 자산", velnocAsset: "벨녹 자산" };
  return (
    <div className="vn-chart-tooltip">
      <span className="vn-chart-tooltip-label">{Number(label).toFixed(1)}년 차</span>
      {payload.map((item) => {
        if (item.value == null || item.dataKey == null) return null;
        return (
          <span key={String(item.dataKey)} className="vn-tabular">
            {labels[String(item.dataKey)] || String(item.name)}: {Math.round(Number(item.value))}점
          </span>
        );
      })}
    </div>
  );
}

export function SimulatorTool() {
  const searchParams = useSearchParams();
  const presetParam = searchParams.get("preset");
  const hasDiagnosisPreset = ["B", "C", "D", "E"].includes(presetParam || "");
  const initialSituation = hasDiagnosisPreset ? situationFromDiagnosis(presetParam) : null;
  const initialDefaults = initialSituation ? PRESETS[initialSituation].defaults : PRESETS.none.defaults;
  const [situation, setSituation] = useState<PresetKey | null>(initialSituation);
  const [industry, setIndustry] = useState<IndustryKey | null>(null);
  const [hosting, setHosting] = useState(initialDefaults.hosting);
  const [ads, setAds] = useState(initialDefaults.ads);
  const [content, setContent] = useState(initialDefaults.content);
  const [tools, setTools] = useState(initialDefaults.tools);
  const [period, setPeriod] = useState(5);
  const [inflation, setInflation] = useState(0.1);
  const [spendConfirmed, setSpendConfirmed] = useState(false);
  const [periodSelected, setPeriodSelected] = useState(false);
  const [inflationSelected, setInflationSelected] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showDefinitions, setShowDefinitions] = useState(false);
  const [selectedAssetInsight, setSelectedAssetInsight] = useState<AssetInsightKey>("seoKeywords");
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "" });
  const [revealedYear, setRevealedYear] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  function resetResultPanels() {
    setShowLeadForm(false);
    setSubmitted(false);
    setShowDefinitions(false);
    setRevealedYear(0);
    setIsPlaying(true);
  }

  function resetProgressAfterSpendChange() {
    setSpendConfirmed(false);
    setPeriodSelected(false);
    setInflationSelected(false);
    resetResultPanels();
  }

  function selectSituation(nextSituation: PresetKey) {
    const preset = PRESETS[nextSituation];
    setSituation(nextSituation);
    setHosting(preset.defaults.hosting);
    setAds(preset.defaults.ads);
    setContent(preset.defaults.content);
    setTools(preset.defaults.tools);
    setIndustry(null);
    setInflation(0.1);
    resetProgressAfterSpendChange();
  }

  function applyIndustry(key: IndustryKey) {
    const selected = INDUSTRIES[key];
    setIndustry(key);
    setHosting(selected.defaults.hosting);
    setAds(selected.defaults.ads);
    setContent(selected.defaults.content);
    setTools(selected.defaults.tools);
    setInflation(selected.inflation);
    setSituation("withMarketing");
    resetProgressAfterSpendChange();
  }

  function changeHosting(value: number) {
    setHosting(value);
    resetProgressAfterSpendChange();
  }

  function changeAds(value: number) {
    setAds(value);
    resetProgressAfterSpendChange();
  }

  function changeContent(value: number) {
    setContent(value);
    resetProgressAfterSpendChange();
  }

  function changeTools(value: number) {
    setTools(value);
    resetProgressAfterSpendChange();
  }

  useEffect(() => {
    track("simulator_start", { preset: searchParams.get("preset") || "none", from: searchParams.get("from") || "direct" });
  }, [searchParams]);

  const monthlySpend = hosting + ads + content + tools;
  const chartData = useMemo(() => {
    const data = [];
    const steps = period * 12;
    for (let i = 0; i <= steps; i += 1) {
      const year = (i / steps) * period;
      data.push({
        year,
        current: calcCurrent(hosting, ads, content, tools, year, inflation),
        velnoc: calcVelnoc(year),
        singleshot: calcSingleshot(year)
      });
    }
    return data;
  }, [hosting, ads, content, tools, period, inflation]);

  const assetChartData = useMemo(() => {
    const data = [];
    const steps = period * 12;
    for (let i = 0; i <= steps; i += 1) {
      const year = (i / steps) * period;
      data.push({
        year,
        currentAsset: currentAssetScore(year),
        velnocAsset: velnocAssetScore(year),
        singleshotAsset: singleshotAssetScore(year)
      });
    }
    return data;
  }, [period]);

  const animatedChartData = useMemo(() => chartData.map((item) => ({
    ...item,
    current: item.year <= revealedYear ? item.current : null,
    velnoc: item.year <= revealedYear ? item.velnoc : null,
    singleshot: item.year <= revealedYear ? item.singleshot : null
  })), [chartData, revealedYear]);

  const animatedAssetData = useMemo(() => assetChartData.map((item) => ({
    ...item,
    currentAsset: item.year <= revealedYear ? item.currentAsset : null,
    velnocAsset: item.year <= revealedYear ? item.velnocAsset : null,
    singleshotAsset: item.year <= revealedYear ? item.singleshotAsset : null
  })), [assetChartData, revealedYear]);

  const liveCurrentValue = useMemo(() => calcCurrent(hosting, ads, content, tools, revealedYear, inflation), [hosting, ads, content, tools, revealedYear, inflation]);
  const liveVelnocValue = useMemo(() => calcVelnoc(revealedYear), [revealedYear]);
  const liveAssets = useMemo(() => velnocAssets(revealedYear), [revealedYear]);
  const currentTotal = calcCurrent(hosting, ads, content, tools, period, inflation);
  const velnocTotal = calcVelnoc(period);
  const singleshotTotal = calcSingleshot(period);
  const totalSavings = currentTotal - velnocTotal;
  const isInvestmentMode = totalSavings < 0;
  const totalCostGap = Math.abs(totalSavings);
  const liveCostGap = isInvestmentMode ? Math.max(0, liveVelnocValue - liveCurrentValue) : Math.max(0, liveCurrentValue - liveVelnocValue);
  const opportunityCosts = useMemo(() => getOpportunityCosts(totalSavings), [totalSavings]);
  const currentSignals = useMemo(() => currentSignalSnapshot(revealedYear), [revealedYear]);
  const selectedAsset = ASSET_INSIGHTS.find((item) => item.key === selectedAssetInsight) || ASSET_INSIGHTS[0];
  const industryAvg = industryMonthlyAvg(industry);
  const benchmarkDelta = industryAvg ? Math.round(((monthlySpend - industryAvg) / industryAvg) * 100) : null;
  const adsInflationFactor = inflation > 0 ? Math.pow(1 + inflation, period) : 1;
  const adsInflationPct = Math.round((adsInflationFactor - 1) * 100);
  const velnocPriceAtEnd = VELNOC_MONTHLY * Math.pow(1 + BASE_INFLATION, period);
  const velnocPricePct = Math.round((Math.pow(1 + BASE_INFLATION, period) - 1) * 100);
  const drawProgress = revealedYear / period;
  const yearDisplay = revealedYear.toFixed(1);
  const hasSituation = situation !== null;
  const showResults = inflationSelected && monthlySpend > 0;
  const resultSummary = isInvestmentMode
    ? `${period}년 추가 투자 추정 ${formatWonNatural(totalCostGap)}, 자산 가치 격차 측정 불가`
    : `${period}년 절약 추정 ${formatWonNatural(totalSavings)}`;

  function selectPeriod(nextPeriod: number) {
    setPeriod(nextPeriod);
    setPeriodSelected(true);
    if (!isPlaying) setRevealedYear(nextPeriod);
  }

  function confirmSpend() {
    setSpendConfirmed(true);
    setPeriodSelected(false);
    setInflationSelected(false);
    resetResultPanels();
    track("simulator_spend_confirm", { monthlySpend, situation, industry });
  }

  function selectInflation(nextInflation: number) {
    setInflation(nextInflation);
    setInflationSelected(true);
    resetResultPanels();
  }

  function togglePlayback() {
    if (isPlaying) setRevealedYear(period);
    setIsPlaying((current) => !current);
  }

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    startTimeRef.current = null;
    const tick = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const cycle = DRAW_DURATION + HOLD_DURATION + RESET_GAP;
      const cyclePosition = elapsed % cycle;
      if (cyclePosition < DRAW_DURATION) {
        setRevealedYear((cyclePosition / DRAW_DURATION) * period);
      } else if (cyclePosition < DRAW_DURATION + HOLD_DURATION) {
        setRevealedYear(period);
      } else {
        setRevealedYear(0);
      }
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [period, hosting, ads, content, tools, inflation, isPlaying]);

  useEffect(() => {
    if (showResults) {
      track("simulator_result", { savings_won: Math.round(totalSavings), years: period });
    }
  }, [showResults, totalSavings, period]);

  async function submitLead(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        source: "simulator",
        name: form.name,
        company: form.company,
        email: form.email,
        phone: form.phone,
        grade: searchParams.get("preset") || "N/A",
        summary: resultSummary,
        metadata: { situation, industry, monthlySpend, period, inflation, currentTotal, velnocTotal }
      })
    });
    if (response.ok) {
      setSubmitted(true);
      track("lead_submit", { source: "simulator", grade: searchParams.get("preset") || "N/A" });
    }
  }

  return (
    <div className="vn-tool-screen vn-simulator">
      <div className="vn-tool-container vn-tool-container-wide">
        <header className="vn-sim-header">
          <p className="vn-micro vn-text-tertiary">VELNOC · AI 검색 시대 ROI 시뮬레이터 v7</p>
          <h1 className="vn-display vn-sim-title">
            5년 뒤,
            <br />
            당신의 마케팅비는
            <br />
            <span className="vn-text-oak">어디에 남아있나요?</span>
          </h1>
          <p className="lead">비용 누적뿐 아니라 자산이 어떻게 쌓이는지까지, 5년 후 진짜 격차를 보여드립니다.</p>
        </header>

        <div className="vn-panel-stack">
          <section>
            <StepLabel num="01" title="현재 상황" />
            <div className="vn-grid-4">
              {Object.entries(PRESETS).map(([key, preset]) => (
                <button key={key} type="button" onClick={() => selectSituation(key as PresetKey)} className={`vn-card vn-select-card ${situation === key ? "is-selected" : ""}`}>
                  <span className="vn-select-card-title">{preset.label}</span>
                  <span className="vn-select-sub">{preset.sub}</span>
                </button>
              ))}
            </div>
          </section>

          {hasSituation && (
            <section className="vn-fade-in">
              <StepLabel num="02" title="업종으로 빠르게 채우기 (선택)" />
              <p className="vn-body">업종을 선택하시면 평균 지출 + 광고비 인상률이 자동 채워집니다.</p>
              <div className="vn-industry-strip">
                <div className="vn-industry-list">
                  {Object.entries(INDUSTRIES).map(([key, item]) => (
                    <button key={key} type="button" onClick={() => applyIndustry(key as IndustryKey)} className={`vn-card vn-select-card ${industry === key ? "is-selected" : ""}`}>
                      <span className="vn-select-card-title">{item.label}</span>
                      <span className="vn-select-sub vn-tabular">평균 {formatWonNatural(industryMonthlyAvg(key as IndustryKey) || 0)}/월</span>
                    </button>
                  ))}
                </div>
              </div>
              {industry && <p className="vn-small vn-text-tertiary">※ {INDUSTRIES[industry].note}</p>}
            </section>
          )}

          {hasSituation && (
            <section className="vn-fade-in">
              <StepLabel num="03" title="월 지출액" />
              <div className="vn-card">
                <SliderInput label="홈페이지 유지·호스팅" value={hosting} setValue={changeHosting} max={500000} step={10000} />
                <SliderInput label="광고비 (네이버·구글·메타)" value={ads} setValue={changeAds} max={10000000} step={100000} highlight />
                <SliderInput label="콘텐츠·SEO 외주" value={content} setValue={changeContent} max={3000000} step={50000} />
                <SliderInput label="디자인·도구 구독" value={tools} setValue={changeTools} max={1000000} step={20000} />
                <div className="vn-row-between">
                  <span className="vn-micro vn-text-tertiary">월 합계</span>
                  <span className="vn-data-value vn-data-value-small">{formatWonNatural(monthlySpend)}</span>
                </div>
                {industry && industryAvg && benchmarkDelta !== null && (
                  <div className={`vn-callout ${benchmarkDelta > 0 ? "vn-callout-danger" : "vn-callout-oak"}`}>
                    <p className="vn-micro vn-text-tertiary">{INDUSTRIES[industry].label} 업종 평균과 비교</p>
                    <div className="vn-row-between">
                      <span className="vn-small">업계 추정 평균</span>
                      <span className="vn-tabular"><strong>{formatWonNatural(industryAvg)}</strong></span>
                    </div>
                    <p className={`vn-small ${benchmarkDelta > 0 ? "vn-text-danger" : "vn-text-oak"}`}>
                      <strong>{benchmarkDelta > 0 ? `평균보다 ${benchmarkDelta}% 더 많이 지출 중` : benchmarkDelta < 0 ? `평균보다 ${Math.abs(benchmarkDelta)}% 적게 지출 중` : "업계 평균과 일치"}</strong>
                    </p>
                  </div>
                )}
                <div className="vn-actions">
                  <button type="button" onClick={confirmSpend} className="vn-btn-primary vn-actions-main">월 지출 입력 완료 → 기간 선택</button>
                </div>
              </div>
            </section>
          )}

          {spendConfirmed && (
            <section className="vn-fade-in">
              <StepLabel num="04" title="기간" />
              <div className="vn-grid-4">
                {[1, 3, 5, 10].map((year) => (
                  <button key={year} type="button" onClick={() => selectPeriod(year)} className={`vn-card vn-select-card vn-center ${period === year ? "is-selected" : ""}`}>
                    <span className="vn-data-value vn-data-value-small">{year}년</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {periodSelected && (
            <section className="vn-fade-in">
              <StepLabel num="05" title="광고비 인플레이션 시나리오" />
              <p className="vn-body">네이버·구글·메타 광고 단가는 매년 오릅니다. 현실적 시나리오는 연 10% 상승입니다.</p>
              <div className="vn-grid-3">
                {INFLATION_OPTIONS.map((option) => (
                  <button key={option.value} type="button" onClick={() => selectInflation(option.value)} className={`vn-card vn-select-card ${inflation === option.value ? "is-selected" : ""}`}>
                    <span className="vn-select-card-title">{option.label}</span>
                    <span className={`vn-data-value vn-data-value-small ${option.value === 0 ? "vn-text-tertiary" : "vn-text-danger"}`}>{option.sub}</span>
                    <span className="vn-select-sub">{option.desc}</span>
                  </button>
                ))}
              </div>
              {inflation > 0 && ads > 0 && (
                <div className="vn-callout vn-callout-danger vn-inflation-callout">
                  <p className="vn-small">
                    <strong>{period}년 차 광고비:</strong> 현재 월 <span className="vn-tabular">{formatWonNatural(ads)}</span> → <span className="vn-tabular"><strong>{formatWonNatural(ads * adsInflationFactor)}</strong></span> (시작 대비 +{adsInflationPct}% 증가)
                  </p>
                </div>
              )}
              <p className="vn-small vn-text-tertiary">※ 호스팅·콘텐츠·도구·벨녹 구독료·인건비는 모두 연 3%씩 상승 가정 (한국 SaaS·인건비 평균).</p>
            </section>
          )}

          {showResults && (
            <>
              <section className="vn-fade-in">
                <StepLabel num="06" title="결과 · 누적 비용 곡선" />
                <div className="vn-card vn-cost-card">
                  <div className="vn-cost-hero">
                    <div className="vn-cost-block">
                      <p className="vn-cost-label">
                        <span className="vn-pulse-dot" aria-hidden="true" />
                        <span className="vn-tabular">{yearDisplay}년 후</span>
                        <span>현재 방식 누적</span>
                      </p>
                      <p className="vn-cost-value vn-cost-value-danger vn-live-tick" key={`current-big-${Math.round(revealedYear * 10)}`}>
                        {formatWonNatural(liveCurrentValue)}
                      </p>
                    </div>

                    <div className="vn-cost-divider" />

                    <div className="vn-cost-block">
                      <p className="vn-cost-label">
                        <span>벨녹 도입 시</span>
                        <span className="vn-tabular">{yearDisplay}년 후</span>
                      </p>
                      <p className="vn-cost-value vn-cost-value-oak vn-live-tick" key={`velnoc-big-${Math.round(revealedYear * 10)}`}>
                        {formatWonNatural(liveVelnocValue)}
                      </p>
                    </div>
                  </div>

                  <div className={`vn-savings-band ${isInvestmentMode ? "is-investment" : ""}`}>
                    <div className="vn-savings-label">
                      <span aria-hidden="true">{isInvestmentMode ? "↑" : "↓"}</span>
                      <span>{isInvestmentMode ? "벨녹 추가 투자액" : "벨녹 도입 시 절약"}</span>
                    </div>
                    <p className="vn-savings-value vn-live-tick" key={`savings-big-${Math.round(revealedYear * 10)}`}>
                      {formatWonNatural(liveCostGap)}
                    </p>
                  </div>

                  <div className="vn-cost-chart-area">
                    <div className="vn-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={animatedChartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid stroke="var(--velnoc-divider)" vertical={false} />
                        <XAxis dataKey="year" type="number" domain={[0, period]} ticks={Array.from({ length: period + 1 }, (_, index) => index)} tickFormatter={(value) => (Number(value) === 0 ? "시작" : `${value}년`)} stroke="var(--velnoc-ink-tertiary)" />
                        <YAxis tickFormatter={(value) => formatWonAxis(Number(value))} stroke="var(--velnoc-ink-tertiary)" width={70} domain={[0, Math.max(currentTotal, velnocTotal, singleshotTotal) * 1.05]} />
                        <Tooltip content={<CostTooltip />} />
                        <Line type="monotone" dataKey="current" stroke="var(--velnoc-danger)" strokeWidth={2.5} dot={false} isAnimationActive={false} connectNulls={false} />
                        <Line type="monotone" dataKey="singleshot" stroke="var(--velnoc-ink-tertiary)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} connectNulls={false} />
                        <Line type="monotone" dataKey="velnoc" stroke="var(--velnoc-oak)" strokeWidth={2.5} dot={false} isAnimationActive={false} connectNulls={false} />
                      </LineChart>
                    </ResponsiveContainer>
                    </div>

                  <div className="vn-chart-controls">
                    <button type="button" onClick={togglePlayback} className={`vn-control-button ${isPlaying ? "" : "is-paused"}`} aria-label={isPlaying ? "애니메이션 일시정지" : "애니메이션 재생"}>
                      {isPlaying ? "Ⅱ" : "▶"}
                    </button>
                    <div className="vn-stack">
                      <div className="vn-row-between">
                        <span className="vn-micro vn-text-tertiary">진행</span>
                        <span className="vn-tabular vn-small">{yearDisplay}년 / {period}년</span>
                      </div>
                      <progress className="vn-progress" value={drawProgress} max={1} />
                    </div>
                  </div>
                  <div className="vn-legend">
                    <LegendDot variant="current" label="현재 방식" />
                    <LegendDot variant="single" label="단발 제작 업체" dashed />
                    <LegendDot variant="velnoc" label="벨녹 구독" />
                  </div>

                  <button type="button" onClick={() => setShowDefinitions((current) => !current)} className="vn-card vn-definition-toggle">
                    <span className="vn-micro">비교 대상 정의 + 인플레이션 가정 {showDefinitions ? "–" : "+"}</span>
                    <span className="vn-small vn-text-tertiary">자세히 보기</span>
                  </button>

                  {showDefinitions && (
                    <div className="vn-definition-panel vn-fade-in">
                      <div className="vn-stack">
                        <div>
                          <strong>인플레이션 가정</strong>
                          <ul className="vn-list-plain vn-text-secondary">
                            <li>· 광고비: 사용자 선택 (0% / +10% / +20%)</li>
                            <li>· 호스팅·콘텐츠·도구·벨녹 구독료·인건비: 연 3%</li>
                            <li className="vn-text-oak">· {period}년 후 벨녹 구독료: 월 {formatWonNatural(velnocPriceAtEnd)} (+{velnocPricePct}%)</li>
                          </ul>
                        </div>
                        <DefRow variant="current" title="현재 방식">본인 입력 월 지출 누적. 광고비는 인플레이션 시나리오, 나머지는 연 3% 상승.</DefRow>
                        <DefRow variant="single" title="단발 제작 업체">
                          <ul className="vn-list-plain">
                            <li>· 초기 제작비 {formatWonNatural(SINGLESHOT_INITIAL)}</li>
                            <li>· 호스팅 월 {formatWonNatural(SINGLESHOT_HOSTING)} (연 3% 인상)</li>
                            <li>· 운영 인건비 월 {formatWonNatural(SINGLESHOT_OPERATION)} (연 3%)</li>
                            <li>· 3년마다 리뉴얼 {formatWonNatural(SINGLESHOT_RENEWAL_COST)}</li>
                          </ul>
                        </DefRow>
                        <DefRow variant="velnoc" title="벨녹 구독">월 {formatWonNatural(VELNOC_MONTHLY)}으로 제작 · 운영 · 자동화 · AEO/GEO 전부 포함. 연 3% 인상.</DefRow>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </section>

              <section className="vn-fade-in">
                <StepLabel num="07" title="자산 가치의 격차" />
                <div className="vn-card">
                  <div className="vn-stack">
                    <p className="vn-micro vn-text-tertiary">진짜 격차는 비용이 아닙니다</p>
                    <h2 className="vn-head">
                      {isInvestmentMode ? (
                        <>
                          추가 비용은 숫자로 보입니다.<br /><span className="vn-text-oak">쌓이지 않은 자산은 늦게 드러납니다.</span>
                        </>
                      ) : (
                        <>
                          비용 차이는 시작일 뿐.<br /><span className="vn-text-oak">5년 동안 무엇이 쌓이느냐</span>가 진짜 격차입니다.
                        </>
                      )}
                    </h2>
                  </div>

                  <div className="vn-grid-2">
                    <div className="vn-card vn-card-soft">
                      <p className="vn-micro vn-text-danger">현재 방식 · {yearDisplay}년 후</p>
                      <p className="vn-help">보유 자산 점수</p>
                      <div className="vn-current-signal-list">
                        <p className="vn-help">각 항목은 0-100 자산 점수입니다. 신호는 잠깐 움직이지만, 내 소유 자산으로 고정되지 않아 0에 가까워집니다.</p>
                        <CurrentSignalRow label="광고 반응 신호" value={currentSignals.adPulse} note="캠페인 중에는 오르지만 예산과 운영이 멈추면 함께 사라집니다." />
                        <CurrentSignalRow label="플랫폼 데이터 신호" value={currentSignals.platformSignal} note="대행사·광고 계정에 흩어져 사이트 자산으로 전환되지 않습니다." />
                        <CurrentSignalRow label="내 소유 자산" value={currentSignals.ownedAsset} note="콘텐츠, 자동화, AI 인용 맥락으로 남지 않아 낮은 값에 수렴합니다." />
                        <CurrentSignalRow label="자동화 워크플로우" value={0} note="기존 방식은 문의 수집·분류·후속 응대가 사람과 툴 사이에 흩어져 자동화 자산으로 남지 않습니다." />
                        <CurrentRiskPanel />
                      </div>
                      <div className="vn-data-retention-block">
                        <div>
                          <strong>방문자·리드 데이터</strong>
                          <p className="vn-help">분산 · 내 소유 아님</p>
                        </div>
                        <div className="vn-callout vn-callout-danger">
                          <p className="vn-small vn-text-danger"><strong>광고를 멈추면 데이터도 멈춥니다</strong></p>
                          <p className="vn-help">캠페인 리포트는 남아도 검색 자산과 리드 흐름으로 이어지지 않습니다.</p>
                        </div>
                      </div>
                    </div>

                    <div className="vn-card vn-card-oak">
                      <p className="vn-micro vn-text-oak">벨녹 도입 시 · {yearDisplay}년 후</p>
                      <p className="vn-help">보유 자산 점수</p>
                      <div className="vn-asset-list">
                        <p className="vn-help">각 항목은 왼쪽과 같은 0-100 자산 점수입니다. 실제 개수와 회수는 점수의 산출 근거로 표시합니다.</p>
                        {ASSET_INSIGHTS.map((item) => (
                          <AssetRow
                            key={item.key}
                            label={item.label}
                            value={liveAssets[item.key]}
                            unit={item.unit}
                            maxValue={item.maxValue}
                            strength={item.strength}
                            active={selectedAssetInsight === item.key}
                            onSelect={() => setSelectedAssetInsight(item.key)}
                          />
                        ))}
                        <AssetInsightPanel insight={selectedAsset} value={liveAssets[selectedAsset.key]} />
                        <div className="vn-data-retention-block">
                          <strong>방문자·리드 데이터</strong>
                          <p className="vn-help vn-text-oak">자동 누적 · 내 소유</p>
                          <div className="vn-callout vn-callout-oak">
                            <p className="vn-small vn-text-oak"><strong>벨녹 구독을 멈춰도 자산은 그대로</strong></p>
                            <p className="vn-help">콘텐츠·검색 신호·리드 데이터가 사이트 안에 남아 시간이 지날수록 강해집니다.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="vn-chart-sm">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={animatedAssetData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid stroke="var(--velnoc-divider)" vertical={false} />
                        <XAxis dataKey="year" type="number" domain={[0, period]} ticks={Array.from({ length: period + 1 }, (_, index) => index)} tickFormatter={(value) => (Number(value) === 0 ? "시작" : `${value}년`)} stroke="var(--velnoc-ink-tertiary)" />
                        <YAxis stroke="var(--velnoc-ink-tertiary)" width={50} domain={[0, 100]} />
                        <Tooltip content={<AssetTooltip />} />
                        <Area type="monotone" dataKey="velnocAsset" stroke="var(--velnoc-oak)" fill="var(--velnoc-oak-soft)" strokeWidth={2.5} isAnimationActive={false} connectNulls={false} />
                        <Line type="monotone" dataKey="singleshotAsset" stroke="var(--velnoc-ink-tertiary)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} connectNulls={false} />
                        <Line type="monotone" dataKey="currentAsset" stroke="var(--velnoc-danger)" strokeWidth={2.5} dot={false} isAnimationActive={false} connectNulls={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="vn-legend">
                    <LegendDot variant="current" label="현재 방식 (변동 후 수렴)" />
                    <LegendDot variant="single" label="단발 업체 (정체)" dashed />
                    <LegendDot variant="velnoc" label="벨녹 (지수 성장)" />
                  </div>
                  <p className="vn-help">※ 자산 가치 점수 = SEO 키워드 + AI 인용 + 콘텐츠 자산 + 자동화 + 데이터 누적의 종합 지표 (0~100)</p>

                  <div className="vn-conclusion-band">
                    <p className="vn-micro vn-text-oak">{isInvestmentMode ? "결론 · 비용보다 큰 손실" : "결론"}</p>
                    <p className="vn-display">
                      {isInvestmentMode ? "추가 투자는" : "비용 차이는"} {formatWonNatural(totalCostGap)}.
                      <br />
                      {isInvestmentMode ? "놓친 자산 가치는" : "자산 가치 차이는"} <span className="vn-text-oak">측정 불가</span>.
                    </p>
                    <p className="vn-body">
                      {isInvestmentMode ? (
                        <>
                          지금 지출은 벨녹보다 낮지만, 그만큼 SEO·AEO·GEO 자산은 쌓이지 않습니다.<br />비용을 아낀 대신 AI 검색 경쟁에서 뒤처질 가능성이 커집니다.
                        </>
                      ) : (
                        <>
                          벨녹은 매월 SEO·AEO·GEO 점수를 누적합니다.<br />그래서 시간이 지날수록 광고에서 자유로워집니다.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {totalSavings > 1000000 && (
                <section className="vn-fade-in">
                  <div className="vn-opportunity-card">
                    <div className="vn-opportunity-inner">
                      <p className="vn-micro vn-opportunity-eyebrow">기회비용</p>
                      <p className="vn-display vn-opportunity-lead">
                        지난 {period}년간 마케팅에
                        <br />
                        <span className="vn-tabular">{formatWonNatural(currentTotal)}</span>을 지출하셨다면,
                      </p>
                      {opportunityCosts.length > 0 && (
                        <div className="vn-opportunity-list">
                          <p className="vn-display vn-opportunity-heading">이 돈이면 이런 것들이 가능했습니다</p>
                          {opportunityCosts.map((item) => (
                            <div key={item.label} className="vn-opportunity-row">
                              <span className="vn-text-secondary">{item.label}</span>
                              <strong className="vn-tabular">{item.value}</strong>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="vn-body vn-opportunity-note">
                        광고는 멈추면 사라지지만,<br />벨녹은 멈춰도 <strong>{period}년치 자산이 그대로 남습니다.</strong>
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}

          {showResults && (
            <section className="vn-fade-in">
              {!showLeadForm && !submitted && (
                <button type="button" onClick={() => setShowLeadForm(true)} className="vn-lead-trigger">
                  <span>
                    <span className="vn-micro vn-text-tertiary">다음 단계</span>
                    <span className="vn-head vn-click-card-title">상세 PDF 리포트 + 자가 진단 →</span>
                  </span>
                  <span aria-hidden="true">↓</span>
                </button>
              )}

              {showLeadForm && !submitted && (
                <form onSubmit={(event) => void submitLead(event)} className="vn-card vn-form-card">
                  <h2 className="vn-head">무료 AI 검색 가시성 진단</h2>
                  <p className="vn-body">위 시뮬레이션의 상세 PDF 리포트와 함께, 귀사의 AI 검색 노출 현황을 진단해 드립니다.</p>
                  <FormInput label="이름" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
                  <FormInput label="회사명" value={form.company} onChange={(value) => setForm({ ...form, company: value })} required />
                  <FormInput label="이메일" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />
                  <FormInput label="연락처" type="tel" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
                  <button type="submit" className="vn-btn-primary">자가 진단 신청 →</button>
                </form>
              )}

              {submitted && (
                <div className="vn-lead-success" role="status">
                  <p className="vn-micro vn-text-soft">접수 완료</p>
                  <h2 className="vn-head">잠시 후 메일을 확인해 주세요</h2>
                  <p>{form.name} 님,<br />24시간 안에 PDF 리포트와 함께 진단 결과를 보내드립니다.</p>
                </div>
              )}
            </section>
          )}

          <footer className="footer-bottom">
            <span>VELNOC — Site · Signal · Engine<br />매월 자라는 AI 검색 가시성</span>
            <span>v7.1 · Design System Aligned · 시뮬레이션 결과는 추정치입니다</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
