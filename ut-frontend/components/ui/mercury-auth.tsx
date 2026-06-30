"use client";

import { useEffect, useRef } from "react";

/**
 * Mercury "liquid metal" backdrop — just the gooey blob field + mouse parallax,
 * ported from the 21st.dev Neural Access component to plain CSS (no Tailwind).
 * Drop <MercuryBackdrop /> behind an auth form; it renders a fixed, full-screen
 * layer at z-index 0, so the form needs position:relative + z-index >= 1.
 *
 * Blob layout uses a SEEDED rng (not Math.random) so the server and client
 * render byte-identical markup — otherwise React throws a hydration mismatch.
 */

// Deterministic mulberry32 PRNG with a fixed seed → stable across SSR/CSR.
function seededBlobs() {
  let seed = 0x9e3779b9;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  // round to keep the serialized style strings short + identical everywhere
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return Array.from({ length: 6 }).map(() => ({
    size: r2(rand() * 200 + 150),
    left: r2(rand() * 80 + 10),
    top: r2(rand() * 80 + 10),
    delay: r2(rand() * -20),
    duration: r2(rand() * 15 + 15),
  }));
}

const BLOBS = seededBlobs();

export function MercuryBackdrop() {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      blobRefs.current.forEach((blob, i) => {
        if (!blob) return;
        const speed = (i + 1) * 20;
        // margin (not transform) so we don't clobber the float animation
        blob.style.marginLeft = `${x * speed}px`;
        blob.style.marginTop = `${y * speed}px`;
      });
    };

    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <style>{MERCURY_CSS}</style>

      <svg className="mercury-svg-filter" aria-hidden="true">
        <defs>
          <filter id="mercuryGooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="mercury-bg" aria-hidden="true">
        <div className="mercury-stage">
          {BLOBS.map((b, i) => (
            <div
              key={i}
              ref={(el) => {
                blobRefs.current[i] = el;
              }}
              className="mercury-blob"
              style={{
                width: `${b.size}px`,
                height: `${b.size}px`,
                left: `${b.left}%`,
                top: `${b.top}%`,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.duration}s`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

const MERCURY_CSS = `
.mercury-svg-filter { position: absolute; width: 0; height: 0; }

.mercury-bg {
  position: fixed; inset: 0; z-index: 0; overflow: hidden;
  background: #08090c;
}
.mercury-stage {
  position: absolute; inset: 0;
  filter: url('#mercuryGooey');
  opacity: 0.7;
}
.mercury-blob {
  position: absolute;
  background: linear-gradient(135deg, #7df0ff, #06b6d4);
  border-radius: 50%;
  filter: blur(18px) saturate(1.25);
  animation: mercuryFloat 20s infinite alternate ease-in-out;
  box-shadow: inset -10px -10px 22px rgba(0,40,52,.5), 14px 14px 60px rgba(34,211,238,.5);
  transition: margin .1s ease-out;
}
@keyframes mercuryFloat {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(10vw, 20vh) scale(1.2); }
  66%  { transform: translate(-5vw, 10vh) scale(.8); }
  100% { transform: translate(5vw, -10vh) scale(1.1); }
}
@media (prefers-reduced-motion: reduce) {
  .mercury-blob { animation: none; }
}
`;
