(function () {
  'use strict';

  const DEFAULT_TIMEOUT = 5000;

  function normalizeOutput(value) {
    return String(value ?? '')
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => line.replace(/[ \t]+$/g, ''))
      .join('\n')
      .trim();
  }

  function workerRun(url, payload, timeout = DEFAULT_TIMEOUT) {
    return new Promise((resolve) => {
      const worker = new Worker(url);
      const started = performance.now();
      let settled = false;
      const finish = (result) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        worker.terminate();
        resolve({ runtimeMs: Math.round(performance.now() - started), ...result });
      };
      const timer = setTimeout(() => finish({ ok: false, timedOut: true, stdout: '', stderr: `Execution exceeded ${timeout}ms.` }), timeout);
      worker.onmessage = (event) => finish(event.data || { ok: false, stdout: '', stderr: 'Worker returned no result.' });
      worker.onerror = (event) => finish({ ok: false, stdout: '', stderr: event.message || 'Worker execution failed.' });
      worker.postMessage(payload);
    });
  }

  async function remoteRun(language, code, stdin, settings, timeout = DEFAULT_TIMEOUT) {
    const endpoint = String(settings?.runnerEndpoint || '').trim();
    if (!endpoint) {
      return {
        ok: false,
        stdout: '',
        stderr: `${language === 'cpp' ? 'C++' : 'Java'} needs a configured remote runner. Open Settings and add a Piston-compatible execution endpoint.`,
        runtimeMs: 0,
        configurationError: true,
      };
    }

    const languageName = language === 'cpp' ? 'cpp' : 'java';
    const filename = language === 'cpp' ? 'main.cpp' : 'Main.java';
    const headers = { 'Content-Type': 'application/json' };
    if (settings?.runnerToken) headers.Authorization = `Bearer ${settings.runnerToken}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout + 2500);
    const started = performance.now();

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          language: languageName,
          version: '*',
          files: [{ name: filename, content: code }],
          stdin,
          run_timeout: timeout,
          compile_timeout: timeout,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { ok: false, stdout: '', stderr: body?.message || body?.error || `Runner returned HTTP ${response.status}.`, runtimeMs: Math.round(performance.now() - started) };
      }
      const compile = body?.compile || {};
      const run = body?.run || body || {};
      const stderr = [compile.stderr, run.stderr].filter(Boolean).join('\n');
      const stdout = run.stdout || '';
      const exitCode = run.code ?? compile.code ?? 0;
      return {
        ok: !stderr && exitCode === 0,
        stdout,
        stderr,
        exitCode,
        runtimeMs: Math.round(performance.now() - started),
      };
    } catch (error) {
      return { ok: false, stdout: '', stderr: error.name === 'AbortError' ? 'Remote execution timed out.' : `Runner request failed: ${error.message}`, runtimeMs: Math.round(performance.now() - started) };
    } finally {
      clearTimeout(timer);
    }
  }

  async function run({ language, code, stdin = '', timeout = DEFAULT_TIMEOUT, settings = {} }) {
    if (language === 'python') return workerRun('workers/python-worker.js', { code, stdin }, Math.max(timeout, 9000));
    if (language === 'javascript') return workerRun('workers/js-worker.js', { code, stdin }, timeout);
    if (language === 'cpp' || language === 'java') return remoteRun(language, code, stdin, settings, timeout);
    return { ok: false, stdout: '', stderr: `Unsupported language: ${language}`, runtimeMs: 0 };
  }

  async function runTests({ language, code, tests = [], timeout = DEFAULT_TIMEOUT, settings = {}, onProgress }) {
    const results = [];
    for (let i = 0; i < tests.length; i += 1) {
      const test = tests[i];
      const execution = await run({ language, code, stdin: test.stdin || '', timeout, settings });
      const actual = normalizeOutput(execution.stdout);
      const expected = normalizeOutput(test.expected);
      const passed = execution.ok && actual === expected;
      const result = { ...test, ...execution, actual, expected, passed };
      results.push(result);
      if (onProgress) onProgress(result, i, tests.length);
      if (execution.configurationError) break;
    }
    return {
      results,
      passed: results.length === tests.length && results.every((result) => result.passed),
      passedCount: results.filter((result) => result.passed).length,
      total: tests.length,
      runtimeMs: results.reduce((sum, result) => sum + (result.runtimeMs || 0), 0),
    };
  }

  window.Runner = { run, runTests, normalizeOutput };
})();
