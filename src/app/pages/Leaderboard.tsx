import { useState, useEffect } from "react";
import { Trophy, Flame, Crown, TrendingUp, Users, Zap, ChevronUp } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { Skeleton } from "../components/ui/skeleton";

interface LeaderEntry {
  id: string; full_name: string; department: string; xp: number; streak: number; email: string;
}

function getInitials(n: string) {
  return n.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();
}

const PALETTE = [
  "#6366f1","#8b5cf6","#06b6d4","#10b981",
  "#f59e0b","#f43f5e","#ec4899","#3b82f6","#14b8a6","#a855f7",
];

function Avatar({
  name, index, size = 48, glow,
}: { name: string; index: number; size?: number; glow?: string }) {
  const color = PALETTE[index % PALETTE.length];
  const fontSize = size < 36 ? 10 : size < 52 ? 13 : size < 70 ? 16 : 22;
  return (
    <div
      className="rounded-full flex items-center justify-center font-black text-white flex-shrink-0 select-none"
      style={{
        width: size, height: size, fontSize,
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        boxShadow: glow ? `0 0 0 3px ${glow}50, 0 0 20px ${glow}40, 0 0 40px ${glow}20` : `0 0 0 2px ${color}30`,
      }}
    >
      {getInitials(name)}
    </div>
  );
}

export function Leaderboard() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLeaderboard(); }, []);

  async function fetchLeaderboard() {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, department, xp, streak, email")
      .eq("is_approved", true)
      .order("xp", { ascending: false })
      .limit(50);
    setLeaders(data ?? []);
    setLoading(false);
  }

  const myRank  = leaders.findIndex((l) => l.id === user?.id) + 1;
  const topXP   = leaders[0]?.xp ?? 1;
  const myEntry = myRank > 0 ? leaders[myRank - 1] : null;

  // Podium order: silver (2nd) — gold (1st) — bronze (3rd)
  const podiumSlots = [
    { entry: leaders[1], rank: 2, platformH: 72,  platformColor: ["#94a3b8","#64748b"],  glowColor: "#94a3b8", labelColor: "#94a3b8", medalColor: "#cbd5e1", avatarSize: 64  },
    { entry: leaders[0], rank: 1, platformH: 120, platformColor: ["#fbbf24","#f59e0b"],  glowColor: "#fbbf24", labelColor: "#f59e0b", medalColor: "#fde68a", avatarSize: 84  },
    { entry: leaders[2], rank: 3, platformH: 48,  platformColor: ["#fb923c","#ea580c"],  glowColor: "#fb923c", labelColor: "#fb923c", medalColor: "#fed7aa", avatarSize: 56  },
  ];

  const medals = ["🥇","🥈","🥉"];

  return (
    <div className="min-h-full bg-background">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow-500/5 dark:from-primary/10 dark:to-yellow-500/10" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative max-w-4xl mx-auto px-8 py-10 flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">Leaderboard</h1>
            </div>
            <p className="text-muted-foreground text-sm ml-[52px]">Company-wide XP rankings — updated in real time</p>
          </div>
          {/* Stat chips */}
          <div className="flex gap-3">
            {[
              { icon: <Users className="w-3.5 h-3.5" />, val: leaders.length, label: "Players" },
              { icon: <Zap className="w-3.5 h-3.5 text-yellow-500" />, val: topXP > 0 ? `${(topXP / 1000).toFixed(1)}k` : "—", label: "Top XP" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl px-4 py-3 text-center min-w-[72px]">
                <div className="text-lg font-black text-foreground">{s.val}</div>
                <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                  {s.icon}{s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">

        {/* ── Your rank card ── */}
        {user && myRank > 0 && myEntry && (() => {
          const pct      = Math.round((myEntry.xp / topXP) * 100);
          const nextEntry = myRank > 1 ? leaders[myRank - 2] : null;
          const gap       = nextEntry ? nextEntry.xp - myEntry.xp : 0;
          return (
            <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-card">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
              <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-primary/60 to-primary/20 rounded-l-2xl" />
              <div className="relative flex items-center gap-5 p-5 flex-wrap">
                <div className="relative flex-shrink-0">
                  <Avatar name={user.full_name ?? user.email} index={myRank - 1} size={60} />
                  <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-background shadow-md">
                    {myRank}
                  </div>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-base text-foreground">Your Position</span>
                    <span className="text-xs bg-primary/10 text-primary border border-primary/25 px-2.5 py-0.5 rounded-full font-bold">
                      #{myRank} of {leaders.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-semibold text-foreground">
                      <Zap className="w-3.5 h-3.5 text-primary" />{myEntry.xp.toLocaleString()} XP
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />{myEntry.streak} day streak
                    </span>
                    {nextEntry && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <ChevronUp className="w-3.5 h-3.5" />+{gap.toLocaleString()} XP to #{myRank - 1}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-muted-foreground tabular-nums">{pct}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {loading ? (
          <div className="space-y-3">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : (
          <>
            {/* ── Podium ── */}
            {leaders.length >= 1 && (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
                {/* Stage background */}
                <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-muted/5" />
                <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

                <div className="relative px-6 pt-6 pb-0">
                  {/* Section label */}
                  <div className="flex items-center gap-2 mb-6">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Top Performers</span>
                  </div>

                  {/* Podium stage */}
                  <div className="flex items-end justify-center gap-3">
                    {podiumSlots.map((slot, i) => {
                      if (!slot.entry) return <div key={i} className="w-36" />;
                      const entryIdx = leaders.findIndex((l) => l.id === slot.entry!.id);
                      return (
                        <div key={slot.rank} className="flex flex-col items-center" style={{ width: slot.rank === 1 ? 160 : 140 }}>
                          {/* Crown for #1 */}
                          {slot.rank === 1 && (
                            <div className="mb-1 animate-bounce" style={{ animationDuration: "3s" }}>
                              <Crown className="w-6 h-6 text-yellow-400" style={{ filter: "drop-shadow(0 0 8px #fbbf2480)" }} />
                            </div>
                          )}

                          {/* Medal emoji */}
                          <div className="text-2xl mb-2" style={{ filter: `drop-shadow(0 2px 6px ${slot.glowColor}60)` }}>
                            {medals[slot.rank - 1]}
                          </div>

                          {/* Avatar */}
                          <Avatar name={slot.entry.full_name} index={entryIdx} size={slot.avatarSize} glow={slot.glowColor} />

                          {/* Name + XP */}
                          <div className="mt-3 text-center space-y-0.5 px-1">
                            <div className="text-sm font-black text-foreground line-clamp-1">{slot.entry.full_name.split(" ")[0]}</div>
                            <div className="text-[10px] text-muted-foreground line-clamp-1">{slot.entry.department}</div>
                            <div className="text-base font-black tabular-nums mt-1" style={{ color: slot.labelColor }}>
                              {slot.entry.xp.toLocaleString()}
                            </div>
                            <div className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">XP</div>
                            <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mt-1">
                              <Flame className="w-2.5 h-2.5 text-orange-500" />{slot.entry.streak}d
                            </div>
                          </div>

                          {/* Platform block */}
                          <div
                            className="w-full mt-4 rounded-t-xl flex items-start justify-center pt-3 relative overflow-hidden"
                            style={{
                              height: slot.platformH,
                              background: `linear-gradient(180deg, ${slot.platformColor[0]}cc, ${slot.platformColor[1]})`,
                            }}
                          >
                            {/* Shine overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                            <span className="relative text-white/80 text-2xl font-black tracking-tighter">
                              {slot.rank}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Full rankings ── */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Table header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/40">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-foreground">All Rankings</span>
                <span className="ml-auto text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">{leaders.length} players</span>
              </div>

              {leaders.length === 0 ? (
                <p className="text-center text-muted-foreground py-16 text-sm">No rankings yet. Start learning to earn XP!</p>
              ) : (
                <div className="divide-y divide-border">
                  {leaders.map((entry, i) => {
                    const rank   = i + 1;
                    const isMe   = entry.id === user?.id;
                    const isTop3 = rank <= 3;
                    const xpPct  = Math.round((entry.xp / topXP) * 100);
                    const rankBgColors   = ["from-yellow-500/10","from-slate-400/10","from-orange-400/10"];
                    const rankTextColors = ["text-yellow-500","text-slate-400","text-orange-400"];
                    const rankBarColors  = ["#f59e0b","#94a3b8","#fb923c"];

                    return (
                      <div
                        key={entry.id}
                        className={`relative flex items-center gap-3 px-5 py-3.5 transition-all duration-150 ${
                          isMe
                            ? "bg-primary/5 border-l-2 border-l-primary"
                            : isTop3
                            ? `bg-gradient-to-r ${rankBgColors[rank - 1]} to-transparent`
                            : "hover:bg-muted/40"
                        }`}
                      >
                        {/* Rank badge */}
                        <div className="w-9 flex-shrink-0 flex justify-center">
                          {isTop3 ? (
                            <span className="text-xl leading-none">{medals[rank - 1]}</span>
                          ) : (
                            <span className={`text-sm font-black tabular-nums ${isMe ? "text-primary" : "text-muted-foreground/60"}`}>
                              {rank}
                            </span>
                          )}
                        </div>

                        {/* Avatar */}
                        <Avatar name={entry.full_name} index={i} size={36} glow={isTop3 ? rankBarColors[rank - 1] : undefined} />

                        {/* Name + dept */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-foreground flex items-center gap-1.5 truncate">
                            {entry.full_name}
                            {isMe && (
                              <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">you</span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">{entry.department}</div>
                        </div>

                        {/* XP progress bar */}
                        <div className="hidden md:flex items-center gap-2 w-28 flex-shrink-0">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${xpPct}%`,
                                background: isTop3 ? rankBarColors[rank - 1] : "hsl(var(--primary))",
                                opacity: isMe ? 1 : 0.7,
                              }}
                            />
                          </div>
                        </div>

                        {/* Streak */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground w-12 flex-shrink-0 justify-end">
                          <Flame className="w-3 h-3 text-orange-500 flex-shrink-0" />
                          <span className="tabular-nums">{entry.streak}d</span>
                        </div>

                        {/* XP */}
                        <div
                          className="text-sm font-black tabular-nums flex-shrink-0 w-24 text-right"
                          style={{ color: isTop3 ? rankBarColors[rank - 1] : undefined }}
                        >
                          <span className={!isTop3 ? "text-foreground" : ""}>{entry.xp.toLocaleString()}</span>
                          <span className="text-[10px] font-normal text-muted-foreground ml-0.5">XP</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
