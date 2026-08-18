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

try {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.getByRole('heading', { name: /Learn the pattern\. Write the code\. Prove it works\./i }).waitFor({ timeout: 30_000 });

  await page.getByRole('button', { name: 'Browse problems' }).click();
  await page.getByRole('heading', { name: 'All A2Z problems' }).waitFor();
  await page.waitForFunction(() => document.querySelectorAll('.problem-row[data-problem-id]').length === 474, null, { timeout: 30_000 });
  assert.equal(await page.locator('.problem-row[data-problem-id]').count(), 474, 'Problem library did not render all 474 A2Z entries');

  const search = page.locator('#searchProblems');
  await search.fill('Largest Element in an Array');
  await page.waitForTimeout(250);
  assert.equal(await search.evaluate((node) => document.activeElement === node), true, 'Problem search lost keyboard focus after filtering');

  const largestRow = page.locator('.problem-row[data-problem-id]').filter({ hasText: /Largest Element in an Array/i }).first();
  await largestRow.waitFor({ timeout: 10_000 });
  await largestRow.click();

  await page.locator('.workspace').waitFor();
  await page.locator('[data-solution-tab]').waitFor({ timeout: 10_000 });
  await page.locator('[data-solution-tab]').click();
  await page.getByRole('heading', { name: 'Intuition' }).waitFor();
  await page.getByRole('heading', { name: 'Optimal approach' }).waitFor();
  await page.getByRole('heading', { name: 'Pseudocode' }).waitFor();
  assert.match(await page.locator('#leftContent').innerText(), /single pass|best value|maximum/i, 'Largest-element solution explanation was not problem-specific');

  await page.getByRole('button', { name: 'Testcase' }).click();
  const hiddenCases = page.locator('.case-chip.hidden-case-chip');
  assert.ok(await hiddenCases.count() >= 2, 'Expected hidden judge cases to be present');
  assert.equal(await hiddenCases.first().isDisabled(), true, 'Hidden judge case was inspectable/clickable');

  await page.waitForFunction(() => window.monaco && window.monaco.editor.getModels().length > 0, null, { timeout: 30_000 });
  await page.evaluate(() => {
    const code = `import sys\ndata = list(map(int, sys.stdin.read().split()))\nn = data[0]\na = data[1:1+n]\nprint(max(a))\n`;
    window.monaco.editor.getModels()[0].setValue(code);
  });

  await page.getByRole('button', { name: 'Submit' }).click();
  await page.locator('.result-status.accepted').waitFor({ timeout: 70_000 });
  assert.match(await page.locator('.result-head').innerText(), /4\/4 passed/i, 'Python submission did not pass all curated largest-element cases');

  await page.locator('#languageSelect').selectOption('javascript');
  await page.waitForTimeout(150);
  await page.evaluate(() => {
    const code = `const nums = __INPUT__.trim().split(/\\s+/).map(Number);\nconst n = nums[0];\nconsole.log(Math.max(...nums.slice(1, 1 + n)));\n`;
    window.monaco.editor.getModels()[0].setValue(code);
  });
  await page.getByRole('button', { name: 'Testcase' }).click();
  await page.getByRole('button', { name: 'Run' }).click();
  await page.locator('.result-status.accepted').waitFor({ timeout: 15_000 });
  assert.match(await page.locator('.result-body').innerText(), /Output:\s*8/i, 'JavaScript execution did not return the expected visible-case output');

  await page.locator('.mode-toggle').click();
  await page.locator('[data-solution-tab]').click();
  await page.getByText('Solution hidden').waitFor();
  await page.locator('.mode-toggle').click();

  const seriousErrors = pageErrors.filter((message) => !/favicon|Failed to load resource.*404/i.test(message));
  assert.deepEqual(seriousErrors, [], `Browser errors detected:\n${seriousErrors.join('\n')}`);

  console.log(JSON.stringify({
    pageLoaded: true,
    problemCount: 474,
    solutionTab: true,
    hiddenCasesProtected: true,
    pythonSubmit: '4/4',
    javascriptRun: 'ok',
    interviewModeSolutionLock: true,
    browserErrors: 0,
    status: 'ok'
  }, null, 2));
} finally {
  await browser.close();
}
