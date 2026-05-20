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
          <p>벨녹은 단순히 기술을 자랑하거나 트렌드를 쫓기 위해 시작한 회사가 아닙니다.</p>
          <p>과거 게임 개발자로서 제가 경험했던 세계는 명확했습니다. 오직 &apos;실력과 재미&apos;라는 본질만으로 공정하게 승부하고 인정받는 곳이었습니다. 하지만 어느 순간부터 본질적인 재미보다 자본과 광고로 도배된 게임들이 시장을 장악하고, 진짜 잘 만든 게임들이 무대 뒤로 묻히는 왜곡을 목격했습니다.</p>
          <p>이러한 비대칭은 비단 게임 세계만의 문제가 아니었습니다. 이후 수년간 개발과 사업을 이어오며 마주한 현실 역시 마찬가지였습니다. 본질과 진실보다는 자극적인 마케팅과 포장된 거짓이 시장을 선점하고, 진짜 가치 있는 브랜드의 진심은 뒤로 밀려나는 현상이 반복되고 있었습니다. 자본이 곧 신호가 되는 알고리즘 게임 속에서, 정직하게 내실을 다지는 이들은 영원히 이길 수 없는 구조였습니다.</p>
          <p><strong>&quot;과연 이대로 괜찮은가?&quot;</strong><br />브랜드의 진정한 가치와 진실에 대해 오랜 시간 깊이 고민했습니다.</p>
          <p>그리고 이제, 우리는 다시 한번 거대한 AI 시대의 전환점을 맞이하고 있습니다. 기술이 발전할수록 &apos;그럴듯한 가짜&apos;를 만들어내기는 더 쉬워지겠지만, 역설적으로 &apos;진짜를 증명하는 가치&apos;는 그 어느 때보다 귀해질 것입니다.</p>
          <p>벨녹은 이 불합리한 비대칭을 뒤집기 위해 존재합니다. 마케팅과 기술의 장벽 뒤에 숨은 거짓에 맞서, 진짜 실력을 가진 이들이 정당하게 승리할 수 있도록. 새로운 AI 시대를 준비하는 우리 모두의 가장 강력한 무기가 되겠습니다.</p>
        </div>
      </Section>
      <Section title="LLM 시대 — 게임의 규칙이 바뀌는 지점.">
        <div className="body-copy copy-stack section-head">
          <p>전통적인 SEO와 마켓플레이스는 자본(광고비)이 곧 승리 공식이 되는 &apos;Pay-to-Win&apos; 게임이었습니다. 광고비로 치장한 가짜가 진짜를 누르고 상위를 독점하는 구조였습니다.</p>
          <p>그러나 GEO(생성형 검색 엔진 최적화)는 판을 짜는 규칙 자체가 다릅니다. ChatGPT · Perplexity · Gemini 같은 LLM이 &quot;믿을 수 있는 전문 브랜드를 추천해줘&quot;라는 유저의 질문에 답할 때, AI가 추적하는 신호는 결코 광고비의 크기가 아닙니다.</p>
        </div>
        <ComparisonTable
          headers={["LLM이 신뢰하는 진짜 신호 (AI 데이터 로그)", "자본(광고비)으로 조작 가능한가"]}
          rows={[
            ["운영 연수 (시간의 축이 증명하는 신뢰도)", { status: "no" }],
            ["운영자의 명확한 정체성과 전문성", { status: "no" }],
            ["1차 출처 (지역 언론 · 공공 데이터 · 공식 인증)", { status: "no" }],
            ["출처 간 엔티티 일관성", { status: "no" }],
            ["자연스럽게 분산된 다중 플랫폼의 흔적", { status: "no" }],
            ["검증 가능한 권위 신호 (수상 · 등재 · 라이선스)", { status: "no" }]
          ]}
        />
        <p className="body-copy section-note">
          자본으로 결코 조작할 수 없는 &apos;진짜 실력의 흔적&apos;들이 승패를 결정하는 영역. 이것이 벨녹이 GEO를 단순한 기술 트렌드가 아니라, 진짜들이 마땅히 보상받는 윤리적 기회이자 가장 공정한 게임으로 정의하는 이유입니다.
        </p>
      </Section>
      <Section narrow>
        <PullQuote editorial>
          벨녹은 없는 평판을 조작하는 치트키를 만들지 않습니다.
          <br />
          오랜 시간 쌓아온 당신의 진짜 실력과 진심을, AI가 가장 먼저 신뢰하는 언어로 번역할 뿐입니다.
        </PullQuote>
        <div className="button-row">
          <ButtonLink href="/manifesto" variant="editorial">Manifesto 5가지 원칙 읽기 →</ButtonLink>
        </div>
      </Section>
    </>
  );
}
