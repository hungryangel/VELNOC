# Diagnosis Consulting Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace fake real-time diagnosis output with a credible first-pass result and detailed consulting intake flow.

**Architecture:** Keep the existing client-side questionnaire and A-F scoring, but remove deterministic fake domain analysis from the user-facing result. Send domain, brand, keyword, competitors, answers, score, and contact fields to `/api/lead` so VELNOC can produce a real follow-up report and consultation.

**Tech Stack:** Next.js App Router, React client component, Zod lead schema, Resend/Slack lead delivery, Node test runner.

---

### Task 1: Lead Copy And Operator Summary

**Files:**
- Modify: `lib/lead.ts`
- Create: `tests/lead.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing tests**

```js
test("diagnosis auto reply explains manual follow-up report", () => {
  const text = autoReplyText({
    source: "diagnosis",
    name: "Bee",
    company: "",
    email: "bee@example.com",
    phone: "",
    grade: "D",
    consultationType: "무료 상세 진단",
    summary: "성장 단계 / Site example.com",
    honeypot: "",
    metadata: {}
  });

  assert.match(text, /24시간 안에 상세 진단 결과/);
  assert.match(text, /분류 결과: D/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/lead.test.mjs`

Expected: FAIL because the current auto-reply says only "진단 신청 감사합니다" and links to the simulator.

- [ ] **Step 3: Implement copy and metadata summary**

Add a compact metadata formatter in `lib/lead.ts` and update `autoReplyText()` and `operatorText()` so diagnosis leads include follow-up copy plus domain, brand, keyword, competitors, stage, and score when present.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/lead.test.mjs`

Expected: PASS.

### Task 2: Diagnosis Result Intake

**Files:**
- Modify: `components/tools/DiagnosisTool.tsx`

- [ ] **Step 1: Remove fake analysis surface**

Delete `performAnalysis()`, `hashCode()`, fake `AnalysisResult.complete` score fields, and the "AI VISIBILITY · 실시간 분석" result block.

- [ ] **Step 2: Add detailed report form**

Replace the email-only capture card with name, company, email, phone fields and submit `source: "diagnosis"`, grade, summary, and full metadata to `/api/lead`.

- [ ] **Step 3: Keep user-facing continuity**

Keep A-F scoring, A-type guidance, simulator CTA for B-E, and contact CTA for F. Reword result copy to "1차 진단 결과" and "상세 결과는 24시간 안에 보내드립니다."

### Task 3: Verification

**Files:**
- No new files.

- [ ] **Step 1: Run focused tests**

Run: `npm test -- tests/lead.test.mjs`

Expected: PASS.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit 0.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: exit 0.
