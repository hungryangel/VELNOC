import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { autoReplySubject, autoReplyText, leadSchema, normalizeLead, operatorText, type LeadPayload } from "@/lib/lead";

export const dynamic = "force-dynamic";

const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const LIMIT = 5;

function getIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const current = buckets.get(ip);
  if (!current || current.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= LIMIT) return false;
  current.count += 1;
  return true;
}

async function sendSlack(text: string) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return false;
  const response = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text })
  });
  return response.ok;
}

async function sendEmail(to: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return false;
  const resend = new Resend(apiKey);
  const result = await resend.emails.send({ from, to, subject, text });
  return !result.error;
}

function recordValue(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

async function recordDiagnosisStats(request: NextRequest, body: LeadPayload) {
  if (!body.grade || !body.metadata?.site) return;
  const answers = recordValue(body.metadata?.answers);
  const score = recordValue(body.metadata?.score);
  await fetch(`${request.nextUrl.origin}/api/diagnosis-stats`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      industry: typeof answers.industry === "string" ? answers.industry : "unknown",
      grade: body.grade,
      T: typeof score.T === "number" ? score.T : 0
    })
  }).catch(() => {});
}

export async function POST(request: NextRequest) {
  const ip = getIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, message: "잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "입력값을 확인해주세요." }, { status: 400 });
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const lead = normalizeLead(parsed.data);
  const operator = process.env.RESEND_TO_OPERATOR;
  const operatorBody = operatorText(lead);

  let userMail = false;
  let operatorMail = false;
  let slack = false;

  try {
    userMail = await sendEmail(lead.email, autoReplySubject(lead.source), autoReplyText(lead));
    if (operator) {
      operatorMail = await sendEmail(operator, `새 리드 도착 — ${lead.source}`, operatorBody);
    }
  } catch (error) {
    console.error("Resend delivery failed", error);
  }

  try {
    slack = await sendSlack(operatorBody);
  } catch (error) {
    console.error("Slack delivery failed", error);
  }

  if (!userMail && !operatorMail && !slack) {
    console.warn("Lead accepted without delivery providers configured", operatorBody);
  }

  await recordDiagnosisStats(request, lead).catch(() => {});

  return NextResponse.json({
    ok: true,
    delivery: { userMail, operatorMail, slack }
  });
}
