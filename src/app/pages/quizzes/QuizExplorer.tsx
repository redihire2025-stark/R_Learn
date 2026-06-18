import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import {
  BookOpen, Clock, CheckCircle, Trophy, Target,
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

interface QuizMeta { icon: LucideIcon; gradient: string; iconColor: string; }

const QUIZ_META: Record<string, QuizMeta> = {
  q0000001: { icon: Code2,           gradient: "from-orange-100 to-red-100 dark:from-orange-950/40 dark:to-red-950/40",        iconColor: "text-orange-500" },
  q0000002: { icon: Palette,         gradient: "from-blue-100 to-cyan-100 dark:from-blue-950/40 dark:to-cyan-950/40",          iconColor: "text-blue-500"   },
  q0000003: { icon: Zap,             gradient: "from-yellow-100 to-amber-100 dark:from-yellow-950/40 dark:to-amber-950/40",    iconColor: "text-yellow-500" },
  q0000004: { icon: Shield,          gradient: "from-blue-100 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40",      iconColor: "text-blue-600"   },
  q0000005: { icon: Atom,            gradient: "from-cyan-100 to-sky-100 dark:from-cyan-950/40 dark:to-sky-950/40",            iconColor: "text-cyan-500"   },
  q0000006: { icon: Server,          gradient: "from-green-100 to-emerald-100 dark:from-green-950/40 dark:to-emerald-950/40",  iconColor: "text-green-500"  },
  q0000007: { icon: Globe,           gradient: "from-purple-100 to-violet-100 dark:from-purple-950/40 dark:to-violet-950/40",  iconColor: "text-purple-500" },
  q0000008: { icon: Database,        gradient: "from-teal-100 to-cyan-100 dark:from-teal-950/40 dark:to-cyan-950/40",          iconColor: "text-teal-500"   },
  q0000009: { icon: GitBranch,       gradient: "from-gray-100 to-slate-100 dark:from-gray-900/60 dark:to-slate-900/60",        iconColor: "text-gray-600 dark:text-gray-400" },
  q0000010: { icon: LayoutDashboard, gradient: "from-rose-100 to-pink-100 dark:from-rose-950/40 dark:to-pink-950/40",          iconColor: "text-rose-500"   },
  q0000011: { icon: Wind,            gradient: "from-teal-100 to-green-100 dark:from-teal-950/40 dark:to-green-950/40",        iconColor: "text-teal-500"   },
  q0000012: { icon: Package,         gradient: "from-gray-100 to-zinc-100 dark:from-gray-900/60 dark:to-zinc-900/60",          iconColor: "text-zinc-500"   },
  q0000013: { icon: Lock,            gradient: "from-red-100 to-rose-100 dark:from-red-950/40 dark:to-rose-950/40",            iconColor: "text-red-500"    },
  q0000014: { icon: Building2,       gradient: "from-violet-100 to-purple-100 dark:from-violet-950/40 dark:to-purple-950/40",  iconColor: "text-violet-500" },
};

const DEFAULT_META: QuizMeta = {
  icon: BookOpen,
  gradient: "from-primary/10 to-primary/5",
  iconColor: "text-primary",
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
      const bestScore = attempts ? Math.max(0, ...attempts.map((a) => a.score)) : 0;
      return { ...q, questionCount: qCount ?? 0, bestScore, attempts: attempts?.length ?? 0 };
    }));

    setQuizzes(enriched);
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Quiz Explorer</h1>
        <p className="text-muted-foreground mt-1">14 topic quizzes — 15 questions each — test your knowledge across all major technologies</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((q) => {
            const meta = QUIZ_META[q.id] ?? DEFAULT_META;
            const Icon = meta.icon;
            return (
              <Card key={q.id} className="hover:shadow-lg transition-all hover:-translate-y-0.5 flex flex-col h-full border border-border overflow-hidden">
                <CardHeader className="pb-2 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-bold leading-snug line-clamp-2">{q.title}</CardTitle>
                    {q.bestScore! > 0 && (
                      q.bestScore! >= q.pass_percentage
                        ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        : <Target className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{q.description}</p>
                </CardHeader>

                {/* Centered icon */}
                <div className="flex justify-center py-4 px-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-sm ring-1 ring-border/40`}>
                    <Icon className={`w-8 h-8 ${meta.iconColor}`} strokeWidth={1.5} />
                  </div>
                </div>

                <CardContent className="space-y-3 pt-0 mt-auto">
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-3">
                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-primary" />{q.questionCount} questions</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" />{q.time_limit_minutes} min</span>
                    <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-yellow-500" />Pass: {q.pass_percentage}%</span>
                  </div>
                  {q.bestScore! > 0 && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Best score</span>
                        <span className={q.bestScore! >= q.pass_percentage ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>{q.bestScore}%</span>
                      </div>
                      <Progress value={q.bestScore} className="h-1.5" />
                    </div>
                  )}
                  <Link to={`/quizzes/${q.id}`} className="block w-full">
                    <Button className="w-full font-medium" size="sm" variant={q.bestScore! >= q.pass_percentage ? "outline" : "default"}>
                      {q.attempts! > 0 ? (q.bestScore! >= q.pass_percentage ? "Retake Quiz" : "Try Again") : "Start Quiz"}
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
