import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { supabase } from "../../lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Users, BookOpen, Code, TrendingUp, Award, Activity } from "lucide-react";

interface DeptStat { department: string; count: number; totalXp: number; }
interface RoleStat { name: string; value: number; }

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalCourses: 0, totalChallenges: 0, totalXp: 0, totalSubmissions: 0 });
  const [deptStats, setDeptStats] = useState<DeptStat[]>([]);
  const [roleStats, setRoleStats] = useState<RoleStat[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ day: string; count: number }[]>([]);

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    setLoading(true);

    const { data: profiles } = await supabase.from("profiles").select("*");
    const { count: courseCount } = await supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_published", true);
    const { count: challengeCount } = await supabase.from("challenges").select("id", { count: "exact", head: true });
    const { count: submissionCount } = await supabase.from("challenge_submissions").select("id", { count: "exact", head: true });

    const approved = (profiles ?? []).filter((p) => p.is_approved);
    const totalXp = approved.reduce((a, p) => a + (p.xp ?? 0), 0);

    setStats({
      totalUsers: profiles?.length ?? 0,
      activeUsers: approved.length,
      totalCourses: courseCount ?? 0,
      totalChallenges: challengeCount ?? 0,
      totalXp,
      totalSubmissions: submissionCount ?? 0,
    });

    // Department breakdown
    const deptMap: Record<string, { count: number; totalXp: number }> = {};
    approved.forEach((p) => {
      const dept = p.department || "Unknown";
      if (!deptMap[dept]) deptMap[dept] = { count: 0, totalXp: 0 };
      deptMap[dept].count += 1;
      deptMap[dept].totalXp += p.xp ?? 0;
    });
    setDeptStats(Object.entries(deptMap).map(([department, v]) => ({ department, ...v })));

    // Role breakdown
    const roleCounts: Record<string, number> = {};
    (profiles ?? []).forEach((p) => { roleCounts[p.role] = (roleCounts[p.role] ?? 0) + 1; });
    setRoleStats(Object.entries(roleCounts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value })));

    // Activity last 7 days from activity_logs
    const { data: logs } = await supabase
      .from("activity_logs")
      .select("created_at")
      .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString());
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayMap: Record<string, number> = {};
    dayNames.forEach((d) => { dayMap[d] = 0; });
    logs?.forEach((l) => { const d = dayNames[new Date(l.created_at).getDay()]; dayMap[d] += 1; });
    setRecentActivity(dayNames.map((d) => ({ day: d, count: dayMap[d] })));

    setLoading(false);
  }

  if (loading) return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      <div className="grid grid-cols-2 gap-4">{Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-72" />)}</div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform-wide metrics and engagement data</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-blue-100 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-2xl font-bold">{stats.activeUsers}</p><p className="text-xs text-muted-foreground">Active Users</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-green-100 rounded-lg"><BookOpen className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-2xl font-bold">{stats.totalCourses}</p><p className="text-xs text-muted-foreground">Published Courses</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-purple-100 rounded-lg"><Code className="w-5 h-5 text-purple-600" /></div>
          <div><p className="text-2xl font-bold">{stats.totalChallenges}</p><p className="text-xs text-muted-foreground">Challenges</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-yellow-100 rounded-lg"><Award className="w-5 h-5 text-yellow-600" /></div>
          <div><p className="text-2xl font-bold">{stats.totalXp.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total XP Earned</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-red-100 rounded-lg"><Activity className="w-5 h-5 text-red-600" /></div>
          <div><p className="text-2xl font-bold">{stats.totalSubmissions}</p><p className="text-xs text-muted-foreground">Challenge Submissions</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-orange-100 rounded-lg"><TrendingUp className="w-5 h-5 text-orange-600" /></div>
          <div><p className="text-2xl font-bold">{stats.totalUsers}</p><p className="text-xs text-muted-foreground">Registered Users</p></div>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Platform Activity (Last 7 Days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={recentActivity}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Actions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>User Roles Distribution</CardTitle></CardHeader>
          <CardContent>
            {roleStats.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={roleStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                    {roleStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Users by Department</CardTitle></CardHeader>
          <CardContent>
            {deptStats.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={deptStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="department" type="category" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="count" name="Users" fill="#10b981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="totalXp" name="Total XP" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
