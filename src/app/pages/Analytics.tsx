import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Skeleton } from "../components/ui/skeleton";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, Target, Clock, Award } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface AnalyticsData {
  weeklyXp: { day: string; xp: number }[];
  monthlyProgress: { month: string; completed: number; attempted: number }[];
  skillRadar: { skill: string; score: number }[];
  accuracyByType: { category: string; accuracy: number }[];
  totalTime: number;
  avgAccuracy: number;
  completionRate: number;
  currentStreak: number;
}

const PIE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadAnalytics();
  }, [user?.id]);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const [xpRes, subRes, quizRes, progressRes] = await Promise.all([
        supabase
          .from("xp_transactions")
          .select("amount, created_at, type")
          .eq("user_id", user!.id)
          .order("created_at"),
        supabase
          .from("challenge_submissions")
          .select("passed, submitted_at, challenges(category)")
          .eq("user_id", user!.id),
        supabase
          .from("quiz_attempts")
          .select("score, passed, completed_at")
          .eq("user_id", user!.id)
          .not("completed_at", "is", null),
        supabase
          .from("user_course_progress")
          .select("progress_percent, started_at")
          .eq("user_id", user!.id),
      ]);

      // Weekly XP (last 7 days)
      const weeklyMap: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        weeklyMap[DAYS[d.getDay()]] = 0;
      }
      (xpRes.data ?? [])
        .filter((t) => new Date(t.created_at) >= new Date(Date.now() - 7 * 86400000))
        .forEach((t) => {
          const day = DAYS[new Date(t.created_at).getDay()];
          if (day in weeklyMap) weeklyMap[day] = (weeklyMap[day] ?? 0) + t.amount;
        });
      const weeklyXp = Object.entries(weeklyMap).map(([day, xp]) => ({ day, xp }));

      // Monthly progress (last 5 months)
      const monthlyMap: Record<string, { completed: number; attempted: number }> = {};
      for (let i = 4; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        monthlyMap[MONTHS[d.getMonth()]] = { completed: 0, attempted: 0 };
      }
      (subRes.data ?? []).forEach((s) => {
        const month = MONTHS[new Date(s.submitted_at).getMonth()];
        if (month in monthlyMap) {
          monthlyMap[month].attempted++;
          if (s.passed) monthlyMap[month].completed++;
        }
      });
      const monthlyProgress = Object.entries(monthlyMap).map(([month, v]) => ({ month, ...v }));

      // Skill radar from challenge categories
      const catPassed: Record<string, number> = {};
      const catTotal: Record<string, number> = {};
      (subRes.data ?? []).forEach((s: unknown) => {
        const cat = (s as { challenges: { category: string } | null })?.challenges?.category;
        if (cat) {
          catTotal[cat] = (catTotal[cat] ?? 0) + 1;
          if ((s as { passed: boolean }).passed) catPassed[cat] = (catPassed[cat] ?? 0) + 1;
        }
      });
      const skillRadar = Object.entries(catTotal).map(([skill, total]) => ({
        skill,
        score: Math.round(((catPassed[skill] ?? 0) / total) * 100),
      }));

      // Accuracy by type
      const totalSubs = (subRes.data ?? []).length;
      const passedSubs = (subRes.data ?? []).filter((s) => s.passed).length;
      const totalQuizzes = (quizRes.data ?? []).length;
      const passedQuizzes = (quizRes.data ?? []).filter((q) => q.passed).length;
      const avgQuizScore =
        totalQuizzes > 0
          ? Math.round((quizRes.data ?? []).reduce((s, q) => s + q.score, 0) / totalQuizzes)
          : 0;
      const completedCourses = (progressRes.data ?? []).filter((p) => p.progress_percent === 100).length;
      const totalCourses = (progressRes.data ?? []).length;

      const accuracyByType = [
        { category: "Challenges", accuracy: totalSubs > 0 ? Math.round((passedSubs / totalSubs) * 100) : 0 },
        { category: "Quizzes", accuracy: avgQuizScore },
        { category: "Courses", accuracy: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0 },
      ];

      // Summary stats
      const avgAccuracy =
        accuracyByType.filter((a) => a.accuracy > 0).length > 0
          ? Math.round(accuracyByType.reduce((s, a) => s + a.accuracy, 0) / accuracyByType.filter((a) => a.accuracy > 0).length)
          : 0;

      setData({
        weeklyXp,
        monthlyProgress,
        skillRadar,
        accuracyByType,
        totalTime: Math.round((progressRes.data ?? []).length * 2.5),
        avgAccuracy,
        completionRate: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0,
        currentStreak: user!.streak,
      });
    } finally {
      setLoading(false);
    }
  }

  const pieData = data
    ? [
        { name: "Challenges", value: Math.max(data.accuracyByType[0]?.accuracy ?? 0, 1) },
        { name: "Quizzes", value: Math.max(data.accuracyByType[1]?.accuracy ?? 0, 1) },
        { name: "Courses", value: Math.max(data.accuracyByType[2]?.accuracy ?? 0, 1) },
      ]
    : [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Learning Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your progress and identify areas for improvement</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Avg Daily Time", value: loading ? "—" : `${data?.totalTime ?? 0} sessions`, icon: Clock, color: "text-blue-500", note: "Based on activity" },
          { label: "Current Streak", value: loading ? "—" : `${data?.currentStreak ?? 0} days`, icon: Target, color: "text-orange-500", note: `Best: ${user?.longestStreak ?? 0} days` },
          { label: "Avg Accuracy", value: loading ? "—" : `${data?.avgAccuracy ?? 0}%`, icon: Award, color: "text-green-500", note: "Across all activities" },
          { label: "Course Completion", value: loading ? "—" : `${data?.completionRate ?? 0}%`, icon: TrendingUp, color: "text-purple-500", note: "Started vs completed" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-20" /> : (
                <><div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.note}</p></>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Weekly XP Earned</CardTitle></CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-72 w-full" /> : (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={data?.weeklyXp ?? []}>
                      <defs>
                        <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Area type="monotone" dataKey="xp" stroke="hsl(var(--primary))" fill="url(#xpGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Activity Distribution</CardTitle></CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-72 w-full" /> : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={100}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Monthly Challenge Progress</CardTitle></CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-72 w-full" /> : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data?.monthlyProgress ?? []}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" fill="hsl(var(--chart-1))" name="Passed" />
                      <Bar dataKey="attempted" fill="hsl(var(--chart-2))" name="Attempted" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Accuracy by Activity Type</CardTitle></CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-72 w-full" /> : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data?.accuracyByType ?? []}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="category" className="text-xs" />
                      <YAxis domain={[0, 100]} className="text-xs" />
                      <Tooltip formatter={(v) => `${v}%`} />
                      <Bar dataKey="accuracy" fill="hsl(var(--chart-3))" name="Accuracy %" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Skill Radar</CardTitle></CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-96 w-full" /> : (data?.skillRadar.length ?? 0) === 0 ? (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    Solve challenges to see your skill radar
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={380}>
                    <RadarChart data={data?.skillRadar ?? []}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Pass Rate %" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                      <Tooltip formatter={(v) => `${v}%`} />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Skill Breakdown</CardTitle></CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-96 w-full" /> : (data?.skillRadar.length ?? 0) === 0 ? (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    No skill data yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={380}>
                    <BarChart data={data?.skillRadar ?? []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 100]} className="text-xs" />
                      <YAxis dataKey="skill" type="category" width={110} className="text-xs" />
                      <Tooltip formatter={(v) => `${v}%`} />
                      <Bar dataKey="score" name="Pass Rate %">
                        {(data?.skillRadar ?? []).map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <Card>
            <CardHeader><CardTitle>Accuracy by Activity</CardTitle></CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-72 w-full" /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data?.accuracyByType ?? []}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="category" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="accuracy" fill="hsl(var(--chart-2))" name="Accuracy %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
