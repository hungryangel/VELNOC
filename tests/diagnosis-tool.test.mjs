import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

function diagnosisSource() {
  return readFileSync(resolve("components/tools/DiagnosisTool.tsx"), "utf8");
}

function globalStyles() {
  return readFileSync(resolve("styles/globals.css"), "utf8");
}

test("diagnosis tool no longer exposes fake real-time analysis", () => {
  const source = diagnosisSource();

  assert.doesNotMatch(source, /function hashCode/);
  assert.doesNotMatch(source, /function performAnalysis/);
  assert.doesNotMatch(source, /AI VISIBILITY · 실시간 분석/);
  assert.doesNotMatch(source, /무료 진단 결과를 이메일로 받기/);
});

test("diagnosis result contains detailed report intake copy", () => {
  const source = diagnosisSource();

  assert.match(source, /무료 상세 진단 신청/);
  assert.match(source, /24시간 안에 상세 진단 결과/);
  assert.match(source, /const consultationType = "무료 상세 진단"/);
});

test("diagnosis result sends stage users to the service anchors", () => {
  const source = diagnosisSource();

  assert.match(source, /function stageServiceHref\(grade: StageGrade\)/);
  assert.match(source, /return "\/services#pulse"/);
  assert.match(source, /return "\/services#signal"/);
  assert.match(source, /return "\/services#engine"/);
  assert.match(source, /이 단계에서 같이 일할 수 있는 방법 보기 →/);
  assert.match(source, /href=\{stageServiceHref\(stageGrade\)\}/);
  assert.match(source, /무료 · 5분 소요 · 연락처 없이 기본 결과 확인/);
  assert.doesNotMatch(source, /const simulatorCta = "벨녹과 함께하면 앞으로 어떻게 되나요\?"/);
  assert.doesNotMatch(source, /\/tools\/simulator\?preset=\$\{result\.grade\}&from=diagnosis/);
  assert.doesNotMatch(source, /wantsQuarterlyReview/);
  assert.doesNotMatch(source, /3개월 후 AI 검색 가시성 재진단 안내/);
  assert.doesNotMatch(source, /vn-followup-option/);
});

test("domain intake asks for AI customer questions needed for consulting", () => {
  const source = diagnosisSource();

  assert.match(source, /예상 고객이 AI에게 물을 법한 질문/);
  assert.match(source, /어떤 질문에서 우리 브랜드가 나오길 바라나요/);
  assert.match(source, /customerQuestion/);
  assert.match(source, /desiredMention/);
});

test("diagnosis collects industry before domain intake", () => {
  const source = diagnosisSource();

  assert.match(source, /function IndustryScreen/);
  assert.match(source, /"intro" \| "industry" \| "domain" \| "survey" \| "result"/);
  assert.match(source, /setAnswers\(\(prev\) => \(\{ \.\.\.prev, industry/);
  assert.doesNotMatch(source, /id: "industry",\n\s+label: "주요 업종을 선택해주세요"/);
});

test("industry-specific AI examples rotate from multiple options", () => {
  const source = diagnosisSource();

  assert.match(source, /const INDUSTRY_EXAMPLES/);
  assert.match(source, /useMemo\(\(\) => getIndustryExamples/);

  const exampleMatches = source.match(/customerQuestion:/g) || [];
  assert.ok(exampleMatches.length >= 18, `expected at least 18 customer question examples, got ${exampleMatches.length}`);

  for (const industry of ["retail", "fnb", "professional", "education", "b2b", "industrial"]) {
    assert.match(source, new RegExp(`${industry}: \\[`));
  }
});

test("industry examples fade inside inputs and disappear on focus", () => {
  const source = diagnosisSource();
  const styles = globalStyles();

  assert.match(source, /function useStreamingExample/);
  assert.match(source, /placeholderExamples/);
  assert.match(source, /vn-stream-placeholder/);
  assert.match(source, /vn-stream-placeholder-char/);
  assert.match(source, /aria-hidden="true"/);
  assert.match(source, /setTimeout/);
  assert.match(source, /visibleLength < activeExample\.length/);
  assert.match(source, /setExampleIndex/);
  assert.match(source, /isFocused/);
  assert.match(source, /onFocus=\{\(\) => setIsFocused\(true\)\}/);
  assert.match(source, /onBlur=\{\(\) => setIsFocused\(false\)\}/);
  assert.match(source, /shouldShowStreamingExample/);
  assert.match(source, /style=\{\{ animationDelay: `\$\{index \* 40\}ms` \}\}/);
  assert.match(source, /examples\.map\(\(example\) => example\.keyword\)/);
  assert.match(source, /examples\.map\(\(example\) => example\.customerQuestion\)/);
  assert.match(source, /examples\.map\(\(example\) => example\.desiredMention\)/);
  assert.doesNotMatch(source, /<RotatingExample/);
  assert.doesNotMatch(source, /placeholder=\{streamingPlaceholder\}/);
  assert.match(styles, /\.vn-input-shell:focus-within \.vn-stream-placeholder/);
  assert.match(styles, /animation: vn-stream-placeholder-in 680ms ease forwards/);
  assert.match(styles, /filter: blur\(5px\)/);
});

test("competitor intake accepts brand names and limits comparison fields", () => {
  const source = diagnosisSource();

  assert.match(source, /const DEFAULT_COMPETITORS = \["", ""\]/);
  assert.match(source, /function normalizeComparisonTarget/);
  assert.match(source, /hasComparisonTarget/);
  assert.match(source, /비교 브랜드\/사이트/);
  assert.match(source, /브랜드명 또는 도메인/);
  assert.match(source, /도메인을 모르면 브랜드명만 적어도 됩니다/);
  assert.match(source, /normalizeComparisonTargets\(siteInputs\.competitors\)/);
  assert.doesNotMatch(source, /경쟁사 3/);
  assert.doesNotMatch(source, /competitor3\.com/);
  assert.doesNotMatch(source, /required=\{index === 0\}/);
});

test("domain intake explains required validation before enabling the next step", () => {
  const source = diagnosisSource();
  const styles = globalStyles();

  assert.match(source, /const DOMAIN_MIN_LENGTH = 4/);
  assert.match(source, /const CUSTOMER_QUESTION_MIN_LENGTH = 8/);
  assert.match(source, /const COMPARISON_TARGET_MIN_LENGTH = 2/);
  assert.match(source, /function domainRequirementMessage/);
  assert.match(source, /function customerQuestionRequirementMessage/);
  assert.match(source, /function comparisonRequirementMessage/);
  assert.match(source, /자사 도메인을 입력해주세요\./);
  assert.match(source, /도메인은 최소 4자 이상 입력해주세요\./);
  assert.match(source, /예상 고객이 AI에게 물을 질문을 입력해주세요\./);
  assert.match(source, /질문은 최소 8자 이상 문장으로 입력해주세요\./);
  assert.match(source, /비교 브랜드\/사이트를 1곳 이상 입력해주세요\./);
  assert.match(source, /브랜드명 또는 도메인은 최소 2자 이상 입력해주세요\./);
  assert.match(source, /const requiredErrors = \[domainError, customerQuestionError, comparisonError\]\.filter\(Boolean\)/);
  assert.match(source, /id="diagnosis-required-errors"/);
  assert.match(source, /role="status"/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /필수 입력 확인/);
  assert.match(source, /aria-invalid=\{Boolean\(error\)\}/);
  assert.match(source, /aria-describedby=\{describedBy\}/);
  assert.match(source, /className=\{`vn-field \$\{error \? "has-error" : ""\}`\}/);
  assert.match(styles, /\.vn-field\.has-error \.vn-input/);
  assert.match(styles, /\.vn-field-error/);
  assert.match(styles, /\.vn-validation-callout/);
});

test("survey and lead forms identify the missing required answer", () => {
  const source = diagnosisSource();
  const styles = globalStyles();

  assert.match(source, /function surveyRequirementMessage/);
  assert.match(source, /필수 문항입니다\. 선택 후 다음 단계로 이동할 수 있습니다\./);
  assert.match(source, /const missingSurveyQuestions = questions\.filter\(\(question\) => surveyRequirementMessage\(question, answers\)\)/);
  assert.match(source, /id="survey-required-errors"/);
  assert.match(source, /className=\{`vn-fieldset \$\{surveyRequirementMessage\(question, answers\) \? "has-error" : ""\}`\}/);
  assert.match(source, /function emailRequirementMessage/);
  assert.match(source, /상세 진단 결과를 받을 이메일을 입력해주세요\./);
  assert.match(source, /올바른 이메일 주소를 입력해주세요\./);
  assert.match(source, /id="lead-required-errors"/);
  assert.match(source, /aria-describedby=\{leadEmailError \? "lead-email-error" : undefined\}/);
  assert.match(styles, /\.vn-fieldset\.has-error/);
  assert.match(styles, /\.vn-fieldset-error/);
});

test("diagnosis option markers use one square check style", () => {
  const source = diagnosisSource();
  const styles = globalStyles();

  assert.match(source, /className=\{`vn-option-marker \$\{selected \? "selected" : ""\}`\}/);
  assert.match(source, /\{selected \? "✓" : ""\}/);
  assert.doesNotMatch(source, /isMulti/);
  assert.doesNotMatch(source, /is-radio/);
  assert.doesNotMatch(source, /is-check/);
  assert.match(styles, /\.vn-option-marker \{[\s\S]*border-radius: var\(--velnoc-radius-sm\)/);
  assert.doesNotMatch(styles, /\.vn-option-marker\.is-radio/);
  assert.doesNotMatch(styles, /\.vn-option-marker\.is-check/);
});

test("website status question follows the selected diagnosis path", () => {
  const source = diagnosisSource();

  assert.match(source, /label: "현재 고객이 확인할 수 있는 온라인 거점은\?"/);
  assert.match(source, /\{ label: "자사 사이트 있음 \+ 외부 플랫폼 사용", value: "site_platform" \}/);
  assert.match(source, /const OWN_SITE_WEBSITE_VALUES = \["basic", "site_platform", "active"\]/);
  assert.match(source, /const NO_SITE_WEBSITE_VALUES = \["none", "platform"\]/);
  assert.match(source, /function getWebsiteOptions\(question: Question, hasOwnSite: boolean\)/);
  assert.match(source, /function isNoSiteWebsiteAnswer\(value: string\)/);
  assert.match(source, /site_platform: 2/);
  assert.match(source, /website: isNoSiteWebsiteAnswer\(currentWebsite\) \? currentWebsite : "none"/);
  assert.doesNotMatch(source, /option\.value === "basic" \|\| option\.value === "active"/);
});
