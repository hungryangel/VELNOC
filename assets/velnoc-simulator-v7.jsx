import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

/* ============================================================
   VELNOC GEO ROI Simulator v7
   ------------------------------------------------------------
   v6 ➞ v7 changes:
   + NEW Section 06: "자산 가치의 격차" — 비용 절감 너머의 자산 누적
   + 디지털 자산 시각화: SEO 키워드 · AI 인용 · 콘텐츠 · 자동화
   + 자산 가치 점수 곡선 (현재 방식 flat at 0 vs 벨녹 S-curve 급증)
   + "비용 차이 vs 자산 차이" 가위(scissor) 효과 명시화
   + 카피 톤 조정: 비용 절감 → 자산 누적 차원으로 격상
   ============================================================ */

const PRESETS = {
  none: { label: '홈페이지 없음', sub: '만들 예정', defaults: { hosting: 0, ads: 0, content: 0, tools: 0 } },
  websiteOnly: { label: '홈페이지만 있음', sub: '별도 마케팅 X', defaults: { hosting: 30000, ads: 0, content: 0, tools: 50000 } },
  withMarketing: { label: '홈페이지 + 마케팅', sub: '외주 병행', defaults: { hosting: 30000, ads: 1500000, content: 300000, tools: 100000 } },
  multipleVendors: { label: '여러 업체 동시', sub: '디자인·광고·콘텐츠 분리', defaults: { hosting: 50000, ads: 2500000, content: 800000, tools: 200000 } },
};

const INDUSTRIES = {
  medical: { label: '병원·의료미용', note: '강남 격전지, CPC 최고 수준', defaults: { hosting: 100000, ads: 8000000, content: 1000000, tools: 300000 }, inflation: 0.20 },
  legal: { label: '법무·세무', note: '경쟁 키워드 단가 폭증 중', defaults: { hosting: 50000, ads: 5000000, content: 300000, tools: 100000 }, inflation: 0.18 },
  realestate: { label: '부동산', note: '매물 광고 의존도 높음', defaults: { hosting: 50000, ads: 3000000, content: 500000, tools: 100000 }, inflation: 0.15 },
  saasB2b: { label: 'IT · SaaS B2B', note: '콘텐츠 비중 큰 업종', defaults: { hosting: 100000, ads: 2000000, content: 1000000, tools: 500000 }, inflation: 0.12 },
  lodging: { label: '펜션 · 숙박', note: 'OTA 수수료 별도', defaults: { hosting: 50000, ads: 1000000, content: 200000, tools: 50000 }, inflation: 0.10 },
  academy: { label: '학원 · 교육', note: '시즌별 광고 집중', defaults: { hosting: 30000, ads: 2000000, content: 300000, tools: 50000 }, inflation: 0.10 },
  fitness: { label: '헬스장 · 뷰티샵', note: '지역 검색 의존', defaults: { hosting: 30000, ads: 800000, content: 200000, tools: 50000 }, inflation: 0.08 },
  fnb: { label: '식당 · 카페', note: '리뷰·플랫폼 의존', defaults: { hosting: 30000, ads: 300000, content: 100000, tools: 30000 }, inflation: 0.05 },
};

const INFLATION_OPTIONS = [
  { value: 0, label: '정체', sub: '0%', desc: '광고비가 그대로 유지' },
  { value: 0.10, label: '현실적', sub: '+10%/년', desc: '업계 평균 인상률' },
  { value: 0.20, label: '고경쟁', sub: '+20%/년', desc: '의료·법무·강남 격전지' },
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

const formatWonNatural = (n) => {
  if (n === 0) return '0원';
  const rounded = Math.round(n);
  const eok = Math.floor(rounded / 100000000);
  const manRemainder = Math.round((rounded % 100000000) / 10000);
  if (eok >= 1) {
    if (manRemainder > 0) return `${eok}억 ${manRemainder.toLocaleString('ko-KR')}만 원`;
    return `${eok}억 원`;
  }
  const man = Math.round(rounded / 10000);
  if (man > 0) return `${man.toLocaleString('ko-KR')}만 원`;
  return `${rounded.toLocaleString('ko-KR')}원`;
};

const formatWonAxis = (n) => {
  if (n === 0) return '0';
  if (n >= 100000000) return `${(n / 100000000).toFixed(1).replace(/\.0$/, '')}억`;
  if (n >= 10000) return `${Math.round(n / 10000).toLocaleString('ko-KR')}만`;
  return `${Math.round(n)}`;
};

const formatWonFull = (n) => `₩${Math.round(n).toLocaleString('ko-KR')}`;

const inflatedCumulative = (monthly, years, rate) => {
  if (monthly === 0 || years === 0) return 0;
  if (rate === 0) return monthly * 12 * years;
  return (monthly * 12 * (Math.pow(1 + rate, years) - 1)) / Math.log(1 + rate);
};

const calcCurrent = (hosting, ads, content, tools, years, adsRate) => {
  return (
    inflatedCumulative(hosting, years, BASE_INFLATION) +
    inflatedCumulative(content, years, BASE_INFLATION) +
    inflatedCumulative(tools, years, BASE_INFLATION) +
    inflatedCumulative(ads, years, adsRate)
  );
};

const calcVelnoc = (years) => inflatedCumulative(VELNOC_MONTHLY, years, BASE_INFLATION);

const calcSingleshot = (years) => {
  const renewals = Math.floor(years / SINGLESHOT_RENEWAL_INTERVAL);
  let renewalCumulative = 0;
  for (let i = 1; i <= renewals; i++) {
    renewalCumulative += SINGLESHOT_RENEWAL_COST * Math.pow(1 + BASE_INFLATION, i * SINGLESHOT_RENEWAL_INTERVAL);
  }
  return (
    SINGLESHOT_INITIAL +
    inflatedCumulative(SINGLESHOT_HOSTING, years, BASE_INFLATION) +
    inflatedCumulative(SINGLESHOT_OPERATION, years, BASE_INFLATION) +
    renewalCumulative
  );
};

const industryMonthlyAvg = (key) => {
  if (!key || !INDUSTRIES[key]) return null;
  const d = INDUSTRIES[key].defaults;
  return d.hosting + d.ads + d.content + d.tools;
};

// ─── v7: 자산 가치 점수 (0-100) ───
const velnocAssetScore = (years) => 100 * (1 - Math.exp(-0.4 * years));
const currentAssetScore = (years) => 3; // 광고 의존, 자산 없음
const singleshotAssetScore = (years) => Math.min(15, 8 + years * 0.5); // 사이트는 있지만 누적 없음

// ─── v7: 디지털 자산 수치 (시간 따라 누적) ───
const velnocAssets = (years) => ({
  seoKeywords: Math.floor(years * 7 * (1 + years * 0.1)),
  aiCitations: Math.floor(years * years * 3),
  contents: Math.floor(years * 12),
  automations: Math.min(5, Math.floor(years * 1.2)),
});

const getOpportunityCosts = (amount) => {
  if (amount >= 5000000000) return [
    { label: '강남 신축 아파트', value: `약 ${(amount / 4000000000).toFixed(1)}채` },
    { label: '직원 1년 인건비', value: `${Math.floor(amount / 50000000).toLocaleString('ko-KR')}명분 (연봉 5천만 기준)` },
    { label: '서울 외곽 빌딩', value: `1동 (시세 약 30~50억)` },
  ];
  if (amount >= 1000000000) return [
    { label: '서울 외곽 아파트', value: `약 ${(amount / 1200000000).toFixed(1)}채` },
    { label: '직원 5년 고용 (연봉 4천만)', value: `${Math.floor(amount / 200000000).toLocaleString('ko-KR')}명` },
    { label: '매장 추가 오픈', value: `${Math.floor(amount / 300000000)}~${Math.floor(amount / 200000000)}곳` },
  ];
  if (amount >= 500000000) return [
    { label: '지방 신축 아파트', value: `1채 (시세 약 3~5억)` },
    { label: '직원 1년 인건비', value: `${Math.floor(amount / 50000000).toLocaleString('ko-KR')}명분` },
    { label: '자녀 미국 유학', value: `1명 4년 (연 1억 기준)` },
  ];
  if (amount >= 200000000) return [
    { label: '서울 아파트 전세 보증금', value: `1채 (수도권 기준)` },
    { label: '벤츠 E클래스', value: `${Math.floor(amount / 80000000)}대` },
    { label: '직원 5년 인건비', value: `${Math.floor(amount / 40000000).toLocaleString('ko-KR')}명분 (신입 기준)` },
  ];
  if (amount >= 100000000) return [
    { label: 'BMW 5시리즈', value: `${Math.floor(amount / 70000000)}대` },
    { label: '신입 직원 1년 고용', value: `${Math.floor(amount / 40000000)}명` },
    { label: '가족 5인 유럽 여행', value: `${Math.floor(amount / 15000000)}회` },
  ];
  if (amount >= 50000000) return [
    { label: '현대 그랜저', value: `${Math.floor(amount / 50000000)}대` },
    { label: '신입 직원 1년 고용', value: `약 ${Math.floor(amount / 40000000)}명` },
    { label: '자녀 대학 학비', value: `${Math.floor(amount / 25000000)}년치 (연 2,500만 기준)` },
  ];
  if (amount >= 20000000) return [
    { label: '가족 4인 유럽 여행', value: `${Math.floor(amount / 10000000)}회` },
    { label: '자녀 사교육비', value: `${Math.floor(amount / 8000000)}년치` },
    { label: 'iPhone 16 Pro Max', value: `${Math.floor(amount / 2000000)}대` },
  ];
  if (amount >= 5000000) return [
    { label: '가족 4인 일본 여행', value: `${Math.floor(amount / 3000000)}회` },
    { label: '맥북 Pro 16인치', value: `${Math.floor(amount / 4000000)}대` },
    { label: '자녀 1년 학원비', value: `약 ${(amount / 3600000).toFixed(1)}년분` },
  ];
  if (amount >= 1000000) return [
    { label: 'iPhone 16', value: `${Math.floor(amount / 1500000)}대` },
    { label: '가족 외식', value: `${Math.floor(amount / 100000)}회 (10만원 기준)` },
  ];
  return [];
};

export default function VelnocSimulatorV7() {
  const [situation, setSituation] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [hosting, setHosting] = useState(0);
  const [ads, setAds] = useState(0);
  const [content, setContent] = useState(0);
  const [tools, setTools] = useState(0);
  const [period, setPeriod] = useState(5);
  const [inflation, setInflation] = useState(0.10);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showDefinitions, setShowDefinitions] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '' });

  const [revealedYear, setRevealedYear] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (situation && PRESETS[situation]) {
      const d = PRESETS[situation].defaults;
      setHosting(d.hosting);
      setAds(d.ads);
      setContent(d.content);
      setTools(d.tools);
      setIndustry(null);
    }
  }, [situation]);

  const applyIndustry = (key) => {
    setIndustry(key);
    const ind = INDUSTRIES[key];
    setHosting(ind.defaults.hosting);
    setAds(ind.defaults.ads);
    setContent(ind.defaults.content);
    setTools(ind.defaults.tools);
    setInflation(ind.inflation);
    if (!situation) setSituation('withMarketing');
  };

  const monthlySpend = hosting + ads + content + tools;

  const chartData = useMemo(() => {
    const data = [];
    const steps = period * 12;
    for (let i = 0; i <= steps; i++) {
      const y = (i / steps) * period;
      data.push({
        year: y,
        current: calcCurrent(hosting, ads, content, tools, y, inflation),
        velnoc: calcVelnoc(y),
        singleshot: calcSingleshot(y),
      });
    }
    return data;
  }, [hosting, ads, content, tools, period, inflation]);

  const assetChartData = useMemo(() => {
    const data = [];
    const steps = period * 12;
    for (let i = 0; i <= steps; i++) {
      const y = (i / steps) * period;
      data.push({
        year: y,
        currentAsset: currentAssetScore(y),
        velnocAsset: velnocAssetScore(y),
        singleshotAsset: singleshotAssetScore(y),
      });
    }
    return data;
  }, [period]);

  const animatedChartData = useMemo(() => chartData.map((d) => ({
    ...d,
    current: d.year <= revealedYear ? d.current : null,
    velnoc: d.year <= revealedYear ? d.velnoc : null,
    singleshot: d.year <= revealedYear ? d.singleshot : null,
  })), [chartData, revealedYear]);

  const animatedAssetData = useMemo(() => assetChartData.map((d) => ({
    ...d,
    currentAsset: d.year <= revealedYear ? d.currentAsset : null,
    velnocAsset: d.year <= revealedYear ? d.velnocAsset : null,
    singleshotAsset: d.year <= revealedYear ? d.singleshotAsset : null,
  })), [assetChartData, revealedYear]);

  const liveCurrentValue = useMemo(
    () => calcCurrent(hosting, ads, content, tools, revealedYear, inflation),
    [hosting, ads, content, tools, revealedYear, inflation]
  );
  const liveVelnocValue = useMemo(() => calcVelnoc(revealedYear), [revealedYear]);
  const liveSavings = Math.max(0, liveCurrentValue - liveVelnocValue);
  const liveAssets = useMemo(() => velnocAssets(revealedYear), [revealedYear]);

  const currentTotal = calcCurrent(hosting, ads, content, tools, period, inflation);
  const velnocTotal = calcVelnoc(period);
  const singleshotTotal = calcSingleshot(period);
  const totalSavings = currentTotal - velnocTotal;
  const opportunityCosts = useMemo(() => getOpportunityCosts(totalSavings), [totalSavings]);

  const industryAvg = industryMonthlyAvg(industry);
  const benchmarkDelta = industryAvg ? Math.round(((monthlySpend - industryAvg) / industryAvg) * 100) : null;
  const adsInflationFactor = inflation > 0 ? Math.pow(1 + inflation, period) : 1;
  const adsInflationPct = Math.round((adsInflationFactor - 1) * 100);
  const velnocPriceAtEnd = VELNOC_MONTHLY * Math.pow(1 + BASE_INFLATION, period);
  const velnocPricePct = Math.round((Math.pow(1 + BASE_INFLATION, period) - 1) * 100);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }
    startTimeRef.current = null;
    const tick = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const cycle = DRAW_DURATION + HOLD_DURATION + RESET_GAP;
      const cyclePos = elapsed % cycle;
      if (cyclePos < DRAW_DURATION) {
        const t = cyclePos / DRAW_DURATION;
        setRevealedYear(t * period);
      } else if (cyclePos < DRAW_DURATION + HOLD_DURATION) {
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
    if (!isPlaying) setRevealedYear(period);
  }, [isPlaying, period]);

  const drawProgress = revealedYear / period;
  const yearDisplay = revealedYear.toFixed(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Lead captured:', { ...form, situation, industry, monthlySpend, period, inflation });
    setSubmitted(true);
  };

  const stepReady = { sliders: situation !== null || industry !== null, results: situation !== null || industry !== null };

  return (
    <div className="min-h-screen w-full" style={{ background: '#F7F5F0' }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');
        .velnoc-sim, .velnoc-sim * {
          font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-feature-settings: 'tnum' on, 'lnum' on;
        }
        .velnoc-sim .tabular { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
        .velnoc-sim .display { letter-spacing: -0.035em; }
        .velnoc-sim .grain { background-image: radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px); background-size: 3px 3px; }
        .velnoc-sim input[type="range"] {
          -webkit-appearance: none; appearance: none; width: 100%; height: 2px;
          background: #D6D3CE; outline: none; border-radius: 0;
        }
        .velnoc-sim input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; width: 18px; height: 18px;
          background: #0A0A0A; cursor: pointer; border-radius: 50%;
          border: 3px solid #F7F5F0; box-shadow: 0 0 0 1px #0A0A0A;
        }
        .velnoc-sim input[type="range"]::-moz-range-thumb {
          width: 18px; height: 18px; background: #0A0A0A;
          cursor: pointer; border-radius: 50%; border: 3px solid #F7F5F0; box-shadow: 0 0 0 1px #0A0A0A;
        }
        .velnoc-sim .fade-in { animation: fadeIn 0.6s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .velnoc-sim .industry-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .velnoc-sim .industry-scroll::-webkit-scrollbar { display: none; }
        .velnoc-sim .pulse-dot::before {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          background: currentColor; animation: pulse 1.5s ease-out infinite;
        }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(2.5); opacity: 0; } }
        .velnoc-sim .savings-glow { background: linear-gradient(135deg, #0F4C3A 0%, #065F46 100%); position: relative; overflow: hidden; }
        .velnoc-sim .savings-glow::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer { 100% { left: 200%; } }
        .velnoc-sim .live-tick { animation: liveTick 0.3s ease; }
        @keyframes liveTick { 0% { transform: translateY(-2px); opacity: 0.85; } 100% { transform: translateY(0); opacity: 1; } }
        .velnoc-sim .opp-row { border-bottom: 1px dashed rgba(255,255,255,0.15); }
        .velnoc-sim .opp-row:last-child { border-bottom: none; }
        .velnoc-sim .asset-bar { 
          height: 4px; background: #E7E5E0; overflow: hidden; position: relative;
        }
        .velnoc-sim .asset-bar-fill {
          position: absolute; top: 0; left: 0; height: 100%; background: #0F4C3A;
          transition: width 0.2s ease-out;
        }
      `}</style>

      <div className="velnoc-sim grain">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <header className="mb-20">
            <div className="text-xs tracking-[0.25em] uppercase text-stone-500 mb-6">
              VELNOC · AI 검색 시대 ROI 시뮬레이터 v7
            </div>
            <h1 className="display text-[2.5rem] md:text-[4rem] leading-[0.95] font-black text-stone-950 mb-6">
              5년 뒤,<br />
              당신의 마케팅비는<br />
              <span style={{ color: '#0F4C3A' }}>어디에 남아있나요?</span>
            </h1>
            <p className="text-base md:text-lg text-stone-600 max-w-xl leading-relaxed">
              비용 누적뿐 아니라 자산이 어떻게 쌓이는지까지 — 5년 후 진짜 격차를 보여드립니다.
            </p>
          </header>

          <section className="mb-16">
            <StepLabel num="01" title="현재 상황" />
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(PRESETS).map(([key, preset]) => (
                <button key={key} onClick={() => setSituation(key)}
                  className={`text-left p-5 transition-all duration-200 ${situation === key ? 'bg-stone-950 text-stone-50' : 'bg-white text-stone-900 hover:bg-stone-100'}`}
                  style={{ border: situation === key ? '1px solid #0A0A0A' : '1px solid #E7E5E0' }}>
                  <div className="text-sm md:text-base font-bold mb-1">{preset.label}</div>
                  <div className={`text-xs ${situation === key ? 'text-stone-400' : 'text-stone-500'}`}>{preset.sub}</div>
                </button>
              ))}
            </div>
          </section>

          {stepReady.sliders && (
            <section className="mb-16 fade-in">
              <StepLabel num="01·5" title="업종으로 빠르게 채우기 (선택)" />
              <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                업종을 선택하시면 평균 지출 + 광고비 인상률이 자동 채워집니다.
              </p>
              <div className="industry-scroll overflow-x-auto -mx-6 px-6">
                <div className="flex gap-2 pb-2" style={{ width: 'max-content' }}>
                  {Object.entries(INDUSTRIES).map(([key, ind]) => (
                    <button key={key} onClick={() => applyIndustry(key)}
                      className={`whitespace-nowrap px-4 py-3 transition-all ${industry === key ? 'bg-stone-950 text-stone-50' : 'bg-white text-stone-700 hover:bg-stone-100'}`}
                      style={{ border: industry === key ? '1px solid #0A0A0A' : '1px solid #E7E5E0' }}>
                      <div className="text-sm font-bold">{ind.label}</div>
                      <div className={`text-[10px] mt-0.5 tabular ${industry === key ? 'text-stone-400' : 'text-stone-500'}`}>
                        평균 {formatWonNatural(industryMonthlyAvg(key))}/월
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {industry && (<p className="mt-4 text-xs text-stone-500 italic">※ {INDUSTRIES[industry].note}</p>)}
            </section>
          )}

          {stepReady.sliders && (
            <section className="mb-16 fade-in">
              <StepLabel num="02" title="월 지출액" />
              <div className="bg-white p-6 md:p-10" style={{ border: '1px solid #E7E5E0' }}>
                <SliderInput label="홈페이지 유지·호스팅" value={hosting} setValue={setHosting} max={500000} step={10000} />
                <SliderInput label="광고비 (네이버·구글·메타)" value={ads} setValue={setAds} max={10000000} step={100000} highlight />
                <SliderInput label="콘텐츠·SEO 외주" value={content} setValue={setContent} max={3000000} step={50000} />
                <SliderInput label="디자인·도구 구독" value={tools} setValue={setTools} max={1000000} step={20000} />
                <div className="mt-8 pt-8 border-t border-stone-200 flex items-baseline justify-between">
                  <span className="text-sm uppercase tracking-widest text-stone-500">월 합계</span>
                  <span className="tabular display text-2xl md:text-4xl font-black text-stone-950">{formatWonNatural(monthlySpend)}</span>
                </div>
                {industry && industryAvg && (
                  <div className="mt-6 pt-6 border-t border-stone-200 fade-in">
                    <div className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-3">{INDUSTRIES[industry].label} 업종 평균과 비교</div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-sm text-stone-700">업계 추정 평균</span>
                      <span className="tabular text-base font-bold text-stone-700">{formatWonNatural(industryAvg)}</span>
                    </div>
                    <div className="mt-3 p-3" style={{ background: benchmarkDelta > 0 ? '#FEF2F2' : '#F0FDF4' }}>
                      <span className="text-sm font-bold" style={{ color: benchmarkDelta > 0 ? '#B91C1C' : '#0F4C3A' }}>
                        {benchmarkDelta > 0 ? `평균보다 ${benchmarkDelta}% 더 많이 지출 중` : benchmarkDelta < 0 ? `평균보다 ${Math.abs(benchmarkDelta)}% 적게 지출 중` : '업계 평균과 일치'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {stepReady.results && (
            <section className="mb-16 fade-in">
              <StepLabel num="03" title="기간" />
              <div className="flex gap-2">
                {[1, 3, 5, 10].map((y) => (
                  <button key={y} onClick={() => setPeriod(y)}
                    className={`flex-1 py-4 transition-all ${period === y ? 'bg-stone-950 text-stone-50' : 'bg-white text-stone-700 hover:bg-stone-100'}`}
                    style={{ border: period === y ? '1px solid #0A0A0A' : '1px solid #E7E5E0' }}>
                    <span className="display text-lg md:text-xl font-black tabular">{y}년</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {stepReady.results && (
            <section className="mb-20 fade-in">
              <StepLabel num="04" title="광고비 인플레이션 시나리오" />
              <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                네이버·구글·메타 광고 단가는 매년 오릅니다.<br />현실적 시나리오는 연 10% 상승입니다.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {INFLATION_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => setInflation(opt.value)}
                    className={`text-left p-4 transition-all ${inflation === opt.value ? 'bg-stone-950 text-stone-50' : 'bg-white text-stone-700 hover:bg-stone-100'}`}
                    style={{ border: inflation === opt.value ? '1px solid #0A0A0A' : '1px solid #E7E5E0' }}>
                    <div className="text-sm font-bold mb-1">{opt.label}</div>
                    <div className="tabular text-lg display font-black"
                      style={{ color: inflation === opt.value ? '#F7F5F0' : opt.value === 0 ? '#78716C' : '#B91C1C' }}>
                      {opt.sub}
                    </div>
                    <div className={`text-[10px] mt-1 leading-tight ${inflation === opt.value ? 'text-stone-400' : 'text-stone-500'}`}>{opt.desc}</div>
                  </button>
                ))}
              </div>
              {inflation > 0 && ads > 0 && (
                <div className="mt-4 p-4 text-xs leading-relaxed fade-in" style={{ background: '#FEF2F2', color: '#7F1D1D' }}>
                  <strong>{period}년 차 광고비:</strong> 현재 월 <span className="tabular">{formatWonNatural(ads)}</span> → <span className="tabular font-bold">{formatWonNatural(ads * adsInflationFactor)}</span> (시작 대비 +{adsInflationPct}% 증가)
                </div>
              )}
              <p className="mt-4 text-[11px] text-stone-500 leading-relaxed">
                ※ 호스팅·콘텐츠·도구·벨녹 구독료·인건비는 모두 연 3%씩 상승 가정 (한국 SaaS·인건비 평균).
              </p>
            </section>
          )}

          {/* SECTION 05: COST CHART */}
          {stepReady.results && monthlySpend > 0 && (
            <section className="mb-20 fade-in">
              <StepLabel num="05" title="결과 · 누적 비용 곡선" />
              <div className="bg-white" style={{ border: '1px solid #E7E5E0' }}>
                <div className="p-6 md:p-10">
                  <div className="mb-6">
                    <div className="text-xs md:text-sm uppercase tracking-[0.15em] text-stone-500 mb-2 flex items-center gap-2">
                      <span className="relative inline-block w-1.5 h-1.5 pulse-dot" style={{ color: '#B91C1C', background: '#B91C1C', borderRadius: '50%' }} />
                      <span className="tabular">{yearDisplay}년 후</span>
                      <span>현재 방식 누적</span>
                    </div>
                    <div className="live-tick display tabular font-black leading-none"
                      style={{ color: '#B91C1C', fontSize: 'clamp(1.75rem, 7vw, 3.5rem)' }}
                      key={`current-big-${Math.round(revealedYear * 10)}`}>
                      {formatWonNatural(liveCurrentValue)}
                    </div>
                  </div>

                  <div className="border-t border-stone-200 my-6" />

                  <div className="mb-6">
                    <div className="text-xs md:text-sm uppercase tracking-[0.15em] text-stone-500 mb-2">
                      <span>벨녹 도입 시</span>{' '}
                      <span className="tabular">{yearDisplay}년 후</span>
                    </div>
                    <div className="live-tick display tabular font-black leading-none"
                      style={{ color: '#0F4C3A', fontSize: 'clamp(1.75rem, 7vw, 3.5rem)' }}
                      key={`velnoc-big-${Math.round(revealedYear * 10)}`}>
                      {formatWonNatural(liveVelnocValue)}
                    </div>
                  </div>
                </div>

                <div className="savings-glow flex flex-col md:flex-row md:items-center md:justify-between px-6 md:px-10 py-6 md:py-8 gap-2"
                  style={{ color: '#F7F5F0' }}>
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2 L8 12 M4 8 L8 12 L12 8" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-emerald-100 font-semibold">
                      벨녹 도입 시 절약
                    </span>
                  </div>
                  <div className="live-tick tabular display font-black leading-none"
                    style={{ fontSize: 'clamp(1.75rem, 8vw, 4rem)' }}
                    key={`savings-big-${Math.round(revealedYear * 10)}`}>
                    {formatWonNatural(liveSavings)}
                  </div>
                </div>

                <div className="p-4 md:p-8 pt-8 md:pt-10">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={animatedChartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid stroke="#E7E5E0" vertical={false} />
                        <XAxis dataKey="year" type="number" domain={[0, period]}
                          ticks={Array.from({ length: period + 1 }, (_, i) => i)}
                          tickFormatter={(v) => (v === 0 ? '시작' : `${v}년`)}
                          stroke="#78716C" tick={{ fontSize: 11 }} axisLine={{ stroke: '#1A1A1A' }} />
                        <YAxis tickFormatter={(v) => formatWonAxis(v)} stroke="#78716C"
                          tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={70}
                          domain={[0, Math.max(currentTotal, velnocTotal, singleshotTotal) * 1.05]} />
                        <Tooltip
                          contentStyle={{ background: '#0A0A0A', border: 'none', borderRadius: 0, color: '#F7F5F0', fontSize: 12 }}
                          labelFormatter={(v) => `${Number(v).toFixed(1)}년 차`}
                          formatter={(v, name) => {
                            if (v === null) return ['—', name];
                            const labels = { current: '현재 방식', singleshot: '단발 업체', velnoc: '벨녹 구독' };
                            return [formatWonNatural(v), labels[name] || name];
                          }} />
                        <Line type="monotone" dataKey="current" stroke="#B91C1C" strokeWidth={2.5} dot={false} isAnimationActive={false} connectNulls={false} />
                        <Line type="monotone" dataKey="singleshot" stroke="#A8A29E" strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} connectNulls={false} />
                        <Line type="monotone" dataKey="velnoc" stroke="#0F4C3A" strokeWidth={2.5} dot={false} isAnimationActive={false} connectNulls={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 pt-6 border-t border-stone-200">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setIsPlaying(!isPlaying)}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center transition-all hover:bg-stone-100"
                        style={{ border: '1px solid #0A0A0A', background: isPlaying ? '#F7F5F0' : '#0A0A0A', color: isPlaying ? '#0A0A0A' : '#F7F5F0' }}>
                        {isPlaying ? (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <rect x="2" y="2" width="3" height="8" fill="currentColor" />
                            <rect x="7" y="2" width="3" height="8" fill="currentColor" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M3 2 L10 6 L3 10 Z" fill="currentColor" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500">진행</span>
                          <span className="tabular text-xs text-stone-600">{yearDisplay}년 / {period}년</span>
                        </div>
                        <div className="relative w-full h-1 bg-stone-200 overflow-hidden">
                          <div className="absolute top-0 left-0 h-full" style={{ width: `${drawProgress * 100}%`, background: '#0A0A0A' }} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs">
                      <LegendDot color="#B91C1C" label="현재 방식" />
                      <LegendDot color="#A8A29E" label="단발 제작 업체" dashed />
                      <LegendDot color="#0F4C3A" label="벨녹 구독" />
                    </div>

                    <button onClick={() => setShowDefinitions(!showDefinitions)}
                      className="mt-6 w-full text-left flex items-center justify-between py-3 px-4 transition-all hover:bg-stone-50"
                      style={{ border: '1px solid #E7E5E0', background: showDefinitions ? '#F7F5F0' : '#FAFAF7' }}>
                      <span className="text-xs uppercase tracking-[0.25em] text-stone-700 font-semibold">
                        비교 대상 정의 + 인플레이션 가정 {showDefinitions ? '–' : '+'}
                      </span>
                      <span className="text-stone-400 text-xs">자세히 보기</span>
                    </button>

                    {showDefinitions && (
                      <div className="fade-in mt-3 p-5 text-xs leading-relaxed space-y-4" style={{ background: '#FAFAF7', border: '1px solid #E7E5E0' }}>
                        <div className="pb-3 border-b border-stone-200">
                          <div className="font-bold text-stone-950 mb-2">인플레이션 가정</div>
                          <ul className="space-y-1 text-stone-700 list-none pl-0">
                            <li>· <strong>광고비</strong>: 사용자 선택 (0% / +10% / +20%)</li>
                            <li>· <strong>호스팅·콘텐츠·도구·벨녹 구독료·인건비</strong>: 연 3%</li>
                            <li>· <span style={{ color: '#0F4C3A' }} className="font-bold">{period}년 후 벨녹 구독료: 월 {formatWonNatural(velnocPriceAtEnd)}</span> (+{velnocPricePct}%)</li>
                          </ul>
                        </div>
                        <DefRow color="#B91C1C" title="현재 방식">
                          본인 입력 월 지출 누적. 광고비는 인플레이션 시나리오, 나머지는 연 3% 상승.
                        </DefRow>
                        <DefRow color="#A8A29E" title="단발 제작 업체">
                          <div className="mb-2">홈페이지를 한 번에 만들어주고 끝나는 외주 업체.</div>
                          <ul className="space-y-1 list-none pl-0">
                            <li>· 초기 제작비 {formatWonNatural(SINGLESHOT_INITIAL)}</li>
                            <li>· 호스팅 월 {formatWonNatural(SINGLESHOT_HOSTING)} (연 3% 인상)</li>
                            <li>· <span style={{ color: '#B91C1C' }} className="font-bold">운영 인건비 월 {formatWonNatural(SINGLESHOT_OPERATION)}</span> (연 3%)</li>
                            <li>· 3년마다 리뉴얼 {formatWonNatural(SINGLESHOT_RENEWAL_COST)}</li>
                          </ul>
                        </DefRow>
                        <DefRow color="#0F4C3A" title="벨녹 구독">
                          월 {formatWonNatural(VELNOC_MONTHLY)}으로 제작 · 운영 · 자동화 · AEO/GEO 전부 포함. 연 3% 인상.
                        </DefRow>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ────────── SECTION 06: NEW — 자산 가치의 격차 ────────── */}
          {stepReady.results && monthlySpend > 0 && (
            <section className="mb-20 fade-in">
              <StepLabel num="06" title="자산 가치의 격차" />

              <div className="bg-white" style={{ border: '1px solid #E7E5E0' }}>
                {/* Header */}
                <div className="p-6 md:p-10 border-b border-stone-200">
                  <div className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-4">진짜 격차는 비용이 아닙니다</div>
                  <p className="display text-xl md:text-3xl font-black leading-tight text-stone-950">
                    비용 차이는 시작일 뿐.<br />
                    <span style={{ color: '#0F4C3A' }}>5년 동안 무엇이 쌓이느냐</span>가 진짜 격차입니다.
                  </p>
                </div>

                {/* Two-column asset comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* LEFT: Current Method */}
                  <div className="p-6 md:p-10 border-b md:border-b-0 md:border-r border-stone-200">
                    <div className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: '#B91C1C' }}>
                      현재 방식 · {yearDisplay}년 후
                    </div>
                    <div className="text-xs text-stone-500 mb-6">보유 자산</div>

                    <div className="space-y-5 mb-8">
                      <div className="opacity-40">
                        <div className="text-sm font-bold text-stone-700 mb-1">광고 데이터</div>
                        <div className="text-xs text-stone-500">대행사 소유 · 내 것 아님</div>
                      </div>
                      <div className="opacity-40">
                        <div className="text-sm font-bold text-stone-700 mb-1">사이트</div>
                        <div className="text-xs text-stone-500">첫날 그대로</div>
                      </div>
                      <div className="opacity-30">
                        <div className="text-sm text-stone-500 italic">— SEO/AEO/GEO 자산 0 —</div>
                        <div className="text-sm text-stone-500 italic">— 자체 콘텐츠 0편 —</div>
                        <div className="text-sm text-stone-500 italic">— 자동화 시스템 0개 —</div>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-stone-200">
                      <div className="text-sm font-bold" style={{ color: '#B91C1C' }}>
                        ⚠ 광고 멈추면 자산 0
                      </div>
                      <div className="text-xs text-stone-500 mt-1">매월 다시 결제해야 유지</div>
                    </div>
                  </div>

                  {/* RIGHT: VELNOC */}
                  <div className="p-6 md:p-10" style={{ background: '#FAFAF7' }}>
                    <div className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: '#0F4C3A' }}>
                      벨녹 도입 시 · {yearDisplay}년 후
                    </div>
                    <div className="text-xs text-stone-500 mb-6">보유 자산</div>

                    <div className="space-y-5 mb-8">
                      <AssetRow label="SEO 상위 키워드" value={liveAssets.seoKeywords} unit="개" maxValue={50} revealKey={Math.round(revealedYear * 10)} />
                      <AssetRow label="AI 검색 인용 누적" value={liveAssets.aiCitations} unit="회" maxValue={100} revealKey={Math.round(revealedYear * 10)} />
                      <AssetRow label="자체 콘텐츠" value={liveAssets.contents} unit="편" maxValue={120} revealKey={Math.round(revealedYear * 10)} />
                      <AssetRow label="자동화 워크플로우" value={liveAssets.automations} unit="개" maxValue={5} revealKey={Math.round(revealedYear * 10)} />
                      <div className="pt-2">
                        <div className="text-sm font-bold text-stone-950 mb-1">방문자·리드 데이터</div>
                        <div className="text-xs" style={{ color: '#0F4C3A' }}>자동 누적 · 내 소유</div>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-stone-200">
                      <div className="text-sm font-bold" style={{ color: '#0F4C3A' }}>
                        ✓ 멈춰도 자산 그대로
                      </div>
                      <div className="text-xs text-stone-500 mt-1">시간이 지날수록 강해짐</div>
                    </div>
                  </div>
                </div>

                {/* Asset Value Chart */}
                <div className="p-4 md:p-8 pt-8 md:pt-10 border-t border-stone-200">
                  <div className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-2">자산 가치 곡선</div>
                  <div className="text-sm text-stone-700 mb-6">
                    0점에서 시작하지만, 5년 후 격차는 측정 불가능합니다.
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={animatedAssetData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <defs>
                          <linearGradient id="velnocAssetGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0F4C3A" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#0F4C3A" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#E7E5E0" vertical={false} />
                        <XAxis dataKey="year" type="number" domain={[0, period]}
                          ticks={Array.from({ length: period + 1 }, (_, i) => i)}
                          tickFormatter={(v) => (v === 0 ? '시작' : `${v}년`)}
                          stroke="#78716C" tick={{ fontSize: 11 }} axisLine={{ stroke: '#1A1A1A' }} />
                        <YAxis stroke="#78716C" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={50}
                          domain={[0, 100]} tickFormatter={(v) => `${v}`} />
                        <Tooltip
                          contentStyle={{ background: '#0A0A0A', border: 'none', borderRadius: 0, color: '#F7F5F0', fontSize: 12 }}
                          labelFormatter={(v) => `${Number(v).toFixed(1)}년 차`}
                          formatter={(v, name) => {
                            if (v === null) return ['—', name];
                            const labels = { currentAsset: '현재 방식 자산', singleshotAsset: '단발 업체 자산', velnocAsset: '벨녹 자산' };
                            return [`${Math.round(v)}점`, labels[name] || name];
                          }} />
                        <Area type="monotone" dataKey="velnocAsset" stroke="#0F4C3A" strokeWidth={2.5} fill="url(#velnocAssetGrad)" isAnimationActive={false} connectNulls={false} />
                        <Line type="monotone" dataKey="singleshotAsset" stroke="#A8A29E" strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} connectNulls={false} />
                        <Line type="monotone" dataKey="currentAsset" stroke="#B91C1C" strokeWidth={2.5} dot={false} isAnimationActive={false} connectNulls={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
                    <LegendDot color="#B91C1C" label="현재 방식 (0 유지)" />
                    <LegendDot color="#A8A29E" label="단발 업체 (정체)" dashed />
                    <LegendDot color="#0F4C3A" label="벨녹 (지수 성장)" />
                  </div>
                  <div className="mt-4 text-[11px] text-stone-500 italic">
                    ※ 자산 가치 점수 = SEO 키워드 + AI 인용 + 콘텐츠 자산 + 자동화 + 데이터 누적의 종합 지표 (0~100)
                  </div>
                </div>

                {/* Conclusion band */}
                <div className="p-6 md:p-10 border-t border-stone-200" style={{ background: '#0A0A0A', color: '#F7F5F0' }}>
                  <div className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-4">결론</div>
                  <p className="display text-xl md:text-3xl font-black leading-tight">
                    비용 차이는 {formatWonNatural(totalSavings)}.<br />
                    자산 가치 차이는 <span style={{ color: '#10B981' }}>측정 불가</span>.
                  </p>
                  <p className="mt-4 text-sm md:text-base text-stone-400 leading-relaxed">
                    벨녹은 매월 SEO·AEO·GEO 점수를 누적합니다.<br />
                    그래서 시간이 지날수록 광고에서 자유로워집니다.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 기회비용 SECTION */}
          {stepReady.results && monthlySpend > 0 && totalSavings > 1000000 && (
            <section className="mb-20 fade-in">
              <div className="p-8 md:p-12" style={{ background: '#0A0A0A', color: '#F7F5F0' }}>
                <div className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-6">기회비용</div>

                <p className="display text-2xl md:text-4xl leading-tight font-black">
                  지난 {period}년간 마케팅에<br />
                  <span className="tabular" style={{ color: '#F7F5F0' }}>{formatWonNatural(currentTotal)}</span>을 지출하셨다면,
                </p>

                {opportunityCosts.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-stone-800">
                    <p className="display text-xl md:text-2xl leading-tight font-black mb-6" style={{ color: '#10B981' }}>
                      이 돈이면 이런 것들이 가능했습니다
                    </p>
                    <div>
                      {opportunityCosts.map((opp, i) => (
                        <div key={i} className="opp-row flex items-baseline justify-between py-4 gap-4">
                          <span className="text-base md:text-lg text-stone-200">{opp.label}</span>
                          <span className="tabular text-base md:text-xl font-bold text-right" style={{ color: '#F7F5F0' }}>
                            {opp.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-10 pt-8 border-t border-stone-800 text-base md:text-lg text-stone-400 leading-relaxed">
                  광고는 멈추면 사라지지만,<br />
                  벨녹은 멈춰도 <span style={{ color: '#F7F5F0' }}>{period}년치 자산이 그대로 남습니다.</span>
                </div>
              </div>
            </section>
          )}

          {stepReady.results && (
            <section className="mb-16 fade-in">
              {!showLeadForm && !submitted && (
                <button onClick={() => setShowLeadForm(true)}
                  className="w-full py-6 px-8 flex items-center justify-between transition-all hover:bg-stone-100 bg-white"
                  style={{ border: '1px solid #0A0A0A' }}>
                  <div className="text-left">
                    <div className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-2">다음 단계</div>
                    <div className="display text-xl md:text-2xl font-black text-stone-950">상세 PDF 리포트 + 무료 진단 →</div>
                  </div>
                  <span className="text-2xl">↓</span>
                </button>
              )}

              {showLeadForm && !submitted && (
                <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 fade-in" style={{ border: '1px solid #0A0A0A' }}>
                  <h3 className="display text-2xl md:text-3xl font-black text-stone-950 mb-2">무료 AI 검색 가시성 진단</h3>
                  <p className="text-sm text-stone-600 mb-8 leading-relaxed">위 시뮬레이션의 상세 PDF 리포트와 함께,<br />귀사의 AI 검색 노출 현황을 진단해 드립니다.</p>
                  <div className="space-y-4 mb-8">
                    <FormInput label="이름" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                    <FormInput label="회사명" value={form.company} onChange={(v) => setForm({ ...form, company: v })} required />
                    <FormInput label="이메일" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                    <FormInput label="연락처" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  </div>
                  <button type="submit" className="w-full py-5 display text-lg font-black tracking-tight text-stone-50 hover:opacity-90 transition-opacity" style={{ background: '#0F4C3A' }}>
                    무료 진단 신청 →
                  </button>
                </form>
              )}

              {submitted && (
                <div className="p-10 md:p-12 text-center fade-in" style={{ background: '#0F4C3A', color: '#F7F5F0' }}>
                  <div className="text-xs uppercase tracking-[0.25em] text-emerald-200 mb-6">접수 완료</div>
                  <h3 className="display text-3xl md:text-4xl font-black mb-4">잠시 후 메일을 확인해 주세요</h3>
                  <p className="text-base text-emerald-100 leading-relaxed">{form.name} 님,<br />24시간 안에 PDF 리포트와 함께 진단 결과를 보내드립니다.</p>
                </div>
              )}
            </section>
          )}

          <footer className="pt-12 border-t border-stone-300 text-xs text-stone-500 leading-relaxed">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div>VELNOC — Site · Signal · Engine<br />매월 자라는 AI 검색 가시성</div>
              <div className="text-stone-400">v7.0 · 시뮬레이션 결과는 추정치입니다</div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function StepLabel({ num, title }) {
  return (
    <div className="flex items-baseline gap-4 mb-6">
      <span className="tabular text-xs text-stone-500">{num}</span>
      <div className="flex-1 h-px bg-stone-300" />
      <span className="text-xs uppercase tracking-[0.25em] text-stone-700 font-semibold">{title}</span>
    </div>
  );
}

function SliderInput({ label, value, setValue, max, step, highlight }) {
  return (
    <div className="py-5 first:pt-0 border-b border-stone-100 last:border-b-0 last:pb-0">
      <div className="flex items-baseline justify-between mb-3">
        <label className="text-sm text-stone-700 flex items-center gap-2">
          {label}
          {highlight && (
            <span className="text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5" style={{ background: '#FEF2F2', color: '#B91C1C' }}>
              인플레이션 영향
            </span>
          )}
        </label>
        <span className="tabular text-sm md:text-base font-bold text-stone-950">{formatWonNatural(value)}</span>
      </div>
      <input type="range" min={0} max={max} step={step} value={value} onChange={(e) => setValue(Number(e.target.value))} />
    </div>
  );
}

function AssetRow({ label, value, unit, maxValue, revealKey }) {
  const fillPct = Math.min(100, (value / maxValue) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-bold text-stone-950">{label}</span>
        <span className="live-tick tabular text-lg display font-black" style={{ color: '#0F4C3A' }} key={`${label}-${revealKey}`}>
          {value.toLocaleString('ko-KR')}{unit}
        </span>
      </div>
      <div className="asset-bar">
        <div className="asset-bar-fill" style={{ width: `${fillPct}%` }} />
      </div>
    </div>
  );
}

function LegendDot({ color, label, dashed }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-block"
        style={{ width: 20, height: 2,
          background: dashed ? `repeating-linear-gradient(to right, ${color} 0 4px, transparent 4px 8px)` : color }} />
      <span className="text-stone-600">{label}</span>
    </div>
  );
}

function DefRow({ color, title, children }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 mt-1" style={{ width: 3, background: color, alignSelf: 'stretch' }} />
      <div className="flex-1">
        <div className="font-bold text-stone-950 mb-1.5">{title}</div>
        <div className="text-stone-700">{children}</div>
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
        {label}{required && <span className="text-red-700"> *</span>}
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full py-3 px-4 bg-stone-50 text-stone-950 outline-none focus:bg-white transition-colors"
        style={{ border: '1px solid #D6D3CE' }} />
    </div>
  );
}
