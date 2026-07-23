"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserFriendlyApiErrorMessage } from "@/core/api";
import { listQueryStaleTimeMs } from "@/core/api/query-config";
import { listFollows, toggleFollow } from "@/features/follows/api/follows.api";
import type { FollowObjectType } from "@/features/follows/types/follow.types";

export const followsRootQueryKey = ["follows"] as const;
const dashboardQueryKey = ["dashboard", "me"] as const;

export function useFollows({
  page = 1,
  limit = 20,
  type,
}: {
  page?: number;
  limit?: number;
  type?: FollowObjectType;
} = {}) {
  const queryClient = useQueryClient();
  const queryKey = [...followsRootQueryKey, { page, limit, type }] as const;
  const query = useQuery({
    queryKey,
    queryFn: () => listFollows({ page, limit, type }),
    staleTime: listQueryStaleTimeMs,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });

  const refreshRelatedData = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: followsRootQueryKey }),
      queryClient.invalidateQueries({ queryKey: dashboardQueryKey }),
    ]);
  }, [queryClient]);

  const unfollow = useCallback(
    async (
      objectType: FollowObjectType,
      objectId: string,
      displayName?: string | null,
    ) => {
      const result = await toggleFollow({ objectType, objectId, displayName });
      await refreshRelatedData();
      return result;
    },
    [refreshRelatedData],
  );

  return {
    items: query.data?.items ?? [],
    page: query.data?.page ?? page,
    limit: query.data?.limit ?? limit,
    hasMore: query.data?.hasMore ?? false,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getUserFriendlyApiErrorMessage(query.error) : null,
    reload: query.refetch,
    unfollow,
  };
}
