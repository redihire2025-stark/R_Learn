import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../hooks/useAuth";
import { Trophy, Flame, BookOpen, Code, Save, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Skeleton } from "../components/ui/skeleton";

interface Activity { id: string; action: string; item_name: string; item_type: string; created_at: string; xp_earned: number; }

export function Profile() {
  const { user, updateUser, refreshProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [department, setDepartment] = useState(user?.department ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [stats, setStats] = useState({ lessons: 0, challenges: 0, quizzes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchProfile(); }, [user?.id]);

  async function fetchProfile() {
    if (!user) return;
    setLoading(true);
    const { data: logs } = await supabase.from("activity_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
    setActivity(logs ?? []);
    const { count: lessons } = await supabase.from("user_progress").select("id", { count: "exact", head: true }).eq("user_id", user.id);
    const { count: challenges } = await supabase.from("challenge_submissions").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("passed", true);
    const { count: quizzes } = await supabase.from("quiz_attempts").select("id", { count: "exact", head: true }).eq("user_id", user.id);
    setStats({ lessons: lessons ?? 0, challenges: challenges ?? 0, quizzes: quizzes ?? 0 });
    setLoading(false);
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({ full_name: name, department }).eq("id", user.id);
    updateUser({ name, department });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  }

  const initials = user?.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() ?? "?";

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64" /></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto">{initials}</div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-2">{user?.role}</Badge>
            </div>
            <Separator />
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500"/>Total XP</span><span className="font-bold">{user?.xp?.toLocaleString()}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500"/>Streak</span><span className="font-bold">{user?.streak} days</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-500"/>Lessons</span><span className="font-bold">{stats.lessons}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground flex items-center gap-2"><Code className="w-4 h-4 text-green-500"/>Challenges</span><span className="font-bold">{stats.challenges}</span></div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="settings">
            <TabsList><TabsTrigger value="settings">Settings</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>

            <TabsContent value="settings" className="mt-4">
              <Card>
                <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input value={user?.email} disabled className="opacity-60" /></div>
                  <div className="space-y-2"><Label>Department</Label><Input value={department} onChange={(e) => setDepartment(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Role</Label><Input value={user?.role} disabled className="opacity-60" /></div>
                  <Button onClick={saveProfile} disabled={saving} className="w-full">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {saved ? "Saved!" : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {activity.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No activity yet.</p> : activity.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 border border-border rounded-lg text-sm">
                      <div className="flex-1">
                        <span className="font-medium">{a.action}</span> <span className="text-muted-foreground">{a.item_name}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {a.xp_earned > 0 && <div className="text-xs text-green-600 font-medium">+{a.xp_earned} XP</div>}
                        <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
