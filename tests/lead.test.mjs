import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

function loadLeadModule() {
  const filename = resolve("lib/lead.ts");
  const source = readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020
    },
    fileName: filename
  }).outputText;
  const require = createRequire(import.meta.url);
  const cjsModule = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: cjsModule.exports,
    module: cjsModule,
    process,
    require
  }, { filename });
  return cjsModule.exports;
}

const { autoReplyText, operatorText } = loadLeadModule();

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

  assert.match(text, /분류 결과: D/);
  assert.match(text, /24시간 안에 상세 진단 결과/);
  assert.match(text, /상담/);
});

test("operator text includes diagnosis intake details for consulting", () => {
  const text = operatorText({
    source: "diagnosis",
    name: "Bee",
    company: "VELNOC",
    email: "bee@example.com",
    phone: "010-0000-0000",
    grade: "D",
    consultationType: "무료 상세 진단",
    summary: "성장 단계 / example.com",
    honeypot: "",
    metadata: {
      site: {
        hasOwnSite: true,
        domain: "example.com",
        brand: "Example",
        keyword: "AI 검색 최적화",
        customerQuestion: "AI 검색 최적화를 잘하는 회사는 어디야?",
        desiredMention: "B2B 브랜드의 AI 검색 노출을 맡길 수 있는 팀은?",
        competitors: ["competitor.com"]
      },
      score: {
        T: 7,
        D: 2,
        M: 2,
        S: 2,
        O: 1
      },
      answers: {
        industry: "b2b",
        website: "basic",
        channel: ["own", "offline"]
      }
    }
  });

  assert.match(text, /도메인: example\.com/);
  assert.match(text, /브랜드: Example/);
  assert.match(text, /핵심 키워드: AI 검색 최적화/);
  assert.match(text, /예상 고객 질문: AI 검색 최적화를 잘하는 회사는 어디야\?/);
  assert.match(text, /희망 노출 질문: B2B 브랜드의 AI 검색 노출을 맡길 수 있는 팀은\?/);
  assert.match(text, /경쟁사: competitor\.com/);
  assert.match(text, /총점: 7\/11/);
  assert.match(text, /industry=b2b/);
});
