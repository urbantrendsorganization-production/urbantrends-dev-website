import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urbantrends.dev";

// Private/auth routes stay crawlable but carry an X-Robots-Tag: noindex header
// (see next.config.ts) so already-indexed ones drop out. Pure API/backend
// paths have no SEO value and are disallowed outright to save crawl budget.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_allauth/", "/accounts/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
