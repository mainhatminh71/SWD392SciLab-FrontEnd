"use client";

import { useState } from "react";
import {
  Atom,
  Search,
  Filter,
  X,
  ChevronDown,
  Globe,
  BookOpen,
  TrendingUp,
  Award,
  Lock,
  LockOpen,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  LayoutDashboard,
  FileText,
  Bookmark,
  Bell,
  User,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";

interface Journal {
  id: string;
  name: string;
  issn: string;
  publisher: string;
  subjects: string[];
  ranking: {
    metric: string;
    value: string;
    quartile: "Q1" | "Q2" | "Q3" | "Q4";
  };
  openAccess: boolean;
  oaDiamond: boolean;
  country: string;
  citations: number;
  articles: number;
}

const mockJournals: Journal[] = [
  {
    id: "1",
    name: "Nature Machine Intelligence",
    issn: "2522-5839",
    publisher: "Nature Publishing Group",
    subjects: ["Artificial Intelligence", "Machine Learning", "Computer Science"],
    ranking: { metric: "Impact Factor", value: "25.898", quartile: "Q1" },
    openAccess: false,
    oaDiamond: false,
    country: "United Kingdom",
    citations: 12543,
    articles: 234,
  },
  {
    id: "2",
    name: "PLOS Computational Biology",
    issn: "1553-7358",
    publisher: "Public Library of Science",
    subjects: ["Computational Biology", "Bioinformatics", "Systems Biology"],
    ranking: { metric: "Impact Factor", value: "4.428", quartile: "Q1" },
    openAccess: true,
    oaDiamond: true,
    country: "United States",
    citations: 9876,
    articles: 456,
  },
  {
    id: "3",
    name: "Journal of Climate Science",
    issn: "0894-8755",
    publisher: "American Meteorological Society",
    subjects: ["Climate Science", "Meteorology", "Environmental Science"],
    ranking: { metric: "Impact Factor", value: "5.215", quartile: "Q1" },
    openAccess: false,
    oaDiamond: false,
    country: "United States",
    citations: 8234,
    articles: 389,
  },
  {
    id: "4",
    name: "Quantum Science and Technology",
    issn: "2058-9565",
    publisher: "IOP Publishing",
    subjects: ["Quantum Computing", "Quantum Physics", "Applied Physics"],
    ranking: { metric: "Impact Factor", value: "6.568", quartile: "Q1" },
    openAccess: true,
    oaDiamond: false,
    country: "United Kingdom",
    citations: 7456,
    articles: 178,
  },
  {
    id: "5",
    name: "Genome Biology",
    issn: "1474-760X",
    publisher: "BioMed Central",
    subjects: ["Genomics", "Molecular Biology", "Genetics"],
    ranking: { metric: "Impact Factor", value: "17.906", quartile: "Q1" },
    openAccess: true,
    oaDiamond: false,
    country: "United Kingdom",
    citations: 6789,
    articles: 312,
  },
  {
    id: "6",
    name: "Neural Networks",
    issn: "0893-6080",
    publisher: "Elsevier",
    subjects: ["Neural Networks", "Deep Learning", "Artificial Intelligence"],
    ranking: { metric: "Impact Factor", value: "9.657", quartile: "Q1" },
    openAccess: false,
    oaDiamond: false,
    country: "Netherlands",
    citations: 5678,
    articles: 267,
  },
  {
    id: "7",
    name: "Environmental Research Letters",
    issn: "1748-9326",
    publisher: "IOP Publishing",
    subjects: ["Environmental Science", "Climate Change", "Sustainability"],
    ranking: { metric: "Impact Factor", value: "6.793", quartile: "Q2" },
    openAccess: true,
    oaDiamond: false,
    country: "United Kingdom",
    citations: 4892,
    articles: 523,
  },
  {
    id: "8",
    name: "Materials Science and Engineering",
    issn: "0921-5093",
    publisher: "Elsevier",
    subjects: ["Materials Science", "Engineering", "Nanotechnology"],
    ranking: { metric: "Impact Factor", value: "6.044", quartile: "Q2" },
    openAccess: false,
    oaDiamond: false,
    country: "Netherlands",
    citations: 3456,
    articles: 678,
  },
];

const subjectAreas = [
  "Artificial Intelligence",
  "Machine Learning",
  "Climate Science",
  "Computational Biology",
  "Quantum Computing",
  "Genomics",
  "Environmental Science",
  "Materials Science",
];

const countries = ["United States", "United Kingdom", "Netherlands", "Germany", "China", "Japan"];

const publishers = [
  "Nature Publishing Group",
  "Elsevier",
  "Springer",
  "Wiley",
  "Public Library of Science",
  "IOP Publishing",
  "BioMed Central",
];

const rankingMetrics = ["Impact Factor", "CiteScore", "h-Index", "SJR"];

interface JournalSearchProps {
  onNavigate?: (view: string) => void;
  onViewJournal?: (journalId: string) => void;
}

export default function JournalSearch({ onNavigate, onViewJournal }: JournalSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");
  const [activeNav, setActiveNav] = useState("journals");

  const sidebarItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "journals", icon: BookOpen, label: "Journals" },
    { id: "articles", icon: FileText, label: "Articles" },
    { id: "trends", icon: TrendingUp, label: "Trend Analysis" },
    { id: "bookmarks", icon: Bookmark, label: "Bookmarks" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  const [filters, setFilters] = useState({
    subjectAreas: [] as string[],
    countries: [] as string[],
    publishers: [] as string[],
    rankingMetrics: [] as string[],
    openAccess: false,
    oaDiamond: false,
  });

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
    if (onNavigate) {
      onNavigate(navId);
    }
  };

  const itemsPerPage = 8;
  const totalPages = Math.ceil(mockJournals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJournals = mockJournals.slice(startIndex, endIndex);

  const handleFilterChange = (category: string, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[category as keyof typeof prev] as string[];
      const isSelected = currentValues.includes(value);

      return {
        ...prev,
        [category]: isSelected
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      subjectAreas: [],
      countries: [],
      publishers: [],
      rankingMetrics: [],
      openAccess: false,
      oaDiamond: false,
    });
  };

  const activeFilterCount =
    filters.subjectAreas.length +
    filters.countries.length +
    filters.publishers.length +
    filters.rankingMetrics.length +
    (filters.openAccess ? 1 : 0) +
    (filters.oaDiamond ? 1 : 0);

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
                placeholder="Search by journal name, ISSN, subject area, or publisher..."
                className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
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
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Journal Search</h1>
              <p className="text-gray-500 mt-1">Discover academic journals across all disciplines</p>
            </div>

            <div className="flex gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <aside className="w-72 flex-shrink-0">
                <Card className="p-6 border-gray-200 sticky top-0">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    {activeFilterCount > 0 && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 px-3 text-xs text-gray-600"
                  >
                    Clear all
                  </Button>
                </div>

                <div className="space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                  {/* Subject Area */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Subject Area</h3>
                    <div className="space-y-2">
                      {subjectAreas.slice(0, 5).map((subject) => (
                        <div key={subject} className="flex items-center gap-2">
                          <Checkbox
                            id={`subject-${subject}`}
                            checked={filters.subjectAreas.includes(subject)}
                            onCheckedChange={() => handleFilterChange("subjectAreas", subject)}
                          />
                          <Label
                            htmlFor={`subject-${subject}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {subject}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Country */}
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Country</h3>
                    <div className="space-y-2">
                      {countries.slice(0, 5).map((country) => (
                        <div key={country} className="flex items-center gap-2">
                          <Checkbox
                            id={`country-${country}`}
                            checked={filters.countries.includes(country)}
                            onCheckedChange={() => handleFilterChange("countries", country)}
                          />
                          <Label
                            htmlFor={`country-${country}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {country}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Publisher */}
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Publisher</h3>
                    <div className="space-y-2">
                      {publishers.slice(0, 5).map((publisher) => (
                        <div key={publisher} className="flex items-center gap-2">
                          <Checkbox
                            id={`publisher-${publisher}`}
                            checked={filters.publishers.includes(publisher)}
                            onCheckedChange={() => handleFilterChange("publishers", publisher)}
                          />
                          <Label
                            htmlFor={`publisher-${publisher}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {publisher}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ranking Metric */}
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Ranking Metric</h3>
                    <div className="space-y-2">
                      {rankingMetrics.map((metric) => (
                        <div key={metric} className="flex items-center gap-2">
                          <Checkbox
                            id={`metric-${metric}`}
                            checked={filters.rankingMetrics.includes(metric)}
                            onCheckedChange={() => handleFilterChange("rankingMetrics", metric)}
                          />
                          <Label
                            htmlFor={`metric-${metric}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {metric}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Open Access */}
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Access Type</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="open-access"
                          checked={filters.openAccess}
                          onCheckedChange={(checked) =>
                            setFilters({ ...filters, openAccess: checked as boolean })
                          }
                        />
                        <Label htmlFor="open-access" className="text-sm text-gray-700 cursor-pointer">
                          Open Access
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="oa-diamond"
                          checked={filters.oaDiamond}
                          onCheckedChange={(checked) =>
                            setFilters({ ...filters, oaDiamond: checked as boolean })
                          }
                        />
                        <Label htmlFor="oa-diamond" className="text-sm text-gray-700 cursor-pointer">
                          OA Diamond
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
                </Card>
              </aside>
            )}

            {/* Results Area */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-9"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </Button>
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium text-gray-900">{startIndex + 1}-{Math.min(endIndex, mockJournals.length)}</span> of{" "}
                    <span className="font-medium text-gray-900">{mockJournals.length}</span> journals
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Button variant="outline" size="sm" className="h-9">
                    <ArrowUpDown className="w-3.5 h-3.5 mr-2" />
                    {sortBy === "relevance" ? "Relevance" : sortBy}
                    <ChevronDown className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Journal Cards */}
              <div className="space-y-4">
                {currentJournals.map((journal) => (
                  <Card
                    key={journal.id}
                    onClick={() => onViewJournal && onViewJournal(journal.id)}
                    className="p-6 border-gray-200 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                  >
                    <div className="flex gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Journal Name and Badges */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary transition-colors line-clamp-1">
                              {journal.name}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                              <span className="flex-shrink-0">ISSN: {journal.issn}</span>
                              <span className="text-gray-300 flex-shrink-0">•</span>
                              <span className="truncate max-w-[200px]">{journal.publisher}</span>
                              <span className="text-gray-300 flex-shrink-0">•</span>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Globe className="w-3.5 h-3.5" />
                                <span>{journal.country}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {journal.openAccess && (
                              <div className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md flex items-center gap-1">
                                <LockOpen className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Open Access</span>
                              </div>
                            )}
                            {journal.oaDiamond && (
                              <div className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md flex items-center gap-1">
                                <Award className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">OA Diamond</span>
                              </div>
                            )}
                            {!journal.openAccess && (
                              <div className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Subscription</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Subject Categories */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {journal.subjects.slice(0, 3).map((subject) => (
                            <span
                              key={subject}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                            >
                              {subject}
                            </span>
                          ))}
                          {journal.subjects.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              +{journal.subjects.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Metrics */}
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div
                              className={`px-3 py-1.5 rounded-lg font-bold text-sm ${
                                journal.ranking.quartile === "Q1"
                                  ? "bg-green-100 text-green-800"
                                  : journal.ranking.quartile === "Q2"
                                  ? "bg-blue-100 text-blue-800"
                                  : journal.ranking.quartile === "Q3"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {journal.ranking.quartile}
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">{journal.ranking.metric}</p>
                              <p className="text-sm font-semibold text-gray-900">{journal.ranking.value}</p>
                            </div>
                          </div>

                          <div className="h-8 w-px bg-gray-200" />

                          <div className="flex items-center gap-1 text-gray-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm">
                              <span className="font-semibold text-gray-900">{journal.citations.toLocaleString()}</span>{" "}
                              citations
                            </span>
                          </div>

                          <div className="h-8 w-px bg-gray-200" />

                          <div className="flex items-center gap-1 text-gray-600">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-sm">
                              <span className="font-semibold text-gray-900">{journal.articles.toLocaleString()}</span>{" "}
                              articles
                            </span>
                          </div>
                        </div>
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
