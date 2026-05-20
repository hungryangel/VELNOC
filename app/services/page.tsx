import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Hero, Section } from "@/components/ui/Blocks";
import { projectLines, services } from "@/lib/content";
import { JsonLd, buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata("services");

function servicesJsonLd() {
  return [...services, ...projectLines].map((item) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: item.name,
    provider: { "@type": "Organization", name: "VELNOC" },
    description: "description" in item ? item.description : item.body
  }));
}

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  return (
    <article id={service.id === "site" ? "site-card" : service.id} className={`service-plan-card ${service.featured ? "is-recommended" : ""} ${service.id === "site" ? "is-site-card" : ""}`}>
      {service.featured && <p className="micro card-meta plan-recommended-badge">RECOMMENDED</p>}
      <p className="tier-reach-badge">{service.reachBadge}</p>
      <h3 className="service-plan-title">{service.name}</h3>
      <p className="service-price"><span>{service.price}</span></p>
      <p className="body-copy">{service.persona}</p>

      {service.id === "site" && (
        <div className="site-entry-grid">
          <div>
            <strong>Site · New</strong>
            <span>신규 구축</span>
            <em>150~300만원 (1회)</em>
            <p>사이트가 아직 없는 분께</p>
          </div>
          <div>
            <strong>Site · Retrofit</strong>
            <span>기존 사이트 AEO·GEO 세팅</span>
            <em>80~150만원 (1회)</em>
            <p>사이트는 있지만 검색·AI에서 투명 인간인 분께</p>
          </div>
        </div>
      )}

      <div className="service-monthly">
        <p className="micro service-section-label">
          {service.id === "site" ? "공통 포함" : service.id === "seed" ? "포함" : "매월"}
          {"minCycle" in service && service.minCycle && <span className="service-cycle-muted"> · {service.minCycle}</span>}
        </p>
        <ul>
          {service.monthly.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      {"excluded" in service && service.excluded && <p className="service-excluded">비포함: {service.excluded}</p>}
      {"cycleNote" in service && service.cycleNote && <p className="service-cycle-note">{service.cycleNote}</p>}
      <p className="service-promise">{service.promise}</p>
      {service.disabledCta ? (
        <p className="service-disabled-cta">{service.cta}</p>
      ) : (
        <ButtonLink href={service.href} variant={service.featured ? "primary" : "secondary"}>{service.cta}</ButtonLink>
      )}
    </article>
  );
}

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={servicesJsonLd()} />
      <Hero
        title="자산을 만들고, 매월 살아있게 확인합니다."
        subtitle="벨녹의 상품 구조는 Site · Seed · Pulse · Signal · Engine으로 이어집니다. 먼저 벨녹 자가 진단으로 지금 단계를 확인하고, 필요한 만큼만 시작합니다."
        primary={{ label: "벨녹 자가 진단 시작 →", href: "/tools/diagnosis" }}
      />

      <Section eyebrow="PRICING · 벨녹 5단계별 상품" title="어디 단계인지 모르시면 먼저 확인하세요." muted>
        <div id="subscribe" className="services-grid pricing-grid">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        <div className="subscription-policy body-copy">
          <h3>운영 정책 — 모든 구독 공통</h3>
          <ul>
            <li><span>운영 일시정지 가능:</span>사정이 생기면 운영만 멈추고, 만든 자동화·콘텐츠는 그대로 유지합니다.</li>
            <li><span>약정 종료 후 자동으로 월 단위 갱신됩니다.</span>갱신 시점에 언제든 중단·변경 가능합니다.</li>
            <li><span>Site 구매로 Seed 12개월을 마친 후 Pulse로 이어가시는 분은</span>약정 없이 월 단위로 시작합니다.</li>
          </ul>
        </div>
        <div className="project-lineup service-project-lineup">
          <p className="micro">더 큰 자산이 필요하신가요</p>
          <div className="project-lineup-grid">
            {projectLines.map((project) => (
              <a key={project.id} id={project.id} href={project.href}>
                <strong>{project.name}</strong>
                <span className="project-price">{project.id === "os" ? `${project.price} (별도 견적)` : `${project.price} (1회)`}</span>
                <em className="project-desc">{project.id === "studio" ? "MVP·프로토타입 (4주)" : "산업 특화 운영체계"}</em>
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="SITE · 포함된 것" title="VELNOC Site에는 무엇이 포함되나요">
        <div id="site" className="grid-2 service-detail-grid">
          <div className="card body-copy">
            <ul>
              <li>검색·AI에 읽히는 사이트 설계·구축</li>
              <li>schema.org 마크업, NAP 일관성, sitemap·robots.txt·llms.txt 구조화</li>
              <li><strong>12개월 Seed 동행</strong> — 매월 자동 리포트로 사이트가 살아있는지 추적</li>
              <li>사이트 1주년 점검 콜 30분</li>
            </ul>
            <p><em>Seed 동행은 &quot;만들고 떠나지 않는다&quot;는 벨녹의 운영 원칙입니다. 별도 옵션이 아닙니다.</em></p>
          </div>
          <div className="card body-copy">
            <h3>포함되지 않는 것 (직접 부담)</h3>
            <ul>
              <li>도메인 등록비 (연 약 1.5~3만원)</li>
              <li>호스팅 비용 (Vercel Hobby 무료, 트래픽 증가 시 Pro 월 약 3만원)</li>
              <li>CMS 비용 (Notion 무료, Sanity 무료 또는 트래픽 따라 월 4만원~)</li>
            </ul>
            <p><strong>사장님 명의로 모든 권한을 이전합니다.</strong><br />벨녹은 도메인·호스팅·CMS 관리비를 별도로 받지 않습니다.<br />원하시면 언제든 다른 업체로 옮기실 수 있습니다.</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="SITE · 표준 스택" title="벨녹 Site는 어떤 도구로 만들어지나요" muted>
        <div className="grid-2 service-detail-grid">
          <div className="card body-copy">
            <h3>기본 스택</h3>
            <ul>
              <li><strong>프레임워크:</strong> Next.js (React 기반 정적/서버 렌더링)</li>
              <li><strong>호스팅:</strong> Vercel (사장님 명의 계정)</li>
              <li><strong>콘텐츠 관리:</strong> Notion 또는 Sanity (사장님이 직접 글 쓰실 수 있도록)</li>
              <li><strong>도메인:</strong> 사장님 명의로 직접 등록</li>
            </ul>
          </div>
          <div className="card body-copy">
            <h3>왜 이 스택인가요</h3>
            <p><strong>서버 사이드 렌더링</strong><br />ChatGPT·Perplexity 같은 AI 크롤러는 무거운 JavaScript가 로드되기를 끝까지 기다리지 않습니다. Next.js는 페이지를 미리 만들어두는 방식이라 AI가 첫 응답에서 바로 텍스트를 읽습니다.</p>
            <p><strong>정확한 schema.org 마크업</strong><br />사업 정보(이름·위치·서비스·가격·운영자)를 AI가 읽을 언어로 번역하는 작업입니다. Next.js는 페이지 타입별 schema를 코드로 한 번 정의해 모든 페이지에 일관 적용합니다.</p>
            <p><strong>우리가 쓰는 도구로 만듭니다</strong><br />velnoc.com 자체도 같은 스택으로 만들어졌습니다. 우리가 매일 굴리는 도구로 사장님 사이트도 만든다는 것이 가장 정직한 약속입니다.</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="SITE · RETROFIT" title="이미 사이트가 있으신가요? — Site · Retrofit">
        <div className="card body-copy">
          <p>기존 사이트가 검색·AI에서 보이지 않는다면, 새로 만들 필요 없습니다. 지금 사이트의 구조에 SEO·AEO·GEO 세팅을 더하는 1회 작업입니다.</p>
          <div className="grid-2 service-detail-grid">
            <div>
              <h3>Retrofit이 다루는 것</h3>
              <ul>
                <li>AI 봇 접근 점검 (GPTBot · PerplexityBot · ClaudeBot 허용)</li>
                <li>schema.org 마크업 추가 (사업 형태에 맞는 타입 선택)</li>
                <li>메타·OG 태그 정리</li>
                <li>sitemap.xml · robots.txt · llms.txt 점검·생성</li>
                <li>1차 출처 연결 (Google Business Profile · 네이버 플레이스 · 디렉토리)</li>
                <li>사장님 정체성 콘텐츠 1~2건 (About · 운영자 이야기)</li>
                <li>T0 베이스라인 측정 1회 + 12개월 Seed 동행</li>
              </ul>
            </div>
            <div>
              <h3>Retrofit이 다루지 않는 것</h3>
              <ul>
                <li>디자인 전면 개편 (이 경우 Site · New)</li>
                <li>사이트 구조 자체가 검색에 적대적인 경우 (예: 텍스트가 전부 이미지로 들어가 있는 사이트)</li>
              </ul>
            </div>
          </div>
          <div className="table-wrap">
            <table className="compare-table">
              <thead>
                <tr><th>기존 스택</th><th>Retrofit 작업</th><th>Seed 동행</th></tr>
              </thead>
              <tbody>
                <tr><td>Framer · Webflow · Wix</td><td>기존 도구 유지하며 schema·메타 추가</td><td>12개월</td></tr>
                <tr><td>카페24 · 아임웹 · 식스샵</td><td>가능 범위 내 schema 주입 + 1차 출처 연결</td><td>12개월</td></tr>
                <tr><td><strong>WordPress</strong></td><td>robots.txt · schema 플러그인 · sitemap 정리</td><td><strong>6개월</strong> (보안 패치 부담)</td></tr>
                <tr><td>정적 HTML · 커스텀</td><td>직접 마크업 추가</td><td>12개월</td></tr>
              </tbody>
            </table>
          </div>
          <p><em>WordPress는 플러그인 보안 패치·호환성 부담으로 Seed 동행 기간이 단축됩니다. 12개월 이상의 안정적 동행을 원하시면 Next.js로의 Site · New를 권해드립니다.</em></p>
          <p><strong>견적 결정 동선</strong><br />자가 진단 → 30분 상담 콜 → 실제 사이트 상태 확인 → 견적 확정</p>
          <p>기존 사이트 상태에 따라 가격 폭이 큽니다 (80~150만원). 견적 전 30분 상담 콜로 정확한 작업 범위를 정합니다.</p>
        </div>
      </Section>

      <Section eyebrow="SEED · 12개월 이후" title="12개월 Seed 동행이 끝나면" muted>
        <div className="card body-copy">
          <p>12개월이 되는 시점에 세 가지 옵션 중에 선택하시면 됩니다.</p>
          <ul>
            <li>유상 Seed 전환 — 월 9만원, 동일한 모니터링 계속</li>
            <li>Pulse 이상 업그레이드 — 운영 코칭이 필요하실 때</li>
            <li>종료 — 사이트와 모든 권한은 그대로 사장님 소유</li>
          </ul>
          <p>종료를 선택하셔도 사이트는 그대로 작동합니다. Seed는 모니터링·동행이지 사이트 호스팅이 아닙니다.</p>
        </div>
      </Section>
    </>
  );
}
