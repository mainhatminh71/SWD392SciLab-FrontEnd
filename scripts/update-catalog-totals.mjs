/**
 * Refresh src/features/dashboard/data/catalog-totals.json by paginating the
 * public academic journals API and summing per-journal article counts.
 *
 * Usage: node scripts/update-catalog-totals.mjs
 * Takes a few minutes (~300 sequential pages of 100 journals).
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API_ORIGIN =
  process.env.SCILAB_API_ORIGIN?.trim() || "https://scilab-api.epsilon.io.vn";
const PAGE_LIMIT = 100;
const MAX_PAGES = 1000;

async function fetchPage(cursor) {
  const url = new URL("academic/journals", `${API_ORIGIN}/`);
  url.searchParams.set("limit", String(PAGE_LIMIT));
  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Journals page failed: HTTP ${response.status}`);
  }
  const payload = await response.json();
  if (!payload?.success) {
    throw new Error(`Journals page failed: ${payload?.message}`);
  }
  return payload.data;
}

let journals = 0;
let articles = 0;
let cursor = null;

for (let page = 0; page < MAX_PAGES; page += 1) {
  const data = await fetchPage(cursor);
  journals += data.items.length;
  for (const journal of data.items) {
    articles += journal.articleCount ?? 0;
  }
  cursor = data.nextCursor;
  if (page % 20 === 0) {
    console.log(`page ${page}: journals=${journals} articles=${articles}`);
  }
  if (!cursor) {
    break;
  }
}

const totals = {
  journals,
  articles,
  generatedAt: new Date().toISOString().slice(0, 10),
};

const outPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/features/dashboard/data/catalog-totals.json",
);
await writeFile(outPath, `${JSON.stringify(totals, null, 2)}\n`);
console.log("Wrote", outPath, totals);
