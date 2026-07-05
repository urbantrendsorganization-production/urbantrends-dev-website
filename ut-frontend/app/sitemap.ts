import type { MetadataRoute } from "next";
import { listServices } from "@/lib/services";
import { listPosts } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urbantrends.dev";

// Public, indexable routes. Private routes (/portal, /login, /signup) and the
// country-prefixed home variants (/ke, /ng, …) are intentionally excluded —
// the canonical home is `/`.
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.8, changeFrequency: "weekly" },
  { path: "/work", priority: 0.8, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/docs", priority: 0.7, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.7, changeFrequency: "daily" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/changelog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/careers", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/security", priority: 0.5, changeFrequency: "monthly" },
  { path: "/status", priority: 0.4, changeFrequency: "weekly" },
  { path: "/rentflow", priority: 0.6, changeFrequency: "monthly" },
  { path: "/academyos", priority: 0.5, changeFrequency: "monthly" },
  { path: "/trendyyleads", priority: 0.5, changeFrequency: "monthly" },
  { path: "/portfoliou", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

async function servicePaths(): Promise<MetadataRoute.Sitemap> {
  try {
    const services = await listServices();
    return services.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

async function blogPaths(): Promise<MetadataRoute.Sitemap> {
  try {
    const entries: MetadataRoute.Sitemap = [];
    // Walk paginated results, capped so a large blog can't stall the build.
    for (let page = 1; page <= 20; page++) {
      const { results, next } = await listPosts(page);
      for (const post of results) {
        entries.push({
          url: `${SITE_URL}/blog/${post.slug}`,
          lastModified: post.published_at ? new Date(post.published_at) : undefined,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
      if (!next) break;
    }
    return entries;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const [services, posts] = await Promise.all([servicePaths(), blogPaths()]);
  return [...staticEntries, ...services, ...posts];
}
