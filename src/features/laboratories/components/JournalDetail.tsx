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
  LockOpen,
  Lock,
  Award,
  Globe,
  Calendar,
  Users,
  BarChart3,
  ExternalLink,
  Plus,
  Check,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const publicationTrendData = [
  { year: "2019", publications: 420 },
  { year: "2020", publications: 480 },
  { year: "2021", publications: 550 },
  { year: "2022", publications: 620 },
  { year: "2023", publications: 680 },
  { year: "2024", publications: 720 },
];

const rankingHistoryData = [
  { year: "2019", impactFactor: 3.2, quartile: 2 },
  { year: "2020", impactFactor: 3.8, quartile: 2 },
  { year: "2021", impactFactor: 4.1, quartile: 1 },
  { year: "2022", impactFactor: 4.3, quartile: 1 },
  { year: "2023", impactFactor: 4.4, quartile: 1 },
  { year: "2024", impactFactor: 4.428, quartile: 1 },
];

const recentPublications = [
  {
    id: "1",
    title: "Machine Learning Applications in Genomic Data Analysis: A Comprehensive Review",
    authors: ["Zhang, L.", "Kumar, R.", "Smith, J."],
    date: "2024-05-15",
    citations: 23,
    doi: "10.1371/journal.pcbi.1011234",
  },
  {
    id: "2",
    title: "Deep Neural Networks for Protein Structure Prediction",
    authors: ["Anderson, M.", "Lee, S.", "Williams, K."],
    date: "2024-05-10",
    citations: 45,
    doi: "10.1371/journal.pcbi.1011223",
  },
  {
    id: "3",
    title: "Computational Methods for Drug Discovery: Recent Advances",
    authors: ["Chen, Y.", "Brown, A.", "Davis, R."],
    date: "2024-05-05",
    citations: 67,
    doi: "10.1371/journal.pcbi.1011212",
  },
  {
    id: "4",
    title: "Systems Biology Approaches to Understanding Complex Diseases",
    authors: ["Martinez, E.", "Taylor, J.", "Wilson, C."],
    date: "2024-04-28",
    citations: 34,
    doi: "10.1371/journal.pcbi.1011201",
  },
  {
    id: "5",
    title: "Bioinformatics Tools for Next-Generation Sequencing Data",
    authors: ["Robinson, P.", "Garcia, M.", "Thompson, L."],
    date: "2024-04-20",
    citations: 56,
    doi: "10.1371/journal.pcbi.1011190",
  },
];

interface JournalDetailProps {
  onNavigate?: (view: string) => void;
}

export default function JournalDetail({ onNavigate }: JournalDetailProps) {
  const [activeNav, setActiveNav] = useState("journals");
  const [isFollowing, setIsFollowing] = useState(false);

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
                placeholder="Search journals, articles, topics..."
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
        <main className="flex-1 overflow-auto">
          {/* Hero Section */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-[1400px] mx-auto px-8 py-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate && onNavigate("journals")}
                className="mb-6 -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journals
              </Button>

              <div className="flex gap-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        PLOS Computational Biology
                      </h1>
                      <div className="flex items-center gap-4 text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">ISSN:</span>
                          <span className="text-sm">1553-7358</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Public Library of Science</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <span className="text-sm">United States</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`h-10 px-6 ${
                        isFollowing
                          ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                          : "bg-primary text-white hover:bg-primary/90"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                      <LockOpen className="w-4 h-4" />
                      Open Access
                    </div>
                    <div className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                      <Award className="w-4 h-4" />
                      OA Diamond
                    </div>
                    <div className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-bold">
                      Q1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="max-w-[1400px] mx-auto px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Analytics */}
              <div className="lg:col-span-2 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-6">
                  <Card className="p-6 border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Impact Factor</p>
                        <p className="text-2xl font-bold text-gray-900">4.428</p>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 font-medium">+12.5% from last year</p>
                  </Card>

                  <Card className="p-6 border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Articles</p>
                        <p className="text-2xl font-bold text-gray-900">3,842</p>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 font-medium">+245 this year</p>
                  </Card>

                  <Card className="p-6 border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Followers</p>
                        <p className="text-2xl font-bold text-gray-900">12.4K</p>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 font-medium">+8.3% this month</p>
                  </Card>
                </div>

                {/* Publication Trend */}
                <Card className="p-6 border-gray-200">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Publication Trend</h2>
                    <p className="text-sm text-gray-500 mt-1">Annual publication volume over time</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={publicationTrendData}>
                      <defs>
                        <linearGradient id="pubGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop key="pub-start" offset="5%" stopColor="rgb(99, 102, 241)" stopOpacity={0.3} />
                          <stop key="pub-end" offset="95%" stopColor="rgb(99, 102, 241)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid key="grid-pub-trend" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis
                        key="xaxis-pub-trend"
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                      />
                      <YAxis
                        key="yaxis-pub-trend"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                      />
                      <Tooltip
                        key="tooltip-pub-trend"
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          padding: "8px 12px",
                        }}
                      />
                      <Area
                        key="area-pub-trend"
                        type="monotone"
                        dataKey="publications"
                        stroke="rgb(99, 102, 241)"
                        strokeWidth={2}
                        fill="url(#pubGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>

                {/* Ranking History */}
                <Card className="p-6 border-gray-200">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Ranking History</h2>
                    <p className="text-sm text-gray-500 mt-1">Impact factor progression</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={rankingHistoryData}>
                      <CartesianGrid key="grid-ranking" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis
                        key="xaxis-ranking"
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                      />
                      <YAxis
                        key="yaxis-ranking"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                      />
                      <Tooltip
                        key="tooltip-ranking"
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          padding: "8px 12px",
                        }}
                      />
                      <Line
                        key="line-ranking"
                        type="monotone"
                        dataKey="impactFactor"
                        stroke="rgb(34, 197, 94)"
                        strokeWidth={3}
                        dot={{ fill: "rgb(34, 197, 94)", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Recent Publications */}
                <Card className="p-6 border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Recent Publications</h2>
                      <p className="text-sm text-gray-500 mt-1">Latest research articles</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      View All
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {recentPublications.map((pub) => (
                      <div
                        key={pub.id}
                        className="p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                      >
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                          {pub.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <span>{pub.authors.slice(0, 3).join(", ")}</span>
                          {pub.authors.length > 3 && <span>et al.</span>}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(pub.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                            <span>{pub.citations} citations</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right Column - Information */}
              <div className="space-y-6">
                {/* About */}
                <Card className="p-6 border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Description</p>
                      <p className="text-gray-700 leading-relaxed">
                        PLOS Computational Biology features works of exceptional significance that further our
                        understanding of living systems at all scales through the application of computational
                        methods.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Subject Categories */}
                <Card className="p-6 border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject Categories</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      Computational Biology
                    </span>
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      Bioinformatics
                    </span>
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      Systems Biology
                    </span>
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      Genomics
                    </span>
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      Machine Learning
                    </span>
                  </div>
                </Card>

                {/* Coverage */}
                <Card className="p-6 border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Coverage</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">First Published</span>
                      <span className="text-gray-900 font-medium">2005</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Frequency</span>
                      <span className="text-gray-900 font-medium">Monthly</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Language</span>
                      <span className="text-gray-900 font-medium">English</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Publisher Type</span>
                      <span className="text-gray-900 font-medium">Non-profit</span>
                    </div>
                  </div>
                </Card>

                {/* Indexing */}
                <Card className="p-6 border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Indexed In</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-gray-700">PubMed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-gray-700">Web of Science</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-gray-700">Scopus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-gray-700">Google Scholar</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
