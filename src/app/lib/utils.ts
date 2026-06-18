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
    return "https://wallpaperaccess.com/full/4868335.jpg";
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
    return "https://global-uploads.webflow.com/618fa90c201104b94458e1fb/62f24f3d37dc7327cc5337a3_REST-API-Design-Best-Practices-to-Make-Your-Life-Easier_Main-Image.jpg";
  }
  if (t.includes("authentication") || t.includes("security")) {
    return "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80";
  }
  if (t.includes("database") || t.includes("sql")) {
    return "https://static.vecteezy.com/system/resources/previews/011/040/504/large_2x/multiple-database-is-placed-on-relational-database-tables-with-a-blue-dotted-map-background-concept-of-database-server-sql-data-storage-database-diagram-design-3d-illustration-photo.jpg";
  }
  if (t.includes("git & github")) {
    return "https://miro.medium.com/v2/resize:fit:1200/1*JCGIwK9TNxAxx1UwBEbfGg.png";
  }
  if (t.includes("backend architecture")) {
    return "https://www.multiplayer.app/og-backend-architecture.png";
  }
  if (t.includes("system design")) {
    return "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80";
  }
  return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80";
}

export function getChallengesForCourse(courseId: string, allEasyChallenges: any[]) {
  if (!allEasyChallenges || allEasyChallenges.length === 0) return [];
  const sorted = [...allEasyChallenges].sort((a, b) => a.id.localeCompare(b.id));
  
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    hash = courseId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const challenges: any[] = [];
  const count = Math.min(3, sorted.length);
  for (let i = 0; i < count; i++) {
    const index = Math.abs(hash + i) % sorted.length;
    let item = sorted[index];
    let offset = 1;
    while (challenges.some(c => c.id === item.id) && challenges.length < sorted.length) {
      item = sorted[(index + offset) % sorted.length];
      offset++;
    }
    challenges.push(item);
  }
  return challenges;
}


