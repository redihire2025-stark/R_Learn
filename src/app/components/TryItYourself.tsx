import { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Maximize2, Minimize2, Code2, Terminal } from "lucide-react";
import { Button } from "./ui/button";
import type { EditorLang } from "../lib/extractLessonCode";

interface TryItYourselfProps {
  code: string;
  language: EditorLang;
  lessonId: string;
}

// ─── srcdoc builders ──────────────────────────────────────────────────────────

const CONSOLE_INTERCEPTOR = `
<script>
(function(){
  const out = document.getElementById('__console__');
  const fmt = (args) => Array.from(args).map(a => {
    if(a === null) return 'null';
    if(a === undefined) return 'undefined';
    if(typeof a === 'object'){try{return JSON.stringify(a,null,2);}catch(e){return String(a);}}
    return String(a);
  }).join(' ');
  const append = (cls, txt) => {
    if(!out) return;
    const d = document.createElement('div');
    d.className = cls;
    const pre = document.createElement('pre');
    pre.textContent = txt;
    d.appendChild(pre);
    out.appendChild(d);
  };
  ['log','info','warn','error'].forEach(m => {
    const orig = console[m];
    console[m] = function(...a){ orig.apply(console,a); append(m, fmt(a)); };
  });
  window.onerror = (msg,_,line,col) => {
    append('error','❌ ' + msg + ' (line '+line+':'+col+')');
    return true;
  };
  window.addEventListener('unhandledrejection', e => {
    append('error','❌ Unhandled Promise: ' + (e.reason?.message || e.reason));
  });
})();
</script>`;

function buildHtmlDoc(code: string): string {
  return code;
}

function buildJsDoc(code: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Fira Mono',monospace;font-size:13px;background:#0d1117;color:#e6edf3;padding:12px;min-height:100vh;}
#__console__{padding:4px 0;}
.log  {color:#e6edf3;padding:2px 0;border-bottom:1px solid #21262d;}
.info {color:#79c0ff;padding:2px 0;border-bottom:1px solid #21262d;}
.warn {color:#f0b429;padding:2px 0;border-bottom:1px solid #21262d;}
.error{color:#ff7b72;padding:2px 0;border-bottom:1px solid #21262d;}
pre  {white-space:pre-wrap;word-break:break-all;margin:0;font-family:inherit;}
</style>
</head>
<body>
<div id="__console__"></div>
${CONSOLE_INTERCEPTOR}
<script>
(async () => {
try {
${code}
} catch(e){ console.error(e.message || e); }
})();
</script>
</body>
</html>`;
}

function buildCssDoc(code: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<style>
/* ── browser reset ── */
*{box-sizing:border-box;}
body{font-family:Arial,sans-serif;margin:0;padding:20px;}
/* ── Your CSS ── */
${code}
</style>
</head>
<body>
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h3>Heading 3</h3>
  <p>A paragraph with <strong>bold</strong>, <em>italic</em>, and <a href="#">a link</a>.</p>
  <ul><li>List item one</li><li>List item two</li><li>List item three</li></ul>
  <ol><li>Ordered one</li><li>Ordered two</li></ol>
  <button class="btn">Button</button>
  <input type="text" placeholder="Text input" />
  <div class="box">div.box</div>
  <div class="container">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
  </div>
  <div class="flex-container">
    <div class="flex-item">Flex A</div>
    <div class="flex-item">Flex B</div>
    <div class="flex-item">Flex C</div>
  </div>
  <div class="grid-container">
    <div class="grid-item">Grid 1</div>
    <div class="grid-item">Grid 2</div>
    <div class="grid-item">Grid 3</div>
    <div class="grid-item">Grid 4</div>
  </div>
  <nav class="navbar"><a href="#">Home</a><a href="#">About</a><a href="#">Contact</a></nav>
</body>
</html>`;
}

function buildReactDoc(code: string): string {
  // Use Babel standalone to transpile JSX/TSX in the browser
  // Wrap in a minimal React+ReactDOM setup
  // Handle both default-export components and function declarations
  const wrappedCode = `
${code}

// Auto-detect and render the root component
(function(){
  const root = document.getElementById('root');
  const dominated = ReactDOM.createRoot(root);
  // Try to find exported/declared component
  const comp = (typeof App !== 'undefined') ? App
    : (typeof default_export !== 'undefined') ? default_export
    : null;
  if(comp) {
    dominated.render(React.createElement(comp));
  } else {
    root.innerHTML = '<p style="color:red;padding:1rem;">Could not find a component to render. Make sure you have a function named <strong>App</strong>.</p>';
  }
})();
`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>
body{font-family:system-ui,sans-serif;margin:0;padding:16px;background:#fff;}
#__error__{color:#ef4444;font-family:monospace;font-size:13px;padding:1rem;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;margin:8px;}
pre{margin:0;white-space:pre-wrap;}
</style>
</head>
<body>
<div id="root"></div>
<div id="__error__" style="display:none"></div>
<script type="text/babel" data-presets="react">
try {
${wrappedCode}
} catch(e) {
  const el = document.getElementById('__error__');
  el.style.display = 'block';
  el.innerHTML = '❌ <pre>' + (e.message||String(e)) + '</pre>';
}
</script>
</body>
</html>`;
}

function buildSrcdoc(code: string, lang: EditorLang): string {
  switch (lang) {
    case "html":       return buildHtmlDoc(code);
    case "css":        return buildCssDoc(code);
    case "javascript": return buildJsDoc(code);
    case "react":      return buildReactDoc(code);
    default:           return buildHtmlDoc(code);
  }
}

// ─── Language display config ──────────────────────────────────────────────────

const LANG_CONFIG: Record<EditorLang, {
  label: string;
  badgeColor: string;
  monacoLang: string;
  previewMode: "browser" | "console";
  runLabel: string;
  hint: string;
}> = {
  html: {
    label: "HTML",
    badgeColor: "text-orange-400 border-orange-400/30 bg-orange-400/10",
    monacoLang: "html",
    previewMode: "browser",
    runLabel: "Try it Yourself »",
    hint: "Edit the HTML and click Run to see it rendered.",
  },
  css: {
    label: "CSS",
    badgeColor: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    monacoLang: "css",
    previewMode: "browser",
    runLabel: "Try it Yourself »",
    hint: "Edit your CSS — the preview shows it applied to sample HTML elements.",
  },
  javascript: {
    label: "JavaScript",
    badgeColor: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    monacoLang: "javascript",
    previewMode: "console",
    runLabel: "Run »",
    hint: "Use console.log() to print output. Click Run to execute.",
  },
  react: {
    label: "React (JSX)",
    badgeColor: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
    monacoLang: "javascript",
    previewMode: "browser",
    runLabel: "Render »",
    hint: "Your component renders live. Name your root component App.",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function TryItYourself({ code: initialCode, language, lessonId }: TryItYourselfProps) {
  const [code, setCode] = useState(initialCode);
  const [srcdoc, setSrcdoc] = useState(() => buildSrcdoc(initialCode, language));
  const [expanded, setExpanded] = useState(false);
  const [runKey, setRunKey] = useState(0); // force iframe remount
  const originalCode = useRef(initialCode);

  useEffect(() => {
    setCode(initialCode);
    const doc = buildSrcdoc(initialCode, language);
    setSrcdoc(doc);
    setRunKey(k => k + 1);
    originalCode.current = initialCode;
  }, [lessonId, initialCode, language]);

  const handleRun = useCallback(() => {
    setSrcdoc(buildSrcdoc(code, language));
    setRunKey(k => k + 1);
  }, [code, language]);

  const handleReset = useCallback(() => {
    setCode(originalCode.current);
    setSrcdoc(buildSrcdoc(originalCode.current, language));
    setRunKey(k => k + 1);
  }, [language]);

  const cfg = LANG_CONFIG[language];
  const isConsole = cfg.previewMode === "console";
  const editorH = expanded ? "420px" : "270px";
  const previewH = expanded ? "320px" : "210px";

  return (
    <div className="my-8">
      <div className={`rounded-xl border border-border shadow-lg overflow-hidden bg-card
        ${expanded ? "fixed inset-4 z-50 shadow-2xl flex flex-col" : "flex flex-col"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold">Example</span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${cfg.badgeColor}`}>
              {cfg.label}
            </span>
          </div>
          <button onClick={() => setExpanded(v => !v)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            title={expanded ? "Minimize" : "Fullscreen"}>
            {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Editor */}
        <div className="border-l-4 border-emerald-500 flex-shrink-0">
          <Editor
            height={editorH}
            language={cfg.monacoLang}
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

        {/* Action bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-t border-b border-border flex-shrink-0">
          <Button size="sm" onClick={handleRun}
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-4 text-xs font-semibold gap-1.5">
            <Play className="w-3.5 h-3.5" />
            {cfg.runLabel}
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset} className="h-8 px-3 text-xs gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
          <span className="ml-2 text-xs text-muted-foreground hidden sm:block">{cfg.hint}</span>
        </div>

        {/* Preview / Console output */}
        <div className={`${expanded ? "flex-1 flex flex-col min-h-0" : ""} border-t border-border`}>
          {/* Preview bar */}
          <div className="px-4 py-1.5 bg-muted/30 border-b border-border flex items-center gap-2 flex-shrink-0">
            {isConsole ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Terminal className="w-3.5 h-3.5" />
                <span>Console Output</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {language === "react" ? "React Preview" : "Browser Preview"}
                </span>
              </div>
            )}
          </div>

          <iframe
            key={runKey}
            srcDoc={srcdoc}
            title="output"
            sandbox="allow-scripts"
            className={`w-full ${expanded ? "flex-1" : ""} ${isConsole ? "bg-zinc-950" : "bg-white"}`}
            style={{
              height: expanded ? undefined : previewH,
              border: "none",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* Backdrop */}
      {expanded && (
        <div className="fixed inset-0 -z-10 bg-black/60" onClick={() => setExpanded(false)} />
      )}
    </div>
  );
}
