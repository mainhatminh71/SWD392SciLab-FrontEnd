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
  ExternalLink,
  Trash2,
  Calendar,
  Quote,
  ChevronDown,
  BookmarkX,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";

interface BookmarkCenterProps {
  onNavigate?: (view: string) => void;
  onViewArticle?: (articleId: string) => void;
}

interface BookmarkedArticle {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  keywords: string[];
  dateBookmarked: string;
  doi: string;
}

const mockBookmarks: BookmarkedArticle[] = [
  {
    id: "1",
    title: "Deep Learning Approaches for Protein Structure Prediction: AlphaFold and Beyond",
    authors: ["Zhang, L.", "Kumar, R.", "Smith, J.", "Anderson, M."],
    journal: "Nature Machine Intelligence",
    year: 2024,
    keywords: ["Deep Learning", "Protein Structure", "AlphaFold", "Structural Biology"],
    dateBookmarked: "2024-06-05",
    doi: "10.1038/s42256-024-00789-1",
  },
  {
    id: "2",
    title: "Machine Learning Applications in Genomic Data Analysis: A Systematic Review",
    authors: ["Chen, Y.", "Williams, K.", "Martinez, E."],
    journal: "PLOS Computational Biology",
    year: 2024,
    keywords: ["Machine Learning", "Genomics", "Bioinformatics", "Data Analysis"],
    dateBookmarked: "2024-06-03",
    doi: "10.1371/journal.pcbi.1011234",
  },
  {
    id: "3",
    title: "Single-Cell RNA Sequencing: Technologies, Analysis Methods, and Applications",
    authors: ["Anderson, M.", "White, K.", "Harris, J."],
    journal: "Nature Biotechnology",
    year: 2023,
    keywords: ["Single-Cell", "RNA-Seq", "Transcriptomics", "Cell Biology"],
    dateBookmarked: "2024-06-01",
    doi: "10.1038/s41587-023-01234-5",
  },
  {
    id: "4",
    title: "Artificial Intelligence in Medical Imaging: Opportunities and Challenges",
    authors: ["Johnson, R.", "Miller, S.", "Clark, D.", "Lewis, A."],
    journal: "Radiology",
    year: 2024,
    keywords: ["AI", "Medical Imaging", "Deep Learning", "Diagnostics"],
    dateBookmarked: "2024-05-28",
    doi: "10.1148/radiol.2024231234",
  },
  {
    id: "5",
    title: "CRISPR-Cas9 Gene Editing: Recent Advances and Clinical Applications",
    authors: ["Brown, A.", "Taylor, J.", "Davis, R.", "Wilson, C.", "Thompson, L."],
    journal: "Cell Reports",
    year: 2023,
    keywords: ["CRISPR", "Gene Editing", "Therapeutics", "Clinical Trials"],
    dateBookmarked: "2024-05-25",
    doi: "10.1016/j.celrep.2023.112456",
  },
  {
    id: "6",
    title: "Computational Methods for Drug Discovery: From Virtual Screening to Clinical Trials",
    authors: ["Lee, S.", "Robinson, P.", "Garcia, M."],
    journal: "Journal of Medicinal Chemistry",
    year: 2023,
    keywords: ["Drug Discovery", "Virtual Screening", "Computational Chemistry"],
    dateBookmarked: "2024-05-20",
    doi: "10.1021/acs.jmedchem.3c00123",
  },
];

const journalOptions = ["All Journals", "Nature Machine Intelligence", "PLOS Computational Biology", "Nature Biotechnology", "Cell Reports", "Radiology"];
const yearOptions = ["All Years", "2024", "2023", "2022", "2021"];
const topicOptions = ["All Topics", "Machine Learning", "AI", "CRISPR", "Genomics", "Medical Imaging"];

export default function BookmarkCenter({ onNavigate, onViewArticle }: BookmarkCenterProps) {
  const [activeNav, setActiveNav] = useState("bookmarks");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJournal, setSelectedJournal] = useState("All Journals");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [authorFilter, setAuthorFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarks, setBookmarks] = useState(mockBookmarks);

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

  const handleRemoveBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  };

  const handleOpenArticle = (id: string) => {
    if (onViewArticle) {
      onViewArticle(id);
    }
  };

  const clearFilters = () => {
    setSelectedJournal("All Journals");
    setSelectedYear("All Years");
    setSelectedTopic("All Topics");
    setAuthorFilter("");
  };

  const activeFilterCount =
    (selectedJournal !== "All Journals" ? 1 : 0) +
    (selectedYear !== "All Years" ? 1 : 0) +
    (selectedTopic !== "All Topics" ? 1 : 0) +
    (authorFilter ? 1 : 0);

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch = searchQuery
      ? bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    const matchesJournal = selectedJournal === "All Journals" || bookmark.journal === selectedJournal;
    const matchesYear = selectedYear === "All Years" || bookmark.year.toString() === selectedYear;
    const matchesTopic =
      selectedTopic === "All Topics" ||
      bookmark.keywords.some((k) => k.toLowerCase().includes(selectedTopic.toLowerCase()));
    const matchesAuthor = authorFilter
      ? bookmark.authors.some((a) => a.toLowerCase().includes(authorFilter.toLowerCase()))
      : true;

    return matchesSearch && matchesJournal && matchesYear && matchesTopic && matchesAuthor;
  });

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                <Bookmark className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-gray-900 truncate">Bookmark Center</h1>
                <p className="text-xs text-gray-500 truncate">Your research library</p>
              </div>
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
            {/* Stats & Search Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{filteredBookmarks.length}</p>
                    <p className="text-sm text-gray-600">Saved Articles</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search bookmarks by title or keywords..."
                    className="pl-10 h-11 bg-white border-gray-200 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-11 px-4"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <Card className="p-6 border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900 truncate">Filter Options</h2>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs flex-shrink-0">
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {/* Journal Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="journal-filter" className="text-sm font-medium">
                      Journal
                    </Label>
                    <div className="relative">
                      <select
                        id="journal-filter"
                        className="w-full h-10 px-3 pr-8 bg-white border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                        value={selectedJournal}
                        onChange={(e) => setSelectedJournal(e.target.value)}
                      >
                        {journalOptions.map((journal) => (
                          <option key={journal} value={journal}>
                            {journal}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Year Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="year-filter" className="text-sm font-medium">
                      Year
                    </Label>
                    <div className="relative">
                      <select
                        id="year-filter"
                        className="w-full h-10 px-3 pr-8 bg-white border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                      >
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Topic Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="topic-filter" className="text-sm font-medium">
                      Topic
                    </Label>
                    <div className="relative">
                      <select
                        id="topic-filter"
                        className="w-full h-10 px-3 pr-8 bg-white border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                      >
                        {topicOptions.map((topic) => (
                          <option key={topic} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Author Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="author-filter" className="text-sm font-medium">
                      Author
                    </Label>
                    <Input
                      id="author-filter"
                      type="text"
                      placeholder="Author name..."
                      className="h-10"
                      value={authorFilter}
                      onChange={(e) => setAuthorFilter(e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Empty State */}
            {filteredBookmarks.length === 0 && (
              <Card className="p-12 border-gray-200 bg-white">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookmarkX className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks found</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    {searchQuery || activeFilterCount > 0
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "Start building your research library by bookmarking articles that interest you."}
                  </p>
                  {(searchQuery || activeFilterCount > 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        clearFilters();
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {/* Bookmark Cards */}
            {filteredBookmarks.length > 0 && (
              <div className="space-y-4">
                {filteredBookmarks.map((bookmark) => (
                  <Card
                    key={bookmark.id}
                    className="p-6 border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all bg-white"
                  >
                    <div className="flex gap-6">
                      {/* Bookmark Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bookmark className="w-6 h-6 text-amber-600 fill-amber-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h3
                          className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary transition-colors cursor-pointer line-clamp-2"
                          onClick={() => handleOpenArticle(bookmark.id)}
                        >
                          {bookmark.title}
                        </h3>

                        {/* Authors */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <span className="truncate">
                            {bookmark.authors.slice(0, 3).join(", ")}
                            {bookmark.authors.length > 3 && " et al."}
                          </span>
                        </div>

                        {/* Journal & Year */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium truncate">{bookmark.journal}</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>{bookmark.year}</span>
                          </div>
                        </div>

                        {/* Keywords */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {bookmark.keywords.slice(0, 4).map((keyword) => (
                            <span
                              key={keyword}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md"
                            >
                              {keyword}
                            </span>
                          ))}
                          {bookmark.keywords.length > 4 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                              +{bookmark.keywords.length - 4} more
                            </span>
                          )}
                        </div>

                        {/* Date Bookmarked */}
                        <div className="text-xs text-gray-500">
                          Bookmarked on {new Date(bookmark.dateBookmarked).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 px-4"
                          onClick={() => handleOpenArticle(bookmark.id)}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 px-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveBookmark(bookmark.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
