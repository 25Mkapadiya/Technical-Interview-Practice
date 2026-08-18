import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const baseUrl = process.env.INTERVIEW_LAB_URL || 'http://127.0.0.1:8000';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const pageErrors = [];

page.on('pageerror', (error) => pageErrors.push(`pageerror: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') pageErrors.push(`console: ${message.text()}`);
});

async function library() {
  if (await page.locator('.workspace').count()) await page.locator('[data-action="back-problems"]').click();
  await page.getByRole('heading', { name: 'All A2Z problems' }).waitFor({ timeout: 15_000 });
}

async function openByTitle(searchText, predicateSource) {
  await library();
  const search = page.locator('#searchProblems');
  await search.fill(searchText);
  await page.waitForTimeout(250);
  assert.equal(await search.evaluate((node) => document.activeElement === node), true, 'Problem search lost keyboard focus after filtering');
  const selected = await page.evaluate((source) => {
    const predicate = new Function('title', `return (${source})(title)`);
    const rows = [...document.querySelectorAll('.problem-row[data-problem-id]')];
    const row = rows.find((candidate) => predicate((candidate.querySelector('.problem-title')?.textContent || '').trim().toLowerCase()));
    if (!row) return '';
    const title = (row.querySelector('.problem-title')?.textContent || '').trim();
    row.click();
    return title;
  }, predicateSource);
  assert.ok(selected, `Could not select problem for ${searchText}`);
  await page.locator('.workspace').waitFor({ timeout: 15_000 });
  await page.waitForFunction(() => window.InterviewLabContext?.currentProblem?.title, null, { timeout: 15_000 });
  return selected;
}

async function setCode(code) {
  await page.waitForFunction(() => window.monaco && window.monaco.editor.getModels().length > 0, null, { timeout: 30_000 });
  await page.evaluate((value) => window.monaco.editor.getModels()[0].setValue(value), code);
}

async function submitAndWait(expectedClass, timeout = 70_000) {
  await page.getByRole('button', { name: 'Submit' }).click();
  const status = page.locator(`.result-status.${expectedClass}`);
  await status.waitFor({ timeout });
  return page.locator('.result-head').innerText();
}

try {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.getByRole('heading', { name: /Learn the pattern\. Write the code\. Prove it works\./i }).waitFor({ timeout: 30_000 });
  await page.getByRole('button', { name: 'Browse problems' }).click();
  await page.getByRole('heading', { name: 'All A2Z problems' }).waitFor();
  await page.waitForFunction(() => document.querySelectorAll('.problem-row[data-problem-id]').length === 474, null, { timeout: 30_000 });
  assert.equal(await page.locator('.problem-row[data-problem-id]').count(), 474);

  // Human simulation 1: open a problem, read the local statement, submit a wrong answer, then correct it.
  const largestTitle = await openByTitle('Largest Element', `(title) => title.includes('largest element') && !title.includes('second') && !title.includes('kth') && !title.includes('k-th')`);
  const description = await page.locator('#leftContent').innerText();
  assert.match(description, /Constraints & assumptions/i, 'Self-contained constraints were not rendered');
  assert.match(description, /Edge cases to think through/i, 'Self-contained edge cases were not rendered');
  assert.match(description, /Interview Lab practice contract/i, 'Local practice contract was not rendered');
  assert.doesNotMatch(description, /Canonical source|Open ↗/i, 'Description still depends on a canonical-source link');

  await page.locator('[data-solution-tab]').waitFor({ timeout: 10_000 });
  await page.locator('[data-solution-tab]').click();
  await page.getByRole('heading', { name: 'Intuition' }).waitFor();
  await page.getByRole('heading', { name: 'Optimal approach' }).waitFor();
  await page.getByRole('heading', { name: 'Pseudocode' }).waitFor();
  assert.match(await page.locator('#leftContent').innerText(), /single pass|best value|maximum/i);

  await page.getByRole('button', { name: 'Testcase' }).click();
  const hiddenCases = page.locator('.case-chip.hidden-case-chip');
  assert.ok(await hiddenCases.count() >= 2);
  assert.equal(await hiddenCases.first().isDisabled(), true);

  await setCode(`import sys\ndata = list(map(int, sys.stdin.read().split()))\nn = data[0]\na = data[1:1+n]\nprint(min(a))\n`);
  await submitAndWait('failed');
  assert.match(await page.locator('.result-head').innerText(), /Wrong Answer/i, 'A deliberately wrong solution was incorrectly accepted');

  await setCode(`import sys\ndata = list(map(int, sys.stdin.read().split()))\nn = data[0]\na = data[1:1+n]\nprint(max(a))\n`);
  const largestPass = await submitAndWait('accepted');
  assert.match(largestPass, /4\/4 passed/i, 'Correct Python solution did not pass all Largest Element hidden cases');

  // Human simulation 2: move to another problem and solve it in JavaScript.
  const secondTitle = await openByTitle('Second Largest', `(title) => title.includes('second') && title.includes('largest')`);
  const secondDescription = await page.locator('#leftContent').innerText();
  assert.match(secondDescription, /second-largest distinct|second distinct largest/i);
  assert.doesNotMatch(secondDescription, /Canonical source|Open ↗/i);

  await page.locator('#languageSelect').selectOption('javascript');
  await page.waitForTimeout(150);
  await setCode(`const nums = __INPUT__.trim().split(/\\s+/).map(Number);\nconst n = nums[0];\nconst a = nums.slice(1, 1 + n);\nlet first = -Infinity, second = -Infinity;\nfor (const x of a) {\n  if (x > first) { second = first; first = x; }\n  else if (x < first && x > second) second = x;\n}\nconsole.log(second);\n`);
  const secondPass = await submitAndWait('accepted', 20_000);
  assert.match(secondPass, /4\/4 passed/i, 'Correct JavaScript Second Largest solution did not pass all hidden cases');

  await page.locator('[data-solution-tab]').click();
  assert.match(await page.locator('#leftContent').innerText(), /second-largest|second maximum|distinct/i);
  await page.locator('.mode-toggle').click();
  await page.locator('[data-solution-tab]').click();
  await page.getByText('Solution hidden').waitFor();
  await page.locator('.mode-toggle').click();

  const seriousErrors = pageErrors.filter((message) => !/favicon|Failed to load resource.*404/i.test(message));
  assert.deepEqual(seriousErrors, [], `Browser errors detected:\n${seriousErrors.join('\n')}`);

  console.log(JSON.stringify({
    pageLoaded: true,
    problemCount: 474,
    selfContainedDescription: true,
    canonicalLinkRequired: false,
    humanSimulation: {
      firstProblem: largestTitle,
      wrongSubmissionRejected: true,
      pythonCorrectSubmission: '4/4',
      secondProblem: secondTitle,
      javascriptCorrectSubmission: '4/4'
    },
    solutionTab: true,
    hiddenCasesProtected: true,
    interviewModeSolutionLock: true,
    browserErrors: 0,
    status: 'ok'
  }, null, 2));
} finally {
  await browser.close();
}
