self.onmessage = (event) => {
  const { code = '', stdin = '' } = event.data || {};
  const output = [];
  const errors = [];
  const format = (value) => {
    if (typeof value === 'string') return value;
    try { return JSON.stringify(value); } catch (_) { return String(value); }
  };
  const localConsole = {
    log: (...args) => output.push(args.map(format).join(' ')),
    error: (...args) => errors.push(args.map(format).join(' ')),
    warn: (...args) => errors.push(args.map(format).join(' ')),
  };
  const lines = String(stdin).replace(/\r\n/g, '\n').split('\n');
  let lineIndex = 0;
  const readline = () => lines[lineIndex++] ?? '';
  try {
    const fn = new Function('__INPUT__', 'readline', 'console', 'require', 'process', 'window', 'document', `"use strict";\n${code}`);
    fn(stdin, readline, localConsole, undefined, undefined, undefined, undefined);
    self.postMessage({ ok: errors.length === 0, stdout: output.join('\n'), stderr: errors.join('\n'), exitCode: errors.length ? 1 : 0 });
  } catch (error) {
    self.postMessage({ ok: false, stdout: output.join('\n'), stderr: `${error.name}: ${error.message}\n${error.stack || ''}`.trim(), exitCode: 1 });
  }
};
