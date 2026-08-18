let pyodideReady;

async function getPyodide() {
  if (!pyodideReady) {
    pyodideReady = (async () => {
      importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
      return self.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/' });
    })();
  }
  return pyodideReady;
}

self.onmessage = async (event) => {
  const { id = 0, code = '', stdin = '' } = event.data || {};
  try {
    const pyodide = await getPyodide();
    pyodide.globals.set('__interview_lab_stdin__', String(stdin));
    pyodide.globals.set('__interview_lab_code__', String(code));
    const result = await pyodide.runPythonAsync(`
import sys, io, traceback
_stdout = io.StringIO()
_stderr = io.StringIO()
_old_out, _old_err, _old_in = sys.stdout, sys.stderr, sys.stdin
sys.stdout, sys.stderr, sys.stdin = _stdout, _stderr, io.StringIO(__interview_lab_stdin__)
_ok = True
try:
    exec(compile(__interview_lab_code__, '<solution>', 'exec'), {'__name__': '__main__'})
except BaseException:
    _ok = False
    traceback.print_exc(file=_stderr)
finally:
    sys.stdout, sys.stderr, sys.stdin = _old_out, _old_err, _old_in
(_ok, _stdout.getvalue(), _stderr.getvalue())
`);
    const values = result.toJs ? result.toJs() : result;
    if (result.destroy) result.destroy();
    self.postMessage({ id, ok: Boolean(values[0]), stdout: String(values[1] || ''), stderr: String(values[2] || ''), exitCode: values[0] ? 0 : 1 });
  } catch (error) {
    self.postMessage({ id, ok: false, stdout: '', stderr: `Python runtime error: ${error.message}`, exitCode: 1 });
  }
};
