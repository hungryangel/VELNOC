import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card, Hero } from "@/components/ui/Blocks";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { VelnocFramework } from "@/components/ui/VelnocFramework";
import { caseItems, projectLines, services } from "@/lib/content";
import { faqItems } from "@/lib/faq";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata("home");

const problemItems = [
  "광고를 멈추면, 그 달 매출이 바로 줄어든다",
  "마케팅·개발·디자인을 각자 따로 발주하고, 사이를 사장님이 직접 연결한다",
  "우리 가게·브랜드를 검색해도 우리 사이트가 먼저 나오지 않는다",
  "ChatGPT에 우리 업종을 물어보면 경쟁사만 나온다",
  "매월 콘텐츠는 올리는데, 자산이 쌓이는 느낌은 들지 않는다"
];

const diagnosisSteps = [
  ["01", "사업 상태 확인", "사이트·마케팅·SNS 운영 상황을 짧게 점검합니다."],
  ["02", "검색·AI 노출 점검", "지금 우리 사업이 검색과 AI에 어떻게 보이는지 확인합니다."],
  ["03", "단계 판정 + 다음 행동", "1~5단계 중 어디에 있는지, 다음 단계로 가려면 무엇이 필요한지 알려드립니다."]
];

const processSteps = [
  {
    number: "01",
    title: "Discovery · 같이 읽기",
    period: "1주",
    action: "사업 구조, 지금 쓰는 채널, 검색·AI 노출 상태를 같이 읽습니다.",
    owner: "지금 우리 사업이 어디에 어떻게 보이는지 처음으로 한 화면에서 보게 됩니다."
  },
  {
    number: "02",
    title: "Architecture · 순서 잡기",
    period: "1주",
    action: "무엇을 먼저 고칠지, 어떤 자산을 쌓을지 실행 순서를 설계합니다.",
    owner: "광고비·콘텐츠·시간을 어디에 먼저 써야 하는지 우선순위가 정리된 문서를 받습니다."
  },
  {
    number: "03",
    title: "Build · 첫 작동",
    period: "2~4주",
    action: "사이트·콘텐츠·자동화의 첫 작동 단위를 만듭니다.",
    owner: "실제로 검색에 잡히기 시작하는 첫 페이지와 콘텐츠가 올라가는 걸 확인합니다."
  },
  {
    number: "04",
    title: "Live & Iterate · 자라는 사이클",
    period: "매월",
    action: "검색 신호와 운영 흐름을 매월 측정하고 다음 사이클을 조정합니다.",
    owner: "우리 사업이 지도에서 어디로 움직이고 있는지 리포트로 확인합니다."
  }
];

export default function HomePage() {
  return (
    <>
      <RevealOnScroll />
      <Hero
        eyebrow="VELNOC — 보이게 만들고, 흐르게 설계합니다."
        title={"광고비를 줄이면서,\n검색과 AI에서 자라는 사업."}
        subtitle={
            "브랜드를 사람이 찾고, 검색엔진이 읽고, AI가 이해할 수 있도록\n사업 구조 자체를 다시 설계합니다."
        }
        primary={{ label: "내 사업은 지금 몇 단계인지 보기 →", href: "/tools/diagnosis" }}
        secondary={{ label: "벨녹이 하는 일", href: "#services" }}
        visual
      />

      <section className="section section-muted problem-step-section" data-reveal>
        <div className="container" data-reveal-group>
          <div className="section-head reveal-order-0" data-reveal-child>
            <h2>이런 상황, 있으신가요?</h2>
          </div>
          <p className="lead reveal-order-1" data-reveal-child>
            하나라도 해당된다면, 지금 사업 구조가 매출을 광고에 묶어두고 있다는 신호입니다.
          </p>
          <div className="problem-checklist problem-step-list">
            {problemItems.map((item, index) => (
              <div key={item} className={`problem-check reveal-order-${index + 2}`} data-reveal-child>
                <span className="problem-check-number">{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
          <div className="problem-closing body-copy reveal-order-7" data-reveal-child>
            <p>이 다섯 가지는 따로 떨어진 문제 같지만, 같은 원인 하나에서 옵니다.</p>
            <p>사업이 검색과 AI가 읽을 수 있는 구조로 정리되어 있지 않아서입니다.</p>
          </div>
        </div>
      </section>

      <VelnocFramework />

      <section id="diagnosis" className="section section-muted diagnosis-section" data-reveal>
        <div className="container" data-reveal-group>
          <div className="section-head reveal-order-0" data-reveal-child>
            <p className="eyebrow">DIAGNOSIS · 내 사업은 몇 단계?</p>
            <h2>이제 우리 사업이 어디쯤인지 확인해보세요.</h2>
          </div>
          <p className="lead reveal-order-1" data-reveal-child>
            5분이면 확인할 수 있습니다.
            <br />
            이메일·전화번호 없이도 기본 결과까지는 바로 보입니다.
          </p>
          <div className="diagnosis-flow">
            {diagnosisSteps.map(([number, title, body], index) => (
              <div key={number} className={`reveal-order-${index + 2}`} data-reveal-child>
                <Card title={`${number} — ${title}`}>
                  <p>{body}</p>
                </Card>
              </div>
            ))}
          </div>
          <div className="button-row reveal-order-5" data-reveal-child>
            <ButtonLink href="/tools/diagnosis">내 단계 진단 시작 →</ButtonLink>
          </div>
          <p className="trust-chips reveal-order-6" aria-label="무료, 5분 소요, 연락처 없이 기본 결과 확인" data-reveal-child>
            <span>무료</span>
            <span>5분 소요</span>
            <span>연락처 없이 기본 결과 확인</span>
          </p>
        </div>
      </section>

      <section id="services" className="section" data-reveal>
        <div className="container" data-reveal-group>
          <div className="section-head reveal-order-0" data-reveal-child>
            <p className="eyebrow">SERVICES · 단계별 동반자</p>
            <h2>
              자산을 만들고,
              <br />
              매월 살아있게 확인합니다.
            </h2>
            <p className="service-cycle-summary">
              운영 사이클은 Pulse 3개월부터, Signal·Engine 6개월부터 시작합니다.
            </p>
          </div>
          <p className="pricing-diagnosis-link reveal-order-1" data-reveal-child>
            어디 단계인지 모르시면 먼저 → <a href="/tools/diagnosis">벨녹 자가 진단 (5분, 무료)</a>
          </p>
          <p className="lead services-lead reveal-order-1" data-reveal-child>
            Site · Seed · Pulse · Signal · Engine은 각각 지금 단계에 맞춰 일합니다.
            <br />
            벨녹 5단계가 위치를 보여줬다면, 상품 구조는 그 단계에서 무엇이 움직이는가를 책임집니다.
          </p>
          <div className="services-grid pricing-grid">
            {services.map((service, index) => (
              <article key={service.name} className={`service-plan-card reveal-order-${index + 2} ${service.featured ? "is-recommended" : ""} ${service.id === "site" ? "is-site-card" : ""}`} data-reveal-child>
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
                {"excluded" in service && service.excluded && (
                  <p className="service-excluded">비포함: {service.excluded}</p>
                )}
                {"cycleNote" in service && service.cycleNote && (
                  <p className="service-cycle-note">{service.cycleNote}</p>
                )}
                <p className="service-promise">{service.promise}</p>
                {service.disabledCta ? (
                  <p className="service-disabled-cta">{service.cta}</p>
                ) : (
                  <ButtonLink href={service.href} variant={service.featured ? "primary" : "secondary"}>{service.cta}</ButtonLink>
                )}
              </article>
            ))}
          </div>
          <div className="project-link project-lineup reveal-order-7" data-reveal-child>
            <p className="micro">더 큰 자산이 필요하신가요</p>
            <div className="project-lineup-grid">
              {projectLines.map((project) => (
                <a key={project.id} href={project.href}>
                  <strong>{project.name}</strong>
                  <span className="project-price">{project.id === "os" ? `${project.price} (별도 견적)` : `${project.price} (1회)`}</span>
                  <em className="project-desc">{project.id === "studio" ? "MVP·프로토타입 (4주)" : "산업 특화 운영체계"}</em>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted" data-reveal>
        <div className="container" data-reveal-group>
          <div className="section-head reveal-order-0" data-reveal-child>
            <p className="eyebrow">PROCESS · 시작 후 4주</p>
            <h2>
              벨녹과 함께하면,
              <br />
              무엇이 몇 주 안에 움직이나요?
            </h2>
          </div>
          <p className="lead reveal-order-1" data-reveal-child>
            첫 시작부터 약 4주, 사업 구조는 측정 → 설계 → 작동 → 반복 네 단계로 움직입니다.
            <br />
            이 흐름이 한 사이클 돌면, 5단계 지도에서 한 칸 위로 올라갈 준비가 시작됩니다.
          </p>
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <article key={step.number} className={`process-card reveal-order-${index + 2}`} data-reveal-child>
                <span className="process-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p className="process-period">{step.period}</p>
                <p>{step.action}</p>
                <p>{step.owner}</p>
              </article>
            ))}
          </div>
          <p className="body-copy section-note process-note reveal-order-6" data-reveal-child>
            01~03은 다음 단계로 올라가기 위한 준비, 04는 그 자리를 지키고 키우는 매월의 사이클입니다.
          </p>
        </div>
      </section>

      <section className="section" data-reveal>
        <div className="container" data-reveal-group>
          <div className="section-head reveal-order-0" data-reveal-child>
            <p className="eyebrow">PROOF · 지금 움직이는 일</p>
            <h2>
              말이 아니라,
              <br />
              지금 진행 중인 일로 증명합니다.
            </h2>
          </div>
          <p className="lead reveal-order-1" data-reveal-child>
            모든 프로젝트는 비밀유지나 진행 단계 때문에 세부를 공개하지 못합니다.
            <br />
            대신 어떤 상태에 있고, 무엇이 움직이고 있는지는 보여드립니다.
          </p>
          <div className="proof-grid">
            {caseItems.map((item, index) => (
              <article key={item.title} className={`proof-card reveal-order-${index + 2}`} data-reveal-child>
                <p className="proof-status">{item.tag}</p>
                <h3>{item.title}</h3>
                {item.summary && <strong>{item.summary}</strong>}
                <p>{item.body[0]}</p>
                <p className="proof-disclosure">{item.disclosure}</p>
              </article>
            ))}
          </div>
          <p className="body-copy section-note reveal-order-5" data-reveal-child>
            공개 가능한 케이스는 출시 시점에 맞춰 이 페이지에 추가됩니다.
          </p>
          <div className="button-row reveal-order-6" data-reveal-child>
            <ButtonLink href="/cases" variant="secondary">케이스 전체 보기 →</ButtonLink>
          </div>
        </div>
      </section>

      <section className="section section-muted" data-reveal>
        <div className="container-narrow" data-reveal-group>
          <div className="section-head reveal-order-0" data-reveal-child>
            <p className="eyebrow">MANIFESTO</p>
            <h2>
              받지 않는 의뢰가 있어야,
              <br />
              지키는 기준도 생깁니다.
            </h2>
          </div>
          <div className="manifesto-block reveal-order-1" data-reveal-child>
            <p>
              벨녹은 없는 평판을 만들지 않습니다. 이미 존재하는 진짜 자산을, 검색과 AI가 읽을 수 있는 언어로 번역할 뿐입니다. 그래서 광고비로 부풀린 가짜를 돕지 않고, AI 검색 시대를 부정하는 사업은 받지 않으며, 가족에게 추천할 수 없는 일은 계약하지 않습니다.
            </p>
            <ButtonLink href="/about" variant="editorial">
              벨녹의 기준과 시작 이야기 → About 읽기
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section final-section" data-reveal>
        <div className="container" data-reveal-group>
          <div className="faq-panel">
            <div className="section-head reveal-order-0" data-reveal-child>
              <p className="eyebrow">FAQ · 결제 전 가장 많이 묻는 질문</p>
              <p className="lead">계약·진단·결과에 대해 자주 받는 질문들을 정리했습니다.</p>
            </div>
            <div className="faq-list">
              {faqItems.map((item, index) => (
                <details key={item.q} className={`faq-item reveal-order-${index + 1}`} data-reveal-child>
                  <summary>{item.q}</summary>
                  <div className="faq-answer">
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
                  </div>
                </details>
              ))}
            </div>
            <div className="button-row reveal-order-6" data-reveal-child>
              <ButtonLink href="/faq" variant="secondary">FAQ 더 보기 →</ButtonLink>
            </div>
          </div>

          <div className="final-cta reveal-order-7" data-reveal-child>
            <h2>
              지금 우리 사업이 검색과 AI에 어떻게 보이고 있는지,
              <br />
              5분 안에 직접 확인해보세요.
            </h2>
            <div className="button-row">
              <ButtonLink href="/tools/diagnosis">내 단계 진단 시작 →</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                이미 단계가 명확하시다면 → 상담 시작
              </ButtonLink>
            </div>
            <p className="trust-chips" aria-label="무료, 5분 소요, 연락처 없이 기본 결과 확인">
              <span>무료</span>
              <span>5분 소요</span>
              <span>연락처 없이 기본 결과 확인</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
