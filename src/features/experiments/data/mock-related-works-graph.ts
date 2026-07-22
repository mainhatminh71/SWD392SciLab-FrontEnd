import type {
  ArticleGraphEdge,
  ArticleGraphNode,
} from "@/features/experiments/types/article-graph.types";
import type { GraphPaperInfo } from "@/features/experiments/types/graph-paper.types";

const MOCK_NEIGHBORS: Omit<GraphPaperInfo, "id">[] = [
  {
    title: "Mental rotation of three-dimensional objects",
    authors: ["Roger N. Shepard", "Jacqueline Metzler"],
    year: 1971,
    journal: "Science",
    abstract:
      "The time required to recognize that two perspective drawings portray objects of the same three-dimensional shape increases linearly with the angular difference in their orientations.",
    citationCount: 12840,
  },
  {
    title: "Transformations of visual memory induced by implied motions",
    authors: ["Jennifer J. Freyd"],
    year: 1983,
    journal: "Journal of Experimental Psychology",
    abstract:
      "Memory for the final position of a moving object is often distorted in the direction of implied motion, revealing dynamic representations in visual cognition.",
    citationCount: 920,
  },
  {
    title: "A computational model of mental rotation",
    authors: ["Georgios K. Georgopoulos", "A. P. Georgopoulos"],
    year: 1995,
    journal: "Neural Computation",
    abstract:
      "A neural network model accounts for continuous mental rotation trajectories and predicts population vector dynamics observed in motor cortex during rotation tasks.",
    citationCount: 410,
  },
  {
    title: "Haptic exploration strategies during mental rotation",
    authors: ["M. A. Heller", "J. Kennedy"],
    year: 2008,
    journal: "Perception & Psychophysics",
    abstract:
      "Participants who excel at mental rotation also show more systematic haptic scanning patterns when comparing raised-line figures by touch alone.",
    citationCount: 186,
  },
  {
    title: "Manual and mental rotation share common processes",
    authors: ["Andreas Wohlschläger", "Astrid Wohlschläger"],
    year: 1998,
    journal: "Journal of Experimental Psychology",
    abstract:
      "Concurrent manual rotation interferes with mental rotation in a direction-specific way, supporting shared spatial transformation mechanisms.",
    citationCount: 640,
  },
];

export function isMockGraphPaperId(id: string) {
  return id.startsWith("mock-");
}

/** Synthetic related-works graph used only when the live API has no neighbors. */
export function buildMockRelatedWorksGraph(
  articleId: string,
  rootPaper: GraphPaperInfo | null,
): {
  nodes: ArticleGraphNode[];
  edges: ArticleGraphEdge[];
  papers: Record<string, GraphPaperInfo>;
} {
  const rootNodeId = `article:${articleId}`;
  const origin: GraphPaperInfo = rootPaper ?? {
    id: articleId,
    title: "Current article",
    authors: [],
    year: null,
    journal: null,
    abstract: null,
    citationCount: 0,
  };

  const papers: Record<string, GraphPaperInfo> = {
    [articleId]: { ...origin, id: articleId },
  };

  const nodes: ArticleGraphNode[] = [
    {
      id: rootNodeId,
      type: "article",
      label: papers[articleId].title,
    },
  ];
  const edges: ArticleGraphEdge[] = [];

  MOCK_NEIGHBORS.forEach((neighbor, index) => {
    const id = `mock-${index + 1}`;
    const nodeId = `article:${id}`;
    papers[id] = { ...neighbor, id };
    nodes.push({
      id: nodeId,
      type: "article",
      label: neighbor.title,
    });
    edges.push({
      id: `${rootNodeId}->${nodeId}`,
      sourceId: rootNodeId,
      targetId: nodeId,
      type: "RELATED_TO",
    });

    // A few cross-links so the canvas looks more Connected-Papers-like.
    if (index > 0) {
      const previousId = `article:mock-${index}`;
      edges.push({
        id: `${previousId}->${nodeId}`,
        sourceId: previousId,
        targetId: nodeId,
        type: "RELATED_TO",
      });
    }
  });

  return { nodes, edges, papers };
}
