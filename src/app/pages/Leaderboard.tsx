import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Trophy, Flame } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { Skeleton } from "../components/ui/skeleton";

interface LeaderEntry { id: string; full_name: string; department: string; xp: number; streak: number; email: string; }

function getInitials(name: string) { return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase(); }
const avatarColors = ["bg-blue-500","bg-green-500","bg-purple-500","bg-orange-500","bg-pink-500","bg-teal-500","bg-indigo-500"];

export function Leaderboard() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLeaderboard(); }, []);

  async function fetchLeaderboard() {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("id, full_name, department, xp, streak, email").eq("is_approved", true).order("xp", { ascending: false }).limit(50);
    setLeaders(data ?? []);
    setLoading(false);
  }

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);
  const myRank = leaders.findIndex((l) => l.id === user?.id) + 1;

  const Row = ({ entry, rank }: { entry: LeaderEntry; rank: number }) => {
    const isMe = entry.id === user?.id;
    const color = avatarColors[(rank - 1) % avatarColors.length];
    return (
      <div className={`flex items-center gap-4 p-3 rounded-lg ${isMe ? "bg-primary/5 border border-primary/20" : "hover:bg-accent"}`}>
        <div className={`w-7 text-sm font-bold ${rank <= 3 ? "text-yellow-500" : "text-muted-foreground"}`}>#{rank}</div>
        <div className={`w-9 h-9 rounded-full ${color} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>{getInitials(entry.full_name)}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm flex items-center gap-1">{entry.full_name} {isMe && <span className="text-xs text-primary font-normal">(you)</span>}</div>
          <div className="text-xs text-muted-foreground">{entry.department}</div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" />{entry.streak}d</span>
          <span className="font-semibold">{entry.xp.toLocaleString()} XP</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">Company-wide XP rankings — updated in real time</p>
      </div>

      {user && myRank > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <Trophy className="w-6 h-6 text-primary" />
            <div><p className="font-semibold">Your rank: #{myRank}</p><p className="text-sm text-muted-foreground">{user.xp.toLocaleString()} XP · {user.streak} day streak</p></div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
      ) : (
        <>
          {top3.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {top3.map((entry, i) => {
                const color = avatarColors[i];
                const medals = ["🥇","🥈","🥉"];
                return (
                  <Card key={entry.id} className={`text-center ${i === 0 ? "ring-2 ring-yellow-400" : ""}`}>
                    <CardContent className="pt-6 space-y-2">
                      <div className="text-2xl">{medals[i]}</div>
                      <div className={`w-12 h-12 rounded-full ${color} text-white flex items-center justify-center text-sm font-bold mx-auto`}>{getInitials(entry.full_name)}</div>
                      <div className="font-semibold text-sm">{entry.full_name}</div>
                      <div className="text-xs text-muted-foreground">{entry.department}</div>
                      <div className="text-lg font-bold">{entry.xp.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">XP</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <Card>
            <CardHeader><CardTitle>All Rankings</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {leaders.map((entry, i) => <Row key={entry.id} entry={entry} rank={i + 1} />)}
              {leaders.length === 0 && <p className="text-center text-muted-foreground py-8">No rankings yet. Start learning to earn XP!</p>}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
