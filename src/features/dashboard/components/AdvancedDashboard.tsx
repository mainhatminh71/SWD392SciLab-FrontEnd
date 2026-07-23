"use client";

import Link from "next/link";
import { FileText, Image as ImageIcon, RefreshCw, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Can from "@/shared/components/auth/Can";
import { useMyDashboard } from "@/features/dashboard/hooks/use-role-dashboard";
import { Fragment, useRef } from "react";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import PageContainer from "@/shared/components/layout/PageContainer";
import StudentTopHeader from "@/shared/components/layout/StudentTopHeader";
import { RouteDataLoading } from "@/shared/components/layout/RouteDataLoading";

export default function AdvancedDashboard() {
  const { data, isLoading, errorMessage, refetch, isFetching } = useMyDashboard();
  return <><StudentTopHeader /><main className="flex-1 overflow-auto py-8"><PageContainer size="wide" className="space-y-6"><header className="flex flex-wrap justify-between gap-4"><div><div className="mb-2 flex gap-2 text-tag"><TrendingUp className="h-5 w-5" /><span className="text-sm font-medium">Researcher Analytics</span></div><h1 className="font-heading text-3xl">Advanced Dashboard</h1><p className="mt-1 text-muted-foreground">Publication trends, topics and SCImago rankings from live aggregates.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" disabled={isFetching} onClick={() => void refetch()}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button><Can permission="export_report"><Button variant="outline" disabled><ImageIcon className="mr-2 h-4 w-4" />Export PNG</Button><Button variant="outline" disabled><FileText className="mr-2 h-4 w-4" />Export CSV</Button></Can></div></header>
    {errorMessage ? <Card className="p-5"><p className="text-sm text-destructive">{errorMessage}</p></Card> : null}{isLoading && !data ? <RouteDataLoading label="Loading advanced analytics…" /> : null}
    {data ? <><div className="grid gap-6 xl:grid-cols-2"><Chart title="Publication growth" data={data.publicationGrowth} /><Chart title="Year distribution" data={data.yearDistribution} /></div><div className="grid gap-6 xl:grid-cols-2"><Card className="p-5"><h2 className="font-heading text-lg">Trending topics</h2><div className="mt-3 divide-y divide-border">{data.trendingTopics.map((topic) => <div key={topic.name} className="flex justify-between py-3 text-sm"><span>{topic.name}</span><span className="text-muted-foreground">{topic.count.toLocaleString()}</span></div>)}</div></Card><Card className="p-5"><div className="flex justify-between gap-3"><h2 className="font-heading text-lg">Journal rankings</h2><Button asChild size="sm" variant="ghost"><Link href="/student/journals">Browse</Link></Button></div><div className="mt-3 divide-y divide-border">{data.topJournals.map((journal) => <Link key={journal.scimagoSourceId} className="flex justify-between py-3 text-sm hover:bg-accent/60" href={journal.journalId ? `/student/journals/${encodeURIComponent(journal.journalId)}` : "/student/journals"}><span>{journal.title}</span><span className="text-muted-foreground">{journal.sjr === null ? "Unranked" : `SJR ${journal.sjr}`}</span></Link>)}</div></Card></div></> : null}
  </PageContainer></main></>;
}
function Chart({ title, data }: { title: string; data: { year: number; articles: number }[] }) { return <Card className="p-5"><h2 className="font-heading text-lg">{title}</h2>{data.length ? <div className="mt-4 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="year" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="articles" fill="#3AC9C1" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div> : <p className="py-10 text-center text-sm text-muted-foreground">No aggregate data available yet.</p>}</Card>; }
