import { apiRequest } from "@/core/api";
import type {
  ArticleDetailResponse,
  ArticleGraph,
  ArticleListParams,
  ArticleListResponse,
} from "@/features/experiments/types/article.types";

const defaultLimit = 20;

function buildArticleQuery({
  cursor,
  q,
  journalId,
  limit = defaultLimit,
}: ArticleListParams = {}) {
  const params = new URLSearchParams({ limit: String(limit) });
  const trimmedQuery = q?.trim();
  const trimmedJournalId = journalId?.trim();

  if (cursor) {
    params.set("cursor", cursor);
  }

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }

  if (trimmedJournalId) {
    params.set("journalId", trimmedJournalId);
  }

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
