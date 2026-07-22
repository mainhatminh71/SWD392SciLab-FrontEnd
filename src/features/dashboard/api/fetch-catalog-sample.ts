import { listArticles } from "@/features/experiments/api/articles.api";
import { listJournals } from "@/features/experiments/api/journals.api";
import type { ArticleGraph } from "@/features/experiments/types/article.types";
import type { JournalListItem } from "@/features/experiments/types/journal.types";

export type CatalogSample = {
  articles: ArticleGraph[];
  journals: JournalListItem[];
  articlesHasMore: boolean;
  journalsHasMore: boolean;
};

/** API max page size for academic list endpoints. */
const CATALOG_PAGE_LIMIT = 100;

/**
 * Pull 100 articles + 100 journals directly from the academic API
 * for dashboard / trend aggregation (no nested paging).
 */
export async function fetchCatalogSample(): Promise<CatalogSample> {
  const [journalsPage, articlesPage] = await Promise.all([
    listJournals({ limit: CATALOG_PAGE_LIMIT }),
    listArticles({ limit: CATALOG_PAGE_LIMIT }),
  ]);

  return {
    articles: articlesPage.items,
    journals: journalsPage.items,
    articlesHasMore: Boolean(articlesPage.nextCursor),
    journalsHasMore: Boolean(journalsPage.nextCursor),
  };
}
