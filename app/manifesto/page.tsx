import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card, Hero, PullQuote, Section } from "@/components/ui/Blocks";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata("manifesto");

const commitments = [
  ["01. 번역하되 양산하지 않는다", "가짜 후기·페르소나 봇·콘텐츠 양산은 일체 거부합니다. 클라이언트가 이미 가진 자산만 디지털화합니다."],
  ["02. 검증 가능성을 최우선으로 한다", "모든 GEO 산출물은 1차 출처(공공 데이터·라이선스·언론·인터뷰 등)로 역추적 가능해야 합니다."],
  ["03. 단기 게임을 하지 않는다", "LLM 업데이트마다 무력화되는 트릭이 아니라, 어떤 알고리즘 변화에도 살아남는 진짜 신호만 다룹니다."],
  ["04. 거절을 두려워하지 않는다", "가짜 양산이 필요한 의뢰는 매출이 보장돼도 받지 않습니다. 받지 않는 의뢰 페이지에 명시되어 있습니다."],
  ["05. 가족에게 추천할 수 있는 일만 한다", "창업자의 장모님 가게가 첫 클라이언트이며, 이 기준은 영원히 유지됩니다."]
];

export default function ManifestoPage() {
  return (
    <>
      <Hero editorial title="벨녹이 존재하는 이유." />
      <Section narrow>
        <PullQuote editorial>
          벨녹은 없는 평판을 만들지 않습니다.
          <br />
          이미 존재하는 진짜 평판을 AI가 읽을 수 있는 언어로 번역합니다.
        </PullQuote>
      </Section>
      <Section title="The Five Commitments">
        <div className="grid-3">
          {commitments.map(([title, body]) => (
            <Card key={title} title={title}>
              <p>{body}</p>
            </Card>
          ))}
        </div>
        <div className="button-row">
          <ButtonLink href="/clients/criteria" variant="editorial">받지 않는 의뢰 기준 보기 →</ButtonLink>
          <ButtonLink href="/about/origin" variant="secondary">Origin Story 읽기</ButtonLink>
        </div>
      </Section>
    </>
  );
}
