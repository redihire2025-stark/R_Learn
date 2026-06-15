import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Users, BookOpen, Code, TrendingUp, UserCheck, AlertCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { timeAgo } from "../../lib/xp";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  department: string;
  created_at: string;
}

interface ActivityItem {
  id: string;
  action: string;
  item: string;
  created_at: string;
  profiles: { name: string } | null;
}

export function AdminDashboard() {
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState({ users: 0, courses: 0, challenges: 0, completion: 0 });
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [pendingRes, activityRes, usersRes, coursesRes, challengesRes, progressRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, name, email, department, created_at")
          .eq("is_approved", false)
          .order("created_at", { ascending: false }),
        supabase
          .from("user_activity")
          .select("id, action, item, created_at, profiles(name)")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_approved", true),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("challenges").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("user_course_progress").select("progress_percent"),
      ]);

      setPending((pendingRes.data as PendingUser[]) ?? []);
      setActivity((activityRes.data ?? []) as ActivityItem[]);

      const allProgress = progressRes.data ?? [];
      const avgCompletion =
        allProgress.length > 0
          ? Math.round(allProgress.reduce((s, p) => s + p.progress_percent, 0) / allProgress.length)
          : 0;

      setStats({
        users: usersRes.count ?? 0,
        courses: coursesRes.count ?? 0,
        challenges: challengesRes.count ?? 0,
        completion: avgCompletion,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(userId: string, approve: boolean) {
    setApproving(userId);
    await supabase.from("profiles").update({ is_approved: approve }).eq("id", userId);
    setPending((prev) => prev.filter((u) => u.id !== userId));
    if (approve) setStats((prev) => ({ ...prev, users: prev.users + 1 }));
    setApproving(null);
  }

  const statCards = [
    { label: "Total Members", value: loading ? "—" : stats.users, icon: Users, color: "text-blue-500" },
    { label: "Active Courses", value: loading ? "—" : stats.courses, icon: BookOpen, color: "text-green-500" },
    { label: "Total Challenges", value: loading ? "—" : stats.challenges, icon: Code, color: "text-purple-500" },
    { label: "Avg Completion", value: loading ? "—" : `${stats.completion}%`, icon: TrendingUp, color: "text-orange-500" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage users, courses, and platform content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Pending Approvals
              {!loading && <Badge variant="secondary">{pending.length}</Badge>}
            </CardTitle>
            <Link to="/admin/users">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)
            ) : pending.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No pending approvals</p>
            ) : (
              pending.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent"
                >
                  <div>
                    <p className="font-medium">{u.name || "New User"}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <Badge variant="outline" className="text-xs mt-1">{u.department}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={approving === u.id}
                      onClick={() => handleApprove(u.id, false)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />Reject
                    </Button>
                    <Button
                      size="sm"
                      disabled={approving === u.id}
                      onClick={() => handleApprove(u.id, true)}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />Approve
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)
            ) : activity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No recent activity</p>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p>
                      <span className="font-medium">
                        {(item.profiles as { name: string } | null)?.name ?? "A user"}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {item.action} {item.item}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">{timeAgo(item.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Approve users, assign roles, and manage permissions
            </p>
            <Link to="/admin/users">
              <Button className="w-full">Manage Users</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create courses, add modules, and manage learning content
            </p>
            <Link to="/admin/courses">
              <Button className="w-full">Manage Courses</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Challenge Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create coding challenges and manage test cases
            </p>
            <Link to="/admin/challenges">
              <Button className="w-full">Manage Challenges</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
