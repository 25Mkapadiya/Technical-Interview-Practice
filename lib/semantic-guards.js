(function () {
  'use strict';

  const originalEnrich = window.ProblemEngine?.enrich;
  const originalExplain = window.SolutionEngine?.explain;
  if (!originalEnrich || !originalExplain) return;

  const lower = (value) => String(value || '').toLowerCase();
  const test = (name, stdin, expected, compare = 'exact', hidden = true) => ({ name, stdin, expected, compare, hidden });

  function clearJudge(problem, note) {
    return {
      ...problem,
      tests: [],
      validationCoverage: 'custom',
      inputFormat: 'Use the canonical source contract. Add equivalent stdin for local execution.',
      outputFormat: 'Print the result required by the canonical problem.',
      judgeNote: note || 'Variant protected from an incompatible generic judge.'
    };
  }

  function guardedEnrich(raw) {
    let problem = originalEnrich(raw);
    const title = lower(problem.title);

    if (/\bk-?th\b.*largest/.test(title)) {
      if (/stream/.test(title)) return clearJudge(problem, 'Streaming kth-largest requires state across operations; use custom cases until a dedicated interactive judge is enabled.');
      if (/\bbst\b/.test(title)) return clearJudge(problem, 'BST-order kth largest needs a tree-serialized contract, not the array kth-largest judge.');
      problem = {
        ...problem,
        inputFormat: 'First line n. Second line: n integers. Third line: k (1 means largest).',
        outputFormat: 'Print the kth largest value.',
        tests: [
          test('Basic', '6\n3 2 1 5 6 4\n2', '5', 'exact', false),
          test('Duplicates', '9\n3 2 3 1 2 4 5 5 6\n4', '4'),
          test('First', '3\n8 1 7\n1', '8')
        ],
        validationCoverage: 'curated',
        judgeNote: 'Validated local kth-largest array contract.'
      };
    }

    if (/majority element/.test(title) && (/\bii\b|n\s*\/\s*3|n\s*by\s*3|one third|>\s*n\s*\/\s*3/.test(title))) {
      problem = {
        ...problem,
        inputFormat: 'First line n. Second line: n integers.',
        outputFormat: 'Print every value occurring more than floor(n/3) times, separated by spaces. Any output order is accepted.',
        tests: [
          test('One answer', '3\n3 2 3', '3', 'unorderedTokens', false),
          test('Two answers', '8\n1 1 1 3 3 2 2 2', '1 2', 'unorderedTokens'),
          test('Small', '2\n1 2', '1 2', 'unorderedTokens')
        ],
        validationCoverage: 'curated',
        judgeNote: 'Uses the two-candidate n/3 majority contract.'
      };
    }

    if (/valid parenthesis string/.test(title) || (/parenthesis/.test(title) && /\*/.test(problem.brief || ''))) {
      problem = {
        ...problem,
        inputFormat: 'One line containing (, ), and * where * may represent (, ), or an empty string.',
        outputFormat: 'Print true if some interpretation of * makes the string valid, otherwise false.',
        tests: [
          test('Wildcard closes', '(*)', 'true', 'boolean', false),
          test('Wildcard choice', '(*))', 'true', 'boolean'),
          test('Impossible', ')*(', 'false', 'boolean')
        ],
        validationCoverage: 'curated',
        judgeNote: 'Validated wildcard-parenthesis contract.'
      };
    }

    if (/house robber/.test(title) && (/\bii\b|\b2\b|circular|circle/.test(title))) {
      problem = {
        ...problem,
        inputFormat: 'First line n. Second line: non-negative values arranged in a circle; adjacent houses, including first and last, cannot both be robbed.',
        outputFormat: 'Print the maximum obtainable sum.',
        tests: [
          test('Three houses', '3\n2 3 2', '3', 'exact', false),
          test('Four houses', '4\n1 2 3 1', '4'),
          test('Single', '1\n7', '7')
        ],
        validationCoverage: 'curated',
        judgeNote: 'Validated circular house-robber contract.'
      };
    }

    if (/unique paths/.test(title) && (/\bii\b|\b2\b|obstacle/.test(title))) {
      return clearJudge(problem, 'Obstacle-grid Unique Paths has a different input contract from plain Unique Paths.');
    }

    if (/repeating.*missing|missing.*repeating/.test(title)) {
      problem = {
        ...problem,
        inputFormat: 'First line n. Second line: n integers from 1 through n; exactly one value repeats twice and exactly one value is missing.',
        outputFormat: 'Print the repeating value then the missing value, separated by a space.',
        tests: [
          test('Basic', '5\n3 1 2 5 3', '3 4', 'exact', false),
          test('Repeat at start', '4\n1 1 3 4', '1 2'),
          test('Missing at end', '4\n1 2 3 3', '3 4')
        ],
        validationCoverage: 'curated',
        judgeNote: 'Validated repeating-and-missing dual-value contract, distinct from the single-missing-number judge.'
      };
    }

    if (/print subarray with maximum subarray sum/.test(title)) {
      problem = {
        ...problem,
        inputFormat: 'First line n. Second line: n integers.',
        outputFormat: 'Print the elements of a maximum-sum contiguous subarray, in order, separated by spaces.',
        tests: [
          test('Classic', '9\n-2 1 -3 4 -1 2 1 -5 4', '4 -1 2 1', 'tokens', false),
          test('All positive', '4\n1 2 3 4', '1 2 3 4', 'tokens'),
          test('All negative, single max', '3\n-8 -2 -5', '-2', 'tokens')
        ],
        validationCoverage: 'curated',
        judgeNote: 'Validated maximum-subarray reconstruction contract (prints the subarray, not only the sum). Test inputs were chosen so the maximum-sum subarray is unique.'
      };
    }

    if (/single number/.test(title) && /\biii\b/.test(title)) {
      problem = {
        ...problem,
        inputFormat: 'First line n. Second line: n integers where exactly two values occur once and every other value occurs exactly twice.',
        outputFormat: 'Print the two values that occur once, separated by a space. Either order is accepted.',
        tests: [
          test('Basic', '6\n1 2 1 3 2 5', '3 5', 'unorderedTokens', false),
          test('Negatives', '6\n-1 0 -1 4 0 7', '4 7', 'unorderedTokens'),
          test('Small', '2\n4 9', '4 9', 'unorderedTokens')
        ],
        validationCoverage: 'curated',
        judgeNote: 'Validated two-unique-values contract, distinct from the single-unique-value Single Number I judge.'
      };
    }

    if (/number of longest increasing subsequence/.test(title)) {
      problem = {
        ...problem,
        inputFormat: 'First line n. Second line: n integers.',
        outputFormat: 'Print the number of distinct-position subsequences that achieve the maximum strictly-increasing length.',
        tests: [
          test('Classic', '5\n1 3 5 4 7', '2', 'exact', false),
          test('All equal', '5\n2 2 2 2 2', '5'),
          test('Two LIS paths', '8\n1 2 4 3 5 4 7 2', '3')
        ],
        validationCoverage: 'curated',
        judgeNote: 'Validated count-of-LIS contract, distinct from the plain LIS-length judge.'
      };
    }

    if (/check if.*array.*sorted/.test(title) && /\bii\b/.test(title)) {
      problem = {
        ...problem,
        inputFormat: 'First line n. Second line: n integers.',
        outputFormat: 'Print true if the array could have been produced by taking a sorted, non-decreasing array and rotating it zero or more positions, otherwise false.',
        tests: [
          test('Rotated once', '5\n3 4 5 1 2', 'true', 'boolean', false),
          test('Already sorted', '5\n1 2 3 4 5', 'true', 'boolean'),
          test('Not rotatable', '5\n2 1 3 4 5', 'false', 'boolean')
        ],
        validationCoverage: 'curated',
        judgeNote: 'Validated sorted-and-rotated contract, distinct from the plain non-decreasing check.'
      };
    }

    if (/two sum in bst/.test(title)) {
      return clearJudge(problem, 'BST two-sum needs a tree-serialized contract; use custom cases until tree-input judging is enabled.');
    }

    if (/number of islands/.test(title) && (/\bii\b|\b2\b|dynamic|online/.test(title))) {
      return clearJudge(problem, 'Dynamic Number of Islands requires an operation-stream/DSU contract, not the static grid judge.');
    }

    if ((/longest common subsequence|\blcs\b/.test(title)) && /print|reconstruct/.test(title)) {
      return clearJudge(problem, 'This variant requires the subsequence itself, not only its length.');
    }

    if ((/longest increasing subsequence|\blis\b/.test(title)) && /print|reconstruct/.test(title)) {
      return clearJudge(problem, 'This variant requires reconstructing the subsequence, not only its length.');
    }

    if (/stock|buy and sell/.test(title)) {
      const simple = /^(stock buy and sell|best time to buy and sell stock)$/.test(title.trim());
      const variant = /\bii\b|\biii\b|\biv\b|cooldown|fee|two transactions|k transactions|unlimited|multiple transactions/.test(title);
      if (!simple && variant) return clearJudge(problem, 'Stock-trading variants use different transaction-state constraints from the one-transaction judge.');
    }

    return problem;
  }

  function solution(problem, data) {
    return {
      level: 'problem-specific',
      verification: [
        'Trace the smallest legal input.',
        'Trace a boundary case that forces the special variant rule.',
        'Verify the state invariant after every iteration or transition.',
        'Confirm the final complexity from the number of states and transitions.'
      ],
      ...data
    };
  }

  function guardedExplain(problem) {
    const title = lower(problem?.title);

    if (/majority element/.test(title) && (/\bii\b|n\s*\/\s*3|n\s*by\s*3|one third/.test(title))) {
      return solution(problem, {
        intuition: 'More than n/3 frequency means there can be at most two answers. Extend Boyer-Moore voting to maintain two candidates, then verify them in a second pass.',
        bruteForce: 'Count every value in a hash map and return entries whose count exceeds floor(n/3).',
        optimalSteps: ['Maintain candidate1/count1 and candidate2/count2.', 'Match existing candidates first.', 'Use an empty counter for a new candidate; otherwise decrement both counters.', 'Count both surviving candidates in a verification pass.', 'Return only those exceeding floor(n/3).'],
        pseudocode: 'for x in a:\n  if x == c1: n1 += 1\n  else if x == c2: n2 += 1\n  else if n1 == 0: c1, n1 = x, 1\n  else if n2 == 0: c2, n2 = x, 1\n  else: n1 -= 1; n2 -= 1\nverify c1 and c2',
        time: 'O(n)', space: 'O(1)'
      });
    }

    if (/valid parenthesis string/.test(title)) {
      return solution(problem, {
        intuition: 'Track a range of possible unmatched opening counts. A * can decrease, preserve, or increase that count, so only the minimum and maximum feasible values are needed.',
        bruteForce: 'Try all three meanings of every * with backtracking, which is exponential.',
        optimalSteps: ['Set low = high = 0.', 'For (, increment both.', 'For ), decrement both.', 'For *, decrement low and increment high.', 'Clamp low to zero; if high becomes negative, the prefix is impossible.', 'The string is valid when low is zero at the end.'],
        pseudocode: 'low = high = 0\nfor ch in s:\n  if ch == "(": low += 1; high += 1\n  elif ch == ")": low -= 1; high -= 1\n  else: low -= 1; high += 1\n  low = max(low, 0)\n  if high < 0: return false\nreturn low == 0',
        time: 'O(n)', space: 'O(1)'
      });
    }

    if (/house robber/.test(title) && (/\bii\b|\b2\b|circular|circle/.test(title))) {
      return solution(problem, {
        intuition: 'Because the first and last houses are adjacent, an optimal solution cannot take both. Solve two ordinary House Robber ranges and take the better result.',
        bruteForce: 'Enumerate all non-adjacent subsets while also checking the circular first/last conflict.',
        optimalSteps: ['Handle n = 1 directly.', 'Compute the linear robber answer on houses 0 through n-2.', 'Compute it again on houses 1 through n-1.', 'Return the larger result.'],
        pseudocode: 'if n == 1: return a[0]\nreturn max(rob_linear(a[0:n-1]), rob_linear(a[1:n]))',
        time: 'O(n)', space: 'O(1)'
      });
    }

    if (/unique paths/.test(title) && (/\bii\b|\b2\b|obstacle/.test(title))) {
      return solution(problem, {
        intuition: 'Use the same grid DP as Unique Paths, but blocked cells contribute zero paths and reset the DP value at that position.',
        bruteForce: 'Recursively explore right/down paths and stop at obstacles, repeating the same cells many times.',
        optimalSteps: ['Initialize dp[0] based on whether the start is blocked.', 'Scan cells row by row.', 'Set dp[col] = 0 for an obstacle.', 'Otherwise add paths from the left into the paths already stored from above.', 'Return the final cell count.'],
        pseudocode: 'dp = [0] * cols\ndp[0] = 1\nfor each row:\n  for c in 0..cols-1:\n    if obstacle: dp[c] = 0\n    elif c > 0: dp[c] += dp[c-1]\nreturn dp[-1]',
        time: 'O(mn)', space: 'O(n)'
      });
    }

    if (/kth.*largest/.test(title) && /stream/.test(title)) {
      return solution(problem, {
        intuition: 'Keep only the k largest values seen so far. The smallest of those k values is the current kth largest, so a min-heap of size k is ideal.',
        bruteForce: 'Store every value and sort the entire collection after each insertion.',
        optimalSteps: ['Maintain a min-heap.', 'Push each incoming value.', 'If heap size exceeds k, remove the minimum.', 'The heap root is the kth largest after each update.'],
        pseudocode: 'push(heap, x)\nif len(heap) > k: pop_min(heap)\nreturn heap[0]',
        time: 'O(log k) per insertion', space: 'O(k)'
      });
    }

    if (/number of islands/.test(title) && (/\bii\b|\b2\b|dynamic|online/.test(title))) {
      return solution(problem, {
        intuition: 'Each land-addition creates a new component, then DSU merges it with adjacent land components. The island count rises by one and falls once for each successful union.',
        bruteForce: 'After every operation, run a full grid DFS/BFS to recount islands.',
        optimalSteps: ['Initialize all cells as water.', 'When a new land cell appears, create its DSU set and increment the island count.', 'Check four neighbors.', 'For every neighboring land cell in a different DSU component, union them and decrement the count.', 'Record the count after each operation.'],
        pseudocode: 'for cell in operations:\n  if already_land: record count; continue\n  make_set(cell); count += 1\n  for neighbor in four_directions:\n    if neighbor is land and union(cell, neighbor): count -= 1\n  record count',
        time: 'O(q α(mn))', space: 'O(mn)'
      });
    }

    if ((/longest common subsequence|\blcs\b/.test(title)) && /print|reconstruct/.test(title)) {
      return solution(problem, {
        intuition: 'Build the normal LCS length table, then walk backward through it to reconstruct which matching characters formed an optimal subsequence.',
        bruteForce: 'Generate subsequences and test membership in the other string.',
        optimalSteps: ['Build the LCS DP table.', 'Start at dp[m][n].', 'When characters match, append that character and move diagonally.', 'Otherwise move toward the neighboring cell with the larger DP value.', 'Reverse the collected characters.'],
        pseudocode: 'i=m; j=n; ans=[]\nwhile i>0 and j>0:\n  if a[i-1] == b[j-1]: ans.append(a[i-1]); i-=1; j-=1\n  elif dp[i-1][j] >= dp[i][j-1]: i-=1\n  else: j-=1\nreturn reverse(ans)',
        time: 'O(mn)', space: 'O(mn)'
      });
    }

    if ((/longest increasing subsequence|\blis\b/.test(title)) && /print|reconstruct/.test(title)) {
      return solution(problem, {
        intuition: 'Along with the LIS length ending at each index, remember the predecessor index that produced that best length. Backtrack from the best ending index to reconstruct the sequence.',
        bruteForce: 'Generate all subsequences and keep the longest increasing one.',
        optimalSteps: ['Compute dp[i] as LIS length ending at i.', 'When j can precede i and improves dp[i], store parent[i] = j.', 'Remember the index with the largest dp value.', 'Follow parent links backward and reverse the result.'],
        pseudocode: 'dp = [1]*n; parent = range(n)\nfor i in 0..n-1:\n  for j in 0..i-1:\n    if a[j] < a[i] and dp[j]+1 > dp[i]:\n      dp[i] = dp[j]+1; parent[i] = j\nbacktrack from argmax(dp)',
        time: 'O(n²) for this reconstruction approach', space: 'O(n)'
      });
    }

    if (/stock|buy and sell/.test(title)) {
      if (/cooldown/.test(title)) {
        return solution(problem, {
          intuition: 'Track states for holding a stock, having just sold, and resting. A cooldown prevents buying immediately after a sale.',
          bruteForce: 'Recursively try buy, sell, and skip decisions for every day.',
          optimalSteps: ['Maintain hold, sold, and rest profits.', 'Update sold from yesterday’s hold plus today’s price.', 'Update hold from either continuing to hold or buying from yesterday’s rest.', 'Update rest from yesterday’s rest or sold.', 'Return the best non-holding state.'],
          pseudocode: 'hold=-price[0]; sold=-inf; rest=0\nfor p in prices[1:]:\n  new_sold=hold+p\n  new_hold=max(hold, rest-p)\n  new_rest=max(rest, sold)\n  hold,sold,rest=new_hold,new_sold,new_rest',
          time: 'O(n)', space: 'O(1)'
        });
      }
      if (/fee/.test(title)) {
        return solution(problem, {
          intuition: 'Use two DP states: maximum cash while not holding stock and maximum value while holding stock. Charge the fee on a completed sale.',
          bruteForce: 'Explore every valid sequence of transactions.',
          optimalSteps: ['Keep cash and hold.', 'For each price, update cash = max(cash, hold + price - fee).', 'Update hold = max(hold, oldCash - price).', 'Return cash.'],
          pseudocode: 'cash=0; hold=-prices[0]\nfor p in prices[1:]:\n  old_cash=cash\n  cash=max(cash, hold+p-fee)\n  hold=max(hold, old_cash-p)\nreturn cash',
          time: 'O(n)', space: 'O(1)'
        });
      }
      if (/\biii\b|two transactions/.test(title)) {
        return transactionSolution(2);
      }
      if (/\biv\b|k transactions/.test(title)) {
        return solution(problem, {
          intuition: 'Model each completed buy/sell as a transaction state. For at most k transactions, keep the best buy and sell value for each transaction number.',
          bruteForce: 'Try every possible set of buy/sell days.',
          optimalSteps: ['Create buy[t] and sell[t] for t=1..k.', 'For each price, update buy[t] from sell[t-1]-price.', 'Update sell[t] from buy[t]+price.', 'Return sell[k].'],
          pseudocode: 'buy=[-inf]*(k+1); sell=[0]*(k+1)\nfor p in prices:\n  for t in 1..k:\n    buy[t]=max(buy[t], sell[t-1]-p)\n    sell[t]=max(sell[t], buy[t]+p)\nreturn sell[k]',
          time: 'O(nk)', space: 'O(k)'
        });
      }
      if (/\bii\b|unlimited|multiple transactions/.test(title)) {
        return solution(problem, {
          intuition: 'With unlimited non-overlapping transactions and no fee/cooldown, every positive day-to-day increase can be captured as profit.',
          bruteForce: 'Enumerate all sequences of buy and sell days.',
          optimalSteps: ['Scan adjacent prices.', 'Whenever today is higher than yesterday, add the difference.', 'The sum equals the profit of optimally merging those rising segments into transactions.'],
          pseudocode: 'profit=0\nfor i in 1..n-1:\n  if prices[i] > prices[i-1]: profit += prices[i]-prices[i-1]\nreturn profit',
          time: 'O(n)', space: 'O(1)'
        });
      }
    }

    return originalExplain(problem);
  }

  function transactionSolution(k) {
    return solution(null, {
      intuition: `Use DP states for at most ${k} completed transactions instead of enumerating buy/sell day combinations.`,
      bruteForce: 'Try every valid sequence of buy and sell days.',
      optimalSteps: ['Track the best state after each buy and sell.', 'Update states in transaction order for every price.', 'Carry forward the option to do nothing.', 'Return the final sell state.'],
      pseudocode: `maintain buy[1..${k}] and sell[1..${k}]\nfor price in prices:\n  update each buy from the previous sell state\n  update each sell from its matching buy state\nreturn sell[${k}]`,
      time: `O(${k}n)`, space: `O(${k})`
    });
  }

  window.ProblemEngine.enrich = guardedEnrich;
  window.SolutionEngine.explain = guardedExplain;
})();
