import { apiConfig } from "@/core/api/config";
import { ApiError } from "@/core/api/errors";
import type {
  ApiSource,
  ApiSourceStatus,
} from "@/features/api-sources/types/api-source.types";

export const API_SOURCES_CHANGED_EVENT = "scilab-api-sources-changed";

export const CATALOG_SOURCE_ID = "scilab-academic";
export const OPENALEX_SOURCE_ID = "openalex-public";
export const SCIMAGO_SOURCE_ID = "scimago";

const STORAGE_KEY = "scilab_admin_api_sources_v2";
const LEGACY_STATE_KEY = "scilab_admin_api_source_state";

export type ApiSourceRuntimeRole = "catalog" | "rankings" | "upstream";

export type PersistedCustomSource = {
  id: string;
  providerId: ApiSource["providerId"];
  name: string;
  description: string;
  endpoint: string;
  status: ApiSourceStatus;
  apiKeyConfigured: boolean;
  /** Custom SciLab-compatible catalog endpoints can be selected as active catalog. */
  runtimeRole?: ApiSourceRuntimeRole;
};

type PersistedApiSources = {
  version: 2;
  statuses: Record<string, ApiSourceStatus>;
  endpointOverrides: Record<string, string>;
  customSources: PersistedCustomSource[];
  activeCatalogSourceId: string;
};

function defaultConfig(): PersistedApiSources {
  return {
    version: 2,
    statuses: {},
    endpointOverrides: {},
    customSources: [],
    activeCatalogSourceId: CATALOG_SOURCE_ID,
  };
}

function migrateLegacyStatuses(): Record<string, ApiSourceStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LEGACY_STATE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<
      string,
      { status?: ApiSourceStatus }
    >;
    const statuses: Record<string, ApiSourceStatus> = {};
    for (const [id, value] of Object.entries(parsed)) {
      if (value?.status) statuses[id] = value.status;
    }
    return statuses;
  } catch {
    return {};
  }
}

export function readPersistedApiSources(): PersistedApiSources {
  if (typeof window === "undefined") return defaultConfig();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const migrated = defaultConfig();
      migrated.statuses = migrateLegacyStatuses();
      return migrated;
    }
    const parsed = JSON.parse(raw) as PersistedApiSources;
    if (parsed?.version !== 2) return defaultConfig();
    return {
      ...defaultConfig(),
      ...parsed,
      statuses: parsed.statuses ?? {},
      endpointOverrides: parsed.endpointOverrides ?? {},
      customSources: parsed.customSources ?? [],
      activeCatalogSourceId:
        parsed.activeCatalogSourceId || CATALOG_SOURCE_ID,
    };
  } catch {
    return defaultConfig();
  }
}

export function writePersistedApiSources(config: PersistedApiSources) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event(API_SOURCES_CHANGED_EVENT));
}

export function getSourceStatus(
  sourceId: string,
  fallback: ApiSourceStatus = "active",
): ApiSourceStatus {
  return readPersistedApiSources().statuses[sourceId] ?? fallback;
}

export function isSourceEnabled(sourceId: string): boolean {
  return getSourceStatus(sourceId) === "active";
}

export function setSourceStatus(sourceId: string, status: ApiSourceStatus) {
  const config = readPersistedApiSources();
  config.statuses[sourceId] = status;
  if (status !== "active" && config.activeCatalogSourceId === sourceId) {
    config.activeCatalogSourceId = CATALOG_SOURCE_ID;
  }
  writePersistedApiSources(config);
}

export function upsertCustomSource(source: PersistedCustomSource) {
  const config = readPersistedApiSources();
  const index = config.customSources.findIndex((row) => row.id === source.id);
  if (index >= 0) {
    config.customSources[index] = source;
  } else {
    config.customSources.push(source);
  }
  config.statuses[source.id] = source.status;
  writePersistedApiSources(config);
}

export function removeCustomSource(sourceId: string) {
  const config = readPersistedApiSources();
  config.customSources = config.customSources.filter(
    (source) => source.id !== sourceId,
  );
  delete config.statuses[sourceId];
  if (config.activeCatalogSourceId === sourceId) {
    config.activeCatalogSourceId = CATALOG_SOURCE_ID;
  }
  writePersistedApiSources(config);
}

export function setActiveCatalogSourceId(sourceId: string) {
  const config = readPersistedApiSources();
  config.activeCatalogSourceId = sourceId;
  config.statuses[sourceId] = "active";
  writePersistedApiSources(config);
}

export function getActiveCatalogSourceId(): string {
  return readPersistedApiSources().activeCatalogSourceId || CATALOG_SOURCE_ID;
}

export function setEndpointOverride(sourceId: string, endpoint: string) {
  const config = readPersistedApiSources();
  config.endpointOverrides[sourceId] = endpoint.trim();
  writePersistedApiSources(config);
}

export function getEndpointOverride(sourceId: string): string | undefined {
  return readPersistedApiSources().endpointOverrides[sourceId];
}

function normalizeApiBase(endpoint: string) {
  const trimmed = endpoint.trim().replace(/\/$/, "");
  if (trimmed.endsWith("/academic")) {
    return trimmed.slice(0, -"/academic".length) || "/";
  }
  return trimmed;
}

/** Resolve browser base URL for catalog academic calls. */
export function resolveCatalogApiBaseUrl(): string {
  const config = readPersistedApiSources();
  const activeId = config.activeCatalogSourceId || CATALOG_SOURCE_ID;

  if (activeId === CATALOG_SOURCE_ID) {
    const override = config.endpointOverrides[CATALOG_SOURCE_ID];
    if (override) {
      return normalizeApiBase(override) || apiConfig.publicApiUrl;
    }
    return apiConfig.publicApiUrl;
  }

  const custom = config.customSources.find((source) => source.id === activeId);
  if (custom?.endpoint) {
    return normalizeApiBase(custom.endpoint) || apiConfig.publicApiUrl;
  }

  return apiConfig.publicApiUrl;
}

export function assertCatalogSourceEnabled() {
  const activeId = getActiveCatalogSourceId();

  if (activeId === CATALOG_SOURCE_ID) {
    if (isSourceEnabled(CATALOG_SOURCE_ID)) return;
    throw new ApiError(
      "The academic catalog API source is disabled by an administrator. Enable it in Admin → API Sources.",
      503,
      "SOURCE_DISABLED",
    );
  }

  if (isSourceEnabled(activeId)) return;

  throw new ApiError(
    "The active catalog API source is disabled by an administrator. Enable it or switch sources in Admin → API Sources.",
    503,
    "SOURCE_DISABLED",
  );
}

export function assertRankingsSourceEnabled() {
  if (isSourceEnabled(SCIMAGO_SOURCE_ID)) return;
  throw new ApiError(
    "Journal rankings are disabled because the SCImago API source is turned off in Admin → API Sources.",
    503,
    "SOURCE_DISABLED",
  );
}

export function assertUpstreamSourceEnabled() {
  if (isSourceEnabled(OPENALEX_SOURCE_ID)) return;
  throw new ApiError(
    "Related works / OpenAlex features are disabled because the OpenAlex API source is turned off in Admin → API Sources.",
    503,
    "SOURCE_DISABLED",
  );
}

/** Gate academic HTTP calls based on admin API source toggles. */
export function assertApiSourceForPath(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!normalized.startsWith("/academic")) {
    return;
  }

  if (
    normalized.startsWith("/academic/journal-rankings") ||
    normalized.includes("/journal-rankings")
  ) {
    assertRankingsSourceEnabled();
    return;
  }

  if (
    normalized.startsWith("/academic/graphs") ||
    normalized.includes("/graphs/")
  ) {
    assertUpstreamSourceEnabled();
    assertCatalogSourceEnabled();
    return;
  }

  assertCatalogSourceEnabled();
}

export function resolveRequestApiBase(path: string, authenticated: boolean) {
  if (authenticated) {
    return apiConfig.bffApiUrl;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.startsWith("/academic")) {
    return resolveCatalogApiBaseUrl();
  }

  return apiConfig.publicApiUrl;
}

export function builtinRuntimeRole(sourceId: string): ApiSourceRuntimeRole | null {
  if (sourceId === CATALOG_SOURCE_ID) return "catalog";
  if (sourceId === SCIMAGO_SOURCE_ID) return "rankings";
  if (sourceId === OPENALEX_SOURCE_ID) return "upstream";
  return null;
}
