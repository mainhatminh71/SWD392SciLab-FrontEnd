"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Shield } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/shared/constants/admin-nav";

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
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex flex-col">
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-700">
          <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center shadow-sm shadow-purple-600/20">
            <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">SciLab</span>
            <p className="text-xs text-purple-300 font-medium">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-purple-600 text-white font-medium shadow-sm"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-700/50">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">admin@scilab.com</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
              {subtitle ? (
                <p className="text-xs text-gray-500 truncate">{subtitle}</p>
              ) : null}
            </div>
          </div>
          {headerAction ? <div className="flex-shrink-0">{headerAction}</div> : null}
        </header>

        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
