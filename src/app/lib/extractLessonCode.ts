/**
 * Determines whether a lesson should show a Try It Yourself editor,
 * and if so, what code to pre-load.
 *
 * Rules:
 *  - Only show editor if lesson has html / javascript / css code blocks
 *  - bash / http / plain text blocks → NO editor (can't run in browser)
 *  - Pick the most instructive example from the lesson content
 *  - Prefer code from "Example", "Mini Project", "Try It Yourself" sections
 *  - Skip code from "Common Mistakes", "Wrong", "Challenges" sections
 */

export type EditorLang = "html" | "javascript" | "css";

export interface LessonEditor {
  show: true;
  code: string;
  language: EditorLang;
}

export interface NoEditor {
  show: false;
}

export type EditorConfig = LessonEditor | NoEditor;

// Languages that can actually render in an iframe sandbox
const RUNNABLE_LANGS: Record<string, EditorLang> = {
  html: "html",
  javascript: "javascript",
  js: "javascript",
  css: "css",
};

// Section headers that mean "don't pick code from here"
const SKIP_SECTION_KEYWORDS = [
  "common mistake",
  "wrong",
  "incorrect",
  "coding challenge",
  "knowledge check",
  "interview preparation",
  "best practice",
];

// Section headers that are ideal sources for examples
const PREFER_SECTION_KEYWORDS = [
  "example",
  "mini project",
  "try it yourself",
  "exercise",
  "multiple code",
];

interface CodeCandidate {
  code: string;
  language: EditorLang;
  score: number; // higher = better
}

function sectionScore(textBefore: string): number {
  const lower = textBefore.toLowerCase();
  if (SKIP_SECTION_KEYWORDS.some((kw) => lower.includes(kw))) return -1; // skip
  if (PREFER_SECTION_KEYWORDS.some((kw) => lower.includes(kw))) return 2;
  return 1; // neutral
}

export function extractEditorConfig(content: string): EditorConfig {
  if (!content) return { show: false };

  const fenceRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const candidates: CodeCandidate[] = [];

  let match: RegExpExecArray | null;
  while ((match = fenceRegex.exec(content)) !== null) {
    const rawLang = (match[1] ?? "").toLowerCase().trim();
    const code = match[2].trim();
    const lang = RUNNABLE_LANGS[rawLang];

    // Only accept html/javascript/css — skip bash, http, plain text blocks
    if (!lang || code.length < 30) continue;

    const textBefore = content.slice(Math.max(0, match.index - 500), match.index);
    const score = sectionScore(textBefore);
    if (score < 0) continue; // from a "skip" section

    candidates.push({ code, language: lang, score });
  }

  if (candidates.length === 0) return { show: false };

  // Priority: html > javascript > css (more visual feedback)
  const langPriority: EditorLang[] = ["html", "javascript", "css"];

  // Among the best-scored candidates, pick by lang priority, then by length (longer = more complete)
  const maxScore = Math.max(...candidates.map((c) => c.score));
  const topCandidates = candidates.filter((c) => c.score === maxScore);

  for (const lang of langPriority) {
    const forLang = topCandidates.filter((c) => c.language === lang);
    if (forLang.length > 0) {
      // Pick the longest (most complete) example
      const best = forLang.sort((a, b) => b.code.length - a.code.length)[0];
      return { show: true, code: best.code, language: best.language };
    }
  }

  return { show: false };
}
