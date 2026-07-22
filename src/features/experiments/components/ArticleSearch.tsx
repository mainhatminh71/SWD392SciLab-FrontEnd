"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Filter,
  ChevronDown,
  Calendar,
  Quote,
  ExternalLink,
  BookmarkPlus,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Loader2,
  Search,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import PageContainer from "@/shared/components/layout/PageContainer";
import StudentTopHeader from "@/shared/components/layout/StudentTopHeader";
import {
  ListPageMain,
  ListScrollArea,
} from "@/shared/components/layout/ListPageScroll";
import { RouteDataLoading } from "@/shared/components/layout/RouteDataLoading";
import Can from "@/shared/components/auth/Can";
import { Label } from "@/shared/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useArticles } from "@/features/experiments/hooks/use-articles";
import { useJournals } from "@/features/laboratories/hooks/use-journals";
import { toggleBookmark as toggleBookmarkApi } from "@/features/submissions/api/bookmarks.api";
import { bookmarksRootQueryKey } from "@/features/submissions/hooks/use-bookmarks";
import { isLocallyBookmarked } from "@/features/submissions/api/local-bookmarks";
import type {
  ArticleApiFilters,
  ArticleGraph,
  ArticleSort,
} from "@/features/experiments/types/article.types";
import {
  articleSortOptions,
  countryFilterOptions,
  yearOptions,
} from "@/features/experiments/types/article.types";
import {
  getArticleAbstract,
  getArticleAuthorNames,
  getArticleCitationCount,
  getArticleDoi,
  getArticleJournal,
  getArticleTitle,
  getArticleYear,
  getTagNames,
} from "@/features/experiments/utils/article-format";
import {
  getJournalName,
  getJournalPublisher,
} from "@/features/laboratories/utils/journal-format";

const itemsPerPage = 10;

type ClientFilters = {
  doiSearch: string;
  authorSearch: string;
  topicSearch: string;
  openAccess: "" | "oa" | "subscription";
};

function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          className="w-full h-9 px-3 pr-8 bg-card border border-border rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

function matchesClientFilters(article: ArticleGraph, filters: ClientFilters) {
  const doi = article.article.doi ?? "";
  const authors = getArticleAuthorNames(article).join(" ").toLowerCase();
  const topicsAndKeywords = [
    ...getTagNames(article.keywords, 50),
    ...getTagNames(article.topics, 50),
  ]
    .join(" ")
    .toLowerCase();

  if (
    filters.doiSearch &&
    !doi.toLowerCase().includes(filters.doiSearch.toLowerCase())
  ) {
    return false;
  }

  if (
    filters.authorSearch &&
    !authors.includes(filters.authorSearch.toLowerCase())
  ) {
    return false;
  }

  if (
    filters.topicSearch &&
    !topicsAndKeywords.includes(filters.topicSearch.toLowerCase())
  ) {
    return false;
  }

  if (filters.openAccess === "oa" && article.journal?.isOpenAccess !== true) {
    return false;
  }

  if (
    filters.openAccess === "subscription" &&
    article.journal?.isOpenAccess === true
  ) {
    return false;
  }

  return true;
}

export default function ArticleSearch() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [bookmarkPendingIds, setBookmarkPendingIds] = useState<Set<string>>(
    new Set(),
  );

  const [sort, setSort] = useState<ArticleSort>("newest");
  const [journalId, setJournalId] = useState("");
  const [publisher, setPublisher] = useState("");
  const [country, setCountry] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [yearFrom, setYearFrom] = useState("2023");
  const [yearTo, setYearTo] = useState("2025");

  const [doiSearch, setDoiSearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [topicSearch, setTopicSearch] = useState("");
  const [openAccess, setOpenAccess] = useState<"" | "oa" | "subscription">("");

  const {
    items: journals,
    hasMore: hasMoreJournals,
    isLoadingMore: isLoadingMoreJournals,
    loadMore: loadMoreJournals,
  } = useJournals("");

  const publisherOptions = useMemo(() => {
    const values = new Set<string>();
    for (const journal of journals) {
      const name = getJournalPublisher(journal);
      if (name && name !== "—") {
        values.add(name);
      }
    }
    return [...values].sort((left, right) => left.localeCompare(right));
  }, [journals]);

  const journalOptions = useMemo(
    () =>
      [...journals]
        .map((journal) => ({
          id: journal.id,
          name: getJournalName(journal),
        }))
        .sort((left, right) => left.name.localeCompare(right.name)),
    [journals],
  );

  const apiFilters = useMemo<ArticleApiFilters>(
    () => ({
      sort,
      journalId: journalId || undefined,
      publisher: publisher || undefined,
      country: country || undefined,
      publicationYear: selectedYear || undefined,
      publicationYearFrom: selectedYear ? undefined : yearFrom || undefined,
      publicationYearTo: selectedYear ? undefined : yearTo || undefined,
    }),
    [sort, journalId, publisher, country, selectedYear, yearFrom, yearTo],
  );

  const { items, isLoading, isLoadingMore, hasMore, error, reload, loadMore } =
    useArticles(searchQuery, apiFilters);

  const filteredArticles = useMemo(
    () =>
      items.filter((article) =>
        matchesClientFilters(article, {
          doiSearch,
          authorSearch,
          topicSearch,
          openAccess,
        }),
      ),
    [items, doiSearch, authorSearch, topicSearch, openAccess],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    sort,
    journalId,
    publisher,
    country,
    selectedYear,
    yearFrom,
    yearTo,
    doiSearch,
    authorSearch,
    topicSearch,
    openAccess,
  ]);

  useEffect(() => {
    setBookmarkedIds((previous) => {
      const next = new Set(previous);
      for (const graph of items) {
        if (isLocallyBookmarked(graph.article.id)) {
          next.add(graph.article.id);
        }
      }
      return next;
    });
  }, [items]);

  const toggleBookmark = async (graph: ArticleGraph) => {
    const articleId = graph.article.id;
    if (bookmarkPendingIds.has(articleId)) {
      return;
    }

    setBookmarkPendingIds((previous) => new Set(previous).add(articleId));

    try {
      const result = await toggleBookmarkApi({
        articleId,
        article: {
          id: articleId,
          title: getArticleTitle(graph),
          abstract: graph.article.abstract,
          doi: graph.article.doi,
          publicationYear: graph.article.publicationYear,
        },
      });
      setBookmarkedIds((previous) => {
        const next = new Set(previous);
        if (result.bookmarked) {
          next.add(articleId);
        } else {
          next.delete(articleId);
        }
        return next;
      });
      void queryClient.invalidateQueries({ queryKey: bookmarksRootQueryKey });
    } catch {
      // Keep previous bookmark state if the API call fails.
    } finally {
      setBookmarkPendingIds((previous) => {
        const next = new Set(previous);
        next.delete(articleId);
        return next;
      });
    }
  };

  const clearFilters = () => {
    setSort("newest");
    setJournalId("");
    setPublisher("");
    setCountry("");
    setSelectedYear("");
    setYearFrom("2023");
    setYearTo("2025");
    setDoiSearch("");
    setAuthorSearch("");
    setTopicSearch("");
    setOpenAccess("");
  };

  const activeFilterCount =
    (sort !== "newest" ? 1 : 0) +
    (journalId ? 1 : 0) +
    (publisher ? 1 : 0) +
    (country ? 1 : 0) +
    (selectedYear ? 1 : 0) +
    (yearFrom ? 1 : 0) +
    (yearTo ? 1 : 0) +
    (doiSearch ? 1 : 0) +
    (authorSearch ? 1 : 0) +
    (topicSearch ? 1 : 0) +
    (openAccess ? 1 : 0);

  return (
    <>
      <StudentTopHeader
        searchPlaceholder="Search articles by title..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ListPageMain>
        <PageContainer
          size="wide"
          className="flex-1 min-h-0 flex flex-col gap-4 py-6"
        >
          <div className="shrink-0 space-y-4">
            <div>
              <h1 className="font-heading text-3xl text-foreground">
                Article Search
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover research articles across all disciplines
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="article-name-search"
                className="text-sm font-medium"
              >
                Search by article title
              </Label>
              <div className="relative max-w-2xl">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  strokeWidth={1.75}
                />
                <Input
                  id="article-name-search"
                  type="search"
                  placeholder="Type an article name…"
                  className="pl-10 h-11 bg-card"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex gap-8">
            {showFilters && (
              <aside className="w-72 flex-shrink-0 min-h-0">
                <Card className="p-5 border-border h-full min-h-0 flex flex-col">
                  <div className="flex items-center justify-between mb-5 shrink-0">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-muted-foreground" />
                      <h2 className="font-heading text-lg text-foreground">
                        Filters
                      </h2>
                      {activeFilterCount > 0 && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {activeFilterCount}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 px-3 text-xs text-muted-foreground"
                    >
                      Clear all
                    </Button>
                  </div>

                  <div className="space-y-5 flex-1 min-h-0 overflow-y-auto pr-1">
                    <FilterSelect
                      id="sort-filter"
                      label="Sort"
                      value={sort}
                      onChange={(value) => setSort(value as ArticleSort)}
                    >
                      {articleSortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </FilterSelect>

                    {sort === "relevant" && !searchQuery.trim() && (
                      <p className="text-xs text-muted-foreground -mt-2">
                        Relevant sort needs a search query; using newest until
                        then.
                      </p>
                    )}

                    <div className="pt-4 border-t border-border space-y-5">
                      <FilterSelect
                        id="journal-filter"
                        label="Journal"
                        value={journalId}
                        onChange={setJournalId}
                      >
                        <option value="">All journals</option>
                        {journalOptions.map((journal) => (
                          <option key={journal.id} value={journal.id}>
                            {journal.name}
                          </option>
                        ))}
                      </FilterSelect>

                      {hasMoreJournals && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-full text-xs"
                          disabled={isLoadingMoreJournals}
                          onClick={() => void loadMoreJournals()}
                        >
                          {isLoadingMoreJournals
                            ? "Loading journals…"
                            : "Load more journals"}
                        </Button>
                      )}

                      <FilterSelect
                        id="publisher-filter"
                        label="Publisher"
                        value={publisher}
                        onChange={setPublisher}
                      >
                        <option value="">All publishers</option>
                        {publisherOptions.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </FilterSelect>

                      <FilterSelect
                        id="country-filter"
                        label="Country"
                        value={country}
                        onChange={setCountry}
                      >
                        <option value="">All countries</option>
                        {countryFilterOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </FilterSelect>
                    </div>

                    <div className="pt-4 border-t border-border space-y-5">
                      <FilterSelect
                        id="year-filter"
                        label="Exact year"
                        value={selectedYear}
                        onChange={(value) => {
                          setSelectedYear(value);
                          if (value) {
                            setYearFrom("");
                            setYearTo("");
                          }
                        }}
                      >
                        <option value="">Any year</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </FilterSelect>

                      <FilterSelect
                        id="year-from-filter"
                        label="Year from"
                        value={yearFrom}
                        onChange={(value) => {
                          setYearFrom(value);
                          if (value) {
                            setSelectedYear("");
                          }
                        }}
                      >
                        <option value="">No lower bound</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </FilterSelect>

                      <FilterSelect
                        id="year-to-filter"
                        label="Year to"
                        value={yearTo}
                        onChange={(value) => {
                          setYearTo(value);
                          if (value) {
                            setSelectedYear("");
                          }
                        }}
                      >
                        <option value="">No upper bound</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </FilterSelect>

                      <FilterSelect
                        id="oa-filter"
                        label="Access"
                        value={openAccess}
                        onChange={(value) =>
                          setOpenAccess(value as "" | "oa" | "subscription")
                        }
                      >
                        <option value="">Any access</option>
                        <option value="oa">Open Access</option>
                        <option value="subscription">Subscription</option>
                      </FilterSelect>
                    </div>

                    <div className="pt-4 border-t border-border space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="doi-search"
                          className="text-sm font-semibold text-foreground"
                        >
                          DOI
                        </Label>
                        <Input
                          id="doi-search"
                          type="text"
                          placeholder="10.1038/..."
                          className="h-9"
                          value={doiSearch}
                          onChange={(event) => setDoiSearch(event.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="author-search"
                          className="text-sm font-semibold text-foreground"
                        >
                          Author
                        </Label>
                        <Input
                          id="author-search"
                          type="text"
                          placeholder="Author name"
                          className="h-9"
                          value={authorSearch}
                          onChange={(event) =>
                            setAuthorSearch(event.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="topic-search"
                          className="text-sm font-semibold text-foreground"
                        >
                          Keyword / topic
                        </Label>
                        <Input
                          id="topic-search"
                          type="text"
                          placeholder="Keyword or topic"
                          className="h-9"
                          value={topicSearch}
                          onChange={(event) =>
                            setTopicSearch(event.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </aside>
            )}

            <div className="flex-1 min-h-0 flex flex-col gap-3">
              <div className="shrink-0 flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  {isLoading ? (
                    "Loading articles..."
                  ) : (
                    <>
                      Showing{" "}
                      <span className="font-medium text-foreground">
                        {filteredArticles.length === 0
                          ? 0
                          : `${startIndex + 1}-${Math.min(endIndex, filteredArticles.length)}`}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-foreground">
                        {filteredArticles.length}
                        {hasMore ? "+" : ""}
                      </span>{" "}
                      articles
                    </>
                  )}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-9"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>

              {error && (
                <Card className="p-6 border-border shrink-0">
                  <p className="text-sm text-destructive mb-4">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void reload()}
                  >
                    Try again
                  </Button>
                </Card>
              )}

              {isLoading && <RouteDataLoading label="Loading articles…" />}

              {!isLoading && !error && currentArticles.length === 0 && (
                <Card className="p-8 border-border text-center text-muted-foreground">
                  No articles found. Try another keyword or clear your filters.
                </Card>
              )}

              <ListScrollArea className="pr-1">
                <div className="space-y-4 pb-2">
                  {currentArticles.map((article) => {
                    const articleId = article.article.id;
                    const keywords = getTagNames(article.keywords);
                    const isBookmarked = bookmarkedIds.has(articleId);

                    return (
                      <Card
                        key={articleId}
                        className="p-6 border-border hover:border-border transition-all"
                      >
                        <div className="flex gap-6">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-heading text-xl text-foreground mb-3 hover:text-primary transition-colors cursor-pointer line-clamp-2">
                              {getArticleTitle(article)}
                            </h3>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                              <span>
                                {getArticleAuthorNames(article).join(", ")}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1 min-w-0">
                                <BookOpen className="w-4 h-4 shrink-0" />
                                {article.journal?.id ? (
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      router.push(
                                        `/student/journals/${encodeURIComponent(article.journal!.id)}`,
                                      );
                                    }}
                                    className="font-medium hover:underline text-left truncate"
                                  >
                                    {getArticleJournal(article)}
                                  </button>
                                ) : (
                                  <span className="font-medium truncate">
                                    {getArticleJournal(article)}
                                  </span>
                                )}
                              </div>
                              <span className="text-border">•</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{getArticleYear(article) ?? "—"}</span>
                              </div>
                              <span className="text-border">•</span>
                              <div className="flex items-center gap-1">
                                <Quote className="w-4 h-4" />
                                <span>
                                  {getArticleCitationCount(article)} citations
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                              {getArticleAbstract(article)}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {keywords.map((keyword) => (
                                <span
                                  key={keyword}
                                  className="px-2.5 py-1 bg-accent text-tag text-xs font-medium rounded-md"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>

                            <div className="text-xs text-muted-foreground">
                              DOI: {getArticleDoi(article)}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 px-4"
                              onClick={() =>
                                router.push(`/student/articles/${articleId}`)
                              }
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Can permission="bookmark">
                              <Button
                                variant={isBookmarked ? "default" : "outline"}
                                size="sm"
                                disabled={bookmarkPendingIds.has(articleId)}
                                onClick={() => void toggleBookmark(article)}
                                className="h-9 px-4"
                              >
                                {isBookmarked ? (
                                  <>
                                    <BookmarkCheck className="w-4 h-4 mr-2" />
                                    Saved
                                  </>
                                ) : (
                                  <>
                                    <BookmarkPlus className="w-4 h-4 mr-2" />
                                    Save
                                  </>
                                )}
                              </Button>
                            </Can>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </ListScrollArea>

              {!isLoading && filteredArticles.length > 0 && (
                <div className="shrink-0 flex items-center justify-between pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className="h-9"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from(
                      { length: Math.min(totalPages, 5) },
                      (_, i) => i + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-primary text-white"
                            : "bg-card border border-border text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      isLoadingMore || (currentPage === totalPages && !hasMore)
                    }
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage((prev) => prev + 1);
                        return;
                      }

                      void loadMore().then((loaded) => {
                        if (loaded) {
                          setCurrentPage((prev) => prev + 1);
                        }
                      });
                    }}
                    className="h-9"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Loading
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </PageContainer>
      </ListPageMain>
    </>
  );
}
