"use client";

import Link from "next/link";
import { useState } from "react";
import { RefreshCw, Rss, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import PageContainer from "@/shared/components/layout/PageContainer";
import StudentTopHeader from "@/shared/components/layout/StudentTopHeader";
import { RouteDataLoading } from "@/shared/components/layout/RouteDataLoading";
import { useFollows } from "@/features/follows/hooks/use-follows";
import type {
  FollowItem,
  FollowObjectType,
} from "@/features/follows/types/follow.types";

const typeOptions: Array<{ value: "ALL" | FollowObjectType; label: string }> = [
  { value: "ALL", label: "All follows" },
  { value: "AUTHOR", label: "Authors" },
  { value: "JOURNAL", label: "Journals" },
  { value: "KEYWORD", label: "Keywords" },
  { value: "TOPIC", label: "Topics" },
];

export default function FollowList() {
  const [type, setType] = useState<"ALL" | FollowObjectType>("ALL");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const follows = useFollows({ page, type: type === "ALL" ? undefined : type });

  const changeType = (value: "ALL" | FollowObjectType) => {
    setType(value);
    setPage(1);
    setActionError(null);
  };

  const runAction = async (key: string, action: () => Promise<unknown>) => {
    setPending(key);
    setActionError(null);
    try {
      await action();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to update this follow.",
      );
    } finally {
      setPending(null);
    }
  };

  return (
    <>
      <StudentTopHeader />
      <main className="flex-1 overflow-auto py-8">
        <PageContainer size="wide" className="space-y-6">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl text-foreground">
                Following
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage journals, authors, keywords, and topics you follow.
              </p>
            </div>
            <Button
              variant="outline"
              disabled={follows.isFetching}
              onClick={() => void follows.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </header>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Select
              value={type}
              onValueChange={(value) =>
                changeType(value as "ALL" | FollowObjectType)
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {follows.isLoading
                ? "Loading…"
                : `${follows.items.length} follow${follows.items.length === 1 ? "" : "s"} on this page`}
            </p>
          </div>
          {follows.error ? (
            <Message text={follows.error} retry={() => void follows.reload()} />
          ) : null}
          {actionError ? (
            <Card className="border-border p-4">
              <p className="text-sm text-destructive">{actionError}</p>
            </Card>
          ) : null}
          {follows.isLoading ? (
            <RouteDataLoading label="Loading follows…" />
          ) : null}
          {!follows.isLoading &&
          !follows.error &&
          follows.items.length === 0 ? (
            <Card className="p-12 text-center">
              <Rss className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
              <h2 className="font-heading text-lg">No follows yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Follow a journal, author, keyword, or topic to monitor it here.
              </p>
              <Button asChild className="mt-4">
                <Link href="/student/journals">Browse journals</Link>
              </Button>
            </Card>
          ) : null}
          <div className="space-y-4">
            {follows.items.map((item) => (
              <FollowCard
                key={item.followId}
                item={item}
                pending={pending === `unfollow-${item.followId}`}
                onUnfollow={() =>
                  void runAction(`unfollow-${item.followId}`, () =>
                    follows.unfollow(
                      item.objectType,
                      item.objectId,
                      item.target.displayName,
                    ),
                  )
                }
              />
            ))}
          </div>
          {!follows.isLoading && (page > 1 || follows.hasMore) ? (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1 || follows.isFetching}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={!follows.hasMore || follows.isFetching}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          ) : null}
        </PageContainer>
      </main>
    </>
  );
}

function FollowCard({
  item,
  pending,
  onUnfollow,
}: {
  item: FollowItem;
  pending: boolean;
  onUnfollow: () => void;
}) {
  const target = item.target;
  const metadata = [
    target.country,
    target.region,
    target.journalType,
    target.score === null || target.score === undefined
      ? null
      : `Score ${target.score}`,
  ]
    .filter(Boolean)
    .join(" · ");
  const title = target.displayName || item.objectId;
  const titleNode =
    item.objectType === "JOURNAL" ? (
      <Link
        className="hover:underline"
        href={`/student/journals/${encodeURIComponent(item.objectId)}`}
      >
        {title}
      </Link>
    ) : (
      title
    );
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-lg text-foreground">
              {titleNode}
            </h2>
            <span className="rounded-full bg-accent px-2 py-1 text-xs text-muted-foreground">
              {item.objectType.toLowerCase()}
            </span>
          </div>
          {metadata ? (
            <p className="mt-2 text-sm text-muted-foreground">{metadata}</p>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">
            Following since {new Date(item.followedAt).toLocaleDateString()}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={onUnfollow}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {pending ? "Removing…" : "Unfollow"}
        </Button>
      </div>
    </Card>
  );
}
function Message({ text, retry }: { text: string; retry: () => void }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-destructive">{text}</p>
      <Button className="mt-3" size="sm" variant="outline" onClick={retry}>
        Try again
      </Button>
    </Card>
  );
}
