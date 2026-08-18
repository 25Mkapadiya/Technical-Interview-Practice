import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = 'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z';
const sections = [
  ['Learn the basics', 54], ['Learn Important Sorting Techniques', 7], ['Solve Problems on Arrays [Easy -> Medium -> Hard]', 40],
  ['Binary Search [1D, 2D Arrays, Search Space]', 32], ['Strings [Basic and Medium]', 15], ['Learn LinkedList [Single LL, Double LL, Medium, Hard Problems]', 31],
  ['Recursion [PatternWise]', 25], ['Bit Manipulation [Concepts & Problems]', 18], ['Stack and Queues [Learning, Pre-In-Post-fix, Monotonic Stack, Implementation]', 30],
  ['Sliding Window & Two Pointer Combined Problems', 12], ['Heaps [Learning, Medium, Hard Problems]', 17], ['Greedy Algorithms [Easy, Medium/Hard]', 15],
  ['Binary Trees [Traversals, Medium and Hard Problems]', 38], ['Binary Search Trees [Concept and Problems]', 16], ['Graphs [Concepts & Problems]', 53],
  ['Dynamic Programming [Patterns and Problems]', 55], ['Tries', 7], ['Strings', 9]
];
const targetCounts = { Easy:152, Medium:186, Hard:136 };

const normalizeDifficulty = value => {
  const m = String(value || '').match(/\b(Easy|Medium|Hard)\b/i);
  return m ? m[1][0].toUpperCase() + m[1].slice(1).toLowerCase() : '';
};
const cleanTitle = value => String(value || '').replace(/\s+/g,' ').replace(/^\d+[.)]\s*/, '').trim();
const asUrl = (value, base=URL) => {
  if (!value || typeof value !== 'string') return '';
  try { return new URL(value, base).href; } catch { return ''; }
};

function objectsFromJson(root) {
  const out = [];
  const seen = new Set();
  const walk = (value, path='') => {
    if (!value || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    if (!Array.isArray(value)) {
      const title = cleanTitle(value.title || value.problemTitle || value.problem_name || value.problemName || value.name || value.questionTitle);
      const diff = normalizeDifficulty(value.difficulty || value.level || value.difficultyLevel);
      if (title.length >= 3 && title.length <= 180 && diff) {
        const links = [];
        for (const [k,v] of Object.entries(value)) {
          if (typeof v === 'string' && /(url|link|href|article|leetcode|gfg|problem)/i.test(k)) {
            const u = asUrl(v); if (u) links.push(u);
          }
        }
        out.push({ title, difficulty: diff, links, path });
      }
    }
    if (Array.isArray(value)) value.forEach((v,i)=>walk(v, `${path}/${i}`));
    else Object.entries(value).forEach(([k,v])=>walk(v, `${path}/${k}`));
  };
  walk(root);
  return out;
}

function dedupe(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]+/g,'');
    if (!key || seen.has(key)) return false;
    seen.add(key); return true;
  });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const apiCandidates = [];
page.on('response', async response => {
  try {
    const type = response.headers()['content-type'] || '';
    if (!type.includes('json')) return;
    const data = await response.json();
    const found = objectsFromJson(data);
    if (found.length) apiCandidates.push(...found);
  } catch {}
});

console.log('Opening', URL);
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(2500);
for (const button of await page.getByText('All Problems', { exact: true }).all()) {
  try { await button.click({ timeout: 2500 }); break; } catch {}
}
await page.waitForTimeout(2500);
for (let i = 0; i < 30; i++) {
  await page.mouse.wheel(0, 1800);
  await page.waitForTimeout(120);
}
await page.evaluate(() => window.scrollTo(0, 0));

const domCandidates = await page.evaluate(() => {
  const diffRe = /\b(Easy|Medium|Hard)\b/i;
  const result = [];
  const all = [...document.querySelectorAll('body *')];
  const difficultyNodes = all.filter(el => {
    const t = (el.textContent || '').trim();
    return /^(Easy|Medium|Hard)$/i.test(t) && el.children.length <= 3;
  });
  for (const diffNode of difficultyNodes) {
    let row = diffNode;
    for (let up=0; up<7 && row; up++, row=row.parentElement) {
      const text = (row.innerText || '').replace(/\s+/g,' ').trim();
      if (text.length < 5 || text.length > 650 || !diffRe.test(text)) continue;
      const anchors = [...row.querySelectorAll('a[href]')].map(a => ({ text:(a.innerText||'').trim(), href:a.href }));
      const clickTexts = [...row.querySelectorAll('button,[role="button"],p,span,h3,h4')]
        .map(n => (n.innerText||'').replace(/\s+/g,' ').trim())
        .filter(t => t.length >= 3 && t.length <= 180 && !/^(Easy|Medium|Hard|Solve|Article|Video|Practice|Done)$/i.test(t));
      const anchorTitle = anchors.map(a=>a.text).filter(t=>t.length>=3 && t.length<=180 && !/^(Solve|Article|Video|Practice)$/i.test(t)).sort((a,b)=>b.length-a.length)[0];
      const textTitle = clickTexts.sort((a,b)=>b.length-a.length)[0];
      const title = anchorTitle || textTitle;
      if (title) {
        result.push({ title, difficulty: (text.match(diffRe)||[])[1] || '', links: anchors.map(a=>a.href), rowText:text });
        break;
      }
    }
  }
  return result;
});

await browser.close();
let candidates = dedupe(domCandidates.map(x=>({ ...x, title:cleanTitle(x.title), difficulty:normalizeDifficulty(x.difficulty) })).filter(x=>x.difficulty));
console.log(`DOM candidates: ${candidates.length}; API candidates: ${dedupe(apiCandidates).length}`);
if (candidates.length !== 474) {
  const api = dedupe(apiCandidates).filter(x=>x.difficulty);
  if (api.length === 474) candidates = api;
}
if (candidates.length !== 474) {
  fs.writeFileSync('sync-debug.json', JSON.stringify({ domCount:candidates.length, dom:candidates.slice(0,520), apiCount:dedupe(apiCandidates).length, api:dedupe(apiCandidates).slice(0,520) }, null, 2));
  throw new Error(`Expected exactly 474 unique problems, found ${candidates.length}. Refusing to overwrite the existing dataset. See sync-debug.json artifact.`);
}

let cursor = 0;
const problems = [];
for (const [topic,count] of sections) {
  for (let i=0; i<count; i++) {
    const item = candidates[cursor];
    const links = [...new Set((item.links || []).map(v=>asUrl(v)).filter(Boolean))];
    const tuf = links.find(u=>u.includes('takeuforward.org') && !u.includes('/dsa/strivers-a2z-sheet')) || '';
    const leetcode = links.find(u=>u.includes('leetcode.com')) || '';
    const gfg = links.find(u=>u.includes('geeksforgeeks.org')) || '';
    const sourceUrl = tuf || leetcode || gfg || links[0] || URL;
    const title = cleanTitle(item.title);
    problems.push({
      id: `a2z-${String(cursor+1).padStart(3,'0')}-${title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,56)}`,
      order: cursor+1,
      title,
      difficulty:item.difficulty,
      topic,
      sourceUrl,
      leetcodeUrl:leetcode || undefined,
      gfgUrl:gfg || undefined,
      metadataStatus:'live-sync'
    });
    cursor++;
  }
}
const actual = problems.reduce((acc,p)=>(acc[p.difficulty]=(acc[p.difficulty]||0)+1,acc),{});
if (Object.entries(targetCounts).some(([k,v])=>actual[k]!==v)) console.warn('Difficulty totals differ from the current page header:', actual, 'expected', targetCounts);

fs.mkdirSync('data', { recursive: true });
const payload = { meta:{ source:URL, sourceLabel:'Striver A2Z', total:problems.length, officialDifficultyCounts:targetCounts, extractedDifficultyCounts:actual, fallback:false, syncedAt:new Date().toISOString() }, problems };
fs.writeFileSync('data/problems.json', JSON.stringify(payload,null,2)+'\n');
console.log('Synced', problems.length, 'problems', actual);
