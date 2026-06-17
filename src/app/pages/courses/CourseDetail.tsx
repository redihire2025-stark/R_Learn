import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { CheckCircle2, Circle, Clock, ArrowLeft, ArrowRight, BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../../components/ui/skeleton";

interface Lesson { id: string; title: string; content: string; duration_minutes: number; order_index: number; completed?: boolean; }
interface Module { id: string; title: string; order_index: number; lessons: Lesson[]; }
interface Course { id: string; title: string; description: string; category: string; difficulty: string; thumbnail_color: string; }

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => { if (courseId) fetchData(); }, [courseId]);

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
    const firstIncomplete = modulesWithLessons.flatMap((m) => m.lessons).find((l) => !l.completed);
    setActiveLesson(firstIncomplete ?? modulesWithLessons[0]?.lessons[0] ?? null);
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

  const allLessons = modules.flatMap((m) => m.lessons);
  const currentIdx = allLessons.findIndex((l) => l.id === activeLesson?.id);
  const totalCompleted = allLessons.filter((l) => l.completed).length;
  const progressPct = allLessons.length > 0 ? Math.round((totalCompleted / allLessons.length) * 100) : 0;

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
              <span>{totalCompleted}/{allLessons.length} lessons</span>
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
                        onClick={() => setActiveLesson(lesson)}
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
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden min-h-0">
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
                <Button size="sm" variant="outline" disabled={currentIdx === 0} onClick={() => setActiveLesson(allLessons[currentIdx - 1])}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                {!activeLesson.completed && (
                  <Button size="sm" onClick={markComplete} disabled={completing}>
                    {completing ? "Saving..." : "Mark Complete"}
                  </Button>
                )}
                <Button size="sm" variant="outline" disabled={currentIdx === allLessons.length - 1} onClick={() => setActiveLesson(allLessons[currentIdx + 1])}>
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
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center"><BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>Select a lesson to begin</p></div>
          </div>
        )}
      </main>
    </div>
  );
}
