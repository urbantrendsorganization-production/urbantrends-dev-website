import Image from "next/image";
import type { HeroStat, SiteSettings } from "@/lib/cms";
import type { Product } from "@/components/ProductShowcase";
import HeroTilt from "@/components/hero/HeroTilt";

/**
 * The homepage hero.
 *
 * Layout note: every track here is sized with
 * `repeat(auto-fit, minmax(min(100%, Npx), 1fr))` and every grid/flex child
 * carries `min-width: 0`. That combination is what keeps the right-hand column
 * from pushing the page wider than the viewport on narrow screens — a grid
 * item's default `min-width: auto` refuses to shrink below its content, and a
 * single long capability label or stack chip is enough to blow the layout out.
 * Please keep both when editing.
 */

type Props = {
  settings: SiteSettings;
  stats: HeroStat[];
  /** Drives the "what we build" grid — real service names, not a static list. */
  capabilities: string[];
  /** Drives the stack chips. */
  stack: string[];
  products: Product[];
};

const THUMBS = [
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=560&q=80",
    alt: "Team collaborating on software",
  },
  {
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&q=80",
    alt: "Developer writing code",
  },
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80",
    alt: "Software team at work",
  },
];

export default function StudioHero({
  settings,
  stats,
  capabilities,
  stack,
  products,
}: Props) {
  const liveCount = products.filter((p) => p.status === "live").length;

  return (
    <div className="wrap hero-grid">
      <div className="hero-copy">
        <span className="eyebrow">
          <span className="dot-led" />
          {settings.hero_eyebrow}
        </span>

        <h1>{settings.hero_headline}</h1>

        <p className="sub">{settings.hero_subheading}</p>

        <div className="hero-cta">
          <a className="btn btn-primary" href={settings.hero_primary_cta_url}>
            {settings.hero_primary_cta_text}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a className="btn btn-ghost" href={settings.hero_secondary_cta_url}>
            {settings.hero_secondary_cta_text} <span className="kbd">⌘K</span>
          </a>
        </div>

        <div className="hero-rule" />

        <div className="hero-meta">
          {stats.map((s: HeroStat) => (
            <div key={s.label} className="stat">
              <div className="n">{s.value}</div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <HeroTilt className="hero-panel">
        <figure className="hero-media" data-tilt="media">
          <Image
            src="/images/showcase/multi-device.jpg"
            alt="A product build shown across laptop, tablet, and phone"
            fill
            sizes="(max-width: 920px) 100vw, 46vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <span className="hero-media-scrim" aria-hidden="true" />

          {liveCount > 0 && (
            <span className="hero-media-badge">
              <span className="dot-live" />
              LIVE · {liveCount} {liveCount === 1 ? "PRODUCT" : "PRODUCTS"}
            </span>
          )}

          <figcaption className="hero-media-foot">
            <span className="hmf-copy">
              <span className="hmf-title">End-to-end delivery</span>
              <span className="hmf-sub">strategy → ship → operate</span>
            </span>
            <span className="hmf-tag">zero-downtime</span>
          </figcaption>
        </figure>

        <div className="hero-card" data-tilt="board">
          <div className="hero-card-head">
            <span className="mono-label">WHAT WE BUILD</span>
            <span className="mono-count">
              {String(capabilities.length).padStart(2, "0")}
            </span>
          </div>

          <ul className="hero-caps">
            {capabilities.map((c) => (
              <li key={c} className="hero-cap">
                <span className="cap-mark" aria-hidden="true" />
                <span className="cap-name">{c}</span>
              </li>
            ))}
          </ul>

          {stack.length > 0 && (
            <>
              <div className="hero-card-rule" />
              <div className="hero-stack">
                <span className="mono-label">STACK</span>
                {stack.map((t) => (
                  <span key={t} className="hero-chip">
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="hero-thumbs">
          {THUMBS.map((t) => (
            <div key={t.src} className="hero-thumb">
              <Image
                src={t.src}
                alt={t.alt}
                fill
                sizes="(max-width: 920px) 30vw, 150px"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </HeroTilt>
    </div>
  );
}
