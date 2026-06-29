/**
 * Scans lesson markdown content and decides:
 *  - Should we show a Try It Yourself editor?
 *  - What code to pre-load?
 *  - What language/mode to use?
 *
 * Language support matrix:
 *   html        → iframe live preview
 *   css         → iframe with sample HTML + your CSS
 *   javascript  → iframe with console interceptor
 *   jsx / tsx   → iframe with Babel standalone (React)
 *   typescript  → strip type annotations, run as JS
 *   sql         → NO EDITOR (can't run in browser)
 *   bash        → NO EDITOR
 *   http/yaml/gitignore/plain → NO EDITOR
 */

export type EditorLang = "html" | "css" | "javascript" | "react";

export interface LessonEditor {
  show: true;
  code: string;
  language: EditorLang;
  originalLang: string; // raw lang from fence
}

export interface NoEditor {
  show: false;
}

export type EditorConfig = LessonEditor | NoEditor;

// Map raw fence lang → our EditorLang
const LANG_MAP: Record<string, EditorLang> = {
  html:       "html",
  css:        "css",
  javascript: "javascript",
  js:         "javascript",
  jsx:        "react",
  tsx:        "react",
  typescript: "javascript", // strip types → run as JS
  ts:         "javascript",
};

// Section headings that mean "skip this code block"
const SKIP_KEYWORDS = [
  "common mistake", "wrong", "incorrect", "❌",
  "coding challenge", "knowledge check",
  "interview preparation", "interview question",
];

// Section headings where we prefer to pick code from
const PREFER_KEYWORDS = [
  "example", "mini project", "try it yourself",
  "multiple code", "syntax", "concept explanation",
];

function scoreSectionBefore(textBefore: string): number {
  const lower = textBefore.toLowerCase();
  if (SKIP_KEYWORDS.some(k => lower.includes(k))) return -1;
  if (PREFER_KEYWORDS.some(k => lower.includes(k))) return 2;
  return 1;
}

// Strip basic TypeScript type annotations so it runs as JS
function stripTypes(code: string): string {
  return code
    .replace(/:\s*(string|number|boolean|void|any|never|unknown|null|undefined|object)\b(\s*\|[^=,);>\n]+)?/g, "")
    .replace(/:\s*[A-Z][A-Za-z<>\[\]|&, ]+(?=[=,);{\n])/g, "")
    .replace(/<[A-Z][A-Za-z<>[\], ]*>/g, "")
    .replace(/interface\s+\w+\s*\{[^}]*\}/g, "")
    .replace(/type\s+\w+\s*=\s*[^;]+;/g, "")
    .replace(/^import type .+$/gm, "")
    .replace(/\bexport\s+(default\s+)?/g, "")
    .trim();
}

export function extractEditorConfig(content: string): EditorConfig {
  if (!content) return { show: false };

  const fenceRegex = /```(\w+)?\n([\s\S]*?)```/g;

  interface Candidate {
    code: string;
    language: EditorLang;
    originalLang: string;
    score: number;
    length: number;
  }

  const candidates: Candidate[] = [];

  let match: RegExpExecArray | null;
  while ((match = fenceRegex.exec(content)) !== null) {
    const rawLang = (match[1] ?? "").toLowerCase().trim();
    const rawCode = match[2].trim();
    const editorLang = LANG_MAP[rawLang];

    if (!editorLang || rawCode.length < 20) continue;

    const textBefore = content.slice(Math.max(0, match.index - 600), match.index);
    const score = scoreSectionBefore(textBefore);
    if (score < 0) continue;

    let finalCode = rawCode;
    // Strip TypeScript types for ts/tsx
    if (rawLang === "typescript" || rawLang === "ts") {
      finalCode = stripTypes(rawCode);
      if (finalCode.length < 15) continue; // nothing left after stripping
    }

    candidates.push({
      code: finalCode,
      language: editorLang,
      originalLang: rawLang,
      score,
      length: finalCode.length,
    });
  }

  if (candidates.length === 0) return { show: false };

  // Pick priority: prefer higher score, then prefer longer (more complete)
  // Language priority: html > react > javascript > css
  const langPriority: EditorLang[] = ["html", "react", "javascript", "css"];
  const maxScore = Math.max(...candidates.map(c => c.score));
  const topCandidates = candidates.filter(c => c.score === maxScore);

  for (const lang of langPriority) {
    const forLang = topCandidates.filter(c => c.language === lang);
    if (forLang.length > 0) {
      const best = forLang.sort((a, b) => b.length - a.length)[0];
      return {
        show: true,
        code: best.code,
        language: best.language,
        originalLang: best.originalLang,
      };
    }
  }

  return { show: false };
}
