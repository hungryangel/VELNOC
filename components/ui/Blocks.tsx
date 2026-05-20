import Link from "next/link";

import { ButtonLink } from "@/components/ui/ButtonLink";

export function Hero({
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
  editorial = false,
  enTitle,
  visual = false
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  editorial?: boolean;
  enTitle?: string;
  visual?: boolean;
}) {
  return (
    <section className="hero compact" aria-labelledby="hero-title">
      <div className={editorial ? "container-narrow" : "container"}>
        <div className={visual ? "hero-grid" : ""}>
          <div className="hero-copy">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 id="hero-title" className={editorial ? "display-head" : "h1"}>
              {title.split("\n").map((line, index) => (
                <span key={line}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>
            {enTitle && <p className="display-en">{enTitle}</p>}
            {subtitle && (
              <p className="lead">
                {subtitle.split("\n").map((line, index) => (
                  <span key={line}>
                    {index > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            )}
            {(primary || secondary) && (
              <div className="button-row">
                {primary && <ButtonLink href={primary.href}>{primary.label}</ButtonLink>}
                {secondary && (
                  <Link href={secondary.href} className="button button-outline">
                    {secondary.label}
                  </Link>
                )}
              </div>
            )}
          </div>
          {visual && <HeroDiagram />}
        </div>
      </div>
    </section>
  );
}

function HeroDiagram() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="diagnosis-preview" role="img" aria-label="벨녹 진단 결과 미리보기">
        <div className="diagnosis-preview-head">
          <span className="diagnosis-preview-prompt">$</span>
          <span className="diagnosis-preview-cmd">velnoc diagnose</span>
        </div>
        <ul className="diagnosis-preview-rows">
          <li>
            <span className="dp-key">stage</span>
            <span className="dp-sep">:</span>
            <span className="dp-val">02 · 인지</span>
          </li>
          <li>
            <span className="dp-key">gaps</span>
            <span className="dp-sep">:</span>
            <span className="dp-val">구조화 데이터 · 인덱싱</span>
          </li>
          <li>
            <span className="dp-key">next</span>
            <span className="dp-sep">:</span>
            <span className="dp-val">03 · 노출</span>
          </li>
          <li>
            <span className="dp-key">suggested</span>
            <span className="dp-sep">:</span>
            <span className="dp-val">Pulse 3개월부터</span>
          </li>
        </ul>
        <div className="diagnosis-preview-foot">
          <span className="dp-stage-chip">[STAGE 02]</span>
          <span className="dp-meta">실제 진단은 5분 소요 · 연락처 없이 결과 확인</span>
        </div>
      </div>
    </div>
  );
}

export function Section({
  eyebrow,
  title,
  children,
  muted = false,
  narrow = false
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  muted?: boolean;
  narrow?: boolean;
}) {
  return (
    <section className={`section ${muted ? "section-muted" : ""}`}>
      <div className={narrow ? "container-narrow" : "container"}>
        {(eyebrow || title) && (
          <div className="section-head">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function Card({
  title,
  children,
  meta,
  featured = false,
  id
}: {
  title: string;
  children: React.ReactNode;
  meta?: string;
  featured?: boolean;
  id?: string;
}) {
  return (
    <article id={id} className={`card ${featured ? "featured-card" : ""}`}>
      {featured && <p className="micro card-meta">Recommended</p>}
      {meta && <p className="micro card-meta">{meta}</p>}
      <h3 className="card-title">{title}</h3>
      <div className="body-copy">{children}</div>
    </article>
  );
}

export type ComparisonStatus = {
  status: "yes" | "no" | "partial";
  label?: string;
};

type ComparisonCell = React.ReactNode | ComparisonStatus;

export function ComparisonTable({
  headers,
  rows
}: {
  headers: string[];
  rows: Array<Array<ComparisonCell>>;
}) {
  return (
    <div className="table-wrap">
      <table className="compare-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={header} className={index === headers.length - 1 ? "center velnoc-col" : index > 0 ? "center" : ""}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
                  className={[
                    cellIndex === headers.length - 1 ? "center velnoc-col" : "",
                    cellIndex > 0 ? "center" : ""
                  ].join(" ")}
                >
                  <ComparisonCellContent cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function isComparisonStatus(cell: ComparisonCell): cell is ComparisonStatus {
  return typeof cell === "object" && cell !== null && "status" in cell;
}

function ComparisonCellContent({ cell }: { cell: ComparisonCell }) {
  if (!isComparisonStatus(cell)) return <>{cell}</>;
  const label = cell.status === "yes" ? "지원" : cell.status === "no" ? "미지원" : "부분 지원";
  return (
    <span className={`compare-status ${cell.status}`}>
      <StatusIcon status={cell.status} />
      <span className="visually-hidden">{label}</span>
      {cell.label && <span className="compare-status-label">{cell.label}</span>}
    </span>
  );
}

function StatusIcon({ status }: { status: ComparisonStatus["status"] }) {
  if (status === "yes") {
    return (
      <svg className="compare-status-icon" viewBox="0 0 20 20" role="img" aria-label="지원">
        <path d="M4.5 10.5 8.2 14 15.5 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "no") {
    return (
      <svg className="compare-status-icon" viewBox="0 0 20 20" role="img" aria-label="미지원">
        <path d="M6 6 14 14M14 6 6 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="compare-status-icon" viewBox="0 0 20 20" role="img" aria-label="부분 지원">
      <path d="M4.5 10h11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PullQuote({ children, editorial = false }: { children: React.ReactNode; editorial?: boolean }) {
  return <blockquote className={editorial ? "editorial-block" : "pullquote"}>{children}</blockquote>;
}
