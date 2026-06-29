/**
 * Detects what type of challenge this is, so we can show the right editor+preview.
 */

export type ChallengeType = "html" | "css" | "react" | "javascript";

export interface ChallengeTypeInfo {
  type: ChallengeType;
  editorLabel: string;
  badgeColor: string;
  showPreview: boolean;   // show live rendered output panel
  showConsole: boolean;   // show console output panel
  previewLabel: string;
}

const HTML_CATEGORIES = ["HTML5", "HTML"];
const CSS_CATEGORIES  = ["CSS3", "CSS", "Tailwind"];
const REACT_CATEGORIES = ["React"];

// Also detect from starter code content
function starterReturnsHTML(code: string): boolean {
  return /return\s*`[\s\S]*<(html|header|main|section|footer|nav|form|div|h1|h2|p|input|button)/i.test(code);
}

function starterReturnsCSS(code: string): boolean {
  return /return\s*`[\s\S]*\.([\w-]+)\s*\{/i.test(code) ||
         /return\s*`[\s\S]*(display|flex|grid|margin|padding|color|background|font)/i.test(code);
}

function starterReturnsTailwindClasses(code: string): boolean {
  return /return\s*["'`][^"'`]*(?:flex|grid|text-|bg-|p-|m-|rounded|shadow|border)[^"'`]*["'`]/.test(code);
}

export function detectChallengeType(
  category: string,
  starterCode: string,
): ChallengeTypeInfo {
  const cat = category?.trim() ?? "";

  // React
  if (REACT_CATEGORIES.includes(cat)) {
    return {
      type: "react",
      editorLabel: "JavaScript",
      badgeColor: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
      showPreview: false,
      showConsole: true,
      previewLabel: "Console Output",
    };
  }

  // HTML: category is HTML5 OR starter code returns HTML markup
  if (HTML_CATEGORIES.includes(cat) || starterReturnsHTML(starterCode)) {
    return {
      type: "html",
      editorLabel: "JavaScript",
      badgeColor: "text-orange-400 border-orange-400/30 bg-orange-400/10",
      showPreview: true,
      showConsole: false,
      previewLabel: "HTML Preview",
    };
  }

  // CSS: category is CSS3/Tailwind OR starter code returns CSS
  if (
    CSS_CATEGORIES.includes(cat) ||
    starterReturnsCSS(starterCode) ||
    starterReturnsTailwindClasses(starterCode)
  ) {
    return {
      type: "css",
      editorLabel: "JavaScript",
      badgeColor: "text-blue-400 border-blue-400/30 bg-blue-400/10",
      showPreview: true,
      showConsole: false,
      previewLabel: "CSS Preview",
    };
  }

  // Default: pure JS
  return {
    type: "javascript",
    editorLabel: "JavaScript",
    badgeColor: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    showPreview: false,
    showConsole: true,
    previewLabel: "Console Output",
  };
}
