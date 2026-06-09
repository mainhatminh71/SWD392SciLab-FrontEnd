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
  Check,
  ExternalLink,
  Circle,
  BookOpenCheck,
  Sparkles,
  FileCheck,
  Settings,
  Mail,
  Calendar,
  X as XIcon,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";

interface NotificationCenterProps {
  onNavigate?: (view: string) => void;
}

interface Notification {
  id: string;
  category: "journal" | "topic" | "publication" | "system";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  relatedId?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    category: "publication",
    title: "New Publication in Machine Learning",
    description: "A new article matching your interests has been published: 'Advances in Neural Network Architecture Design'",
    timestamp: "2024-06-08T10:30:00",
    isRead: false,
  },
  {
    id: "2",
    category: "journal",
    title: "Nature Machine Intelligence - New Issue",
    description: "Volume 6, Issue 7 is now available with 24 new articles",
    timestamp: "2024-06-08T09:15:00",
    isRead: false,
  },
  {
    id: "3",
    category: "topic",
    title: "Trending: AI Safety & Alignment",
    description: "This topic has seen a 156% increase in publications this month",
    timestamp: "2024-06-08T08:00:00",
    isRead: false,
  },
  {
    id: "4",
    category: "publication",
    title: "Citation Alert",
    description: "Your bookmarked article 'Deep Learning for Protein Structure' has been cited 5 times",
    timestamp: "2024-06-07T16:45:00",
    isRead: true,
  },
  {
    id: "5",
    category: "journal",
    title: "Science - Special Issue Alert",
    description: "Special issue on Climate Science and Machine Learning is now available",
    timestamp: "2024-06-07T14:20:00",
    isRead: true,
  },
  {
    id: "6",
    category: "topic",
    title: "CRISPR Technology Updates",
    description: "12 new articles published in your followed topic this week",
    timestamp: "2024-06-07T11:30:00",
    isRead: true,
  },
  {
    id: "7",
    category: "system",
    title: "Weekly Digest Ready",
    description: "Your personalized weekly research digest for June 1-7 is ready to view",
    timestamp: "2024-06-07T09:00:00",
    isRead: true,
  },
  {
    id: "8",
    category: "publication",
    title: "Recommended for You",
    description: "Based on your interests: 'Quantum Computing Applications in Drug Discovery'",
    timestamp: "2024-06-06T15:10:00",
    isRead: true,
  },
  {
    id: "9",
    category: "system",
    title: "Profile Verification Complete",
    description: "Your academic profile has been verified successfully",
    timestamp: "2024-06-06T10:00:00",
    isRead: true,
  },
];

export default function NotificationCenter({ onNavigate }: NotificationCenterProps) {
  const [activeNav, setActiveNav] = useState("notifications");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notificationPreference, setNotificationPreference] = useState("daily");

  const sidebarItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "journals", icon: BookOpen, label: "Journals" },
    { id: "articles", icon: FileText, label: "Articles" },
    { id: "trends", icon: TrendingUp, label: "Trend Analysis" },
    { id: "bookmarks", icon: Bookmark, label: "Bookmarks" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  const categories = [
    { id: "all", label: "All Notifications", icon: Bell },
    { id: "journal", label: "Followed Journals", icon: BookOpenCheck },
    { id: "topic", label: "Followed Topics", icon: Sparkles },
    { id: "publication", label: "New Publications", icon: FileCheck },
    { id: "system", label: "System", icon: Settings },
  ];

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
    if (onNavigate) {
      onNavigate(navId);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return then.toLocaleDateString();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "journal":
        return BookOpenCheck;
      case "topic":
        return Sparkles;
      case "publication":
        return FileCheck;
      case "system":
        return Settings;
      default:
        return Bell;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "journal":
        return { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-600" };
      case "topic":
        return { bg: "bg-purple-50", text: "text-purple-700", icon: "text-purple-600" };
      case "publication":
        return { bg: "bg-green-50", text: "text-green-700", icon: "text-green-600" };
      case "system":
        return { bg: "bg-gray-50", text: "text-gray-700", icon: "text-gray-600" };
      default:
        return { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-600" };
    }
  };

  const filteredNotifications =
    selectedCategory === "all"
      ? notifications
      : notifications.filter((n) => n.category === selectedCategory);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <Bell className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-gray-900 truncate">Notifications</h1>
                <p className="text-xs text-gray-500 truncate">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
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
          <div className="flex h-full">
            {/* Notification Feed */}
            <div className="flex-1 p-8 overflow-auto">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Actions Bar */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            isActive
                              ? "bg-primary text-white shadow-sm"
                              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden lg:inline">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={handleMarkAllAsRead}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark All Read
                    </Button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="space-y-2">
                  {filteredNotifications.length === 0 ? (
                    <Card className="p-12 border-gray-200 bg-white">
                      <div className="text-center max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bell className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                        <p className="text-sm text-gray-600">
                          You're all caught up! Check back later for new updates.
                        </p>
                      </div>
                    </Card>
                  ) : (
                    filteredNotifications.map((notification) => {
                      const Icon = getCategoryIcon(notification.category);
                      const colors = getCategoryColor(notification.category);

                      return (
                        <Card
                          key={notification.id}
                          className={`p-5 border-gray-200 hover:border-gray-300 transition-all ${
                            notification.isRead ? "bg-white" : "bg-blue-50/50 border-l-4 border-l-primary"
                          }`}
                        >
                          <div className="flex gap-4">
                            {/* Icon */}
                            <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${colors.icon}`} strokeWidth={2} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-1">
                                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                  {notification.title}
                                  {!notification.isRead && (
                                    <Circle className="w-2 h-2 fill-primary text-primary flex-shrink-0" />
                                  )}
                                </h3>
                                <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                                  {getTimeAgo(notification.timestamp)}
                                </span>
                              </div>

                              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                {notification.description}
                              </p>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                {!notification.isRead && (
                                  <button
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    Mark as read
                                  </button>
                                )}
                                <button className="text-xs text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1">
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  View details
                                </button>
                                <button
                                  onClick={() => handleDeleteNotification(notification.id)}
                                  className="text-xs text-gray-500 hover:text-red-600 font-medium flex items-center gap-1 ml-auto"
                                >
                                  <XIcon className="w-3.5 h-3.5" />
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Preferences Sidebar */}
            <aside className="w-80 bg-white border-l border-gray-200 p-6 overflow-auto">
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-1">
                    Notification Preferences
                  </h2>
                  <p className="text-sm text-gray-600">
                    Choose how you want to receive updates
                  </p>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      notificationPreference === "in-app"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="notifications"
                      value="in-app"
                      checked={notificationPreference === "in-app"}
                      onChange={(e) => setNotificationPreference(e.target.value)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Bell className="w-4 h-4 text-gray-700 flex-shrink-0" />
                        <p className="text-sm font-semibold text-gray-900">In-App Only</p>
                      </div>
                      <p className="text-xs text-gray-600">
                        Receive notifications only within SciLab
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      notificationPreference === "daily"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="notifications"
                      value="daily"
                      checked={notificationPreference === "daily"}
                      onChange={(e) => setNotificationPreference(e.target.value)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4 text-gray-700 flex-shrink-0" />
                        <p className="text-sm font-semibold text-gray-900">Daily Email</p>
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded flex-shrink-0">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Get a daily digest of important updates
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      notificationPreference === "weekly"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="notifications"
                      value="weekly"
                      checked={notificationPreference === "weekly"}
                      onChange={(e) => setNotificationPreference(e.target.value)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-700 flex-shrink-0" />
                        <p className="text-sm font-semibold text-gray-900">Weekly Email</p>
                      </div>
                      <p className="text-xs text-gray-600">
                        Receive a weekly summary every Monday
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      notificationPreference === "disabled"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="notifications"
                      value="disabled"
                      checked={notificationPreference === "disabled"}
                      onChange={(e) => setNotificationPreference(e.target.value)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <XIcon className="w-4 h-4 text-gray-700 flex-shrink-0" />
                        <p className="text-sm font-semibold text-gray-900">Disable All</p>
                      </div>
                      <p className="text-xs text-gray-600">
                        Turn off all notification emails
                      </p>
                    </div>
                  </label>
                </div>

                <Button className="w-full h-10">
                  <Check className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>

                {/* Stats */}
                <Card className="p-4 border-gray-200 bg-slate-50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Activity Summary</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Unread</span>
                      <span className="font-semibold text-gray-900">{unreadCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total</span>
                      <span className="font-semibold text-gray-900">{notifications.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">This Week</span>
                      <span className="font-semibold text-gray-900">
                        {notifications.filter((n) => {
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return new Date(n.timestamp) > weekAgo;
                        }).length}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
