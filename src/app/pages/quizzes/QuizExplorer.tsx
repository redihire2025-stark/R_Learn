import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Skeleton } from "../../components/ui/skeleton";
import { BookOpen, Clock, CheckCircle, Target, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase, Quiz, QuizAttempt } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { difficultyColor } from "../../lib/xp";

type QuizWithAttempt = Quiz & {
  bestScore?: number;
  attempts: number;
  passed: boolean;
};

export function QuizExplorer() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizWithAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadQuizzes();
  }, [user?.id]);

  async function loadQuizzes() {
    setLoading(true);
    try {
      const [{ data: quizData }, { data: attemptData }] = await Promise.all([
        supabase.from("quizzes").select("*").eq("is_published", true).order("created_at"),
        supabase.from("quiz_attempts").select("*").eq("user_id", user!.id),
      ]);

      const attemptMap: Record<string, { attempts: number; bestScore: number; passed: boolean }> = {};
      (attemptData as QuizAttempt[] ?? []).forEach((a) => {
        const cur = attemptMap[a.quiz_id];
        if (!cur) {
          attemptMap[a.quiz_id] = { attempts: 1, bestScore: a.score, passed: a.passed };
        } else {
          cur.attempts++;
          cur.bestScore = Math.max(cur.bestScore, a.score);
          if (a.passed) cur.passed = true;
        }
      });

      setQuizzes(
        (quizData as Quiz[] ?? []).map((q) => ({
          ...q,
          attempts: attemptMap[q.id]?.attempts ?? 0,
          bestScore: attemptMap[q.id]?.bestScore,
          passed: attemptMap[q.id]?.passed ?? false,
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  const completed = quizzes.filter((q) => q.passed);
  const available = quizzes.filter((q) => !q.passed);
  const avgScore =
    completed.length > 0
      ? Math.round(completed.reduce((s, q) => s + (q.bestScore ?? 0), 0) / completed.length)
      : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Knowledge Quizzes</h1>
        <p className="text-muted-foreground mt-1">Test and reinforce your understanding</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quizzes Passed</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <><div className="text-2xl font-bold">{completed.length}</div>
              <p className="text-xs text-muted-foreground">{available.length} remaining</p></>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            <Target className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <><div className="text-2xl font-bold">{avgScore}%</div>
              <Progress value={avgScore} className="h-1.5 mt-2" /></>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Questions</CardTitle>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <><div className="text-2xl font-bold">{quizzes.reduce((s, q) => s + q.total_questions, 0)}</div>
              <p className="text-xs text-muted-foreground">Across all quizzes</p></>
            )}
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : (
        <>
          {/* Completed */}
          {completed.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Completed Quizzes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completed.map((quiz) => (
                  <Card key={quiz.id} className="border-green-500/20 bg-green-500/5">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            {quiz.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-bold text-green-500">{quiz.bestScore}%</p>
                          <p className="text-xs text-muted-foreground">Best score</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-medium">{quiz.attempts}</p>
                          <p className="text-xs text-muted-foreground">{quiz.attempts === 1 ? "Attempt" : "Attempts"}</p>
                        </div>
                      </div>
                      <Link to={`/quizzes/${quiz.id}`}>
                        <Button variant="outline" className="w-full">Retake Quiz</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Available */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Available Quizzes</h2>
            {available.length === 0 ? (
              <p className="text-muted-foreground">You've passed all available quizzes!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {available.map((quiz) => (
                  <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{quiz.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={difficultyColor(quiz.difficulty) as "default" | "secondary" | "destructive" | "outline"} className="text-xs capitalize">
                          {quiz.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{quiz.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {quiz.total_questions} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {quiz.time_limit} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          {quiz.xp_reward} XP
                        </span>
                      </div>
                      {quiz.attempts > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Previous best: {quiz.bestScore ?? 0}% — not passed yet (need {quiz.pass_threshold}%)
                        </p>
                      )}
                      <Link to={`/quizzes/${quiz.id}`}>
                        <Button className="w-full">
                          {quiz.attempts > 0 ? "Retry Quiz" : "Start Quiz"}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
