"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

interface StudentTopHeaderProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function StudentTopHeader({
  searchPlaceholder = "Search journals, articles, topics...",
  searchValue,
  onSearchChange,
}: StudentTopHeaderProps) {
  return (
    <header className="h-16 bg-card border-b border-border px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="pl-10 h-10 bg-background"
            value={searchValue}
            onChange={
              onSearchChange ? (event) => onSearchChange(event.target.value) : undefined
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/student/notifications"
          className="relative p-2 hover:bg-accent rounded-[var(--radius-button)] transition-colors"
        >
          <Bell className="w-5 h-5 text-muted-foreground" strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Link>

        <Link
          href="/student/profile"
          className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center"
        >
          <span className="text-sm font-medium text-tag">JS</span>
        </Link>
      </div>
    </header>
  );
}
