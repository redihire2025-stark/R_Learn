import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Search, Code, Trophy, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { supabase, Challenge } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

const difficulties = ["All", "Easy", "Medium", "Hard"];

type ChallengeWithStatus = Challenge & {
  solved: boolean;
  attempts: number;
};

export function ChallengesExplorer() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<ChallengeWithStatus[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (!user) return;
    loadChallenges();
  }, [user?.id]);

  async function loadChallenges() {
    setLoading(true);
    try {
      const [{ data: cData }, { data: subData }] = await Promise.all([
        supabase.from("challenges").select("*").eq("is_published", true).order("difficulty"),
        supabase
          .from("challenge_submissions")
          .select("challenge_id, passed")
          .eq("user_id", user!.id),
      ]);

      const solvedSet = new Set<string>();
      const attemptMap: Record<string, number> = {};
      (subData ?? []).forEach((s) => {
        if (s.passed) solvedSet.add(s.challenge_id);
        attemptMap[s.challenge_id] = (attemptMap[s.challenge_id] ?? 0) + 1;
      });

      const withStatus = (cData as Challenge[] ?? []).map((c) => ({
        ...c,
        solved: solvedSet.has(c.id),
        attempts: attemptMap[c.id] ?? 0,
      }));

      setChallenges(withStatus);
      const cats = ["All", ...Array.from(new Set(withStatus.map((c) => c.category)))];
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  }

  const filtered = challenges.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDiff = selectedDifficulty === "All" || c.difficulty === selectedDifficulty;
    const matchCat = selectedCategory === "All" || c.category === selectedCategory;
    return matchSearch && matchDiff && matchCat;
  });

  const solvedCount = challenges.filter((c) => c.solved).length;
  const totalXpEarned = challenges.filter((c) => c.solved).reduce((s, c) => s + c.xp_reward, 0);

  function diffBadgeVariant(d: string) {
    if (d === "Easy") return "default";
    if (d === "Medium") return "secondary";
    return "destructive";
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Coding Challenges</h1>
          <p className="text-muted-foreground mt-1">Practice your skills with real-world problems</p>
        </div>
        <div className="flex gap-4">
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{solvedCount}</p>
                <p className="text-xs text-muted-foreground">Solved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{totalXpEarned}</p>
                <p className="text-xs text-muted-foreground">XP Earned</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search challenges..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{difficulties.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Code className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p>No challenges match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((challenge) => (
            <Card key={challenge.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      {challenge.solved ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Code className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <h3 className="font-bold text-lg">{challenge.title}</h3>
                      <Badge variant={diffBadgeVariant(challenge.difficulty)}>{challenge.difficulty}</Badge>
                      <Badge variant="outline">{challenge.category}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{challenge.description}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        {challenge.xp_reward} XP
                      </span>
                      {challenge.attempts > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {challenge.attempts} {challenge.attempts === 1 ? "attempt" : "attempts"}
                        </span>
                      )}
                      {challenge.tags.length > 0 && (
                        <div className="flex gap-1">
                          {challenge.tags.slice(0, 3).map((t) => (
                            <span key={t} className="px-2 py-0.5 bg-muted rounded text-xs">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link to={`/challenges/${challenge.id}`}>
                    <Button variant={challenge.solved ? "outline" : "default"}>
                      {challenge.solved ? "Solve Again" : challenge.attempts > 0 ? "Continue" : "Solve"}
                    </Button>
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
