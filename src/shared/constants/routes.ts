export const routes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  student: {
    dashboard: "/student/dashboard",
    journals: "/student/journals",
    journalDetail: (id: string) => `/student/journals/${id}`,
    articles: "/student/articles",
    articleDetail: (id: string) => `/student/articles/${id}`,
    trends: "/student/trends",
    bookmarks: "/student/bookmarks",
    notifications: "/student/notifications",
    profile: "/student/profile",
  },
} as const;
