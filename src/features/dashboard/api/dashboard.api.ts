import { apiRequest } from "@/core/api";
import type {
  AdminDashboard,
  MyDashboard,
} from "@/features/dashboard/types/dashboard.types";

export function getMyDashboard() {
  return apiRequest<MyDashboard>({
    authenticated: true,
    method: "GET",
    path: "/dashboard",
  });
}

export function getAdminDashboard() {
  return apiRequest<AdminDashboard>({
    authenticated: true,
    method: "GET",
    path: "/admin/dashboard",
  });
}
