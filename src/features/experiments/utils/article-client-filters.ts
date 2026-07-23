import type { ArticleGraph } from "@/features/experiments/types/article.types";
import { getArticleAuthorNames } from "@/features/experiments/utils/article-format";

export type ArticleClientFilters = {
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

function parseYear(value?: string) {
  if (!value?.trim()) return null;
  const year = Number(value);
  return Number.isFinite(year) ? year : null;
}

function normalizeLabel(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function articleHasNamedTag(
  tags: Array<{ displayName?: string | null }>,
  selectedName?: string,
) {
  const wanted = normalizeLabel(selectedName);
  if (!wanted) return true;
  return tags.some((tag) => normalizeLabel(tag.displayName) === wanted);
}

/** Instant sidebar filters — avoid re-hitting the slow academic list API. */
export function matchesArticleClientFilters(
  article: ArticleGraph,
  filters: ArticleClientFilters,
): boolean {
  const doi = article.article.doi ?? "";
  const authors = getArticleAuthorNames(article).join(" ").toLowerCase();
  const year = article.article.publicationYear;
  const publisher = article.journal?.publisherName?.trim() ?? "";
  const country = article.journal?.country?.trim() ?? "";

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

  if (
    filters.publisher &&
    publisher.toLowerCase() !== filters.publisher.toLowerCase()
  ) {
    return false;
  }

  if (
    filters.country &&
    country.toLowerCase() !== filters.country.toLowerCase()
  ) {
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
