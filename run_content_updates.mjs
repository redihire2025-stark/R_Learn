/**
 * R-Learn Rich Content Updater
 * Reads all supabase_rich_content_*.sql files and applies them via Supabase REST API
 */

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://rdnhbreuusnfvwmrecor.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbmhicmV1dXNuZnZ3bXJlY29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTg1ODIsImV4cCI6MjA5NTM3NDU4Mn0.eVSHIHpyNUhfYOlBdoDRGTXefkRPm_YCUsmRjz4sl_o";

// ── SQL E-string parser ──────────────────────────────────────────────────────
// Extracts { id, content } from UPDATE public.lessons SET content = E'...' WHERE id = '...'
function parseUpdates(sql) {
  const updates = [];
  let i = 0;

  while (i < sql.length) {
    // Find "UPDATE public.lessons SET content = E'"
    const markerStart = "UPDATE public.lessons SET content = E'";
    const pos = sql.indexOf(markerStart, i);
    if (pos === -1) break;

    // Move past the marker, now at start of E-string content
    i = pos + markerStart.length;

    // Read the E-string content until an unescaped closing quote
    let content = "";
    while (i < sql.length) {
      if (sql[i] === "'" && sql[i + 1] === "'") {
        content += "'"; // SQL escaped quote '' → '
        i += 2;
      } else if (sql[i] === "'") {
        i++; // closing quote
        break;
      } else if (sql[i] === "\\" && i + 1 < sql.length) {
        const next = sql[i + 1];
        if (next === "n")       { content += "\n"; i += 2; }
        else if (next === "t")  { content += "\t"; i += 2; }
        else if (next === "r")  { content += "\r"; i += 2; }
        else if (next === "\\") { content += "\\"; i += 2; }
        else                    { content += sql[i]; i++; }
      } else {
        content += sql[i];
        i++;
      }
    }

    // Skip any `,  N, N)` suffix (some older files have duration/order after content)
    // Then find WHERE id = '...'
    const whereIdx = sql.indexOf("WHERE id = '", i);
    if (whereIdx === -1) continue;
    const idStart = whereIdx + "WHERE id = '".length;
    const idEnd = sql.indexOf("'", idStart);
    if (idEnd === -1) continue;
    const id = sql.slice(idStart, idEnd);

    updates.push({ id, content });
    i = idEnd + 1;
  }

  return updates;
}

// ── REST API update ──────────────────────────────────────────────────────────
async function updateLesson(id, content) {
  const url = `${SUPABASE_URL}/rest/v1/lessons?id=eq.${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} for ${id}: ${text}`);
  }
  return res.status;
}

// ── Main ─────────────────────────────────────────────────────────────────────
const FILES = [
  "supabase_rich_content_track1.sql",
  "supabase_rich_content_js.sql",
  "supabase_rich_content_css_react.sql",
  "supabase_rich_content_track1_remaining.sql",
  "supabase_rich_content_track2.sql",
  "supabase_rich_content_track3_remaining.sql",
  "supabase_rich_content_track4.sql",
  "supabase_rich_content_track5_remaining.sql",
  "supabase_rich_content_tracks6to9.sql",
  "supabase_rich_content_tracks10to14.sql",
];

let totalUpdated = 0;
let totalFailed  = 0;

for (const file of FILES) {
  const filePath = join(__dir, file);
  let sql;
  try {
    sql = readFileSync(filePath, "utf8");
  } catch {
    console.log(`⚠  Skipping (not found): ${file}`);
    continue;
  }

  const updates = parseUpdates(sql);
  if (updates.length === 0) {
    console.log(`⚠  No UPDATE statements found in: ${file}`);
    continue;
  }

  console.log(`\n📄 ${file}  (${updates.length} lessons)`);

  for (const { id, content } of updates) {
    process.stdout.write(`   ${id} ... `);
    try {
      const status = await updateLesson(id, content);
      console.log(`✅ (${status})`);
      totalUpdated++;
    } catch (err) {
      console.log(`❌  ${err.message}`);
      totalFailed++;
    }
    // Small delay to avoid rate-limiting
    await new Promise(r => setTimeout(r, 80));
  }
}

console.log(`\n${"─".repeat(50)}`);
console.log(`✅  Updated : ${totalUpdated} lessons`);
console.log(`❌  Failed  : ${totalFailed} lessons`);
console.log(`Total       : ${totalUpdated + totalFailed} lessons processed`);
