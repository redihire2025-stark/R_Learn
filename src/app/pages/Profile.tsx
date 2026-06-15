import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "../hooks/useAuth";
import {
  User, Mail, Building2, Trophy, Award, Flame, BookOpen, Code, Shield,
} from "lucide-react";
import { supabase, UserCertification, Certification } from "../lib/supabase";
import { getInitials } from "../lib/xp";

interface Achievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
}

interface HistoryItem {
  id: string;
  course: string;
  completedAt: string;
  hasCert: boolean;
}

export function Profile() {
  const { user, updateUser, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [stats, setStats] = useState({ challengesSolved: 0, coursesCompleted: 0, certsEarned: 0 });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    loadProfileData();
  }, [user?.id]);

  async function loadProfileData() {
    if (!user) return;
    setLoadingData(true);
    try {
      const [subRes, progressRes, certRes] = await Promise.all([
        supabase
          .from("challenge_submissions")
          .select("challenge_id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("passed", true),
        supabase
          .from("user_course_progress")
          .select("course_id, progress_percent, completed_at, courses(title)")
          .eq("user_id", user.id)
          .eq("progress_percent", 100)
          .order("completed_at", { ascending: false }),
        supabase
          .from("user_certifications")
          .select("*, certifications(title)")
          .eq("user_id", user.id),
      ]);

      const challengesSolved = subRes.count ?? 0;
      const coursesCompleted = (progressRes.data?.length ?? 0);
      const certsEarned = (certRes.data?.length ?? 0);

      setStats({ challengesSolved, coursesCompleted, certsEarned });

      // Build achievements based on real data
      const earned: Achievement[] = [
        { id: "first-login", title: "First Steps", description: "Signed in to R-Learn", earned: true },
        { id: "streak-7", title: "Week Warrior", description: "7-day learning streak", earned: user.streak >= 7 },
        { id: "challenges-10", title: "Code Starter", description: "Solved 10 challenges", earned: challengesSolved >= 10 },
        { id: "challenges-50", title: "Challenge Master", description: "Solved 50 challenges", earned: challengesSolved >= 50 },
        { id: "courses-3", title: "Knowledge Seeker", description: "Completed 3 courses", earned: coursesCompleted >= 3 },
        { id: "cert-1", title: "Certified Developer", description: "Earned first certification", earned: certsEarned >= 1 },
        { id: "xp-1000", title: "XP Collector", description: "Earned 1000 XP", earned: user.xp >= 1000 },
        { id: "streak-30", title: "Streak Legend", description: "30-day learning streak", earned: user.longestStreak >= 30 },
      ];
      setAchievements(earned);

      // Build learning history from completed courses and certs
      const histItems: HistoryItem[] = (progressRes.data ?? []).map((p: unknown) => {
        const row = p as {
          course_id: string;
          progress_percent: number;
          completed_at: string | null;
          courses: { title: string } | null;
        };
        const hasCert = (certRes.data ?? []).some(
          (c: unknown) => (c as { certifications: { title: string } | null })?.certifications?.title === row.courses?.title
        );
        return {
          id: row.course_id,
          course: row.courses?.title ?? "Unknown Course",
          completedAt: row.completed_at
            ? new Date(row.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "Completed",
          hasCert,
        };
      });
      setHistory(histItems);
    } finally {
      setLoadingData(false);
    }
  }

  async function handleSave() {
    if (!user || !name.trim()) return;
    setSaving(true);
    setSaveMsg("");
    try {
      await supabase.from("profiles").update({ name: name.trim(), updated_at: new Date().toISOString() }).eq("id", user.id);
      updateUser({ name: name.trim() });
      setSaveMsg("Changes saved!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and view your progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 text-center space-y-4">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-2 capitalize">{user.role}</Badge>
            </div>
            <Separator />
            <div className="space-y-3 text-left">
              {[
                { icon: Trophy, label: "Total XP", value: `${user.xp.toLocaleString()} XP`, color: "text-yellow-500" },
                { icon: Flame, label: "Current Streak", value: `${user.streak} days`, color: "text-orange-500" },
                { icon: BookOpen, label: "Courses", value: loadingData ? "..." : `${stats.coursesCompleted} completed`, color: "text-blue-500" },
                { icon: Code, label: "Challenges", value: loadingData ? "..." : `${stats.challengesSolved} solved`, color: "text-green-500" },
                { icon: Award, label: "Certificates", value: loadingData ? "..." : `${stats.certsEarned} earned`, color: "text-purple-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    {item.label}
                  </span>
                  <span className="font-bold text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right: Tabs */}
        <Card className="lg:col-span-2">
          <Tabs defaultValue="account">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* Account */}
              <TabsContent value="account" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="email" type="email" value={user.email} className="pl-10" disabled />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={user.department} className="pl-10" disabled />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={user.role} className="pl-10 capitalize" disabled />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={handleSave} disabled={saving || !name.trim()}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    {saveMsg && <p className="text-sm text-green-500">{saveMsg}</p>}
                  </div>
                </div>
              </TabsContent>

              {/* Achievements */}
              <TabsContent value="achievements" className="mt-0">
                <h3 className="text-lg font-bold mb-4">Achievements & Badges</h3>
                {loadingData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((a) => (
                      <div
                        key={a.id}
                        className={`p-4 rounded-lg border ${a.earned ? "bg-yellow-500/5 border-yellow-500/20" : "bg-muted/50 border-border opacity-60"}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.earned ? "bg-yellow-500/20" : "bg-muted"}`}>
                            <Award className={`w-5 h-5 ${a.earned ? "text-yellow-500" : "text-muted-foreground"}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{a.title}</p>
                            <p className="text-sm text-muted-foreground">{a.description}</p>
                            {a.earned && <Badge variant="secondary" className="mt-1 text-xs">Earned</Badge>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* History */}
              <TabsContent value="history" className="mt-0">
                <h3 className="text-lg font-bold mb-4">Learning History</h3>
                {loadingData ? (
                  <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
                ) : history.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No completed courses yet. Keep learning!</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div>
                          <p className="font-medium">{item.course}</p>
                          <p className="text-sm text-muted-foreground">Completed {item.completedAt}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {item.hasCert && (
                            <Badge variant="secondary" className="text-xs">
                              <Award className="w-3 h-3 mr-1" />Certified
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
