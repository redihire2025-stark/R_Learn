import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { TrendingUp, Target, Clock, Award, Zap, BookOpen, CheckCircle, Flame } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { Skeleton } from "../components/ui/skeleton";

interface ActivityDay { day: string; xp: number; challenges: number; }
interface SkillScore { skill: string; score: number; }
interface WeeklyTrend { week: string; xp: number; }

const XP_MILESTONES = [100, 250, 500, 1000, 2500, 5000, 10000];

function getMilestone(xp: number) {
  const next = XP_MILESTONES.find(m => m > xp) ?? 10000;
  const prev = [...XP_MILESTONES].reverse().find(m => m <= xp) ?? 0;
  const progress = next === prev ? 100 : Math.min(100, Math.round(((xp - prev) / (next - prev)) * 100));
  return { next, prev, progress };
}

export function Analytics() {
  const { user } = useAuth();
  const [activity, setActivity] = useState<ActivityDay[]>([]);
  const [skills, setSkills] = useState<SkillScore[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<WeeklyTrend[]>([]);
  const [stats, setStats] = useState({
    totalHours: 0, streak: 0, accuracy: 0, completionRate: 0,
    totalXp: 0, quizzesTaken: 0, challengesSolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [heatmap, setHeatmap] = useState<Record<string, number>>({});

  useEffect(() => { if (user) fetchAnalytics(); }, [user]);

  async function fetchAnalytics() {
    setLoading(true);
    if (!user) return;

    // Weekly activity
    const { data: logs } = await supabase
      .from("activity_logs").select("*").eq("user_id", user.id)
      .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()).order("created_at");
    const dayMap: Record<string, { xp: number; challenges: number }> = {};
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    days.forEach(d => { dayMap[d] = { xp: 0, challenges: 0 }; });
    logs?.forEach(l => {
      const d = days[new Date(l.created_at).getDay()];
      dayMap[d].xp += l.xp_earned ?? 0;
      if (l.item_type === "challenge") dayMap[d].challenges += 1;
    });
    setActivity(days.map(d => ({ day: d, ...dayMap[d] })));

    // Skills from quiz attempts
    const { data: quizAttempts } = await supabase
      .from("quiz_attempts").select("score, quiz:quiz_id(title, category)").eq("user_id", user.id);
    const skillMap: Record<string, number[]> = {};
    quizAttempts?.forEach((a: unknown) => {
      const attempt = a as { score: number; quiz: { category: string } | null };
      const cat = attempt.quiz?.category ?? "General";
      if (!skillMap[cat]) skillMap[cat] = [];
      skillMap[cat].push(attempt.score);
    });
    setSkills(Object.entries(skillMap).map(([skill, scores]) => ({
      skill, score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    })));

    // Heatmap + 26-week activity
    const { data: allLogs } = await supabase
      .from("activity_logs").select("created_at, xp_earned").eq("user_id", user.id)
      .gte("created_at", new Date(Date.now() - 182 * 86400000).toISOString());
    const hm: Record<string, number> = {};
    allLogs?.forEach(l => {
      const d = l.created_at.split("T")[0];
      hm[d] = (hm[d] ?? 0) + (l.xp_earned ?? 0);
    });
    setHeatmap(hm);

    // 4-week XP trend
    const trend: WeeklyTrend[] = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date(Date.now() - (3 - i + 1) * 7 * 86400000);
      const weekEnd = new Date(Date.now() - (3 - i) * 7 * 86400000);
      let xp = 0;
      Object.entries(hm).forEach(([date, val]) => {
        const d = new Date(date);
        if (d >= weekStart && d < weekEnd) xp += val;
      });
      return { week: `Week ${i + 1}`, xp };
    });
    setWeeklyTrend(trend);

    // Challenge stats
    const { data: subs } = await supabase.from("challenge_submissions").select("passed").eq("user_id", user.id);
    const accuracy = subs && subs.length > 0 ? Math.round((subs.filter(s => s.passed).length / subs.length) * 100) : 0;
    const challengesSolved = subs?.filter(s => s.passed).length ?? 0;

    // Lesson completion
    const { count: done } = await supabase.from("user_progress").select("id", { count: "exact", head: true }).eq("user_id", user.id);
    const { count: total } = await supabase.from("lessons").select("id", { count: "exact", head: true });
    const completionRate = total && total > 0 ? Math.min(100, Math.round(((done ?? 0) / total) * 100)) : 0;

    // XP from profile
    const { data: profile } = await supabase.from("profiles").select("xp").eq("id", user.id).single();
    const totalXp = profile?.xp ?? 0;

    setStats({
      totalHours: Math.round((done ?? 0) * 0.15),
      streak: user.streak,
      accuracy,
      completionRate,
      totalXp,
      quizzesTaken: quizAttempts?.length ?? 0,
      challengesSolved,
    });
    setLoading(false);
  }

  const heatmapCells = Array.from({ length: 182 }, (_, i) => {
    const d = new Date(Date.now() - (181 - i) * 86400000).toISOString().split("T")[0];
    return { date: d, xp: heatmap[d] ?? 0 };
  });

  // Month labels for heatmap
  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < 26; w++) {
    const d = new Date(Date.now() - (181 - w * 7) * 86400000);
    if (d.getMonth() !== lastMonth) {
      monthLabels.push({ col: w, label: d.toLocaleString("default", { month: "short" }) });
      lastMonth = d.getMonth();
    }
  }

  const milestone = getMilestone(stats.totalXp);
  const activeDaysThisWeek = activity.filter(d => d.xp > 0).length;
  const consistencyPct = Math.round((activeDaysThisWeek / 7) * 100);

  if (loading) return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-36 w-full rounded-2xl" />
      <div className="grid grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      <Skeleton className="h-72" />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">

      {/* Hero header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Learning Analytics</h1>
            <p className="mt-1 text-blue-100">Your personal learning insights — powered by real activity data</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-4xl font-bold">{stats.totalXp.toLocaleString()}</div>
            <div className="text-blue-200 text-sm">Total XP Earned</div>
          </div>
        </div>

        {/* XP milestone progress */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-blue-200 mb-1.5">
            <span className="font-medium">{stats.totalXp.toLocaleString()} XP</span>
            <span>Next milestone: {milestone.next.toLocaleString()} XP</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${milestone.progress}%` }} />
          </div>
          <p className="text-xs text-blue-200 mt-1.5">{milestone.progress}% to next milestone</p>
        </div>

        {/* Quick-summary mini-stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{stats.streak}</div>
            <div className="text-blue-200 text-xs mt-0.5">Day Streak</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{stats.quizzesTaken}</div>
            <div className="text-blue-200 text-xs mt-0.5">Quizzes Taken</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{stats.challengesSolved}</div>
            <div className="text-blue-200 text-xs mt-0.5">Challenges Solved</div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Hours Learned</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.totalHours}h</div>
            <p className="text-xs text-blue-500 mt-1">From lessons completed</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">Day Streak</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">{stats.streak}</div>
            <p className="text-xs text-orange-500 mt-1">Keep it going!</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Challenge Accuracy</span>
              <Award className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.accuracy}%</div>
            <p className="text-xs text-green-500 mt-1">{stats.challengesSolved} passed</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Lesson Completion</span>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.completionRate}%</div>
            <p className="text-xs text-purple-500 mt-1">Of all lessons</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Quizzes Taken</span>
              <BookOpen className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{stats.quizzesTaken}</div>
            <p className="text-xs text-indigo-500 mt-1">Total attempts</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/40 dark:to-teal-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">Challenges Solved</span>
              <CheckCircle className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-3xl font-bold text-teal-700 dark:text-teal-300">{stats.challengesSolved}</div>
            <p className="text-xs text-teal-500 mt-1">Successfully passed</p>
          </CardContent>
        </Card>

        {/* Performance overview card spanning 2 cols */}
        <Card className="md:col-span-2">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Performance Overview</h3>
            {[
              { label: "Lesson Progress", value: stats.completionRate, bar: "bg-purple-500" },
              { label: "Challenge Accuracy", value: stats.accuracy, bar: "bg-green-500" },
              { label: "Weekly Consistency", value: consistencyPct, bar: "bg-blue-500" },
            ].map(({ label, value, bar }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold">{value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${bar} rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trend">XP Trend</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="heatmap">Activity</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />Weekly XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={activity}>
                  <defs>
                    <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="xp" stroke="#3b82f6" fill="url(#xpGrad)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />Challenges / Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={activity}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="challenges" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* XP Trend */}
        <TabsContent value="trend" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />XP Earned — Last 4 Weeks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyTrend}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Line
                    type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={3}
                    dot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills */}
        <TabsContent value="skills" className="mt-6">
          {skills.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Complete quizzes to see your skill radar chart.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Skill Radar</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={skills}>
                      <PolarGrid stroke="rgba(100,100,100,0.2)" />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                      <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Skill Scores</CardTitle></CardHeader>
                <CardContent className="space-y-4 pt-2">
                  {[...skills].sort((a, b) => b.score - a.score).map(({ skill, score }) => (
                    <div key={skill}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{skill}</span>
                        <span className={`font-bold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-500"}`}>
                          {score}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-400"}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Heatmap */}
        <TabsContent value="heatmap" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Activity Heatmap — Last 26 Weeks</CardTitle></CardHeader>
            <CardContent>
              {/* Month labels */}
              <div className="flex gap-0.5 mb-1 text-xs text-muted-foreground pl-5">
                {Array.from({ length: 26 }, (_, w) => {
                  const lbl = monthLabels.find(m => m.col === w);
                  return <div key={w} className="flex-1 truncate">{lbl?.label ?? ""}</div>;
                })}
              </div>

              {/* Day labels + grid */}
              <div className="flex gap-1">
                <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground mr-1" style={{ minWidth: 18 }}>
                  {["S","M","T","W","T","F","S"].map((d, i) => (
                    <div key={i} className="h-3 flex items-center">{i % 2 === 1 ? d : ""}</div>
                  ))}
                </div>
                <div className="grid gap-0.5 flex-1" style={{ gridTemplateColumns: "repeat(26, 1fr)" }}>
                  {Array.from({ length: 26 }, (_, w) => (
                    <div key={w} className="flex flex-col gap-0.5">
                      {Array.from({ length: 7 }, (_, d) => {
                        const cell = heatmapCells[w * 7 + d];
                        const xp = cell?.xp ?? 0;
                        const bg = xp === 0
                          ? "bg-muted"
                          : xp < 20 ? "bg-blue-200 dark:bg-blue-900"
                          : xp < 50 ? "bg-blue-400 dark:bg-blue-700"
                          : xp < 100 ? "bg-blue-600"
                          : "bg-blue-800";
                        return (
                          <div
                            key={d}
                            title={`${cell?.date ?? ""}: ${xp} XP`}
                            className={`w-full aspect-square rounded-sm ${bg} hover:ring-1 hover:ring-blue-400 transition-all cursor-default`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  {["bg-muted","bg-blue-200","bg-blue-400","bg-blue-600","bg-blue-800"].map(c => (
                    <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
                  ))}
                </div>
                <span>More</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
