"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Glitch 404, ported from the 21st.dev be-ui component to plain CSS (no
 * Tailwind / clsx / motion in this project). Keeps the RAF scramble effect and
 * the red/cyan chromatic-aberration layers on hover; styled with the site's
 * design tokens. Selectors are scoped under `.nf-*`.
 */

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/\\";
const SCRAMBLE_MS = 700;
const TICK_MS = 45;

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

function Scramble({ text }: { text: string }) {
  const reduce = usePrefersReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduce) {
      setDisplay(text);
      return;
    }

    const chars = text.split("");
    const start = performance.now();
    let raf = 0;
    let last = 0;

    const loop = (now: number) => {
      if (now - last >= TICK_MS) {
        last = now;
        const progress = Math.min((now - start) / SCRAMBLE_MS, 1);
        const settled = Math.floor(progress * chars.length);
        setDisplay(
          chars
            .map((ch, i) =>
              i < settled || ch === " "
                ? ch
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join(""),
        );
      }
      if (now - start < SCRAMBLE_MS) {
        raf = requestAnimationFrame(loop);
      } else {
        setDisplay(text);
      }
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [text, reduce]);

  return <span className="nf-num">{display}</span>;
}

export interface NotFoundProps {
  code?: string;
  title?: string;
  description?: string;
  homeHref?: string;
  homeLabel?: string;
  browseHref?: string;
  browseLabel?: string;
}

export function NotFoundGlitch({
  code = "404",
  title = "Page not found",
  description = "The page you are looking for does not exist or has been moved.",
  homeHref = "/",
  homeLabel = "Back home",
  browseHref = "/work",
  browseLabel = "See our work",
}: NotFoundProps) {
  return (
    <section className="nf-wrap">
      <style>{NF_CSS}</style>

      <div className="nf-code">
        <span aria-hidden className="nf-layer nf-red">
          <Scramble text={code} />
        </span>
        <span aria-hidden className="nf-layer nf-cyan">
          <Scramble text={code} />
        </span>
        <h1>
          <Scramble text={code} />
        </h1>
      </div>

      <div className="nf-meta">
        <p className="nf-title">{title}</p>
        <p className="nf-desc">{description}</p>
      </div>

      <div className="nf-actions">
        <Link href={homeHref} className="nf-btn nf-primary">
          {homeLabel}
        </Link>
        <Link href={browseHref} className="nf-btn nf-ghost">
          {browseLabel}
        </Link>
      </div>
    </section>
  );
}

const NF_CSS = `
.nf-wrap {
  min-height: 64vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 32px; padding: 88px 24px; text-align: center;
}
.nf-code {
  position: relative; user-select: none;
  font-family: var(--font-mono); font-weight: 700; line-height: 1;
  letter-spacing: -0.05em; color: var(--fg);
  font-size: clamp(5rem, 18vw, 11rem);
}
.nf-code h1 {
  position: relative; margin: 0;
  font-size: inherit; font-weight: inherit; letter-spacing: inherit; line-height: inherit;
}
.nf-layer {
  position: absolute; inset: 0; pointer-events: none;
  opacity: 0; mix-blend-mode: screen;
  transition: transform .15s ease-out, opacity .15s ease-out;
}
.nf-red  { color: #ff0040; }
.nf-cyan { color: #00e5ff; }
.nf-code:hover .nf-red  { transform: translateX(3px);  opacity: .7; }
.nf-code:hover .nf-cyan { transform: translateX(-3px); opacity: .7; }
.nf-num { font-variant-numeric: tabular-nums; }

.nf-meta { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.nf-title { margin: 0; font-size: 18px; font-weight: 600; color: var(--fg); }
.nf-desc  { margin: 0; max-width: 28rem; font-size: 14px; color: var(--fg-muted); line-height: 1.5; }

.nf-actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
.nf-btn {
  display: inline-flex; height: 40px; align-items: center; justify-content: center;
  border-radius: 9999px; padding: 0 20px;
  font-size: 14px; font-weight: 500; text-decoration: none;
  transition: transform .1s ease, background .15s ease, border-color .15s ease;
}
.nf-btn:active { transform: scale(.97); }
.nf-primary { background: var(--accent); color: var(--on-accent); }
.nf-primary:hover { background: color-mix(in srgb, var(--accent) 86%, #fff 14%); }
.nf-ghost { border: 1px solid var(--border); background: var(--surface-1); color: var(--fg); }
.nf-ghost:hover { background: var(--surface-2); border-color: var(--border-strong); }

@media (prefers-reduced-motion: reduce) {
  .nf-code:hover .nf-red, .nf-code:hover .nf-cyan { opacity: 0; transform: none; }
}
`;
