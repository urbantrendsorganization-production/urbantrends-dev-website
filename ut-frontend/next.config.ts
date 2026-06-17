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
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` },
      { source: "/_allauth/:path*", destination: `${BACKEND_URL}/_allauth/:path*` },
      { source: "/accounts/:path*", destination: `${BACKEND_URL}/accounts/:path*` },
    ];
  },
};

export default nextConfig;
