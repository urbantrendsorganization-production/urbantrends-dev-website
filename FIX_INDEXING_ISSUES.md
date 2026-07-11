# FIX_INDEXING_ISSUES.md — Google Search Console Indexing Fixes for urbantrends.dev

**Context:** GSC reports 40 pages not indexed vs 26 indexed. Five issue categories identified from GSC screenshots (July 2026). Site is Next.js/TypeScript behind Caddy on Hetzner. Fix in order of priority below.

---

## Priority 0 — Cross-cutting root cause: host canonicalization (www vs non-www, http vs https)

Multiple issue categories (redirects, duplicates, crawled-not-indexed) show the same pages appearing under 4 host variants:
- `http://urbantrends.dev`
- `https://urbantrends.dev` ← canonical
- `http://www.urbantrends.dev`
- `https://www.urbantrends.dev`

**Fix:**
1. In Caddy, ensure a single 301 redirect rule: `www.urbantrends.dev` and all http traffic → `https://urbantrends.dev` (one hop, not chained http→https→non-www).
2. In Next.js root layout / metadata config, set:
   ```ts
   export const metadata = {
     metadataBase: new URL('https://urbantrends.dev'),
     alternates: { canonical: './' }, // per-page canonical resolution
   }
   ```
3. Verify every page emits `<link rel="canonical" href="https://urbantrends.dev/...">` with NO www.
4. Sitemap must only list `https://urbantrends.dev` URLs. Check `sitemap.xml` / `app/sitemap.ts` for www or http entries and remove them.

---

## Priority 1 — "Excluded by 'noindex' tag" (7 pages) — CRITICAL, these are real pages

Affected: `/clients`, `/privacy-policy`, `/case-studies`, `/projects`, `/support` (plus www duplicates).
First detected 7/1/26 — this is a **recent regression**, likely introduced in a recent deploy.

**Investigate:**
1. Grep the codebase for `noindex`:
   ```bash
   grep -rn "noindex" app/ src/ components/ --include="*.ts" --include="*.tsx"
   ```
2. Common causes in Next.js:
   - `robots: { index: false }` in a shared layout's `metadata` export that these routes inherit.
   - An environment check like `process.env.VERCEL_ENV !== 'production' → noindex` that's misfiring in the Docker/Hetzner deploy (env var not set, so it always applies noindex).
   - `X-Robots-Tag: noindex` header set in Caddy or Next.js middleware.
3. Check response headers in production:
   ```bash
   curl -sI https://urbantrends.dev/clients | grep -i robots
   curl -s https://urbantrends.dev/clients | grep -i noindex
   ```

**Fix:** Remove noindex from these routes (or fix the env-based condition so production is indexable). Pages that SHOULD stay noindexed if any exist (admin, staging, API-rendered pages) must be explicitly listed, not defaulted.

**After deploy:** In GSC → Page indexing → Excluded by 'noindex' tag → click **VALIDATE FIX**.

---

## Priority 2 — "Not found (404)" (7 pages)

Affected:
- `https://urbantrends.dev/projects/9` — deleted/never-existed project ID
- `https://portfoliou.urbantrends.dev/favicon.ico` — dead subdomain (PortfolioU was dropped)
- `https://urbantrends.dev/careers`
- `https://urbantrends.dev/pricing`
- `https://urbantrends.dev/community`
- `https://blogs.urbantrends.dev/blogs` — dead subdomain
- `https://te.urbantrends.dev/` — dead subdomain

**Fix:**
1. For pages that were removed intentionally (`/careers`, `/pricing`, `/community`): either
   - Add 301 redirects to the closest live page (e.g. `/pricing` → `/services`, `/careers` → `/about`), OR
   - Leave as 404 if there's no sensible target — but ensure they are NOT in the sitemap and NOT linked internally. Grep for internal links:
     ```bash
     grep -rn "careers\|pricing\|community" app/ src/ components/
     ```
2. `/projects/9`: the projects dynamic route should return a proper 404 (`notFound()`) for missing IDs — verify it does. Ensure sitemap only generates URLs for existing project IDs.
3. Dead subdomains (`portfoliou`, `blogs`, `te`): remove their DNS records entirely if no longer used. If DNS must stay, have Caddy 301 them to `https://urbantrends.dev`. Dead DNS = Google eventually drops them.

---

## Priority 3 — "Duplicate without user-selected canonical" (7 pages)

Affected:
- `https://blog-api.urbantrends.dev/` — the Django blog API root
- `https://www.urbantrends.dev/products` — www duplicate (fixed by Priority 0)
- `/services/maintenance-&-support`, `/services/software-development`, `/services/web-&-digital-solutions`, `/services/saas-&-product-development`, `/services/consultation-&-training`

**Fix:**
1. **blog-api subdomain:** This is an API, it should never be indexed. Add to the Django app (or Caddy block for blog-api):
   - `X-Robots-Tag: noindex` response header, AND/OR
   - a `robots.txt` at `blog-api.urbantrends.dev/robots.txt` with `Disallow: /`
2. **Service pages:** These slugs contain `&` (`maintenance-&-support`). Encoded vs unencoded ampersand variants (`%26`) can create duplicate URLs. Strongly consider migrating slugs to clean form (`maintenance-and-support`) with 301s from the old slugs. At minimum, ensure each service page emits an explicit self-referencing canonical.
3. www `/products` resolves via Priority 0 redirect + canonical.

---

## Priority 4 — "Page with redirect" (5 pages)

Affected: `http://urbantrends.dev/`, `https://www.urbantrends.dev/`, `https://www.urbantrends.dev/services`, `https://urbantrends.dev/privacy`, `http://www.urbantrends.dev/`

**This category is mostly EXPECTED and healthy** once Priority 0 is in place — Google noting that variants redirect to canonical is fine. Two checks:
1. `/privacy` redirecting — confirm it 301s to `/privacy-policy` (single hop). Update any internal links pointing at `/privacy` to point directly at `/privacy-policy`.
2. Ensure redirects are 301 (permanent), not 302/307. Check:
   ```bash
   curl -sI http://urbantrends.dev/ | head -5
   curl -sI https://www.urbantrends.dev/services | head -5
   ```

No validation needed here beyond confirming single-hop 301s.

---

## Priority 5 — "Crawled – currently not indexed" (14 pages)

Affected include: `/services/server-migration`, `/security`, `/blog`, `/projects/5`, `/about`, `/projects/8`, `tasks.urbantrends.dev/`, `www./order`, `/products`, `www./services/cloud-&-devops`

This means Google crawled them and chose not to index — usually thin/low-value content or duplicate signals.

**Fix:**
1. `tasks.urbantrends.dev` — internal tool? Should be noindexed (`X-Robots-Tag: noindex`) or behind auth, and removed from any sitemap.
2. www variants — resolved by Priority 0.
3. For real pages (`/about`, `/blog`, `/security`, `/products`, service pages, project pages):
   - Verify they render full content server-side (SSR/SSG), not client-only. Check with:
     ```bash
     curl -s https://urbantrends.dev/about | grep -o "<h1[^>]*>.*</h1>"
     ```
     If the HTML is an empty shell that hydrates client-side, Google may be seeing thin content. Convert these routes to SSG/SSR with real content in initial HTML.
   - Add unique `<title>` and `<meta name="description">` per page (no shared/duplicate metadata).
   - Add internal links: every important page should be reachable from nav or footer. Orphan pages get deprioritized.
   - Beef up thin pages — a services page with 2 sentences won't index. Aim for substantive, unique copy per page.
4. `/projects/5` and `/projects/8` — if these are real projects, ensure each has unique content and metadata; if placeholder/empty, return 404 and drop from sitemap.

---

## Post-deploy checklist

1. Deploy all fixes via the normal GitHub Actions → GHCR → Hetzner pipeline.
2. Verify in production with curl (headers + canonical tags + robots meta) for a sample from each category.
3. Regenerate and resubmit `sitemap.xml` in GSC (Indexing → Sitemaps).
4. In GSC, click **VALIDATE FIX** on: Excluded by 'noindex' tag, Not found (404), Duplicate without user-selected canonical.
5. Use URL Inspection → "Request indexing" on the highest-value fixed pages: `/clients`, `/case-studies`, `/projects`, `/support`, `/privacy-policy`, `/about`, `/products`.
6. Expect 1–3 weeks for GSC to re-crawl and clear the reports. Crawled-not-indexed can take longer.

## Success criteria
- 0 real pages under "Excluded by noindex" (only intentional ones like blog-api, tasks).
- All duplicates resolve to a single `https://urbantrends.dev` canonical.
- 404 report contains only genuinely-dead URLs not present in sitemap or internal links.
- Indexed page count climbs from 26 toward full coverage of real pages.