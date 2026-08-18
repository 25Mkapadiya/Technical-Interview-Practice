(function () {
  'use strict';
  const originalFetch = window.fetch.bind(window);
  const seedUrl = 'https://raw.githubusercontent.com/septilex/a2z-tracker/main/dsa_tracker/a2z_problems_simple.json';
  const sheetUrl = 'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z';
  const slug = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 56);

  window.fetch = async function interviewLabFetch(input, init) {
    const url = typeof input === 'string' ? input : input?.url || '';
    if (!/^data\/problems\.json(?:\?|$)/.test(url)) return originalFetch(input, init);

    const local = await originalFetch(input, init).catch(() => null);
    if (local?.ok) return local;

    try {
      const seedResponse = await originalFetch(seedUrl, { cache: 'no-store' });
      if (!seedResponse.ok) return local || seedResponse;
      const rows = await seedResponse.json();
      if (!Array.isArray(rows) || rows.length !== 474) return local || new Response('', { status: 502 });

      const problems = rows.map((row, index) => ({
        id: `a2z-${String(index + 1).padStart(3, '0')}-${slug(row.problem_name)}`,
        order: index + 1,
        title: row.problem_name,
        topic: row.topic,
        difficulty: row.difficulty,
        sourceUrl: row.leetcode_url || sheetUrl,
        leetcodeUrl: row.leetcode_url || undefined,
        youtubeUrl: row.youtube_url || undefined,
        metadataStatus: 'verified-seed',
      }));
      const counts = problems.reduce((out, problem) => {
        out[problem.difficulty] = (out[problem.difficulty] || 0) + 1;
        return out;
      }, {});
      const payload = {
        meta: {
          source: sheetUrl,
          sourceLabel: 'Striver A2Z',
          total: 474,
          officialDifficultyCounts: { Easy: 152, Medium: 186, Hard: 136 },
          extractedDifficultyCounts: counts,
          fallback: false,
          seedSource: 'septilex/a2z-tracker verified 474-problem dataset',
        },
        problems,
      };
      return new Response(JSON.stringify(payload), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.warn('Verified A2Z seed unavailable.', error);
      return local || new Response('', { status: 503 });
    }
  };
})();
