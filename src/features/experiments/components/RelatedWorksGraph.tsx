"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Loader2,
  Minus,
  Network,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useArticleGraph } from "@/features/experiments/hooks/use-article-graph";
import { useCitedWorksFallback } from "@/features/experiments/hooks/use-cited-works-fallback";
import { useGraphPaperDetails } from "@/features/experiments/hooks/use-graph-paper-details";
import { articleIdFromNodeId } from "@/features/experiments/types/article-graph.types";
import type {
  ArticleGraphEdge,
  ArticleGraphNode,
} from "@/features/experiments/types/article-graph.types";
import type { GraphPaperInfo } from "@/features/experiments/types/graph-paper.types";
import { shortAuthorLabel } from "@/features/experiments/types/graph-paper.types";
import { cn } from "@/shared/components/ui/utils";

const WIDTH = 760;
const HEIGHT = 520;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;

type PositionedNode = ArticleGraphNode & {
  x: number;
  y: number;
  radius: number;
};

function hashUnit(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return (hash % 10_000) / 10_000;
}

function layoutArticleNodes(
  rootId: string,
  nodes: ArticleGraphNode[],
  papers: Record<string, GraphPaperInfo>,
): Map<string, PositionedNode> {
  const articles = nodes.filter((node) => node.type === "article");
  const positioned = new Map<string, PositionedNode>();
  const satellites = articles.filter((node) => node.id !== rootId);

  const rootPaper = papers[articleIdFromNodeId(rootId) ?? ""];
  positioned.set(rootId, {
    id: rootId,
    type: "article",
    label: rootPaper?.title ?? nodes.find((n) => n.id === rootId)?.label ?? "",
    x: CENTER_X,
    y: CENTER_Y,
    radius: 18,
  });

  satellites.forEach((node, index) => {
    const paperId = articleIdFromNodeId(node.id) ?? node.id;
    const paper = papers[paperId];
    const t = (index + 0.5) / Math.max(satellites.length, 1);
    const angle =
      t * Math.PI * 2 +
      (hashUnit(`${node.id}:a`) - 0.5) * 0.55;
    const ring = 0.32 + hashUnit(`${node.id}:r`) * 0.28;
    const radius = 8 + Math.min(10, (paper?.citationCount ?? 0) / 4);

    positioned.set(node.id, {
      ...node,
      x: CENTER_X + Math.cos(angle) * WIDTH * ring * 0.48,
      y: CENTER_Y + Math.sin(angle) * HEIGHT * ring * 0.46,
      radius,
    });
  });

  return positioned;
}

function truncateLabel(label: string, max = 42) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

function articleNodeCount(nodes: ArticleGraphNode[]) {
  return nodes.filter((node) => node.type === "article").length;
}

type RelatedWorksGraphProps = {
  articleId: string;
  citedArticleIds?: string[];
  rootPaper?: GraphPaperInfo | null;
};

/** Connected-Papers-style explorer for related / cited works. */
export function RelatedWorksGraph({
  articleId,
  citedArticleIds = [],
  rootPaper = null,
}: RelatedWorksGraphProps) {
  const router = useRouter();
  const rootNodeId = `article:${articleId}`;
  const [selectedId, setSelectedId] = useState(rootNodeId);
  const [zoom, setZoom] = useState(1);

  const {
    nodes: relatedNodes,
    edges: relatedEdges,
    isLoading: isRelatedLoading,
    isLoadingMore,
    hasMore,
    error: relatedError,
    loadMore,
  } = useArticleGraph(articleId);

  const relatedArticleCount = articleNodeCount(relatedNodes);
  const needsCitationFallback =
    !isRelatedLoading &&
    (Boolean(relatedError) || relatedArticleCount <= 1) &&
    citedArticleIds.length > 0;

  const {
    data: citationFallback,
    isLoading: isFallbackLoading,
    error: fallbackError,
  } = useCitedWorksFallback(
    articleId,
    rootPaper,
    citedArticleIds,
    needsCitationFallback,
  );

  const usingCitationFallback =
    needsCitationFallback &&
    Boolean(citationFallback) &&
    articleNodeCount(citationFallback?.nodes ?? []) > 1;

  const graphNodes = useMemo(
    () =>
      usingCitationFallback
        ? (citationFallback?.nodes ?? [])
        : relatedNodes,
    [usingCitationFallback, citationFallback?.nodes, relatedNodes],
  );
  const graphEdges = useMemo(
    () =>
      usingCitationFallback
        ? (citationFallback?.edges ?? [])
        : relatedEdges,
    [usingCitationFallback, citationFallback?.edges, relatedEdges],
  );

  const articleNodes = useMemo(
    () => graphNodes.filter((node) => node.type === "article"),
    [graphNodes],
  );

  const articleEdges = useMemo(
    () =>
      graphEdges.filter((edge) => {
        const source = articleIdFromNodeId(edge.sourceId);
        const target = articleIdFromNodeId(edge.targetId);
        return Boolean(source && target) && edge.type === "RELATED_TO";
      }),
    [graphEdges],
  );

  const seededPapers = useMemo(() => {
    const map: Record<string, GraphPaperInfo> = {
      ...(citationFallback?.papers ?? {}),
    };
    if (rootPaper) {
      map[articleId] = rootPaper;
    }
    return map;
  }, [articleId, citationFallback?.papers, rootPaper]);

  const detailIds = useMemo(
    () =>
      articleNodes
        .map((node) => articleIdFromNodeId(node.id))
        .filter((id): id is string => Boolean(id)),
    [articleNodes],
  );

  const { papers, isLoading: isDetailsLoading } = useGraphPaperDetails(
    detailIds,
    seededPapers,
    articleNodes.length > 1,
  );

  const positioned = useMemo(
    () => layoutArticleNodes(rootNodeId, articleNodes, papers),
    [rootNodeId, articleNodes, papers],
  );

  useEffect(() => {
    setSelectedId(rootNodeId);
    setZoom(1);
  }, [articleId, rootNodeId]);

  useEffect(() => {
    if (!positioned.has(selectedId) && positioned.size > 0) {
      setSelectedId(rootNodeId);
    }
  }, [positioned, rootNodeId, selectedId]);

  const selectedPaperId = articleIdFromNodeId(selectedId);
  const selectedPaper =
    (selectedPaperId ? papers[selectedPaperId] : null) ??
    (selectedPaperId === articleId ? rootPaper : null);

  const listPapers = useMemo(() => {
    return articleNodes
      .map((node) => {
        const id = articleIdFromNodeId(node.id);
        if (!id) {
          return null;
        }
        return (
          papers[id] ?? {
            id,
            title: node.label,
            authors: [],
            year: null,
            journal: null,
            abstract: null,
            citationCount: 0,
          }
        );
      })
      .filter((paper): paper is GraphPaperInfo => paper !== null)
      .sort((left, right) => {
        if (left.id === articleId) {
          return -1;
        }
        if (right.id === articleId) {
          return 1;
        }
        return left.title.localeCompare(right.title);
      });
  }, [articleNodes, papers, articleId]);

  if (isRelatedLoading || (needsCitationFallback && isFallbackLoading)) {
    return (
      <Card className="p-8 border-border flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading related works graph…
      </Card>
    );
  }

  if (
    !usingCitationFallback &&
    relatedError &&
    (!needsCitationFallback || fallbackError)
  ) {
    return (
      <Card className="p-8 border-border text-center text-muted-foreground">
        {relatedError}
      </Card>
    );
  }

  if (articleNodes.length <= 1) {
    return (
      <Card className="p-8 border-border text-center text-muted-foreground space-y-2">
        <p>No related or cited works available for this article yet.</p>
        <p className="text-xs">
          The graph API is reachable; OpenAlex related-work links may still be
          syncing for this paper.
        </p>
      </Card>
    );
  }

  const relatedCount = articleNodes.length - 1;

  return (
    <Card className="border-border overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
          <Network className="w-4 h-4 shrink-0" />
          <span className="truncate">
            {usingCitationFallback
              ? `${relatedCount} cited works`
              : `${relatedCount} related works`}
          </span>
          {usingCitationFallback && (
            <span className="hidden sm:inline text-xs text-muted-foreground/80">
              · citation fallback while related links sync
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!usingCitationFallback && hasMore && (
            <Button
              variant="outline"
              size="sm"
              disabled={isLoadingMore}
              onClick={loadMore}
            >
              {isLoadingMore ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Load more
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_minmax(0,1fr)_280px] min-h-[520px]">
        {/* Paper list */}
        <aside className="border-b lg:border-b-0 lg:border-r border-border bg-card">
          <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground border-b border-border">
            Papers
          </div>
          <ScrollArea className="h-[220px] lg:h-[480px]">
            <ul className="p-2 space-y-1">
              {listPapers.map((paper) => {
                const nodeId = `article:${paper.id}`;
                const isOrigin = paper.id === articleId;
                const isSelected = selectedId === nodeId;
                return (
                  <li key={paper.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(nodeId)}
                      className={cn(
                        "w-full text-left rounded-lg px-3 py-2.5 transition-colors border border-transparent",
                        isSelected
                          ? "bg-primary/10 border-primary/30"
                          : "hover:bg-accent",
                      )}
                    >
                      {isOrigin && (
                        <span className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                          <Sparkles className="w-3 h-3" />
                          Origin paper
                        </span>
                      )}
                      <div className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                        {paper.title}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {paper.authors.slice(0, 2).join(", ") || "Unknown authors"}
                        {paper.year != null ? ` · ${paper.year}` : ""}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </aside>

        {/* Graph canvas */}
        <div className="relative bg-[radial-gradient(circle_at_center,hsl(var(--muted)/0.55),transparent_70%)] min-h-[360px]">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-full min-h-[360px] select-none"
            role="img"
            aria-label="Related works graph"
          >
            <g
              transform={`translate(${CENTER_X}, ${CENTER_Y}) scale(${zoom}) translate(${-CENTER_X}, ${-CENTER_Y})`}
            >
              {articleEdges.map((edge: ArticleGraphEdge) => {
                const source = positioned.get(edge.sourceId);
                const target = positioned.get(edge.targetId);
                if (!source || !target) {
                  return null;
                }
                const touchesSelected =
                  edge.sourceId === selectedId || edge.targetId === selectedId;
                return (
                  <line
                    key={edge.id}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    className={
                      touchesSelected
                        ? "stroke-primary/50"
                        : "stroke-muted-foreground/25"
                    }
                    strokeWidth={touchesSelected ? 1.8 : 1.1}
                  />
                );
              })}

              {[...positioned.values()].map((node) => {
                const isRoot = node.id === rootNodeId;
                const isSelected = node.id === selectedId;
                const paperId = articleIdFromNodeId(node.id);
                const paper = paperId ? papers[paperId] : null;
                const label = shortAuthorLabel(
                  paper?.authors ?? [],
                  paper?.year ?? null,
                );

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer"
                    onClick={() => setSelectedId(node.id)}
                  >
                    {isSelected && (
                      <circle
                        r={node.radius + 7}
                        className="fill-none stroke-primary"
                        strokeWidth={2.5}
                      />
                    )}
                    <circle
                      r={node.radius}
                      className={
                        isRoot
                          ? "fill-primary"
                          : isSelected
                            ? "fill-primary/75"
                            : "fill-primary/45 hover:fill-primary/65"
                      }
                    />
                    <text
                      y={node.radius + 14}
                      textAnchor="middle"
                      className="fill-foreground/80 text-[10px] pointer-events-none"
                    >
                      {isRoot ? "Origin" : truncateLabel(label, 18)}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg border border-border bg-card/95 p-1 shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom((value) => Math.min(1.8, value + 0.15))}
              aria-label="Zoom in"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom((value) => Math.max(0.7, value - 0.15))}
              aria-label="Zoom out"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>

          {isDetailsLoading && (
            <div className="absolute top-3 right-3 text-xs text-muted-foreground flex items-center gap-1.5 bg-card/90 px-2 py-1 rounded-md border border-border">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading details…
            </div>
          )}
        </div>

        {/* Detail pane */}
        <aside className="border-t lg:border-t-0 lg:border-l border-border bg-card flex flex-col min-h-[240px]">
          <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground border-b border-border">
            Selected paper
          </div>
          <div className="flex-1 p-4 space-y-4">
            {selectedPaper ? (
              <>
                {selectedPaper.id === articleId && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    <Sparkles className="w-3 h-3" />
                    Origin paper
                  </span>
                )}
                <div className="space-y-2">
                  <h3 className="font-heading text-lg leading-snug text-foreground">
                    {selectedPaper.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPaper.authors.length > 0
                      ? selectedPaper.authors.join(", ")
                      : "Unknown authors"}
                    {selectedPaper.year != null
                      ? `, ${selectedPaper.year}`
                      : ""}
                  </p>
                  {selectedPaper.journal && (
                    <p className="text-xs text-muted-foreground">
                      {selectedPaper.journal}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {selectedPaper.citationCount} outbound citations in catalog
                  </p>
                </div>

                {selectedPaper.abstract && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Abstract
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-8">
                      {selectedPaper.abstract}
                    </p>
                  </div>
                )}

                <Button
                  className="w-full"
                  disabled={selectedPaper.id === articleId}
                  onClick={() =>
                    router.push(`/student/articles/${selectedPaper.id}`)
                  }
                >
                  View article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                {selectedPaper.id === articleId && (
                  <p className="text-xs text-center text-muted-foreground">
                    You are already viewing this article.
                  </p>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                Select a node to inspect the paper.
              </div>
            )}
          </div>
        </aside>
      </div>
    </Card>
  );
}
