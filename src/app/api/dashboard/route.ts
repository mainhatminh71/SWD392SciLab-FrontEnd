import { NextRequest } from "next/server";
import { proxyAuthenticated } from "@/features/auth/server/auth-bff";

export const runtime = "nodejs";

/** Same-origin BFF for GET /dashboard/me. */
export async function GET(request: NextRequest) {
  return proxyAuthenticated(request, "dashboard/me");
}
