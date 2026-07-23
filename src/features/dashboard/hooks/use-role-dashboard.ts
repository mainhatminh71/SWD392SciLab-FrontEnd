"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserFriendlyApiErrorMessage } from "@/core/api";
import { getAdminDashboard, getMyDashboard } from "@/features/dashboard/api/dashboard.api";

const dashboardStaleTimeMs = 30_000;

export function useMyDashboard() {
  const query = useQuery({ queryKey: ["dashboard", "me"], queryFn: getMyDashboard, staleTime: dashboardStaleTimeMs });
  return { ...query, errorMessage: query.error ? getUserFriendlyApiErrorMessage(query.error) : null };
}

export function useAdminDashboard() {
  const query = useQuery({ queryKey: ["dashboard", "admin"], queryFn: getAdminDashboard, staleTime: dashboardStaleTimeMs });
  return { ...query, errorMessage: query.error ? getUserFriendlyApiErrorMessage(query.error) : null };
}
