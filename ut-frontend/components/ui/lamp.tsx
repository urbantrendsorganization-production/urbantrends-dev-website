"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Lamp section header, ported from the 21st.dev component to plain CSS so it
 * fits this project (no Tailwind / framer-motion). The conic "light cones",
 * glow, and reveal live in globals.css under `.lamp`; the scroll-triggered
 * reveal is an IntersectionObserver toggling `.in-view` (the framer-motion
 * `whileInView` equivalent), and it respects prefers-reduced-motion.
 */
export function LampContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`lamp${inView ? " in-view" : ""}${className ? ` ${className}` : ""}`}
    >
      <div className="lamp-stage" aria-hidden="true">
        <div className="lamp-cone lamp-cone-left">
          <div className="lamp-cut-bottom" />
          <div className="lamp-cut-side" />
        </div>
        <div className="lamp-cone lamp-cone-right">
          <div className="lamp-cut-side" />
          <div className="lamp-cut-bottom" />
        </div>
        <div className="lamp-floor-blur" />
        <div className="lamp-glow" />
        <div className="lamp-spot" />
        <div className="lamp-line" />
        <div className="lamp-top-mask" />
      </div>

      <div className="lamp-content">{children}</div>
    </div>
  );
}
