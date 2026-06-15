import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Search, Code, CheckCircle, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../../components/ui/skeleton";

interface Challenge { id: string; title: string; description: string; difficulty: string; category: string; points: number; solved?: boolean; submissions?: number; }

const diffBadge: Record<string, string> = {
  Easy: "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Hard: "bg-red-100 text-red-700 border-red-200",
};

export function ChallengesExplorer() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [category, setCategory] = useState("All");

  useEffect(() => { fetchChallenges(); }, []);

  async function fetchChallenges() {
    setLoading(true);
    const { data } = await supabase.from("challenges").select("*").eq("is_published", true).order("created_at");
    if (!data) { setLoading(false); return; }

    const solvedSet = new Set<string>();
    const submissionsMap: Record<string, number> = {};
    if (user) {
      const { data: subs } = await supabase.from("challenge_submissions").select("challenge_id, passed").eq("user_id", user.id);
      subs?.forEach((s) => {
        submissionsMap[s.challenge_id] = (submissionsMap[s.challenge_id] ?? 0) + 1;
        if (s.passed) solvedSet.add(s.challenge_id);
      });
    }

    setChallenges(data.map((c) => ({ ...c, solved: solvedSet.has(c.id), submissions: submissionsMap[c.id] ?? 0 })));
    setLoading(false);
  }

  const categories = ["All", ...Array.from(new Set(challenges.map((c) => c.category)))];
  const filtered = challenges.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) &&
      (difficulty === "All" || c.difficulty === difficulty) &&
      (category === "All" || c.category === category)
    );
  });

  const solved = filtered.filter((c) => c.solved);
  const unsolved = filtered.filter((c) => !c.solved);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coding Challenges</h1>
          <p className="text-muted-foreground mt-1">15 challenges across arrays, strings, algorithms, JS, Node, Auth, and more</p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-card border border-border rounded-lg px-4 py-2">
            <div className="text-lg font-bold text-green-600">{solved.length}</div>
            <div className="text-xs text-muted-foreground">Solved</div>
          </div>
          <div className="bg-card border border-border rounded-lg px-4 py-2">
            <div className="text-lg font-bold">{challenges.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search challenges..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{["All","Easy","Medium","Hard"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-2">
          {[...unsolved, ...solved].map((ch) => (
            <Card key={ch.id} className={`hover:shadow-md transition-shadow ${ch.solved ? "opacity-75" : ""}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-shrink-0">
                  {ch.solved ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Code className="w-6 h-6 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{ch.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${diffBadge[ch.difficulty]}`}>{ch.difficulty}</span>
                    <span className="text-xs px-2 py-0.5 rounded border border-border bg-muted">{ch.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{ch.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><Trophy className="w-3 h-3 text-yellow-500" />{ch.points} pts</div>
                    {ch.submissions! > 0 && <div className="text-xs text-muted-foreground">{ch.submissions} attempts</div>}
                  </div>
                  <Link to={`/challenges/${ch.id}`}>
                    <Button size="sm" variant={ch.solved ? "outline" : "default"}>{ch.solved ? "Review" : "Solve"}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
