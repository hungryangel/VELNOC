import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "../assets/velnoc-tokens.css";
import "@/styles/globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd, organizationJsonLd, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VELNOC — 보이게 만들고, 흐르게 설계합니다.",
    template: "%s"
  },
  description: "벨녹은 SEO·AEO·GEO와 운영 자동화를 묶어 매월 자라는 비즈니스 시스템을 설계하는 통합형 아키텍트입니다.",
  alternates: {
    canonical: SITE_URL,
    languages: {
      ko: SITE_URL,
      en: `${SITE_URL}/en`
    }
  },
  verification: {
    other: {
      "naver-site-verification": "e45f8581b78d59204eda9eecc7f180ef6bed5e76"
    }
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "rgb(242 241 237)"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <JsonLd data={organizationJsonLd()} />
      </head>
      <body>
        <div className="vn-root site-shell">
          <Header />
          <main className="main">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
