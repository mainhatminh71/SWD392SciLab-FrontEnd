import { describe, expect, it } from "vitest";
import {
  matchesArticleClientFilters,
  sortArticlesForClient,
} from "@/features/experiments/utils/article-client-filters";
import {
  collectArticleTagOptions,
  pinTagName,
} from "@/features/experiments/utils/article-tag-options";
import type { ArticleGraph } from "@/features/experiments/types/article.types";

const withBiology = {
  article: {
    id: "W1",
    doi: "10.1000/demo",
    publicationYear: 2024,
  },
  journal: {
    id: "J1",
    displayName: "ACS Nano",
    publisherName: "ACS",
    country: "US",
    isOpenAccess: true,
  },
  keywords: [
    { id: "k-other", displayName: "Gene" },
    { id: "k-bio", displayName: "Biology" },
  ],
  topics: [{ id: "t1", displayName: "Materials science", isPrimary: true }],
  authors: [{ displayName: "Ada Lovelace" }],
  citedArticleIds: ["W10", "W11", "W12", "W13", "W14"],
} as unknown as ArticleGraph;

const withoutBiology = {
  article: {
    id: "W2",
    publicationYear: 2025,
  },
  journal: {
    id: "J1",
    displayName: "International Journal of Agriculture and Biology",
    publisherName: "IJAB",
    country: "PK",
    isOpenAccess: false,
  },
  keywords: [{ id: "k-empty", displayName: null }],
  topics: [],
  authors: [{ displayName: "Chen Dong" }],
  citedArticleIds: [],
} as unknown as ArticleGraph;

describe("matchesArticleClientFilters", () => {
  it("keeps only cards that actually carry the selected keyword name", () => {
    expect(
      matchesArticleClientFilters(withBiology, { keywordName: "Biology" }),
    ).toBe(true);
    expect(
      matchesArticleClientFilters(withoutBiology, { keywordName: "Biology" }),
    ).toBe(false);
  });

  it("combines keyword with year range", () => {
    expect(
      matchesArticleClientFilters(withBiology, {
        keywordName: "Biology",
        yearFrom: "2023",
        yearTo: "2025",
      }),
    ).toBe(true);
    expect(
      matchesArticleClientFilters(withBiology, {
        keywordName: "Biology",
        yearFrom: "2025",
        yearTo: "2025",
      }),
    ).toBe(false);
  });

  it("filters journal, publisher, country and topic by visible labels", () => {
    expect(
      matchesArticleClientFilters(withBiology, {
        journalId: "J1",
        publisher: "ACS",
        country: "US",
        topicName: "Materials science",
      }),
    ).toBe(true);
    expect(
      matchesArticleClientFilters(withBiology, {
        topicName: "Organic chemistry",
      }),
    ).toBe(false);
  });

  it("filters by minimum related-work graph node count", () => {
    expect(
      matchesArticleClientFilters(withBiology, { minGraphNodes: "5" }),
    ).toBe(true);
    expect(
      matchesArticleClientFilters(withBiology, { minGraphNodes: "10" }),
    ).toBe(false);
    expect(
      matchesArticleClientFilters(withoutBiology, { minGraphNodes: "1" }),
    ).toBe(false);
  });
});

describe("sortArticlesForClient", () => {
  it("puts richer graphs first for most_related", () => {
    const ordered = sortArticlesForClient(
      [withoutBiology, withBiology],
      "most_related",
    );
    expect(ordered.map((item) => item.article.id)).toEqual(["W1", "W2"]);
  });

  it("keeps API order for newest", () => {
    const ordered = sortArticlesForClient(
      [withoutBiology, withBiology],
      "newest",
    );
    expect(ordered.map((item) => item.article.id)).toEqual(["W2", "W1"]);
  });
});

describe("tag options helpers", () => {
  it("dedupes keyword options by display name", () => {
    const options = collectArticleTagOptions(
      [
        withBiology,
        {
          ...withBiology,
          article: { ...withBiology.article, id: "W3" },
          keywords: [{ id: "k-bio-2", displayName: "Biology" }],
        } as unknown as ArticleGraph,
      ],
      "keywords",
    );
    expect(options.filter((option) => option.name === "Biology")).toHaveLength(
      1,
    );
  });

  it("pins the active keyword so cards always show it", () => {
    expect(pinTagName(["Gene", "Biology", "Stress"], "Biology", 4)).toEqual([
      "Biology",
      "Gene",
      "Stress",
    ]);
  });
});
