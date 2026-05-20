import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const framework = readFileSync("components/ui/VelnocFramework.tsx", "utf8");
const styles = readFileSync("styles/globals.css", "utf8");
const site = readFileSync("lib/site.tsx", "utf8");
const diagnosis = readFileSync("components/tools/DiagnosisTool.tsx", "utf8");

test("main framework explains the five-step AI understanding process without duplicating diagnosis", () => {
  assert.match(framework, /const FRAMEWORK_STEPS/);
  assert.match(framework, /VELNOC STAGE MAP · 벨녹 5단계/);
  assert.match(framework, /벨녹 5단계\(VELNOC Stage Map\)/);
  assert.match(framework, /사업이 검색과 AI 안에서 자산으로 남는 흐름입니다\./);
  assert.match(framework, /STAGE 01/);
  assert.match(framework, /무지/);
  assert.match(framework, /진단으로 시작/);
  assert.match(framework, /AI가 웹사이트의 존재나 내용을 아직 알지 못하는 단계/);
  assert.match(framework, /STAGE 02/);
  assert.match(framework, /인지/);
  assert.match(framework, /Site \/ Seed \/ Pulse/);
  assert.match(framework, /AI가 사업 정보를 스캔하고 식별하기 시작하는 단계/);
  assert.match(framework, /STAGE 03/);
  assert.match(framework, /노출/);
  assert.match(framework, /Signal/);
  assert.match(framework, /특정 질문에서 우리 사업을 답변 후보로 고려하는 단계/);
  assert.match(framework, /STAGE 04/);
  assert.match(framework, /인용/);
  assert.match(framework, /Engine/);
  assert.match(framework, /AI가 답변 안에서 우리 사업 정보를 직접 보여주는 단계/);
  assert.match(framework, /STAGE 05/);
  assert.match(framework, /신뢰/);
  assert.match(framework, /Engine \(시간 누적\)/);
  assert.match(framework, /반복적으로 먼저 확인되는 신뢰 출처가 되는 단계/);
  assert.match(framework, /framework-stage-badge/);

  assert.doesNotMatch(framework, /내 돈을 태워야만/);
  assert.doesNotMatch(framework, /광고를 멈추는 순간/);
  assert.doesNotMatch(framework, /권장 제품 · Engine 월 169만 원/);
  assert.doesNotMatch(framework, /세부 사항/);
  assert.doesNotMatch(framework, /더 보기 ▼/);
  assert.doesNotMatch(framework, /MiniQuizState/);
  assert.doesNotMatch(framework, /QUESTION_1_OPTIONS/);
  assert.doesNotMatch(framework, /광고를 일주일 끄면/);
  assert.doesNotMatch(framework, /2문항 추정 결과/);
  assert.doesNotMatch(framework, /localStorage\.setItem\("velnoc:userStage"/);
  assert.doesNotMatch(framework, /framework-node-list/);
  assert.doesNotMatch(framework, /framework-stage-gauge-row/);
  assert.doesNotMatch(framework, /role="tablist"/);
});

test("framework styles render compact process cards instead of a mini diagnosis surface", () => {
  assert.match(styles, /\.framework-process-shell/);
  assert.match(styles, /\.framework-process-grid/);
  assert.match(styles, /\.framework-process-card/);
  assert.match(styles, /\.framework-process-step/);
  assert.match(styles, /grid-template-columns:\s*repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 767px\)/);
  assert.doesNotMatch(styles, /\.framework-answer-button/);
  assert.doesNotMatch(styles, /\.framework-result-card/);
});

test("diagnosis route and result timeline expose moved stage details outside the main page", () => {
  assert.ok(existsSync("app/diagnosis/page.tsx"));
  assert.match(diagnosis, /const DIAGNOSIS_STAGE_DETAILS/);
  assert.match(diagnosis, /vn-stage-timeline/);
  assert.match(diagnosis, /role="list"/);
  assert.match(diagnosis, /role="listitem"/);
  assert.match(diagnosis, /aria-current=\{isCurrent \? "step" : undefined\}/);
  assert.match(diagnosis, /진단 결과/);
  assert.match(diagnosis, /function getOwnerTitle\(industry: IndustryKey \| null\): string/);
  assert.match(diagnosis, /if \(industry === "professional" \|\| industry === "education"\) return "원장님"/);
  assert.match(diagnosis, /return "대표님"/);
  assert.match(diagnosis, /function withOwnerTitle\(text: string, ownerTitle: string\)/);
  assert.match(diagnosis, /\{ownerTitle\} 사업은 지금/);
  assert.match(diagnosis, /다음 한 칸은 정해져 있습니다\. 이전\/다음 단계와 함께 살펴보세요\./);
  assert.match(diagnosis, /출발선에서 한 칸을 만들어가는 게 첫 작업입니다\./);
  assert.match(diagnosis, /다음 단계가 아니라, 이 자리를 지키는 운영이 시작됩니다\./);
  assert.match(diagnosis, /memoLabel=\{`현재 \$\{ownerTitle\} 단계`\}/);
  assert.match(diagnosis, /한 칸 전 단계/);
  assert.match(diagnosis, /한 칸 다음 단계/);
  assert.match(diagnosis, /시작 지점/);
  assert.match(diagnosis, /출발선/);
  assert.match(diagnosis, /body=\{`지금 \$\{ownerTitle\} 사업은 출발선에 있습니다\. 다음 한 칸부터 시작합니다\.`\}/);
  assert.match(diagnosis, /이 자리를 지키는 일/);
  assert.match(diagnosis, /자리 지키기/);
  assert.match(diagnosis, /여기서부터는 다음 단계가 아니라, 이 자리를 지키는 운영이 필요합니다\./);
  assert.match(diagnosis, /세부 사항/);
  assert.match(diagnosis, /더 보기 ▼/);
  assert.match(diagnosis, /aria-controls=\{detailId\}/);
  assert.match(diagnosis, /aria-expanded=\{detailsOpen\}/);
  assert.match(diagnosis, /function stageServiceHref\(grade: StageGrade\)/);
  assert.match(diagnosis, /return "\/services#pulse"/);
  assert.match(diagnosis, /return "\/services#signal"/);
  assert.match(diagnosis, /return "\/services#engine"/);
  assert.match(diagnosis, /이 단계에서 같이 일할 수 있는 방법 보기 →/);
  assert.match(diagnosis, /href=\{stageServiceHref\(stageGrade\)\}/);
  assert.match(diagnosis, /href="\/tools\/diagnosis"/);
  assert.match(diagnosis, /무료 · 5분 소요 · 연락처 없이 기본 결과 확인/);
  assert.doesNotMatch(diagnosis, /\/tools\/simulator\?preset=\$\{result\.grade\}&from=diagnosis/);
  assert.match(diagnosis, /localStorage\.setItem\("velnoc:userStage"/);
});

test("diagnosis result timeline styles implement the three-card hierarchy", () => {
  assert.match(styles, /--velnoc-green-emph:\s*var\(--velnoc-color-primary\)/);
  assert.match(styles, /--context-text-alpha:\s*0\.60/);
  assert.match(styles, /--context-text-mix:\s*60%/);
  assert.match(styles, /--card-current-bg:\s*var\(--velnoc-color-surface-card\)/);
  assert.match(styles, /--card-current-border:\s*color-mix\(in srgb,\s*var\(--velnoc-color-primary\)\s*20%,\s*transparent\)/);
  assert.match(styles, /--card-context-bg:\s*color-mix\(in srgb,\s*var\(--velnoc-color-surface-card\)\s*45%,\s*transparent\)/);
  assert.match(styles, /\.vn-stage-timeline-card\.is-current/);
  assert.match(styles, /\.vn-stage-timeline-card\.is-context/);
  assert.match(styles, /width:\s*calc\(100% - 16px\)/);
  assert.match(styles, /width:\s*calc\(100% - 32px\)/);
  assert.match(styles, /grid-template-columns:\s*320px 480px 320px/);
  assert.match(styles, /\.vn-stage-timeline-card\.is-current\s*\{[\s\S]*order:\s*1/);
  assert.match(styles, /\.vn-stage-timeline-card\.is-before\s*\{[\s\S]*order:\s*2/);
  assert.match(styles, /\.vn-stage-timeline-card\.is-after\s*\{[\s\S]*order:\s*3/);
  assert.match(styles, /pointer-events:\s*none/);
  assert.match(styles, /cursor:\s*default/);
  assert.match(styles, /content:\s*"한 칸 전"/);
  assert.match(styles, /content:\s*"한 칸 다음"/);
  assert.match(styles, /@media \(min-width: 1024px\)/);
});

test("simulator remains absent from the footer", () => {
  assert.doesNotMatch(site, /\{ label: "ROI 시뮬레이터"/);
});
