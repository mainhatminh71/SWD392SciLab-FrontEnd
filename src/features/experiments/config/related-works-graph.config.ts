/**
 * Related Works Graph data source.
 *
 * - `connect-papers` — build the graph from cited articles already in the catalog (preferred default)
 * - `public-api` — GET /academic/graphs/article/:id (OpenAlex RELATED_TO)
 * - `mock` — fixed mock papers for UI preview
 */
export const RELATED_WORKS_GRAPH_SOURCE = {
  CONNECT_PAPERS: "connect-papers",
  PUBLIC_API: "public-api",
  MOCK: "mock",
} as const;

export type RelatedWorksGraphSource =
  (typeof RELATED_WORKS_GRAPH_SOURCE)[keyof typeof RELATED_WORKS_GRAPH_SOURCE];

const SOURCE_VALUES = new Set<string>(Object.values(RELATED_WORKS_GRAPH_SOURCE));

function resolveRelatedWorksGraphSource(
  value = process.env.NEXT_PUBLIC_RELATED_WORKS_GRAPH_SOURCE,
): RelatedWorksGraphSource {
  const normalized = value?.trim().toLowerCase();
  if (normalized && SOURCE_VALUES.has(normalized)) {
    return normalized as RelatedWorksGraphSource;
  }

  // Prefer connecting existing catalog papers when unset / invalid.
  return RELATED_WORKS_GRAPH_SOURCE.CONNECT_PAPERS;
}

/** Active graph source — default prioritizes connecting existing papers. */
export const relatedWorksGraphSource = resolveRelatedWorksGraphSource();

export function isConnectPapersSource(
  source = relatedWorksGraphSource,
): boolean {
  return source === RELATED_WORKS_GRAPH_SOURCE.CONNECT_PAPERS;
}

export function isPublicApiGraphSource(
  source = relatedWorksGraphSource,
): boolean {
  return source === RELATED_WORKS_GRAPH_SOURCE.PUBLIC_API;
}

export function isMockGraphSource(source = relatedWorksGraphSource): boolean {
  return source === RELATED_WORKS_GRAPH_SOURCE.MOCK;
}
