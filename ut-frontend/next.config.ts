import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

// The SiteChat staff dashboard is a separate Next zone. When this is set, the
// site proxies /tools/sitechat/* to it (multi-zone). The dashboard is built
// with basePath=/tools/sitechat, so it owns that whole subtree, assets
// included. Leave unset to disable (the route then 404s like any other page).
// Examples: a Vercel deployment URL, or http://sitechat-dashboard:3000 on a
// shared Docker network.
const SITECHAT_DASHBOARD_URL = process.env.SITECHAT_DASHBOARD_URL;

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle for Docker (copies only the files
  // needed to run, so the runtime image doesn't need node_modules).
  output: "standalone",
  // Disable automatic trailing-slash redirects so /api/orders/ isn't
  // 308-redirected before the backend rewrite fires.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.urbantrends.dev",
        pathname: "/media/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    const noindex = { key: "X-Robots-Tag", value: "noindex, nofollow" };
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Private/auth surfaces should never rank. Kept crawlable (not disallowed
      // in robots.txt) so crawlers can see this header and drop any
      // already-indexed URLs.
      { source: "/portal/:path*", headers: [noindex] },
      { source: "/login", headers: [noindex] },
      { source: "/signup", headers: [noindex] },
    ];
  },
  async rewrites() {
    // SiteChat zone is in beforeFiles so it owns /tools/sitechat even if a
    // filesystem route ever appears there. Its API/WebSocket calls go straight
    // to the relay (baked NEXT_PUBLIC_API_URL), not through these rewrites.
    if (process.env.NODE_ENV === "production" && !SITECHAT_DASHBOARD_URL) {
      console.warn(
        "[SiteChat] SITECHAT_DASHBOARD_URL is unset — /tools/sitechat will 404",
      );
    }
    const sitechat = SITECHAT_DASHBOARD_URL
      ? [
          {
            source: "/tools/sitechat",
            destination: `${SITECHAT_DASHBOARD_URL}/tools/sitechat`,
          },
          {
            source: "/tools/sitechat/:path*",
            destination: `${SITECHAT_DASHBOARD_URL}/tools/sitechat/:path*`,
          },
        ]
      : [];
    return {
      beforeFiles: sitechat,
      afterFiles: [
        { source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` },
        { source: "/_allauth/:path*", destination: `${BACKEND_URL}/_allauth/:path*` },
        { source: "/accounts/:path*", destination: `${BACKEND_URL}/accounts/:path*` },
        // User-uploaded media (partner logos, project covers) is served by
        // Django. Proxy it so the browser loads it same-origin instead of
        // hitting the internal backend host directly.
        { source: "/media/:path*", destination: `${BACKEND_URL}/media/:path*` },
      ],
    };
  },
};

export default nextConfig;
