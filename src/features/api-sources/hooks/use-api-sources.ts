"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserFriendlyApiErrorMessage } from "@/core/api";
import { listQueryStaleTimeMs } from "@/core/api/query-config";
import {
  activateCatalogSource,
  deleteCustomApiSource,
  getActiveCatalogId,
  listApiSources,
  refreshApiSource,
  saveCustomApiSource,
  updateApiSourceStatus,
  updateSourceEndpoint,
} from "@/features/api-sources/api/api-sources.api";
import {
  API_SOURCES_CHANGED_EVENT,
  type PersistedCustomSource,
} from "@/features/api-sources/lib/runtime-api-sources";
import type { ApiSourceStatus } from "@/features/api-sources/types/api-source.types";

const sourcesQueryKey = ["admin", "api-sources"] as const;

function invalidateAcademicQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ["articles"] });
  void queryClient.invalidateQueries({ queryKey: ["journals"] });
  void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  void queryClient.invalidateQueries({ queryKey: ["trends"] });
  void queryClient.invalidateQueries({ queryKey: ["journal-rankings"] });
  void queryClient.invalidateQueries({ queryKey: ["article-graph"] });
}

export function useApiSources() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: sourcesQueryKey,
    staleTime: listQueryStaleTimeMs,
    queryFn: listApiSources,
  });

  useEffect(() => {
    const onChange = () => {
      void queryClient.invalidateQueries({ queryKey: sourcesQueryKey });
      invalidateAcademicQueries(queryClient);
    };
    window.addEventListener(API_SOURCES_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(API_SOURCES_CHANGED_EVENT, onChange);
  }, [queryClient]);

  const statusMutation = useMutation({
    mutationFn: ({
      sourceId,
      status,
    }: {
      sourceId: string;
      status: ApiSourceStatus;
    }) => {
      updateApiSourceStatus(sourceId, status);
      return listApiSources();
    },
    onSuccess: (sources) => {
      queryClient.setQueryData(sourcesQueryKey, sources);
      invalidateAcademicQueries(queryClient);
    },
  });

  const refreshMutation = useMutation({
    mutationFn: (sourceId: string) => refreshApiSource(sourceId),
    onSuccess: (sources) => {
      queryClient.setQueryData(sourcesQueryKey, sources);
    },
  });

  const saveCustomMutation = useMutation({
    mutationFn: async (source: PersistedCustomSource) => {
      saveCustomApiSource(source);
      return listApiSources();
    },
    onSuccess: (sources) => {
      queryClient.setQueryData(sourcesQueryKey, sources);
      invalidateAcademicQueries(queryClient);
    },
  });

  const deleteCustomMutation = useMutation({
    mutationFn: async (sourceId: string) => {
      deleteCustomApiSource(sourceId);
      return listApiSources();
    },
    onSuccess: (sources) => {
      queryClient.setQueryData(sourcesQueryKey, sources);
      invalidateAcademicQueries(queryClient);
    },
  });

  const activateCatalogMutation = useMutation({
    mutationFn: async (sourceId: string) => {
      activateCatalogSource(sourceId);
      return listApiSources();
    },
    onSuccess: (sources) => {
      queryClient.setQueryData(sourcesQueryKey, sources);
      invalidateAcademicQueries(queryClient);
    },
  });

  const updateEndpointMutation = useMutation({
    mutationFn: async ({
      sourceId,
      endpoint,
    }: {
      sourceId: string;
      endpoint: string;
    }) => {
      updateSourceEndpoint(sourceId, endpoint);
      return listApiSources();
    },
    onSuccess: (sources) => {
      queryClient.setQueryData(sourcesQueryKey, sources);
      invalidateAcademicQueries(queryClient);
    },
  });

  return {
    sources: query.data ?? [],
    activeCatalogSourceId: getActiveCatalogId(),
    isLoading: query.isLoading,
    error: query.error ? getUserFriendlyApiErrorMessage(query.error) : null,
    reload: () => query.refetch(),
    setStatus: (sourceId: string, status: ApiSourceStatus) =>
      statusMutation.mutateAsync({ sourceId, status }),
    refresh: (sourceId: string) => refreshMutation.mutateAsync(sourceId),
    saveCustom: (source: PersistedCustomSource) =>
      saveCustomMutation.mutateAsync(source),
    deleteCustom: (sourceId: string) =>
      deleteCustomMutation.mutateAsync(sourceId),
    activateCatalog: (sourceId: string) =>
      activateCatalogMutation.mutateAsync(sourceId),
    updateEndpoint: (sourceId: string, endpoint: string) =>
      updateEndpointMutation.mutateAsync({ sourceId, endpoint }),
    isMutating:
      statusMutation.isPending ||
      refreshMutation.isPending ||
      saveCustomMutation.isPending ||
      deleteCustomMutation.isPending ||
      activateCatalogMutation.isPending ||
      updateEndpointMutation.isPending,
  };
}
