/**
 * Real in-browser code runner using a sandboxed iframe.
 * Executes user's JS/TS code against each test case and returns real pass/fail.
 */

export interface TestCase {
  input?: unknown;
  target?: number;
  expected: unknown;
}

export interface TestResult {
  index: number;
  label: string;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
  consoleOutput: string[];
}

export interface RunResult {
  results: TestResult[];
  allPassed: boolean;
  runtime: string;
  consoleOutput: string[];
}

// Detect the function name from starter/user code
function detectFunctionName(code: string): string | null {
  const match = code.match(/^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+(\w+)/m)
    || code.match(/const\s+(\w+)\s*=\s*(?:async\s*)?\(/m)
    || code.match(/(?:export\s+default\s+)?(?:async\s+)?function\s+(\w+)/m);
  return match ? match[1] : null;
}

// Build the iframe srcdoc that runs code against test cases and postMessages results
function buildRunnerDoc(code: string, testCases: TestCase[], fnName: string): string {
  const testCasesJson = JSON.stringify(testCases);

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script>
const logs = [];
const origLog = console.log;
const origWarn = console.warn;
const origError = console.error;
const capture = (type, args) => {
  const line = Array.from(args).map(a => {
    if (a === null) return 'null';
    if (a === undefined) return 'undefined';
    if (typeof a === 'object') { try { return JSON.stringify(a); } catch(e) { return String(a); } }
    return String(a);
  }).join(' ');
  logs.push('[' + type + '] ' + line);
};
console.log   = (...a) => { origLog(...a);   capture('log',   a); };
console.warn  = (...a) => { origWarn(...a);  capture('warn',  a); };
console.error = (...a) => { origError(...a); capture('error', a); };

function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    // For arrays of arrays (like groupAnagrams), sort inner arrays
    const sortedA = a.map(x => Array.isArray(x) ? [...x].sort().join(',') : x).sort();
    const sortedB = b.map(x => Array.isArray(x) ? [...x].sort().join(',') : x).sort();
    return sortedA.every((v, i) => v === sortedB[i]);
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a).sort(), kb = Object.keys(b).sort();
    if (ka.join() !== kb.join()) return false;
    return ka.every(k => deepEqual(a[k], b[k]));
  }
  return false;
}

function serialize(v) {
  if (v === undefined) return 'undefined';
  try { return JSON.stringify(v); } catch(e) { return String(v); }
}

(async function() {
  const results = [];
  const testCases = ${testCasesJson};
  const start = performance.now();

  try {
    // Inject and parse user code
    ${code.replace(/`/g, '\\`').replace(/\\\$/g, '$')}
  } catch(e) {
    // Syntax/parse error — fail all test cases
    window.parent.postMessage({
      type: 'run-error',
      error: e.message,
      logs: logs,
    }, '*');
    return;
  }

  const fn = (typeof ${fnName} !== 'undefined') ? ${fnName} : null;
  if (!fn) {
    window.parent.postMessage({
      type: 'run-error',
      error: 'Function "${fnName}" not found. Make sure your function is named correctly.',
      logs: logs,
    }, '*');
    return;
  }

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const tcLogs = [];
    let actual;
    let error;
    let passed = false;

    try {
      // Handle different input shapes
      let result;
      if (tc.input !== undefined && tc.target !== undefined) {
        // Two-argument: e.g. binarySearch(nums, target)
        result = await fn(tc.input, tc.target);
      } else if (tc.input !== undefined) {
        // Spread if array of args, otherwise single arg
        result = await fn(tc.input);
      } else {
        result = await fn();
      }
      actual = result;
      passed = deepEqual(actual, tc.expected);
    } catch(e) {
      error = e.message;
      actual = undefined;
      passed = false;
    }

    results.push({
      index: i + 1,
      label: 'Test case ' + (i + 1),
      passed,
      input: serialize(tc.input !== undefined ? (tc.target !== undefined ? {input: tc.input, target: tc.target} : tc.input) : null),
      expected: serialize(tc.expected),
      actual: serialize(actual),
      error,
      consoleOutput: [...logs],
    });
  }

  const runtime = (performance.now() - start).toFixed(0) + 'ms';
  window.parent.postMessage({
    type: 'run-complete',
    results,
    runtime,
    logs,
  }, '*');
})();
</script>
</body>
</html>`;
}

// Strip TypeScript types for execution
function stripTypes(code: string): string {
  return code
    .replace(/:\s*(string|number|boolean|void|any|never|unknown|null|undefined|object)(\[\])?\b(\s*\|[^=,);\n]+)?/g, "")
    .replace(/:\s*[A-Z][A-Za-z<>\[\]|&, ]+(?=[=,);{\n])/g, "")
    .replace(/<[A-Z][A-Za-z<>[\], ]*>/g, "")
    .replace(/interface\s+\w+\s*\{[^}]*\}/gs, "")
    .replace(/type\s+\w+\s*=\s*[^;]+;/g, "")
    .replace(/^import type .+$/gm, "")
    .replace(/\bexport\s+(default\s+)?/g, "")
    .trim();
}

export function runCode(
  code: string,
  language: string,
  testCases: TestCase[],
): Promise<RunResult> {
  return new Promise((resolve) => {
    const execCode = language === "typescript" ? stripTypes(code) : code;
    const fnName = detectFunctionName(execCode) ?? "solution";

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.sandbox.add("allow-scripts");
    document.body.appendChild(iframe);

    const timeout = setTimeout(() => {
      cleanup();
      resolve({
        results: testCases.map((_, i) => ({
          index: i + 1,
          label: `Test case ${i + 1}`,
          passed: false,
          input: serialize(testCases[i].input),
          expected: serialize(testCases[i].expected),
          actual: "timeout",
          error: "Execution timed out (5s). Check for infinite loops.",
          consoleOutput: [],
        })),
        allPassed: false,
        runtime: "timeout",
        consoleOutput: [],
      });
    }, 5000);

    function cleanup() {
      clearTimeout(timeout);
      window.removeEventListener("message", handler);
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
    }

    function handler(event: MessageEvent) {
      if (event.source !== iframe.contentWindow) return;
      const data = event.data;
      cleanup();

      if (data.type === "run-error") {
        resolve({
          results: testCases.map((tc, i) => ({
            index: i + 1,
            label: `Test case ${i + 1}`,
            passed: false,
            input: serialize(tc.input),
            expected: serialize(tc.expected),
            actual: "error",
            error: data.error,
            consoleOutput: data.logs ?? [],
          })),
          allPassed: false,
          runtime: "0ms",
          consoleOutput: data.logs ?? [],
        });
        return;
      }

      if (data.type === "run-complete") {
        const results: TestResult[] = data.results;
        resolve({
          results,
          allPassed: results.every((r) => r.passed),
          runtime: data.runtime,
          consoleOutput: data.logs ?? [],
        });
      }
    }

    window.addEventListener("message", handler);
    iframe.srcdoc = buildRunnerDoc(execCode, testCases, fnName);
  });
}

function serialize(v: unknown): string {
  if (v === undefined) return "undefined";
  try { return JSON.stringify(v); } catch { return String(v); }
}
