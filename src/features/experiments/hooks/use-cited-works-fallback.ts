"use client";

import { useQuery } from "@tanstack/react-query";
import { getArticleById } from "@/features/experiments/api/articles.api";
import { toGraphPaperInfo } from "@/features/experiments/hooks/use-graph-paper-details";
import type { GraphPaperInfo } from "@/features/experiments/types/graph-paper.types";
import type {
  ArticleGraphEdge,
  ArticleGraphNode,
} from "@/features/experiments/types/article-graph.types";

const FALLBACK_LIMIT = 15;

export type CitedWorksFallback = {
  nodes: ArticleGraphNode[];
  edges: ArticleGraphEdge[];
  papers: Record<string, GraphPaperInfo>;
};

/**
 * Builds a client-side citation graph when Neo4j RELATED_TO neighbors
 * are not synced yet for an article.
 */
export function useCitedWorksFallback(
  articleId: string,
  rootPaper: GraphPaperInfo | null,
  citedArticleIds: string[],
  enabled: boolean,
) {
  return useQuery({
    queryKey: [
      "article-cited-fallback",
      articleId,
      citedArticleIds.slice(0, FALLBACK_LIMIT),
    ] as const,
    enabled:
      enabled && articleId.trim().length > 0 && citedArticleIds.length > 0,
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
            return await getArticleById(id);
          } catch {
            return null;
          }
        }),
      );

      const cited = settled.filter(
        (detail): detail is NonNullable<typeof detail> => detail !== null,
      );

      const papers: Record<string, GraphPaperInfo> = {};
      if (rootPaper) {
        papers[articleId] = rootPaper;
      } else {
        papers[articleId] = {
          id: articleId,
          title: "Current article",
          authors: [],
          year: null,
          journal: null,
          abstract: null,
          citationCount: citedArticleIds.length,
        };
      }

      const nodes: ArticleGraphNode[] = [
        {
          id: rootNodeId,
          type: "article",
          label: papers[articleId].title,
        },
      ];
      const edges: ArticleGraphEdge[] = [];

      for (const detail of cited) {
        const info = toGraphPaperInfo(detail);
        papers[info.id] = info;
        const nodeId = `article:${info.id}`;
        nodes.push({
          id: nodeId,
          type: "article",
          label: info.title,
        });
        edges.push({
          id: `${rootNodeId}->${nodeId}`,
          sourceId: rootNodeId,
          targetId: nodeId,
          type: "RELATED_TO",
        });
      }

      return { nodes, edges, papers };
    },
  });
}
