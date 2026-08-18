(function () {
  'use strict';

  const originalEnrich = window.ProblemEngine?.enrich;
  if (!originalEnrich) return;

  const lower = (value) => String(value || '').toLowerCase();

  const topicContracts = [
    { test: /array|sorting/, constraints: ['Treat n as potentially large enough that unnecessary O(n²) work may time out.', 'Do not assume values are positive unless the problem statement says so.', 'Consider duplicates, a single element, already-sorted input, reverse-sorted input, and extreme values.'], edgeCases: ['Minimum-size input', 'All values equal', 'Duplicates around the answer', 'Negative values where allowed', 'Already optimal / already sorted input'] },
    { test: /binary search/, constraints: ['Use monotonic or sorted structure only when the problem guarantees it.', 'Be precise about inclusive vs half-open boundaries.', 'Compute mid in a way that is safe in fixed-width integer languages.'], edgeCases: ['Target at first/last position', 'Target absent', 'Duplicate targets', 'Single-element search space', 'Answer at the extreme boundary'] },
    { test: /string/, constraints: ['Treat strings as potentially long.', 'Do not assume lowercase-only input unless stated by the problem.', 'Be explicit about whether spaces, punctuation, or case matter.'], edgeCases: ['Empty or one-character string when allowed', 'All characters equal', 'All characters distinct', 'Repeated pattern', 'Answer touches the first or last character'] },
    { test: /linked/, constraints: ['Preserve node connectivity and avoid losing the rest of the list while rewiring pointers.', 'Use O(1) auxiliary memory when the intended solution is pointer-based.', 'Handle null heads and one-node lists where the source problem permits them.'], edgeCases: ['Empty list', 'Single node', 'Two nodes', 'Cycle or intersection boundary where applicable', 'Operation affects the head/tail'] },
    { test: /tree|bst/, constraints: ['A skewed tree can have height n, so recursive depth may be O(n).', 'Do not assume the tree is balanced unless stated.', 'For BST problems, use the ordering invariant only when the structure is guaranteed to be a BST.'], edgeCases: ['Empty tree', 'Single node', 'Completely skewed tree', 'Perfectly balanced tree', 'Answer is the root or a leaf'] },
    { test: /graph/, constraints: ['Graphs may be disconnected unless stated otherwise.', 'Avoid revisiting vertices; track visited/state explicitly.', 'Choose BFS, DFS, Dijkstra, topological order, DSU, or another graph tool based on edge weights and the exact invariant.'], edgeCases: ['Disconnected graph', 'Single vertex', 'Cycle', 'Multiple valid paths', 'Duplicate/parallel edges when allowed'] },
    { test: /dynamic/, constraints: ['Define the DP state before writing transitions.', 'Check whether dimensions can be compressed without destroying dependencies.', 'Use a numeric type large enough for counts/sums when required.'], edgeCases: ['Base state only', 'Choice always taken', 'Choice never taken', 'Ties between alternatives', 'Maximum state dimensions'] },
    { test: /heap/, constraints: ['Keep only the information the heap must represent.', 'Remember heap operations are logarithmic in heap size.', 'Duplicates may be significant.'], edgeCases: ['k = 1', 'k = n', 'Duplicates around kth boundary', 'Already ordered data', 'Negative values'] },
    { test: /stack|queue/, constraints: ['Be explicit about LIFO vs FIFO behavior.', 'Never pop/dequeue without checking whether the structure can be empty.', 'For monotonic structures, define exactly what order the stack/queue maintains.'], edgeCases: ['Empty structure transition', 'All increasing', 'All decreasing', 'Repeated values', 'Answer remains in the structure until the end'] },
    { test: /sliding|two pointer/, constraints: ['State what invariant makes the current window valid.', 'Move each pointer monotonically when targeting O(n).', 'Know whether negative values break a sum-based shrinking rule.'], edgeCases: ['Window length 1', 'Whole input is the answer', 'No valid window', 'Repeated values', 'Validity changes at both ends'] },
    { test: /recursion/, constraints: ['Identify the base case before the recursive choice.', 'Backtracking must undo mutable state before returning.', 'Watch exponential branching when memoization/pruning is possible.'], edgeCases: ['Immediate base case', 'Only one valid branch', 'No valid answer', 'Duplicate choices', 'Maximum recursion depth'] },
    { test: /bit/, constraints: ['Be clear about integer width and signed behavior in the chosen language.', 'Use bit identities only when their preconditions hold.', 'Parenthesize shifts and bitwise expressions when precedence is easy to misread.'], edgeCases: ['0', '1', 'Power of two', 'All bits set in relevant range', 'Negative values only if explicitly supported'] },
    { test: /greedy/, constraints: ['State the greedy choice and why an exchange/invariant argument makes it safe.', 'Sort only if the proof relies on processing order.', 'If a local choice can block a better future result, greedy may not be valid.'], edgeCases: ['Single choice', 'All choices conflict', 'No choices conflict', 'Equal priorities/values', 'Optimal answer at ordering boundary'] }
  ];

  const titleSpecific = [
    [/largest.*element/, 'Given a sequence of integers, determine the maximum value present in the sequence.'],
    [/second.*largest/, 'Given a sequence of integers, determine the second-largest distinct value. Equal copies of the maximum do not count as the second-largest distinct value.'],
    [/move.*zero/, 'Rearrange the array so every non-zero value keeps its original relative order and all zeroes appear at the end.'],
    [/missing number/, 'A range of expected integers contains every value except one. Determine the missing value.'],
    [/maximum consecutive ones|max.*consecutive.*1/, 'Given a binary array, find the maximum number of consecutive 1 values in a contiguous run.'],
    [/two sum|2 sum/, 'Given an array and a target, find two distinct positions whose values add to the target.'],
    [/majority element/, 'Determine the value or values whose frequency satisfies the majority threshold required by this problem variant.'],
    [/maximum subarray|kadane/, 'Find the maximum possible sum of a non-empty contiguous subarray.'],
    [/longest consecutive/, 'Find the length of the longest sequence of consecutive integer values, regardless of their original positions.'],
    [/binary search/, 'Search the sorted input for the target using the ordering of the data to discard impossible portions of the search space.'],
    [/lower bound/, 'Return the first position where the target could be inserted without placing it before a smaller value.'],
    [/upper bound/, 'Return the first position whose value is strictly greater than the target.'],
    [/valid parenth|balanced parenth/, 'Determine whether the bracket expression can be interpreted as a valid balanced sequence under this problem variant’s rules.'],
    [/longest substring.*without repeating/, 'Find the maximum length of a contiguous substring containing no repeated character.'],
    [/climbing stairs/, 'Count the number of distinct ways to reach the final stair using the allowed step sizes.'],
    [/house robber/, 'Choose non-adjacent values to maximize the total while respecting the adjacency rule of this problem variant.'],
    [/unique paths/, 'Count the number of valid paths through the grid using the movement and obstacle rules of this problem variant.'],
    [/longest common subsequence|\blcs\b/, 'Find the longest subsequence shared by both sequences while preserving relative order.'],
    [/edit distance/, 'Find the minimum number of allowed edit operations needed to transform one string into the other.'],
    [/longest increasing subsequence|\blis\b/, 'Find a longest subsequence whose values are strictly increasing while preserving original order.'],
    [/number of islands/, 'Count connected components of land under the neighborhood rules defined by the problem variant.'],
    [/topological/, 'Produce or reason about an ordering in which every directed prerequisite appears before the vertex that depends on it.'],
    [/dijkstra|shortest path/, 'Compute shortest-path information under the edge-weight assumptions of this problem variant.']
  ];

  function contractFor(problem) {
    const haystack = lower(`${problem.title} ${problem.topic}`);
    return topicContracts.find((entry) => entry.test.test(haystack)) || {
      constraints: ['Assume input sizes may be large enough that the intended asymptotic complexity matters.', 'Do not add assumptions that are not represented by the problem title, topic, or local test contract.', 'Use the smallest auxiliary data structure that preserves the required invariant.'],
      edgeCases: ['Smallest legal input', 'Duplicate/equal values where relevant', 'Answer at a boundary', 'No-solution case when the problem permits one', 'Largest practical input shape']
    };
  }

  function statementFor(problem) {
    const item = titleSpecific.find(([regex]) => regex.test(problem.title || ''));
    if (item) return item[1];
    const pattern = problem.guide?.pattern || 'the intended data-structure/algorithm pattern';
    return `Solve “${problem.title}”. Build the result required by the title using ${pattern}. The local input/output contract below is the contract used by this practice workspace; when a curated judge is available, Submit checks your program against additional hidden edge cases.`;
  }

  function examplesFor(problem) {
    return (problem.tests || []).filter((test) => !test.hidden).slice(0, 2).map((test) => ({
      name: test.name || 'Example',
      input: test.stdin,
      output: test.expected
    }));
  }

  window.ProblemEngine.enrich = function selfContainedEnrich(raw) {
    const problem = originalEnrich(raw);
    const contract = contractFor(problem);
    const statement = statementFor(problem);
    const curated = problem.validationCoverage === 'curated';

    return {
      ...problem,
      sourceUrl: '',
      leetcodeUrl: undefined,
      gfgUrl: undefined,
      brief: statement,
      constraints: contract.constraints,
      edgeCases: contract.edgeCases,
      examples: examplesFor(problem),
      selfContained: true,
      practiceContract: curated
        ? 'This problem has a local executable contract and hidden tests in Interview Lab.'
        : 'This problem is fully described for study here, but automatic acceptance is limited to custom cases until a dedicated local judge is defined.',
      sourceNote: 'Interview Lab uses an original, self-contained practice description rather than reproducing a third-party problem statement.'
    };
  };
})();
