"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { listServices, type Service } from "@/lib/services";

type Group = { name: string; slug: string; services: Service[] };

// Shared fetch + grouping. Services are grouped by category, preserving the
// API's ordering (which is category order → service order).
function useServiceGroups(): Group[] {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    let alive = true;
    listServices()
      .then((s) => { if (alive) setServices(s); })
      .catch(() => { /* leave empty — trigger falls back to a plain link */ });
    return () => { alive = false; };
  }, []);

  return useMemo(() => {
    const map = new Map<string, Group>();
    for (const s of services) {
      const key = s.category_slug || "other";
      if (!map.has(key)) {
        map.set(key, { name: s.category_name || "Services", slug: key, services: [] });
      }
      map.get(key)!.services.push(s);
    }
    return [...map.values()];
  }, [services]);
}

function Glyph({ service }: { service: Service }) {
  return (
    <span className="dd-glyph" style={{ "--pa": service.accent_color } as React.CSSProperties}>
      {service.icon_path ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d={service.icon_path} />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="3" />
        </svg>
      )}
    </span>
  );
}

/* ============================ Desktop dropdown ============================ */

export function ServicesDropdown({
  base,
  isActive,
}: {
  base: string; // country-prefixed base, e.g. "/ke"
  isActive: boolean;
}) {
  const groups = useServiceGroups();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const servicesHref = `${base}/services`;

  const close = useCallback((focusTrigger = false) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.stopPropagation(); close(true); }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Roving focus with arrow keys across panel links.
  function onPanelKeyDown(e: React.KeyboardEvent) {
    const items = panelRef.current?.querySelectorAll<HTMLAnchorElement>("a.dd-item, a.dd-foot");
    if (!items || items.length === 0) return;
    const list = Array.from(items);
    const idx = list.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      list[idx < 0 ? 0 : Math.min(idx + 1, list.length - 1)].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (idx <= 0) triggerRef.current?.focus();
      else list[idx - 1].focus();
    } else if (e.key === "Home") {
      e.preventDefault(); list[0].focus();
    } else if (e.key === "End") {
      e.preventDefault(); list[list.length - 1].focus();
    }
  }

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => {
        panelRef.current?.querySelector<HTMLAnchorElement>("a.dd-item")?.focus();
      });
    }
  }

  // No services yet (loading or empty) → behave as a plain link to /services.
  if (groups.length === 0) {
    return (
      <Link className="nav-link" href={servicesHref} aria-current={isActive ? "page" : undefined}>
        Services
      </Link>
    );
  }

  return (
    <div
      className="nav-dd"
      ref={wrapRef}
      data-open={open ? "" : undefined}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        className="nav-link nav-dd-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-current={isActive ? "page" : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
        onMouseEnter={() => setOpen(true)}
      >
        Services
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div className="nav-dd-panel" ref={panelRef} role="menu" aria-label="Services" onKeyDown={onPanelKeyDown}>
        <div className="dd-head">
          <span className="mono-label">Services</span>
          <span className="dd-head-count">
            {groups.reduce((n, g) => n + g.services.length, 0)} offerings
          </span>
        </div>

        {groups.map((g) => (
          <div key={g.slug}>
            <div className="dd-cat-label">{g.name}</div>
            <div className="dd-grid">
              {g.services.map((s) => (
                <Link
                  key={s.slug}
                  role="menuitem"
                  className="dd-item"
                  href={`${base}/services/${s.slug}`}
                  style={{ "--pa": s.accent_color } as React.CSSProperties}
                  onClick={() => close()}
                >
                  <Glyph service={s} />
                  <span className="dd-tt">
                    <b>
                      {s.name}
                      {s.is_featured && <span className="dd-badge">Featured</span>}
                    </b>
                    <i>{s.tagline}</i>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <Link role="menuitem" className="dd-foot" href={servicesHref} onClick={() => close()}>
          View all services
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ============================ Mobile accordion ============================ */

export function ServicesMobileGroup({
  base,
  isActive,
  onNavigate,
}: {
  base: string;
  isActive: boolean;
  onNavigate: () => void;
}) {
  const groups = useServiceGroups();
  const [open, setOpen] = useState(false);
  const servicesHref = `${base}/services`;

  if (groups.length === 0) {
    return (
      <Link className="mnav-link" href={servicesHref} aria-current={isActive ? "page" : undefined} onClick={onNavigate}>
        Services
      </Link>
    );
  }

  return (
    <div className="mnav-group">
      <button
        type="button"
        className="mnav-link mnav-accordion"
        aria-expanded={open}
        aria-current={isActive ? "page" : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        Services
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
          aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .18s ease", marginLeft: "auto", width: 16, height: 16 }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="mnav-accordion-body">
          {groups.map((g) => (
            <div key={g.slug}>
              <div className="mnav-sub-label">{g.name}</div>
              {g.services.map((s) => (
                <Link key={s.slug} className="mnav-sub" href={`${base}/services/${s.slug}`} onClick={onNavigate}>
                  {s.name}
                </Link>
              ))}
            </div>
          ))}
          <Link className="mnav-sub mnav-sub-all" href={servicesHref} onClick={onNavigate}>
            View all services →
          </Link>
        </div>
      )}
    </div>
  );
}
