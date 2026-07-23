import {
  getAdminDashboardMetrics,
  listAdminJobs,
  listAdminSyncLogs,
} from "@/features/system-health/api/admin-sync.api";
import { buildSystemHealthSnapshot } from "@/features/system-health/api/build-system-health-snapshot";
import type { SystemHealthSnapshot } from "@/features/system-health/types/system-health.types";

/** Aggregate admin dashboard + jobs + recent sync logs for System Health. */
export async function fetchSystemHealthSnapshot(): Promise<SystemHealthSnapshot> {
  const [dashboard, jobs, syncLogsPage] = await Promise.all([
    getAdminDashboardMetrics(),
    listAdminJobs(),
    listAdminSyncLogs({ page: 1, pageSize: 30 }),
  ]);

  return buildSystemHealthSnapshot({
    dashboard,
    jobs,
    syncLogs: syncLogsPage.items,
  });
}
