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

function diagnosisPageSource() {
  return readFileSync(resolve("app/tools/diagnosis/page.tsx"), "utf8");
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

test("diagnosis v2 uses barrier scoring with branched survey questions", () => {
  const source = diagnosisSource();

  for (const key of [
    "digital_channel",
    "ad_dependency",
    "search_visibility",
    "ai_recognition",
    "branch_content",
    "ai_citation",
    "monthly_leads"
  ]) {
    assert.match(source, new RegExp(`id: "${key}"`));
  }

  assert.match(source, /type BarrierReason =/);
  assert.match(source, /type IndustryCluster = "professional_edu" \| "fnb_retail" \| "b2b_industrial"/);
  assert.match(source, /function getIndustryCluster\(industry: IndustryKey \| null\): IndustryCluster \| null/);
  assert.match(source, /showIf: \(answers\) => answerString\(answers, "ads"\) !== "none"/);
  assert.match(source, /getBranchContentQuestion\(answerIndustry\(answers\)\)/);
  assert.match(source, /const D = \(\{ none: 0, platform: 1, site: 2, content: 3 \}/);
  assert.match(source, /const T = D \+ A \+ V \+ R \+ C \+ O \+ B/);
  assert.match(source, /if \(D === 0\)\s+grade = capGrade\(grade, "C"\)/);
  assert.match(source, /if \(A === 0\)\s+grade = capGrade\(grade, "C"\)/);
  assert.match(source, /if \(R === 0\)\s+grade = capGrade\(grade, "D"\)/);
  assert.match(source, /if \(C === 0\)\s+grade = capGrade\(grade, "E"\)/);
  assert.match(source, /BARRIER_REASON_COPY/);
  assert.match(source, /function getSensitivityInsight\(result: ScoreResult\): SensitivityInsight \| null/);
  assert.match(source, /className="vn-tabular vn-small vn-text-primary"/);
  assert.doesNotMatch(source, /channelBlock/);
  assert.doesNotMatch(source, /blockedChannels/);
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
  assert.match(source, /onBlur=\{\(\) => \{\s+setIsFocused\(false\);\s+onBlur\?\.\(\);\s+\}\}/);
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
  assert.match(source, /aria-invalid=\{visibleError\}/);
  assert.match(source, /aria-describedby=\{describedBy\}/);
  assert.match(source, /className=\{`vn-field \$\{visibleError \? "has-error" : ""\}`\}/);
  assert.match(styles, /\.vn-field\.has-error \.vn-input/);
  assert.match(styles, /\.vn-field-error/);
  assert.match(styles, /\.vn-validation-callout/);
});

test("domain intake hides required errors until touch or submit", () => {
  const source = diagnosisSource();

  assert.match(source, /type SiteFieldName = "domain" \| "customerQuestion" \| "comparison"/);
  assert.match(source, /const \[touchedFields, setTouchedFields\] = useState/);
  assert.match(source, /const \[hasSubmitted, setHasSubmitted\] = useState\(false\)/);
  assert.match(source, /function shouldShowFieldError\(field: SiteFieldName\)/);
  assert.match(source, /showError=\{shouldShowFieldError\("domain"\)\}/);
  assert.match(source, /showError=\{shouldShowFieldError\("customerQuestion"\)\}/);
  assert.match(source, /showError=\{shouldShowFieldError\("comparison"\)\}/);
  assert.match(source, /onBlur=\{\(\) => markTouched\("domain"\)\}/);
  assert.match(source, /onBlur=\{\(\) => markTouched\("customerQuestion"\)\}/);
  assert.match(source, /onBlur=\{\(\) => markTouched\("comparison"\)\}/);
  assert.match(source, /function handleSubmitClick\(\)/);
  assert.match(source, /setHasSubmitted\(true\)/);
  assert.match(source, /firstInvalidRef\?\.current\?\.focus\(\)/);
  assert.match(source, /const visibleError = Boolean\(error && showError && \(showErrorWhileFocused \|\| !isFocused\)\)/);
  assert.match(source, /showErrorWhileFocused=\{hasSubmitted\}/);
  assert.match(source, /className=\{`vn-field \$\{visibleError \? "has-error" : ""\}`\}/);
  assert.match(source, /aria-invalid=\{visibleError\}/);
  assert.match(source, /\{visibleError && <span id=\{errorId\} className="vn-field-error">\{error\}<\/span>\}/);
  assert.doesNotMatch(source, /disabled=\{!isValid\}/);
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

test("diagnosis v2 survey skips ad dependency and adds industry branch questions", () => {
  const source = diagnosisSource();

  assert.match(source, /id: "ad_dependency"/);
  assert.match(source, /showIf: \(answers\) => answerString\(answers, "ads"\) !== "none"/);
  assert.match(source, /function getBranchContentQuestion\(industry: IndustryKey \| null\): Question \| null/);
  assert.match(source, /professional_edu/);
  assert.match(source, /fnb_retail/);
  assert.match(source, /b2b_industrial/);
  assert.doesNotMatch(source, /getWebsiteOptions/);
  assert.doesNotMatch(source, /OWN_SITE_WEBSITE_VALUES/);
  assert.doesNotMatch(source, /NO_SITE_WEBSITE_VALUES/);
});

test("diagnosis stores recent history and compares previous result", () => {
  const source = diagnosisSource();

  assert.match(source, /type DiagnosisRecord = \{/);
  assert.match(source, /type DiagnosisHistory = DiagnosisRecord\[\]/);
  assert.match(source, /localStorage\.getItem\("velnoc:diagnosisHistory"\)/);
  assert.match(source, /localStorage\.setItem\("velnoc:diagnosisHistory", JSON\.stringify\(updated\)\)/);
  assert.match(source, /\[\.\.\.history, record\]\.slice\(-5\)/);
  assert.match(source, /industry: answerIndustry\(answers\)/);
  assert.match(source, /const prevRecord = useMemo<DiagnosisRecord \| null>/);
  assert.match(source, /history\.filter\(\(r\) => r\.date !== today\)\.at\(-1\)/);
  assert.match(source, /지난 진단 \(\{prevRecord\.date\}\) 대비/);
  assert.match(source, /gradeDelta > 0/);
  assert.match(source, /gradeDelta < 0/);
  assert.match(source, /gradeDelta === 0/);
  assert.match(source, /function getDaysSinceLastDiagnosis\(\): number \| null/);
  assert.match(source, /마지막 진단에서 \{days\}일이 지났습니다/);
});

test("diagnosis result can be shared and loaded from a URL param", () => {
  const source = diagnosisSource();
  const pageSource = diagnosisPageSource();

  assert.match(source, /useSearchParams/);
  assert.match(source, /type ShareableResult = \{/);
  assert.match(source, /function encodeResult\(result: ScoreResult, industry: IndustryKey \| null\): string/);
  assert.match(source, /function decodeResult\(encoded: string\): \{ result: Partial<ScoreResult>; industry: string \} \| null/);
  assert.match(source, /function buildShareUrl\(result: ScoreResult, industry: IndustryKey \| null\): string/);
  assert.match(source, /return `\$\{window\.location\.origin\}\/tools\/diagnosis\?result=\$\{encoded\}`/);
  assert.match(source, /const sharedPayload = useMemo\(\(\) => \{/);
  assert.match(source, /const \[sharedResult, setSharedResult\] = useState<ScoreResult \| null>\(\(\) => sharedPayload\?\.result \?\? null\)/);
  assert.match(source, /const calculatedResult = useMemo\(\(\) => calcScore\(answers\), \[answers\]\)/);
  assert.match(source, /const result = sharedResult \?\? calculatedResult/);
  assert.match(source, /const encoded = searchParams\.get\("result"\)/);
  assert.match(source, /result: decoded\.result as ScoreResult/);
  assert.match(source, /useState<"intro" \| "industry" \| "domain" \| "survey" \| "result">\(\(\) => \(sharedPayload \? "result" : "intro"\)\)/);
  assert.match(source, /function ShareButton\(\{ result, industry \}: \{ result: ScoreResult; industry: IndustryKey \| null \}\)/);
  assert.match(source, /navigator\.clipboard\.writeText\(url\)/);
  assert.match(source, /결과 링크 공유하기/);
  assert.match(source, /링크 복사됨 ✓/);
  assert.match(source, /<ShareButton result=\{result\} industry=\{industry\} \/>/);
  assert.match(pageSource, /Suspense/);
  assert.match(pageSource, /<Suspense/);
});
