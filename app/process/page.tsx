import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card, Hero, Section } from "@/components/ui/Blocks";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata("process");

const steps = [
  {
    title: "01. 무료 자가 진단 — 5분",
    body: "사이트·마케팅·AI 검색 노출 수준을 단계별로 진단합니다. 이메일·전화번호 없이도 기본 결과 확인 가능합니다.",
    cta: { label: "자가 진단 시작 →", href: "/tools/diagnosis" }
  },
  {
    title: "02. 무료 상담 — 30분",
    body: "진단 결과를 함께 보며 진짜 병목을 합의합니다. 지금 단계에서 무엇을 먼저 움직일지 정리합니다.",
    cta: { label: "상담 신청", href: "/contact" }
  },
  {
    title: "03. 맞춤 패키지 시작 & 첫 30일 win",
    body: "구독 / Site / Studio / OS 중 단계에 맞는 조합으로 시작. 첫 30일 안에 가시적 결과 한 가지를 약속합니다."
  }
];

export default function ProcessPage() {
  return (
    <>
      <Hero title={"만들고 떠나지 않습니다.\n같이 키워 나갑니다."} />
      <Section>
        <div className="grid-2">
          {steps.map((step) => (
            <Card key={step.title} title={step.title}>
              <p>{step.body}</p>
              {step.cta && (
                <div className="button-row">
                  <ButtonLink href={step.cta.href} variant="secondary">{step.cta.label}</ButtonLink>
                </div>
              )}
            </Card>
          ))}
        </div>
        <div className="button-row">
          <ButtonLink href="/tools/diagnosis">자가 진단 시작</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">바로 상담 신청</ButtonLink>
        </div>
      </Section>
    </>
  );
}
