import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Code2, CheckCircle2, Trophy, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../../components/ui/skeleton";

interface Challenge {
  id: string; title: string; description: string;
  difficulty: string; category: string; points: number;
  solved?: boolean; submissions?: number;
}

const diffConfig: Record<string, { badge: string; bar: string; dot: string }> = {
  Easy:   { badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30", bar: "bg-emerald-500", dot: "bg-emerald-500" },
  Medium: { badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",           bar: "bg-amber-500",   dot: "bg-amber-500"   },
  Hard:   { badge: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30",                  bar: "bg-rose-500",    dot: "bg-rose-500"    },
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

  const solvedList = filtered.filter((c) => c.solved);
  const unsolvedList = filtered.filter((c) => !c.solved);
  const totalPoints = challenges.filter((c) => c.solved).reduce((s, c) => s + c.points, 0);

  const easyCount   = challenges.filter((c) => c.difficulty === "Easy").length;
  const mediumCount = challenges.filter((c) => c.difficulty === "Medium").length;
  const hardCount   = challenges.filter((c) => c.difficulty === "Hard").length;

  const ChallengeRow = ({ ch }: { ch: Challenge }) => {
    const diff = diffConfig[ch.difficulty] ?? diffConfig.Easy;
    return (
      <div className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-px ${ch.solved ? "bg-card border-border opacity-80" : "bg-card border-border hover:border-border"}`}>
        {/* Difficulty color strip */}
        <div className={`w-1 h-12 rounded-full flex-shrink-0 ${diff.bar}`} />

        {/* Status icon */}
        <div className="flex-shrink-0 w-8 flex justify-center">
          {ch.solved
            ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            : <Code2 className="w-5 h-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold text-sm ${ch.solved ? "text-muted-foreground" : "text-foreground"}`}>
              {ch.title}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold tracking-wider uppercase ${diff.badge}`}>
              {ch.difficulty}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground font-medium">
              {ch.category}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 leading-relaxed">{ch.description}</p>
        </div>

        {/* Stats + CTA */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Trophy className="w-3 h-3 text-yellow-500" />
              {ch.points} pts
            </div>
            {(ch.submissions ?? 0) > 0 && (
              <div className="text-[10px] text-muted-foreground/60">{ch.submissions} attempt{ch.submissions !== 1 ? "s" : ""}</div>
            )}
          </div>
          <Link to={`/challenges/${ch.id}`}>
            <Button
              size="sm"
              variant={ch.solved ? "outline" : "default"}
              className="h-8 px-4 text-xs font-semibold"
            >
              {ch.solved ? "Review" : "Solve"}
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Coding Challenges</h1>
          <p className="text-muted-foreground mt-1.5">Sharpen your skills across algorithms, data structures & more</p>
        </div>

        {/* Stats cards */}
        <div className="flex gap-3">
          <div className="bg-card border border-border rounded-xl px-4 py-3 text-center min-w-[72px]">
            <div className="text-xl font-bold text-emerald-500">{solvedList.length}</div>
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Solved</div>
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-3 text-center min-w-[72px]">
            <div className="text-xl font-bold text-foreground">{challenges.length}</div>
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Total</div>
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-3 text-center min-w-[72px]">
            <div className="text-xl font-bold text-yellow-500">{totalPoints}</div>
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">XP Earned</div>
          </div>
        </div>
      </div>

      {/* Difficulty breakdown bar */}
      {challenges.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Difficulty Breakdown</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Easy {easyCount}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Medium {mediumCount}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />Hard {hardCount}</span>
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden flex gap-0.5">
            <div className="bg-emerald-500 h-full rounded-l-full transition-all" style={{ width: `${(easyCount / challenges.length) * 100}%` }} />
            <div className="bg-amber-500 h-full transition-all" style={{ width: `${(mediumCount / challenges.length) * 100}%` }} />
            <div className="bg-rose-500 h-full rounded-r-full transition-all" style={{ width: `${(hardCount / challenges.length) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search challenges..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-40">
            <SelectValue>{difficulty === "All" ? "All Difficulties" : difficulty}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {["All", "Easy", "Medium", "Hard"].map((d) => (
              <SelectItem key={d} value={d}>{d === "All" ? "All Difficulties" : d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44">
            <SelectValue>{category === "All" ? "All Categories" : category}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c === "All" ? "All Categories" : c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Challenge list */}
      {loading ? (
        <div className="space-y-3">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No challenges match your filters</p>
        </div>
      ) : (
        <div className="space-y-6">
          {unsolvedList.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" /> To Solve · {unsolvedList.length}
              </h2>
              <div className="space-y-2">
                {unsolvedList.map((ch) => <ChallengeRow key={ch.id} ch={ch} />)}
              </div>
            </section>
          )}
          {solvedList.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Completed · {solvedList.length}
              </h2>
              <div className="space-y-2">
                {solvedList.map((ch) => <ChallengeRow key={ch.id} ch={ch} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
