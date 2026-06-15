import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Skeleton } from "../../components/ui/skeleton";
import {
  ArrowLeft, Play, Send, Clock, CheckCircle, XCircle, Terminal, FileText,
  MessageSquare, Lightbulb, Trophy,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import {
  ResizableHandle, ResizablePanel, ResizablePanelGroup,
} from "../../components/ui/resizable";
import { supabase, Challenge } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { addXp, logActivity, updateStreak } from "../../lib/xp";

type TestResult = { id: number; input: string; expected: string; passed: boolean; actual?: string };

export function ChallengeDetail() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { user, refreshUser } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [alreadySolved, setAlreadySolved] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    if (!challengeId || !user) return;
    loadChallenge();
  }, [challengeId, user?.id]);

  async function loadChallenge() {
    setLoading(true);
    try {
      const [{ data: c }, { data: solved }] = await Promise.all([
        supabase.from("challenges").select("*").eq("id", challengeId!).single(),
        supabase
          .from("challenge_submissions")
          .select("id")
          .eq("user_id", user!.id)
          .eq("challenge_id", challengeId!)
          .eq("passed", true)
          .limit(1),
      ]);

      if (c) {
        setChallenge(c);
        setCode(c.starter_code_js);
        setAlreadySolved((solved?.length ?? 0) > 0);
      }
    } finally {
      setLoading(false);
    }
  }

  function getStarterCode(lang: string): string {
    if (!challenge) return "";
    if (lang === "typescript") return challenge.starter_code_ts;
    if (lang === "python") return challenge.starter_code_py;
    return challenge.starter_code_js;
  }

  function handleLanguageChange(lang: string) {
    setLanguage(lang);
    setCode(getStarterCode(lang));
    setShowResults(false);
    setTestResults([]);
  }

  function simulateTestRun(testCases: Challenge["test_cases"]): TestResult[] {
    return testCases.map((tc) => ({
      id: tc.id,
      input: tc.input,
      expected: tc.expected,
      passed: Math.random() > 0.3, // simulated — real execution requires a backend
      actual: undefined,
    }));
  }

  async function handleRun() {
    if (!challenge) return;
    setIsRunning(true);
    setShowResults(false);
    await new Promise((r) => setTimeout(r, 1200));
    const results = simulateTestRun(challenge.test_cases);
    setTestResults(results);
    setShowResults(true);
    setIsRunning(false);
  }

  async function handleSubmit() {
    if (!challenge || !user) return;
    setIsRunning(true);
    setShowResults(false);
    await new Promise((r) => setTimeout(r, 1800));

    const results = simulateTestRun(challenge.test_cases);
    const allPassed = results.every((r) => r.passed);
    setTestResults(results);
    setShowResults(true);
    setIsRunning(false);

    // Save submission to Supabase
    await supabase.from("challenge_submissions").insert({
      user_id: user.id,
      challenge_id: challenge.id,
      language,
      code,
      passed: allPassed,
      test_results: results,
      xp_earned: allPassed && !alreadySolved ? challenge.xp_reward : 0,
    });

    if (allPassed && !alreadySolved) {
      setAlreadySolved(true);
      setXpEarned(challenge.xp_reward);
      await Promise.all([
        addXp(challenge.xp_reward, "challenge", `Solved: ${challenge.title}`, challenge.id),
        logActivity("Solved", challenge.title, "challenge", challenge.xp_reward),
        updateStreak(),
      ]);
      refreshUser();
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[calc(100vh-8rem)] w-full" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Challenge not found.{" "}
        <Link to="/challenges" className="text-primary hover:underline">Browse Challenges</Link>
      </div>
    );
  }

  const passedCount = testResults.filter((r) => r.passed).length;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/challenges">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />Back
            </Button>
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg font-bold">{challenge.title}</h1>
            <Badge variant={challenge.difficulty === "Easy" ? "default" : challenge.difficulty === "Medium" ? "secondary" : "destructive"}>
              {challenge.difficulty}
            </Badge>
            {challenge.tags.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
            {alreadySolved && <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="w-3 h-3 mr-1" />Solved</Badge>}
            {xpEarned > 0 && (
              <span className="text-sm font-medium text-yellow-500 flex items-center gap-1">
                <Trophy className="w-4 h-4" />+{xpEarned} XP earned!
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRun} disabled={isRunning}>
            <Play className="w-4 h-4 mr-2" />Run
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isRunning}>
            <Send className="w-4 h-4 mr-2" />Submit
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left: Problem */}
        <ResizablePanel defaultSize={40} minSize={25}>
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <Tabs defaultValue="description">
                <TabsList>
                  <TabsTrigger value="description"><FileText className="w-4 h-4 mr-2" />Description</TabsTrigger>
                  <TabsTrigger value="hints"><Lightbulb className="w-4 h-4 mr-2" />Hints</TabsTrigger>
                  {challenge.editorial && (
                    <TabsTrigger value="editorial"><MessageSquare className="w-4 h-4 mr-2" />Editorial</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="description" className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Problem</h3>
                    <p className="text-muted-foreground leading-relaxed">{challenge.description}</p>
                  </div>

                  {challenge.test_cases.slice(0, 2).map((tc) => (
                    <div key={tc.id}>
                      <h3 className="font-bold mb-2">Example {tc.id}</h3>
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                        <p><strong>Input:</strong> {tc.input}</p>
                        <p><strong>Output:</strong> {tc.expected}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-muted-foreground">Reward: <strong>{challenge.xp_reward} XP</strong></span>
                  </div>
                </TabsContent>

                <TabsContent value="hints" className="space-y-3 mt-4">
                  {challenge.hints.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hints available for this challenge.</p>
                  ) : (
                    challenge.hints.map((hint, i) => (
                      <div key={i} className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <p className="text-sm"><strong>Hint {i + 1}:</strong> {hint}</p>
                      </div>
                    ))
                  )}
                </TabsContent>

                {challenge.editorial && (
                  <TabsContent value="editorial" className="mt-4">
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">{challenge.editorial}</p>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle />

        {/* Right: Editor + Console */}
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={65} minSize={30}>
              <div className="h-full bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language={language === "python" ? "python" : language}
                  value={code}
                  onChange={(v) => setCode(v ?? "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                  }}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={35} minSize={20}>
              <Tabs defaultValue="testcases" className="h-full flex flex-col">
                <div className="border-b border-border px-4 flex-shrink-0">
                  <TabsList>
                    <TabsTrigger value="testcases">
                      <Terminal className="w-4 h-4 mr-2" />
                      Test Cases
                    </TabsTrigger>
                    <TabsTrigger value="console">Console</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="testcases" className="flex-1 p-4 space-y-3 overflow-auto m-0">
                  {isRunning ? (
                    <div className="text-center text-muted-foreground py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                      Running tests...
                    </div>
                  ) : showResults ? (
                    <>
                      {testResults.map((test) => (
                        <div key={test.id} className={`p-4 rounded-lg border ${test.passed ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                          <div className="flex items-center gap-2 mb-2">
                            {test.passed
                              ? <CheckCircle className="w-5 h-5 text-green-500" />
                              : <XCircle className="w-5 h-5 text-red-500" />}
                            <span className="font-medium">Test Case {test.id}</span>
                          </div>
                          <div className="text-sm space-y-1">
                            <p><strong>Input:</strong> {test.input}</p>
                            <p><strong>Expected:</strong> {test.expected}</p>
                            {!test.passed && test.actual && (
                              <p className="text-red-500"><strong>Got:</strong> {test.actual}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <span className={`font-medium ${passedCount === testResults.length ? "text-green-500" : "text-red-500"}`}>
                          {passedCount}/{testResults.length} passed
                        </span>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Press <strong>Run</strong> to test your code
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="console" className="flex-1 p-4 m-0">
                  <div className="bg-black/5 dark:bg-white/5 rounded p-3 font-mono text-sm h-full overflow-auto">
                    {isRunning ? (
                      <div className="text-yellow-500">Running...</div>
                    ) : showResults ? (
                      <div className="space-y-1">
                        <div className="text-green-500">&gt; Execution complete</div>
                        <div className="text-muted-foreground">{passedCount}/{testResults.length} tests passed</div>
                        {xpEarned > 0 && <div className="text-yellow-500">+{xpEarned} XP earned!</div>}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Console output will appear here...</div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
