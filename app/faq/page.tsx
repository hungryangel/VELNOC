import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card, Hero, Section } from "@/components/ui/Blocks";
import { faqAnswerText, faqItems } from "@/lib/faq";
import { JsonLd, buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata("faq");

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerText(item) }
    }))
  };
}

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <Hero title="FAQ — VELNOC" eyebrow="FAQ · 결제 전 가장 많이 묻는 질문" subtitle="계약·진단·결과에 대해 자주 받는 질문들을 정리했습니다." />
      <Section>
        <div className="grid-2">
          {faqItems.map((item) => (
            <Card key={item.q} title={item.q}>
              <p>{item.a}</p>
              {"bullets" in item && (
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet.title}>
                      <strong>{bullet.title}</strong> — {bullet.body}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
        <div className="final-cta" style={{ marginTop: "var(--space-10)" }}>
          <h2>지금 우리 사업이 검색과 AI에 어떻게 보이고 있는지, 5분 안에 직접 확인해보세요.</h2>
          <div className="button-row">
            <ButtonLink href="/tools/diagnosis">내 단계 진단 시작 →</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">이미 단계가 명확하시다면 → 상담 시작</ButtonLink>
          </div>
          <p className="trust-chips" aria-label="무료, 5분 소요, 연락처 없이 기본 결과 확인">
            <span>무료</span>
            <span>5분 소요</span>
            <span>연락처 없이 기본 결과 확인</span>
          </p>
        </div>
      </Section>
    </>
  );
}
