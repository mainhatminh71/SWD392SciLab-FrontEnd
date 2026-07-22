"use client";

import { useQuery } from "@tanstack/react-query";
import { getArticleById } from "@/features/experiments/api/articles.api";
import type {
  ArticleGraphEdge,
  ArticleGraphNode,
} from "@/features/experiments/types/article-graph.types";

const FALLBACK_LIMIT = 15;

type CitedWorksFallback = {
  nodes: ArticleGraphNode[];
  edges: ArticleGraphEdge[];
};

/**
 * Builds a client-side citation graph when Neo4j RELATED_TO neighbors
 * are not synced yet for an article.
 */
export function useCitedWorksFallback(
  articleId: string,
  rootTitle: string,
  citedArticleIds: string[],
  enabled: boolean,
) {
  return useQuery({
    queryKey: [
      "article-cited-fallback",
      articleId,
      citedArticleIds.slice(0, FALLBACK_LIMIT),
    ] as const,
    enabled: enabled && articleId.trim().length > 0 && citedArticleIds.length > 0,
    staleTime: 60_000,
    queryFn: async (): Promise<CitedWorksFallback> => {
      const rootNodeId = `article:${articleId}`;
      const ids = citedArticleIds
        .map((id) => id.trim())
        .filter((id) => id && id !== articleId)
        .slice(0, FALLBACK_LIMIT);

      const settled = await Promise.all(
        ids.map(async (id) => {
          try {
            const detail = await getArticleById(id);
            return detail.article;
          } catch {
            return null;
          }
        }),
      );

      const cited = settled.filter(
        (article): article is NonNullable<typeof article> => article !== null,
      );

      const years = new Set<number>();
      const nodes: ArticleGraphNode[] = [
        {
          id: rootNodeId,
          type: "article",
          label: rootTitle.trim() || "Current article",
        },
      ];
      const edges: ArticleGraphEdge[] = [];

      for (const article of cited) {
        const nodeId = `article:${article.id}`;
        nodes.push({
          id: nodeId,
          type: "article",
          label: article.title?.trim() || article.id,
        });
        edges.push({
          id: `${rootNodeId}->${nodeId}`,
          sourceId: rootNodeId,
          targetId: nodeId,
          type: "RELATED_TO",
        });

        if (article.publicationYear != null) {
          years.add(article.publicationYear);
          const yearId = `year:${article.publicationYear}`;
          edges.push({
            id: `${nodeId}->${yearId}`,
            sourceId: nodeId,
            targetId: yearId,
            type: "PUBLISHED_IN_YEAR",
          });
        }
      }

      for (const year of [...years].sort((a, b) => a - b)) {
        nodes.push({
          id: `year:${year}`,
          type: "year",
          label: String(year),
        });
      }

      return { nodes, edges };
    },
  });
}
