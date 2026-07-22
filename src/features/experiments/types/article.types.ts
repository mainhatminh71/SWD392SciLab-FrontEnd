import type { CursorPage } from "@/features/experiments/types/academic-pagination.types";
import type { JournalNode } from "@/features/experiments/types/journal.types";

export type { CursorPage } from "@/features/experiments/types/academic-pagination.types";

export type AcademicNodeType =
  | "ARTICLE"
  | "AUTHOR"
  | "JOURNAL"
  | "KEYWORD"
  | "TOPIC";

/** Core article fields from GET /academic/articles and article graph payloads. */
export type ArticleNode = {
  id: string;
  title: string;
  abstract: string | null;
  doi: string | null;
  publicationYear: number | null;
  version: string | null;
  volumeNumber: number | string | null;
  issueNumber: string | null;
  /** OpenAlex cited_by_count (inbound citations). */
  citationCount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type AuthorNode = {
  id: string;
  orcid: string | null;
  displayName: string | null;
  imageUrl: string | null;
  authorPosition: number | null;
};

export type KeywordNode = {
  id: string;
  displayName: string | null;
  score: number | null;
};

export type TopicNode = {
  id: string;
  displayName: string | null;
  score: number | null;
  isPrimary: boolean | null;
};

/** One article item returned by list/detail academic endpoints. */
export type ArticleGraph = {
  article: ArticleNode;
  journal: JournalNode | null;
  authors: AuthorNode[];
  keywords: KeywordNode[];
  topics: TopicNode[];
  citedArticleIds: string[];
};

export type ArticleListParams = {
  cursor?: string | null;
  /** Free-text search (`q` on GET /academic/articles). */
  q?: string | null;
  keywordId?: string | null;
  topicId?: string | null;
  authorId?: string | null;
  /** Exact journal id (`journalId` on GET /academic/articles). */
  journalId?: string | null;
  publicationYear?: number | string | null;
  publicationYearFrom?: number | string | null;
  publicationYearTo?: number | string | null;
  publisher?: string | null;
  /** ISO 3166-1 alpha-2 country code. */
  country?: string | null;
  sort?: ArticleSort | null;
  limit?: number;
};

export type ArticleSort = "relevant" | "newest" | "most_cited";

/** Filters sent to GET /academic/articles (excluding cursor/limit/q). */
export type ArticleApiFilters = {
  journalId?: string;
  publicationYear?: string;
  publicationYearFrom?: string;
  publicationYearTo?: string;
  publisher?: string;
  country?: string;
  sort?: ArticleSort;
};

export type ArticleListResponse = CursorPage<ArticleGraph>;
export type ArticleDetailResponse = ArticleGraph;

export const yearOptions = Array.from({ length: 16 }, (_, index) =>
  String(2026 - index),
);

export const articleSortOptions: { value: ArticleSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "most_cited", label: "Most cited" },
  { value: "relevant", label: "Most relevant" },
];

export const countryFilterOptions: { value: string; label: string }[] = [
  { value: "US", label: "United States (US)" },
  { value: "GB", label: "United Kingdom (GB)" },
  { value: "NL", label: "Netherlands (NL)" },
  { value: "DE", label: "Germany (DE)" },
  { value: "CN", label: "China (CN)" },
  { value: "JP", label: "Japan (JP)" },
  { value: "FR", label: "France (FR)" },
  { value: "CA", label: "Canada (CA)" },
  { value: "AU", label: "Australia (AU)" },
  { value: "KR", label: "South Korea (KR)" },
  { value: "IT", label: "Italy (IT)" },
  { value: "ES", label: "Spain (ES)" },
  { value: "CH", label: "Switzerland (CH)" },
  { value: "SE", label: "Sweden (SE)" },
  { value: "IN", label: "India (IN)" },
  { value: "SG", label: "Singapore (SG)" },
  { value: "BR", label: "Brazil (BR)" },
];

export interface ArticleSearchProps {
  onNavigate?: (view: string) => void;
  onViewArticle?: (articleId: string) => void;
}
