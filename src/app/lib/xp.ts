import { supabase } from "./supabase";

const ALLOWED_DOMAIN = "redihire.com";

export function validateDomain(email: string): void {
  const domain = email.split("@")[1];
  if (domain !== ALLOWED_DOMAIN) {
    throw new Error(`Only @${ALLOWED_DOMAIN} email addresses are allowed on this platform.`);
  }
}

export async function addXp(
  amount: number,
  type: "challenge" | "quiz" | "course" | "streak" | "login" | "certification",
  description: string,
  referenceId?: string
) {
  await supabase.rpc("add_xp", {
    p_amount: amount,
    p_type: type,
    p_description: description,
    p_reference_id: referenceId ?? null,
  });
}

export async function updateStreak() {
  await supabase.rpc("update_streak");
}

export async function logActivity(
  action: string,
  item: string,
  type: string,
  xpEarned = 0
) {
  await supabase.rpc("log_activity", {
    p_action: action,
    p_item: item,
    p_type: type,
    p_xp_earned: xpEarned,
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function difficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
    case "beginner":
      return "default";
    case "medium":
    case "intermediate":
      return "secondary";
    case "hard":
    case "advanced":
      return "destructive";
    default:
      return "outline";
  }
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
