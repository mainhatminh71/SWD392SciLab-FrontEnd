"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Atom } from "lucide-react";
import { APP_NAME } from "@/shared/constants/app";
import { STUDENT_NAV_ITEMS } from "@/shared/constants/student-nav";

interface StudentShellProps {
  children: React.ReactNode;
}

export default function StudentShell({ children }: StudentShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border flex flex-col shadow-ambient">
        <div className="h-16 px-6 flex items-center gap-3 border-b border-border">
          <div className="w-9 h-9 bg-primary rounded-[var(--radius-button)] flex items-center justify-center">
            <Atom className="w-5 h-5 text-primary-foreground" strokeWidth={1.75} />
          </div>
          <span className="font-heading text-xl text-foreground">{APP_NAME}</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {STUDENT_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-button)] transition-all ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.75} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            href="/student/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-card)] hover:bg-accent transition-colors"
          >
            <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-tag">JS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Dr. Jane Smith</p>
              <p className="text-xs text-muted-foreground truncate">jane.smith@uni.edu</p>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}
