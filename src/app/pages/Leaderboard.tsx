import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Skeleton } from "../components/ui/skeleton";
import { Trophy, Medal, Award, TrendingUp, Flame } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { getInitials } from "../lib/xp";

interface LeaderEntry {
  id: string;
  name: string;
  department: string;
  xp: number;
  streak: number;
  weeklyXp: number;
  rank: number;
  isCurrentUser: boolean;
}

interface DeptEntry {
  department: string;
  totalXp: number;
  members: number;
  avgXp: number;
  rank: number;
}

export function Leaderboard() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [departments, setDepartments] = useState<DeptEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadLeaderboard();
  }, [user?.id]);

  async function loadLeaderboard() {
    setLoading(true);
    try {
      const [{ data: profiles }, { data: weeklyXpData }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, name, department, xp, streak")
          .eq("is_approved", true)
          .order("xp", { ascending: false }),
        supabase
          .from("xp_transactions")
          .select("user_id, amount")
          .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
      ]);

      // Weekly XP map
      const weeklyMap: Record<string, number> = {};
      (weeklyXpData ?? []).forEach((t) => {
        weeklyMap[t.user_id] = (weeklyMap[t.user_id] ?? 0) + t.amount;
      });

      const leaderboard: LeaderEntry[] = (profiles ?? []).map((p, i) => ({
        id: p.id,
        name: p.name,
        department: p.department,
        xp: p.xp,
        streak: p.streak,
        weeklyXp: weeklyMap[p.id] ?? 0,
        rank: i + 1,
        isCurrentUser: p.id === user!.id,
      }));

      setLeaders(leaderboard);

      // Department rankings
      const deptMap: Record<string, { totalXp: number; members: number }> = {};
      (profiles ?? []).forEach((p) => {
        const d = p.department || "Unknown";
        if (!deptMap[d]) deptMap[d] = { totalXp: 0, members: 0 };
        deptMap[d].totalXp += p.xp;
        deptMap[d].members++;
      });
      const depts = Object.entries(deptMap)
        .map(([department, v]) => ({
          department,
          totalXp: v.totalXp,
          members: v.members,
          avgXp: Math.round(v.totalXp / v.members),
          rank: 0,
        }))
        .sort((a, b) => b.totalXp - a.totalXp)
        .map((d, i) => ({ ...d, rank: i + 1 }));
      setDepartments(depts);
    } finally {
      setLoading(false);
    }
  }

  const top3 = leaders.slice(0, 3);

  function getRankIcon(rank: number) {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />;
    return (
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
        {rank}
      </div>
    );
  }

  const LeaderRow = ({ entry }: { entry: LeaderEntry }) => (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
        entry.isCurrentUser ? "bg-primary/10 border border-primary/20" : "bg-muted/50 hover:bg-muted"
      }`}
    >
      <div className="w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
      <Avatar className="w-10 h-10">
        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
          {getInitials(entry.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {entry.name}
          {entry.isCurrentUser && <Badge variant="outline" className="ml-2 text-xs">You</Badge>}
        </p>
        <p className="text-sm text-muted-foreground">{entry.department}</p>
      </div>
      <div className="flex items-center gap-6 text-sm flex-shrink-0">
        <div className="text-right">
          <p className="font-bold">{entry.xp.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total XP</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="font-bold text-green-500">+{entry.weeklyXp}</p>
          <p className="text-xs text-muted-foreground">This Week</p>
        </div>
        <div className="flex items-center gap-1">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-medium">{entry.streak}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">See how you rank against your peers</p>
      </div>

      {/* Top 3 podium */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {top3.map((entry, i) => (
            <Card
              key={entry.id}
              className={
                i === 0
                  ? "bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20"
                  : i === 1
                  ? "bg-gradient-to-br from-gray-400/10 to-gray-400/5 border-gray-400/20"
                  : "bg-gradient-to-br from-amber-600/10 to-amber-600/5 border-amber-600/20"
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground">
                    {i === 0 ? "🥇 First" : i === 1 ? "🥈 Second" : "🥉 Third"} Place
                  </CardTitle>
                  {getRankIcon(entry.rank)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {getInitials(entry.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">
                      {entry.name}
                      {entry.isCurrentUser && <span className="text-primary text-xs ml-1">(You)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{entry.department}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total XP</span>
                  <span className="font-bold">{entry.xp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-bold text-green-500">+{entry.weeklyXp}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Tabs defaultValue="alltime">
        <TabsList>
          <TabsTrigger value="alltime"><Trophy className="w-4 h-4 mr-2" />All Time</TabsTrigger>
          <TabsTrigger value="weekly"><TrendingUp className="w-4 h-4 mr-2" />This Week</TabsTrigger>
          <TabsTrigger value="department"><Award className="w-4 h-4 mr-2" />Department</TabsTrigger>
        </TabsList>

        <TabsContent value="alltime" className="mt-6">
          <Card>
            <CardHeader><CardTitle>All-Time Rankings</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : (
                <div className="space-y-3">
                  {leaders.map((entry) => <LeaderRow key={entry.id} entry={entry} />)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <Card>
            <CardHeader><CardTitle>This Week's Rankings</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : (
                <div className="space-y-3">
                  {[...leaders]
                    .sort((a, b) => b.weeklyXp - a.weeklyXp)
                    .map((entry, i) => <LeaderRow key={entry.id} entry={{ ...entry, rank: i + 1 }} />)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Department Rankings</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : (
                <div className="space-y-3">
                  {departments.map((dept) => (
                    <div key={dept.department} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="w-12 flex justify-center">{getRankIcon(dept.rank)}</div>
                      <div className="flex-1">
                        <p className="font-medium">{dept.department}</p>
                        <p className="text-sm text-muted-foreground">{dept.members} {dept.members === 1 ? "member" : "members"}</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="font-bold">{dept.totalXp.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Total XP</p>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="font-bold">{dept.avgXp.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Avg XP</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
