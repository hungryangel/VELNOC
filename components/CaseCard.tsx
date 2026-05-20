import type { caseItems } from "@/lib/content";

type CaseItem = (typeof caseItems)[number];

const caseMetaById = {
  "case-jeongseondang": {
    client: "홍삼 전문점 (가칭: 정선당)",
    stage: "LIVING PROOF",
    duration: "진행 중",
    disclosure: "클라이언트 동의 후",
    stageKey: "LIVING",
    status: "진행 중"
  },
  "case-finedu": {
    client: "비공개 금융교육 플랫폼",
    stage: "VELNOC STUDIO",
    duration: "3개월 / 납품 완료",
    disclosure: "클라이언트 승인 후",
    stageKey: "STUDIO",
    status: "납품 완료"
  },
  "case-farmos": {
    client: "돼지농장 운영 OS",
    stage: "VELNOC OS",
    duration: "6개월 / 진행 중",
    disclosure: "첫 운영 사이클 완료 후",
    stageKey: "OS",
    status: "진행 중"
  },
  "case-panayo": {
    client: "파나요",
    stage: "자체 프로젝트",
    duration: "출전 중",
    disclosure: "대회 결과 발표 후",
    stageKey: "SELF",
    status: "출전 중"
  }
} as const;

type CaseId = keyof typeof caseMetaById;

export function CaseCard({ item }: { item: CaseItem }) {
  const meta = caseMetaById[item.id as CaseId];

  return (
    <article id={item.id} className="card case-card">
      <header className="case-card-head">
        <span className="case-card-stage-chip" data-stage={meta.stageKey}>
          {meta.stage}
        </span>
        <span className="case-card-status">{meta.status}</span>
      </header>

      <h3 className="card-title">{item.title}</h3>

      <div className="body-copy case-card-body">
        {item.summary && (
          <p>
            <strong>{item.summary}</strong>
          </p>
        )}
        {item.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <dl className="case-card-meta-grid">
        <div className="case-card-meta-row">
          <dt>CLIENT</dt>
          <dd>{meta.client}</dd>
        </div>
        <div className="case-card-meta-row">
          <dt>STAGE</dt>
          <dd>{meta.stage}</dd>
        </div>
        <div className="case-card-meta-row">
          <dt>DURATION</dt>
          <dd>{meta.duration}</dd>
        </div>
        <div className="case-card-meta-row">
          <dt>DISCLOSURE</dt>
          <dd>{meta.disclosure}</dd>
        </div>
      </dl>
    </article>
  );
}
