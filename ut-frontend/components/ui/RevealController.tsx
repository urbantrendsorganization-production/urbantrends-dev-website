"use client";

import { useEffect } from "react";

/**
 * Mounts once on the home page and drives scroll-reveal for every element
 * tagged `data-reveal`. Server-rendered markup stays intact; this just toggles
 * `.in-view` as elements enter the viewport (one-shot via unobserve). Falls
 * back to revealing everything if IntersectionObserver is unavailable.
 *
 * Pair with the `[data-reveal]` CSS in globals.css. Stagger via an inline
 * `--reveal-delay` custom property on each item.
 */
export default function RevealController() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
