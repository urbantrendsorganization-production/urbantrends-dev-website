"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import CountryFlag from "@/components/CountryFlag";
import { ServicesDropdown, ServicesMobileGroup } from "@/components/ServicesNav";
import { getSession, logout, type AuthUser } from "@/lib/auth";

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

const VALID_CC = new Set([
  "ke","tz","ug","rw","et","ng","gh","za","eg",
  "us","gb","ca","au","in","sg","ae","de","fr",
  "nl","se","no","fi","jp","cn","kr","br","mx",
  "zm","mz","zw","bw","na","sn","ci",
]);

function getCC(pathname: string): string {
  const m = /^\/([a-z]{2})(\/|$)/.exec(pathname);
  if (m && VALID_CC.has(m[1])) return m[1];
  if (typeof document !== "undefined") {
    const c = document.cookie.match(/(?:^|;\s*)ut-country=([A-Z]{2})/);
    if (c) return c[1].toLowerCase();
  }
  return "ke";
}


export default function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function checkAuth() {
      getSession().then((r) => {
        setUser(r.meta?.is_authenticated && r.data?.user ? r.data.user as AuthUser : null);
      }).catch(() => setUser(null));
    }
    checkAuth();
    window.addEventListener("auth:changed", checkAuth);
    return () => window.removeEventListener("auth:changed", checkAuth);
  }, []);

  async function handleSignOut() {
    try {
      await logout();
    } catch { /* ok */ }
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const cc = getCC(pathname);
  const p = (slug: string) => `/${cc}/${slug}`;

  function active(match: boolean) {
    return match ? ("page" as const) : undefined;
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setMobileOpen(false); setUserMenuOpen(false); }
    }
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
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
          <Link
            className="nav-link"
            href={p("tools")}
            aria-current={active(pathname.includes("/tools"))}
          >
            Tools
          </Link>

          <ServicesDropdown base={`/${cc}`} isActive={pathname.includes("/services")} />
          <Link
            className="nav-link"
            href={p("products")}
            aria-current={active(pathname.endsWith("/products"))}
          >
            Products
          </Link>
          <Link
            className="nav-link"
            href={p("work")}
            aria-current={active(pathname.endsWith("/work"))}
          >
            Work
          </Link>
          <Link
            className="nav-link"
            href={p("docs")}
            aria-current={active(pathname.endsWith("/docs"))}
          >
            Developers
          </Link>
          <Link
            className="nav-link"
            href={p("blog")}
            aria-current={active(pathname.endsWith("/blog"))}
          >
            Blog
          </Link>
          <Link
            className="nav-link"
            href={p("changelog")}
            aria-current={active(pathname.endsWith("/changelog"))}
          >
            Changelog
          </Link>
          <Link
            className="nav-link"
            href={p("about")}
            aria-current={active(pathname.endsWith("/about"))}
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
          {user ? (
            <div className="nav-user-wrap" ref={userMenuRef} style={{ position: "relative" }}>
              <button
                className="nav-user-btn"
                type="button"
                aria-label="Account menu"
                onClick={() => setUserMenuOpen((o) => !o)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  padding: "4px 10px 4px 6px",
                  cursor: "pointer",
                  color: "var(--fg)",
                  fontSize: 13,
                }}
              >
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  {user.email[0].toUpperCase()}
                </span>
                <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </span>
              </button>
              {userMenuOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "6px 0",
                  minWidth: 160,
                  boxShadow: "0 4px 16px rgba(0,0,0,.12)",
                  zIndex: 100,
                }}>
                  <Link
                    href="/portal/orders"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      fontSize: 13,
                      color: "var(--fg)",
                      textDecoration: "none",
                    }}
                  >
                    My Orders
                  </Link>
                  <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      color: "var(--fg)",
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="signin" href="/login">Sign in</Link>
              <Link className="btn btn-primary btn-sm" href="/signup">Start building</Link>
            </>
          )}
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
        <Link className="mnav-link" href={p("tools")} aria-current={active(pathname.includes("/tools"))} onClick={() => setMobileOpen(false)}>Tools</Link>
        <ServicesMobileGroup base={`/${cc}`} isActive={pathname.includes("/services")} onNavigate={() => setMobileOpen(false)} />
        <Link className="mnav-link" href={p("products")} aria-current={active(pathname.endsWith("/products"))} onClick={() => setMobileOpen(false)}>Products</Link>
        <Link className="mnav-link" href={p("work")} aria-current={active(pathname.endsWith("/work"))} onClick={() => setMobileOpen(false)}>Work</Link>
        <Link className="mnav-link" href={p("docs")} aria-current={active(pathname.endsWith("/docs"))} onClick={() => setMobileOpen(false)}>Developers</Link>
        <Link className="mnav-link" href={p("blog")} aria-current={active(pathname.endsWith("/blog"))} onClick={() => setMobileOpen(false)}>Blog</Link>
        <Link className="mnav-link" href={p("changelog")} aria-current={active(pathname.endsWith("/changelog"))} onClick={() => setMobileOpen(false)}>Changelog</Link>
        <Link className="mnav-link" href={p("about")} aria-current={active(pathname.endsWith("/about"))} onClick={() => setMobileOpen(false)}>About</Link>
      </nav>
      <div className="mnav-divider" />
      <div className="mnav-actions">
        {user ? (
          <>
            <span style={{ fontSize: 12, color: "var(--fg-muted)", padding: "0 4px" }}>{user.email}</span>
            <Link className="btn btn-ghost" href="/portal/orders" onClick={() => setMobileOpen(false)}>My Orders</Link>
            <button className="btn btn-ghost" type="button" onClick={handleSignOut}>Sign out</button>
          </>
        ) : (
          <>
            <Link className="btn btn-ghost" href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
            <Link className="btn btn-primary" href="/signup" onClick={() => setMobileOpen(false)}>Start building</Link>
          </>
        )}
      </div>
    </div>
    </>
  );
}
