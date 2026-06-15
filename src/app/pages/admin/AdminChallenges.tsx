import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { supabase } from "../../lib/supabase";
import { Search, Code, CheckCircle, Users, Zap } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  xp_reward: number;
  created_at: string;
  submissionCount?: number;
  passCount?: number;
}

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Hard: "bg-red-100 text-red-700 border-red-200",
};

export function AdminChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchChallenges(); }, []);

  async function fetchChallenges() {
    setLoading(true);
    const { data } = await supabase.from("challenges").select("*").order("created_at");
    if (!data) { setLoading(false); return; }

    const enriched = await Promise.all(
      data.map(async (ch) => {
        const { count: submissionCount } = await supabase
          .from("challenge_submissions")
          .select("id", { count: "exact", head: true })
          .eq("challenge_id", ch.id);
        const { count: passCount } = await supabase
          .from("challenge_submissions")
          .select("id", { count: "exact", head: true })
          .eq("challenge_id", ch.id)
          .eq("passed", true);
        return { ...ch, submissionCount: submissionCount ?? 0, passCount: passCount ?? 0 };
      })
    );

    setChallenges(enriched);
    setLoading(false);
  }

  const filtered = challenges.filter((c) => {
    const q = search.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.difficulty.toLowerCase().includes(q);
  });

  const totalSubmissions = challenges.reduce((a, c) => a + (c.submissionCount ?? 0), 0);
  const totalPassed = challenges.reduce((a, c) => a + (c.passCount ?? 0), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Challenge Management</h1>
        <p className="text-muted-foreground mt-1">View all coding challenges and submission stats</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-purple-100 rounded-lg"><Code className="w-5 h-5 text-purple-600" /></div>
          <div><p className="text-2xl font-bold">{challenges.length}</p><p className="text-xs text-muted-foreground">Total Challenges</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-blue-100 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-2xl font-bold">{totalSubmissions}</p><p className="text-xs text-muted-foreground">Total Submissions</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
          <div>
            <p className="text-2xl font-bold">{totalSubmissions > 0 ? Math.round((totalPassed / totalSubmissions) * 100) : 0}%</p>
            <p className="text-xs text-muted-foreground">Pass Rate</p>
          </div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Code className="w-5 h-5" /> All Challenges</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search challenges..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Code className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No challenges found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((ch) => {
                const passRate = ch.submissionCount! > 0 ? Math.round((ch.passCount! / ch.submissionCount!) * 100) : 0;
                return (
                  <div key={ch.id} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Code className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">{ch.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded border font-medium ${difficultyColors[ch.difficulty] ?? ""}`}>{ch.difficulty}</span>
                        <Badge variant="outline" className="text-xs">{ch.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ch.submissionCount} submissions</span>
                        <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />{passRate}% pass rate</span>
                        <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" />{ch.xp_reward} XP</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-green-600">{ch.passCount}</p>
                      <p className="text-xs text-muted-foreground">passed</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
