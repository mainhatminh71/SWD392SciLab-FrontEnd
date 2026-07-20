import type { NextConfig } from "next";

/** Upstream for same-origin `/backend` proxy (avoids browser CORS). */
function resolveBackendProxyTarget() {
  const dataSource =
    process.env.NEXT_PUBLIC_API_DATA_SOURCE?.trim().toLowerCase();
  if (dataSource === "local") {
    return (
      process.env.NEXT_PUBLIC_LOCAL_API_URL?.trim() || "http://localhost:6003"
    ).replace(/\/$/, "");
  }
  return (
    process.env.SCILAB_API_ORIGIN?.trim() || "https://scilab-api.epsilon.io.vn"
  ).replace(/\/$/, "");
}

const backendProxyTarget = resolveBackendProxyTarget();

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${backendProxyTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
