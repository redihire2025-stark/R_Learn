/**
 * Extracts the best runnable code example from lesson markdown content.
 * Priority: html > javascript/js > css > typescript > any fenced block
 */

type SupportedLang = "html" | "javascript" | "css";

// Languages we can actually run in the iframe sandbox
const RUNNABLE: Record<string, SupportedLang> = {
  html: "html",
  javascript: "javascript",
  js: "javascript",
  css: "css",
  typescript: "javascript", // strip types mentally — still useful to show
  ts: "javascript",
};

// Sections we want to skip (they have code but it's not runnable examples)
const SKIP_HEADERS = [
  "common mistakes",
  "mistake",
  "wrong",
  "interview",
  "knowledge check",
  "best practices",
  "coding challenges",
  "challenge",
];

interface ExtractedCode {
  code: string;
  language: SupportedLang;
}

function shouldSkipSection(textBefore: string): boolean {
  const lower = textBefore.toLowerCase();
  return SKIP_HEADERS.some((h) => lower.includes(h));
}

export function extractLessonCode(content: string): ExtractedCode | null {
  if (!content) return null;

  // Match all fenced code blocks: ```lang\ncode\n```
  const fenceRegex = /```(\w+)?\n([\s\S]*?)```/g;

  // Priority order for languages
  const priority: SupportedLang[] = ["html", "javascript", "css"];
  const candidates: Record<SupportedLang, string[]> = { html: [], javascript: [], css: [] };

  let match: RegExpExecArray | null;
  while ((match = fenceRegex.exec(content)) !== null) {
    const rawLang = (match[1] ?? "").toLowerCase().trim();
    const code = match[2].trim();
    const lang = RUNNABLE[rawLang];

    if (!lang || !code || code.length < 20) continue;

    // Get the text before this code block to check what section it's in
    const textBefore = content.slice(Math.max(0, match.index - 300), match.index);
    if (shouldSkipSection(textBefore)) continue;

    candidates[lang].push(code);
  }

  // Pick the best candidate in priority order
  for (const lang of priority) {
    if (candidates[lang].length > 0) {
      // Prefer longer, more complete examples (the mini project / main example)
      const sorted = candidates[lang].sort((a, b) => b.length - a.length);
      return { code: sorted[0], language: lang };
    }
  }

  return null;
}

// Fallback defaults per language when no code is found in content
export const FALLBACKS: Record<SupportedLang, string> = {
  html: `<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>

  <h1>My First Heading</h1>
  <p>My first paragraph.</p>

</body>
</html>`,
  javascript: `// Edit and run your JavaScript here
console.log("Hello, World!");

document.body.innerHTML = \`
  <h1 style="font-family:sans-serif;color:#2d6a4f">Hello from JavaScript!</h1>
  <p style="font-family:sans-serif">Edit this code and click Run!</p>
\`;`,
  css: `/* Edit your CSS here */
body {
  font-family: Arial, sans-serif;
  background: #f0f4f8;
  padding: 2rem;
}

h1 {
  color: #2d6a4f;
  font-size: 2rem;
}

p {
  color: #555;
  line-height: 1.6;
}`,
};
