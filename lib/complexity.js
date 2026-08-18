(function () {
  'use strict';

  const count = (text, regex) => (text.match(regex) || []).length;

  function analyze(code = '', language = 'python', problem = null) {
    const source = String(code || '');
    const lower = source.toLowerCase();
    const evidence = [];
    let time = 'O(1)';
    let space = 'O(1)';
    let confidence = 'medium';

    const loopCount = language === 'python'
      ? count(source, /^\s*(for|while)\b/gm)
      : count(source, /\b(for|while)\s*\(/g);
    const nestedLoopSignal = language === 'python'
      ? /(?:for|while)[^\n]*:\s*\n(?:\s+[^\n]*\n)*?\s+(?:for|while)\b/m.test(source)
      : /\b(?:for|while)\s*\([^)]*\)\s*\{[^{}]*\b(?:for|while)\s*\(/s.test(source);
    const hasSort = /\.sort\s*\(|sorted\s*\(|collections\.sort|arrays\.sort|std::sort|sort\s*\(/i.test(source);
    const hasBinary = /mid\s*=|left\s*<=\s*right|low\s*<=\s*high|binary.?search/i.test(source);
    const hasHash = /\b(dict|set|map|unordered_map|unordered_set|hashmap|hashset|new map|new set)\b/i.test(lower);
    const hasQueue = /\b(deque|queue|shift\s*\(|popleft|arraydeque)\b/i.test(lower);
    const hasHeap = /\b(heapq|priority_queue|priorityqueue|heap)\b/i.test(lower);
    const hasMatrixDP = /\[\s*\[|new\s+.*\[.*\]\[|vector\s*<\s*vector|dp\s*=.*for.*for/i.test(source);
    const recursionName = detectRecursion(source, language);

    if (nestedLoopSignal) {
      time = 'O(n²)';
      evidence.push('Detected a nested loop structure.');
    } else if (loopCount > 0) {
      time = 'O(n)';
      evidence.push(`Detected ${loopCount} loop${loopCount === 1 ? '' : 's'} without a clear nested dependency.`);
    }

    if (hasSort) {
      time = time === 'O(n²)' ? 'O(n²) (sorting does not dominate)' : 'O(n log n)';
      evidence.push('Detected a comparison-style sorting call, typically O(n log n).');
    }
    if (hasBinary && loopCount > 0 && !nestedLoopSignal && !hasSort) {
      time = 'O(log n)';
      evidence.push('Loop updates appear consistent with binary-search-style halving.');
    }
    if (hasHeap && loopCount > 0) {
      time = nestedLoopSignal ? time : 'O(n log n)';
      evidence.push('Heap operations inside a traversal are typically logarithmic per operation.');
    }
    if (recursionName) {
      evidence.push(`Detected a likely recursive call to ${recursionName}().`);
      space = 'O(h) call stack';
      confidence = 'low';
      if (/fib|fibonacci/i.test(recursionName) && !/memo|cache|lru/i.test(lower)) time = 'O(2ⁿ)';
    }

    if (hasHash || hasQueue || hasHeap) {
      space = space === 'O(h) call stack' ? 'O(n) + call stack' : 'O(n)';
      evidence.push('Detected an auxiliary hash/queue/heap data structure that can grow with input size.');
    }
    if (hasMatrixDP) {
      space = 'O(n²)';
      evidence.push('Detected a likely two-dimensional table/state structure.');
    }

    if (!source.trim()) {
      time = '—'; space = '—'; confidence = 'low'; evidence.push('Write a solution to enable analysis.');
    } else if (!evidence.length) {
      evidence.push('No scaling construct was recognized; verify manually if helper functions hide iteration.');
      confidence = 'low';
    }

    const targetTime = problem?.guide?.targetTime || null;
    const targetSpace = problem?.guide?.targetSpace || null;
    return {
      time,
      space,
      confidence,
      evidence,
      targetTime,
      targetSpace,
      note: 'Static heuristic estimate. Confirm Big-O by reasoning about bounds, recursion depth, and data-structure growth.',
    };
  }

  function detectRecursion(source, language) {
    if (language === 'python') {
      const defs = [...source.matchAll(/^\s*def\s+([A-Za-z_]\w*)\s*\(/gm)].map((m) => m[1]);
      return defs.find((name) => count(source, new RegExp(`\\b${name}\\s*\\(`, 'g')) > 1) || null;
    }
    const funcs = [...source.matchAll(/(?:^|[;{}]\s*)(?:[\w<>\[\],]+\s+)+([A-Za-z_]\w*)\s*\([^;{}]*\)\s*\{/gm)].map((m) => m[1]);
    return funcs.find((name) => count(source, new RegExp(`\\b${name}\\s*\\(`, 'g')) > 1) || null;
  }

  window.ComplexityAnalyzer = { analyze };
})();
