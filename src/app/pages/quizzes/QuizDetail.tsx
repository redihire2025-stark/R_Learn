import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Card, CardContent } from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import { Clock, CheckCircle, XCircle, Trophy, ArrowLeft } from "lucide-react";
import { supabase, Quiz, QuizQuestion } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { addXp, logActivity, updateStreak } from "../../lib/xp";

export function QuizDetail() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // answers maps questionId → selected option text
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (quizId) loadQuiz();
  }, [quizId]);

  async function loadQuiz() {
    setLoading(true);
    try {
      const [{ data: q }, { data: qs }] = await Promise.all([
        supabase.from("quizzes").select("*").eq("id", quizId!).single(),
        supabase.from("quiz_questions").select("*").eq("quiz_id", quizId!).order("order_index"),
      ]);
      if (q) {
        setQuiz(q);
        setTimeLeft((q.time_limit ?? 15) * 60);
      }
      if (qs) setQuestions(qs);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loading || isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [loading, isSubmitted, timeLeft]);

  // Auto-submit when timer hits zero
  useEffect(() => {
    if (!loading && !isSubmitted && timeLeft === 0 && questions.length > 0) {
      submitQuiz();
    }
  }, [timeLeft, loading, isSubmitted]);

  async function submitQuiz() {
    if (!quiz || !user || isSubmitted) return;
    setIsSubmitted(true);
    setSaving(true);

    const correct = questions.filter((q) => answers[q.id] === q.correct_answer).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= (quiz.pass_threshold ?? 70);
    const xp = passed ? quiz.xp_reward : 0;

    await supabase.from("quiz_attempts").insert({
      user_id: user.id,
      quiz_id: quiz.id,
      score,
      passed,
      answers,
      completed_at: new Date().toISOString(),
      xp_earned: xp,
    });

    if (passed) {
      await Promise.all([
        addXp(xp, "quiz", `Passed: ${quiz.title}`, quiz.id),
        logActivity("Passed", quiz.title, "quiz", xp),
        updateStreak(),
      ]);
      refreshUser();
      setXpEarned(xp);
    }

    setSaving(false);
    setShowResults(true);
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Quiz not found.{" "}
        <button className="text-primary hover:underline" onClick={() => navigate("/quizzes")}>
          Back to Quizzes
        </button>
      </div>
    );
  }

  if (showResults) {
    const correct = questions.filter((q) => answers[q.id] === q.correct_answer).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= (quiz.pass_threshold ?? 70);

    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-background">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
                passed ? "bg-green-500/10" : score >= 50 ? "bg-yellow-500/10" : "bg-red-500/10"
              }`}
            >
              <Trophy
                className={`w-12 h-12 ${
                  passed ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"
                }`}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
              <p className="text-muted-foreground">
                {passed
                  ? "Excellent! You've passed this quiz."
                  : score >= 50
                  ? "Good effort! Review the material and try again."
                  : "Keep learning! Practice makes perfect."}
              </p>
              {xpEarned > 0 && (
                <p className="text-yellow-500 font-semibold mt-2">+{xpEarned} XP earned!</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6 py-6">
              <div>
                <p className="text-4xl font-bold text-primary">{score}%</p>
                <p className="text-sm text-muted-foreground mt-1">Your Score</p>
              </div>
              <div>
                <p className="text-4xl font-bold">{correct}</p>
                <p className="text-sm text-muted-foreground mt-1">Correct Answers</p>
              </div>
              <div>
                <p className="text-4xl font-bold">{questions.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Questions</p>
              </div>
            </div>

            <div className="space-y-3 text-left">
              <h3 className="font-bold text-center">Review Answers</h3>
              {questions.map((q, index) => {
                const isCorrect = answers[q.id] === q.correct_answer;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border ${
                      isCorrect
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-red-500/5 border-red-500/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-1">
                          {index + 1}. {q.question}
                        </p>
                        {!isCorrect && (
                          <div className="text-sm space-y-0.5">
                            <p className="text-red-500">
                              Your answer: {answers[q.id] ?? "Not answered"}
                            </p>
                            <p className="text-green-500">Correct: {q.correct_answer}</p>
                          </div>
                        )}
                        {q.explanation && (
                          <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate("/quizzes")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quizzes
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setAnswers({});
                  setCurrentQuestion(0);
                  setShowResults(false);
                  setIsSubmitted(false);
                  setXpEarned(0);
                  setTimeLeft((quiz.time_limit ?? 15) * 60);
                }}
              >
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const opts = currentQ.options as string[];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 text-sm font-mono ${
              timeLeft < 60 ? "text-red-500" : ""
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
          <Button variant="outline" size="sm" onClick={submitQuiz} disabled={saving}>
            Submit Quiz
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
        <Progress value={(answeredCount / questions.length) * 100} className="h-2" />
      </div>

      <Card>
        <CardContent className="p-8 space-y-6">
          <h2 className="text-xl font-bold">{currentQ.question}</h2>
          <RadioGroup
            value={answers[currentQ.id] ?? ""}
            onValueChange={(value) =>
              setAnswers((prev) => ({ ...prev, [currentQ.id]: value }))
            }
          >
            <div className="space-y-3">
              {opts.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                    answers[currentQ.id] === option
                      ? "border-primary bg-primary/5"
                      : "hover:bg-accent"
                  }`}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [currentQ.id]: option }))
                  }
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="flex justify-between pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion((p) => p - 1)}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentQuestion < questions.length - 1)
                  setCurrentQuestion((p) => p + 1);
                else submitQuiz();
              }}
            >
              {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestion(index)}
            className={`w-10 h-10 rounded-lg border font-medium text-sm transition-colors ${
              currentQuestion === index
                ? "border-primary bg-primary text-primary-foreground"
                : answers[q.id] !== undefined
                ? "border-green-500 bg-green-500/10 text-green-500"
                : "border-border hover:bg-accent"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
