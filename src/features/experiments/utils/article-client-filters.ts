import type { ArticleGraph } from "@/features/experiments/types/article.types";
import { getArticleAuthorNames } from "@/features/experiments/utils/article-format";

export type ArticleClientFilters = {
  /** Main search box — article title only. */
  textSearch?: string;
  doiSearch?: string;
  authorSearch?: string;
  openAccess?: "" | "oa" | "subscription";
  journalId?: string;
  publisher?: string;
  country?: string;
  /** Keyword display name selected in the sidebar (must appear on matching cards). */
  keywordName?: string;
  /** Topic display name selected in the sidebar. */
  topicName?: string;
  selectedYear?: string;
  yearFrom?: string;
  yearTo?: string;
};

const SEARCH_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "or",
  "the",
  "of",
  "in",
  "on",
  "for",
  "to",
  "with",
  "by",
]);

function parseYear(value?: string) {
  if (!value?.trim()) return null;
  const year = Number(value);
  return Number.isFinite(year) ? year : null;
}

function normalizeLabel(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function articleHasNamedTag(
  tags: Array<{ displayName?: string | null }> | null | undefined,
  selectedName?: string,
) {
  const wanted = normalizeLabel(selectedName);
  if (!wanted) return true;
  return (tags ?? []).some((tag) => normalizeLabel(tag.displayName) === wanted);
}

/**
 * Split search into meaningful tokens (drop short stop words).
 * Every remaining token must appear somewhere in the haystack.
 */
export function tokenizeTextSearch(query?: string) {
  const raw = (query ?? "")
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);

  const meaningful = raw.filter(
    (token) => token.length > 1 && !SEARCH_STOP_WORDS.has(token),
  );

  // If the query was only stop words, fall back to the raw tokens.
  return meaningful.length > 0 ? meaningful : raw;
}

function buildArticleTitleHaystack(article: ArticleGraph) {
  return (article.article?.title ?? "").toLowerCase();
}

function labelsLooselyMatch(actual: string, selected: string) {
  const left = normalizeLabel(actual);
  const right = normalizeLabel(selected);
  if (!right) return true;
  if (!left) return false;
  return left === right || left.includes(right) || right.includes(left);
}

/** True when the user narrowed results beyond the default catalog year window. */
export function hasActiveArticleClientFilters(
  filters: ArticleClientFilters,
  defaults?: { yearFrom?: string; yearTo?: string },
): boolean {
  const defaultFrom = defaults?.yearFrom ?? "2023";
  const defaultTo = defaults?.yearTo ?? "2025";

  return Boolean(
    filters.textSearch?.trim() ||
      filters.doiSearch?.trim() ||
      filters.authorSearch?.trim() ||
      filters.openAccess ||
      filters.journalId ||
      filters.publisher ||
      filters.country ||
      filters.keywordName ||
      filters.topicName ||
      filters.selectedYear ||
      (filters.yearFrom && filters.yearFrom !== defaultFrom) ||
      (filters.yearTo && filters.yearTo !== defaultTo),
  );
}

/** Instant sidebar / search filters — apply on already-loaded catalog pages. */
export function matchesArticleClientFilters(
  article: ArticleGraph,
  filters: ArticleClientFilters,
): boolean {
  if (!article?.article) {
    return false;
  }

  const doi = article.article.doi ?? "";
  let authors = "";
  try {
    authors = getArticleAuthorNames(article).join(" ").toLowerCase();
  } catch {
    authors = "";
  }
  const year = article.article.publicationYear;
  const publisher = article.journal?.publisherName?.trim() ?? "";
  const country = article.journal?.country?.trim() ?? "";

  const textTokens = tokenizeTextSearch(filters.textSearch);
  if (textTokens.length > 0) {
    const haystack = buildArticleTitleHaystack(article);
    if (!textTokens.every((token) => haystack.includes(token))) {
      return false;
    }
  }

  if (
    filters.doiSearch &&
    !doi.toLowerCase().includes(filters.doiSearch.toLowerCase())
  ) {
    return false;
  }

  if (
    filters.authorSearch &&
    !authors.includes(filters.authorSearch.toLowerCase())
  ) {
    return false;
  }

  if (filters.openAccess === "oa" && article.journal?.isOpenAccess !== true) {
    return false;
  }

  if (
    filters.openAccess === "subscription" &&
    article.journal?.isOpenAccess === true
  ) {
    return false;
  }

  if (filters.journalId && article.journal?.id !== filters.journalId) {
    return false;
  }

  if (filters.publisher && !labelsLooselyMatch(publisher, filters.publisher)) {
    return false;
  }

  if (filters.country && !labelsLooselyMatch(country, filters.country)) {
    return false;
  }

  if (!articleHasNamedTag(article.keywords, filters.keywordName)) {
    return false;
  }

  if (!articleHasNamedTag(article.topics, filters.topicName)) {
    return false;
  }

  const exactYear = parseYear(filters.selectedYear);
  if (exactYear != null) {
    return year === exactYear;
  }

  const yearFrom = parseYear(filters.yearFrom);
  const yearTo = parseYear(filters.yearTo);
  if (typeof year !== "number") {
    return yearFrom == null && yearTo == null;
  }
  if (yearFrom != null && year < yearFrom) {
    return false;
  }
  if (yearTo != null && year > yearTo) {
    return false;
  }

  return true;
}
