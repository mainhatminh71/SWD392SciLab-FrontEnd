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
  ChevronRight,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Clock,
  Hash,
  Layers,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import JournalSearch from "@/features/laboratories/components/JournalSearch";
import JournalDetail from "@/features/laboratories/components/JournalDetail";
import ArticleSearch from "@/features/experiments/components/ArticleSearch";
import ArticleDetail from "@/features/experiments/components/ArticleDetail";
import TrendAnalysis from "@/features/reports/components/TrendAnalysis";
import ProfileManagement from "@/features/auth/components/ProfileManagement";
import BookmarkCenter from "@/features/submissions/components/BookmarkCenter";
import NotificationCenter from "@/features/notifications/components/NotificationCenter";
import {
  activityData,
  publicationGrowthData,
  recentJournals,
  recentPublications,
  trendingTopics,
} from "@/features/dashboard/api/mockDashboardData";

export default function Dashboard() {
  const [isLoading] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const sidebarItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "journals", icon: BookOpen, label: "Journals" },
    { id: "articles", icon: FileText, label: "Articles" },
    { id: "trends", icon: TrendingUp, label: "Trend Analysis" },
    { id: "bookmarks", icon: Bookmark, label: "Bookmarks" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  if (selectedArticleId) {
    return (
      <ArticleDetail
        onNavigate={(view) => {
          setSelectedArticleId(null);
          setActiveNav(view);
        }}
      />
    );
  }

  if (selectedJournalId) {
    return (
      <JournalDetail
        onNavigate={(view) => {
          setSelectedJournalId(null);
          setActiveNav(view);
        }}
      />
    );
  }

  if (activeNav === "journals") {
    return (
      <JournalSearch
        onNavigate={(view) => setActiveNav(view)}
        onViewJournal={(journalId) => setSelectedJournalId(journalId)}
      />
    );
  }

  if (activeNav === "articles") {
    return (
      <ArticleSearch
        onNavigate={(view) => setActiveNav(view)}
        onViewArticle={(articleId) => setSelectedArticleId(articleId)}
      />
    );
  }

  if (activeNav === "trends") {
    return <TrendAnalysis onNavigate={(view) => setActiveNav(view)} />;
  }

  if (activeNav === "profile") {
    return <ProfileManagement onNavigate={(view) => setActiveNav(view)} />;
  }

  if (activeNav === "bookmarks") {
    return (
      <BookmarkCenter
        onNavigate={(view) => setActiveNav(view)}
        onViewArticle={(articleId) => setSelectedArticleId(articleId)}
      />
    );
  }

  if (activeNav === "notifications") {
    return <NotificationCenter onNavigate={(view) => setActiveNav(view)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 mx-auto">
            <Atom className="w-9 h-9 text-white animate-spin" strokeWidth={2.5} />
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
                onClick={() => setActiveNav(item.id)}
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
            onClick={() => setActiveNav("profile")}
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
          <div className="flex-1 max-w-xl">
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
              onClick={() => setActiveNav("profile")}
            >
              <span className="text-white text-sm font-medium">JS</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, Dr. Smith. Here's your research overview.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">Total Journals</p>
                    <p className="text-3xl font-bold text-gray-900">1,247</p>
                  </div>
                  <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <ArrowUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">12.5%</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </Card>

              <Card className="p-6 border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">Total Articles</p>
                    <p className="text-3xl font-bold text-gray-900">52,384</p>
                  </div>
                  <div className="w-11 h-11 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <ArrowUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">8.3%</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </Card>

              <Card className="p-6 border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">Top Keywords</p>
                    <p className="text-3xl font-bold text-gray-900">3,892</p>
                  </div>
                  <div className="w-11 h-11 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Hash className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <ArrowUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">15.2%</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </Card>

              <Card className="p-6 border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">Subject Areas</p>
                    <p className="text-3xl font-bold text-gray-900">284</p>
                  </div>
                  <div className="w-11 h-11 bg-teal-50 rounded-lg flex items-center justify-center">
                    <Layers className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <ArrowDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">2.1%</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </Card>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Publication Growth Chart */}
              <Card className="p-6 border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Publication Growth</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Monthly publication trends</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    12 Months
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={publicationGrowthData}>
                    <defs>
                      <linearGradient id="publicationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop key="gradient-start" offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3} />
                        <stop key="gradient-end" offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid key="grid-pub" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      key="xaxis-pub"
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <YAxis
                      key="yaxis-pub"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      key="tooltip-pub"
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "8px 12px",
                      }}
                    />
                    <Area
                      key="area-pub"
                      type="monotone"
                      dataKey="publications"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth={2}
                      fill="url(#publicationGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Research Activity Timeline */}
              <Card className="p-6 border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Research Activity Timeline</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Articles published by time of day</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    Today
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={activityData}>
                    <CartesianGrid key="grid-activity" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      key="xaxis-activity"
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <YAxis
                      key="yaxis-activity"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <Tooltip
                      key="tooltip-activity"
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "8px 12px",
                      }}
                    />
                    <Bar key="bar-activity" dataKey="articles" fill="rgb(99, 102, 241)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Trending Topics */}
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Trending Research Topics</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Most active research areas this week</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-primary">
                  View All
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>

              <div className="space-y-4">
                {trendingTopics.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-900">{item.topic}</span>
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                            item.trend === "up"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {item.trend === "up" ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          )}
                          {Math.abs(item.change)}%
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${(item.count / trendingTopics[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 font-medium min-w-[60px] text-right">
                          {item.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Secondary Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recently Updated Journals */}
              <Card className="p-6 border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recently Updated Journals</h3>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentJournals.map((journal, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{journal.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">{journal.articles} articles</span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{journal.lastUpdate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium">{journal.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Publications */}
              <Card className="p-6 border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Publications</h3>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentPublications.map((publication, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {publication.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{publication.journal}</span>
                        <span className="text-gray-300">•</span>
                        <span>{publication.time}</span>
                        <span className="text-gray-300">•</span>
                        <span>{publication.citations} citations</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
