# Interview Lab · A2Z Practice

A dark, LeetCode-inspired personal interview-prep workspace built around Striver's A2Z DSA roadmap.

## What it includes

- Full 474-item A2Z roadmap structure with scheduled live metadata sync
- Search, topic/difficulty/status filters, progress, streaks, and revision queue
- Independent hash URL for every problem (`#problem=<id>`)
- Monaco code editor with Python, JavaScript, C++, and Java modes
- Python execution entirely in-browser via Pyodide
- JavaScript execution inside a disposable Web Worker with a timeout
- Optional Piston-compatible remote runner for C++ and Java
- Run vs Submit workflow with curated visible + hidden edge tests where a local oracle is trustworthy
- Original progressive hints and interview approach coaching
- Static heuristic time/space complexity analysis with evidence and confidence
- Interview Mode that hides coaching and starts a timer
- Local-only saved code, submission history, progress, and settings

## Why statements are concise

The project intentionally does not copy hundreds of third-party problem statements or editorials. The live sync stores problem metadata and canonical source links. Interview Lab generates its own concise practice brief, hints, testing contract, and learning guidance.

## Run locally

Serve the repository over HTTP so Web Workers and Pyodide can load correctly:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## C++ / Java execution

The Settings panel accepts a Piston-compatible `/api/v2/piston/execute` endpoint and optional bearer token. Python and JavaScript need no backend.

## A2Z sync

`.github/workflows/sync-striver.yml` opens the current TakeUForward A2Z page in Playwright, extracts the 474-problem list, validates the count, then refreshes `data/problems.json`. It refuses to overwrite the current dataset if extraction is incomplete.

The workflow runs weekly, on manual dispatch, and whenever the sync script changes.

## Validation note

No finite hand-written test suite can prove correctness for every possible input. Curated suites are designed to catch common edge cases. Problems without a trustworthy local oracle are clearly marked `custom` instead of pretending they have full hidden-test coverage.
