import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), 'utf8');

globalThis.window = {};
globalThis.performance ??= { now: () => Date.now() };

for (const file of ['lib/problem-engine.js', 'lib/solution-engine.js', 'lib/judge-cases.js', 'lib/problem-context.js', 'lib/runner.js']) {
  vm.runInThisContext(read(file), { filename: file });
}

assert.ok(window.ProblemEngine, 'ProblemEngine did not initialize');
assert.ok(window.SolutionEngine, 'SolutionEngine did not initialize');
assert.ok(window.JudgeCases, 'JudgeCases did not initialize');
assert.ok(window.InterviewLabContext, 'InterviewLabContext did not initialize');
assert.ok(window.Runner, 'Runner did not initialize');

const judgeAudit = window.JudgeCases.audit();
assert.deepEqual(judgeAudit.issues, [], `Judge suite issues: ${judgeAudit.issues.join('; ')}`);
assert.ok(judgeAudit.suiteCount >= 30, `Expected at least 30 curated judge suites, got ${judgeAudit.suiteCount}`);
assert.ok(judgeAudit.testCount >= 90, `Expected at least 90 curated judge cases, got ${judgeAudit.testCount}`);

assert.equal(window.Runner.outputsMatch('True\n', { expected: 'true', compare: 'boolean' }), true, 'Boolean comparison should be case-insensitive');
assert.equal(window.Runner.outputsMatch('[1, 2, 3]', { expected: '1 2 3', compare: 'tokens' }), true, 'Token comparison should ignore common list punctuation');
assert.equal(window.Runner.outputsMatch('2 0', { expected: '0 2', compare: 'unorderedTokens' }), true, 'Unordered token comparison should accept either pair order');
assert.equal(window.Runner.outputsMatch('5', { expected: '4', compare: 'exact' }), false, 'Exact comparison accepted a wrong answer');

const seedUrl = 'https://raw.githubusercontent.com/septilex/a2z-tracker/main/dsa_tracker/a2z_problems_simple.json';
const response = await fetch(seedUrl);
assert.equal(response.ok, true, `Could not load verified A2Z seed: HTTP ${response.status}`);
const rows = await response.json();
assert.equal(rows.length, 474, `Expected 474 A2Z seed problems, got ${rows.length}`);

let curated = 0;
let specificSolutions = 0;
const explanationFailures = [];
const testFailures = [];

for (const [index, row] of rows.entries()) {
  const base = {
    id: `qa-${index + 1}`,
    order: index + 1,
    title: row.problem_name,
    topic: row.topic,
    difficulty: row.difficulty,
    sourceUrl: row.leetcode_url || 'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z'
  };
  const problem = window.ProblemEngine.enrich(base);
  const solution = window.SolutionEngine.explain(problem);

  assert.equal(window.InterviewLabContext.currentProblem?.title, problem.title, 'Current problem context did not track enriched problem');
  if (problem.validationCoverage === 'curated') curated += 1;
  if (solution.level === 'problem-specific') specificSolutions += 1;

  const required = [solution.intuition, solution.bruteForce, solution.pseudocode, solution.time, solution.space];
  if (required.some((value) => !String(value || '').trim()) || !Array.isArray(solution.optimalSteps) || solution.optimalSteps.length < 3) {
    explanationFailures.push(row.problem_name);
  }

  for (const test of problem.tests || []) {
    if (!test.name || typeof test.stdin !== 'string' || typeof test.expected !== 'string') testFailures.push(`${row.problem_name}: malformed test`);
    if (!['exact', 'boolean', 'tokens', 'unorderedTokens'].includes(test.compare || 'exact')) testFailures.push(`${row.problem_name}: unknown comparator ${test.compare}`);
  }
}

assert.deepEqual(explanationFailures, [], `Problems missing usable explanations: ${explanationFailures.slice(0, 10).join(', ')}`);
assert.deepEqual(testFailures, [], `Malformed problem tests: ${testFailures.slice(0, 10).join(', ')}`);
assert.ok(curated >= 15, `Expected curated judges to attach to at least 15 A2Z entries; got ${curated}`);
assert.ok(specificSolutions >= 10, `Expected at least 10 problem-specific solution explanations; got ${specificSolutions}`);

const index = read('index.html');
for (const script of ['lib/problem-engine.js', 'lib/solution-engine.js', 'lib/judge-cases.js', 'lib/problem-context.js', 'lib/runner.js', 'lib/complexity.js', 'app.js', 'lib/ui-enhancements.js']) {
  assert.ok(index.includes(script), `index.html is missing ${script}`);
}

console.log(JSON.stringify({
  a2zProblems: rows.length,
  curatedProblemMatches: curated,
  problemSpecificSolutions: specificSolutions,
  judgeSuites: judgeAudit.suiteCount,
  judgeCases: judgeAudit.testCount,
  status: 'ok'
}, null, 2));
