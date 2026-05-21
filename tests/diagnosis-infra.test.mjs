import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

function source(path) {
  return readFileSync(resolve(path), "utf8");
}

test("domain check API inspects basic SEO and crawler access signals", () => {
  const filename = "app/api/domain-check/route.ts";
  assert.ok(existsSync(resolve(filename)), "domain check route should exist");
  const route = source(filename);

  assert.match(route, /export type DomainCheckResult = \{/);
  assert.match(route, /function extractMeta\(html: string, name: string\): string \| null/);
  assert.match(route, /function extractTitle\(html: string\): string \| null/);
  assert.match(route, /VELNOC-DiagnosisBot\/1\.0/);
  assert.match(route, /AbortSignal\.timeout\(8000\)/);
  assert.match(route, /robots\.txt/);
  assert.match(route, /AbortSignal\.timeout\(4000\)/);
  assert.match(route, /Disallow:\\s\*\\\//);
  assert.match(route, /hasMobileViewport/);
  assert.match(route, /public, max-age=3600/);
});

test("diagnosis tool debounces domain checks and renders the result card", () => {
  const tool = source("components/tools/DiagnosisTool.tsx");

  assert.match(tool, /type DomainCheckResult = \{/);
  assert.match(tool, /const \[domainCheck, setDomainCheck\] = useState<DomainCheckResult \| null>\(null\)/);
  assert.match(tool, /setTimeout\(async \(\) => \{/);
  assert.match(tool, /\/api\/domain-check\?domain=/);
  assert.match(tool, /encodeURIComponent\(domain\)/);
  assert.match(tool, /}, 800\)/);
  assert.match(tool, /domainCheck=\{domainCheck\}/);
  assert.match(tool, /도메인 직접 확인 결과/);
  assert.match(tool, /사이트 정상 응답/);
  assert.match(tool, /메타 디스크립션 있음/);
  assert.match(tool, /robots\.txt가 검색 엔진을 차단하고 있음/);
  assert.match(tool, /모바일 viewport 없음/);
});

test("diagnosis stats API stores anonymized industry aggregates with an optional Redis client", () => {
  const filename = "app/api/diagnosis-stats/route.ts";
  assert.ok(existsSync(resolve(filename)), "diagnosis stats route should exist");
  const route = source(filename);

  assert.match(route, /diagnosis:stats:\$\{industry\}:\$\{grade\}/);
  assert.match(route, /diagnosis:stats:\$\{industry\}:scores/);
  assert.match(route, /diagnosis:stats:total/);
  assert.match(route, /\.incr\(/);
  assert.match(route, /\.lpush\(/);
  assert.match(route, /\.ltrim\(/);
  assert.match(route, /const grades = \["B", "C", "D", "E", "F"\]/);
  assert.match(route, /hasEnoughData: total >= 30/);
  assert.match(route, /public, max-age=300/);
  assert.match(route, /redis_unavailable/);
});

test("lead route posts diagnosis stats without blocking lead delivery", () => {
  const leadRoute = source("app/api/lead/route.ts");

  assert.match(leadRoute, /async function recordDiagnosisStats/);
  assert.match(leadRoute, /body\.grade/);
  assert.match(leadRoute, /body\.metadata\?\.site/);
  assert.match(leadRoute, /\/api\/diagnosis-stats/);
  assert.match(leadRoute, /industry: typeof answers\.industry === "string" \? answers\.industry : "unknown"/);
  assert.match(leadRoute, /T: typeof score\.T === "number" \? score\.T : 0/);
  assert.match(leadRoute, /\.catch\(\(\) => \{\}\)/);
});

test("diagnosis result shows benchmark data only after enough samples exist", () => {
  const tool = source("components/tools/DiagnosisTool.tsx");

  assert.match(tool, /type DiagnosisBenchmark = \{/);
  assert.match(tool, /const \[benchmark, setBenchmark\] = useState<DiagnosisBenchmark \| null>\(null\)/);
  assert.match(tool, /\/api\/diagnosis-stats\?industry=\$\{industry\}/);
  assert.match(tool, /benchmark\?\.hasEnoughData/);
  assert.match(tool, /같은 업종 \{benchmark\.total\}건 진단 기준/);
  assert.match(tool, /가장 많은 단계:/);
});
