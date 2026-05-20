import { z } from "zod";

export const leadSchema = z.object({
  source: z.enum(["diagnosis", "simulator", "contact"]),
  name: z.string().max(80).optional().default(""),
  company: z.string().max(120).optional().default(""),
  email: z.string().email(),
  phone: z.string().max(40).optional().default(""),
  grade: z.enum(["A", "B", "C", "D", "E", "F", "N/A"]).optional().default("N/A"),
  consultationType: z.string().max(80).optional().default("일반 상담"),
  summary: z.string().max(500).optional().default(""),
  honeypot: z.string().max(200).optional().default(""),
  metadata: z.record(z.unknown()).optional().default({})
});

export type LeadPayload = z.infer<typeof leadSchema>;

export function sanitize(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

export function normalizeLead(payload: LeadPayload): LeadPayload {
  return {
    ...payload,
    name: sanitize(payload.name),
    company: sanitize(payload.company),
    email: sanitize(payload.email),
    phone: sanitize(payload.phone),
    consultationType: sanitize(payload.consultationType),
    summary: sanitize(payload.summary)
  };
}

export function leadTypeLabel(source: LeadPayload["source"]) {
  return source === "diagnosis" ? "진단" : source === "simulator" ? "시뮬레이터" : "상담";
}

export function autoReplySubject(source: LeadPayload["source"]) {
  return source === "contact" ? "상담 신청 받았습니다 — VELNOC" : "자가 진단 결과가 도착했어요 — VELNOC";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? sanitize(value) : "";
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function stringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => stringValue(item)).filter(Boolean);
}

function formatAnswerValue(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => stringValue(item)).filter(Boolean).join("|");
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

export function diagnosisMetadataText(metadata: Record<string, unknown>) {
  const lines: string[] = [];
  const site = isRecord(metadata.site) ? metadata.site : {};
  const score = isRecord(metadata.score) ? metadata.score : {};
  const answers = isRecord(metadata.answers) ? metadata.answers : {};
  const hasOwnSite = typeof site.hasOwnSite === "boolean" ? site.hasOwnSite : null;
  const domain = stringValue(site.domain);
  const brand = stringValue(site.brand);
  const keyword = stringValue(site.keyword);
  const customerQuestion = stringValue(site.customerQuestion);
  const desiredMention = stringValue(site.desiredMention);
  const competitors = stringList(site.competitors);
  const total = numberValue(score.T);

  if (hasOwnSite !== null) lines.push(`사이트 보유: ${hasOwnSite ? "있음" : "없음"}`);
  if (domain) lines.push(`도메인: ${domain}`);
  if (brand) lines.push(`브랜드: ${brand}`);
  if (keyword) lines.push(`핵심 키워드: ${keyword}`);
  if (customerQuestion) lines.push(`예상 고객 질문: ${customerQuestion}`);
  if (desiredMention) lines.push(`희망 노출 질문: ${desiredMention}`);
  if (competitors.length > 0) lines.push(`경쟁사: ${competitors.join(", ")}`);
  if (total !== null) {
    const dims = [
      `D${numberValue(score.D) ?? "-"}`,
      `M${numberValue(score.M) ?? "-"}`,
      `S${numberValue(score.S) ?? "-"}`,
      `O${numberValue(score.O) ?? "-"}`
    ];
    lines.push(`총점: ${total}/11 (${dims.join(" / ")})`);
  }

  const answerPairs = Object.entries(answers)
    .map(([key, value]) => {
      const formatted = formatAnswerValue(value);
      return formatted ? `${key}=${formatted}` : "";
    })
    .filter(Boolean);

  if (answerPairs.length > 0) lines.push(`설문 답변: ${answerPairs.join(", ")}`);

  return lines.join("\n");
}

function diagnosisNextStep(lead: LeadPayload) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://velnoc.com";
  if (lead.grade === "A") {
    return `현재는 선택하신 채널에 맞는 전문가 유형을 먼저 확인하는 것이 좋습니다: ${baseUrl}/clients/criteria`;
  }
  if (lead.grade === "F") {
    return `운영 구조 상담이 먼저 필요합니다. 요청 내용을 보고 OS 상담 방향으로 회신드리겠습니다: ${baseUrl}/contact?type=os`;
  }
  return `상세 결과를 보신 뒤, ROI 시뮬레이터로 5년 후 차이도 함께 확인하실 수 있습니다: ${baseUrl}/tools/simulator?preset=${lead.grade}&from=diagnosis-email`;
}

export function autoReplyText(lead: LeadPayload) {
  if (lead.source === "contact") {
    return `${lead.name || "대표"}님, 상담 신청 감사합니다.

24시간 안에 회신드립니다. 자가 진단 결과가 없으시면 먼저 진단을 받아보시면 상담을 더 빠르게 시작할 수 있습니다.

받지 않는 의뢰 기준: ${process.env.NEXT_PUBLIC_SITE_URL || "https://velnoc.com"}/clients/criteria

안상효 / VELNOC`;
  }

  if (lead.source === "diagnosis") {
    return `${lead.name || "대표"}님, 진단 신청 감사합니다.

분류 결과: ${lead.grade}
1차 요약: ${lead.summary || "입력해주신 정보를 기준으로 기본 분류를 완료했습니다."}

24시간 안에 상세 진단 결과와 우선순위 개선 항목을 이메일로 보내드립니다. 필요한 경우 상담 일정도 함께 안내드릴게요.

다음 단계: ${diagnosisNextStep(lead)}

안상효 / VELNOC`;
  }

  return `${lead.name || "대표"}님, 진단 신청 감사합니다.

분류 결과: ${lead.grade}
추천 다음 단계: ${
    lead.grade === "A"
      ? "벨녹보다 현재 채널에 맞는 전문가 유형을 먼저 확인해주세요."
      : lead.grade === "F"
        ? "VELNOC OS 상담을 권장합니다."
        : "ROI 시뮬레이터로 5년 후 차이를 확인해보세요."
  }

다음 링크: ${process.env.NEXT_PUBLIC_SITE_URL || "https://velnoc.com"}/tools/simulator

안상효 / VELNOC`;
}

export function operatorText(lead: LeadPayload) {
  return `새 리드 도착
유형: ${leadTypeLabel(lead.source)}
이름: ${lead.name || "N/A"}
회사: ${lead.company || "N/A"}
이메일: ${lead.email}
연락처: ${lead.phone || "N/A"}
분류: ${lead.grade || "N/A"}
상담 유형: ${lead.consultationType || "N/A"}
한 줄: ${lead.summary || "N/A"}${lead.source === "diagnosis" ? `\n\n진단 상세\n${diagnosisMetadataText(lead.metadata) || "N/A"}` : ""}`;
}
