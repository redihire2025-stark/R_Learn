import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  BookOpen, CheckCircle2, Circle, ArrowLeft, ArrowRight, Trophy, Clock,
} from "lucide-react";
import { supabase, Course } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { addXp, logActivity, updateStreak } from "../../lib/xp";

interface ProgressRecord {
  id: string;
  progress_percent: number;
  completed_at: string | null;
}

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, refreshUser } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<ProgressRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    if (courseId && user) loadCourse();
  }, [courseId, user?.id]);

  async function loadCourse() {
    setLoading(true);
    try {
      const [{ data: c }, { data: p }] = await Promise.all([
        supabase.from("courses").select("*").eq("id", courseId!).single(),
        supabase
          .from("user_course_progress")
          .select("id, progress_percent, completed_at")
          .eq("user_id", user!.id)
          .eq("course_id", courseId!)
          .maybeSingle(),
      ]);

      if (c) setCourse(c);

      if (!p && c) {
        const { data: newP } = await supabase
          .from("user_course_progress")
          .insert({ user_id: user!.id, course_id: courseId! })
          .select("id, progress_percent, completed_at")
          .single();
        setProgress(newP);
      } else {
        setProgress(p);
      }
    } finally {
      setLoading(false);
    }
  }

  async function markLessonComplete() {
    if (!course || !progress || marking) return;

    const total = course.total_lessons || 10;
    const currentIdx = Math.floor((progress.progress_percent / 100) * total);
    const nextIdx = currentIdx + 1;
    const newPercent = Math.min(100, Math.round((nextIdx / total) * 100));
    const justCompleted = newPercent >= 100 && !progress.completed_at;

    setMarking(true);

    const updates: Record<string, unknown> = {
      progress_percent: newPercent,
      last_accessed: new Date().toISOString(),
    };
    if (justCompleted) updates.completed_at = new Date().toISOString();

    await supabase.from("user_course_progress").update(updates).eq("id", progress.id);

    setProgress((prev) =>
      prev
        ? {
            ...prev,
            progress_percent: newPercent,
            completed_at: justCompleted ? new Date().toISOString() : prev.completed_at,
          }
        : prev
    );

    if (justCompleted) {
      const xp = course.xp_reward ?? 200;
      await Promise.all([
        addXp(xp, "course", `Completed: ${course.title}`, course.id),
        logActivity("Completed", course.title, "course", xp),
        updateStreak(),
      ]);
      refreshUser();
      setXpEarned(xp);
    }

    setMarking(false);
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-80 border-r border-border p-6 space-y-4 flex-shrink-0">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="flex-1 p-8 space-y-4">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Course not found.{" "}
        <Link to="/courses" className="text-primary hover:underline">
          Browse Courses
        </Link>
      </div>
    );
  }

  const total = course.total_lessons || 10;
  const progressPercent = progress?.progress_percent ?? 0;
  const currentLessonIdx = Math.min(Math.floor((progressPercent / 100) * total), total - 1);
  const isCompleted = progressPercent >= 100;

  // Group lessons into modules of 5
  const lessonsPerModule = 5;
  const moduleCount = Math.ceil(total / lessonsPerModule);
  const modules = Array.from({ length: moduleCount }, (_, mi) => {
    const start = mi * lessonsPerModule;
    const end = Math.min(start + lessonsPerModule, total);
    return {
      id: mi,
      title: moduleTitle(course.category, mi),
      lessons: Array.from({ length: end - start }, (_, li) => {
        const idx = start + li;
        return {
          idx,
          title: lessonTitle(course.category, idx),
          completed: idx < currentLessonIdx,
          isCurrent: idx === currentLessonIdx && !isCompleted,
        };
      }),
    };
  });

  const currentLesson = modules
    .flatMap((m) => m.lessons)
    .find((l) => l.isCurrent);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <ScrollArea className="w-80 border-r border-border bg-card flex-shrink-0">
        <div className="p-6 space-y-6">
          <div>
            <Link to="/courses">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
            <h2 className="font-bold text-lg leading-tight">{course.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {total} lessons · {course.estimated_hours}h
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {currentLessonIdx} of {total} lessons completed
            </p>
          </div>

          {xpEarned > 0 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <span className="text-sm font-medium text-yellow-500">+{xpEarned} XP earned!</span>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            {modules.map((mod) => (
              <div key={mod.id} className="space-y-1">
                <h3 className="font-medium text-sm flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  {mod.title}
                </h3>
                <div className="space-y-0.5 ml-6">
                  {mod.lessons.map((lesson) => (
                    <div
                      key={lesson.idx}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                        lesson.isCurrent
                          ? "bg-primary text-primary-foreground"
                          : lesson.completed
                          ? "text-muted-foreground"
                          : ""
                      }`}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle
                          className={`w-4 h-4 flex-shrink-0 ${
                            lesson.isCurrent ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        />
                      )}
                      <span className="flex-1 text-left truncate text-xs">{lesson.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">
              {isCompleted ? "Course Completed!" : currentLesson?.title ?? "Getting Started"}
            </h1>
            {isCompleted && (
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />Completed
              </Badge>
            )}
          </div>
          {!isCompleted && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>~{Math.max(1, Math.round((course.estimated_hours / total) * 10) / 10)}h per lesson</span>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto p-8 space-y-8">
            {isCompleted ? (
              <div className="text-center py-16 space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mx-auto">
                  <Trophy className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold">You've completed {course.title}!</h2>
                <p className="text-muted-foreground">
                  Great work mastering all {total} lessons in this course.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {course.skills.map((s) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
                <Link to="/courses">
                  <Button className="mt-4">Browse More Courses</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Lesson {currentLessonIdx + 1} of {total}
                  </p>
                  <h2 className="text-2xl font-bold">{currentLesson?.title}</h2>

                  <p className="text-muted-foreground leading-relaxed">{course.description}</p>

                  <div className="space-y-2 pt-2">
                    <h3 className="font-semibold">Skills You'll Build</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.skills.map((s) => (
                        <Badge key={s} variant="outline">{s}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 p-6 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Lesson Content</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Work through the material for <strong>{currentLesson?.title}</strong>.
                      Review the concepts, try the examples, and mark this lesson complete
                      when you're ready to move on.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        Estimated: {Math.max(1, Math.round((course.estimated_hours / total) * 60))} minutes
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between border-t border-border pt-6">
                  <div />
                  <Button onClick={markLessonComplete} disabled={marking}>
                    {marking
                      ? "Saving..."
                      : currentLessonIdx === total - 1
                      ? "Complete Course"
                      : "Mark as Complete & Continue"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function moduleTitle(category: string, index: number): string {
  const map: Record<string, string[]> = {
    Frontend: ["Fundamentals", "Core Concepts", "Advanced Patterns", "Performance & Testing", "Real-World Projects"],
    Backend: ["Server Basics", "Data Layer", "Auth & Security", "API Design", "Deployment"],
    DevOps: ["Version Control", "Collaboration Workflows", "CI/CD Basics", "Automation"],
  };
  const list = map[category] ?? map.Frontend!;
  return list[index % list.length] ?? `Module ${index + 1}`;
}

function lessonTitle(category: string, index: number): string {
  const map: Record<string, string[]> = {
    Frontend: [
      "Introduction & Overview", "Setting Up Your Environment", "Core Syntax & Structure",
      "Working with Data Types", "Functions & Scope", "DOM Manipulation",
      "Event Handling", "Async Patterns", "Error Handling", "Modules & Imports",
      "Component Architecture", "State Management", "Performance Optimization", "Testing Basics",
      "Accessibility", "Responsive Design", "Build Tools & Bundlers", "Deployment",
      "Advanced Patterns", "Code Review Practices", "Real-World Project", "Debugging",
      "Security Considerations", "Final Assessment",
    ],
    Backend: [
      "Intro to Server-Side Dev", "Runtime Environment", "HTTP & REST Basics",
      "Routing & Controllers", "Middleware", "Database Connections", "CRUD Operations",
      "Authentication & JWT", "File Handling", "Error Handling",
      "Logging & Monitoring", "Testing APIs", "Caching Strategies", "Security Hardening",
      "Rate Limiting", "WebSockets", "Microservices Overview", "Containerization",
      "Performance Tuning", "Final Project",
    ],
    DevOps: [
      "Version Control Basics", "Branching Strategies", "Merging & Rebasing",
      "Pull Requests", "Code Review", "Tagging & Releases",
      "CI/CD Introduction", "Pipeline Automation", "Git Hooks", "Remote Workflows",
      "Collaboration Best Practices", "Advanced Git", "Final Project",
    ],
  };
  const list = map[category] ?? map.Frontend!;
  return `${list[index % list.length]}`;
}
