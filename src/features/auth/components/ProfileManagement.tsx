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
  Upload,
  Camera,
  Check,
  X,
  Eye,
  EyeOff,
  Monitor,
  MapPin,
  Calendar,
  Shield,
  Mail,
  Globe,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";

interface ProfileManagementProps {
  onNavigate?: (view: string) => void;
}

export default function ProfileManagement({ onNavigate }: ProfileManagementProps) {
  const [activeNav, setActiveNav] = useState("profile");
  const [activeTab, setActiveTab] = useState("personal");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notificationPreference, setNotificationPreference] = useState("daily");

  // Form states
  const [firstName, setFirstName] = useState("Jane");
  const [lastName, setLastName] = useState("Smith");
  const [dateOfBirth, setDateOfBirth] = useState("1985-06-15");
  const [gender, setGender] = useState("female");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const sidebarItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "journals", icon: BookOpen, label: "Journals" },
    { id: "articles", icon: FileText, label: "Articles" },
    { id: "trends", icon: TrendingUp, label: "Trend Analysis" },
    { id: "bookmarks", icon: Bookmark, label: "Bookmarks" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  const sessions = [
    {
      device: "Chrome on macOS",
      location: "San Francisco, CA",
      ip: "192.168.1.1",
      lastActive: "Active now",
      current: true,
    },
    {
      device: "Chrome on Windows",
      location: "New York, NY",
      ip: "192.168.1.2",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      device: "Safari on iPhone",
      location: "Boston, MA",
      ip: "192.168.1.3",
      lastActive: "1 day ago",
      current: false,
    },
  ];

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
    if (onNavigate) {
      onNavigate(navId);
    }
  };

  const handleSavePersonalInfo = () => {
    // Save personal information
    console.log("Saving personal info...");
  };

  const handleChangePassword = () => {
    // Change password logic
    console.log("Changing password...");
  };

  const handleDisconnectGoogle = () => {
    // Disconnect Google account
    console.log("Disconnecting Google...");
  };

  const handleRevokeSession = (index: number) => {
    // Revoke session
    console.log(`Revoking session ${index}...`);
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
          <div className="max-w-5xl mx-auto px-8 py-12">
            {/* Profile Header */}
            <div className="mb-8">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-3xl font-bold">JS</span>
                  </div>
                  <button className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="min-w-0">
                      <h1 className="text-3xl font-bold text-gray-900 mb-1">Dr. Jane Smith</h1>
                      <p className="text-base text-gray-600 mb-3">jane.smith@uni.edu</p>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg border border-blue-200">
                          Researcher
                        </span>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-lg border border-green-200">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`pb-4 px-1 text-sm font-medium transition-colors relative ${
                    activeTab === "personal"
                      ? "text-primary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Personal Information
                  {activeTab === "personal" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`pb-4 px-1 text-sm font-medium transition-colors relative ${
                    activeTab === "account"
                      ? "text-primary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Account Settings
                  {activeTab === "account" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`pb-4 px-1 text-sm font-medium transition-colors relative ${
                    activeTab === "notifications"
                      ? "text-primary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Notification Preferences
                  {activeTab === "notifications" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <Card className="p-6 border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="text-sm font-medium">
                          First Name
                        </Label>
                        <Input
                          id="first-name"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="text-sm font-medium">
                          Last Name
                        </Label>
                        <Input
                          id="last-name"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="h-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="dob" className="text-sm font-medium">
                          Date of Birth
                        </Label>
                        <Input
                          id="dob"
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium">
                          Gender
                        </Label>
                        <select
                          id="gender"
                          className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Picture</h2>

                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white text-2xl font-bold">JS</span>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-3">
                        Upload a new profile picture. Recommended size: 400x400px.
                      </p>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="h-9">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                        <Button variant="ghost" size="sm" className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" size="sm" className="h-10 px-4">
                    Cancel
                  </Button>
                  <Button size="sm" className="h-10 px-4" onClick={handleSavePersonalInfo}>
                    <Check className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-6">
                <Card className="p-6 border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>

                  <div className="space-y-5 max-w-xl">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-sm font-medium">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="h-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-sm font-medium">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="h-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-sm font-medium">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button size="sm" className="h-10" onClick={handleChangePassword}>
                      Update Password
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Connected Accounts</h2>

                  <div className="max-w-xl">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                          <Globe className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Google Account</p>
                          <p className="text-xs text-gray-500">jane.smith@gmail.com</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                        onClick={handleDisconnectGoogle}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Active Sessions</h2>

                  <div className="space-y-3">
                    {sessions.map((session, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 flex-shrink-0">
                            {session.device.includes("Chrome") ? (
                              <Globe className="w-5 h-5 text-gray-700" />
                            ) : (
                              <Monitor className="w-5 h-5 text-gray-700" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {session.device}
                              </p>
                              {session.current && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded flex-shrink-0">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {session.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                {session.ip}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {session.lastActive}
                              </span>
                            </div>
                          </div>
                        </div>
                        {!session.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-4"
                            onClick={() => handleRevokeSession(index)}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card className="p-6 border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Email Notifications</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Choose how you want to receive notifications about new publications, trends, and updates.
                  </p>

                  <div className="space-y-3 max-w-2xl">
                    <label
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
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
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Bell className="w-4 h-4 text-gray-700 flex-shrink-0" />
                          <p className="text-sm font-semibold text-gray-900">In-App Only</p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Receive notifications only within the SciLab application. No emails will be sent.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
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
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="w-4 h-4 text-gray-700 flex-shrink-0" />
                          <p className="text-sm font-semibold text-gray-900">Daily Email Digest</p>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded flex-shrink-0">
                            Recommended
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Get a daily summary of new publications, trending topics, and personalized recommendations.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
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
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-700 flex-shrink-0" />
                          <p className="text-sm font-semibold text-gray-900">Weekly Email Digest</p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Receive a weekly roundup every Monday with highlights from the past week.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
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
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <X className="w-4 h-4 text-gray-700 flex-shrink-0" />
                          <p className="text-sm font-semibold text-gray-900">Disable Notifications</p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Turn off all notifications. You can still check updates manually in the app.
                        </p>
                      </div>
                    </label>
                  </div>
                </Card>

                <Card className="p-6 border-gray-200 bg-blue-50 border-blue-200">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-blue-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-blue-900 mb-1">Notification Categories</h3>
                      <p className="text-sm text-blue-700 mb-3">
                        You'll receive notifications for the following events based on your selected preference:
                      </p>
                      <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                        <li>New publications in your followed topics</li>
                        <li>Trending research areas in your field</li>
                        <li>Citations of bookmarked articles</li>
                        <li>Updates from followed journals</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" size="sm" className="h-10 px-4">
                    Cancel
                  </Button>
                  <Button size="sm" className="h-10 px-4">
                    <Check className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
