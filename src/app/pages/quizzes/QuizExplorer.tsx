import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import {
  BookOpen, Clock, CheckCircle2, Trophy, Target,
  Code2, Palette, Zap, Shield, Atom, Server,
  Globe, Database, GitBranch, LayoutDashboard,
  Wind, Package, Lock, Building2, type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../../components/ui/skeleton";

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  time_limit_minutes: number;
  pass_percentage: number;
  questionCount?: number;
  bestScore?: number;
  attempts?: number;
}

interface QuizMeta { icon: LucideIcon; accent: string; }

const QUIZ_META: Record<string, QuizMeta> = {
  q0000001: { icon: Code2,           accent: "#e34f26" },  // HTML5 orange
  q0000002: { icon: Palette,         accent: "#264de4" },  // CSS blue
  q0000003: { icon: Zap,             accent: "#f7df1e" },  // JS yellow
  q0000004: { icon: Shield,          accent: "#3178c6" },  // TS blue
  q0000005: { icon: Atom,            accent: "#61dafb" },  // React cyan
  q0000006: { icon: Server,          accent: "#339933" },  // Node green
  q0000007: { icon: Globe,           accent: "#ff6c37" },  // Express/REST orange
  q0000008: { icon: Database,        accent: "#336791" },  // DB/SQL blue
  q0000009: { icon: GitBranch,       accent: "#f05032" },  // Git orange-red
  q0000010: { icon: LayoutDashboard, accent: "#f43f5e" },  // Backend rose
  q0000011: { icon: Wind,            accent: "#06b6d4" },  // Tailwind cyan
  q0000012: { icon: Package,         accent: "#8b5cf6" },  // Node/pkg violet
  q0000013: { icon: Lock,            accent: "#ffca28" },  // Auth yellow
  q0000014: { icon: Building2,       accent: "#326ce5" },  // System Design blue
};
const DEFAULT_META: QuizMeta = { icon: BookOpen, accent: "#6366f1" };

const diffConfig: Record<string, { badge: string }> = {
  Beginner:     { badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30" },
  Intermediate: { badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30"           },
  Advanced:     { badge: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30"                  },
};

export function QuizExplorer() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchQuizzes(); }, []);

  async function fetchQuizzes() {
    setLoading(true);
    const { data } = await supabase.from("quizzes").select("*").eq("is_published", true).order("created_at");
    if (!data) { setLoading(false); return; }

    const enriched = await Promise.all(data.map(async (q) => {
      const { count: qCount } = await supabase.from("quiz_questions").select("id", { count: "exact", head: true }).eq("quiz_id", q.id);
      if (!user) return { ...q, questionCount: qCount ?? 0 };
      const { data: attempts } = await supabase.from("quiz_attempts").select("score").eq("quiz_id", q.id).eq("user_id", user.id);
      const bestScore = attempts?.length ? Math.max(0, ...attempts.map((a) => a.score)) : 0;
      return { ...q, questionCount: qCount ?? 0, bestScore, attempts: attempts?.length ?? 0 };
    }));

    setQuizzes(enriched);
    setLoading(false);
  }

  const attempted = quizzes.filter((q) => (q.attempts ?? 0) > 0);
  const passed    = quizzes.filter((q) => (q.bestScore ?? 0) >= q.pass_percentage);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Quiz Explorer</h1>
          <p className="text-muted-foreground mt-1.5">14 topic quizzes — 15 questions each — test your knowledge across all major technologies</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-card border border-border rounded-xl px-4 py-3 text-center min-w-[72px]">
            <div className="text-xl font-bold text-emerald-500">{passed.length}</div>
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Passed</div>
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-3 text-center min-w-[72px]">
            <div className="text-xl font-bold text-foreground">{quizzes.length}</div>
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Total</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((q) => {
            const meta   = QUIZ_META[q.id] ?? DEFAULT_META;
            const Icon   = meta.icon;
            const accent = meta.accent;
            const isPassed  = (q.bestScore ?? 0) >= q.pass_percentage;
            const isAttempted = (q.attempts ?? 0) > 0;
            const diff   = diffConfig[q.difficulty];

            return (
              <Card
                key={q.id}
                className="group relative flex flex-col h-full overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-0.5"
              >
                {/* Accent top stripe */}
                <div className="h-[3px] w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}40, transparent)` }} />

                {/* Thumbnail */}
                <div className="relative w-full h-44 flex items-center justify-center overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-[#0a0c10]">
                  {/* Radial glow */}
                  <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 60%, ${accent}28 0%, transparent 68%)` }} />
                  {/* Dot grid */}
                  <div
                    className="absolute inset-0 opacity-[0.35]"
                    style={{ backgroundImage: "radial-gradient(circle, rgba(128,128,128,0.25) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
                  />
                  {/* Glow blob */}
                  <div
                    className="absolute w-28 h-28 rounded-full blur-3xl opacity-20 dark:opacity-25 group-hover:opacity-35 dark:group-hover:opacity-40 transition-opacity duration-500"
                    style={{ background: accent }}
                  />
                  {/* Icon */}
                  <div
                    className="relative z-10 w-[88px] h-[88px] rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                    style={{ background: `${accent}15`, border: `1.5px solid ${accent}30` }}
                  >
                    <Icon className="w-11 h-11 drop-shadow-lg" style={{ color: accent }} strokeWidth={1.5} />
                  </div>
                  {/* Passed badge */}
                  {isPassed && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Passed
                    </div>
                  )}
                  {/* Category pill */}
                  <span className="absolute top-3 right-3 text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-background/75 text-muted-foreground border border-border backdrop-blur-sm">
                    {q.category}
                  </span>
                </div>

                {/* Card body */}
                <CardContent className="flex flex-col flex-grow p-5 gap-3">
                  {/* Badges row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {diff && (
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold tracking-widest uppercase ${diff.badge}`}>
                        {q.difficulty}
                      </span>
                    )}
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-border bg-muted text-muted-foreground font-medium flex items-center gap-1">
                      <Trophy className="w-2.5 h-2.5 text-yellow-500" />Pass {q.pass_percentage}%
                    </span>
                  </div>

                  {/* Title + description */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold leading-snug line-clamp-1 text-foreground">{q.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">{q.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-3 mt-auto">
                    <span className="flex items-center gap-1.5 font-medium">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                      {q.questionCount} questions
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                      {q.time_limit_minutes} min
                    </span>
                    {isAttempted && (
                      <span className="flex items-center gap-1.5 font-medium text-muted-foreground/70">
                        {q.attempts} attempt{q.attempts !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Best score bar */}
                  {(q.bestScore ?? 0) > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">Best score</span>
                        <span className={`font-bold tabular-nums ${isPassed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                          {q.bestScore}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${q.bestScore}%`, background: isPassed ? "#22c55e" : accent }}
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <Link to={`/quizzes/${q.id}`} className="block w-full">
                    <Button
                      className="w-full h-9 text-xs font-semibold rounded-lg transition-all"
                      size="sm"
                      style={isAttempted && !isPassed ? { background: accent, color: "#000", border: "none", fontWeight: 700 } : {}}
                      variant={isPassed ? "outline" : isAttempted ? "default" : "default"}
                    >
                      {isPassed ? "Retake Quiz" : isAttempted ? "Try Again" : "Start Quiz"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
