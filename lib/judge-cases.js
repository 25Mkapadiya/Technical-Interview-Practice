(function () {
  'use strict';

  const suites = [
    {
      re: /count all digits|count digits/i,
      input: 'One non-negative integer n.', output: 'Print the number of decimal digits in n.',
      tests: [['Zero', '0', '1'], ['Basic', '12345', '5'], ['Power of ten', '100000', '6']]
    },
    {
      re: /reverse a number|reverse integer/i,
      input: 'One integer n.', output: 'Print n with its decimal digits reversed. Preserve a leading minus sign and discard leading zeroes in the reversed magnitude.',
      tests: [['Basic', '12345', '54321'], ['Trailing zeroes', '1200', '21'], ['Negative', '-507', '-705']]
    },
    {
      re: /palindrome number/i,
      input: 'One integer n.', output: 'Print true if n reads the same forward and backward, otherwise false.',
      tests: [b('Positive', '121', 'true'), b('Negative', '-121', 'false'), b('Single digit', '7', 'true')]
    },
    {
      re: /gcd of two numbers|greatest common divisor/i,
      input: 'Two integers a and b on one line.', output: 'Print gcd(a, b) as a non-negative integer.',
      tests: [['Common factor', '48 18', '6'], ['Coprime', '17 13', '1'], ['Includes zero', '0 9', '9']]
    },
    {
      re: /check for prime|prime number/i,
      input: 'One integer n.', output: 'Print true if n is prime, otherwise false.',
      tests: [b('Prime', '29', 'true'), b('Composite', '35', 'false'), b('One', '1', 'false'), b('Two', '2', 'true')]
    },
    {
      re: /largest.*element.*array|largest element/i,
      input: 'First line n. Second line: n integers.', output: 'Print the maximum element.',
      tests: [['Mixed', '5\n2 5 1 8 3', '8'], ['All negative', '4\n-9 -2 -7 -4', '-2'], ['Single', '1\n42', '42'], ['Duplicates', '5\n7 7 7 7 7', '7']]
    },
    {
      re: /second.*largest/i,
      input: 'First line n. Second line: n integers. There are at least two distinct values.', output: 'Print the second distinct largest value.',
      tests: [['Duplicates at max', '5\n1 2 4 7 7', '4'], ['Negative', '4\n-5 -1 -3 -2', '-2'], ['Two values', '4\n3 3 1 1', '1']]
    },
    {
      re: /check if.*array.*sorted|check.*sorted/i,
      input: 'First line n. Second line: n integers.', output: 'Print true if the array is non-decreasing, otherwise false.',
      tests: [b('Sorted', '5\n1 2 2 4 9', 'true'), b('Not sorted', '4\n1 3 2 4', 'false'), b('Single', '1\n8', 'true')]
    },
    {
      re: /move.*zero/i,
      input: 'First line n. Second line: n integers.', output: 'Print the transformed array with non-zero values in original order followed by zeroes, separated by spaces.',
      tests: [t('Mixed', '5\n0 1 0 3 12', '1 3 12 0 0'), t('No zero', '3\n1 2 3', '1 2 3'), t('All zero', '4\n0 0 0 0', '0 0 0 0'), t('Leading/trailing', '6\n0 4 0 0 2 0', '4 2 0 0 0 0')]
    },
    {
      re: /linear search/i,
      input: 'First line n. Second line: n integers. Third line: target.', output: 'Print the first zero-based index of target, or -1 when absent.',
      tests: [['Found', '5\n4 2 7 2 9\n7', '2'], ['First duplicate', '5\n4 2 7 2 9\n2', '1'], ['Missing', '3\n5 6 7\n2', '-1']]
    },
    {
      re: /missing number/i,
      input: 'First line N. Second line contains N-1 distinct integers from 1 through N with exactly one value missing.', output: 'Print the missing value.',
      tests: [['Middle', '5\n1 2 4 5', '3'], ['First', '4\n2 3 4', '1'], ['Last', '4\n1 2 3', '4']]
    },
    {
      re: /maximum consecutive ones|max.*consecutive.*1/i,
      input: 'First line n. Second line: a binary array of n values.', output: 'Print the longest run of consecutive 1 values.',
      tests: [['Mixed', '6\n1 1 0 1 1 1', '3'], ['No ones', '4\n0 0 0 0', '0'], ['All ones', '5\n1 1 1 1 1', '5']]
    },
    {
      re: /number that appears once|single number/i,
      input: 'First line n. Second line: n integers where exactly one value occurs once and every other value occurs twice.', output: 'Print the value that occurs once.',
      tests: [['Basic', '5\n4 1 2 1 2', '4'], ['Negative', '5\n-2 7 -2 5 5', '7'], ['Single', '1\n99', '99']]
    },
    {
      re: /two sum|2 sum/i,
      input: 'First line n. Second line: n integers. Third line: target. Exactly one valid pair exists.', output: 'Print the two zero-based indices separated by spaces. Either index order is accepted.',
      tests: [u('Basic', '4\n2 7 11 15\n9', '0 1'), u('Later pair', '5\n3 2 4 8 1\n6', '1 2'), u('Negative', '4\n-3 4 3 90\n0', '0 2')]
    },
    {
      re: /sort.*0.*1.*2|sort colors|dutch/i,
      input: 'First line n. Second line contains only 0, 1, and 2.', output: 'Print the sorted values separated by spaces.',
      tests: [t('Mixed', '6\n2 0 2 1 1 0', '0 0 1 1 2 2'), t('Already sorted', '5\n0 0 1 2 2', '0 0 1 2 2'), t('Single kind', '4\n2 2 2 2', '2 2 2 2')]
    },
    {
      re: /majority element/i,
      input: 'First line n. Second line: n integers. A value occurring more than floor(n/2) times is guaranteed.', output: 'Print the majority value.',
      tests: [['Basic', '7\n2 2 1 1 1 2 2', '2'], ['All same', '4\n5 5 5 5', '5'], ['Negative', '5\n-1 2 -1 -1 3', '-1']]
    },
    {
      re: /kadane|maximum subarray/i,
      input: 'First line n. Second line: n integers.', output: 'Print the maximum sum over all non-empty contiguous subarrays.',
      tests: [['Classic', '9\n-2 1 -3 4 -1 2 1 -5 4', '6'], ['All negative', '3\n-8 -2 -5', '-2'], ['All positive', '4\n1 2 3 4', '10'], ['Single', '1\n-7', '-7']]
    },
    {
      re: /best time.*stock|stock.*buy.*sell/i,
      input: 'First line n. Second line: daily prices. You may make at most one buy followed by one sell.', output: 'Print the maximum profit; print 0 if no profit is possible.',
      tests: [['Profit', '6\n7 1 5 3 6 4', '5'], ['Descending', '5\n7 6 4 3 1', '0'], ['Two days', '2\n1 9', '8']]
    },
    {
      re: /longest consecutive/i,
      input: 'First line n. Second line: n unsorted integers.', output: 'Print the length of the longest sequence of consecutive integer values.',
      tests: [['Classic', '6\n100 4 200 1 3 2', '4'], ['Duplicates', '9\n0 3 7 2 5 8 4 6 0', '9'], ['Single', '1\n10', '1']]
    },
    {
      re: /^binary search$|binary search.*find|search in sorted/i,
      input: 'First line n. Second line: n integers sorted ascending. Third line: target.', output: 'Print the zero-based index of target, or -1 when absent.',
      tests: [['Found', '6\n1 3 5 7 9 11\n7', '3'], ['Missing', '4\n2 4 6 8\n5', '-1'], ['Boundary', '5\n1 2 3 4 5\n1', '0']]
    },
    {
      re: /lower bound/i,
      input: 'First line n. Second line: sorted integers. Third line: target.', output: 'Print the first zero-based index i where a[i] >= target; print n if no such index exists.',
      tests: [['Inside', '5\n1 2 4 4 7\n4', '2'], ['Between', '5\n1 2 4 4 7\n3', '2'], ['Past end', '3\n1 2 3\n9', '3']]
    },
    {
      re: /upper bound/i,
      input: 'First line n. Second line: sorted integers. Third line: target.', output: 'Print the first zero-based index i where a[i] > target; print n if no such index exists.',
      tests: [['Duplicates', '5\n1 2 4 4 7\n4', '4'], ['Before all', '3\n2 3 4\n1', '0'], ['Past end', '3\n1 2 3\n3', '3']]
    },
    {
      re: /search insert position/i,
      input: 'First line n. Second line: sorted distinct integers. Third line: target.', output: 'Print the index where target exists or should be inserted to preserve sorted order.',
      tests: [['Found', '4\n1 3 5 6\n5', '2'], ['Middle insertion', '4\n1 3 5 6\n2', '1'], ['End', '4\n1 3 5 6\n7', '4']]
    },
    {
      re: /square root|sqrt/i,
      input: 'One non-negative integer n.', output: 'Print floor(sqrt(n)).',
      tests: [['Perfect square', '81', '9'], ['Floor', '27', '5'], ['Zero', '0', '0'], ['One', '1', '1']]
    },
    {
      re: /balanced parenth|valid parenth/i,
      input: 'One line containing only (), [], and {} bracket characters.', output: 'Print true when the bracket sequence is valid, otherwise false.',
      tests: [b('Valid mixed', '()[]{}', 'true'), b('Nested', '{[()]}', 'true'), b('Crossed', '([)]', 'false'), b('Unclosed', '(((', 'false')]
    },
    {
      re: /longest substring.*without repeating/i,
      input: 'One line containing a string.', output: 'Print the length of the longest substring with no repeated character.',
      tests: [['Classic', 'abcabcbb', '3'], ['Repeated', 'bbbbb', '1'], ['Mixed', 'pwwkew', '3'], ['Empty', '', '0']]
    },
    {
      re: /kth.*largest/i,
      input: 'First line n. Second line: n integers. Third line: k (1 means largest).', output: 'Print the kth largest value.',
      tests: [['Basic', '6\n3 2 1 5 6 4\n2', '5'], ['Duplicates', '9\n3 2 3 1 2 4 5 5 6\n4', '4'], ['First', '3\n8 1 7\n1', '8']]
    },
    {
      re: /climbing stairs/i,
      input: 'One integer n >= 0. You can climb 1 or 2 steps at a time.', output: 'Print the number of distinct ways to reach exactly step n. Treat n=0 as one empty way.',
      tests: [['Zero', '0', '1'], ['Two', '2', '2'], ['Five', '5', '8'], ['Ten', '10', '89']]
    },
    {
      re: /house robber/i,
      input: 'First line n. Second line: non-negative money values. Adjacent houses cannot both be robbed.', output: 'Print the maximum obtainable sum.',
      tests: [['Basic', '4\n1 2 3 1', '4'], ['Choice', '5\n2 7 9 3 1', '12'], ['Single', '1\n9', '9'], ['Empty', '0\n', '0']]
    },
    {
      re: /unique paths/i,
      input: 'Two positive integers m and n: grid rows and columns. Move only right or down.', output: 'Print the number of paths from top-left to bottom-right.',
      tests: [['3x7', '3 7', '28'], ['3x2', '3 2', '3'], ['Single cell', '1 1', '1']]
    },
    {
      re: /longest common subsequence|\blcs\b/i,
      input: 'Two lines, each containing one string.', output: 'Print the length of their longest common subsequence.',
      tests: [['Basic', 'abcde\nace', '3'], ['None', 'abc\ndef', '0'], ['Equal', 'algorithm\nalgorithm', '9']]
    },
    {
      re: /edit distance/i,
      input: 'Two lines containing source and target strings.', output: 'Print the minimum number of insertions, deletions, and replacements required.',
      tests: [['Horse', 'horse\nros', '3'], ['Intention', 'intention\nexecution', '5'], ['Equal', 'abc\nabc', '0'], ['Empty source', '\nabc', '3']]
    },
    {
      re: /longest increasing subsequence|\blis\b/i,
      input: 'First line n. Second line: n integers.', output: 'Print the length of the longest strictly increasing subsequence.',
      tests: [['Classic', '8\n10 9 2 5 3 7 101 18', '4'], ['Descending', '5\n5 4 3 2 1', '1'], ['Duplicates', '7\n0 1 0 3 2 3 4', '5']]
    },
    {
      re: /number of islands/i,
      input: 'First line: rows columns. Next rows lines contain 0/1 values without spaces. Connectivity is 4-directional.', output: 'Print the number of islands.',
      tests: [['One island', '4 5\n11110\n11010\n11000\n00000', '1'], ['Three islands', '4 5\n11000\n11000\n00100\n00011', '3'], ['Water', '2 3\n000\n000', '0']]
    },
    {
      re: /^selection sort$/i,
      input: 'First line n. Second line: n integers.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Reverse sorted', '5\n9 7 5 3 1', '1 3 5 7 9'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /^bubble sort$/i,
      input: 'First line n. Second line: n integers.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Already sorted', '5\n1 2 3 4 5', '1 2 3 4 5'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /^insertion sorting$/i,
      input: 'First line n. Second line: n integers.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Reverse sorted', '5\n9 7 5 3 1', '1 3 5 7 9'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /^merge sorting$/i,
      input: 'First line n. Second line: n integers.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Reverse sorted', '5\n9 7 5 3 1', '1 3 5 7 9'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /^recursive bubble sort$/i,
      input: 'First line n. Second line: n integers. Sort using a recursive bubble-sort formulation.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Already sorted', '5\n1 2 3 4 5', '1 2 3 4 5'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /^recursive insertion sort$/i,
      input: 'First line n. Second line: n integers. Sort using a recursive insertion-sort formulation.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Reverse sorted', '5\n9 7 5 3 1', '1 3 5 7 9'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /^quick sorting$/i,
      input: 'First line n. Second line: n integers.', output: 'Print the values sorted ascending, separated by spaces.',
      tests: [['Mixed', '5\n64 25 12 22 11', '11 12 22 25 64'], ['Reverse sorted', '5\n9 7 5 3 1', '1 3 5 7 9'], ['Duplicates', '5\n4 2 4 1 2', '1 2 2 4 4'], ['Single', '1\n42', '42']]
    },
    {
      re: /armstrong/i,
      input: 'One non-negative integer n.', output: 'Print true if n equals the sum of its own digits each raised to the power of the digit count, otherwise false.',
      tests: [b('153 is Armstrong', '153', 'true'), b('Not Armstrong', '123', 'false'), b('Single digit', '5', 'true'), b('9474 is Armstrong', '9474', 'true')]
    },
    {
      re: /print all divisors/i,
      input: 'One positive integer n.', output: 'Print every divisor of n in ascending order, separated by spaces.',
      tests: [t('36', '36', '1 2 3 4 6 9 12 18 36'), t('Prime', '13', '1 13'), t('One', '1', '1')]
    },
    {
      re: /print 1 to n/i,
      input: 'One non-negative integer n.', output: 'Print 1 through n in increasing order, separated by spaces.',
      tests: [t('Five', '5', '1 2 3 4 5'), t('One', '1', '1')]
    },
    {
      re: /print n to 1/i,
      input: 'One non-negative integer n.', output: 'Print n down to 1 in decreasing order, separated by spaces.',
      tests: [t('Five', '5', '5 4 3 2 1'), t('One', '1', '1')]
    },
    {
      re: /sum of first n numbers/i,
      input: 'One non-negative integer n.', output: 'Print the sum 1 + 2 + ... + n. Print 0 when n is 0.',
      tests: [['Ten', '10', '55'], ['One', '1', '1'], ['Zero', '0', '0']]
    },
    {
      re: /factorial of a given number/i,
      input: 'One non-negative integer n.', output: 'Print n factorial. Print 1 when n is 0.',
      tests: [['Five', '5', '120'], ['Zero', '0', '1'], ['One', '1', '1'], ['Seven', '7', '5040']]
    },
    {
      re: /reverse an array/i,
      input: 'First line n. Second line: n integers.', output: 'Print the array reversed, separated by spaces.',
      tests: [t('Basic', '5\n1 2 3 4 5', '5 4 3 2 1'), t('Single', '1\n9', '9'), t('Two', '2\n7 3', '3 7')]
    },
    {
      re: /check if string is palindrome/i,
      input: 'One line containing a string.', output: 'Print true if the string reads the same forward and backward, otherwise false.',
      tests: [b('Palindrome', 'madam', 'true'), b('Not palindrome', 'hello', 'false'), b('Single char', 'a', 'true')]
    },
    {
      re: /fibonacci/i,
      input: 'One non-negative integer n (0-indexed, fib(0)=0, fib(1)=1).', output: 'Print the nth Fibonacci number.',
      tests: [['Zero', '0', '0'], ['One', '1', '1'], ['Two', '2', '1'], ['Ten', '10', '55']]
    },
    {
      re: /counting frequencies of array elements|counting frequencies/i,
      input: 'First line n. Second line: n integers.', output: 'Print each distinct value that appears, ascending by value, as value:count pairs separated by spaces.',
      tests: [['Basic', '6\n1 2 2 3 3 3', '1:1 2:2 3:3'], ['All unique', '3\n5 6 7', '5:1 6:1 7:1'], ['Single', '1\n4', '4:1']]
    },
    {
      re: /highest occurring element/i,
      input: 'First line n. Second line: n integers.', output: 'Print the value with the highest frequency. If several values tie for the highest frequency, print whichever of them reaches that count first while scanning left to right.',
      tests: [['Basic', '6\n1 3 2 3 4 3', '3'], ['Tie, first wins', '4\n1 1 2 2', '1'], ['Single', '1\n9', '9']]
    }
  ];

  function b(name, stdin, expected) { return [name, stdin, expected, 'boolean']; }
  function t(name, stdin, expected) { return [name, stdin, expected, 'tokens']; }
  function u(name, stdin, expected) { return [name, stdin, expected, 'unorderedTokens']; }

  function toTest(row, index) {
    const [name, stdin, expected, compare] = row;
    return { name, stdin, expected, compare: compare || 'exact', hidden: index > 0 };
  }

  function find(problem) {
    return suites.find((suite) => suite.re.test(problem?.title || '')) || null;
  }

  function attach(problem) {
    const suite = find(problem);
    if (!suite) return problem;
    return {
      ...problem,
      inputFormat: suite.input,
      outputFormat: suite.output,
      tests: suite.tests.map(toTest),
      validationCoverage: 'curated',
      judgeNote: `Validated local contract with ${suite.tests.length} cases.`
    };
  }

  function audit() {
    const issues = [];
    for (const suite of suites) {
      if (!(suite.re instanceof RegExp)) issues.push('suite missing RegExp');
      if (!suite.input || !suite.output) issues.push(`${suite.re}: missing contract`);
      if (!Array.isArray(suite.tests) || suite.tests.length < 2) issues.push(`${suite.re}: fewer than two tests`);
      for (const test of suite.tests || []) {
        if (!Array.isArray(test) || test.length < 3) issues.push(`${suite.re}: malformed test`);
        if (typeof test?.[1] !== 'string' || typeof test?.[2] !== 'string') issues.push(`${suite.re}: input/expected must be strings`);
      }
    }
    return { suiteCount: suites.length, testCount: suites.reduce((n, s) => n + s.tests.length, 0), issues };
  }

  const originalEnrich = window.ProblemEngine?.enrich;
  if (originalEnrich) {
    window.ProblemEngine.enrich = function enhancedEnrich(problem) {
      return attach(originalEnrich(problem));
    };
  }

  window.JudgeCases = { find, attach, audit };
})();
