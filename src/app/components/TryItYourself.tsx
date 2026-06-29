import { useState, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Maximize2, Minimize2, Code2 } from "lucide-react";
import { Button } from "./ui/button";

interface TryItYourselfProps {
  code: string;
  language: "html" | "javascript" | "css";
}

function buildSrcdoc(code: string, lang: string): string {
  if (lang === "html") return code;
  if (lang === "javascript") {
    return `<!DOCTYPE html><html><body><script>\n${code}\n<\/script></body></html>`;
  }
  if (lang === "css") {
    return `<!DOCTYPE html><html><head><style>${code}</style></head><body><h1>Styled Heading</h1><p>This paragraph is styled by your CSS above.</p><ul><li>List item one</li><li>List item two</li></ul></body></html>`;
  }
  return code;
}

export function TryItYourself({ code: initialCode, language }: TryItYourselfProps) {
  const [code, setCode] = useState(initialCode);
  const [srcdoc, setSrcdoc] = useState(() => buildSrcdoc(initialCode, language));
  const [expanded, setExpanded] = useState(false);
  const originalCode = useRef(initialCode);

  const handleRun = useCallback(() => {
    setSrcdoc(buildSrcdoc(code, language));
  }, [code, language]);

  const handleReset = useCallback(() => {
    setCode(originalCode.current);
    setSrcdoc(buildSrcdoc(originalCode.current, language));
  }, [language]);

  const editorHeight = expanded ? "460px" : "280px";
  const previewHeight = expanded ? "360px" : "220px";

  const panel = (
    <div className={`rounded-xl border border-border shadow-md overflow-hidden bg-card ${expanded ? "fixed inset-4 z-50 shadow-2xl flex flex-col" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Code2 className="w-4 h-4 text-emerald-500" />
          <span>Example</span>
          <span className="text-xs font-normal text-muted-foreground ml-1 bg-muted px-1.5 py-0.5 rounded">{language.toUpperCase()}</span>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title={expanded ? "Minimize" : "Expand"}
        >
          {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Editor */}
      <div className="border-l-4 border-emerald-500 bg-zinc-950 flex-shrink-0">
        <Editor
          height={editorHeight}
          language={language}
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
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-t border-border flex-shrink-0">
        <Button
          size="sm"
          onClick={handleRun}
          className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-4 text-xs font-semibold"
        >
          <Play className="w-3.5 h-3.5 mr-1.5" />
          Try it Yourself »
        </Button>
        <Button size="sm" variant="outline" onClick={handleReset} className="h-8 px-3 text-xs" title="Reset to original">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset
        </Button>
      </div>

      {/* Preview */}
      <div className={`border-t border-border ${expanded ? "flex-1 flex flex-col min-h-0" : ""}`}>
        <div className="px-4 py-2 bg-muted/30 border-b border-border flex items-center gap-2 flex-shrink-0">
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
          className={`w-full bg-white ${expanded ? "flex-1" : ""}`}
          style={{ height: expanded ? undefined : previewHeight, border: "none", display: "block" }}
        />
      </div>
    </div>
  );

  return (
    <div className="my-8">
      {panel}
      {expanded && (
        <div className="fixed inset-0 -z-10 bg-black/50" onClick={() => setExpanded(false)} />
      )}
    </div>
  );
}
