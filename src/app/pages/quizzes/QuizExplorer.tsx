import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { BookOpen, Clock, CheckCircle, Trophy, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../../components/ui/skeleton";

interface Quiz { id: string; title: string; description: string; category: string; difficulty: string; time_limit_minutes: number; pass_percentage: number; questionCount?: number; bestScore?: number; attempts?: number; }

const diffColor: Record<string, string> = { Beginner: "bg-green-100 text-green-700", Intermediate: "bg-yellow-100 text-yellow-700", Advanced: "bg-red-100 text-red-700" };

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
        <p className="text-muted-foreground mt-1">10 topic quizzes — test your knowledge across all major technologies</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((q) => (
            <Card key={q.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{q.title}</CardTitle>
                  {q.bestScore! > 0 && (
                    q.bestScore! >= q.pass_percentage
                      ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      : <Target className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-muted">{q.category}</span>
                </div>
                <p className="text-sm text-muted-foreground">{q.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{q.questionCount} questions</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{q.time_limit_minutes} min</span>
                  <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-yellow-500" />Pass: {q.pass_percentage}%</span>
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
                <Link to={`/quizzes/${q.id}`}>
                  <Button className="w-full" size="sm" variant={q.bestScore! >= q.pass_percentage ? "outline" : "default"}>
                    {q.attempts! > 0 ? (q.bestScore! >= q.pass_percentage ? "Retake Quiz" : "Try Again") : "Start Quiz"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
