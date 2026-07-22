import { apiRequest } from "@/core/api";
import type {
  ArticleDetailResponse,
  ArticleGraph,
  ArticleListParams,
  ArticleListResponse,
} from "@/features/experiments/types/article.types";

const defaultLimit = 20;

function setOptionalParam(
  params: URLSearchParams,
  key: string,
  value?: string | number | null,
) {
  if (value == null) {
    return;
  }

  const normalized = String(value).trim();
  if (normalized) {
    params.set(key, normalized);
  }
}

function buildArticleQuery({
  cursor,
  q,
  keywordId,
  topicId,
  authorId,
  journalId,
  publicationYear,
  publicationYearFrom,
  publicationYearTo,
  publisher,
  country,
  sort,
  limit = defaultLimit,
}: ArticleListParams = {}) {
  const params = new URLSearchParams({ limit: String(limit) });

  setOptionalParam(params, "cursor", cursor);
  setOptionalParam(params, "q", q);
  setOptionalParam(params, "keywordId", keywordId);
  setOptionalParam(params, "topicId", topicId);
  setOptionalParam(params, "authorId", authorId);
  setOptionalParam(params, "journalId", journalId);
  setOptionalParam(params, "publicationYear", publicationYear);
  setOptionalParam(params, "publicationYearFrom", publicationYearFrom);
  setOptionalParam(params, "publicationYearTo", publicationYearTo);
  setOptionalParam(params, "publisher", publisher);
  setOptionalParam(params, "country", country);
  setOptionalParam(params, "sort", sort);

  return params.toString();
}

/** GET /academic/articles */
export function listArticles(
  params: ArticleListParams = {},
): Promise<ArticleListResponse> {
  return apiRequest<ArticleListResponse>({
    method: "GET",
    path: `/academic/articles?${buildArticleQuery(params)}`,
  });
}

export function getArticleById(
  articleId: string,
): Promise<ArticleDetailResponse> {
  return apiRequest<ArticleGraph>({
    method: "GET",
    path: `/academic/articles/${encodeURIComponent(articleId)}`,
  });
}
