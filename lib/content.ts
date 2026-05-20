const yes = { status: "yes" as const };
const no = { status: "no" as const };
const partial = (label: string) => ({ status: "partial" as const, label });

export const comparisonRows = [
  ["홈페이지 제작", yes, no, yes],
  ["디자인 자유도", partial("템플릿 의존"), no, yes],
  ["SEO (전통 검색)", partial("형식적"), yes, yes],
  ["AEO (구글 스니펫·음성)", no, no, yes],
  ["GEO (ChatGPT·Perplexity 인용)", no, no, yes],
  ["콘텐츠 운영", no, yes, yes],
  ["업무 자동화 (AX)", no, no, yes],
  ["월 단위 개선·관리", no, partial("리포트뿐"), yes],
  ["소유권 100% 양도", yes, no, yes],
  ["산업 특화 OS 확장", no, no, yes]
];

export const services = [
  {
    id: "site",
    name: "VELNOC Site",
    price: "New 150~300만원 / Retrofit 80~150만원",
    reachBadge: "← STAGE 01 → 02 진입 기반",
    stage: "STAGE 01 → 02 진입 기반",
    description: "사이트가 아직 없거나, 기존 사이트가 검색·AI에서 투명 인간인 사업을 위한 자산 구축 입구.",
    persona: "검색과 AI가 읽을 수 있는 첫 기반이 필요한 분께",
    monthly: ["Site · New — 신규 구축 150~300만원 (1회)", "Site · Retrofit — 기존 사이트 AEO·GEO 세팅 80~150만원 (1회)", "공통 포함: 12개월 Seed 동행", "사이트 1주년 점검 콜 30분"],
    promise: "검색·AI가 읽을 수 있는 사업 기반을 먼저 세웁니다.",
    seo: "검색·AI에 읽히는 사이트 설계·구축",
    automation: "Site 범위에 따라 별도 설계",
    meeting: "자가 진단 후 범위 확정",
    commitment: "1회 구축",
    href: "/tools/diagnosis",
    cta: "벨녹 자가 진단으로 견적 받기 →",
    kind: "site" as const
  },
  {
    id: "seed",
    name: "Seed",
    price: "월 0원",
    reachBadge: "STAGE 02 진입 보장",
    stage: "STAGE 02 진입 보장",
    description: "한 번 만든 사이트가 살아있는지 매월 확인받고 싶은 분께",
    persona: "Site 구매자 12개월 자동 부여",
    monthly: ["사이트 모니터링 (작동·인덱싱)", "월 1회 자동 리포트 (벨녹 5단계 위치 + AI 검색 노출 변화)", "분기 1회 약점 영역 정직 안내", "사이트 1주년 점검 콜 30분"],
    promise: "만든 사이트가 방치되지 않도록 12개월 동안 상태를 확인합니다.",
    excluded: "정기 코칭, 콘텐츠 제작, 키워드 전략은 Pulse부터.",
    seo: "작동·인덱싱 모니터링",
    automation: "포함 안 됨",
    meeting: "사이트 1주년 점검 콜 30분 1회",
    commitment: "Site 구매자 12개월 자동 부여",
    href: "/services#site",
    cta: "Site 구매 시 자동 부여",
    disabledCta: true,
    kind: "subscription" as const
  },
  {
    id: "pulse",
    name: "Pulse",
    price: "19만원",
    reachBadge: "STAGE 02 인지 도달",
    stage: "STAGE 02 인지 도달",
    description: "직접 운영하실 분께",
    persona: "직접 운영하실 분께",
    monthly: ["월 1회 30분 코칭", "키워드 추천·우선순위", "메타·구조화 점검", "콘텐츠는 직접 작성"],
    promise: "검색에 처음 보이는 단계를 운영 흐름으로 이어갑니다.",
    minCycle: "최소 3개월부터",
    seo: "메타·구조화 점검 + 키워드 추천",
    automation: "미포함",
    meeting: "월 1회 30분",
    commitment: "3개월",
    href: "/contact?type=subscribe&tier=pulse",
    cta: "Pulse로 시작 →",
    kind: "subscription" as const
  },
  {
    id: "signal",
    name: "Signal",
    price: "59만원",
    reachBadge: "STAGE 03 노출 도달",
    stage: "STAGE 03 노출 도달",
    description: "본업 바쁜 분께 — 핵심 자산은 벨녹이, 운영은 직접",
    persona: "본업 바쁜 분께 — 핵심 자산은 벨녹이, 운영은 직접",
    monthly: ["키워드 전략·우선순위 설계", "핵심 콘텐츠 풀세팅 1건/월", "자동화 1건", "월 2회 60분 미팅"],
    promise: "광고를 줄여도 덜 흔들리는 검색 자산이 쌓입니다.",
    minCycle: "최소 6개월부터",
    cycleNote: "초기 셋업 1개월 + 운영 5개월 — 자동화·콘텐츠가 누적되는 구조입니다.",
    seo: "키워드 전략 + 핵심 콘텐츠 풀세팅",
    automation: "1건",
    meeting: "월 2회 60분",
    commitment: "6개월",
    href: "/contact?type=subscribe&tier=signal",
    cta: "Signal로 시작 →",
    kind: "subscription" as const,
    featured: true
  },
  {
    id: "engine",
    name: "Engine",
    price: "169만원",
    reachBadge: "STAGE 04~05 인용·신뢰 도달",
    stage: "STAGE 04~05 인용·신뢰 도달",
    description: "전면 위임 원하시는 분께",
    persona: "전면 위임 원하시는 분께",
    monthly: ["풀스택 SEO·AEO·GEO", "AI 인용 추적", "자동화 2~3건", "분기 전략 미팅"],
    promise: "AI가 우리 사업을 신뢰할 수 있는 출처로 읽고 꺼내기 시작합니다.",
    minCycle: "최소 6개월부터",
    cycleNote: "초기 셋업 1~2개월 + 운영 4~5개월 — 인용·신뢰 신호가 누적되는 구조입니다.",
    seo: "풀스택 SEO·AEO·GEO + 인용 추적",
    automation: "2~3건",
    meeting: "분기 전략 미팅",
    commitment: "12개월",
    href: "/contact?type=subscribe&tier=engine",
    cta: "Engine 상담 신청 →",
    kind: "subscription" as const
  }
];

export const projectLines = [
  {
    id: "studio",
    name: "VELNOC Studio",
    price: "300~1,000만원",
    body: "아이디어부터 시연 가능한 프로토타입까지, 4주. MVP·웹서비스·데모.",
    href: "/contact?type=studio",
    cta: "Studio 상담 신청"
  },
  {
    id: "os",
    name: "VELNOC OS",
    price: "1,000만원~",
    body: "우리 산업에 맞는 운영의 중심을 직접 설계합니다. 비즈니스 로직이 자동으로 흐르는 운영체계.",
    href: "/contact?type=os",
    cta: "OS 상담 신청"
  }
];

export const caseItems = [
  {
    id: "case-jeongseondang",
    tag: "LIVING PROOF · 진행 중",
    title: "홍삼 전문점 (가칭: 정선당)",
    summary: "창업자 가족이 운영하는 오프라인 홍삼 전문점. Manifesto의 출발점.",
    body: [
      "오프라인 자산이 풍부한 핵심 타겟의 전형. 벨녹 Manifesto가 탄생한 케이스.",
      "오랜 운영 이력, 정품 유통 라인, 단골 관계처럼 이미 존재하는 자산을 검색과 AI가 읽을 수 있는 언어로 번역하는 출발점입니다."
    ],
    disclosure: "공개 가능 시점: 클라이언트 동의 후"
  },
  {
    id: "case-finedu",
    tag: "VELNOC STUDIO · 3개월 / 납품 완료",
    title: "비공개 금융교육 플랫폼",
    summary: "비전공자를 위한 금융교육 사이트. 디자인·구조 설계 결과물.",
    body: [
      "회원별 성적과 학습 과정 기록, 강의 영상 시청 흐름까지 포함한 교육 플랫폼 기능을 구현한 프로젝트.",
      "외부 사유로 종료되었으나, 결과물의 수준 자체가 벨녹의 시각적·구조적 역량 검증 자료가 됩니다."
    ],
    disclosure: "공개 가능 시점: 클라이언트 승인 후"
  },
  {
    id: "case-farmos",
    tag: "VELNOC OS · 6개월 / 진행 중",
    title: "돼지농장 운영 OS",
    summary: "디지털 자산 수집과 낙후된 업무 과정 자동화를 포함해, DX에서 AX 전환까지 고려하는 OS 프로젝트.",
    body: [
      "한 농가의 운영 데이터·일과·결정 흐름을 하나의 운영체계 안에서 흐르도록 구축 중입니다.",
      "산업 특화 시스템 설계 능력의 살아있는 증거. 한 케이스가 동일 산업 SaaS 확장으로 이어지는 장기 트랙의 첫 시작점."
    ],
    disclosure: "공개 가능 시점: 첫 운영 사이클 완료 후"
  },
  {
    id: "case-panayo",
    tag: "자체 프로젝트 · 출전 중",
    title: "파나요",
    summary: "벨녹이 직접 운영하는 자체 서비스. 모두의창업 경진대회 출전 진행 중.",
    body: ["아이디어에서 시연 가능한 프로토타입까지 1주 안에 만든 자체 스프린트입니다."],
    disclosure: "공개 가능 시점: 대회 결과 발표 후"
  }
];

export const hardNoRows = [
  ["검증 불가 제품·서비스 마케팅", "효능·원산지·운영자 정체성이 검증되지 않거나 의도적으로 가려진 제품·서비스"],
  ["가짜 후기·페르소나 양산 요청", "실재하지 않는 사용자·전문가를 만들어 인용시키려는 모든 작업"],
  ["인증·라이선스 우회", "의료·금융·식약 영역에서 정식 인증 없이 권위 신호를 위조하려는 시도"],
  ["사장 정체성 은폐 요청", "운영자가 본인을 드러내기를 거부하면서 \"신뢰감 있게\" 보이고 싶다는 요청"],
  ["단기 인용 트릭만 원하는 의뢰", "\"장기 자산은 필요 없고 6개월만 ChatGPT에 뜨면 된다\"는 단기 게임 요청"],
  ["경쟁사 비방·SEO 공격 요청", "가짜 부정 후기·역SEO·평판 공격 일체"]
];

export const strongYesRows = [
  ["오랜 운영 이력이 있는 오프라인 진짜배기", "시간 축 신호가 이미 있음. 번역만 하면 됨"],
  ["운영자 본인의 전문성이 자산인 사업", "1인칭 정체성이 그대로 GEO 신호"],
  ["공인 인증·라이선스 보유 사업자", "1차 권위 신호 즉시 활용 가능"],
  ["지역 기반 SMB / 가족 운영 사업", "\"진짜를 지킨다\"는 미션과 정확히 일치"],
  ["B2B 전문 서비스 (법무·세무·의료·컨설팅)", "운영자 정체성·자격증·이력이 그대로 GEO 자산"],
  ["장인·전문가 / 1인 브랜드", "사장 본인이 곧 콘텐츠 자산"]
];
