(function () {
  'use strict';

  const known = [
    {
      re: /largest.*element.*array|largest element/i,
      intuition: 'You only need to remember the best value seen so far. Every element must be inspected at least once, so a single pass is optimal.',
      brute: 'Sort the array and take the last element. This works, but sorting does more work than the problem requires.',
      steps: ['Initialize the answer with the first element.', 'Scan the remaining elements.', 'Whenever the current value is larger, replace the answer.', 'Return or print the final answer.'],
      pseudo: 'best = a[0]\nfor x in a[1:]:\n    best = max(best, x)\nreturn best',
      time: 'O(n)', space: 'O(1)'
    },
    {
      re: /second.*largest/i,
      intuition: 'Track the largest and second-largest distinct values while scanning once. When a new maximum appears, the old maximum becomes the second maximum.',
      brute: 'Sort the distinct values and take the second from the end. That costs O(n log n) and may require extra memory.',
      steps: ['Keep largest and second largest as separate values.', 'If x exceeds largest, shift largest into second and set largest = x.', 'Otherwise, if x is distinct from largest and exceeds second, update second.', 'Return the second distinct largest value.'],
      pseudo: 'largest = -inf\nsecond = -inf\nfor x in a:\n    if x > largest:\n        second = largest\n        largest = x\n    else if largest > x > second:\n        second = x\nreturn second',
      time: 'O(n)', space: 'O(1)'
    },
    {
      re: /move.*zero/i,
      intuition: 'Compact all non-zero values toward the front, then fill the remaining positions with zeroes. A two-pointer version can do this in-place.',
      brute: 'Copy every non-zero value into another array, append the required number of zeroes, then copy back.',
      steps: ['Maintain write = 0.', 'Scan each value.', 'When the value is non-zero, write it at index write and increment write.', 'Fill indices write through n-1 with zero.'],
      pseudo: 'write = 0\nfor x in a:\n    if x != 0:\n        a[write] = x\n        write += 1\nwhile write < n:\n    a[write] = 0\n    write += 1',
      time: 'O(n)', space: 'O(1)'
    },
    {
      re: /remove duplicates.*sorted/i,
      intuition: 'Because equal values are adjacent in a sorted array, one pointer can mark the end of the unique prefix while another scans forward.',
      brute: 'Insert values into a set, then rebuild the array. That loses the benefit of the sorted input and uses extra memory.',
      steps: ['If the array is empty, return 0.', 'Set write = 1.', 'Scan from index 1.', 'When a[i] differs from a[write-1], copy it to a[write] and increment write.', 'The first write elements are the unique values.'],
      pseudo: 'write = 1\nfor i from 1 to n-1:\n    if a[i] != a[write-1]:\n        a[write] = a[i]\n        write += 1\nreturn write',
      time: 'O(n)', space: 'O(1)'
    },
    {
      re: /missing number/i,
      intuition: 'The missing value can be recovered from an invariant instead of searching for every candidate. XOR is especially useful because equal values cancel.',
      brute: 'For each possible value, scan the entire array to see whether it exists. That can become O(n²).',
      steps: ['XOR every value from the expected range.', 'XOR every value that actually appears.', 'All matching values cancel.', 'The remaining value is the missing number.'],
      pseudo: 'x = 0\nfor v in expected_range:\n    x ^= v\nfor v in a:\n    x ^= v\nreturn x',
      time: 'O(n)', space: 'O(1)'
    },
    {
      re: /maximum consecutive ones|max.*consecutive.*1/i,
      intuition: 'A run of ones either extends the current run or resets it. You only need the current run length and the best run seen so far.',
      brute: 'Start at every position and expand while values stay 1, which repeats work.',
      steps: ['Set current = 0 and best = 0.', 'For each value, increment current if it is 1; otherwise reset current to 0.', 'Update best after each step.'],
      pseudo: 'current = best = 0\nfor x in a:\n    if x == 1: current += 1\n    else: current = 0\n    best = max(best, current)\nreturn best',
      time: 'O(n)', space: 'O(1)'
    },
    {
      re: /two sum|2 sum/i,
      intuition: 'When you see x, the only value that can complete the pair is target - x. Store previously seen values in a hash map so that lookup is constant time on average.',
      brute: 'Try every pair of indices and test whether their values sum to target.',
      steps: ['Create an empty map from value to index.', 'For each index i, compute need = target - a[i].', 'If need is already in the map, you found the pair.', 'Otherwise store a[i] -> i and continue.'],
      pseudo: 'seen = {}\nfor i, x in enumerate(a):\n    need = target - x\n    if need in seen: return [seen[need], i]\n    seen[x] = i',
      time: 'O(n)', space: 'O(n)'
    },
    {
      re: /sort.*0.*1.*2|dutch national|sort colors/i,
      intuition: 'Maintain three regions: confirmed 0s on the left, unknown values in the middle, and confirmed 2s on the right.',
      brute: 'Count 0s, 1s, and 2s or call a general sort. Counting is linear but requires two passes; general sorting is slower.',
      steps: ['Set low = 0, mid = 0, high = n-1.', 'If a[mid] is 0, swap with low and advance low and mid.', 'If it is 1, only advance mid.', 'If it is 2, swap with high and decrement high without advancing mid.'],
      pseudo: 'low = mid = 0\nhigh = n - 1\nwhile mid <= high:\n    if a[mid] == 0: swap(a[low], a[mid]); low += 1; mid += 1\n    else if a[mid] == 1: mid += 1\n    else: swap(a[mid], a[high]); high -= 1',
      time: 'O(n)', space: 'O(1)'
    },
    {
      re: /majority element/i,
      intuition: 'If one value occurs more than n/2 times, pairing it against different values cannot eliminate all of its occurrences. Boyer-Moore keeps the surviving candidate.',
      brute: 'Count every value in a hash map and choose the one whose count exceeds n/2.',
      steps: ['Keep candidate and balance.', 'When balance is 0, choose the current value as candidate.', 'Increment balance for candidate matches, otherwise decrement.', 'If the problem does not guarantee a majority, verify the candidate in a second pass.'],
      pseudo: 'candidate = None\nbalance = 0\nfor x in a:\n    if balance == 0: candidate = x\n    balance += 1 if x == candidate else -1\nreturn candidate',
      time: 'O(n)', space: 'O(1)'
    },
    {
      re: /kadane|maximum subarray/i,
      intuition: 'At each index, the best subarray ending there either starts fresh at the current value or extends the previous best ending subarray.',
      brute: 'Enumerate all subarrays and sum them. With prefix sums this is O(n²); without them it can be O(n³).',
      steps: ['Set current and best to the first value.', 'For each next value x, set current = max(x, current + x).', 'Update best = max(best, current).'],
      pseudo: 'current = best = a[0]\nfor x in a[1:]:\n    current = max(x, current + x)\n    best = max(best, current)\nreturn best',
      time: 'O(n)', space: 'O(1)'
    },
    {
      re: /best time.*stock|stock.*buy.*sell/i,
      intuition: 'For each selling day, the best buying day is simply the cheapest price seen earlier.',
      brute: 'Try every buy day with every later sell day and keep the maximum profit.',
      steps: ['Track minPrice seen so far.', 'For each price, compute price - minPrice as the profit if sold today.', 'Update the best profit.', 'Update minPrice.'],
      pseudo: 'min_price = +inf\nbest = 0\nfor price in prices:\n    best = max(best, price - min_price)\n    min_price = min(min_price, price)\nreturn best',
      time: 'O(n)', space: 'O(1)'
    },
    {
      re: /longest consecutive/i,
      intuition: 'A value should start a sequence only when value - 1 is absent. That prevents walking the same sequence from every element.',
      brute: 'Sort the array and scan consecutive runs in O(n log n).',
      steps: ['Put all values in a set.', 'For each x, skip it if x - 1 exists.', 'Otherwise walk x, x+1, x+2... until the sequence ends.', 'Keep the longest sequence length.'],
      pseudo: 's = set(a)\nbest = 0\nfor x in s:\n    if x - 1 not in s:\n        y = x\n        while y in s: y += 1\n        best = max(best, y - x)\nreturn best',
      time: 'O(n) average', space: 'O(n)'
    },
    {
      re: /binary search(?! tree)|search in sorted/i,
      intuition: 'Sorted order lets you decide which half cannot contain the target after each comparison.',
      brute: 'Scan every value from left to right.',
      steps: ['Set low and high to the full search interval.', 'Compute mid without overflowing.', 'If a[mid] is target, return mid.', 'If a[mid] is too small, move low right; otherwise move high left.', 'Stop when low passes high.'],
      pseudo: 'low = 0; high = n - 1\nwhile low <= high:\n    mid = low + (high-low)//2\n    if a[mid] == target: return mid\n    if a[mid] < target: low = mid + 1\n    else: high = mid - 1\nreturn -1',
      time: 'O(log n)', space: 'O(1)'
    },
    {
      re: /lower bound/i,
      intuition: 'Search for the first index where the predicate a[i] >= target becomes true.',
      brute: 'Scan from the beginning until the first value that is at least target.',
      steps: ['Search a half-open interval [low, high).', 'If a[mid] >= target, mid could be the answer, so move high to mid.', 'Otherwise move low to mid + 1.', 'When low == high, that index is the lower bound.'],
      pseudo: 'low = 0; high = n\nwhile low < high:\n    mid = low + (high-low)//2\n    if a[mid] >= target: high = mid\n    else: low = mid + 1\nreturn low',
      time: 'O(log n)', space: 'O(1)'
    },
    {
      re: /upper bound/i,
      intuition: 'Search for the first index where a[i] > target becomes true.',
      brute: 'Scan until the first element strictly greater than target.',
      steps: ['Search [low, high).', 'If a[mid] > target, keep mid as a possible answer by moving high to mid.', 'Otherwise move low to mid + 1.', 'Return low when the interval collapses.'],
      pseudo: 'low = 0; high = n\nwhile low < high:\n    mid = low + (high-low)//2\n    if a[mid] > target: high = mid\n    else: low = mid + 1\nreturn low',
      time: 'O(log n)', space: 'O(1)'
    },
    {
      re: /balanced parenth|valid parenth/i,
      intuition: 'Closing brackets must match the most recently opened unmatched bracket, which is exactly last-in-first-out behavior.',
      brute: 'Repeatedly remove matching bracket pairs until the string stops changing. This can repeat scans.',
      steps: ['Push every opening bracket.', 'For a closing bracket, the stack must be non-empty and its top must be the matching opening bracket.', 'Pop the match.', 'The string is valid only if the stack is empty at the end.'],
      pseudo: 'stack = []\nfor ch in s:\n    if ch is opening: push(ch)\n    else:\n        if stack empty or top does not match ch: return false\n        pop()\nreturn stack is empty',
      time: 'O(n)', space: 'O(n)'
    },
    {
      re: /longest substring.*without repeating/i,
      intuition: 'Maintain a window with no duplicates. When a repeated character appears, move the left boundary past its previous position.',
      brute: 'Start a substring at every index and extend until a duplicate appears.',
      steps: ['Keep left = 0 and a map of each character’s latest index.', 'Scan right from left to right.', 'If the current character was seen inside the active window, move left to previousIndex + 1.', 'Record the current index and update the maximum window length.'],
      pseudo: 'left = 0; best = 0; last = {}\nfor right, ch in enumerate(s):\n    if ch in last and last[ch] >= left:\n        left = last[ch] + 1\n    last[ch] = right\n    best = max(best, right-left+1)\nreturn best',
      time: 'O(n)', space: 'O(k)'
    },
    {
      re: /climbing stairs/i,
      intuition: 'To reach step i, the final move came from i-1 or i-2, so ways[i] = ways[i-1] + ways[i-2]. Only the previous two states are needed.',
      brute: 'Recursively try taking one or two steps at every point. Without memoization, this repeats the same subproblems exponentially.',
      steps: ['Handle the smallest base cases.', 'Keep two variables for ways to reach the previous two steps.', 'Iterate upward and compute their sum.', 'Shift the variables after each step.'],
      pseudo: 'a = 1; b = 1\nfor i from 2 to n:\n    a, b = b, a + b\nreturn b',
      time: 'O(n)', space: 'O(1)'
    },
    {
      re: /house robber/i,
      intuition: 'At each house, either skip it and keep the best result so far, or rob it and add its value to the best result from two houses back.',
      brute: 'Recursively explore rob/skip choices for every house.',
      steps: ['Track prev2 = best through i-2 and prev1 = best through i-1.', 'For each value x, current = max(prev1, prev2 + x).', 'Shift prev2 and prev1 forward.'],
      pseudo: 'prev2 = 0; prev1 = 0\nfor x in a:\n    cur = max(prev1, prev2 + x)\n    prev2 = prev1\n    prev1 = cur\nreturn prev1',
      time: 'O(n)', space: 'O(1)'
    },
    {
      re: /unique paths/i,
      intuition: 'Each cell can be reached from the cell above or the cell to the left, so its path count is the sum of those two states.',
      brute: 'Recursively branch right/down until the destination, which repeats many identical grid states.',
      steps: ['Create a one-dimensional DP row initialized for the top row.', 'For each later row, update dp[col] += dp[col-1].', 'The final cell holds the total path count.'],
      pseudo: 'dp = [1] * n\nfor row from 1 to m-1:\n    for col from 1 to n-1:\n        dp[col] += dp[col-1]\nreturn dp[n-1]',
      time: 'O(mn)', space: 'O(n)'
    },
    {
      re: /longest common subsequence|\blcs\b/i,
      intuition: 'For prefixes ending at i and j, matching characters extend the best answer from both shorter prefixes; otherwise one side must be skipped.',
      brute: 'Generate subsequences from one string and test which also occur in the other.',
      steps: ['Define dp[i][j] as the LCS length of the first i and j characters.', 'If the newest characters match, use 1 + dp[i-1][j-1].', 'Otherwise use max(dp[i-1][j], dp[i][j-1]).', 'Return dp[m][n].'],
      pseudo: 'for i in 1..m:\n  for j in 1..n:\n    if a[i-1] == b[j-1]: dp[i][j] = 1 + dp[i-1][j-1]\n    else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
      time: 'O(mn)', space: 'O(mn), reducible to O(n)'
    },
    {
      re: /edit distance/i,
      intuition: 'For each pair of prefixes, decide the cheapest way to make them equal: match, insert, delete, or replace.',
      brute: 'Recursively try all three edit operations whenever characters differ.',
      steps: ['Let dp[i][j] be the edit distance between the first i and j characters.', 'Initialize row/column base cases for transforming to or from an empty string.', 'If characters match, copy dp[i-1][j-1].', 'Otherwise take 1 + min(delete, insert, replace).'],
      pseudo: 'if a[i-1] == b[j-1]:\n    dp[i][j] = dp[i-1][j-1]\nelse:\n    dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])',
      time: 'O(mn)', space: 'O(mn), reducible to O(n)'
    },
    {
      re: /longest increasing subsequence|\blis\b/i,
      intuition: 'Maintain the smallest possible tail value for an increasing subsequence of each length. A smaller tail leaves more room for future values.',
      brute: 'Use dp[i] = longest increasing subsequence ending at i and compare every earlier value, which costs O(n²).',
      steps: ['Keep an array tails.', 'For each value x, binary-search the first tails position >= x.', 'Replace that value with x, or append x if no such position exists.', 'The length of tails is the LIS length.'],
      pseudo: 'tails = []\nfor x in a:\n    i = lower_bound(tails, x)\n    if i == len(tails): append x\n    else: tails[i] = x\nreturn len(tails)',
      time: 'O(n log n)', space: 'O(n)'
    }
  ];

  const patternTemplates = {
    'Binary search': {
      intuition: 'Define a monotonic condition so each comparison lets you discard half of the remaining search space.',
      brute: 'Scan or try candidate answers one at a time.',
      steps: ['Define exactly what low and high mean.', 'Choose mid safely.', 'Evaluate the monotonic condition at mid.', 'Discard the half that cannot contain the answer.', 'Prove the loop stops and identify what low/high represent at termination.'],
      pseudo: 'low, high = search bounds\nwhile low <= high:\n    mid = low + (high-low)//2\n    if condition(mid): move toward first/last valid answer\n    else: discard the impossible half',
      time: 'Usually O(log n)', space: 'Usually O(1)'
    },
    'Dynamic programming': {
      intuition: 'Identify repeated subproblems, define a state that captures everything needed for the future, and connect each state to smaller states.',
      brute: 'Explore every possible sequence of choices recursively, often repeating the same subproblems.',
      steps: ['Write the state definition in one sentence.', 'Identify base cases.', 'Derive the transition.', 'Choose top-down memoization or bottom-up tabulation.', 'Check whether old states can be discarded to reduce memory.'],
      pseudo: 'define dp[state]\ninitialize base cases\nfor states in dependency order:\n    dp[state] = best/count using smaller states\nreturn target state',
      time: 'Number of states × transition cost', space: 'Number of stored states'
    },
    'Graph traversal / shortest-path pattern': {
      intuition: 'Represent the problem as vertices and edges, then choose the traversal based on whether you need reachability, levels, or shortest weighted distance.',
      brute: 'Repeatedly explore paths without marking reusable state, which causes duplicate work or cycles.',
      steps: ['Build or identify the adjacency representation.', 'Mark visited state at the correct time.', 'Use BFS for unweighted shortest paths or DFS for reachability/structure.', 'If weights matter, choose Dijkstra, Bellman-Ford, or another appropriate algorithm.'],
      pseudo: 'initialize frontier with start\nmark start visited\nwhile frontier not empty:\n    u = pop frontier\n    for v in neighbors(u):\n        if v not processed:\n            record state and add v',
      time: 'Usually O(V + E)', space: 'Usually O(V)'
    },
    'Tree traversal / recursion': {
      intuition: 'Solve the problem for a node using answers from its children. The recursive return value should contain exactly what the parent needs.',
      brute: 'Recompute information for each subtree from scratch.',
      steps: ['Define the recursive meaning for one node.', 'Write the null/base case.', 'Get child results.', 'Combine them into the current result.', 'Track any global answer separately only when necessary.'],
      pseudo: 'dfs(node):\n    if node is null: return base\n    left = dfs(node.left)\n    right = dfs(node.right)\n    return combine(node, left, right)',
      time: 'Usually O(n)', space: 'O(h) recursion stack'
    },
    'Sliding window / two pointers': {
      intuition: 'Maintain a contiguous window and update its boundaries instead of recomputing every candidate interval from scratch.',
      brute: 'Enumerate all O(n²) intervals.',
      steps: ['Define what makes a window valid.', 'Expand the right boundary.', 'While invalid, move the left boundary and undo its contribution.', 'Update the answer whenever the window is in the required state.'],
      pseudo: 'left = 0\nfor right in range(n):\n    add a[right]\n    while window invalid:\n        remove a[left]\n        left += 1\n    update answer',
      time: 'Usually O(n)', space: 'O(1) to O(k)'
    },
    'Heap / priority queue': {
      intuition: 'Use a heap when you repeatedly need the smallest/largest active candidate without fully sorting everything.',
      brute: 'Sort repeatedly or scan all candidates every time you need the next best one.',
      steps: ['Decide whether you need a min-heap or max-heap.', 'Store only the information needed to rank candidates.', 'Push new candidates when they become available.', 'Pop the best candidate and discard stale entries if necessary.'],
      pseudo: 'heap = []\npush initial candidates\nwhile heap:\n    best = pop(heap)\n    process best\n    push newly available candidates',
      time: 'Typically O(n log k) or O((V+E) log V)', space: 'Depends on heap size'
    },
    'Greedy invariant': {
      intuition: 'Make the locally best safe choice and prove that an optimal solution can be transformed to use that choice without becoming worse.',
      brute: 'Enumerate combinations or use dynamic programming over all decisions.',
      steps: ['Identify the decision that seems locally safest/best.', 'State the invariant preserved after taking it.', 'Use an exchange or cut argument to justify it.', 'Sort first if decisions must be processed in a particular order.'],
      pseudo: 'order candidates if needed\nfor candidate in order:\n    if candidate preserves feasibility:\n        take candidate',
      time: 'Often O(n) or O(n log n)', space: 'Often O(1) beyond sorting'
    },
    'Recursion / backtracking': {
      intuition: 'Build a partial solution, explore one choice, undo it, and continue with the next choice.',
      brute: 'Backtracking is often the intended exhaustive search; the optimization is pruning impossible or dominated branches early.',
      steps: ['Define the partial state.', 'Stop when a complete solution is reached.', 'Loop over legal choices.', 'Apply a choice, recurse, then undo it.', 'Add pruning conditions before deeper recursion.'],
      pseudo: 'backtrack(state):\n    if complete(state): record answer; return\n    for choice in legal_choices(state):\n        apply(choice)\n        backtrack(state)\n        undo(choice)',
      time: 'Problem dependent, often exponential', space: 'Recursion depth + current state'
    },
    'Pointer manipulation': {
      intuition: 'For linked structures, carefully preserve the next pointer before rewiring the current node. Draw the pointer changes before coding.',
      brute: 'Copy values into an array, solve there, and rebuild the list, which uses extra memory and may ignore the intended pointer skill.',
      steps: ['Write down which nodes/pointers must remain reachable.', 'Save next references before overwriting links.', 'Update one pointer at a time.', 'Check head/tail/single-node cases explicitly.'],
      pseudo: 'while current:\n    next_node = current.next\n    rewire current safely\n    current = next_node',
      time: 'Usually O(n)', space: 'Usually O(1)'
    },
    'Bit manipulation': {
      intuition: 'Use bitwise identities to encode state or exploit cancellation, parity, masks, and power-of-two structure.',
      brute: 'Convert to strings or inspect every logical possibility with arithmetic operations.',
      steps: ['Write the relevant bit identity.', 'Choose the mask or XOR invariant.', 'Update the invariant per value/bit.', 'Be explicit about signed integers and bit width if the language matters.'],
      pseudo: 'mask/result = initial\nfor value in input:\n    update using &, |, ^, <<, or >>\nreturn result',
      time: 'Usually O(n) or O(number of bits)', space: 'Usually O(1)'
    }
  };

  function inferTemplate(problem) {
    const pattern = problem?.guide?.pattern || '';
    if (patternTemplates[pattern]) return patternTemplates[pattern];
    const lower = pattern.toLowerCase();
    if (lower.includes('binary search')) return patternTemplates['Binary search'];
    if (lower.includes('dynamic') || lower.includes('dp')) return patternTemplates['Dynamic programming'];
    if (lower.includes('graph')) return patternTemplates['Graph traversal / shortest-path pattern'];
    if (lower.includes('tree')) return patternTemplates['Tree traversal / recursion'];
    if (lower.includes('sliding') || lower.includes('two pointer')) return patternTemplates['Sliding window / two pointers'];
    if (lower.includes('heap')) return patternTemplates['Heap / priority queue'];
    if (lower.includes('greedy')) return patternTemplates['Greedy invariant'];
    if (lower.includes('recursion') || lower.includes('backtracking')) return patternTemplates['Recursion / backtracking'];
    if (lower.includes('pointer')) return patternTemplates['Pointer manipulation'];
    if (lower.includes('bit')) return patternTemplates['Bit manipulation'];
    return {
      intuition: `Start from the invariant behind ${pattern || 'the selected data-structure pattern'}. The goal is to avoid recomputing information that can be carried forward while processing the input.`,
      brute: 'Write the direct exhaustive or repeated-scan approach first so you can identify exactly which work is duplicated.',
      steps: ['Clarify the exact input/output and constraints.', 'Write the brute-force approach and complexity.', `Identify the invariant or reusable state for ${pattern || 'the problem'}.`, 'Implement the optimized transition/update.', 'Walk boundary cases and justify time and space complexity.'],
      pseudo: 'initialize the state needed for the invariant\nprocess each relevant input/state exactly as required\nupdate the answer\nreturn the final result',
      time: problem?.guide?.targetTime || 'Problem dependent',
      space: problem?.guide?.targetSpace || 'Problem dependent'
    };
  }

  function explain(problem) {
    const exact = known.find((entry) => entry.re.test(problem?.title || ''));
    const base = exact || inferTemplate(problem);
    return {
      level: exact ? 'problem-specific' : 'pattern-level',
      intuition: base.intuition,
      bruteForce: base.brute,
      optimalSteps: base.steps,
      pseudocode: base.pseudo,
      time: base.time || problem?.guide?.targetTime || 'Problem dependent',
      space: base.space || problem?.guide?.targetSpace || 'Problem dependent',
      verification: [
        'Trace the smallest valid input.',
        'Trace a case with duplicate/equal values where relevant.',
        'Trace a boundary-shaped case such as already sorted, all equal, empty/minimum, skewed tree, or disconnected graph when the problem permits it.',
        'Confirm the implementation preserves the stated invariant after every iteration/recursive return.'
      ]
    };
  }

  window.SolutionEngine = { explain };
})();
