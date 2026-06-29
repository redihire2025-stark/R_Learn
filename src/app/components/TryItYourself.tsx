import { useState, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Maximize2, Minimize2, Code2 } from "lucide-react";
import { Button } from "./ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";

interface TryItYourselfProps {
  defaultCode?: string;
  language?: "html" | "javascript" | "css";
}

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
</head>
<body>

<h1>My First Heading</h1>
<p>My first paragraph.</p>

</body>
</html>`;

const DEFAULT_JS = `// Try your JavaScript here
console.log("Hello, World!");

// Example: manipulate the DOM
document.body.innerHTML = '<h1>Hello from JavaScript!</h1><p>Edit me and click Run!</p>';`;

const DEFAULT_CSS = `/* Try your CSS here */
body {
  font-family: Arial, sans-serif;
  background: #f0f4f8;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

h1 {
  color: #2d6a4f;
  font-size: 2rem;
}`;

function getDefaultCode(lang: string, provided?: string) {
  if (provided) return provided;
  if (lang === "javascript") return DEFAULT_JS;
  if (lang === "css") return DEFAULT_CSS;
  return DEFAULT_HTML;
}

function buildSrcdoc(code: string, lang: string): string {
  if (lang === "html") return code;
  if (lang === "javascript") {
    return `<!DOCTYPE html><html><body><script>${code}<\/script></body></html>`;
  }
  if (lang === "css") {
    return `<!DOCTYPE html><html><head><style>${code}</style></head><body><h1>Styled Heading</h1><p>This paragraph is styled by your CSS above.</p></body></html>`;
  }
  return code;
}

export function TryItYourself({ defaultCode, language = "html" }: TryItYourselfProps) {
  const [code, setCode] = useState(() => getDefaultCode(language, defaultCode));
  const [srcdoc, setSrcdoc] = useState(() => buildSrcdoc(getDefaultCode(language, defaultCode), language));
  const [expanded, setExpanded] = useState(false);
  const originalCode = useRef(getDefaultCode(language, defaultCode));

  const handleRun = useCallback(() => {
    setSrcdoc(buildSrcdoc(code, language));
  }, [code, language]);

  const handleReset = useCallback(() => {
    setCode(originalCode.current);
    setSrcdoc(buildSrcdoc(originalCode.current, language));
  }, [language]);

  const editorHeight = expanded ? "500px" : "280px";

  return (
    <div className={`my-8 rounded-xl border border-border shadow-md overflow-hidden bg-card ${expanded ? "fixed inset-4 z-50 shadow-2xl" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Code2 className="w-4 h-4 text-emerald-500" />
          <span>Example</span>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title={expanded ? "Minimize" : "Expand"}
        >
          {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Editor area */}
      <div className="border-l-4 border-emerald-500 bg-white dark:bg-zinc-950">
        <Editor
          height={editorHeight}
          language={language === "html" ? "html" : language}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          theme="vs-dark"
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            renderLineHighlight: "line",
            padding: { top: 12, bottom: 12 },
            automaticLayout: true,
          }}
        />
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-t border-border">
        <Button
          size="sm"
          onClick={handleRun}
          className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-4 text-xs font-semibold"
        >
          <Play className="w-3.5 h-3.5 mr-1.5" />
          Try it Yourself »
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          className="h-8 px-3 text-xs"
          title="Reset to original"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset
        </Button>
      </div>

      {/* Preview panel */}
      <div className="border-t border-border">
        <div className="px-4 py-2 bg-muted/30 border-b border-border flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">Result</span>
        </div>
        <iframe
          srcDoc={srcdoc}
          title="Try it yourself preview"
          sandbox="allow-scripts"
          className="w-full bg-white"
          style={{ height: expanded ? "340px" : "220px", border: "none", display: "block" }}
        />
      </div>

      {/* Overlay backdrop for expanded mode */}
      {expanded && (
        <div
          className="fixed inset-0 -z-10 bg-black/50"
          onClick={() => setExpanded(false)}
        />
      )}
    </div>
  );
}
