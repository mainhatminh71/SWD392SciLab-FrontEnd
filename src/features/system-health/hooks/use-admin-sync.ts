"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserFriendlyApiErrorMessage } from "@/core/api";
import { listQueryStaleTimeMs } from "@/core/api/query-config";
import {
  cancelAdminJob,
  getAdminDashboardMetrics,
  getAdminSyncLog,
  listAdminJobs,
  listAdminSyncLogs,
  pauseAdminJob,
  resumeAdminJob,
  retryAdminJob,
  triggerAdminJob,
} from "@/features/system-health/api/admin-sync.api";
import type {
  AdminJobActionBody,
  AdminPipelineJobId,
  AdminSyncLogListParams,
} from "@/features/system-health/types/admin-sync.types";

const dashboardKey = ["admin", "dashboard"] as const;
const jobsKey = ["admin", "jobs"] as const;
const syncLogsRootKey = ["admin", "sync-logs"] as const;

export function useAdminDashboard() {
  const query = useQuery({
    queryKey: dashboardKey,
    staleTime: listQueryStaleTimeMs,
    queryFn: getAdminDashboardMetrics,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ? getUserFriendlyApiErrorMessage(query.error) : null,
    reload: () => query.refetch(),
  };
}

export function useAdminJobs() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: jobsKey,
    staleTime: 30_000,
    refetchInterval: 60_000,
    queryFn: listAdminJobs,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: jobsKey });
    void queryClient.invalidateQueries({ queryKey: dashboardKey });
    void queryClient.invalidateQueries({ queryKey: syncLogsRootKey });
    void queryClient.invalidateQueries({ queryKey: ["admin", "system-health"] });
  };

  const actionMutation = useMutation({
    mutationFn: async (input: {
      jobId: AdminPipelineJobId | string;
      action: "pause" | "resume" | "trigger" | "cancel" | "retry";
      body?: AdminJobActionBody;
    }) => {
      const { jobId, action, body } = input;
      switch (action) {
        case "pause":
          return pauseAdminJob(jobId, body);
        case "resume":
          return resumeAdminJob(jobId, body);
        case "trigger":
          return triggerAdminJob(jobId, body);
        case "cancel":
          return cancelAdminJob(jobId, body);
        case "retry":
          return retryAdminJob(jobId, body);
      }
    },
    onSuccess: invalidate,
  });

  return {
    jobs: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ? getUserFriendlyApiErrorMessage(query.error) : null,
    reload: () => query.refetch(),
    runAction: (
      jobId: AdminPipelineJobId | string,
      action: "pause" | "resume" | "trigger" | "cancel" | "retry",
      body?: AdminJobActionBody,
    ) => actionMutation.mutateAsync({ jobId, action, body }),
    isMutating: actionMutation.isPending,
    actionError: actionMutation.error
      ? getUserFriendlyApiErrorMessage(actionMutation.error)
      : null,
  };
}

export function useAdminSyncLogs(filters: AdminSyncLogListParams) {
  const query = useQuery({
    queryKey: [...syncLogsRootKey, filters] as const,
    staleTime: 30_000,
    queryFn: () => listAdminSyncLogs(filters),
  });

  return {
    page: query.data ?? null,
    items: query.data?.items ?? [],
    isLoading: query.isLoading,
    error: query.error ? getUserFriendlyApiErrorMessage(query.error) : null,
    reload: () => query.refetch(),
  };
}

export function useAdminSyncLogDetail(id: string | null) {
  const query = useQuery({
    queryKey: [...syncLogsRootKey, "detail", id] as const,
    enabled: Boolean(id),
    staleTime: 30_000,
    queryFn: () => getAdminSyncLog(id!),
  });

  return {
    log: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ? getUserFriendlyApiErrorMessage(query.error) : null,
  };
}
