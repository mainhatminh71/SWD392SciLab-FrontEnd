export type DashboardFollowTargetType =
  "AUTHOR" | "JOURNAL" | "KEYWORD" | "TOPIC";

export interface MyDashboard {
  bookmarkCount: number;
  followCount: number;
  recentBookmarks: Array<{
    articleId: string;
    bookmarkedAt: string;
    article: {
      id: string;
      title: string;
      abstract: string | null;
      doi: string | null;
      publicationYear: number | null;
    };
  }>;
  recentFollows: Array<{
    followId: string;
    objectType: DashboardFollowTargetType;
    objectId: string;
    notifyMode: "IN_APP" | "DAILY_EMAIL" | "WEEKLY_EMAIL" | "OFF";
    followedAt: string;
    target: {
      type: DashboardFollowTargetType;
      id: string;
      displayName: string | null;
      sourceId: string | null;
      journalType: string | null;
      country: string | null;
      region: string | null;
      score: number | null;
    };
  }>;
  ranking: { year: number; metric: "SJR" };
  catalog: {
    journalCount: number;
    articleCount: number;
    uniqueKeywordCount: number;
    topicsAndSubjectsCount: number;
    asOf: string | null;
  };
  publicationGrowth: Array<{ year: number; articles: number }>;
  yearDistribution: Array<{ year: number; articles: number }>;
  trendingTopics: Array<{ name: string; count: number; changePercent: number }>;
  topJournals: Array<{
    scimagoSourceId: string;
    journalId: string | null;
    title: string;
    sjr: number | null;
    hIndex: number | null;
    totalDocs: number | null;
    countryCode: string | null;
  }>;
  recentPublications: Array<{
    id: string;
    title: string | null;
    journal: string | null;
    publicationYear: number | null;
    citationCount: number;
  }>;
}

export interface AdminDashboard {
  generatedAt: string;
  articleCount: number;
  journalCount: number;
  authorCount: number;
  userCount: number;
  summary: {
    articleCount: number;
    journalCount: number;
    authorCount: number;
    userCount: number;
  };
  users: {
    byStatus: { active: number; inactive: number; banned: number };
    byRole: { student: number; researcher: number; admin: number };
    registrations: { last7Days: number; last30Days: number };
  };
  engagement: {
    bookmarkCount: number;
    followCount: number;
    unreadNotificationCount: number;
  };
  sync: {
    runningJobCount: number;
    failedSyncCountLast24Hours: number;
    lastSyncAt: string | null;
    recentLogs: Array<{
      id: string;
      source: string;
      jobType: string;
      status: string;
      startedAt: string;
      finishedAt: string | null;
      insertedCount: number;
      updatedCount: number;
      errorCount: number;
      sourceName: string | null;
    }>;
  };
  growth: {
    last7Days: {
      articles: number;
      journals: number;
      authorsWithNewArticles: number;
    };
    last30Days: {
      articles: number;
      journals: number;
      authorsWithNewArticles: number;
    };
  };
  rankings: {
    topJournals: Array<{ id: string; title: string; articleCount: number }>;
    topArticles: Array<{
      id: string;
      title: string;
      citationCount: number;
      publicationYear: number | null;
    }>;
  };
  dataQuality: {
    hydratedArticles: number;
    placeholderArticles: number;
    missingDoi: number;
    missingAbstract: number;
    missingAuthors: number;
  };
  sources: Array<{
    id: string;
    name: string;
    isActive: boolean;
    lastTestedAt: string | null;
    latestSyncStatus: string | null;
    latestSyncAt: string | null;
    failedSyncCountLast24Hours: number;
  }>;
}
