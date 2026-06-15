import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Card, CardContent } from "../../components/ui/card";
import { Clock, CheckCircle, XCircle, Trophy, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../../components/ui/skeleton";

interface Question { id: string; question: string; options: string[]; correct_answer: number; explanation: string; order_index: number; }
interface Quiz { id: string; title: string; time_limit_minutes: number; pass_percentage: number; }

export function QuizDetail() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (quizId) fetchQuiz(); }, [quizId]);

  const handleSubmit = useCallback(async (finalAnswers: Record<number, number>) => {
    if (!quiz || !user || submitted) return;
    const correct = questions.filter((q, i) => finalAnswers[i] === q.correct_answer).length;
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    await supabase.from("quiz_attempts").insert({ user_id: user.id, quiz_id: quiz.id, score: pct, answers: finalAnswers });
    const xpEarned = pct >= quiz.pass_percentage ? 50 : 10;
    await supabase.from("profiles").update({ xp: (user.xp ?? 0) + xpEarned }).eq("id", user.id);
    await supabase.from("activity_logs").insert({ user_id: user.id, action: "Attempted", item_name: quiz.title, item_type: "quiz", xp_earned: xpEarned });
  }, [quiz, user, questions, submitted]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;
    const t = setInterval(() => setTimeLeft((prev) => { if (prev <= 1) { handleSubmit(answers); return 0; } return prev - 1; }), 1000);
    return () => clearInterval(t);
  }, [timeLeft, submitted, answers, handleSubmit]);

  async function fetchQuiz() {
    setLoading(true);
    const { data: quizData } = await supabase.from("quizzes").select("*").eq("id", quizId).single();
    const { data: qData } = await supabase.from("quiz_questions").select("*").eq("quiz_id", quizId).order("order_index");
    if (quizData && qData) {
      const parsed = qData.map((q) => ({ ...q, options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string) }));
      setQuiz(quizData);
      setQuestions(parsed);
      setTimeLeft(quizData.time_limit_minutes * 60);
    }
    setLoading(false);
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-72" /></div>;
  if (!quiz || questions.length === 0) return <div className="p-8">Quiz not found or no questions available.</div>;

  if (submitted) {
    const passed = score >= quiz.pass_percentage;
    return (
      <div className="p-8 max-w-2xl mx-auto space-y-6">
        <div className={`text-center p-8 rounded-2xl ${passed ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900" : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900"}`}>
          {passed ? <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" /> : <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />}
          <h2 className="text-3xl font-bold mb-2">{score}%</h2>
          <p className="text-lg font-medium">{passed ? "🎉 Quiz Passed!" : "Try Again"}</p>
          <p className="text-muted-foreground mt-2">{questions.filter((q, i) => answers[i] === q.correct_answer).length} / {questions.length} correct · Pass mark: {quiz.pass_percentage}%</p>
        </div>
        <div className="space-y-3">
          {questions.map((q, i) => (
            <Card key={q.id} className={answers[i] === q.correct_answer ? "border-green-200 dark:border-green-900" : "border-red-200 dark:border-red-900"}>
              <CardContent className="p-4">
                <p className="font-medium text-sm mb-3">{i + 1}. {q.question}</p>
                <div className="space-y-1">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className={`text-sm px-3 py-1.5 rounded flex items-center gap-2 ${oi === q.correct_answer ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400" : answers[i] === oi ? "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400" : "text-muted-foreground"}`}>
                      {oi === q.correct_answer && <CheckCircle className="w-3.5 h-3.5" />}
                      {answers[i] === oi && oi !== q.correct_answer && <XCircle className="w-3.5 h-3.5" />}
                      {opt}
                    </div>
                  ))}
                </div>
                {q.explanation && <p className="text-xs text-muted-foreground mt-2 italic">{q.explanation}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex gap-3">
          <Link to="/quizzes" className="flex-1"><Button variant="outline" className="w-full">Back to Quizzes</Button></Link>
          <Button className="flex-1" onClick={() => { setSubmitted(false); setAnswers({}); setCurrent(0); setTimeLeft(quiz.time_limit_minutes * 60); }}>Retry Quiz</Button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progressPct = ((current + 1) / questions.length) * 100;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/quizzes" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" />Quizzes</Link>
        <div className={`flex items-center gap-1 text-sm font-mono font-medium ${timeLeft < 60 ? "text-red-500" : "text-muted-foreground"}`}>
          <Clock className="w-4 h-4" />{fmt(timeLeft)}
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Question {current + 1} of {questions.length}</span>
          <span>{Object.keys(answers).length} answered</span>
        </div>
        <Progress value={progressPct} className="h-1.5" />
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <p className="text-base font-medium leading-relaxed">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setAnswers((a) => ({ ...a, [current]: i }))}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors text-sm ${answers[current] === i ? "bg-primary/10 border-primary text-primary font-medium" : "border-border hover:bg-accent"}`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrent((c) => c - 1)} disabled={current === 0}>Previous</Button>
        <div className="flex gap-2">
          {current < questions.length - 1 ? (
            <Button onClick={() => setCurrent((c) => c + 1)}>Next</Button>
          ) : (
            <Button onClick={() => handleSubmit(answers)} className="bg-green-600 hover:bg-green-700">
              <Trophy className="w-4 h-4 mr-2" />Submit Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
