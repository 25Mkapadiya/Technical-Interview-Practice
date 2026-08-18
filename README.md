# Interview Lab · A2Z Practice

A dark, LeetCode-inspired personal interview-prep workspace built around Striver's A2Z DSA roadmap.

## What it includes

- Full 474-item A2Z roadmap with exact-title seed data plus scheduled live metadata sync
- Search, topic/difficulty/status filters, progress, streaks, and revision queue
- Independent hash URL for every problem (`#problem=<id>`)
- Monaco code editor with Python, JavaScript, C++, and Java modes
- Python execution entirely in-browser via Pyodide
- JavaScript execution inside a disposable Web Worker with a timeout
- Optional Piston-compatible remote runner for C++ and Java
- Run vs Submit workflow with curated edge tests where a local oracle is trustworthy
- Original progressive hints and interview approach coaching
- Static heuristic time/space complexity analysis with evidence and confidence
- Interview Mode that hides coaching and starts a timer
- Local-only saved code, submission history, progress, and settings
- GitHub Pages deployment with a JavaScript syntax gate

## Problem metadata

The app first uses a locally synced `data/problems.json` when available. If that file has not been generated yet, it loads the public 474-problem verified dataset from `septilex/a2z-tracker` and validates the count before using it. A built-in 474-item structural fallback is the last resort.

`.github/workflows/sync-striver.yml` is the ongoing source-of-truth refresh. It opens the current TakeUForward A2Z page in Playwright, extracts the list, and refuses to replace the dataset unless it finds exactly 474 unique entries.

The project intentionally does not copy hundreds of third-party problem statements or editorials. It stores metadata and canonical links, then provides its own concise practice briefs, hints, testing contracts, and interview-learning guidance.

## Run locally

Serve the repository over HTTP so Web Workers and Pyodide can load correctly:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## C++ / Java execution

The Settings panel accepts a Piston-compatible `/api/v2/piston/execute` endpoint and optional bearer token. Python and JavaScript need no backend.

## Validation note

No finite hand-written test suite can prove correctness for every possible input. Curated suites are designed to catch common edge cases. Problems without a trustworthy local oracle are clearly marked `custom` instead of pretending they have complete hidden-test coverage.
