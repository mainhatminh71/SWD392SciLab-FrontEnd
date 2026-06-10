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
import PageContainer from "@/shared/components/layout/PageContainer";
import {
  activityData,
  publicationGrowthData,
  recentJournals,
  recentPublications,
  trendingTopics,
} from "@/features/dashboard/api/mockDashboardData";

const CHART_PRIMARY = "#D3AB9E";
const CHART_TEAL = "#3AC9C1";

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-[var(--radius-card)] flex items-center justify-center mx-auto">
            <Atom className="w-9 h-9 text-primary-foreground animate-spin" strokeWidth={1.75} />
          </div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const chartTooltipStyle = {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "8px 12px",
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shadow-ambient">
        <div className="h-16 px-6 flex items-center gap-3 border-b border-border">
          <div className="w-9 h-9 bg-primary rounded-[var(--radius-button)] flex items-center justify-center">
            <Atom className="w-5 h-5 text-primary-foreground" strokeWidth={1.75} />
          </div>
          <span className="font-heading text-xl text-foreground">ScholarTrend</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-button)] transition-all ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.75} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-card)] hover:bg-accent cursor-pointer transition-colors"
            onClick={() => setActiveNav("profile")}
          >
            <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-tag">JS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Dr. Jane Smith</p>
              <p className="text-xs text-muted-foreground truncate">jane.smith@uni.edu</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-card border-b border-border px-8 flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={1.75} />
              <Input
                type="search"
                placeholder="Search journals, articles, topics..."
                className="pl-10 h-10 bg-background"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-accent rounded-[var(--radius-button)] transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" strokeWidth={1.75} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>

            <div
              className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => setActiveNav("profile")}
            >
              <span className="text-sm font-medium text-tag">JS</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto py-8">
          <PageContainer size="wide" className="space-y-8">
            <div>
              <h1 className="font-heading text-3xl text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, Dr. Smith. Here&apos;s your research overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Journals</p>
                    <p className="font-heading text-3xl text-foreground">1,247</p>
                  </div>
                  <div className="w-11 h-11 bg-accent rounded-[var(--radius-card)] flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <ArrowUp className="w-4 h-4 text-teal" strokeWidth={1.75} />
                  <span className="text-sm text-teal">12.5%</span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Articles</p>
                    <p className="font-heading text-3xl text-foreground">52,384</p>
                  </div>
                  <div className="w-11 h-11 bg-accent rounded-[var(--radius-card)] flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <ArrowUp className="w-4 h-4 text-teal" strokeWidth={1.75} />
                  <span className="text-sm text-teal">8.3%</span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Top Keywords</p>
                    <p className="font-heading text-3xl text-foreground">3,892</p>
                  </div>
                  <div className="w-11 h-11 bg-accent rounded-[var(--radius-card)] flex items-center justify-center">
                    <Hash className="w-6 h-6 text-primary" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <ArrowUp className="w-4 h-4 text-teal" strokeWidth={1.75} />
                  <span className="text-sm text-teal">15.2%</span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Subject Areas</p>
                    <p className="font-heading text-3xl text-foreground">284</p>
                  </div>
                  <div className="w-11 h-11 bg-accent rounded-[var(--radius-card)] flex items-center justify-center">
                    <Layers className="w-6 h-6 text-teal" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <ArrowDown className="w-4 h-4 text-destructive" strokeWidth={1.75} />
                  <span className="text-sm text-destructive">2.1%</span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-heading text-lg text-foreground">Publication Growth</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Monthly publication trends</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    <Clock className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.75} />
                    12 Months
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={publicationGrowthData}>
                    <CartesianGrid key="grid-pub" strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                      key="xaxis-pub"
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <YAxis
                      key="yaxis-pub"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip key="tooltip-pub" contentStyle={chartTooltipStyle} />
                    <Area
                      key="area-pub"
                      type="monotone"
                      dataKey="publications"
                      stroke={CHART_PRIMARY}
                      strokeWidth={2}
                      fill={CHART_PRIMARY}
                      fillOpacity={0.15}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-heading text-lg text-foreground">Research Activity Timeline</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Articles published by time of day</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    Today
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={activityData}>
                    <CartesianGrid key="grid-activity" strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                      key="xaxis-activity"
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <YAxis
                      key="yaxis-activity"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <Tooltip key="tooltip-activity" contentStyle={chartTooltipStyle} />
                    <Bar key="bar-activity" dataKey="articles" fill={CHART_TEAL} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading text-lg text-foreground">Trending Research Topics</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Most active research areas this week</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-tag">
                  View All
                  <ChevronRight className="w-3.5 h-3.5 ml-1" strokeWidth={1.75} />
                </Button>
              </div>

              <div className="space-y-4">
                {trendingTopics.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-foreground">{item.topic}</span>
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-button)] text-xs ${
                            item.trend === "up"
                              ? "bg-teal/10 text-teal"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {item.trend === "up" ? (
                            <ArrowUp className="w-3 h-3" strokeWidth={1.75} />
                          ) : (
                            <ArrowDown className="w-3 h-3" strokeWidth={1.75} />
                          )}
                          {Math.abs(item.change)}%
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-surface-raised rounded-full h-2">
                          <div
                            className="bg-teal rounded-full h-2 transition-all"
                            style={{ width: `${(item.count / trendingTopics[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground min-w-[60px] text-right">
                          {item.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-lg text-foreground">Recently Updated Journals</h3>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <MoreHorizontal className="w-4 h-4" strokeWidth={1.75} />
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentJournals.map((journal, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-[var(--radius-card)] hover:bg-accent transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-primary rounded-[var(--radius-card)] flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-primary-foreground" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{journal.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{journal.articles} articles</span>
                          <span className="text-xs text-border">•</span>
                          <span className="text-xs text-muted-foreground">{journal.lastUpdate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-teal">
                        <ArrowUp className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span className="text-sm">{journal.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-lg text-foreground">Recent Publications</h3>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <MoreHorizontal className="w-4 h-4" strokeWidth={1.75} />
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentPublications.map((publication, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-[var(--radius-card)] hover:bg-accent transition-colors cursor-pointer"
                    >
                      <p className="text-sm text-foreground mb-1 line-clamp-2">
                        {publication.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{publication.journal}</span>
                        <span className="text-border">•</span>
                        <span>{publication.time}</span>
                        <span className="text-border">•</span>
                        <span>{publication.citations} citations</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </PageContainer>
        </main>
      </div>
    </div>
  );
}
