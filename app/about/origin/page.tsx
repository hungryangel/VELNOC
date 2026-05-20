import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ComparisonTable, Hero, PullQuote, Section } from "@/components/ui/Blocks";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata("origin");

export default function OriginPage() {
  return (
    <>
      <Hero editorial title="진짜가 가짜에게 다시 이기는 게임을 만듭니다." enTitle="Where truth wins again." />
      <Section narrow>
        <div className="body-copy copy-stack">
          <p>벨녹은 마케팅을 사랑해서 시작한 회사가 아닙니다.</p>
          <p>창업자 안상효는 과거 구매대행과 건강기능식품 판매를 직접 경험하면서, 말도 안 되는 제품을 누구나 좋아하는 것처럼 포장해 파는 마케팅 산업의 뻔뻔함을 목격했습니다. 그리고 그것이 추상적인 문제가 아니라 가족의 일이 되는 순간을 마주합니다.</p>
          <p>오랜 시간 진짜 좋은 홍삼을 정직하게 파는 장모님의 오프라인 가게가, 어느 순간부터 마켓플레이스 상위에 노출되는 출처 불명의 저품질 가게들에 매출이 밀리기 시작했습니다.</p>
          <p>광고비가 곧 신호가 되는 SEO·마켓플레이스 알고리즘 게임에서, 광고비로 자신을 부풀리지 않는 정직한 가게는 영원히 이길 수 없습니다.</p>
          <p><strong>벨녹은 이 비대칭을 뒤집기 위해 존재합니다.</strong></p>
        </div>
      </Section>
      <Section title="LLM 시대 — 게임이 바뀌는 지점.">
        <div className="body-copy copy-stack section-head">
          <p>전통 SEO와 마켓플레이스는 광고비가 곧 신호인 게임입니다. 광고비로 만든 가짜가 진짜를 이깁니다.</p>
          <p>그러나 GEO(생성형 검색)는 게임이 다릅니다. ChatGPT·Perplexity·Gemini 같은 LLM이 &quot;믿을 수 있는 ○○ 추천해줘&quot;라는 질문에 답할 때 보는 신호는 광고비가 아닙니다.</p>
        </div>
        <ComparisonTable
          headers={["LLM이 신뢰하는 신호", "광고비로 만들 수 있는가"]}
          rows={[
            ["운영 연수 (시간 축)", { status: "no" }],
            ["운영자 정체성·전문성", { status: "no" }],
            ["1차 출처 (지역 언론·공공 데이터·인증)", { status: "no" }],
            ["출처 간 엔티티 일관성", { status: "no" }],
            ["자연 분산된 다중 플랫폼 흔적", { status: "no" }],
            ["검증 가능한 권위 신호 (수상·등재·라이선스)", { status: "no" }]
          ]}
        />
        <p className="body-copy section-note">
          광고비로 절대 만들 수 없는 신호들이 결정적인 영역. 이것이 벨녹이 GEO를 단순 기술 트렌드가 아니라 <strong>윤리적 기회</strong>로 보는 이유입니다.
        </p>
      </Section>
      <Section narrow>
        <PullQuote editorial>벨녹은 없는 평판을 만들지 않습니다. 이미 존재하는 진짜 평판을 AI가 읽을 수 있는 언어로 번역합니다.</PullQuote>
        <div className="button-row">
          <ButtonLink href="/manifesto" variant="editorial">Manifesto 5가지 원칙 읽기 →</ButtonLink>
        </div>
      </Section>
    </>
  );
}
