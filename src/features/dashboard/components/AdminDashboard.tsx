"use client";

import Link from "next/link";
import { Activity, Database, FileText, RefreshCw, Users } from "lucide-react";
import { useAdminDashboard } from "@/features/dashboard/hooks/use-role-dashboard";
import AdminPageFrame from "@/shared/components/layout/AdminPageFrame";
import { RouteDataLoading } from "@/shared/components/layout/RouteDataLoading";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

const count = (value: number) => value.toLocaleString();
export default function AdminDashboard() {
  const { data, isLoading, errorMessage, refetch, isFetching } =
    useAdminDashboard();
  return (
    <AdminPageFrame
      title="Dashboard"
      subtitle="Live platform overview"
      icon={<Activity className="h-5 w-5 text-primary-foreground" />}
      headerAction={
        <Button
          variant="outline"
          disabled={isFetching}
          onClick={() => void refetch()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      }
    >
      {errorMessage ? (
        <Card className="mb-6 p-5">
          <p className="text-sm text-destructive">{errorMessage}</p>
        </Card>
      ) : null}
      {isLoading && !data ? (
        <RouteDataLoading label="Loading admin dashboard…" />
      ) : null}
      {data ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              href="/admin/users"
              icon={<Users />}
              label="Users"
              value={count(data.userCount)}
            />
            <Metric
              icon={<FileText />}
              label="Articles"
              value={count(data.articleCount)}
            />
            <Metric
              icon={<Database />}
              label="Journals"
              value={count(data.journalCount)}
            />
            <Metric
              href="/admin/system-health"
              icon={<Activity />}
              label="Active sync jobs"
              value={count(data.sync.runningJobCount)}
            />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="User distribution">
              <Rows entries={Object.entries(data.users.byRole)} />
            </Panel>
            <Panel title="Data quality">
              <Rows entries={Object.entries(data.dataQuality)} />
            </Panel>
            <Panel title="Source health" href="/admin/api-sources">
              {data.sources.map((source) => (
                <div
                  key={source.id}
                  className="flex justify-between border-b border-border py-3 text-sm"
                >
                  <span>{source.name}</span>
                  <span className="text-muted-foreground">
                    {source.latestSyncStatus ||
                      (source.isActive ? "Active" : "Inactive")}
                  </span>
                </div>
              ))}
            </Panel>
            <Panel title="Recent sync logs" href="/admin/system-health">
              {data.sync.recentLogs.map((log) => (
                <p key={log.id} className="border-b border-border py-3 text-sm">
                  <span className="font-medium">
                    {log.sourceName || log.source}
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    {log.status}
                  </span>
                </p>
              ))}
            </Panel>
          </div>
        </div>
      ) : null}
    </AdminPageFrame>
  );
}
function Metric({
  href,
  icon,
  label,
  value,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const content = (
    <Card className="p-5">
      <div className="mb-3 text-primary">{icon}</div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-3xl">{value}</p>
    </Card>
  );
  return href ? (
    <Link className="block hover:[&>div]:bg-accent" href={href}>
      {content}
    </Link>
  ) : (
    content
  );
}
function Panel({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex justify-between">
        <h2 className="font-heading text-lg">{title}</h2>
        {href ? (
          <Button asChild size="sm" variant="ghost">
            <Link href={href}>View</Link>
          </Button>
        ) : null}
      </div>
      {children}
    </Card>
  );
}
function Rows({ entries }: { entries: [string, number][] }) {
  return (
    <div>
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="flex justify-between border-b border-border py-3 text-sm"
        >
          <span className="capitalize text-muted-foreground">
            {key.replaceAll("_", " ")}
          </span>
          <span>{count(value)}</span>
        </div>
      ))}
    </div>
  );
}
