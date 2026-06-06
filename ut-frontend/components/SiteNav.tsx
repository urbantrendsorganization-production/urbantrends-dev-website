"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import CountryFlag from "@/components/CountryFlag";

const LOGO = (
  <svg
    className="logo"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect className="logo-bar" x="2" y="14" width="4" height="8" rx="1.3" fillOpacity=".4" />
    <rect className="logo-bar" x="8" y="9" width="4" height="13" rx="1.3" fill="#22D3EE" fillOpacity=".7" />
    <rect className="logo-bar" x="14" y="4" width="4" height="18" rx="1.3" fill="#22D3EE" />
    <rect className="logo-bar" x="20" y="12" width="4" height="10" rx="1.3" fillOpacity=".4" />
  </svg>
);

const ARROW = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    width="14"
    height="14"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const PRODUCTS = [
  {
    name: "RentFlow",
    href: "/rentflow",
    pa: "#34D399",
    desc: "Property management with M-Pesa reconciliation",
    glyph: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5",
  },
  {
    name: "PortfolioU",
    href: "/portfoliou",
    pa: "#A78BFA",
    desc: "Two-sided student talent marketplace",
    glyph: "M9.5 9.8 14.5 14.2",
    glyphExtra: (
      <>
        <circle cx="7" cy="8" r="3" />
        <circle cx="17" cy="16" r="3" />
        <path d="M9.5 9.8 14.5 14.2" />
      </>
    ),
  },
  {
    name: "TrendyyLeads",
    href: "/trendyyleads",
    pa: "#FB923C",
    desc: "B2B lead generation, sourced and scored",
    glyph: "M3 4h18l-7 8v6l-4 2v-8z",
  },
  {
    name: "AcademyOS",
    href: "/academyos",
    pa: "#60A5FA",
    desc: "School management in one system",
    glyph: "M3 8l9-4 9 4-9 4zM7 10.5V15c0 1.5 2.2 2.5 5 2.5s5-1 5-2.5v-4.5",
  },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isProduct = [
    "/rentflow",
    "/portfoliou",
    "/trendyyleads",
    "/academyos",
    "/products",
  ].includes(pathname);

  function active(match: boolean) {
    return match ? ("page" as const) : undefined;
  }

  function openDD() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpen(true);
  }
  function closeDD() {
    setOpen(false);
  }
  function scheduleClose() {
    hoverTimer.current = setTimeout(closeDD, 80);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) {
        closeDD();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { closeDD(); setMobileOpen(false); }
    }
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
    <header className="nav">
      <div className="wrap nav-inner">
        <Link className="brand" href="/" aria-label="UrbanTrends home">
          {LOGO}
          <span className="word">
            urbantrends<span className="tld">.dev</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {/* Products mega-menu */}
          <div
            className="nav-dd"
            ref={ddRef}
            data-open={open ? "" : undefined}
            onMouseEnter={openDD}
            onMouseLeave={scheduleClose}
          >
            <button
              className="nav-link nav-dd-trigger"
              type="button"
              aria-haspopup="true"
              aria-expanded={open}
              aria-current={active(isProduct)}
              onClick={() => setOpen((o) => !o)}
            >
              Products
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <div className="nav-dd-panel" role="menu">
              <div className="dd-head">
                <span className="mono-label">The portfolio</span>
                <span className="dd-head-count">5 products</span>
              </div>
              <div className="dd-grid">
                {PRODUCTS.map((p) => (
                  <Link
                    key={p.name}
                    className="dd-item"
                    role="menuitem"
                    href={p.href}
                    style={{ "--pa": p.pa } as React.CSSProperties}
                    onClick={closeDD}
                  >
                    <span className="dd-glyph">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        {p.glyphExtra ? (
                          p.glyphExtra
                        ) : (
                          <path d={p.glyph} />
                        )}
                      </svg>
                    </span>
                    <span className="dd-tt">
                      <b>{p.name}</b>
                      <i>{p.desc}</i>
                    </span>
                  </Link>
                ))}

                {/* Developer Tools — full width */}
                <Link
                  className="dd-item dd-item-wide"
                  role="menuitem"
                  href="/docs"
                  style={{ "--pa": "#22D3EE" } as React.CSSProperties}
                  onClick={closeDD}
                >
                  <span className="dd-glyph">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M7 8l4 4-4 4M13 16h4" />
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                    </svg>
                  </span>
                  <span className="dd-tt">
                    <b>
                      Developer Tools{" "}
                      <span className="dd-badge">Free</span>
                    </b>
                    <i>Daraja Playground, Scaffold CLI &amp; small utilities</i>
                  </span>
                </Link>
              </div>

              <Link className="dd-foot" href="/products" onClick={closeDD}>
                Browse all products {ARROW}
              </Link>
            </div>
          </div>

          <Link
            className="nav-link"
            href="/services"
            aria-current={active(pathname === "/services")}
          >
            Services
          </Link>
          <Link
            className="nav-link"
            href="/docs"
            aria-current={active(pathname === "/docs")}
          >
            Developers
          </Link>
          <Link
            className="nav-link"
            href="/pricing"
            aria-current={active(pathname === "/pricing")}
          >
            Pricing
          </Link>
          <Link
            className="nav-link"
            href="/blog"
            aria-current={active(pathname === "/blog")}
          >
            Blog
          </Link>
          <Link
            className="nav-link"
            href="/changelog"
            aria-current={active(pathname === "/changelog")}
          >
            Changelog
          </Link>
          <Link
            className="nav-link"
            href="/about"
            aria-current={active(pathname === "/about")}
          >
            About
          </Link>
        </nav>

        <div className="nav-spacer" />

        <div className="nav-actions">
          <CountryFlag />
          <ThemeToggle />
          <button className="cmdk" type="button">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
            <span>Search</span>
            <span className="keys">⌘K</span>
          </button>
          <Link className="signin" href="/login">
            Sign in
          </Link>
          <Link className="btn btn-primary btn-sm" href="/signup">
            Start building
          </Link>
          <button
            className="nav-hamburger"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="hb" />
            <span className="hb" />
            <span className="hb" />
          </button>
        </div>
      </div>
    </header>

    {/* Mobile menu — position: fixed, rendered outside header flow */}
    <div className={`mobile-menu${mobileOpen ? " open" : ""}`} aria-hidden={!mobileOpen}>
      <nav className="mnav-section" aria-label="Site navigation">
        <span className="mnav-label">Products</span>
        {PRODUCTS.map((p) => (
          <Link
            key={p.name}
            className="mnav-sub"
            href={p.href}
            onClick={() => setMobileOpen(false)}
          >
            {p.name}
          </Link>
        ))}
        <span className="mnav-label">Pages</span>
        <Link className="mnav-link" href="/services" aria-current={active(pathname === "/services")} onClick={() => setMobileOpen(false)}>Services</Link>
        <Link className="mnav-link" href="/docs" aria-current={active(pathname === "/docs")} onClick={() => setMobileOpen(false)}>Developers</Link>
        <Link className="mnav-link" href="/pricing" aria-current={active(pathname === "/pricing")} onClick={() => setMobileOpen(false)}>Pricing</Link>
        <Link className="mnav-link" href="/blog" aria-current={active(pathname === "/blog")} onClick={() => setMobileOpen(false)}>Blog</Link>
        <Link className="mnav-link" href="/changelog" aria-current={active(pathname === "/changelog")} onClick={() => setMobileOpen(false)}>Changelog</Link>
        <Link className="mnav-link" href="/about" aria-current={active(pathname === "/about")} onClick={() => setMobileOpen(false)}>About</Link>
      </nav>
      <div className="mnav-divider" />
      <div className="mnav-actions">
        <Link className="btn btn-ghost" href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
        <Link className="btn btn-primary" href="/signup" onClick={() => setMobileOpen(false)}>Start building</Link>
      </div>
    </div>
    </>
  );
}
