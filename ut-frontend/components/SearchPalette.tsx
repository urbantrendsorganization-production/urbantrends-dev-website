"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { listServices } from "@/lib/services";
import { listPosts } from "@/lib/blog";
import { getProducts, getTools, getProjects } from "@/lib/cms";

type Item = {
  id: string;
  title: string;
  subtitle?: string;
  group: string;
  href: string;
  keywords?: string;
};

// Static, always-available destinations. Dynamic content (services, products,
// tools, blog, work) is appended once the palette is first opened.
const STATIC_ITEMS: Item[] = [
  { id: "p-home", title: "Home", group: "Pages", href: "/", keywords: "landing start homepage" },
  { id: "p-services", title: "Services", group: "Pages", href: "/services", keywords: "software development apis integrations consulting" },
  { id: "p-products", title: "Products", group: "Pages", href: "/products", keywords: "saas apps rentflow sitechat conduit onboardkit" },
  { id: "p-work", title: "Work", group: "Pages", href: "/work", keywords: "portfolio projects case studies clients" },
  { id: "p-docs", title: "Developers", group: "Pages", href: "/docs", keywords: "developer docs documentation api reference integrations" },
  { id: "p-blog", title: "Blog", group: "Pages", href: "/blog", keywords: "articles writing engineering posts news" },
  { id: "p-changelog", title: "Changelog", group: "Pages", href: "/changelog", keywords: "releases updates changes versions" },
  { id: "p-about", title: "About", group: "Pages", href: "/about", keywords: "team company studio nairobi story" },
  { id: "p-tools", title: "Tools", group: "Pages", href: "/tools", keywords: "utilities mpesa daraja playground free" },
  { id: "p-contact", title: "Contact", group: "Pages", href: "/contact", keywords: "email talk support sales enquiry get in touch" },
  { id: "p-status", title: "System Status", group: "Pages", href: "/status", keywords: "uptime incidents health" },
  { id: "p-security", title: "Security", group: "Pages", href: "/security", keywords: "responsible disclosure vulnerability privacy data protection" },
  { id: "p-careers", title: "Careers", group: "Pages", href: "/careers", keywords: "jobs hiring roles work with us" },
  { id: "p-privacy", title: "Privacy Policy", group: "Pages", href: "/privacy", keywords: "data protection gdpr" },
  { id: "p-terms", title: "Terms of Service", group: "Pages", href: "/terms", keywords: "legal terms conditions" },
  { id: "p-rentflow", title: "RentFlow", subtitle: "Property management, reconciled", group: "Products", href: "/rentflow", keywords: "property rent mpesa landlord reconciliation" },
  { id: "p-academyos", title: "AcademyOS", subtitle: "Run the whole school", group: "Products", href: "/academyos", keywords: "school fees admissions timetable education" },
  { id: "p-trendyyleads", title: "TrendyyLeads", subtitle: "Pipeline that respects itself", group: "Products", href: "/trendyyleads", keywords: "leads b2b crm sales pipeline" },
  { id: "p-portfoliou", title: "PortfolioU", subtitle: "Hire from proof", group: "Products", href: "/portfoliou", keywords: "talent hiring students portfolio recruitment" },
  { id: "a-signin", title: "Sign in", group: "Account", href: "/login", keywords: "log in account auth passkey" },
  { id: "a-signup", title: "Start building", group: "Account", href: "/signup", keywords: "sign up register create account get started" },
];

function scoreItem(item: Item, tokens: string[]): number {
  const title = item.title.toLowerCase();
  const hay = `${item.title} ${item.subtitle ?? ""} ${item.group} ${item.keywords ?? ""}`.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (!hay.includes(t)) return -1; // every token must appear somewhere
    if (title.startsWith(t)) score += 12;
    else if (title.includes(t)) score += 6;
    else score += 2;
  }
  return score;
}

export default function SearchPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [dynamic, setDynamic] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const loadIndex = useCallback(async () => {
    if (loaded || loading) return;
    setLoading(true);
    const [services, products, tools, posts, projects] = await Promise.allSettled([
      listServices(),
      getProducts(),
      getTools(),
      listPosts(1),
      getProjects(),
    ]);
    const items: Item[] = [];
    if (services.status === "fulfilled") {
      for (const s of services.value) {
        items.push({
          id: `s-${s.slug}`,
          title: s.name,
          subtitle: s.tagline,
          group: "Services",
          href: `/services/${s.slug}`,
          keywords: s.category_name,
        });
      }
    }
    if (products.status === "fulfilled") {
      for (const pr of products.value) {
        if (!pr.href) continue; // "coming soon" cards aren't navigable
        items.push({
          id: `pr-${pr.name}`,
          title: pr.name,
          subtitle: pr.description,
          group: "Products",
          href: pr.href,
          keywords: pr.tag,
        });
      }
    }
    if (tools.status === "fulfilled") {
      for (const t of tools.value) {
        items.push({
          id: `t-${t.slug}`,
          title: t.name,
          subtitle: t.tagline,
          group: "Tools",
          href: t.is_coming_soon ? "/tools" : (t.cta_url || "/tools"),
          keywords: `${t.category} ${t.description}`,
        });
      }
    }
    if (posts.status === "fulfilled") {
      for (const post of posts.value.results) {
        items.push({
          id: `b-${post.slug}`,
          title: post.title,
          subtitle: post.excerpt,
          group: "Blog",
          href: `/blog/${post.slug}`,
          keywords: `${post.category} ${post.tags.map((tag) => tag.slug).join(" ")}`,
        });
      }
    }
    if (projects.status === "fulfilled") {
      for (const proj of projects.value) {
        items.push({
          id: `w-${proj.slug}`,
          title: proj.title,
          subtitle: proj.summary,
          group: "Work",
          href: proj.live_url || "/work",
          keywords: `${proj.client} ${proj.category_label} ${proj.tags.join(" ")}`,
        });
      }
    }
    setDynamic(items);
    setLoaded(true);
    setLoading(false);
  }, [loaded, loading]);

  const show = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActive(0);
    loadIndex();
  }, [loadIndex]);

  // Global open triggers: Cmd/Ctrl+K, "/" when not typing, and the nav button
  // (which dispatches a "search:open" event).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        if (!open) show();
        return;
      }
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (k === "/" && !typing && !open) {
        e.preventDefault();
        show();
      }
    }
    function onOpenEvent() { show(); }
    window.addEventListener("keydown", onKey);
    window.addEventListener("search:open", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("search:open", onOpenEvent);
    };
  }, [open, show]);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
      return () => { cancelAnimationFrame(id); document.body.style.overflow = ""; };
    }
  }, [open]);

  const results = useMemo(() => {
    const all = [...STATIC_ITEMS, ...dynamic];
    const q = query.trim().toLowerCase();
    if (!q) {
      // No query: show the primary pages/products as suggestions.
      return all.filter((i) => i.group === "Pages" || i.group === "Products").slice(0, 8);
    }
    const tokens = q.split(/\s+/).filter(Boolean);
    return all
      .map((i) => ({ i, s: scoreItem(i, tokens) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 20)
      .map((x) => x.i);
  }, [query, dynamic]);

  useEffect(() => { setActive(0); }, [query]);

  const go = useCallback((item: Item) => {
    setOpen(false);
    if (/^https?:\/\//.test(item.href)) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.href);
    }
  }, [router]);

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (results[active]) go(results[active]); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
  }

  // Keep the active row scrolled into view.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!open) return null;

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Site search" onMouseDown={() => setOpen(false)}>
      <div className="search-panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="search-input-row">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search pages, services, products, blog…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
          />
          <button className="search-esc" type="button" onClick={() => setOpen(false)} aria-label="Close search">Esc</button>
        </div>

        <div className="search-results" ref={listRef}>
          {results.length === 0 ? (
            <p className="search-empty">
              {loading ? "Loading…" : `No results for “${query}”.`}
            </p>
          ) : (
            results.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                data-idx={idx}
                className={`search-result${idx === active ? " is-active" : ""}`}
                onMouseMove={() => setActive(idx)}
                onClick={() => go(item)}
              >
                <span className="search-result-main">
                  <span className="search-result-title">{item.title}</span>
                  {item.subtitle && <span className="search-result-sub">{item.subtitle}</span>}
                </span>
                <span className="search-result-group">{item.group}</span>
              </button>
            ))
          )}
        </div>

        <div className="search-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
