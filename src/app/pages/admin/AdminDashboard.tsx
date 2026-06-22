import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Users, BookOpen, Code, TrendingUp, UserCheck, Shield, CheckCircle, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { sendApprovalEmail } from "../../lib/emailService";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";

interface Profile { id: string; full_name: string; email: string; department: string; role: string; is_approved: boolean; xp: number; created_at: string; }
interface Activity { id: string; action: string; item_name: string; item_type: string; created_at: string; profiles?: { full_name: string } | null; }

export function AdminDashboard() {
  const { user } = useAuth();
  const [pending, setPending] = useState<Profile[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [stats, setStats] = useState({ users: 0, courses: 0, challenges: 0, quizzes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { count: courseCount } = await supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_published", true);
    const { count: challengeCount } = await supabase.from("challenges").select("id", { count: "exact", head: true });
    const { count: quizCount } = await supabase.from("quizzes").select("id", { count: "exact", head: true });
    const { data: logs } = await supabase.from("activity_logs").select("*, profiles!user_id(full_name)").order("created_at", { ascending: false }).limit(10);

    setAllUsers(profiles ?? []);
    setPending((profiles ?? []).filter((p) => !p.is_approved));
    setRecentActivity((logs as unknown as Activity[]) ?? []);
    setStats({ users: profiles?.filter((p) => p.is_approved).length ?? 0, courses: courseCount ?? 0, challenges: challengeCount ?? 0, quizzes: quizCount ?? 0 });
    setLoading(false);
  }

  async function approveUser(id: string) {
    const user = pending.find((u) => u.id === id);
    await supabase.from("profiles").update({ is_approved: true }).eq("id", id);
    if (user) {
      await sendApprovalEmail({ name: user.full_name, email: user.email });
    }
    fetchData();
  }

  async function rejectUser(id: string) {
    await supabase.from("profiles").delete().eq("id", id);
    fetchData();
  }

  async function changeRole(id: string, role: string) {
    await supabase.from("profiles").update({ role }).eq("id", id);
    fetchData();
  }

  function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  if (user?.role !== "admin") return (
    <div className="p-8 text-center">
      <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h2 className="text-xl font-bold">Access Denied</h2>
      <p className="text-muted-foreground">You need admin privileges to access this page.</p>
    </div>
  );

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-8 w-64" /><div className="grid grid-cols-4 gap-4">{Array(4).fill(0).map((_,i)=><Skeleton key={i} className="h-24"/>)}</div></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage users, approvals, and platform data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle><Users className="w-4 h-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.users}</div>{pending.length > 0 && <p className="text-xs text-orange-500 mt-1">{pending.length} awaiting approval</p>}</CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Published Courses</CardTitle><BookOpen className="w-4 h-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.courses}</div><p className="text-xs text-muted-foreground mt-1">14 topics covered</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Challenges</CardTitle><Code className="w-4 h-4 text-purple-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.challenges}</div><p className="text-xs text-muted-foreground mt-1">All categories</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Quizzes</CardTitle><TrendingUp className="w-4 h-4 text-orange-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.quizzes}</div><p className="text-xs text-muted-foreground mt-1">10 topic quizzes</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />Pending Approvals
              {pending.length > 0 && <Badge variant="destructive" className="ml-1">{pending.length}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pending.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">{p.full_name.split(" ").map(n=>n[0]).join("").substring(0,2)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.email} · {p.department}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => approveUser(p.id)}><CheckCircle className="w-3 h-3 mr-1"/>Approve</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={() => rejectUser(p.id)}><X className="w-3 h-3 mr-1"/>Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Platform Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No activity yet.</p> : recentActivity.map((a) => (
              <div key={a.id} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <span className="text-muted-foreground flex-shrink-0 text-xs">{timeAgo(a.created_at)}</span>
                <span className="truncate"><strong>{(a.profiles as { full_name: string } | null)?.full_name ?? "User"}</strong> {a.action.toLowerCase()} <em>{a.item_name}</em></span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>All Users ({allUsers.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {allUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-muted text-xs flex items-center justify-center font-bold">{u.full_name.split(" ").map(n=>n[0]).join("").substring(0,2)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{u.full_name}</p>
                  <p className="text-xs text-muted-foreground">{u.email} · {u.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${u.is_approved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{u.is_approved ? "Active" : "Pending"}</span>
                  <span className="text-xs font-medium">{u.xp} XP</span>
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="text-xs border border-border rounded px-2 py-1 bg-background"
                  >
                    <option value="employee">Employee</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
