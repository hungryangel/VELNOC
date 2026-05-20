import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ContactForm } from "@/components/tools/ContactForm";
import { Hero, Section } from "@/components/ui/Blocks";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata("contact");

export default function ContactPage() {
  return (
    <>
      <Hero
        title="30분 상담으로 진짜 병목을 합의합니다."
        subtitle="첫 응답은 24시간 안에 드립니다. 자가 진단 결과가 있으면 상담을 더 빠르게 시작할 수 있습니다."
      />
      <Section>
        <Suspense fallback={<div className="card">폼을 불러오는 중입니다.</div>}>
          <ContactForm />
        </Suspense>
        <div className="card" style={{ marginTop: "var(--space-4)" }}>
          <p className="body-copy">
            받지 않는 의뢰 기준을 먼저 확인해주세요.
            <br />
            <Link href="/clients/criteria" style={{ color: "var(--velnoc-oak)", textDecoration: "underline" }}>
              받지 않는 의뢰 기준 보기
            </Link>
          </p>
        </div>
        <div className="card" style={{ marginTop: "var(--space-4)" }}>
          <p className="body-copy">
            폼이 어렵다면 카카오톡으로도 연락 가능합니다.
            <br />
            <Link href={process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || "/contact"} style={{ color: "var(--velnoc-oak)", textDecoration: "underline" }}>
              카카오톡 채팅 시작
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
