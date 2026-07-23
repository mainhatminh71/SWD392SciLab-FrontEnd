import { listArticles } from "@/features/experiments/api/articles.api";
import { listJournals } from "@/features/experiments/api/journals.api";
import { listJournalRankings } from "@/features/laboratories/api/journal-rankings.api";
import { apiConfig } from "@/core/api/config";
import type {
  ApiSource,
  ApiSourceStatus,
  ConnectionHealth,
} from "@/features/api-sources/types/api-source.types";
import {
  CATALOG_SOURCE_ID,
  OPENALEX_SOURCE_ID,
  SCIMAGO_SOURCE_ID,
  getActiveCatalogSourceId,
  getEndpointOverride,
  getSourceStatus,
  readPersistedApiSources,
  removeCustomSource,
  setActiveCatalogSourceId,
  setEndpointOverride,
  setSourceStatus,
  upsertCustomSource,
  type PersistedCustomSource,
} from "@/features/api-sources/lib/runtime-api-sources";

async function probeOk(run: () => Promise<unknown>): Promise<{
  ok: boolean;
  checkedAt: string;
}> {
  const checkedAt = new Date().toISOString();
  try {
    await run();
    return { ok: true, checkedAt };
  } catch {
    return { ok: false, checkedAt };
  }
}

function withStatus(
  sourceId: string,
  fallback: ApiSourceStatus,
  healthWhenActive: ConnectionHealth,
): Pick<ApiSource, "status" | "connectionHealth"> {
  const status = getSourceStatus(sourceId, fallback);
  return {
    status,
    connectionHealth: status === "disabled" ? "unknown" : healthWhenActive,
  };
}

/** Live connection status for configured academic data sources. */
export async function listApiSources(): Promise<ApiSource[]> {
  const persisted = readPersistedApiSources();
  const activeCatalogId = getActiveCatalogSourceId();

  const [journalsProbe, articlesProbe, rankingsProbe] = await Promise.all([
    probeOk(() => listJournals({ limit: 1 })),
    probeOk(() => listArticles({ limit: 1 })),
    probeOk(() => listJournalRankings({ year: 2024, limit: 1 })),
  ]);

  const academicHealthy = journalsProbe.ok && articlesProbe.ok;
  const academicHealth: ConnectionHealth = academicHealthy
    ? "healthy"
    : journalsProbe.ok || articlesProbe.ok
      ? "degraded"
      : "down";
  const rankingsHealth: ConnectionHealth = rankingsProbe.ok
    ? "healthy"
    : "down";

  const catalogEndpoint =
    getEndpointOverride(CATALOG_SOURCE_ID) ||
    `${apiConfig.publicApiUrl}/academic`;

  const defaults: ApiSource[] = [
    {
      id: CATALOG_SOURCE_ID,
      providerId: "openalex",
      name: "SciLab Academic API",
      description:
        "Catalog for articles, journals, and dashboards. Disable to block student search & browse.",
      endpoint: catalogEndpoint,
      ...withStatus(CATALOG_SOURCE_ID, "active", academicHealth),
      lastSync: articlesProbe.checkedAt,
      apiKeyConfigured: true,
    },
    {
      id: OPENALEX_SOURCE_ID,
      providerId: "openalex",
      name: "OpenAlex",
      description:
        "Upstream scholarly graph. Disable to block Related Works graph enrichment.",
      endpoint:
        getEndpointOverride(OPENALEX_SOURCE_ID) || "https://api.openalex.org",
      ...withStatus(
        OPENALEX_SOURCE_ID,
        "active",
        academicHealthy ? "healthy" : "degraded",
      ),
      lastSync: journalsProbe.checkedAt,
      apiKeyConfigured: false,
    },
    {
      id: SCIMAGO_SOURCE_ID,
      providerId: "scimago",
      name: "SCImago Journal Rank",
      description:
        "Journal rankings feed. Disable to block Admin/Student rankings pages.",
      endpoint:
        getEndpointOverride(SCIMAGO_SOURCE_ID) ||
        `${apiConfig.publicApiUrl}/academic/journal-rankings`,
      ...withStatus(SCIMAGO_SOURCE_ID, "active", rankingsHealth),
      lastSync: rankingsProbe.checkedAt,
      apiKeyConfigured: false,
    },
  ];

  const customs: ApiSource[] = persisted.customSources.map((source) => ({
    id: source.id,
    providerId: source.providerId,
    name: source.name,
    description:
      source.description ||
      (source.runtimeRole === "catalog"
        ? "Custom SciLab-compatible catalog endpoint."
        : "Custom integration source."),
    endpoint: source.endpoint,
    status: getSourceStatus(source.id, source.status),
    connectionHealth:
      getSourceStatus(source.id, source.status) === "disabled"
        ? "unknown"
        : "unknown",
    lastSync: null,
    apiKeyConfigured: source.apiKeyConfigured,
  }));

  // Mark active catalog in description for clarity in UI consumers.
  return [...defaults, ...customs].map((source) =>
    source.id === activeCatalogId
      ? {
          ...source,
          description: `${source.description} · Active catalog source`,
        }
      : source,
  );
}

export function updateApiSourceStatus(
  sourceId: string,
  status: ApiSourceStatus,
) {
  setSourceStatus(sourceId, status);
}

export async function refreshApiSource(sourceId: string): Promise<ApiSource[]> {
  const sources = await listApiSources();
  const match = sources.find((source) => source.id === sourceId);
  if (match && match.status === "active") {
    // Touch lastSync via status rewrite of same status.
    setSourceStatus(sourceId, match.status);
  }
  return listApiSources();
}

export function saveCustomApiSource(source: PersistedCustomSource) {
  upsertCustomSource(source);
}

export function deleteCustomApiSource(sourceId: string) {
  removeCustomSource(sourceId);
}

export function activateCatalogSource(sourceId: string) {
  setActiveCatalogSourceId(sourceId);
}

export function updateSourceEndpoint(sourceId: string, endpoint: string) {
  const persisted = readPersistedApiSources();
  const custom = persisted.customSources.find((row) => row.id === sourceId);
  if (custom) {
    upsertCustomSource({ ...custom, endpoint });
    return;
  }
  setEndpointOverride(sourceId, endpoint);
}

export function getActiveCatalogId() {
  return getActiveCatalogSourceId();
}
