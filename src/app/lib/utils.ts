import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime());
  let streak = 1;

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = Math.floor((sortedDates[i].getTime() - sortedDates[i + 1].getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) streak++;
    else break;
  }

  return streak;
}

export function generateMockXP(min: number = 0, max: number = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getCourseCoverImage(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("html5")) {
    return "https://images.unsplash.com/photo-1621839673705-6617adf9e890?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("css3 & tailwind") || t.includes("css3")) {
    return "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("javascript")) {
    return "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("typescript")) {
    return "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("react js")) {
    return "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("tailwind css deep dive")) {
    return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("node.js")) {
    return "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("express.js")) {
    return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("rest api")) {
    return "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("authentication") || t.includes("security")) {
    return "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("database") || t.includes("sql")) {
    return "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("git & github")) {
    return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("backend architecture")) {
    return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("system design")) {
    return "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80";
  }
  return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80";
}

