"use client";

import { useState } from "react";
import {
  Atom,
  LayoutDashboard,
  BookOpen,
  FileText,
  TrendingUp,
  Bookmark,
  Bell,
  User,
  Search,
  Filter,
  X,
  ChevronDown,
  Calendar,
  Quote,
  ExternalLink,
  BookmarkPlus,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";

interface Article {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  keywords: string[];
  abstract: string;
  citations: number;
  isBookmarked: boolean;
}

const mockArticles: Article[] = [
  {
    id: "1",
    title: "Deep Learning Approaches for Protein Structure Prediction: AlphaFold and Beyond",
    authors: ["Zhang, L.", "Kumar, R.", "Smith, J.", "Anderson, M."],
    journal: "Nature Machine Intelligence",
    year: 2024,
    doi: "10.1038/s42256-024-00789-1",
    keywords: ["Deep Learning", "Protein Structure", "AlphaFold", "Structural Biology"],
    abstract: "Recent advances in deep learning have revolutionized protein structure prediction. We present a comprehensive review of state-of-the-art methods, focusing on AlphaFold2 and its successors. Our analysis covers the architectural innovations, training methodologies, and practical applications that have enabled near-atomic accuracy in structure prediction. We also discuss the limitations of current approaches and propose future directions for improving prediction accuracy and computational efficiency.",
    citations: 245,
    isBookmarked: false,
  },
  {
    id: "2",
    title: "Machine Learning Applications in Genomic Data Analysis: A Systematic Review",
    authors: ["Chen, Y.", "Williams, K.", "Martinez, E."],
    journal: "PLOS Computational Biology",
    year: 2024,
    doi: "10.1371/journal.pcbi.1011234",
    keywords: ["Machine Learning", "Genomics", "Bioinformatics", "Data Analysis"],
    abstract: "The exponential growth of genomic data has necessitated the development of sophisticated computational tools for analysis and interpretation. This systematic review examines machine learning applications across various domains of genomic research, including variant calling, gene expression analysis, and genome assembly. We evaluate the performance of different ML algorithms and provide recommendations for practitioners seeking to apply these methods to their own datasets.",
    citations: 189,
    isBookmarked: true,
  },
  {
    id: "3",
    title: "CRISPR-Cas9 Gene Editing: Recent Advances and Clinical Applications",
    authors: ["Brown, A.", "Taylor, J.", "Davis, R.", "Wilson, C.", "Thompson, L."],
    journal: "Cell Reports",
    year: 2023,
    doi: "10.1016/j.celrep.2023.112456",
    keywords: ["CRISPR", "Gene Editing", "Therapeutics", "Clinical Trials"],
    abstract: "CRISPR-Cas9 technology has transformed the landscape of genetic engineering and therapeutic development. This review discusses recent technological improvements, including base editing and prime editing, as well as the current state of clinical trials employing CRISPR-based therapies. We highlight successes in treating genetic disorders and discuss the challenges that remain in translating this technology to widespread clinical use.",
    citations: 567,
    isBookmarked: false,
  },
  {
    id: "4",
    title: "Computational Methods for Drug Discovery: From Virtual Screening to Clinical Trials",
    authors: ["Lee, S.", "Robinson, P.", "Garcia, M."],
    journal: "Journal of Medicinal Chemistry",
    year: 2023,
    doi: "10.1021/acs.jmedchem.3c00123",
    keywords: ["Drug Discovery", "Virtual Screening", "Computational Chemistry", "Clinical Trials"],
    abstract: "Modern drug discovery increasingly relies on computational methods to identify and optimize therapeutic candidates. This comprehensive review covers the full pipeline from virtual screening and molecular docking to pharmacokinetic modeling and clinical trial design. We present case studies of successful computational drug discovery projects and discuss best practices for integrating computational and experimental approaches.",
    citations: 423,
    isBookmarked: false,
  },
  {
    id: "5",
    title: "Single-Cell RNA Sequencing: Technologies, Analysis Methods, and Applications",
    authors: ["Anderson, M.", "White, K.", "Harris, J."],
    journal: "Nature Biotechnology",
    year: 2023,
    doi: "10.1038/s41587-023-01234-5",
    keywords: ["Single-Cell", "RNA-Seq", "Transcriptomics", "Cell Biology"],
    abstract: "Single-cell RNA sequencing has emerged as a powerful tool for understanding cellular heterogeneity and function. This review discusses the latest technological platforms, computational analysis pipelines, and biological applications of scRNA-seq. We provide guidance on experimental design, quality control, and data interpretation, along with examples of how scRNA-seq has advanced our understanding of development, disease, and therapeutic responses.",
    citations: 834,
    isBookmarked: true,
  },
  {
    id: "6",
    title: "Artificial Intelligence in Medical Imaging: Opportunities and Challenges",
    authors: ["Johnson, R.", "Miller, S.", "Clark, D.", "Lewis, A."],
    journal: "Radiology",
    year: 2024,
    doi: "10.1148/radiol.2024231234",
    keywords: ["AI", "Medical Imaging", "Deep Learning", "Diagnostics"],
    abstract: "Artificial intelligence is transforming medical imaging through improved detection, diagnosis, and treatment planning. This article reviews the current state of AI in radiology, pathology, and other imaging modalities. We examine successful clinical implementations, discuss regulatory considerations, and address the challenges of bias, interpretability, and integration into clinical workflows.",
    citations: 312,
    isBookmarked: false,
  },
];

const yearOptions = ["2024", "2023", "2022", "2021", "2020", "2019"];

interface ArticleSearchProps {
  onNavigate?: (view: string) => void;
  onViewArticle?: (articleId: string) => void;
}

export default function ArticleSearch({ onNavigate, onViewArticle }: ArticleSearchProps) {
  const [activeNav, setActiveNav] = useState("articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [doiSearch, setDoiSearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [journalSearch, setJournalSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [articles, setArticles] = useState(mockArticles);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const sidebarItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "journals", icon: BookOpen, label: "Journals" },
    { id: "articles", icon: FileText, label: "Articles" },
    { id: "trends", icon: TrendingUp, label: "Trend Analysis" },
    { id: "bookmarks", icon: Bookmark, label: "Bookmarks" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
    if (onNavigate) {
      onNavigate(navId);
    }
  };

  const toggleBookmark = (articleId: string) => {
    setArticles(
      articles.map((article) =>
        article.id === articleId ? { ...article, isBookmarked: !article.isBookmarked } : article
      )
    );
  };

  const clearFilters = () => {
    setDoiSearch("");
    setAuthorSearch("");
    setJournalSearch("");
    setSelectedYear("");
  };

  const activeFilterCount =
    (doiSearch ? 1 : 0) +
    (authorSearch ? 1 : 0) +
    (journalSearch ? 1 : 0) +
    (selectedYear ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-gray-200">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/20">
            <Atom className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">SciLab</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onNavigate && onNavigate("profile")}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Dr. Jane Smith</p>
              <p className="text-xs text-gray-500 truncate">jane.smith@uni.edu</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search articles by keyword, title, or topic..."
                className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div
              className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onNavigate && onNavigate("profile")}
            >
              <span className="text-white text-sm font-medium">JS</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Article Search</h1>
                <p className="text-gray-500 mt-1">Discover research articles across all disciplines</p>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-10"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? "Hide Filters" : "Advanced Filters"}
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <Card className="p-6 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Advanced Filters</h2>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doi-search" className="text-sm font-medium">
                      DOI
                    </Label>
                    <Input
                      id="doi-search"
                      type="text"
                      placeholder="10.1038/..."
                      className="h-9"
                      value={doiSearch}
                      onChange={(e) => setDoiSearch(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author-search" className="text-sm font-medium">
                      Author
                    </Label>
                    <Input
                      id="author-search"
                      type="text"
                      placeholder="Author name"
                      className="h-9"
                      value={authorSearch}
                      onChange={(e) => setAuthorSearch(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="journal-search" className="text-sm font-medium">
                      Journal
                    </Label>
                    <Input
                      id="journal-search"
                      type="text"
                      placeholder="Journal name"
                      className="h-9"
                      value={journalSearch}
                      onChange={(e) => setJournalSearch(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year-filter" className="text-sm font-medium">
                      Year
                    </Label>
                    <div className="relative">
                      <select
                        id="year-filter"
                        className="w-full h-9 px-3 pr-8 bg-white border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                      >
                        <option value="">All years</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">{startIndex + 1}-{Math.min(endIndex, articles.length)}</span> of{" "}
                <span className="font-medium text-gray-900">{articles.length}</span> articles
              </p>
            </div>

            {/* Article Cards */}
            <div className="space-y-4">
              {currentArticles.map((article) => (
                <Card
                  key={article.id}
                  className="p-6 border-gray-200 hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <div className="flex gap-6">
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary transition-colors cursor-pointer line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Authors */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span>
                          {article.authors.slice(0, 3).join(", ")}
                          {article.authors.length > 3 && " et al."}
                        </span>
                      </div>

                      {/* Journal & Year */}
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span className="font-medium">{article.journal}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{article.year}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <Quote className="w-4 h-4" />
                          <span>{article.citations} citations</span>
                        </div>
                      </div>

                      {/* Abstract Preview */}
                      <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">
                        {article.abstract}
                      </p>

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.keywords.slice(0, 4).map((keyword) => (
                          <span
                            key={keyword}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md"
                          >
                            {keyword}
                          </span>
                        ))}
                        {article.keywords.length > 4 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                            +{article.keywords.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* DOI */}
                      <div className="text-xs text-gray-500">
                        DOI: {article.doi}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4"
                        onClick={() => onViewArticle && onViewArticle(article.id)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant={article.isBookmarked ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleBookmark(article.id)}
                        className="h-9 px-4"
                      >
                        {article.isBookmarked ? (
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
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="h-9"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="h-9"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
