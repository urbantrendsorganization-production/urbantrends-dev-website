"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioItem } from "@/lib/services";

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

// A small piece of past work for a single service: cover image, a short
// write-up, and a link to the live project. The grid reveals on scroll with a
// staggered fade; hover draws an accent underline and slides the link arrow.
export default function ServicePortfolio({
  items,
  accent,
}: {
  items: PortfolioItem[];
  accent: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!items.length) return null;

  return (
    <div
      className={`svc-portfolio${shown ? " is-shown" : ""}`}
      style={{ "--pa": accent } as React.CSSProperties}
    >
      <div className="svc-portfolio-head">
        <span className="eyebrow muted">Selected work</span>
        <span className="svc-portfolio-rule" aria-hidden="true" />
      </div>

      <div className="svc-portfolio-grid" ref={ref}>
        {items.map((item, i) => {
          const link = item.link_url?.trim();
          const CardTag = link ? "a" : "div";
          const linkProps = link
            ? isExternal(link)
              ? { href: link, target: "_blank", rel: "noopener noreferrer" }
              : { href: link }
            : {};
          return (
            <CardTag
              key={item.id}
              className={`svc-work-card${link ? " is-link" : ""}`}
              style={{ transitionDelay: `${Math.min(i, 6) * 70}ms` }}
              {...linkProps}
            >
              <div className="svc-work-media">
                {item.image ? (
                  // Cover can be an uploaded /media path or an external URL, so a
                  // plain img avoids next/image host allow-listing.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" loading="lazy" decoding="async" />
                ) : (
                  <span className="svc-work-noimg" aria-hidden="true">
                    {item.title.charAt(0)}
                  </span>
                )}
              </div>

              <div className="svc-work-body">
                {item.client && <span className="svc-work-client">{item.client}</span>}
                <h3 className="svc-work-title">{item.title}</h3>
                <p className="svc-work-desc">{item.description}</p>
                {link && (
                  <span className="svc-work-link">
                    {item.link_label || "View project"}
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                )}
              </div>
            </CardTag>
          );
        })}
      </div>
    </div>
  );
}
