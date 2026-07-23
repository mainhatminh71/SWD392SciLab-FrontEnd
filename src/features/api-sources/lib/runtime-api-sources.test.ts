import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/core/api/errors";
import {
  CATALOG_SOURCE_ID,
  OPENALEX_SOURCE_ID,
  SCIMAGO_SOURCE_ID,
  assertApiSourceForPath,
  assertCatalogSourceEnabled,
  getActiveCatalogSourceId,
  setActiveCatalogSourceId,
  setSourceStatus,
  writePersistedApiSources,
} from "@/features/api-sources/lib/runtime-api-sources";

describe("runtime api sources", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value);
        },
      },
      dispatchEvent: vi.fn(),
    });
    writePersistedApiSources({
      version: 2,
      statuses: {},
      endpointOverrides: {},
      customSources: [],
      activeCatalogSourceId: CATALOG_SOURCE_ID,
    });
  });

  it("blocks catalog paths when SciLab Academic is disabled", () => {
    setSourceStatus(CATALOG_SOURCE_ID, "disabled");
    expect(() => assertCatalogSourceEnabled()).toThrow(ApiError);
    expect(() => assertApiSourceForPath("/academic/articles?limit=1")).toThrow(
      /catalog API source is disabled/i,
    );
  });

  it("blocks rankings when SCImago is disabled", () => {
    setSourceStatus(SCIMAGO_SOURCE_ID, "disabled");
    expect(() =>
      assertApiSourceForPath("/academic/journal-rankings?year=2024"),
    ).toThrow(/SCImago/i);
  });

  it("blocks related-works graphs when OpenAlex is disabled", () => {
    setSourceStatus(OPENALEX_SOURCE_ID, "disabled");
    expect(() =>
      assertApiSourceForPath("/academic/graphs/article/W1"),
    ).toThrow(/OpenAlex/i);
  });

  it("allows switching the active catalog source id", () => {
    setActiveCatalogSourceId("src-custom");
    expect(getActiveCatalogSourceId()).toBe("src-custom");
  });
});
