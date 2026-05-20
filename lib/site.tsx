import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://velnoc.com";

export const navItems = [
  { label: "서비스", href: "/services" },
  { label: "케이스", href: "/cases" },
  { label: "진단", href: "/tools/diagnosis" }
];

export const footerGroups = [
  {
    title: "서비스",
    links: [
      { label: "구독", href: "/services#subscribe" },
      { label: "Site", href: "/services#site" },
      { label: "Studio", href: "/services#studio" },
      { label: "OS", href: "/services#os" }
    ]
  },
  {
    title: "회사",
    links: [
      { label: "About", href: "/about" },
      { label: "Origin Story", href: "/about/origin" },
      { label: "Manifesto", href: "/manifesto" },
      { label: "Process", href: "/process" },
      { label: "받지 않는 의뢰", href: "/clients/criteria" },
      { label: "FAQ", href: "/faq" }
    ]
  },
  {
    title: "도구",
    links: [
      { label: "자가 진단", href: "/tools/diagnosis" }
    ]
  },
  {
    title: "연락",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "카카오톡", href: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || "/contact" }
    ]
  }
];

export const pageMeta = {
  home: {
    path: "/",
    title: "VELNOC — 보이게 만들고, 흐르게 설계합니다.",
    description:
      "벨녹은 SEO·AEO·GEO와 운영 자동화를 묶어, 매월 자라는 비즈니스 시스템을 설계하는 통합형 아키텍트입니다. 검색을 넘어 AI에게 인용되는 비즈니스로."
  },
  about: {
    path: "/about",
    title: "About — VELNOC",
    description:
      "안상효 대표가 이끄는 통합형 비즈니스 아키텍트. 검증된 소수 정예 팀의 일관성으로 클라이언트와 한 책임 구조 안에서 작동합니다."
  },
  origin: {
    path: "/about/origin",
    title: "Origin Story — 진짜가 가짜에게 다시 이기는 게임",
    description:
      "장모님의 오프라인 홍삼 가게에서 시작된 벨녹의 미션. 광고비로 만들어진 가짜가 정직한 진짜를 이기던 게임에서, LLM 시대에는 어떻게 게임이 바뀌는가."
  },
  manifesto: {
    path: "/manifesto",
    title: "Manifesto — VELNOC",
    description:
      "벨녹이 존재하는 이유와 5가지 원칙. 번역하되 양산하지 않는다. 거절을 두려워하지 않는다. 가족에게 추천할 수 있는 일만 한다."
  },
  services: {
    path: "/services",
    title: "서비스 — Site·Seed·구독·Studio·OS",
    description:
      "Site와 12개월 Seed 동행부터 Pulse, Signal, Engine 구독까지. 벨녹 5단계에 맞춰 검색되고 AI에 인용되는 자산을 설계합니다."
  },
  cases: {
    path: "/cases",
    title: "케이스 — VELNOC",
    description:
      "홍삼 전문점, 비공개 금융교육 플랫폼, 돼지농장 운영 OS, 파나요까지. 말이 아니라 결과물로 증명합니다."
  },
  process: {
    path: "/process",
    title: "진행 방식 — 자가 진단부터 첫 30일 win까지",
    description:
      "자가 진단 → 무료 상담 → 맞춤 패키지. 진단 결과를 함께 보며 병목을 합의하고, 첫 30일 안에 가시적 결과를 만듭니다."
  },
  faq: {
    path: "/faq",
    title: "FAQ — VELNOC",
    description:
      "계약·진단·결과에 대해 자주 받는 질문들을 정리했습니다."
  },
  criteria: {
    path: "/clients/criteria",
    title: "받지 않는 의뢰 — VELNOC",
    description:
      "광고비가 정직을 이기는 시장입니다. 그래서 벨녹은 모두를 받지 않습니다. 매출보다 미션이 먼저인 회사이기에, 받지 않는 의뢰 기준을 공개합니다."
  },
  diagnosis: {
    path: "/tools/diagnosis",
    title: "자가 진단 — 5분 안에 AI 검색 시대 위치 확인",
    description:
      "사이트·마케팅·AI 검색 준비도를 5분 안에 1차 진단합니다. A~F 분류와 추천 다음 행동을 확인하고, 상세 결과는 신청 후 받아보세요."
  },
  simulator: {
    path: "/tools/simulator",
    title: "ROI 시뮬레이터 — 5년 후 광고비 vs 자산",
    description:
      "5년 후, 광고비는 사라지고 벨녹의 자산은 남습니다. 광고비 인플레이션을 반영해 비교 가능한 미래 시나리오를 보여드립니다."
  },
  contact: {
    path: "/contact",
    title: "상담 시작 — VELNOC",
    description: "무료 30분 상담. 첫 응답 24시간 이내. 진단 결과가 있으면 더 빠르게 시작할 수 있습니다."
  },
  privacy: {
    path: "/legal/privacy",
    title: "개인정보처리방침 — VELNOC",
    description: "VELNOC 개인정보처리방침입니다. 개인정보의 처리 목적, 항목, 보유 기간, 위탁, 정보주체 권리와 보호책임자를 안내합니다.",
    noindex: true
  },
  terms: {
    path: "/legal/terms",
    title: "이용약관 — VELNOC",
    description: "VELNOC 서비스 이용약관입니다.",
    noindex: true
  }
} satisfies Record<string, { path: string; title: string; description: string; noindex?: boolean }>;

export function buildMetadata(key: keyof typeof pageMeta): Metadata {
  const meta = pageMeta[key];
  const url = `${SITE_URL}${meta.path}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    robots: "noindex" in meta && meta.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: "VELNOC",
      locale: "ko_KR",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description
    }
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VELNOC",
    alternateName: "벨녹",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    founder: {
      "@type": "Person",
      name: "안상효",
      jobTitle: "Founder & Business Architect"
    },
    foundingDate: "2026",
    description: "벨녹은 SEO·AEO·GEO와 운영 자동화를 묶어 매월 자라는 비즈니스 시스템을 설계하는 통합형 아키텍트입니다.",
    sameAs: []
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "안상효",
    jobTitle: "Founder & Business Architect",
    worksFor: { "@type": "Organization", name: "VELNOC" },
    knowsAbout: [
      "Search Engine Optimization",
      "Answer Engine Optimization",
      "Generative Engine Optimization",
      "Business Automation",
      "Industry-specific Operating Systems"
    ]
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
