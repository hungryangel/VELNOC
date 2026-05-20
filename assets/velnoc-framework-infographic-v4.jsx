import React, { useState, useEffect, useRef } from 'react';

/* ============================================================
   VELNOC 5단계 프레임워크 v4
   ------------------------------------------------------------
   v3 ➞ v4 changes:
   + "다음으로 가는 방법" 신규 요소 (정적 → 동적 여정 안내)
   + 카드 콘텐츠 압축 (5요소 구조)
   + 디테일 아코디언 (더 보기 ▼)
   + Framer sticky offset 호환 (CSS variable)
   + Stage 5 CTA 강화 (인라인 행동 버튼)
   ============================================================ */

const STAGES = [
  {
    id: 1,
    name: '광고만 운영',
    subtitle: '광고 100% · 자력 0%',
    headline: '대부분의 사장님이 시작하는 자리',
    desc: '광고비 매월 지출 / 자산은 0. 광고를 끄는 순간 유입과 매출이 사라집니다.',
    nextStep: '도메인 권위와 사이트 구조부터 측정합니다. AI가 읽을 수 있도록 schema.org 마크업과 메타데이터 정비를 시작합니다.',
    details: [
      '광고비 = 월세 (매월 사라짐)',
      'SEO · AEO · GEO 자산 0',
      '광고 멈추면 매출 즉시 하락',
    ],
    productLabel: '시작점 — 진입 전',
    accent: '#B91C1C',
    selfPower: 0,
  },
  {
    id: 2,
    name: '사이트 완성',
    subtitle: '광고 90% · 자력 10%',
    headline: '홈페이지를 갖춘 상태',
    desc: '도메인 권위, 사이트 구조, 기초 SEO 세팅. 자산 형성의 첫 걸음.',
    nextStep: '매월 콘텐츠 3~5개를 발행하고, 키워드를 사이트에 심습니다. 6개월 후 자연 유입이 시작됩니다.',
    details: [
      '사이트 구조 + 메타데이터 정비',
      'schema.org 마크업 시작',
      '기초 SEO 키워드 매핑',
    ],
    productLabel: '벨녹 Site · 월 9만 원',
    accent: '#A8A29E',
    selfPower: 10,
  },
  {
    id: 3,
    name: 'SEO 작동',
    subtitle: '광고 60% · 자력 40%',
    headline: 'SEO 운영으로 자연 유입 시작',
    desc: '블로그·콘텐츠가 검색 결과에 노출. 광고 외 첫 매출 채널이 생깁니다.',
    nextStep: 'AEO/GEO 스키마를 적용하고, AI 인용을 추적합니다. 외부 권위 신호도 함께 쌓습니다.',
    details: [
      '월 5~20개 키워드 상위 노출',
      '자연 유입 트래픽 본격화',
      '광고 외 첫 매출 채널 확보',
    ],
    productLabel: '벨녹 Signal · 월 19만 원',
    accent: '#D97706',
    selfPower: 40,
  },
  {
    id: 4,
    name: 'AEO 인용',
    subtitle: '광고 30% · 자력 70%',
    headline: 'AI가 사이트를 출처로 인식',
    desc: 'GPT · Gemini · Perplexity 답변에 사이트가 인용됩니다. AEO/GEO 구조의 결실.',
    nextStep: '자동화 워크플로우 5개로 운영 시간을 줄이고, 광고비를 단계적으로 줄여갑니다.',
    details: [
      'GPT · Gemini · Perplexity 인용',
      '구글 AI 개요 · 네이버 AI 브리핑 노출',
      'AI 검색 권위 출처로 등재',
    ],
    productLabel: '벨녹 Signal · 12개월 누적',
    accent: '#15803D',
    selfPower: 70,
  },
  {
    id: 5,
    name: '검색 독립',
    subtitle: '광고 0% · 자력 100%',
    headline: '벨녹만 도달하는 정상',
    desc: '광고 없이도 사업이 굴러갑니다. 시스템이 자가 운영됩니다.',
    nextStep: '매월 새 콘텐츠와 새 자동화로 자산이 계속 자랍니다. 한번 도달하면 유지는 자동입니다.',
    details: [
      '광고비 0 (또는 선택적 운영)',
      '자동화 워크플로우 5개 이상',
      '자산이 매월 자라는 시스템 완성',
    ],
    productLabel: '벨녹 Engine · 월 49만 원',
    accent: '#0F4C3A',
    selfPower: 100,
  },
];

const COMPETITOR_DROPOFFS = {
  2: {
    name: '단발 홈페이지 제작 업체',
    priceRange: '50~150만 원대 1회 패키지',
    desc: '제작 후 6개월~1년 안에 사이트가 잠듭니다. 사장님은 다시 광고로 돌아갑니다.',
  },
  3: {
    name: '일반 마케팅 대행사',
    priceRange: '월 100~300만 원 광고·콘텐츠 운영',
    desc: '광고·콘텐츠 운영까지가 한계. 사이트 기술 자산은 본인 소유 X.',
  },
  4: {
    name: '단발 AEO/GEO 업체',
    priceRange: '100~550만 원대 1회 패키지 + 단기 관리',
    desc: '인용 한 번 받고 관리 종료. 이후 자동 유지 안 됨.',
  },
};

export default function VelnocFrameworkV4() {
  const [activeId, setActiveId] = useState(1);
  const sectionRef = useRef(null);
  const STAGE_COUNT = STAGES.length;

  useEffect(() => {
    let ticking = false;
    const updateStage = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewport = window.innerHeight;
      const pinDistance = rect.height - viewport;
      if (pinDistance <= 0) return;
      const progress = Math.max(0, Math.min(0.9999, -rect.top / pinDistance));
      const stage = Math.min(STAGE_COUNT, Math.floor(progress * STAGE_COUNT) + 1);
      setActiveId(stage);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateStage);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateStage();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [STAGE_COUNT]);

  const activeStage = STAGES[activeId - 1];
  const competitorAtThisStage = COMPETITOR_DROPOFFS[activeId];

  const scrollToStage = (stageId) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const viewport = window.innerHeight;
    const pinDistance = rect.height - viewport;
    const targetProgress = (stageId - 1) / STAGE_COUNT;
    const targetScrollY = window.scrollY + rect.top + targetProgress * pinDistance + 1;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  return (
    <div className="velnoc-framework w-full" style={{ background: '#F7F5F0' }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');
        
        /* Framer 헤더 호환: 기본 0, Framer에서 override 가능 */
        .velnoc-framework {
          --framer-header-height: 0px;
        }
        
        .velnoc-framework, .velnoc-framework * {
          font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-feature-settings: 'tnum' on, 'lnum' on;
        }
        .velnoc-framework .tabular { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
        .velnoc-framework .display { letter-spacing: -0.035em; }
        .velnoc-framework .grain {
          background-image: radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px);
          background-size: 3px 3px;
        }
        .velnoc-framework .fade-in-stage {
          animation: fadeInStage 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes fadeInStage {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .velnoc-framework .fade-in-accordion {
          animation: fadeIn 0.3s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .velnoc-framework .scroll-arrow {
          animation: scrollHint 1.8s ease-in-out infinite;
        }
        @keyframes scrollHint {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(6px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .velnoc-framework .fade-in-stage,
          .velnoc-framework .fade-in-accordion,
          .velnoc-framework .scroll-arrow { animation: none; }
        }
      `}</style>

      <div className="grain">
        {/* ====== 상단 인트로 ====== */}
        <section className="max-w-5xl mx-auto px-6 pt-20 md:pt-32 pb-16 md:pb-20">
          <div className="text-xs tracking-[0.25em] uppercase text-stone-500 mb-6">
            VELNOC FRAMEWORK
          </div>
          <h1 className="display text-[2rem] md:text-[3.5rem] leading-[1] font-black text-stone-950 mb-6">
            <span style={{ color: '#0F4C3A' }}>검색 독립</span>까지의<br />
            5단계
          </h1>
          <p className="text-base md:text-lg text-stone-600 max-w-xl leading-relaxed mb-8">
            대부분의 서비스는 중간에서 멈춥니다.<br />
            벨녹은 사장님을 정상까지 데려갑니다.
          </p>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-stone-500">
            <span>아래로 스크롤</span>
            <svg width="16" height="16" viewBox="0 0 16 16" className="scroll-arrow">
              <path d="M8 2 L8 12 M4 8 L8 12 L12 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </section>

        {/* ====== 스냅 스크롤 단계 카드 섹션 ====== */}
        <section
          ref={sectionRef}
          style={{
            height: `${(STAGE_COUNT + 1) * 100}vh`,
            position: 'relative',
            isolation: 'isolate',
          }}
        >
          <div
            style={{
              position: 'sticky',
              top: 'var(--framer-header-height, 0px)',
              height: 'calc(100vh - var(--framer-header-height, 0px))',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <StageCard
              key={activeId}
              stage={activeStage}
              competitor={competitorAtThisStage}
              isLast={activeId === STAGE_COUNT}
              activeId={activeId}
              stageCount={STAGE_COUNT}
              onJumpToStage={scrollToStage}
            />
          </div>
        </section>

        {/* ====== 하단 푸터 (CTA는 Stage 5에 흡수됨) ====== */}
        <section className="max-w-5xl mx-auto px-6 py-12">
          <footer className="pt-12 border-t border-stone-300 text-xs text-stone-500 leading-relaxed">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div>VELNOC — Site · Signal · Engine<br />매월 자라는 AI 검색 가시성</div>
              <div className="text-stone-400">Framework v4.0</div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}

/* ============================================================
   STAGE CARD — 5요소 압축 구조
   ============================================================ */
function StageCard({ stage, competitor, isLast, activeId, stageCount, onJumpToStage }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="w-full h-full px-6 py-8 md:py-12 overflow-y-auto flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center fade-in-stage">

        {/* 1. 프로그레스 인디케이터 */}
        <ProgressDots activeId={activeId} stageCount={stageCount} onClick={onJumpToStage} />

        {/* 2. STAGE 레이블 + 큰 이름 */}
        <div className="mt-8 md:mt-10 mb-2">
          <div className="text-xs uppercase tracking-[0.25em] mb-2 flex items-center gap-3" style={{ color: stage.accent }}>
            <span className="tabular font-bold">STAGE 0{stage.id}</span>
            <span className="h-px flex-1" style={{ background: stage.accent, opacity: 0.3 }} />
            <span className="tabular">{stage.subtitle}</span>
          </div>
          <h2 className="display text-4xl md:text-6xl font-black leading-[0.95] text-stone-950">
            {stage.name}
          </h2>
        </div>

        {/* 3. 핵심 메시지 (헤드라인 + 짧은 설명) */}
        <div className="mb-6">
          <p className="display text-lg md:text-2xl font-black leading-tight text-stone-800 mb-3">
            {stage.headline}
          </p>
          <p className="text-sm md:text-base text-stone-600 leading-relaxed">
            {stage.desc}
          </p>
        </div>

        {/* 4. 다음으로 가는 방법 (신규 핵심 요소) */}
        <div
          className="mb-6 p-4 md:p-5"
          style={{
            background: 'rgba(15, 76, 58, 0.04)',
            borderLeft: `3px solid ${stage.accent}`,
          }}
        >
          <div className="text-xs uppercase tracking-[0.2em] mb-2 flex items-center gap-2" style={{ color: stage.accent }}>
            <ForwardIcon color={stage.accent} />
            <span>{isLast ? '이 상태를 유지하는 방법' : '다음 단계로 가는 방법'}</span>
          </div>
          <p className="text-sm md:text-base text-stone-700 leading-relaxed">
            {stage.nextStep}
          </p>
          <div className="mt-3 text-xs">
            <span className="uppercase tracking-[0.2em] text-stone-500">권장 제품 · </span>
            <span className="font-bold text-stone-950">{stage.productLabel}</span>
          </div>
        </div>

        {/* 5. 광고 의존도 게이지 */}
        <div className="mb-6">
          <DependencyBar adPct={100 - stage.selfPower} />
        </div>

        {/* 6. 경쟁사 종착 콜아웃 OR Stage 5 정상 CTA */}
        {competitor && (
          <div className="mb-4 p-4" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
            <div className="text-xs uppercase tracking-[0.25em] mb-2 flex items-center gap-2" style={{ color: '#B91C1C' }}>
              <CrossIcon />
              <span>이 단계에서 멈추는 서비스</span>
            </div>
            <div className="text-sm md:text-base font-bold text-stone-950 mb-1">
              {competitor.name}
            </div>
            <div className="text-xs text-stone-600 mb-2 italic">
              {competitor.priceRange}
            </div>
            <div className="text-xs md:text-sm text-stone-700 leading-relaxed">
              {competitor.desc}
            </div>
          </div>
        )}

        {isLast && (
          <div className="mb-4 p-5 md:p-6" style={{ background: '#0A0A0A', color: '#F7F5F0' }}>
            <div className="text-xs uppercase tracking-[0.25em] mb-3 text-emerald-400">
              ★ 벨녹만 도달하는 정상
            </div>
            <p className="display text-lg md:text-2xl font-black leading-tight mb-4">
              지금 어느 단계인지<br />
              5초 만에 확인하세요.
            </p>
            <button
              className="display text-sm md:text-base font-black tracking-tight px-6 py-3 transition-all hover:opacity-90"
              style={{ background: '#0F4C3A', color: '#F7F5F0' }}
              onClick={() => alert('시뮬레이터로 이동 (Framer에서 링크 연결)')}
            >
              무료 단계 진단 시작 →
            </button>
          </div>
        )}

        {/* 7. 디테일 아코디언 */}
        <button
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="text-left flex items-center justify-between py-2 px-3 transition-all hover:bg-stone-50"
          style={{ background: detailsOpen ? '#FAFAF7' : 'transparent', border: '1px solid #E7E5E0' }}
        >
          <span className="text-xs uppercase tracking-[0.25em] text-stone-600 font-semibold">
            세부 사항
          </span>
          <span className="text-stone-400 text-xs">{detailsOpen ? '접기 ▲' : '더 보기 ▼'}</span>
        </button>
        {detailsOpen && (
          <ul className="fade-in-accordion mt-3 space-y-2">
            {stage.details.map((d, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-stone-700">
                <span className="flex-shrink-0 mt-1.5 w-1 h-1" style={{ background: stage.accent }} />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        )}

        {/* 8. 스크롤 힌트 (마지막 제외) */}
        {!isLast && (
          <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-stone-400">
            <span>다음 단계로 스크롤</span>
            <svg width="14" height="14" viewBox="0 0 16 16" className="scroll-arrow">
              <path d="M8 2 L8 12 M4 8 L8 12 L12 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   PROGRESS DOTS
   ============================================================ */
function ProgressDots({ activeId, stageCount, onClick }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: stageCount }).map((_, i) => {
        const id = i + 1;
        const isActive = id === activeId;
        const isPast = id < activeId;
        return (
          <button
            key={id}
            onClick={() => onClick(id)}
            className="block transition-all"
            style={{
              width: isActive ? 36 : 12,
              height: 4,
              background: isActive ? '#0A0A0A' : isPast ? '#78716C' : '#D6D3CE',
            }}
            aria-label={`Stage ${id}`}
          />
        );
      })}
      <span className="tabular text-[10px] text-stone-500 ml-3">
        0{activeId} / 0{stageCount}
      </span>
    </div>
  );
}

/* ============================================================
   ICONS
   ============================================================ */
function CrossIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <line x1="3" y1="3" x2="11" y2="11" stroke="#B91C1C" strokeWidth="1.5" />
      <line x1="11" y1="3" x2="3" y2="11" stroke="#B91C1C" strokeWidth="1.5" />
    </svg>
  );
}

function ForwardIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ============================================================
   DEPENDENCY BAR
   ============================================================ */
function DependencyBar({ adPct }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-[0.25em] text-stone-500">광고 의존도</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="tabular font-bold" style={{ color: '#B91C1C' }}>{adPct}%</span>
          <span className="text-stone-400">/</span>
          <span className="tabular font-bold" style={{ color: '#0F4C3A' }}>{100 - adPct}%</span>
        </div>
      </div>
      <div className="flex h-1.5 overflow-hidden">
        <div className="transition-all duration-700" style={{ width: `${adPct}%`, background: '#B91C1C' }} />
        <div className="transition-all duration-700" style={{ width: `${100 - adPct}%`, background: '#0F4C3A' }} />
      </div>
    </div>
  );
}
