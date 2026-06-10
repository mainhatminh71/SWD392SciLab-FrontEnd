"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Shield } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/shared/constants/admin-nav";
import PageContainer from "@/shared/components/layout/PageContainer";

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  headerAction?: React.ReactNode;
}

export default function AdminShell({
  children,
  title,
  subtitle,
  icon,
  headerAction,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border flex flex-col shadow-ambient">
        <div className="h-16 px-6 flex items-center gap-3 border-b border-border">
          <div className="w-9 h-9 bg-primary rounded-[var(--radius-button)] flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" strokeWidth={1.75} />
          </div>
          <div>
            <span className="font-heading text-lg text-foreground">SciLab</span>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-button)] transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
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
          <div className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-card)] bg-surface-raised">
            <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-tag">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@scilab.com</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-[var(--radius-button)] transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-primary/15 rounded-[var(--radius-card)] flex items-center justify-center flex-shrink-0 text-primary">
              {icon}
            </div>
            <div className="min-w-0">
              <h1 className="font-heading text-lg text-foreground truncate">{title}</h1>
              {subtitle ? (
                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
              ) : null}
            </div>
          </div>
          {headerAction ? <div className="flex-shrink-0">{headerAction}</div> : null}
        </header>

        <main className="flex-1 overflow-auto py-8">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}
