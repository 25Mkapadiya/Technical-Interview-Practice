(function () {
  'use strict';

  const originalEnrich = window.ProblemEngine?.enrich;
  if (!originalEnrich) return;

  const lower = (value) => String(value || '').toLowerCase();

  const topicContracts = [
    { test: /array|sorting/, input: 'The primary input is an array or sequence. Include any named target, k, index, interval, or other parameter required by the problem title.', output: 'Print or return the array result, index, value, count, or boolean requested by the problem title.', constraints: ['Treat n as potentially large enough that unnecessary O(n²) work may time out.', 'Do not assume values are positive unless this task explicitly says so.', 'Consider duplicates, a single element, already-sorted input, reverse-sorted input, and extreme values.'], edgeCases: ['Minimum-size input', 'All values equal', 'Duplicates around the answer', 'Negative values where allowed', 'Already optimal / already sorted input'] },
    { test: /binary search/, input: 'The input contains an ordered or monotonic search space plus the target/answer parameter named by the problem.', output: 'Return the requested index, boundary, value, or feasibility result.', constraints: ['Use monotonic or sorted structure only when the task guarantees it.', 'Be precise about inclusive vs half-open boundaries.', 'Compute mid in a way that is safe in fixed-width integer languages.'], edgeCases: ['Target at first/last position', 'Target absent', 'Duplicate targets', 'Single-element search space', 'Answer at the extreme boundary'] },
    { test: /string/, input: 'The primary input is one or more strings, plus any named length/count/target parameter required by the title.', output: 'Return the requested string, substring/subsequence property, count, length, or boolean result.', constraints: ['Treat strings as potentially long.', 'Do not assume lowercase-only input unless this task explicitly says so.', 'Be explicit about whether spaces, punctuation, or case matter.'], edgeCases: ['Empty or one-character string when allowed', 'All characters equal', 'All characters distinct', 'Repeated pattern', 'Answer touches the first or last character'] },
    { test: /linked/, input: 'The primary input is a linked list (or lists) plus any node/index/value parameter named by the title.', output: 'Return or print the requested node, value, boolean, or resulting linked-list sequence.', constraints: ['Preserve node connectivity and avoid losing the rest of the list while rewiring pointers.', 'Use O(1) auxiliary memory when the intended solution is pointer-based.', 'Handle null heads and one-node lists when the task permits them.'], edgeCases: ['Empty list when allowed', 'Single node', 'Two nodes', 'Cycle or intersection boundary where applicable', 'Operation affects the head/tail'] },
    { test: /tree|bst/, input: 'The primary input is a binary tree/BST plus any target node/value or traversal parameter named by the title.', output: 'Return the requested traversal, node/value, path, aggregate, or boolean property.', constraints: ['A skewed tree can have height n, so recursive depth may be O(n).', 'Do not assume the tree is balanced unless stated here.', 'For BST problems, use the ordering invariant only when the structure is a BST.'], edgeCases: ['Empty tree when allowed', 'Single node', 'Completely skewed tree', 'Perfectly balanced tree', 'Answer is the root or a leaf'] },
    { test: /graph/, input: 'The primary input is a graph represented by vertices and edges, plus any source, destination, weight, operation, or other parameter named by the title.', output: 'Return the requested traversal, ordering, component count, path/distance result, or graph property.', constraints: ['Graphs may be disconnected unless stated otherwise.', 'Avoid revisiting vertices; track visited/state explicitly.', 'Choose BFS, DFS, Dijkstra, topological order, DSU, or another graph tool based on edge weights and the exact invariant.'], edgeCases: ['Disconnected graph', 'Single vertex', 'Cycle', 'Multiple valid paths', 'Duplicate/parallel edges when allowed'] },
    { test: /dynamic/, input: 'The input is the sequence, grid, string pair, capacity, target, or state parameters named by the problem.', output: 'Return the requested optimum, count, feasibility result, or reconstructed object.', constraints: ['Define the DP state before writing transitions.', 'Check whether dimensions can be compressed without destroying dependencies.', 'Use a numeric type large enough for counts/sums when required.'], edgeCases: ['Base state only', 'Choice always taken', 'Choice never taken', 'Ties between alternatives', 'Maximum state dimensions'] },
    { test: /heap/, input: 'The input is a sequence/stream plus k or another ranking parameter named by the title.', output: 'Return the requested ranked value, collection, or scheduling result.', constraints: ['Keep only the information the heap must represent.', 'Remember heap operations are logarithmic in heap size.', 'Duplicates may be significant.'], edgeCases: ['k = 1', 'k = n when applicable', 'Duplicates around kth boundary', 'Already ordered data', 'Negative values'] },
    { test: /stack|queue/, input: 'The input is the sequence of values, characters, or operations named by the title.', output: 'Return the requested transformed sequence, next/previous relation, validity result, or simulated structure output.', constraints: ['Be explicit about LIFO vs FIFO behavior.', 'Never pop/dequeue without checking whether the structure can be empty.', 'For monotonic structures, define exactly what order the stack/queue maintains.'], edgeCases: ['Empty structure transition', 'All increasing', 'All decreasing', 'Repeated values', 'Answer remains in the structure until the end'] },
    { test: /sliding|two pointer/, input: 'The input is a sequence/string plus the target, k, sum, or validity condition named by the title.', output: 'Return the requested window length, count, indices, substring/subarray, or optimum.', constraints: ['State what invariant makes the current window valid.', 'Move each pointer monotonically when targeting O(n).', 'Know whether negative values break a sum-based shrinking rule.'], edgeCases: ['Window length 1', 'Whole input is the answer', 'No valid window', 'Repeated values', 'Validity changes at both ends'] },
    { test: /recursion/, input: 'The input is the value, collection, board, string, or choice set named by the title.', output: 'Return or print the requested recursive result, generated arrangements, paths, or count.', constraints: ['Identify the base case before the recursive choice.', 'Backtracking must undo mutable state before returning.', 'Watch exponential branching when memoization/pruning is possible.'], edgeCases: ['Immediate base case', 'Only one valid branch', 'No valid answer', 'Duplicate choices', 'Maximum recursion depth'] },
    { test: /bit/, input: 'The input consists of the integer values or bit range named by the title.', output: 'Return the requested numeric value, bit count, transformed value, or boolean property.', constraints: ['Be clear about integer width and signed behavior in the chosen language.', 'Use bit identities only when their preconditions hold.', 'Parenthesize shifts and bitwise expressions when precedence is easy to misread.'], edgeCases: ['0', '1', 'Power of two', 'All bits set in relevant range', 'Negative values only if explicitly supported'] },
    { test: /greedy/, input: 'The input is the set/sequence of intervals, jobs, values, resources, or choices named by the title.', output: 'Return the requested optimum, selected count, ordering, or allocation result.', constraints: ['State the greedy choice and why an exchange/invariant argument makes it safe.', 'Sort only if the proof relies on processing order.', 'If a local choice can block a better future result, greedy may not be valid.'], edgeCases: ['Single choice', 'All choices conflict', 'No choices conflict', 'Equal priorities/values', 'Optimal answer at ordering boundary'] }
  ];

  const titleSpecific = [
    [/second.*largest/i, 'Given a sequence of integers, determine the second-largest distinct value. Equal copies of the maximum do not count as the second-largest distinct value.'],
    [/(?:^|\b)(?:largest|max(?:imum)?)\s+element/i, 'Given a sequence of integers, determine the maximum value present in the sequence.'],
    [/move.*zero/, 'Rearrange the array so every non-zero value keeps its original relative order and all zeroes appear at the end.'],
    [/missing number/, 'A range of expected integers contains every value except one. Determine the missing value.'],
    [/maximum consecutive ones|max.*consecutive.*1/, 'Given a binary array, find the maximum number of consecutive 1 values in a contiguous run.'],
    [/two sum|2 sum/, 'Given an array and a target, find two distinct positions whose values add to the target.'],
    [/majority element/, 'Determine the value or values whose frequency satisfies the majority threshold required by this problem variant.'],
    [/maximum subarray|kadane/, 'Find the maximum possible sum of a non-empty contiguous subarray.'],
    [/longest consecutive/, 'Find the length of the longest sequence of consecutive integer values, regardless of their original positions.'],
    [/binary search(?! tree)/, 'Search the sorted input for the target using the ordering of the data to discard impossible portions of the search space.'],
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
      input: 'The input consists of the data structure or values named by the problem title, plus any explicitly named parameter.',
      output: 'Return or print the value, structure, sequence, count, or boolean result requested by the problem title.',
      constraints: ['Assume input sizes may be large enough that the intended asymptotic complexity matters.', 'Do not add assumptions that are not represented by the problem title, topic, or local test contract.', 'Use the smallest auxiliary data structure that preserves the required invariant.'],
      edgeCases: ['Smallest legal input', 'Duplicate/equal values where relevant', 'Answer at a boundary', 'No-solution case when the task permits one', 'Largest practical input shape']
    };
  }

  function statementFor(problem) {
    const item = titleSpecific.find(([regex]) => regex.test(problem.title || ''));
    if (item) return item[1];
    const pattern = problem.guide?.pattern || 'the intended data-structure/algorithm pattern';
    return `Solve “${problem.title}” using ${pattern}. Identify the required result from the title, define the invariant/state before coding, and use the local practice contract below. When a curated judge is available, Submit checks additional hidden edge cases.`;
  }

  function examplesFor(problem) {
    return (problem.tests || []).filter((test) => !test.hidden).slice(0, 2).map((test) => ({
      name: test.name || 'Example',
      input: test.stdin,
      output: test.expected
    }));
  }

  function hasExternalDependency(text) {
    return /canonical\s+source|source\s+contract|canonical\s+problem|open\s+the\s+source/i.test(String(text || ''));
  }

  window.ProblemEngine.enrich = function selfContainedEnrich(raw) {
    const problem = originalEnrich(raw);
    const contract = contractFor(problem);
    const statement = statementFor(problem);
    const curated = problem.validationCoverage === 'curated';
    const inputFormat = curated && !hasExternalDependency(problem.inputFormat) ? problem.inputFormat : contract.input;
    const outputFormat = curated && !hasExternalDependency(problem.outputFormat) ? problem.outputFormat : contract.output;

    return {
      ...problem,
      sourceUrl: '',
      leetcodeUrl: undefined,
      gfgUrl: undefined,
      brief: statement,
      inputFormat,
      outputFormat,
      constraints: contract.constraints,
      edgeCases: contract.edgeCases,
      examples: examplesFor(problem),
      selfContained: true,
      practiceContract: curated
        ? 'This problem has a local executable contract and hidden tests in Interview Lab.'
        : 'This problem is fully described for study here. The Testcase panel remains editable for custom execution until this entry receives a dedicated hidden judge.',
      sourceNote: 'This is an original Interview Lab practice description written for self-contained study.'
    };
  };
})();
