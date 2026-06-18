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

export function getCourseLogoUrl(title: string): string {
  const t = title.toLowerCase();
  const base = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
  if (t.includes("html5")) return `${base}/html5/html5-original.svg`;
  if (t.includes("tailwind css deep dive") || (t.includes("tailwind") && !t.includes("css3"))) return `${base}/tailwindcss/tailwindcss-original.svg`;
  if (t.includes("css3")) return `${base}/css3/css3-original.svg`;
  if (t.includes("javascript")) return `${base}/javascript/javascript-original.svg`;
  if (t.includes("typescript")) return `${base}/typescript/typescript-original.svg`;
  if (t.includes("react")) return `${base}/react/react-original.svg`;
  if (t.includes("node.js") || t.includes("nodejs")) return `${base}/nodejs/nodejs-original.svg`;
  if (t.includes("express")) return `${base}/express/express-original-wordmark.svg`;
  if (t.includes("rest api")) return `${base}/postman/postman-original.svg`;
  if (t.includes("authentication") || t.includes("security")) return `${base}/firebase/firebase-original.svg`;
  if (t.includes("database") || t.includes("sql")) return `${base}/postgresql/postgresql-original.svg`;
  if (t.includes("git")) return `${base}/git/git-original.svg`;
  if (t.includes("backend architecture")) return `${base}/docker/docker-original.svg`;
  if (t.includes("system design")) return `${base}/kubernetes/kubernetes-plain.svg`;
  return `${base}/javascript/javascript-original.svg`;
}

export function getCourseAccentColor(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("javascript")) return "#f7df1e";
  if (t.includes("typescript")) return "#3178c6";
  if (t.includes("react")) return "#61dafb";
  if (t.includes("node.js") || t.includes("nodejs")) return "#339933";
  if (t.includes("html5")) return "#e34f26";
  if (t.includes("tailwind css deep dive") || (t.includes("tailwind") && !t.includes("css3"))) return "#06b6d4";
  if (t.includes("css3")) return "#264de4";
  if (t.includes("express")) return "#888888";
  if (t.includes("rest api")) return "#ff6c37";
  if (t.includes("authentication") || t.includes("security")) return "#ffca28";
  if (t.includes("database") || t.includes("sql")) return "#336791";
  if (t.includes("git")) return "#f05032";
  if (t.includes("backend architecture")) return "#2496ed";
  if (t.includes("system design")) return "#326ce5";
  return "#6366f1";
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


