import type { Metadata } from "next";
import { CaseCard } from "@/components/CaseCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Hero, Section } from "@/components/ui/Blocks";
import { caseItems } from "@/lib/content";
import { JsonLd, buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata("cases");

function casesJsonLd() {
  return caseItems.map((item) => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    creator: { "@type": "Organization", name: "VELNOC" },
    dateCreated: "2026",
    description: item.summary || item.body[0]
  }));
}

export default function CasesPage() {
  return (
    <>
      <JsonLd data={casesJsonLd()} />
      <Hero
        title="말이 아니라 결과물로 증명합니다."
        subtitle="벨녹이 직접 만들었거나 진행 중인 4개의 케이스입니다. 비밀유지나 진행 단계 때문에 세부는 제한적으로 공개합니다."
      />
      <Section>
        <div className="grid-2 case-card-grid">
          {caseItems.map((item) => (
            <CaseCard key={item.id} item={item} />
          ))}
        </div>
        <div className="button-row">
          <ButtonLink href="/contact">이런 케이스를 함께 만들고 싶다면</ButtonLink>
          <ButtonLink href="/tools/diagnosis" variant="secondary">자가 진단 먼저 시작 →</ButtonLink>
        </div>
      </Section>
    </>
  );
}
