"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { track } from "@/lib/analytics";

const contactSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  grade: z.enum(["없음", "A", "B", "C", "D", "E", "F"]),
  type: z.string(),
  summary: z.string().min(1).max(500),
  honeypot: z.string().optional()
});

type ContactFormValues = z.infer<typeof contactSchema>;

const typeOptions = [
  "일반 상담",
  "구독 (Pulse/Signal/Engine)",
  "Site (단발)",
  "Studio (MVP·프로토타입)",
  "OS (산업 특화)",
  "파트너 제휴",
  "언론·미디어"
];

function defaultTypeFromQuery(type: string | null) {
  if (type === "os") return "OS (산업 특화)";
  if (type === "site") return "Site (단발)";
  if (type === "studio") return "Studio (MVP·프로토타입)";
  if (type === "partner") return "파트너 제휴";
  if (type === "press") return "언론·미디어";
  if (type === "subscribe") return "구독 (Pulse/Signal/Engine)";
  return "일반 상담";
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const defaultType = useMemo(() => defaultTypeFromQuery(searchParams.get("type")), [searchParams]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const { register, handleSubmit, reset, formState } = useForm<ContactFormValues>({
    defaultValues: { grade: "없음", type: defaultType, honeypot: "" }
  });

  async function onSubmit(values: ContactFormValues) {
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      setError("입력값을 확인해주세요.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "contact",
          name: parsed.data.name,
          company: parsed.data.company,
          email: parsed.data.email,
          phone: parsed.data.phone,
          grade: parsed.data.grade === "없음" ? "N/A" : parsed.data.grade,
          consultationType: parsed.data.type,
          summary: parsed.data.summary,
          honeypot: parsed.data.honeypot || ""
        })
      });
      if (!response.ok) throw new Error("submit failed");
      track("lead_submit", { source: "contact", grade: parsed.data.grade });
      setStatus("success");
      reset({ grade: "없음", type: defaultType, honeypot: "" });
    } catch {
      setError("전송 중 문제가 생겼습니다. 잠시 후 다시 시도해주세요.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card" role="status">
        <h2>상담 신청이 도착했습니다.</h2>
        <p className="body-copy mt-4">
          24시간 안에 안상효 대표가 직접 회신드립니다.
          <br />
          메일이 도착하지 않으면 스팸함을 확인해주세요.
        </p>
        <Link className="button button-primary mt-6" href="/">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field">
        <label htmlFor="name">이름</label>
        <input id="name" {...register("name", { required: true })} aria-invalid={Boolean(formState.errors.name)} />
      </div>
      <div className="field">
        <label htmlFor="company">회사·가게 이름</label>
        <input id="company" {...register("company")} />
      </div>
      <div className="field">
        <label htmlFor="email">연락 가능 이메일</label>
        <input id="email" type="email" {...register("email", { required: true })} aria-invalid={Boolean(formState.errors.email)} />
      </div>
      <div className="field">
        <label htmlFor="phone">연락처</label>
        <input id="phone" type="tel" {...register("phone")} />
      </div>
      <div className="grid-2">
        <div className="field">
          <label htmlFor="grade">진단 결과 (있으시면)</label>
          <select id="grade" {...register("grade")}>
            {["없음", "A", "B", "C", "D", "E", "F"].map((grade) => (
              <option key={grade}>{grade}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="type">상담 유형</label>
          <select id="type" {...register("type")}>
            {typeOptions.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="summary">한 줄 요약</label>
        <textarea
          id="summary"
          maxLength={500}
          placeholder="지금 가장 큰 병목 한 가지를 적어주세요."
          {...register("summary", { required: true, maxLength: 500 })}
          aria-invalid={Boolean(formState.errors.summary)}
        />
      </div>
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button className="button button-primary" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "전송 중..." : "상담 신청 보내기 →"}
      </button>
    </form>
  );
}
