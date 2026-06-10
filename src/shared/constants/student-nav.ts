import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Bookmark,
  BookOpen,
  FileText,
  LayoutDashboard,
  TrendingUp,
  User,
} from "lucide-react";

export interface StudentNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const STUDENT_NAV_ITEMS: StudentNavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { id: "journals", label: "Journals", href: "/student/journals", icon: BookOpen },
  { id: "articles", label: "Articles", href: "/student/articles", icon: FileText },
  { id: "trends", label: "Trend Analysis", href: "/student/trends", icon: TrendingUp },
  { id: "bookmarks", label: "Bookmarks", href: "/student/bookmarks", icon: Bookmark },
  { id: "notifications", label: "Notifications", href: "/student/notifications", icon: Bell },
  { id: "profile", label: "Profile", href: "/student/profile", icon: User },
];

export function getStudentNavHref(navId: string): string {
  return STUDENT_NAV_ITEMS.find((item) => item.id === navId)?.href ?? "/student/dashboard";
}
