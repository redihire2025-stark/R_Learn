import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  ArrowLeft, Play, Send, CheckCircle, CheckCircle2, XCircle,
  Terminal, FileText, Lightbulb, Clock, Cpu, MemoryStick, Trophy,
  ChevronDown, ChevronRight, Monitor,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../components/ui/resizable";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../../components/ui/skeleton";
import { runCode, type TestResult, type RunResult, buildHTMLPreviewDoc, buildCSSPreviewDoc, buildTailwindPreviewDoc } from "../../lib/codeRunner";
import { detectChallengeType, type ChallengeTypeInfo } from "../../lib/challengeType";

interface Challenge {
  id: string; title: string; description: string; difficulty: string; category: string; points: number;
  starter_code_js: string; starter_code_ts: string; starter_code_python: string;
  test_cases: { input?: unknown; target?: number; expected: unknown }[];
}

const diffColor: Record<string, string> = {
  Easy: "text-emerald-600 dark:text-emerald-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Hard: "text-rose-600 dark:text-rose-400",
};
const diffBg: Record<string, string> = {
  Easy: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30",
  Medium: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30",
  Hard: "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30",
};

// Detect function name from code
function detectFnName(code: string): string {
  const m = code.match(/(?:async\s+)?function\s+(\w+)/m)
    || code.match(/const\s+(\w+)\s*=/m);
  return m?.[1] ?? "solution";
}

// ── Test case expandable row ──────────────────────────────────────────────────
function TestCaseRow({ result, defaultOpen }: { result: TestResult; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className={`rounded-lg border text-xs font-mono overflow-hidden ${
      result.passed ? "bg-emerald-500/[0.06] border-emerald-500/25" : "bg-rose-500/[0.06] border-rose-500/25"
    }`}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-white/5 transition-colors">
        {result.passed
          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          : <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />}
        <span className={`flex-1 font-semibold ${result.passed ? "text-emerald-400" : "text-rose-400"}`}>{result.label}</span>
        <span className={`text-[10px] font-bold uppercase tracking-widest mr-1 ${result.passed ? "text-emerald-500/70" : "text-rose-500/70"}`}>
          {result.passed ? "PASS" : "FAIL"}
        </span>
        {open ? <ChevronDown className="w-3 h-3 text-zinc-500" /> : <ChevronRight className="w-3 h-3 text-zinc-500" />}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-1.5 border-t border-white/5 pt-2">
          <div><span className="text-zinc-500">Input: </span><span className="text-zinc-200">{result.input}</span></div>
          <div><span className="text-zinc-500">Expected: </span><span className="text-emerald-300">{result.expected}</span></div>
          <div><span className="text-zinc-500">Got: </span><span className={result.passed ? "text-emerald-300" : "text-rose-300"}>{result.actual}</span></div>
          {result.error && (
            <div className="mt-1 p-2 bg-rose-500/10 border border-rose-500/20 rounded text-rose-300 text-[11px]">❌ {result.error}</div>
          )}
          {result.consoleOutput.length > 0 && (
            <div className="mt-1 p-2 bg-zinc-800/60 rounded text-zinc-300 text-[11px] space-y-0.5">
              <div className="text-zinc-500 mb-1">Console:</div>
              {result.consoleOutput.map((line, i) => <div key={i}>{line}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Live preview panel (HTML/CSS challenges) ──────────────────────────────────
function LivePreview({ code, challengeType, previewKey }: { code: string; challengeType: ChallengeTypeInfo; previewKey: number }) {
  const fnName = detectFnName(code);
  let srcdoc = "";

  if (challengeType.type === "html") {
    srcdoc = buildHTMLPreviewDoc(code, fnName);
  } else if (challengeType.type === "css") {
    // Check if it's Tailwind (returns class string) or CSS (returns CSS rules)
    const returnsTailwind = /return\s*["'`][^"'`]*(?:flex|text-|bg-|p-|m-|rounded|shadow)[^"'`]*["'`]/.test(code);
    srcdoc = returnsTailwind ? buildTailwindPreviewDoc(code, fnName) : buildCSSPreviewDoc(code, fnName);
  }

  return (
    <div className="h-full flex flex-col border-t border-zinc-800">
      <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 border-b border-zinc-800 flex-shrink-0">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400/70" />
          <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
          <span className="w-2 h-2 rounded-full bg-green-400/70" />
        </div>
        <Monitor className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-xs text-zinc-400">{challengeType.previewLabel}</span>
        <span className="ml-auto text-[10px] text-zinc-600">Updates on Run</span>
      </div>
      <iframe
        key={previewKey}
        srcDoc={srcdoc}
        sandbox="allow-scripts"
        className="flex-1 bg-white"
        style={{ border: "none", display: "block" }}
        title="preview"
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ChallengeDetail() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [submissions, setSubmissions] = useState<{ code: string; passed: boolean; language: string; submitted_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);
  const [challengeTypeInfo, setChallengeTypeInfo] = useState<ChallengeTypeInfo | null>(null);

  useEffect(() => {
    if (challengeId) fetchChallenge();
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [challengeId]);

  async function fetchChallenge() {
    setLoading(true);
    const { data } = await supabase.from("challenges").select("*").eq("id", challengeId).single();
    if (data) {
      const tc = typeof data.test_cases === "string" ? JSON.parse(data.test_cases) : data.test_cases;
      const ch = { ...data, test_cases: tc ?? [] };
      setChallenge(ch);
      setCode(data.starter_code_js ?? "");
      setChallengeTypeInfo(detectChallengeType(data.category ?? "", data.starter_code_js ?? ""));
    }
    if (user) {
      const { data: subs } = await supabase
        .from("challenge_submissions").select("*")
        .eq("challenge_id", challengeId).eq("user_id", user.id)
        .order("submitted_at", { ascending: false }).limit(10);
      setSubmissions(subs ?? []);
    }
    setLoading(false);
  }

  function getStarterCode(lang: string, ch: Challenge) {
    if (lang === "typescript") return ch.starter_code_ts ?? ch.starter_code_js;
    return ch.starter_code_js ?? "";
  }

  const handleRun = useCallback(async () => {
    if (!challenge || !challengeTypeInfo) return;
    setRunning(true);
    setRunResult(null);
    // For HTML/CSS preview challenges — just update the preview key to re-render
    if (challengeTypeInfo.showPreview) {
      setPreviewKey(k => k + 1);
      // Still run test cases if they exist
      if (challenge.test_cases.length > 0) {
        const result = await runCode(code, language, challenge.test_cases.slice(0, 3));
        setRunResult(result);
      }
      setRunning(false);
      return;
    }
    // JS/console challenges — run all test cases
    try {
      const result = await runCode(code, language, challenge.test_cases.slice(0, 3));
      setRunResult(result);
    } catch (e) { console.error(e); }
    setRunning(false);
  }, [challenge, challengeTypeInfo, code, language]);

  const handleSubmit = useCallback(async () => {
    if (!user || !challenge || !challengeTypeInfo) return;
    setSubmitting(true);
    setRunResult(null);
    try {
      const result = await runCode(code, language, challenge.test_cases);
      setRunResult(result);
      if (challengeTypeInfo.showPreview) setPreviewKey(k => k + 1);

      await supabase.from("challenge_submissions").insert({
        user_id: user.id, challenge_id: challenge.id, code, language, passed: result.allPassed,
      });
      if (result.allPassed) {
        await supabase.from("profiles").update({ xp: (user.xp ?? 0) + challenge.points }).eq("id", user.id);
        await supabase.from("activity_logs").insert({
          user_id: user.id, action: "Solved", item_name: challenge.title, item_type: "challenge", xp_earned: challenge.points,
        });
      }
      await fetchChallenge();
    } catch (e) { console.error(e); }
    setSubmitting(false);
  }, [user, challenge, challengeTypeInfo, code, language]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-96" /></div>;
  if (!challenge || !challengeTypeInfo) return <div className="p-8">Challenge not found.</div>;

  const allPassed = runResult?.allPassed ?? false;
  const anyFailed = runResult ? !runResult.allPassed : false;
  const isPreviewChallenge = challengeTypeInfo.showPreview;

  return (
    <div className="flex flex-col h-full overflow-hidden min-h-0">
      {/* Top nav */}
      <div className="border-b border-border px-4 py-2.5 flex items-center gap-3 bg-card flex-shrink-0">
        <Link to="/challenges" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Challenges
        </Link>
        <span className="text-border">/</span>
        <span className="font-semibold text-sm text-foreground truncate">{challenge.title}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold tracking-wider uppercase flex-shrink-0 ${diffBg[challenge.difficulty]} ${diffColor[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
        <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground flex-shrink-0">{challenge.category}</span>
        {/* Challenge type badge */}
        <span className={`text-[10px] px-2 py-0.5 rounded border font-mono font-bold flex-shrink-0 ${challengeTypeInfo.badgeColor}`}>
          {challengeTypeInfo.editorLabel}
        </span>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0 tabular-nums">
          <Clock className="w-3.5 h-3.5" />{fmt(elapsed)}
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        {/* Left: Problem */}
        <ResizablePanel defaultSize={38} minSize={26}>
          <Tabs defaultValue="problem" className="h-full flex flex-col min-h-0">
            <TabsList className="mx-4 mt-3 justify-start w-auto flex-shrink-0">
              <TabsTrigger value="problem"><FileText className="w-3.5 h-3.5 mr-1.5" />Problem</TabsTrigger>
              <TabsTrigger value="hints"><Lightbulb className="w-3.5 h-3.5 mr-1.5" />Hints</TabsTrigger>
              <TabsTrigger value="submissions"><CheckCircle className="w-3.5 h-3.5 mr-1.5" />History</TabsTrigger>
            </TabsList>
            <ScrollArea className="flex-1">
              <TabsContent value="problem" className="p-4 space-y-5 mt-0">
                {/* Type hint for HTML/CSS */}
                {isPreviewChallenge && (
                  <div className={`text-xs px-3 py-2 rounded-lg border ${challengeTypeInfo.badgeColor} bg-opacity-10`}>
                    <span className="font-semibold">
                      {challengeTypeInfo.type === "html" ? "📄 HTML Challenge" : "🎨 CSS Challenge"}
                    </span>
                    {" — "}
                    {challengeTypeInfo.type === "html"
                      ? "Your function should return an HTML string. The preview panel shows the rendered result."
                      : "Your function should return a CSS string. The preview shows it applied to sample elements."}
                  </div>
                )}

                <p className="text-sm text-muted-foreground leading-relaxed">{challenge.description}</p>

                {challenge.test_cases.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-foreground">Examples</h3>
                    {challenge.test_cases.slice(0, 2).map((tc, i) => (
                      <div key={i} className="rounded-lg border border-border bg-muted/40 p-3 text-xs font-mono space-y-1">
                        <div className="text-muted-foreground">
                          Input: <span className="text-foreground">
                            {JSON.stringify(tc.target !== undefined ? { input: tc.input, target: tc.target } : tc.input)}
                          </span>
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400">Expected: {JSON.stringify(tc.expected)}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 text-xs flex-wrap">
                  <span className="flex items-center gap-1 bg-muted border border-border px-2.5 py-1 rounded-full font-medium">
                    <Trophy className="w-3 h-3 text-yellow-500" />{challenge.points} pts
                  </span>
                  <span className="bg-muted border border-border px-2.5 py-1 rounded-full font-medium text-muted-foreground">{challenge.category}</span>
                </div>
              </TabsContent>

              <TabsContent value="hints" className="p-4 space-y-3 mt-0">
                <div className="rounded-lg border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 p-3">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1.5">Hint 1</p>
                  <p className="text-xs text-amber-700/80 dark:text-amber-300/70 leading-relaxed">
                    {isPreviewChallenge
                      ? "Your function must return a string. Use template literals (backticks) to write multi-line HTML or CSS."
                      : "Break the problem into smaller steps. What does one iteration look like?"}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="text-xs font-semibold text-foreground mb-1.5">Hint 2</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isPreviewChallenge
                      ? challengeTypeInfo.type === "html"
                        ? "Check the expected output carefully — it verifies specific HTML tags and attributes are present."
                        : "CSS property names must be exact. Check spelling of properties like 'flex-direction', 'grid-template-areas'."
                      : "Think about edge cases: empty input, single element, negative numbers."}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="text-xs font-semibold text-foreground mb-1.5">Hint 3</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isPreviewChallenge
                      ? "Use the preview panel to visually verify your output looks correct before submitting."
                      : "Consider the time complexity. Can you solve it without nested loops?"}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="submissions" className="p-4 space-y-2 mt-0">
                {submissions.length === 0
                  ? <p className="text-sm text-muted-foreground">No submissions yet.</p>
                  : submissions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card text-sm">
                      <div className="flex items-center gap-2">
                        {s.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                        <span className={s.passed ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-rose-600 dark:text-rose-400 font-medium"}>
                          {s.passed ? "Accepted" : "Failed"}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{s.language} · {new Date(s.submitted_at).toLocaleDateString()}</span>
                    </div>
                  ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Editor + Output/Preview */}
        <ResizablePanel defaultSize={62}>
          <div className="h-full flex flex-col min-h-0">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border flex-shrink-0">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${challengeTypeInfo.badgeColor}`}>
                JavaScript
              </span>
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="outline" onClick={handleRun} disabled={running || submitting} className="h-7 text-xs gap-1.5">
                  <Play className="w-3 h-3" />{running ? "Running..." : "Run"}
                </Button>
                <Button size="sm" onClick={handleSubmit} disabled={submitting || running} className="h-7 text-xs gap-1.5">
                  <Send className="w-3 h-3" />{submitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>

            {/* Editor + output split */}
            {isPreviewChallenge ? (
              /* HTML/CSS challenges: editor top, live preview bottom */
              <ResizablePanelGroup direction="vertical" className="flex-1 min-h-0">
                <ResizablePanel defaultSize={55} minSize={30}>
                  <Editor
                    height="100%"
                    language="javascript"
                    value={code}
                    onChange={v => setCode(v ?? "")}
                    theme="vs-dark"
                    options={{ fontSize: 13, minimap: { enabled: false }, lineNumbers: "on", scrollBeyondLastLine: false, wordWrap: "on" }}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={45} minSize={25}>
                  <LivePreview code={code} challengeType={challengeTypeInfo} previewKey={previewKey} />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              /* JS/console challenges: editor + output panel */
              <ResizablePanelGroup direction="vertical" className="flex-1 min-h-0">
                <ResizablePanel defaultSize={58} minSize={30}>
                  <Editor
                    height="100%"
                    language="javascript"
                    value={code}
                    onChange={v => setCode(v ?? "")}
                    theme="vs-dark"
                    options={{ fontSize: 13, minimap: { enabled: false }, lineNumbers: "on", scrollBeyondLastLine: false, wordWrap: "on" }}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={42} minSize={20}>
                  <div className="h-full flex flex-col bg-[#0d1117] min-h-0">
                    {/* Output header */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800 flex-shrink-0">
                      <div className="flex items-center gap-2.5 text-xs">
                        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-zinc-400 font-medium">Output</span>
                        {(running || submitting) && (
                          <span className="flex items-center gap-1.5 text-zinc-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />Running...
                          </span>
                        )}
                        {runResult && !running && !submitting && (
                          <span className={`flex items-center gap-1.5 font-semibold ${allPassed ? "text-emerald-400" : "text-rose-400"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${allPassed ? "bg-emerald-400" : "bg-rose-400"}`} />
                            {allPassed ? "All tests passed" : "Some tests failed"}
                          </span>
                        )}
                      </div>
                      {runResult && (
                        <button onClick={() => setRunResult(null)}
                          className="text-[10px] text-zinc-600 hover:text-zinc-300 px-1.5 py-0.5 rounded hover:bg-zinc-800">
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Output body */}
                    <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0 space-y-2">
                      {(running || submitting) ? (
                        <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono p-2">
                          <span className="inline-block w-3 h-3 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
                          Executing your code against test cases...
                        </div>
                      ) : runResult ? (
                        <>
                          {runResult.results.map(r => <TestCaseRow key={r.index} result={r} defaultOpen={!r.passed} />)}
                          <div className="pt-1">
                            {allPassed && (
                              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/25">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span className="text-xs text-emerald-400 font-semibold">
                                  All {runResult.results.length} test cases passed!
                                </span>
                                {allPassed && <span className="ml-auto text-xs text-yellow-400 font-bold">+{challenge.points} XP</span>}
                              </div>
                            )}
                            {anyFailed && (
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/[0.08] border border-rose-500/25">
                                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                                <span className="text-xs text-rose-400">
                                  {runResult.results.filter(r => !r.passed).length} of {runResult.results.length} failed. Click a test to see details.
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-mono px-1 pt-2">
                              <span className="flex items-center gap-1"><Cpu className="w-3 h-3" />Runtime: {runResult.runtime}</span>
                              <span className="flex items-center gap-1"><MemoryStick className="w-3 h-3" />Memory: ~42 MB</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-2">
                          <p className="text-zinc-600 text-xs font-mono">
                            Click <span className="text-zinc-400 font-semibold">Run</span> to test against sample cases, or{" "}
                            <span className="text-zinc-400 font-semibold">Submit</span> to run all test cases.
                          </p>
                          <p className="text-zinc-700 text-xs font-mono mt-2">
                            Tip: use <span className="text-zinc-500">console.log()</span> to debug your output.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
