import { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Maximize2, Minimize2, Code2, Terminal } from "lucide-react";
import { Button } from "./ui/button";
import type { EditorLang } from "../lib/extractLessonCode";

interface TryItYourselfProps {
  code: string;
  language: EditorLang;
  lessonId: string; // key to reset editor on lesson change
}

// ─── iframe srcdoc builders ───────────────────────────────────────────────────

function buildHtmlSrcdoc(code: string): string {
  return code;
}

function buildJsSrcdoc(code: string): string {
  // Intercept console.log/warn/error and post them to parent
  return `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: monospace; font-size: 13px; background: #0d1117; color: #e6edf3; margin: 0; padding: 12px; }
  .log   { color: #e6edf3; margin: 2px 0; }
  .warn  { color: #f0b429; margin: 2px 0; }
  .error { color: #ff7b72; margin: 2px 0; }
  .info  { color: #79c0ff; margin: 2px 0; }
  pre    { margin: 0; white-space: pre-wrap; word-break: break-all; }
</style>
</head>
<body id="output">
<script>
(function() {
  const out = document.getElementById('output');
  function fmt(args) {
    return Array.from(args).map(a => {
      if (typeof a === 'object' && a !== null) {
        try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); }
      }
      return String(a);
    }).join(' ');
  }
  ['log','warn','error','info'].forEach(method => {
    const orig = console[method];
    console[method] = function(...args) {
      orig.apply(console, args);
      const div = document.createElement('div');
      div.className = method;
      div.innerHTML = '<pre>' + fmt(args).replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre>';
      out.appendChild(div);
    };
  });
  window.onerror = function(msg, src, line, col, err) {
    const div = document.createElement('div');
    div.className = 'error';
    div.innerHTML = '<pre>❌ ' + String(msg).replace(/</g,'&lt;') + ' (line ' + line + ')</pre>';
    out.appendChild(div);
    return true;
  };
})();
</script>
<script>
${code}
</script>
</body>
</html>`;
}

function buildCssSrcdoc(code: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<style>
/* Reset */
* { box-sizing: border-box; }
body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }

/* ── Your CSS below ── */
${code}
</style>
</head>
<body>
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <p>This is a paragraph with some <strong>bold</strong> and <em>italic</em> text.</p>
  <a href="#">A link</a>
  <ul>
    <li>List item one</li>
    <li>List item two</li>
    <li>List item three</li>
  </ul>
  <button>A Button</button>
  <div class="box">A div with class "box"</div>
  <div class="container">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
  </div>
</body>
</html>`;
}

function buildSrcdoc(code: string, lang: EditorLang): string {
  if (lang === "html") return buildHtmlSrcdoc(code);
  if (lang === "javascript") return buildJsSrcdoc(code);
  if (lang === "css") return buildCssSrcdoc(code);
  return code;
}

// ─── Language config ──────────────────────────────────────────────────────────

const LANG_META: Record<EditorLang, { label: string; color: string; previewLabel: string }> = {
  html:       { label: "HTML",       color: "text-orange-400", previewLabel: "Preview" },
  javascript: { label: "JavaScript", color: "text-yellow-400", previewLabel: "Console Output" },
  css:        { label: "CSS",        color: "text-blue-400",   previewLabel: "Preview" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function TryItYourself({ code: initialCode, language, lessonId }: TryItYourselfProps) {
  const [code, setCode] = useState(initialCode);
  const [srcdoc, setSrcdoc] = useState(() => buildSrcdoc(initialCode, language));
  const [expanded, setExpanded] = useState(false);
  const [hasRun, setHasRun] = useState(true); // show initial output immediately
  const originalCode = useRef(initialCode);

  // Reset when lesson changes
  useEffect(() => {
    setCode(initialCode);
    setSrcdoc(buildSrcdoc(initialCode, language));
    setHasRun(true);
    originalCode.current = initialCode;
  }, [lessonId, initialCode, language]);

  const handleRun = useCallback(() => {
    setSrcdoc(buildSrcdoc(code, language));
    setHasRun(true);
  }, [code, language]);

  const handleReset = useCallback(() => {
    setCode(originalCode.current);
    setSrcdoc(buildSrcdoc(originalCode.current, language));
    setHasRun(true);
  }, [language]);

  const meta = LANG_META[language];
  const isJS = language === "javascript";

  const editorH = expanded ? "400px" : "260px";
  const previewH = expanded ? "300px" : "200px";

  return (
    <div className="my-8">
      <div className={`rounded-xl border border-border shadow-lg overflow-hidden bg-card ${expanded ? "fixed inset-4 z-50 shadow-2xl flex flex-col" : ""}`}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-foreground">Example</span>
            <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-muted border border-border ${meta.color}`}>
              {meta.label}
            </span>
          </div>
          <button onClick={() => setExpanded(v => !v)} className="text-muted-foreground hover:text-foreground transition-colors" title={expanded ? "Minimize" : "Expand"}>
            {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* ── Editor ── */}
        <div className="border-l-4 border-emerald-500 flex-shrink-0">
          <Editor
            height={editorH}
            language={language === "javascript" ? "javascript" : language}
            value={code}
            onChange={v => setCode(v ?? "")}
            theme="vs-dark"
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              renderLineHighlight: "line",
              padding: { top: 10, bottom: 10 },
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        </div>

        {/* ── Action bar ── */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-t border-border flex-shrink-0">
          <Button size="sm" onClick={handleRun} className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-4 text-xs font-semibold">
            <Play className="w-3.5 h-3.5 mr-1.5" />
            {isJS ? "Run »" : "Try it Yourself »"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset} className="h-8 px-3 text-xs">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
          <span className="ml-auto text-xs text-muted-foreground">
            {isJS ? "Edit the code above and click Run to see output" : "Edit and click Try it Yourself to see the result"}
          </span>
        </div>

        {/* ── Preview / Console ── */}
        <div className={`border-t border-border ${expanded ? "flex-1 flex flex-col min-h-0" : ""}`}>
          {/* Preview chrome bar */}
          <div className="px-4 py-1.5 bg-muted/30 border-b border-border flex items-center gap-2 flex-shrink-0">
            {isJS ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Terminal className="w-3.5 h-3.5" />
                <span>Console Output</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">Result</span>
              </div>
            )}
          </div>

          {hasRun ? (
            <iframe
              key={srcdoc} // force remount on each run so scripts re-execute
              srcDoc={srcdoc}
              title="output"
              sandbox="allow-scripts"
              className={`w-full ${expanded ? "flex-1" : ""} ${isJS ? "bg-zinc-950" : "bg-white"}`}
              style={{ height: expanded ? undefined : previewH, border: "none", display: "block" }}
            />
          ) : (
            <div className="flex items-center justify-center text-muted-foreground text-sm" style={{ height: previewH }}>
              Click <span className="mx-1 font-semibold text-emerald-600">Run</span> to see output
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for expanded mode */}
      {expanded && (
        <div className="fixed inset-0 -z-10 bg-black/50" onClick={() => setExpanded(false)} />
      )}
    </div>
  );
}
