import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { supabase } from "../../lib/supabase";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";
import { Users, BookOpen, Code, TrendingUp, Award, Activity, Zap, Star, Target, CheckCircle } from "lucide-react";

interface DeptStat { department: string; count: number; totalXp: number; avgXp: number; }
interface RoleStat { name: string; value: number; }
interface TopUser { id: string; full_name: string; xp: number; department: string; }

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const RANK_COLORS = ["bg-yellow-500", "bg-slate-400", "bg-orange-600", "bg-slate-500", "bg-slate-500"];

export function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0, activeUsers: 0, totalCourses: 0, totalChallenges: 0,
    totalXp: 0, totalSubmissions: 0, avgXp: 0, quizAttempts: 0,
  });
  const [deptStats, setDeptStats] = useState<DeptStat[]>([]);
  const [roleStats, setRoleStats] = useState<RoleStat[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ day: string; count: number }[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    setLoading(true);

    const { data: profiles } = await supabase.from("profiles").select("*");
    const { count: courseCount } = await supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_published", true);
    const { count: challengeCount } = await supabase.from("challenges").select("id", { count: "exact", head: true });
    const { count: submissionCount } = await supabase.from("challenge_submissions").select("id", { count: "exact", head: true });
    const { count: quizCount } = await supabase.from("quiz_attempts").select("id", { count: "exact", head: true });

    const approved = (profiles ?? []).filter(p => p.is_approved);
    const totalXp = approved.reduce((a, p) => a + (p.xp ?? 0), 0);
    const avgXp = approved.length > 0 ? Math.round(totalXp / approved.length) : 0;

    setStats({
      totalUsers: profiles?.length ?? 0,
      activeUsers: approved.length,
      totalCourses: courseCount ?? 0,
      totalChallenges: challengeCount ?? 0,
      totalXp,
      totalSubmissions: submissionCount ?? 0,
      avgXp,
      quizAttempts: quizCount ?? 0,
    });

    // Top performers
    const sorted = [...approved].sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0)).slice(0, 5);
    setTopUsers(sorted.map(p => ({
      id: p.id,
      full_name: p.full_name ?? "Unknown",
      xp: p.xp ?? 0,
      department: p.department ?? "—",
    })));

    // Department breakdown
    const deptMap: Record<string, { count: number; totalXp: number }> = {};
    approved.forEach(p => {
      const dept = p.department || "Unknown";
      if (!deptMap[dept]) deptMap[dept] = { count: 0, totalXp: 0 };
      deptMap[dept].count += 1;
      deptMap[dept].totalXp += p.xp ?? 0;
    });
    setDeptStats(Object.entries(deptMap).map(([department, v]) => ({
      department, ...v, avgXp: v.count > 0 ? Math.round(v.totalXp / v.count) : 0,
    })));

    // Role breakdown
    const roleCounts: Record<string, number> = {};
    (profiles ?? []).forEach(p => { roleCounts[p.role] = (roleCounts[p.role] ?? 0) + 1; });
    setRoleStats(Object.entries(roleCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), value,
    })));

    // Activity last 7 days
    const { data: logs } = await supabase
      .from("activity_logs").select("created_at")
      .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString());
    const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const dayMap: Record<string, number> = {};
    dayNames.forEach(d => { dayMap[d] = 0; });
    logs?.forEach(l => { const d = dayNames[new Date(l.created_at).getDay()]; dayMap[d] += 1; });
    setRecentActivity(dayNames.map(d => ({ day: d, count: dayMap[d] })));

    setLoading(false);
  }

  // Platform health score (0–100)
  const activationRate = stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0;
  const engagementScore = Math.min(100, Math.round((stats.avgXp / 500) * 100));
  const platformHealth = Math.round(activationRate * 0.5 + engagementScore * 0.3 + Math.min(20, (stats.quizAttempts / Math.max(1, stats.activeUsers)) * 2));

  const healthLabel = platformHealth >= 75 ? "Excellent" : platformHealth >= 50 ? "Good" : "Needs Attention";
  const healthColor = platformHealth >= 75 ? "text-green-400" : platformHealth >= 50 ? "text-yellow-400" : "text-red-400";

  if (loading) return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="grid grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      <div className="grid grid-cols-2 gap-4">{Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-72" />)}</div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">

      {/* Hero header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Platform Analytics</h1>
            <p className="mt-1 text-slate-300">System-wide metrics and engagement overview</p>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-5xl font-bold ${healthColor}`}>{platformHealth}</div>
            <div className="text-slate-400 text-sm">Health Score — {healthLabel}</div>
          </div>
        </div>

        {/* Platform health bar */}
        <div className="mt-4 mb-5">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${platformHealth >= 75 ? "bg-green-400" : platformHealth >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
              style={{ width: `${platformHealth}%` }}
            />
          </div>
        </div>

        {/* Quick summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{stats.totalXp.toLocaleString()}</div>
            <div className="text-slate-300 text-xs mt-0.5">Total XP Earned</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{stats.avgXp.toLocaleString()}</div>
            <div className="text-slate-300 text-xs mt-0.5">Avg XP / User</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{stats.quizAttempts.toLocaleString()}</div>
            <div className="text-slate-300 text-xs mt-0.5">Quiz Attempts</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{activationRate}%</div>
            <div className="text-slate-300 text-xs mt-0.5">Activation Rate</div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Active Users</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.activeUsers}</div>
            <p className="text-xs text-blue-500 mt-1">of {stats.totalUsers} registered</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Published Courses</span>
              <BookOpen className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.totalCourses}</div>
            <p className="text-xs text-green-500 mt-1">Available to learners</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Challenges</span>
              <Code className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.totalChallenges}</div>
            <p className="text-xs text-purple-500 mt-1">Total challenges</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-red-600 dark:text-red-400 font-medium">Submissions</span>
              <Activity className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-700 dark:text-red-300">{stats.totalSubmissions}</div>
            <p className="text-xs text-red-500 mt-1">Challenge submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health breakdown */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Platform Health Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "User Activation Rate", value: activationRate, icon: Users, bar: "bg-blue-500" },
              { label: "Avg Engagement Score", value: engagementScore, icon: Zap, bar: "bg-indigo-500" },
              { label: "Quiz Engagement", value: Math.min(100, Math.round((stats.quizAttempts / Math.max(1, stats.activeUsers)) * 10)), icon: CheckCircle, bar: "bg-green-500" },
            ].map(({ label, value, icon: Icon, bar }) => (
              <div key={label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{label}</span>
                  </div>
                  <span className="font-bold">{value}%</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${bar} rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />Platform Activity (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={recentActivity}>
                <defs>
                  <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="count" name="Actions" stroke="#3b82f6" fill="url(#actGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />User Roles Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {roleStats.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={roleStats} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={90} innerRadius={45}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {roleStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Department + Top Performers row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />Users &amp; Avg XP by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deptStats.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={deptStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="department" type="category" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend />
                  <Bar dataKey="count" name="Users" fill="#10b981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="avgXp" name="Avg XP" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topUsers.length === 0 ? (
              <div className="text-muted-foreground text-sm text-center py-4">No users yet</div>
            ) : topUsers.map((u, i) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${RANK_COLORS[i] ?? "bg-slate-500"}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{u.full_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.department}</div>
                </div>
                <div className="text-sm font-bold text-yellow-600 shrink-0">{u.xp.toLocaleString()} XP</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
