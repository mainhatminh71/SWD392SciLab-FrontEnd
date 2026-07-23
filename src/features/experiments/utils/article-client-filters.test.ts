import { describe, expect, it } from "vitest";
import {
  hasActiveArticleClientFilters,
  matchesArticleClientFilters,
} from "@/features/experiments/utils/article-client-filters";
import {
  collectArticleTagOptions,
  pinTagName,
} from "@/features/experiments/utils/article-tag-options";
import { getArticleGraphNodeCount } from "@/features/experiments/utils/article-format";
import type { ArticleGraph } from "@/features/experiments/types/article.types";

function articleFixture(
  id: string,
  citationCount: number,
  cited: string[] = [],
): ArticleGraph {
  return {
    article: {
      id,
      title: id,
      abstract: null,
      doi: null,
      publicationYear: 2024,
      version: null,
      volumeNumber: null,
      issueNumber: null,
      citationCount,
      createdAt: null,
      updatedAt: null,
    },
    journal: null,
    authors: [],
    keywords: [],
    topics: [],
    citedArticleIds: cited,
  };
}

describe("getArticleGraphNodeCount", () => {
  it("uses citedArticleIds when hydrated", () => {
    expect(
      getArticleGraphNodeCount(articleFixture("W1", 999, ["a", "b", "c"])),
    ).toBe(3);
  });

  it("falls back to citationCount when refs are empty (live API shape)", () => {
    expect(getArticleGraphNodeCount(articleFixture("W1", 230, []))).toBe(230);
    expect(getArticleGraphNodeCount(articleFixture("W2", 0, []))).toBe(0);
  });
});

const withBiology = {
  article: {
    id: "W1",
    title: "ACS materials overview",
    doi: "10.1000/demo",
    publicationYear: 2024,
    citationCount: 12,
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
  citedArticleIds: [],
} as unknown as ArticleGraph;

const withoutBiology = {
  article: {
    id: "W2",
    title: "Agriculture notes",
    publicationYear: 2025,
    citationCount: 0,
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
  it("filters the main search box against title/abstract/tags (AND tokens)", () => {
    const titled = {
      ...withBiology,
      article: {
        ...withBiology.article,
        title: "Identification and management of workplace stress",
        abstract: "A review of clinical protocols.",
      },
    } as unknown as ArticleGraph;

    expect(
      matchesArticleClientFilters(titled, {
        textSearch: "Identification and management",
      }),
    ).toBe(true);
    expect(
      matchesArticleClientFilters(titled, {
        textSearch: "biology",
      }),
    ).toBe(true);
    expect(
      matchesArticleClientFilters(withoutBiology, {
        textSearch: "Identification and management",
      }),
    ).toBe(false);
  });

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

  it("loosely matches country / publisher labels", () => {
    expect(
      matchesArticleClientFilters(withBiology, { country: "us" }),
    ).toBe(true);
    expect(
      matchesArticleClientFilters(withBiology, { publisher: "ac" }),
    ).toBe(true);
  });
});

describe("hasActiveArticleClientFilters", () => {
  it("ignores the default year window", () => {
    expect(
      hasActiveArticleClientFilters({
        yearFrom: "2023",
        yearTo: "2025",
      }),
    ).toBe(false);
    expect(
      hasActiveArticleClientFilters({
        yearFrom: "2023",
        yearTo: "2025",
        keywordName: "Biology",
      }),
    ).toBe(true);
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
