import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Target, Clock, Award } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { Skeleton } from "../components/ui/skeleton";

interface ActivityDay { day: string; xp: number; challenges: number; }
interface SkillScore { skill: string; score: number; }

export function Analytics() {
  const { user } = useAuth();
  const [activity, setActivity] = useState<ActivityDay[]>([]);
  const [skills, setSkills] = useState<SkillScore[]>([]);
  const [stats, setStats] = useState({ totalHours: 0, streak: 0, accuracy: 0, completionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [heatmap, setHeatmap] = useState<Record<string, number>>({});

  useEffect(() => { if (user) fetchAnalytics(); }, [user]);

  async function fetchAnalytics() {
    setLoading(true);
    if (!user) return;

    // Weekly activity from logs
    const { data: logs } = await supabase.from("activity_logs").select("*").eq("user_id", user.id).gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()).order("created_at");

    const dayMap: Record<string, { xp: number; challenges: number }> = {};
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    days.forEach((d) => { dayMap[d] = { xp: 0, challenges: 0 }; });
    logs?.forEach((l) => {
      const d = days[new Date(l.created_at).getDay()];
      dayMap[d].xp += l.xp_earned ?? 0;
      if (l.item_type === "challenge") dayMap[d].challenges += 1;
    });
    setActivity(days.map((d) => ({ day: d, ...dayMap[d] })));

    // Skills from quiz attempts
    const { data: quizAttempts } = await supabase.from("quiz_attempts").select("score, quiz:quiz_id(title, category)").eq("user_id", user.id);
    const skillMap: Record<string, number[]> = {};
    quizAttempts?.forEach((a: unknown) => {
      const attempt = a as { score: number; quiz: { category: string } | null };
      const cat = attempt.quiz?.category ?? "General";
      if (!skillMap[cat]) skillMap[cat] = [];
      skillMap[cat].push(attempt.score);
    });
    setSkills(Object.entries(skillMap).map(([skill, scores]) => ({ skill, score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) })));

    // Heatmap from logs (last 26 weeks = 182 days)
    const { data: allLogs } = await supabase.from("activity_logs").select("created_at, xp_earned").eq("user_id", user.id).gte("created_at", new Date(Date.now() - 182 * 86400000).toISOString());
    const hm: Record<string, number> = {};
    allLogs?.forEach((l) => { const d = l.created_at.split("T")[0]; hm[d] = (hm[d] ?? 0) + (l.xp_earned ?? 0); });
    setHeatmap(hm);

    // Challenge accuracy
    const { data: subs } = await supabase.from("challenge_submissions").select("passed").eq("user_id", user.id);
    const accuracy = subs && subs.length > 0 ? Math.round((subs.filter((s) => s.passed).length / subs.length) * 100) : 0;

    // Lesson completion rate
    const { count: done } = await supabase.from("user_progress").select("id", { count: "exact", head: true }).eq("user_id", user.id);
    const { count: total } = await supabase.from("lessons").select("id", { count: "exact", head: true });
    const completionRate = total && total > 0 ? Math.round(((done ?? 0) / total) * 100) : 0;

    setStats({ totalHours: Math.round((done ?? 0) * 0.15), streak: user.streak, accuracy, completionRate });
    setLoading(false);
  }

  const heatmapCells = Array.from({ length: 182 }, (_, i) => {
    const d = new Date(Date.now() - (181 - i) * 86400000).toISOString().split("T")[0];
    const val = heatmap[d] ?? 0;
    return { date: d, xp: val };
  });

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-8 w-64" /><div className="grid grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}</div><Skeleton className="h-72" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Learning Analytics</h1>
        <p className="text-muted-foreground mt-1">Your personal learning insights — powered by real activity data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Hours Learned</CardTitle><Clock className="w-4 h-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalHours}h</div><p className="text-xs text-muted-foreground mt-1">From lessons completed</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle><Target className="w-4 h-4 text-orange-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.streak} days</div><p className="text-xs text-muted-foreground mt-1">Keep it going!</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Challenge Accuracy</CardTitle><Award className="w-4 h-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.accuracy}%</div><p className="text-xs text-muted-foreground mt-1">Challenges passed</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Lesson Completion</CardTitle><TrendingUp className="w-4 h-4 text-purple-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.completionRate}%</div><p className="text-xs text-muted-foreground mt-1">Of all lessons</p></CardContent></Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="skills">Skills</TabsTrigger><TabsTrigger value="heatmap">Activity</TabsTrigger></TabsList>

        <TabsContent value="overview" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle>Weekly XP</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><AreaChart data={activity}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="day" tick={{ fontSize: 11 }}/><YAxis tick={{ fontSize: 11 }}/><Tooltip /><Area type="monotone" dataKey="xp" stroke="#3b82f6" fill="url(#g)" strokeWidth={2}/></AreaChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle>Challenges Solved / Day</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={activity}><CartesianGrid strokeDasharray="3 3" opacity={0.3}/><XAxis dataKey="day" tick={{ fontSize: 11 }}/><YAxis tick={{ fontSize: 11 }}/><Tooltip /><Bar dataKey="challenges" fill="#10b981" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></CardContent></Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          {skills.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">Complete quizzes to see your skill radar chart.</CardContent></Card>
          ) : (
            <Card><CardHeader><CardTitle>Skill Radar (from quiz scores)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={400}><RadarChart data={skills}><PolarGrid /><PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }}/><PolarRadiusAxis angle={90} domain={[0, 100]}/><Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3}/><Tooltip /></RadarChart></ResponsiveContainer></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="heatmap" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Activity Heatmap (Last 26 weeks)</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(26, 1fr)` }}>
                {Array.from({ length: 26 }, (_, w) => (
                  <div key={w} className="flex flex-col gap-0.5">
                    {Array.from({ length: 7 }, (_, d) => {
                      const cell = heatmapCells[w * 7 + d];
                      const xp = cell?.xp ?? 0;
                      const bg = xp === 0 ? "bg-muted" : xp < 20 ? "bg-blue-200 dark:bg-blue-900" : xp < 50 ? "bg-blue-400 dark:bg-blue-700" : xp < 100 ? "bg-blue-600" : "bg-blue-800";
                      return <div key={d} title={`${cell?.date ?? ""}: ${xp} XP`} className={`w-full aspect-square rounded-sm ${bg}`} />;
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                Less <div className="flex gap-1">{["bg-muted","bg-blue-200","bg-blue-400","bg-blue-600","bg-blue-800"].map((c) => <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />)}</div> More
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
