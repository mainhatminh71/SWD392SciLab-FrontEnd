"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Network } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useArticleGraph } from "@/features/experiments/hooks/use-article-graph";
import { articleIdFromNodeId } from "@/features/experiments/types/article-graph.types";
import type { ArticleGraphNode } from "@/features/experiments/types/article-graph.types";

const WIDTH = 720;
const HEIGHT = 420;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;

type PositionedNode = ArticleGraphNode & { x: number; y: number };

function layoutNodes(
  rootId: string,
  nodes: ArticleGraphNode[],
): Map<string, PositionedNode> {
  const positioned = new Map<string, PositionedNode>();
  const satellites = nodes.filter((node) => node.id !== rootId);
  const radiusX = WIDTH * 0.38;
  const radiusY = HEIGHT * 0.38;

  const root = nodes.find((node) => node.id === rootId);
  if (root) {
    positioned.set(root.id, { ...root, x: CENTER_X, y: CENTER_Y });
  }

  satellites.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / Math.max(satellites.length, 1);
    positioned.set(node.id, {
      ...node,
      x: CENTER_X + radiusX * Math.cos(angle),
      y: CENTER_Y + radiusY * Math.sin(angle),
    });
  });

  return positioned;
}

function truncateLabel(label: string, max = 32) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

/** Radial knowledge-graph view backed by GET /academic/graphs/article/:id. */
export function RelatedWorksGraph({ articleId }: { articleId: string }) {
  const router = useRouter();
  const { nodes, edges, isLoading, isLoadingMore, hasMore, error, loadMore } =
    useArticleGraph(articleId);

  const rootNodeId = `article:${articleId}`;
  const positioned = useMemo(
    () => layoutNodes(rootNodeId, nodes),
    [rootNodeId, nodes],
  );

  const openNode = (node: ArticleGraphNode) => {
    const targetArticleId = articleIdFromNodeId(node.id);
    if (targetArticleId && targetArticleId !== articleId) {
      router.push(`/student/articles/${targetArticleId}`);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 border-border flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading related works graph…
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 border-border text-center text-muted-foreground">
        {error}
      </Card>
    );
  }

  // Root + only a year node means there is nothing meaningful to draw yet.
  if (nodes.filter((node) => node.type === "article").length <= 1) {
    return (
      <Card className="p-8 border-border text-center text-muted-foreground">
        No related works available for this article yet.
      </Card>
    );
  }

  return (
    <Card className="p-4 border-border space-y-3">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Network className="w-4 h-4" />
          {nodes.filter((node) => node.type === "article").length - 1} related
          works
        </div>
        {hasMore && (
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

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="Related works graph"
      >
        {edges.map((edge) => {
          const source = positioned.get(edge.sourceId);
          const target = positioned.get(edge.targetId);
          if (!source || !target) {
            return null;
          }
          return (
            <line
              key={edge.id}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              className={
                edge.type === "RELATED_TO"
                  ? "stroke-primary/40"
                  : "stroke-muted-foreground/30"
              }
              strokeWidth={edge.type === "RELATED_TO" ? 1.5 : 1}
              strokeDasharray={edge.type === "PUBLISHED_IN_YEAR" ? "4 4" : ""}
            />
          );
        })}

        {[...positioned.values()].map((node) => {
          const isRoot = node.id === rootNodeId;
          const isArticle = node.type === "article";
          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className={
                isArticle && !isRoot ? "cursor-pointer" : "cursor-default"
              }
              onClick={() => openNode(node)}
            >
              <circle
                r={isRoot ? 14 : isArticle ? 9 : 7}
                className={
                  isRoot
                    ? "fill-primary"
                    : isArticle
                      ? "fill-primary/60 hover:fill-primary"
                      : "fill-muted-foreground/50"
                }
              />
              <text
                y={isRoot ? 30 : 22}
                textAnchor="middle"
                className="fill-muted-foreground text-[11px]"
              >
                {truncateLabel(node.label, isRoot ? 48 : 28)}
              </text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}
