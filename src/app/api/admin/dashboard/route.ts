import { NextRequest } from "next/server";
import { proxyAuthenticated } from "@/features/auth/server/auth-bff";

export const runtime = "nodejs";

/** Same-origin BFF for GET /admin/dashboard. */
export async function GET(request: NextRequest) {
  return proxyAuthenticated(request, "admin/dashboard");
}
