import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card, Hero, Section } from "@/components/ui/Blocks";
import { caseItems } from "@/lib/content";
import { JsonLd, buildMetadata, personJsonLd } from "@/lib/site";

export const metadata: Metadata = buildMetadata("about");

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <Hero
        title="어느 한 분야에 갇히지 않기 위해, 모든 분야를 통과해 왔습니다."
        subtitle="벨녹은 단편적 외주·대행이 아닌, 비즈니스 전체 구조를 조망하고 최적화하는 통합형 아키텍트입니다."
      />
      <Section title="학벌도, 전 직장도, 자격증도 — 그것이 사장님의 병목을 풀어주지 않습니다." narrow>
        <div className="body-copy" style={{ display: "grid", gap: "var(--space-4)" }}>
          <p>&quot;OO 출신&quot;이라는 타이틀은 시간이 멈춘 좌표입니다. 1년을 다녀도 OO 출신이고, 10년을 다녀도 OO 출신입니다.</p>
          <p>벨녹은 학벌·이력으로 자신을 증명하지 않습니다. 어떤 문제를 어떻게 풀었는가 — 그 결과물로만 이야기합니다.</p>
        </div>
      </Section>
      <Section title="네 개의 결과물이 보여주는 시각의 폭" muted>
        <div className="grid-2">
          {caseItems.map((item) => (
            <Card key={item.id} title={item.title} meta={item.tag}>
              {item.summary && <p><strong>{item.summary}</strong></p>}
              <p>{item.body[0]}</p>
              <p className="micro">{item.disclosure}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="소수 정예 팀이기에 가능한 책임의 일관성." narrow>
        <div className="body-copy" style={{ display: "grid", gap: "var(--space-4)" }}>
          <p>분업화된 대행사가 잃는 가장 큰 자산은 <strong>연결고리</strong>입니다. 마케터는 광고만 보고, 개발자는 코드만 짜고, 디자이너는 화면만 봅니다. 그 사이의 책임은 누구도 들지 않습니다.</p>
          <p>벨녹은 검증된 소수의 전문가들과 팀 단위로 긴밀하게 일합니다. 동시 진행 프로젝트 수를 의도적으로 제한해 품질을 지키고, 전략·구조 설계·판단의 책임을 끝까지 이어갑니다.</p>
        </div>
        <div className="button-row">
          <ButtonLink href="/about/origin">Origin Story 읽기 →</ButtonLink>
          <ButtonLink href="/manifesto" variant="secondary">Manifesto 읽기</ButtonLink>
        </div>
      </Section>
    </>
  );
}
