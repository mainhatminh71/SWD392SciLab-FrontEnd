"use client";

import Link from "next/link";
import { BookMarked, BookOpen, FileText, RefreshCw, Rss } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useMyDashboard } from "@/features/dashboard/hooks/use-role-dashboard";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import PageContainer from "@/shared/components/layout/PageContainer";
import StudentTopHeader from "@/shared/components/layout/StudentTopHeader";
import { RouteDataLoading } from "@/shared/components/layout/RouteDataLoading";

const count = (value: number) => value.toLocaleString();

export default function RoleDashboard() {
  const { user } = useAuth();
  const { data, isLoading, errorMessage, refetch, isFetching } = useMyDashboard();
  return <><StudentTopHeader /><main className="flex-1 overflow-auto py-8"><PageContainer size="wide" className="space-y-6"><header className="flex flex-wrap justify-between gap-4"><div><h1 className="font-heading text-3xl text-foreground">Dashboard</h1><p className="mt-1 text-muted-foreground">Welcome back, {user?.name || "researcher"}. Your live research overview.</p></div><Button variant="outline" disabled={isFetching} onClick={() => void refetch()}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button></header>
    {errorMessage ? <ErrorCard message={errorMessage} retry={() => void refetch()} /> : null}
    {isLoading && !data ? <RouteDataLoading label="Loading your dashboard…" /> : null}
    {data ? <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric href="/student/bookmarks" icon={<BookMarked />} label="Bookmarks" value={count(data.bookmarkCount)} /><Metric href="/student/trends" icon={<Rss />} label="Following" value={count(data.followCount)} /><Metric href="/student/articles" icon={<FileText />} label="Catalog articles" value={count(data.catalog.articleCount)} /><Metric href="/student/journals" icon={<BookOpen />} label="Catalog journals" value={count(data.catalog.journalCount)} /></div><div className="grid gap-6 lg:grid-cols-2"><Panel title="Recent bookmarks" href="/student/bookmarks">{data.recentBookmarks.map(({ article }) => <Article key={article.id} id={article.id} title={article.title} year={article.publicationYear} />)}</Panel><Panel title="Recent follows" href="/student/trends">{data.recentFollows.map((follow) => <Link key={follow.followId} className="block border-b border-border py-3 text-sm hover:bg-accent/60" href={follow.objectType === "JOURNAL" ? `/student/journals/${encodeURIComponent(follow.objectId)}` : "/student/trends"}>{follow.target.displayName || follow.objectId}<span className="ml-2 text-xs text-muted-foreground">{follow.objectType.toLowerCase()}</span></Link>)}</Panel><Panel title="Recent publications" href="/student/articles">{data.recentPublications.map((article) => <Article key={article.id} id={article.id} title={article.title || "Untitled publication"} year={article.publicationYear} journal={article.journal} />)}</Panel><Panel title="Top journals" href="/student/journals">{data.topJournals.map((journal) => <Link key={journal.scimagoSourceId} className="flex justify-between border-b border-border py-3 text-sm hover:bg-accent/60" href={journal.journalId ? `/student/journals/${encodeURIComponent(journal.journalId)}` : "/student/journals"}><span>{journal.title}</span><span className="text-muted-foreground">{journal.sjr === null ? "Unranked" : `SJR ${journal.sjr}`}</span></Link>)}</Panel></div></> : null}
  </PageContainer></main></>;
}
function Metric({ href, icon, label, value }: { href: string; icon: React.ReactNode; label: string; value: string }) { return <Link href={href}><Card className="p-5 hover:bg-accent"><div className="mb-3 text-primary">{icon}</div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 font-heading text-3xl text-foreground">{value}</p></Card></Link>; }
function Panel({ title, href, children }: { title: string; href: string; children: React.ReactNode }) { return <Card className="p-5"><div className="mb-3 flex justify-between"><h2 className="font-heading text-lg">{title}</h2><Button asChild size="sm" variant="ghost"><Link href={href}>Browse</Link></Button></div>{children || <p className="py-6 text-center text-sm text-muted-foreground">No data available yet.</p>}</Card>; }
function Article({ id, title, year, journal }: { id: string; title: string; year: number | null; journal?: string | null }) { return <Link href={`/student/articles/${encodeURIComponent(id)}`} className="block border-b border-border py-3 hover:bg-accent/60"><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-muted-foreground">{journal || "Journal unavailable"}{year ? ` · ${year}` : ""}</p></Link>; }
function ErrorCard({ message, retry }: { message: string; retry: () => void }) { return <Card className="p-5"><p className="text-sm text-destructive">{message}</p><Button className="mt-3" size="sm" variant="outline" onClick={retry}>Try again</Button></Card>; }
