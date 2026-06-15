import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Trophy, Award, Flame, TrendingUp, BookOpen, Code, Calendar, ArrowRight, Clock,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { supabase } from "../../lib/supabase";
import { timeAgo } from "../../lib/xp";

interface DashboardData {
  weeklyXp: { day: string; xp: number }[];
  skillProgress: { skill: string; level: number }[];
  continueLearning: { course_id: string; title: string; progress_percent: number; thumbnail_gradient: string }[];
  leaderboard: { id: string; name: string; xp: number; rank: number; isUser?: boolean }[];
  recentActivity: { id: string; action: string; item: string; type: string; created_at: string }[];
  challengesSolved: number;
  coursesCompleted: number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function EmployeeDashboard() {
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      await refreshUser();
      await loadDashboard();
    })();
  }, [user?.id]);

  async function loadDashboard() {
    if (!user) return;
    setLoading(true);
    try {
      const [xpRes, progressRes, leaderRes, activityRes, subRes] = await Promise.all([
        // Weekly XP from xp_transactions (last 7 days)
        supabase
          .from("xp_transactions")
          .select("amount, created_at")
          .eq("user_id", user.id)
          .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
        // Course progress
        supabase
          .from("user_course_progress")
          .select("course_id, progress_percent, courses(title, thumbnail_gradient)")
          .eq("user_id", user.id)
          .gt("progress_percent", 0)
          .lt("progress_percent", 100)
          .order("last_accessed", { ascending: false })
          .limit(3),
        // Leaderboard top 5
        supabase
          .from("profiles")
          .select("id, name, xp")
          .eq("is_approved", true)
          .order("xp", { ascending: false })
          .limit(5),
        // Recent activity
        supabase
          .from("user_activity")
          .select("id, action, item, type, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        // Challenges solved
        supabase
          .from("challenge_submissions")
          .select("challenge_id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("passed", true),
      ]);

      // Build weekly XP chart (last 7 days)
      const weeklyMap: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        weeklyMap[DAYS[d.getDay()]] = 0;
      }
      (xpRes.data ?? []).forEach((t) => {
        const day = DAYS[new Date(t.created_at).getDay()];
        if (day in weeklyMap) weeklyMap[day] = (weeklyMap[day] ?? 0) + t.amount;
      });
      const weeklyXp = Object.entries(weeklyMap).map(([day, xp]) => ({ day, xp }));

      // Leaderboard with rank + current user highlight
      const leaderboard = (leaderRes.data ?? []).map((p, i) => ({
        id: p.id,
        name: p.id === user.id ? "You" : p.name,
        xp: p.xp,
        rank: i + 1,
        isUser: p.id === user.id,
      }));
      // If user not in top 5, fetch their rank
      if (!leaderboard.some((l) => l.isUser)) {
        const { count } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("is_approved", true)
          .gt("xp", user.xp);
        leaderboard.push({ id: user.id, name: "You", xp: user.xp, rank: (count ?? 0) + 1, isUser: true });
      }

      // Skill map from challenge categories
      const { data: subData } = await supabase
        .from("challenge_submissions")
        .select("challenges(category)")
        .eq("user_id", user.id)
        .eq("passed", true);
      const categoryCount: Record<string, number> = {};
      const categoryTotal: Record<string, number> = {};
      (subData ?? []).forEach((s: unknown) => {
        const cat = (s as { challenges: { category: string } | null })?.challenges?.category;
        if (cat) categoryCount[cat] = (categoryCount[cat] ?? 0) + 1;
      });
      const { data: allChallenges } = await supabase.from("challenges").select("category");
      (allChallenges ?? []).forEach((c) => {
        categoryTotal[c.category] = (categoryTotal[c.category] ?? 0) + 1;
      });
      const skillProgress = Object.entries(categoryCount).map(([skill, count]) => ({
        skill,
        level: Math.min(100, Math.round((count / Math.max(categoryTotal[skill] ?? 1, 1)) * 100)),
      }));

      // Courses completed
      const { count: completedCount } = await supabase
        .from("user_course_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("progress_percent", 100);

      // Continue learning
      const continueLearning = (progressRes.data ?? []).map((p: unknown) => {
        const row = p as {
          course_id: string;
          progress_percent: number;
          courses: { title: string; thumbnail_gradient: string } | null;
        };
        return {
          course_id: row.course_id,
          title: row.courses?.title ?? "Unknown Course",
          progress_percent: row.progress_percent,
          thumbnail_gradient: row.courses?.thumbnail_gradient ?? "from-blue-500 to-cyan-500",
        };
      });

      setData({
        weeklyXp,
        skillProgress: skillProgress.length > 0 ? skillProgress : [
          { skill: "Start solving challenges", level: 0 },
        ],
        continueLearning,
        leaderboard,
        recentActivity: activityRes.data ?? [],
        challengesSolved: subRes.count ?? 0,
        coursesCompleted: completedCount ?? 0,
      });
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
        <p className="text-muted-foreground mt-1">Here's your learning progress and upcoming activities</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total XP</CardTitle>
            <Trophy className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.xp.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">Earned through performance</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
            <Flame className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.streak} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Best: {user.longestStreak} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Courses Completed</CardTitle>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold">{data?.coursesCompleted ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {(data?.continueLearning.length ?? 0)} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Challenges Solved</CardTitle>
            <Code className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold">{data?.challengesSolved ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Keep solving!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                [1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)
              ) : data?.continueLearning.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p>No courses in progress yet.</p>
                  <Link to="/courses">
                    <Button size="sm" className="mt-3">Browse Courses</Button>
                  </Link>
                </div>
              ) : (
                data?.continueLearning.map((course) => (
                  <Link to={`/courses/${course.course_id}`} key={course.course_id}>
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer">
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${course.thumbnail_gradient} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{course.title}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={course.progress_percent} className="h-1.5" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{course.progress_percent}%</span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Weekly XP chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly XP Earned</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-48 w-full" /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data?.weeklyXp ?? []}>
                    <defs>
                      <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Area type="monotone" dataKey="xp" stroke="hsl(var(--primary))" fill="url(#xpGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Skill Progress from challenge performance */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-full" />)
              ) : data?.skillProgress.length === 0 ? (
                <p className="text-muted-foreground text-sm">Solve challenges to see your skill progress here.</p>
              ) : (
                data?.skillProgress.map((skill) => (
                  <div key={skill.skill}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{skill.skill}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)
              ) : (
                (data?.leaderboard ?? []).map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      entry.isUser ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        entry.rank === 1 ? "bg-yellow-500 text-white"
                        : entry.rank === 2 ? "bg-gray-400 text-white"
                        : entry.rank === 3 ? "bg-amber-600 text-white"
                        : "bg-muted text-foreground"
                      }`}
                    >
                      {entry.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">{entry.xp.toLocaleString()} XP</p>
                    </div>
                  </div>
                ))
              )}
              <Link to="/leaderboard">
                <Button variant="outline" size="sm" className="w-full mt-2">View Full Leaderboard</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)
              ) : (data?.recentActivity.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground">No activity yet. Start learning!</p>
              ) : (
                data?.recentActivity.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="leading-snug">
                        <span className="text-muted-foreground">{a.action}</span>{" "}
                        <span className="font-medium">{a.item}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{timeAgo(a.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
