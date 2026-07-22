export type GraphPaperInfo = {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  journal: string | null;
  abstract: string | null;
  /** Proxy metric from citedArticleIds length when true citation count is unavailable. */
  citationCount: number;
};

export function shortAuthorLabel(authors: string[], year: number | null) {
  const first = authors[0]?.split(" ").at(-1) ?? authors[0] ?? "Paper";
  if (year == null) {
    return first;
  }
  return `${first}, ${year}`;
}
