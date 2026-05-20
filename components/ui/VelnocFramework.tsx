const FRAMEWORK_STEPS = [
  {
    step: "STAGE 01",
    title: "무지",
    badge: "진단으로 시작",
    summary: "AI가 웹사이트의 존재나 내용을 아직 알지 못하는 단계",
    body: "사업 정보가 흩어져 있으면 AI는 우리 사업을 답변 후보로도 올리지 못합니다."
  },
  {
    step: "STAGE 02",
    title: "인지",
    badge: "Site / Seed / Pulse",
    summary: "AI가 사업 정보를 스캔하고 식별하기 시작하는 단계",
    body: "사이트 구조와 기본 정보가 정리되면 AI가 이름과 맥락을 알아보기 시작합니다."
  },
  {
    step: "STAGE 03",
    title: "노출",
    badge: "Signal",
    summary: "특정 질문에서 우리 사업을 답변 후보로 고려하는 단계",
    body: "검색어와 콘텐츠가 연결되면 관련 질문에서 우리 사업이 후보군에 들어갑니다."
  },
  {
    step: "STAGE 04",
    title: "인용",
    badge: "Engine",
    summary: "AI가 답변 안에서 우리 사업 정보를 직접 보여주는 단계",
    body: "출처와 신뢰 신호가 정리되면 답변 안에서 이름과 정보가 인용됩니다."
  },
  {
    step: "STAGE 05",
    title: "신뢰",
    badge: "Engine (시간 누적)",
    summary: "반복적으로 먼저 확인되는 신뢰 출처가 되는 단계",
    body: "일관된 콘텐츠와 운영 신호가 쌓이면 AI가 먼저 확인하는 출처가 됩니다."
  }
];

export function VelnocFramework() {
  return (
    <div className="velnoc-framework framework-process">
      <div className="framework-grain">
        <section className="framework-process-section" aria-labelledby="framework-process-title">
          <div className="container framework-process-shell">
            <p className="eyebrow">VELNOC STAGE MAP · 벨녹 5단계</p>
            <h2 id="framework-process-title" className="framework-process-title">
              AI는 사업을 이렇게 이해합니다.
            </h2>
            <p className="framework-process-lead">
              벨녹 5단계(VELNOC Stage Map)는 무지에서 신뢰까지, 사업이 검색과 AI 안에서 자산으로 남는 흐름입니다.
            </p>

            <div className="framework-process-grid" role="list" aria-label="벨녹 5단계">
              {FRAMEWORK_STEPS.map((step) => (
                <article key={step.step} className="framework-process-card" role="listitem">
                  <span className="framework-stage-badge">{step.badge}</span>
                  <p className="framework-process-step">{step.step}</p>
                  <h3>{step.title}</h3>
                  <p className="framework-process-summary">{step.summary}</p>
                  <p className="framework-process-body">{step.body}</p>
                </article>
              ))}
            </div>

            <p className="framework-process-note">
              아래 진단은 이 흐름 위에서 우리 사업이 어디쯤인지 확인하는 단계입니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
