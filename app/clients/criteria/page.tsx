import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ComparisonTable, Hero, PullQuote, Section } from "@/components/ui/Blocks";
import { hardNoRows, strongYesRows } from "@/lib/content";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata("criteria");

export default function CriteriaPage() {
  return (
    <>
      <Hero
        editorial
        title="광고비가 정직을 이기는 시장입니다. 그래서 우리는 모두를 받지 않습니다."
        subtitle="광고비가 곧 신호가 되는 게임에서, 벨녹이 받지 않는 의뢰의 목록입니다."
      />
      <Section narrow>
        <PullQuote editorial>
          벨녹은 매출보다 미션을 우선합니다.
          <br />
          다음 유형의 의뢰는 매출 규모와 관계없이 받지 않습니다.
        </PullQuote>
      </Section>
      <Section title="Hard No (받지 않는 유형)">
        <ComparisonTable headers={["유형", "사유"]} rows={hardNoRows} />
      </Section>
      <Section title="Strong Yes (환영하는 유형)" muted>
        <ComparisonTable headers={["유형", "이유"]} rows={strongYesRows} />
      </Section>
      <Section title="회색지대 처리" narrow>
        <p className="body-copy">위 두 분류에 명확히 들지 않는 의뢰는 사전 진단 통화를 통해 판단합니다. 세 가지 질문 중 두 개 이상 &quot;아니오&quot;가 나오면 거절합니다.</p>
        <ol className="body-copy mt-6">
          <li>운영자가 본인을 공개적으로 드러낼 의향이 있는가?</li>
          <li>1차 출처(인증·언론·공공 데이터)로 역추적 가능한 자산이 있는가?</li>
          <li>6개월 단기 게임이 아니라 3년 이상 자산 축적에 동의하는가?</li>
        </ol>
        <PullQuote>이 기준은 우리 가족 가게가 첫 클라이언트라는 사실에서 비롯됐고, 영원히 유지됩니다.</PullQuote>
        <div className="button-row">
          <ButtonLink href="/contact" variant="editorial">우리는 Strong Yes에 해당합니다</ButtonLink>
          <ButtonLink href="/tools/diagnosis" variant="secondary">자가 진단으로 먼저 확인</ButtonLink>
        </div>
      </Section>
    </>
  );
}
