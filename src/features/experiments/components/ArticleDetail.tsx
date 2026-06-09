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
  ArrowLeft,
  BookmarkPlus,
  BookmarkCheck,
  ExternalLink,
  Calendar,
  Quote,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";

interface ArticleDetailProps {
  onNavigate?: (view: string) => void;
}

export default function ArticleDetail({ onNavigate }: ArticleDetailProps) {
  const [activeNav, setActiveNav] = useState("articles");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

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

  const copyCitation = () => {
    const citation = "Zhang, L., Kumar, R., Smith, J., & Anderson, M. (2024). Deep Learning Approaches for Protein Structure Prediction: AlphaFold and Beyond. Nature Machine Intelligence, 6(4), 234-256. https://doi.org/10.1038/s42256-024-00789-1";
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

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
                placeholder="Search articles, journals, topics..."
                className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white"
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
        <main className="flex-1 overflow-auto bg-white">
          <div className="max-w-4xl mx-auto px-8 py-12">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate && onNavigate("articles")}
              className="mb-8 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>

            {/* Article Header */}
            <article className="space-y-8">
              {/* Title */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  Deep Learning Approaches for Protein Structure Prediction: AlphaFold and Beyond
                </h1>

                {/* Authors */}
                <div className="flex items-center gap-2 text-lg text-gray-700 mb-4">
                  <span className="font-medium">Li Zhang</span>
                  <span className="text-gray-400">•</span>
                  <span className="font-medium">Raj Kumar</span>
                  <span className="text-gray-400">•</span>
                  <span className="font-medium">John Smith</span>
                  <span className="text-gray-400">•</span>
                  <span className="font-medium">Maria Anderson</span>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-base text-gray-600 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Nature Machine Intelligence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>May 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Quote className="w-5 h-5 text-gray-400" />
                    <span>245 citations</span>
                  </div>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="flex items-center gap-3 pb-8 border-b border-gray-200">
                <Button
                  variant={isBookmarked ? "default" : "outline"}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="h-10"
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 mr-2" />
                      Bookmarked
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4 mr-2" />
                      Bookmark
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="h-10"
                  onClick={() => window.open("https://doi.org/10.1038/s42256-024-00789-1", "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open DOI
                </Button>
              </div>

              {/* Abstract */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Abstract</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-gray-800 leading-relaxed">
                    Recent advances in deep learning have revolutionized protein structure prediction. We present a
                    comprehensive review of state-of-the-art methods, focusing on AlphaFold2 and its successors. Our
                    analysis covers the architectural innovations, training methodologies, and practical applications
                    that have enabled near-atomic accuracy in structure prediction.
                  </p>
                  <p className="text-lg text-gray-800 leading-relaxed mt-4">
                    We examine the key components of modern deep learning architectures, including attention mechanisms,
                    evolutionary coupling analysis, and multi-sequence alignment processing. The integration of these
                    techniques has dramatically improved prediction accuracy, reducing the median error from several
                    angstroms to sub-angstrom precision for many protein families.
                  </p>
                  <p className="text-lg text-gray-800 leading-relaxed mt-4">
                    Our review also discusses the limitations of current approaches, including challenges with
                    multi-domain proteins, membrane proteins, and intrinsically disordered regions. We propose future
                    directions for improving prediction accuracy and computational efficiency, with particular emphasis
                    on incorporating experimental constraints and developing more robust validation frameworks.
                  </p>
                </div>
              </section>

              {/* Keywords */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Keywords</h2>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 text-base font-medium rounded-lg">
                    Deep Learning
                  </span>
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 text-base font-medium rounded-lg">
                    Protein Structure
                  </span>
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 text-base font-medium rounded-lg">
                    AlphaFold
                  </span>
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 text-base font-medium rounded-lg">
                    Structural Biology
                  </span>
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 text-base font-medium rounded-lg">
                    Machine Learning
                  </span>
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 text-base font-medium rounded-lg">
                    Computational Biology
                  </span>
                </div>
              </section>

              {/* Topics */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Research Topics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Primary Topic</h3>
                    <p className="text-base text-gray-700">Computational Structural Biology</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Field of Study</h3>
                    <p className="text-base text-gray-700">Bioinformatics</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Methodology</h3>
                    <p className="text-base text-gray-700">Neural Networks</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Application</h3>
                    <p className="text-base text-gray-700">Drug Discovery</p>
                  </div>
                </div>
              </section>

              {/* Citation Information */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Citation</h2>
                <Card className="p-6 bg-slate-50 border-gray-200">
                  <div className="space-y-4">
                    {/* APA Format */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">APA Format</p>
                      <p className="text-base text-gray-800 font-mono leading-relaxed">
                        Zhang, L., Kumar, R., Smith, J., & Anderson, M. (2024). Deep Learning Approaches for
                        Protein Structure Prediction: AlphaFold and Beyond. <em>Nature Machine Intelligence</em>,
                        6(4), 234-256. https://doi.org/10.1038/s42256-024-00789-1
                      </p>
                    </div>

                    {/* DOI */}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">DOI</p>
                      <div className="flex items-center gap-3">
                        <code className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-base text-gray-800 font-mono">
                          10.1038/s42256-024-00789-1
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyCitation}
                          className="h-10 px-4"
                        >
                          {copiedCitation ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Publication Info */}
                    <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Volume</p>
                        <p className="text-base text-gray-800">6</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Issue</p>
                        <p className="text-base text-gray-800">4</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Pages</p>
                        <p className="text-base text-gray-800">234-256</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Publisher</p>
                        <p className="text-base text-gray-800">Nature Publishing Group</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Article Metrics */}
              <section className="space-y-4 pb-12">
                <h2 className="text-2xl font-bold text-gray-900">Metrics</h2>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-6 border-gray-200 text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">245</p>
                    <p className="text-sm text-gray-600">Citations</p>
                  </Card>
                  <Card className="p-6 border-gray-200 text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">1,234</p>
                    <p className="text-sm text-gray-600">Readers</p>
                  </Card>
                  <Card className="p-6 border-gray-200 text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">89</p>
                    <p className="text-sm text-gray-600">Recommendations</p>
                  </Card>
                </div>
              </section>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}
