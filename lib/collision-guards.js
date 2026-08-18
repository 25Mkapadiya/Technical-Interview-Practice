(function () {
  'use strict';

  const originalEnrich = window.ProblemEngine?.enrich;
  const originalExplain = window.SolutionEngine?.explain;
  if (!originalEnrich || !originalExplain) return;

  const lower = (value) => String(value || '').toLowerCase();
  const test = (name, stdin, expected, hidden = true) => ({ name, stdin, expected, compare: 'exact', hidden });

  window.ProblemEngine.enrich = function collisionSafeEnrich(raw) {
    const problem = originalEnrich(raw);
    const title = lower(problem.title);

    if (/second.*largest/.test(title)) {
      return {
        ...problem,
        brief: 'Find the second distinct largest value in the array without sorting the entire array.',
        inputFormat: 'First line n. Second line: n integers. At least two distinct values are present.',
        outputFormat: 'Print the second distinct largest value.',
        tests: [
          test('Duplicates at max', '5\n1 2 4 7 7', '4', false),
          test('Negative values', '4\n-5 -1 -3 -2', '-2'),
          test('Two distinct values', '4\n3 3 1 1', '1'),
          test('Maximum first', '6\n10 2 9 3 10 8', '9')
        ],
        validationCoverage: 'curated',
        judgeNote: 'Explicit second-distinct-largest contract prevents collision with the generic largest-element judge.',
        guide: {
          ...(problem.guide || {}),
          pattern: 'Two best values',
          targetTime: 'O(n)',
          targetSpace: 'O(1)'
        }
      };
    }

    return problem;
  };

  window.SolutionEngine.explain = function collisionSafeExplain(problem) {
    const title = lower(problem?.title);

    if (/second.*largest/.test(title)) {
      return {
        level: 'problem-specific',
        intuition: 'Keep the largest and second-largest distinct values while scanning once. When a new maximum appears, the old maximum becomes the second maximum. Duplicate maximum values must not replace the second distinct value.',
        bruteForce: 'Sort the distinct values and take the second value from the end. This is correct but costs O(n log n) time and may require extra memory to deduplicate.',
        optimalSteps: [
          'Initialize largest and secondLargest below every possible input value.',
          'For each x, if x is greater than largest, move largest into secondLargest and set largest = x.',
          'Otherwise, if x is smaller than largest but greater than secondLargest, update secondLargest = x.',
          'Ignore values equal to largest because the answer must be distinct.',
          'Return secondLargest after the scan.'
        ],
        pseudocode: 'largest = -inf\nsecond = -inf\nfor x in a:\n    if x > largest:\n        second = largest\n        largest = x\n    elif largest > x > second:\n        second = x\nreturn second',
        time: 'O(n)',
        space: 'O(1)',
        verification: [
          'Test duplicate copies of the maximum value.',
          'Test all-negative input.',
          'Test exactly two distinct values.',
          'Confirm secondLargest is updated when a later value falls between the current top two.'
        ]
      };
    }

    return originalExplain(problem);
  };
})();
