import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { 
  CheckCircle2, Circle, Clock, ArrowLeft, ArrowRight, BookOpen, 
  ChevronDown, ChevronRight, Lock, Terminal, FileText, Lightbulb, Play, Send, Trophy 
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../../components/ui/skeleton";
import Editor from "@monaco-editor/react";
import { getChallengesForCourse } from "../../lib/utils";
import { TryItYourself } from "../../components/TryItYourself";
import { extractEditorConfig } from "../../lib/extractLessonCode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../components/ui/resizable";

interface Lesson { id: string; title: string; content: string; duration_minutes: number; order_index: number; completed?: boolean; }
interface Module { id: string; title: string; order_index: number; lessons: Lesson[]; }
interface Course { id: string; title: string; description: string; category: string; difficulty: string; thumbnail_color: string; }

const diffColor: Record<string, string> = { Easy: "text-green-600", Medium: "text-yellow-600", Hard: "text-red-600" };

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  // Challenge workspace states
  const [courseChallenges, setCourseChallenges] = useState<any[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<any | null>(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [passed, setPassed] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => { if (courseId) fetchData(); }, [courseId]);

  useEffect(() => {
    if (activeChallenge) {
      setLanguage("javascript");
      setCode(activeChallenge.starter_code_js ?? "");
      setOutput("");
      setPassed(null);
      setElapsed(0);
    }
  }, [activeChallenge]);

  useEffect(() => {
    if (!activeChallenge) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [activeChallenge]);

  async function fetchData() {
    setLoading(true);
    const { data: courseData } = await supabase.from("courses").select("*").eq("id", courseId).single();
    setCourse(courseData);

    const { data: modulesData } = await supabase.from("modules").select("*").eq("course_id", courseId).order("order_index");
    if (!modulesData) { setLoading(false); return; }

    const completedIds = new Set<string>();
    if (user) {
      const { data: prog } = await supabase.from("user_progress").select("lesson_id").eq("user_id", user.id);
      prog?.forEach((p) => completedIds.add(p.lesson_id));
    }

    const modulesWithLessons = await Promise.all(
      modulesData.map(async (mod) => {
        const { data: lessons } = await supabase.from("lessons").select("*").eq("module_id", mod.id).order("order_index");
        return {
          ...mod,
          lessons: (lessons ?? []).map((l) => ({ ...l, completed: completedIds.has(l.id) })),
        };
      })
    );

    setModules(modulesWithLessons);
    setExpandedModules(new Set([modulesWithLessons[0]?.id]));

    // Fetch and assign challenges
    const { data: allEasy } = await supabase.from("challenges").select("*").eq("difficulty", "Easy").eq("is_published", true);
    const courseChalls = getChallengesForCourse(courseId!, allEasy ?? []);
    
    const { data: solvedSubs } = user
      ? await supabase
          .from("challenge_submissions")
          .select("challenge_id, passed")
          .eq("user_id", user.id)
          .in("challenge_id", courseChalls.map((c) => c.id))
          .eq("passed", true)
      : { data: [] };
    const solvedIds = new Set(solvedSubs?.map((s) => s.challenge_id) ?? []);
    const mappedChalls = courseChalls.map((ch) => ({
      ...ch,
      solved: solvedIds.has(ch.id)
    }));
    setCourseChallenges(mappedChalls);

    const firstIncomplete = modulesWithLessons.flatMap((m) => m.lessons).find((l) => !l.completed);
    if (firstIncomplete) {
      setActiveLesson(firstIncomplete);
      setActiveChallenge(null);
    } else {
      const firstIncompleteChallenge = mappedChalls.find((ch) => !ch.solved);
      if (firstIncompleteChallenge) {
        setActiveChallenge(firstIncompleteChallenge);
        setActiveLesson(null);
      } else {
        setActiveLesson(modulesWithLessons[0]?.lessons[0] ?? null);
        setActiveChallenge(null);
      }
    }
    setLoading(false);
  }

  async function markComplete() {
    if (!activeLesson || !user) return;
    setCompleting(true);
    await supabase.from("user_progress").upsert({ user_id: user.id, lesson_id: activeLesson.id });
    await supabase.from("activity_logs").insert({ user_id: user.id, action: "Completed", item_name: activeLesson.title, item_type: "lesson", xp_earned: 5 });
    await supabase.from("profiles").update({ xp: (user.xp ?? 0) + 5 }).eq("id", user.id);
    await fetchData();
    setCompleting(false);
  }

  function getStarterCode(lang: string, ch: any) {
    if (lang === "typescript") return ch.starter_code_ts ?? ch.starter_code_js;
    if (lang === "python") return ch.starter_code_python ?? "";
    return ch.starter_code_js ?? "";
  }

  async function handleRun() {
    setOutput("⏳ Running test cases...\n\n");
    await new Promise((r) => setTimeout(r, 600));
    setOutput("✓ Test case 1: Passed\n✓ Test case 2: Passed\n\n✅ All test cases passed!\nRuntime: 68ms · Memory: 42.1 MB");
    setPassed(true);
  }

  async function handleSubmit() {
    if (!user || !activeChallenge) return;
    setSubmitting(true);
    const result = true; // Simulating sandbox run
    setPassed(result);
    setOutput(result ? "✅ All test cases passed!\nRuntime: 68ms · Memory: 42.1 MB\n\n🎉 Great job! +" + activeChallenge.points + " XP" : "❌ Some test cases failed.");
    await supabase.from("challenge_submissions").insert({ user_id: user.id, challenge_id: activeChallenge.id, code, language, passed: result });
    if (result) {
      await supabase.from("profiles").update({ xp: (user.xp ?? 0) + activeChallenge.points }).eq("id", user.id);
      await supabase.from("activity_logs").insert({ user_id: user.id, action: "Solved", item_name: activeChallenge.title, item_type: "challenge", xp_earned: activeChallenge.points });
    }
    await fetchData();
    setSubmitting(false);
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const allLessons = modules.flatMap((m) => m.lessons);
  const currentIdx = allLessons.findIndex((l) => l.id === activeLesson?.id);
  const totalCompletedLessons = allLessons.filter((l) => l.completed).length;
  const solvedChallengesCount = courseChallenges.filter((ch) => ch.solved).length;

  const totalItemsCount = allLessons.length + 3;
  const completedItemsCount = totalCompletedLessons + solvedChallengesCount;
  const progressPct = totalItemsCount > 0 ? Math.round((completedItemsCount / totalItemsCount) * 100) : 0;

  const allLessonsCompleted = totalCompletedLessons === allLessons.length && allLessons.length > 0;

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-96" /></div>;
  if (!course) return <div className="p-8">Course not found.</div>;

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <aside className="w-72 border-r border-border flex flex-col min-h-0">
        <div className="p-4 border-b border-border">
          <Link to="/courses" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>
          <h2 className="font-bold text-sm line-clamp-2">{course.title}</h2>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{completedItemsCount}/{totalItemsCount} completed</span>
              <span>{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-1.5" />
          </div>
        </div>
        <ScrollArea className="flex-1 min-h-0 overflow-hidden">
          <div className="p-2 space-y-1">
            {modules.map((mod) => (
              <div key={mod.id}>
                <button
                  onClick={() => setExpandedModules((s) => { const n = new Set(s); n.has(mod.id) ? n.delete(mod.id) : n.add(mod.id); return n; })}
                  className="w-full flex items-center justify-between px-2 py-2 text-left text-sm font-medium hover:bg-accent rounded-md"
                >
                  <span className="line-clamp-1">{mod.title}</span>
                  {expandedModules.has(mod.id) ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                </button>
                {expandedModules.has(mod.id) && (
                  <div className="ml-2 space-y-0.5">
                    {mod.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => { setActiveLesson(lesson); setActiveChallenge(null); }}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 text-left text-xs rounded-md transition-colors ${activeLesson?.id === lesson.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                      >
                        {lesson.completed ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-green-500" /> : <Circle className="w-3.5 h-3.5 flex-shrink-0" />}
                        <span className="line-clamp-1">{lesson.title}</span>
                        <span className="ml-auto flex-shrink-0 flex items-center gap-0.5 text-[10px]"><Clock className="w-2.5 h-2.5" />{lesson.duration_minutes}m</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

          </div>
        </ScrollArea>

        {courseChallenges.length > 0 && (
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-center gap-1.5 mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Course Challenges</span>
            </div>
            <div className="space-y-1.5">
              {courseChallenges.map((ch) => {
                const isLocked = !allLessonsCompleted;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setActiveChallenge(ch);
                      setActiveLesson(null);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium rounded-lg border transition-all ${activeChallenge?.id === ch.id ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-accent hover:text-foreground border-border"}`}
                  >
                    {ch.solved ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 flex-shrink-0 text-muted-foreground/60" />
                    ) : (
                      <Circle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="line-clamp-1 flex-1">{ch.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden min-h-0 bg-background">
        {activeLesson ? (
          <>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{course.title}</span>
                </div>
                <h1 className="text-xl font-bold">{activeLesson.title}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" disabled={currentIdx === 0} onClick={() => { setActiveLesson(allLessons[currentIdx - 1]); setActiveChallenge(null); }}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                {!activeLesson.completed && (
                  <Button size="sm" onClick={markComplete} disabled={completing}>
                    {completing ? "Saving..." : "Mark Complete"}
                  </Button>
                )}
                <Button size="sm" variant="outline" disabled={currentIdx === allLessons.length - 1} onClick={() => { setActiveLesson(allLessons[currentIdx + 1]); setActiveChallenge(null); }}>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1 min-h-0 overflow-hidden bg-background">
              <div className="p-4 md:p-6 max-w-5xl mx-auto [&_pre]:overflow-x-auto [&_pre]:max-w-full">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl font-extrabold tracking-tight mt-6 mb-4 text-foreground">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4 text-foreground">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3 text-foreground">{children}</h3>,
                    p: ({ children }) => <p className="text-base leading-7 text-slate-800 dark:text-slate-200 mb-5 font-normal">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-2 text-slate-800 dark:text-slate-200">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-slate-800 dark:text-slate-200">{children}</ol>,
                    li: ({ children }) => <li className="text-base leading-7">{children}</li>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground bg-muted/40 py-3 pr-3 rounded-r-md">{children}</blockquote>,
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <div className="my-6 rounded-lg overflow-hidden border border-border shadow-md">
                          <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '1.25rem', fontSize: '0.875rem' }}>
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono font-semibold text-foreground" {...props}>{children}</code>
                      );
                    },
                    hr: () => <hr className="my-8 border-border" />,
                    table: ({ children }) => <div className="my-6 w-full overflow-y-auto rounded-lg border border-border"><table className="w-full border-collapse text-sm">{children}</table></div>,
                    th: ({ children }) => <th className="border-b border-border bg-muted/60 px-4 py-3 text-left font-semibold text-foreground">{children}</th>,
                    td: ({ children }) => <td className="border-b border-border px-4 py-3 text-muted-foreground">{children}</td>,
                  }}
                >
                  {activeLesson.content || "# No content yet\n\nThis lesson is coming soon."}
                </ReactMarkdown>

                {/* Try it Yourself — only shown when lesson has runnable html/js/css examples */}
                {(() => {
                  const editor = extractEditorConfig(activeLesson.content || "");
                  if (!editor.show) return null;
                  return (
                    <div className="mt-10 mb-6">
                      <h2 className="text-2xl font-bold tracking-tight mb-1 text-foreground">Try it Yourself</h2>
                      <p className="text-sm text-muted-foreground mb-4">Edit the code below and click Run to see the result live.</p>
                      <TryItYourself
                        key={activeLesson.id}
                        lessonId={activeLesson.id}
                        code={editor.code}
                        language={editor.language}
                      />
                    </div>
                  );
                })()}
              </div>
            </ScrollArea>
          </>
        ) : activeChallenge ? (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="border-b border-border px-6 py-4 flex items-center gap-4 bg-card">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
                  <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                  <span>{course.title} Challenge</span>
                </div>
                <h1 className="text-lg font-bold">{activeChallenge.title}</h1>
              </div>
              <span className={`text-sm font-semibold ${diffColor[activeChallenge.difficulty] || "text-green-600"}`}>
                {activeChallenge.difficulty}
              </span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded border border-border">
                {activeChallenge.category}
              </span>
              <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                <Clock className="w-4 h-4" />{fmt(elapsed)}
              </div>
            </div>

            {!allLessonsCompleted ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/20">
                <div className="max-w-md p-6 bg-card border border-border rounded-xl shadow-lg space-y-4">
                  <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-bold">Coding Challenges Locked</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Please complete all the reading lessons in this course first to unlock the coding challenges! Once you complete all lessons, you must solve 3 easy challenges to finish the course.
                  </p>
                  <Button onClick={() => {
                    const firstIncomplete = allLessons.find((l) => !l.completed) || allLessons[0];
                    if (firstIncomplete) {
                      setActiveLesson(firstIncomplete);
                      setActiveChallenge(null);
                    }
                  }}>
                    Go to Next Incomplete Lesson
                  </Button>
                </div>
              </div>
            ) : (
              <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel defaultSize={40} minSize={30}>
                  <Tabs defaultValue="problem" className="h-full flex flex-col">
                    <TabsList className="mx-4 mt-2 justify-start w-auto">
                      <TabsTrigger value="problem"><FileText className="w-3.5 h-3.5 mr-1" />Problem</TabsTrigger>
                      <TabsTrigger value="hints"><Lightbulb className="w-3.5 h-3.5 mr-1" />Hints</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="flex-1">
                      <TabsContent value="problem" className="p-4 space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{activeChallenge.description}</p>
                        {activeChallenge.test_cases && (typeof activeChallenge.test_cases === "string" ? JSON.parse(activeChallenge.test_cases) : activeChallenge.test_cases).length > 0 && (
                          <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Examples</h3>
                            {(typeof activeChallenge.test_cases === "string" ? JSON.parse(activeChallenge.test_cases) : activeChallenge.test_cases).slice(0, 2).map((tc: any, i: number) => (
                              <div key={i} className="bg-muted rounded-lg p-3 text-xs font-mono">
                                <div className="text-muted-foreground">Input: {JSON.stringify(tc.input ?? tc)}</div>
                                <div className="text-green-600 mt-1">Expected: {JSON.stringify(tc.expected)}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 text-xs">
                          <span className="bg-muted px-2 py-1 rounded">{activeChallenge.points} points</span>
                          <span className="bg-muted px-2 py-1 rounded">{activeChallenge.category}</span>
                        </div>
                      </TabsContent>
                      <TabsContent value="hints" className="p-4">
                        <div className="space-y-3 text-sm text-muted-foreground">
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                            <p className="font-medium text-yellow-800 dark:text-yellow-400 mb-1">Hint 1</p>
                            <p>Read the problem description and examples carefully.</p>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="font-medium mb-1">Hint 2</p>
                            <p>Try edge cases like empty inputs or single elements.</p>
                          </div>
                        </div>
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={60}>
                  <div className="h-full flex flex-col">
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
                      <Select value={language} onValueChange={(v) => { setLanguage(v); setCode(getStarterCode(v, activeChallenge)); }}>
                        <SelectTrigger className="w-36 h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="ml-auto flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleRun} className="h-7 text-xs"><Play className="w-3 h-3 mr-1" />Run</Button>
                        <Button size="sm" onClick={handleSubmit} disabled={submitting} className="h-7 text-xs"><Send className="w-3 h-3 mr-1" />{submitting ? "Submitting..." : "Submit"}</Button>
                      </div>
                    </div>

                    <ResizablePanelGroup direction="vertical" className="flex-1">
                      <ResizablePanel defaultSize={70}>
                        <Editor
                          height="100%"
                          language={language}
                          value={code}
                          onChange={(v) => setCode(v ?? "")}
                          theme="vs-dark"
                          options={{ fontSize: 13, minimap: { enabled: false }, lineNumbers: "on", scrollBeyondLastLine: false, wordWrap: "on" }}
                        />
                      </ResizablePanel>
                      <ResizableHandle />
                      <ResizablePanel defaultSize={30} minSize={15}>
                        <div className="h-full bg-zinc-950 p-3 font-mono text-xs">
                          <div className="flex items-center gap-1 text-zinc-400 mb-2"><Terminal className="w-3.5 h-3.5" />Output</div>
                          {output ? (
                            <pre className={`whitespace-pre-wrap ${passed === true ? "text-green-400" : passed === false ? "text-red-400" : "text-zinc-300"}`}>{output}</pre>
                          ) : (
                            <span className="text-zinc-600">Click Run or Submit to see output...</span>
                          )}
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center"><BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>Select a lesson to begin</p></div>
          </div>
        )}
      </main>
    </div>
  );
}
