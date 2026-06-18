import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Trophy, Flame, BookOpen, Code, ArrowRight, TrendingUp, Target, Clock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "../../lib/supabase";
import { Skeleton } from "../../components/ui/skeleton";

import { getCourseCoverImage, getChallengesForCourse } from "../../lib/utils";

interface InProgressCourse { id: string; title: string; progress: number; thumbnail_color: string; moduleName?: string; }
interface Activity { id: string; action: string; item_name: string; item_type: string; created_at: string; xp_earned: number; }
interface WeekDay { day: string; xp: number; }
interface Leader { full_name: string; xp: number; id: string; }

export function EmployeeDashboard() {
  const { user, refreshProfile } = useAuth();
  const [inProgress, setInProgress] = useState<InProgressCourse[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [weekly, setWeekly] = useState<WeekDay[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [challengeCount, setChallengeCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) { refreshProfile(); fetchDashboard(); } }, [user?.id]);

  async function fetchDashboard() {
    if (!user) return;
    setLoading(true);

    // In-progress courses
    const { data: allCourses } = await supabase.from("courses").select("id, title, thumbnail_color").eq("is_published", true);
    if (allCourses) {
      const { data: allEasy } = await supabase.from("challenges").select("*").eq("difficulty", "Easy").eq("is_published", true);
      const withProgress = await Promise.all(allCourses.map(async (course) => {
        const modIds = (await supabase.from("modules").select("id").eq("course_id", course.id)).data?.map((m) => m.id) ?? [];
        const lessonIds = modIds.length > 0 ? (await supabase.from("lessons").select("id").in("module_id", modIds)).data?.map((l) => l.id) ?? [] : [];
        const totalLessons = lessonIds.length;
        if (totalLessons === 0) return null;

        const courseChalls = getChallengesForCourse(course.id, allEasy ?? []);
        const { data: solvedSubs } = courseChalls.length > 0
          ? await supabase
              .from("challenge_submissions")
              .select("challenge_id, passed")
              .eq("user_id", user.id)
              .in("challenge_id", courseChalls.map((c) => c.id))
              .eq("passed", true)
          : { data: [] };
        const solvedCount = new Set(solvedSubs?.map((s) => s.challenge_id) ?? []).size;

        const total = totalLessons + 3;
        const done = ((await supabase.from("user_progress").select("id", { count: "exact", head: true }).eq("user_id", user.id).in("lesson_id", lessonIds)).count ?? 0) + solvedCount;

        const progress = Math.round((done / total) * 100);
        if (progress === 0 || progress === 100) return null;
        return { ...course, progress };
      }));
      setInProgress(withProgress.filter(Boolean) as InProgressCourse[]);
    }

    // Recent activity
    const { data: logs } = await supabase.from("activity_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5);
    setActivity(logs ?? []);

    // Weekly XP
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const { data: weekLogs } = await supabase.from("activity_logs").select("created_at, xp_earned").eq("user_id", user.id).gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString());
    const dayMap: Record<string, number> = {};
    days.forEach((d) => (dayMap[d] = 0));
    weekLogs?.forEach((l) => { const d = days[new Date(l.created_at).getDay()]; dayMap[d] += l.xp_earned ?? 0; });
    setWeekly(days.map((d) => ({ day: d, xp: dayMap[d] })));

    // Leaderboard top 3
    const { data: top } = await supabase.from("profiles").select("id, full_name, xp").eq("is_approved", true).order("xp", { ascending: false }).limit(5);
    setLeaders(top ?? []);

    // Stats
    const { count: chCount } = await supabase.from("challenge_submissions").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("passed", true);
    setChallengeCount(chCount ?? 0);
    const { count: cCount } = await supabase.from("user_progress").select("id", { count: "exact", head: true }).eq("user_id", user.id);
    setCourseCount(cCount ?? 0);

    setLoading(false);
  }

  function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  const myRank = leaders.findIndex((l) => l.id === user?.id) + 1;
  const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  const avatarColors = ["bg-blue-500","bg-green-500","bg-purple-500","bg-orange-500","bg-pink-500"];

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-8 w-64" /><div className="grid grid-cols-4 gap-4">{Array(4).fill(0).map((_,i)=><Skeleton key={i} className="h-24"/>)}</div><Skeleton className="h-64"/></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
        <p className="text-muted-foreground mt-1">Your live learning dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total XP</CardTitle><Trophy className="w-4 h-4 text-yellow-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{user?.xp?.toLocaleString() ?? 0}</div>{myRank > 0 && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-500"/>Rank #{myRank}</p>}</CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle><Flame className="w-4 h-4 text-orange-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{user?.streak ?? 0} days</div><p className="text-xs text-muted-foreground mt-1">Keep the momentum!</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Lessons Done</CardTitle><BookOpen className="w-4 h-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{courseCount}</div><p className="text-xs text-muted-foreground mt-1">{inProgress.length} courses in progress</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Challenges Solved</CardTitle><Code className="w-4 h-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{challengeCount}</div><p className="text-xs text-muted-foreground mt-1">Out of 15 total</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {inProgress.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Continue Learning</CardTitle>
                <Link to="/courses"><Button variant="ghost" size="sm">View All</Button></Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {inProgress.slice(0, 3).map((course) => (
                  <Link key={course.id} to={`/courses/${course.id}`}>
                    <div className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer">
                      <img 
                        src={getCourseCoverImage(course.title)} 
                        alt={course.title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{course.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Progress value={course.progress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">{course.progress}%</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {inProgress.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="font-medium">No courses in progress</p>
                <p className="text-sm text-muted-foreground mb-4">Start learning from 14 technology tracks</p>
                <Link to="/courses"><Button>Browse Courses</Button></Link>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Weekly XP</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={weekly}>
                  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }}/>
                  <YAxis tick={{ fontSize: 11 }}/>
                  <Tooltip />
                  <Area type="monotone" dataKey="xp" stroke="#3b82f6" fill="url(#g)" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Learners</CardTitle>
              <Link to="/leaderboard"><Button variant="ghost" size="sm">Full Board</Button></Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {leaders.slice(0, 5).map((l, i) => (
                <div key={l.id} className={`flex items-center gap-3 p-2 rounded-lg ${l.id === user?.id ? "bg-primary/5 border border-primary/20" : ""}`}>
                  <span className="text-xs font-bold w-5 text-center text-muted-foreground">#{i + 1}</span>
                  <div className={`w-7 h-7 rounded-full ${avatarColors[i % avatarColors.length]} text-white text-xs flex items-center justify-center font-bold`}>{initials(l.full_name)}</div>
                  <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate">{l.full_name}{l.id === user?.id ? " (you)" : ""}</p></div>
                  <span className="text-xs font-semibold">{l.xp.toLocaleString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {activity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No activity yet. Start a course or challenge!</p>
              ) : activity.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    {a.item_type === "challenge" ? <Code className="w-3.5 h-3.5" /> : a.item_type === "quiz" ? <Target className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs"><span className="font-medium">{a.action}</span> {a.item_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{timeAgo(a.created_at)}</span>
                      {a.xp_earned > 0 && <span className="text-[10px] text-green-600 font-medium">+{a.xp_earned} XP</span>}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Link to="/challenges"><Button variant="outline" className="w-full justify-start gap-2"><Code className="w-4 h-4"/>Solve a Challenge</Button></Link>
              <Link to="/quizzes"><Button variant="outline" className="w-full justify-start gap-2"><Target className="w-4 h-4"/>Take a Quiz</Button></Link>
              <Link to="/courses"><Button variant="outline" className="w-full justify-start gap-2"><BookOpen className="w-4 h-4"/>Browse Courses</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
