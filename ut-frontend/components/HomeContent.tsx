import Link from "next/link";
import Image from "next/image";
import LogoStrip from "@/components/LogoStrip";
import OrbitalTemplate from "@/components/hero/OrbitalTemplate";
import CodeTemplate from "@/components/hero/CodeTemplate";
import GridTemplate from "@/components/hero/GridTemplate";
import MinimalTemplate from "@/components/hero/MinimalTemplate";
import AuroraTemplate from "@/components/hero/AuroraTemplate";
import BentoTemplate from "@/components/hero/BentoTemplate";
import { getHomeData, getProjects, type SiteSettings, type HeroStat, type Partner, type Testimonial } from "@/lib/cms";
import { listServices, type Service } from "@/lib/services";
import ProjectCard from "@/components/ProjectCard";
import ProductShowcase from "@/components/ProductShowcase";
import CyberneticGridShader from "@/components/ui/cybernetic-grid-shader";
import { LampContainer } from "@/components/ui/lamp";
import RevealController from "@/components/ui/RevealController";

const FALLBACK_RAILS = ["TypeScript", "PostgreSQL", "Next.js", "Django", "Redis", "Docker"];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    quote: "They delivered a production system in five weeks. Not a prototype — a production system, tested, deployed, documented. Still running eighteen months later without a single outage.",
    author_name: "Michael Oduya", author_role: "CTO", company: "Kairo Systems",
    photo_url: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=80&q=80",
    product_label: "Custom Software", product_accent_color: "#34D399",
  },
  {
    quote: "The codebase they handed us was cleaner than anything our internal team had shipped. Every edge case handled, every type covered. We've maintained it ourselves for a year.",
    author_name: "Priya Shah", author_role: "VP Engineering", company: "Loopline",
    photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
    product_label: "Product Dev", product_accent_color: "#22D3EE",
  },
  {
    quote: "We told them what we needed. They pushed back once — correctly — then built exactly what they said, when they said. We don't entertain other vendors anymore.",
    author_name: "James Kariuki", author_role: "Engineering Lead", company: "Baobab Cloud",
    photo_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&q=80",
    product_label: "API Work", product_accent_color: "#A78BFA",
  },
];

function HeroArt({ template }: { template: SiteSettings["active_hero_template"] }) {
  switch (template) {
    case "code":    return <CodeTemplate />;
    case "grid":    return <GridTemplate />;
    case "minimal": return <MinimalTemplate />;
    case "aurora":  return <AuroraTemplate />;
    case "bento":   return <BentoTemplate />;
    default:        return <OrbitalTemplate />;
  }
}

const FALLBACK_SERVICES: Service[] = [
  {
    id: 0, slug: "product-development", is_featured: true, order: 0,
    accent_color: "#22D3EE", category_name: "End-to-end", category_slug: "end-to-end",
    icon_path: "M13 2 3 14h7l-1 8 10-12h-7z",
    name: "Product Development",
    tagline: "From idea to shipped product — design, backend, frontend, and deployment.",
    plans: [],
  },
  {
    id: 0, slug: "custom-software", is_featured: false, order: 1,
    accent_color: "#34D399", category_name: "Bespoke", category_slug: "bespoke",
    icon_path: "M7 8l4 4-4 4M13 16h4M3 4h18v16H3",
    name: "Custom Software",
    tagline: "Tailored systems for specific business processes — inventory, finance, compliance.",
    plans: [],
  },
  {
    id: 0, slug: "api-integrations", is_featured: false, order: 2,
    accent_color: "#A78BFA", category_name: "Connect everything", category_slug: "integrations",
    icon_path: "M12 2v6m0 8v6M2 12h6m8 0h6",
    name: "API & Integrations",
    tagline: "Payment gateways, banking APIs, ERP connectors, webhooks — we build the plumbing.",
    plans: [],
  },
  {
    id: 0, slug: "developer-tools", is_featured: false, order: 3,
    accent_color: "#FB923C", category_name: "Open & documented", category_slug: "tools",
    icon_path: "M4 19V5l8 4 8-4v14l-8 4z",
    name: "Developer Tools & SDKs",
    tagline: "SDKs, CLIs, and libraries built to the standard we'd want to use ourselves.",
    plans: [],
  },
  {
    id: 0, slug: "design-systems", is_featured: false, order: 4,
    accent_color: "#60A5FA", category_name: "Product design", category_slug: "design",
    icon_path: "M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z",
    name: "Design & UX",
    tagline: "Product design, UX flows, and design systems. Functional first, beautiful second.",
    plans: [],
  },
  {
    id: 0, slug: "consulting", is_featured: false, order: 5,
    accent_color: "#34D399", category_name: "Architecture & audit", category_slug: "consulting",
    icon_path: "M9 12l2 2 4-4M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z",
    name: "Technical Consulting",
    tagline: "Architecture reviews, code audits, scaling strategy, and technical due diligence.",
    plans: [],
  },
];

const ARROW_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default async function HomeContent() {
  const [{ settings, stats, partners_rails, partners_trusted, testimonials }, apiServices, allProjects] = await Promise.all([
    getHomeData(),
    listServices().catch(() => []),
    getProjects().catch(() => []),
  ]);

  const services = apiServices.length > 0 ? apiServices : FALLBACK_SERVICES;
  // Show featured projects first, then fill up to 4 cards with the most recent
  // remaining work. Anything beyond that lives on the /work page.
  const projects = [...allProjects]
    .sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
    .slice(0, 4);

  const railsItems = partners_rails.length > 0
    ? partners_rails.map((p: Partner) => p.name)
    : FALLBACK_RAILS;

  const displayTestimonials = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;

  return (
    <>
      <RevealController />
      <noscript>
        <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg">
          <Image
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1800&q=55"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover", opacity: .22 }}
            priority
            aria-hidden="true"
          />
        </div>

        <div className="hero-shader">
          <CyberneticGridShader />
        </div>

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
                {settings.hero_secondary_cta_text} <span className="kbd">⌘</span>
              </a>
            </div>
            <div className="hero-meta">
              {stats.map((s: HeroStat) => (
                <div key={s.label} className="stat">
                  <div className="n">{s.value}</div>
                  <div className="l">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="hero-photo-card">
              <div className="hpc-a">
                <Image fill sizes="(max-width: 920px) 50vw, 260px" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=560&q=80" alt="Team collaborating on software" style={{ objectFit: "cover" }} />
              </div>
              <div className="hpc-b">
                <Image fill sizes="(max-width: 920px) 33vw, 180px" src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&q=80" alt="Developer writing code" style={{ objectFit: "cover" }} />
              </div>
              <div className="hpc-c">
                <Image fill sizes="(max-width: 920px) 33vw, 180px" src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80" alt="Software team at work" style={{ objectFit: "cover" }} />
              </div>
            </div>
          </div>

          <div className="hero-art">
            <HeroArt template={settings.active_hero_template} />
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <div className="trust">
        <div className="wrap trust-inner">
          <span className="lab">{settings.trust_strip_label}</span>
          <div className="marks">
            {railsItems.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CUSTOMER LOGO STRIP ===== */}
      <LogoStrip
        partners={partners_trusted.length > 0 ? partners_trusted : undefined}
        label={settings.logo_strip_label}
      />

      {/* ===== SERVICES ===== */}
      <section className="section" id="services" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow muted">What we build</span>
            <h2>Software that earns its keep.</h2>
            <p>From end-to-end product development to targeted integrations and consulting — we build whatever the operation needs, then stand behind it.</p>
          </div>
          <div className="home-svc-grid">
            {services.map((svc: Service, i: number) => (
              <Link
                key={svc.slug}
                className="hsvc-card"
                href={`/services/${svc.slug}`}
                data-reveal
                style={{ "--pa": svc.accent_color, "--reveal-delay": `${(i % 3) * 0.07}s` } as React.CSSProperties}
              >
                <div className="hsvc-top">
                  <span className="pglyph">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d={svc.icon_path} />
                    </svg>
                  </span>
                  <span className="hsvc-tag">{svc.category_name}</span>
                </div>
                <h3>{svc.name}</h3>
                <p className="hsvc-desc">{svc.tagline}</p>
                <div className="hsvc-foot">
                  See how we work {ARROW_SVG}
                </div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
            <Link
              href="/services"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 14, fontWeight: 600, color: "var(--accent-text)",
                textDecoration: "none",
              }}
            >
              Browse all services
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section className="section products" id="products" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow muted">Our products</span>
            <h2>Software we ship and run.</h2>
            <p>Not just client work — production systems we build, operate, and stand behind. From M-Pesa reconciliation to encrypted chat.</p>
          </div>
          <div data-reveal>
            <ProductShowcase />
          </div>
          <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
            <Link
              href="/products"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 14, fontWeight: 600, color: "var(--accent-text)",
                textDecoration: "none",
              }}
            >
              Explore all products
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW WE WORK ===== */}
      <section className="section" id="process" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow muted">How we work</span>
            <h2>From kickoff to production.</h2>
            <p>A tight, transparent loop. No black boxes, no surprise invoices — you see the work take shape every week.</p>
          </div>
          <div className="process-grid">
            {[
              { n: "01", t: "Scope", d: "We map the problem, pin the constraints, and agree on what 'done' means before a line is written." },
              { n: "02", t: "Design", d: "Architecture, data model, and UX flows — reviewed with you so there are no surprises in the build." },
              { n: "03", t: "Build", d: "Typed end-to-end, CI on every commit, shipped to a preview URL you can click through weekly." },
              { n: "04", t: "Ship", d: "Zero-downtime deploy, docs handed over, and support while it beds in. Then it's yours." },
            ].map((s, i) => (
              <div key={s.n} className="process-step" data-reveal style={{ "--reveal-delay": `${i * 0.09}s` } as React.CSSProperties}>
                <span className="process-num">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECENT WORK ===== */}
      <section className="section" id="work" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="wrap">
            <div className="section-head" data-reveal>
              <span className="eyebrow muted">Recent work</span>
              <h2>Shipped, deployed, still running.</h2>
              <p>A few of the products and systems we&apos;ve built and put into production lately.</p>
            </div>

            <div className="work-showcase">
              <figure className="work-shot" data-reveal>
                <Image
                  src="/images/showcase/multi-device.jpg"
                  alt="A product build shown across laptop, tablet, and phone"
                  fill
                  sizes="(max-width: 760px) 100vw, 56vw"
                  style={{ objectFit: "cover" }}
                />
                <figcaption>Responsive across every device</figcaption>
              </figure>
              <figure className="work-shot" data-reveal style={{ "--reveal-delay": "0.08s" } as React.CSSProperties}>
                <Image
                  src="/images/showcase/laptop-windows.jpg"
                  alt="An end-to-end web platform shown on a laptop"
                  fill
                  sizes="(max-width: 760px) 100vw, 40vw"
                  style={{ objectFit: "cover" }}
                />
                <figcaption>Designed &amp; shipped end-to-end</figcaption>
              </figure>
            </div>

            {projects.length > 0 && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                    gap: 22,
                  }}
                >
                  {projects.map((project, i) => (
                    <div key={project.slug} data-reveal style={{ "--reveal-delay": `${(i % 4) * 0.07}s` } as React.CSSProperties}>
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
                  <Link
                    href="/work"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 14, fontWeight: 600, color: "var(--accent-text)",
                      textDecoration: "none",
                    }}
                  >
                    View all work
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

      {/* ===== ENGINEERING QUALITY ===== */}
      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="wrap kenya-grid">
          <div data-reveal>
            <span className="eyebrow muted">Engineering quality</span>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.04, letterSpacing: "-0.03em", fontWeight: 600 }}>
              Shipped right. Not just shipped.
            </h2>
            <p style={{ margin: "16px 0 0", color: "var(--fg-muted)", maxWidth: "48ch" }}>
              Production defaults from day one — typed end-to-end, CI on every commit, deployed without downtime. The kind of codebase you can hand off on a Friday and not think about until Monday.
            </p>
            <div className="kenya-chips">
              <span className="chip"><span className="tick" />Type-safe end-to-end</span>
              <span className="chip"><span className="tick" />CI/CD on every commit</span>
              <span className="chip"><span className="tick" />Zero-downtime deploys</span>
              <span className="chip"><span className="tick" />Automated test suites</span>
              <span className="chip"><span className="tick" />Edge deployment</span>
              <span className="chip"><span className="tick" />99.96% uptime</span>
            </div>
            <p className="kenya-note">
              {"// "}<b>Deploy at 23:47 on a Friday.</b>{" "}Types check. Tests pass. Container ships. Your Monday morning is yours.
            </p>
          </div>
          <div data-reveal style={{ "--reveal-delay": "0.1s" } as React.CSSProperties}>
            <div className="kenya-img-wrap">
              <Image fill sizes="(max-width: 920px) 100vw, 50vw" src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80" alt="Engineers reviewing code" style={{ objectFit: "cover" }} />
            </div>
            <div className="code-window">
              <div className="code-bar">
                <div className="tl"><i /><i /><i /></div>
                <span className="fname">schema.ts</span>
                <span className="lang">TypeScript</span>
              </div>
              <pre className="code">{`\
`}<span className="c">{'// '}Single source of truth for every layer.</span>{`
`}<span className="k">export const</span>{` `}<span className="v">UserSchema</span>{` = z.object({
  id:        z.string().cuid2(),
  email:     z.string().email(),
  role:      z.enum([`}<span className="s">&quot;admin&quot;</span>{`, `}<span className="s">&quot;member&quot;</span>{`]),
  createdAt: z.date(),
});

`}<span className="k">export type</span>{` `}<span className="v">User</span>{` = z.infer<`}<span className="k">typeof</span>{` UserSchema>;

`}<span className="p">{"// Frontend · backend · database — same type."}</span>{`
`}<span className="p">{"// → 0 casts · 0 any's · ships Friday"}</span></pre>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENTO CAPABILITIES ===== */}
      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow muted">Built in, not bolted on</span>
            <h2>Production defaults from commit one.</h2>
            <p>The things teams usually retrofit under pressure — we wire them in from the start.</p>
          </div>
          <div className="bento-grid">
            <div className="bento-tile bento-lg" data-reveal>
              <span className="bento-tag">// always-on</span>
              <h3>Observable, resilient, awake at 3AM so you aren&apos;t.</h3>
              <p>Health checks, structured logs, alerting, and graceful failure baked into every service we ship.</p>
              <div className="bento-orb">
                <div className="bento-orb-grid" />
              </div>
            </div>

            <div className="bento-tile" data-reveal style={{ "--reveal-delay": "0.06s" } as React.CSSProperties}>
              <span className="bento-glyph">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M7 8l4 4-4 4M13 16h4M3 4h18v16H3" /></svg>
              </span>
              <h3>Type-safe end to end</h3>
              <p>One schema, zero casts — frontend, backend, and database share the same types.</p>
            </div>

            <div className="bento-tile" data-reveal style={{ "--reveal-delay": "0.12s" } as React.CSSProperties}>
              <span className="bento-glyph">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg>
              </span>
              <h3>Zero-downtime deploys</h3>
              <p>Ship on a Friday. Rollbacks are one click; users never see a blip.</p>
            </div>

            <div className="bento-tile bento-wide" data-reveal style={{ "--reveal-delay": "0.06s" } as React.CSSProperties}>
              <span className="bento-tag">// p95 latency, trailing 24h</span>
              <h3>Fast by measurement, not by vibes.</h3>
              <div className="bento-bars">
                {[0.5, 0.7, 0.45, 0.8, 0.6, 0.9, 0.55, 0.75, 0.5, 0.85, 0.65, 0.7].map((_, i) => (
                  <i key={i} style={{ animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            </div>

            <div className="bento-tile" data-reveal style={{ "--reveal-delay": "0.12s" } as React.CSSProperties}>
              <span className="bento-tag">// uptime</span>
              <div className="bento-spacer" />
              <div className="bento-stat">99.96%</div>
              <p>Trailing 90 days, across every service in production.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow muted">The work speaks for itself</span>
            <h2>Companies that run on what we build.</h2>
            <p>Real teams. Real software. No testimonial theatre.</p>
          </div>
          <div className="testimonials-grid">
            {displayTestimonials.map((t: Testimonial, i: number) => (
              <div key={i} className="tcard" data-reveal style={{ "--reveal-delay": `${(i % 3) * 0.07}s` } as React.CSSProperties}>
                {typeof t.rating === "number" && (
                  <div className="tstars" aria-label={`${t.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <svg key={n} viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true" style={{ color: n <= t.rating! ? "#F59E0B" : "var(--border-strong, #444)" }}>
                        <path d="M12 2l2.9 6.26 6.9.54-5.24 4.5 1.6 6.7L12 16.9 5.84 20.5l1.6-6.7L2.2 8.8l6.9-.54L12 2z" />
                      </svg>
                    ))}
                  </div>
                )}
                <p className="tquote">&ldquo;{t.quote}&rdquo;</p>
                <div className="tfoot">
                  <div className="tavatar">
                    {t.photo_url ? (
                      <Image fill sizes="40px" src={t.photo_url} alt={t.author_name} style={{ objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-muted)" }}>
                        {t.author_name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="tname">{t.author_name}</div>
                    <div className="trole">{[t.author_role, t.company].filter(Boolean).join(", ")}</div>
                  </div>
                  {t.product_label && (
                    <span className="tprod" style={{ "--pa": t.product_accent_color } as React.CSSProperties}>
                      {t.product_label}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STACK / INTEGRATIONS ===== */}
      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow muted">The stack we build on</span>
            <h2>Boring tech where it counts. Sharp tech where it pays.</h2>
            <p>Proven, well-supported tools — plus the integrations that connect your business to the rest of the world.</p>
          </div>
          <div className="stack-grid">
            {[
              { m: "TS", n: "TypeScript", c: "Language" },
              { m: "Nx", n: "Next.js", c: "Frontend" },
              { m: "Re", n: "React", c: "UI" },
              { m: "Dj", n: "Django", c: "Backend" },
              { m: "Py", n: "Python", c: "Language" },
              { m: "Pg", n: "PostgreSQL", c: "Database" },
              { m: "Rd", n: "Redis", c: "Cache / Queue" },
              { m: "Dk", n: "Docker", c: "Runtime" },
              { m: "K8", n: "Kubernetes", c: "Orchestration" },
              { m: "AWS", n: "AWS", c: "Cloud" },
              { m: "Vc", n: "Vercel", c: "Edge / Deploy" },
              { m: "St", n: "Stripe", c: "Payments" },
              { m: "GQL", n: "GraphQL", c: "API" },
              { m: "Gh", n: "GitHub", c: "CI / CD" },
            ].map((s, i) => (
              <div key={s.n} className="stack-item" data-reveal style={{ "--reveal-delay": `${(i % 7) * 0.05}s` } as React.CSSProperties}>
                <span className="stack-mono">{s.m}</span>
                <span className="stack-meta">
                  <span className="stack-name">{s.n}</span>
                  <span className="stack-cat">{s.c}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TOOLS ===== */}
      <section className="section" id="tools" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow muted">Tool-led, not gated</span>
            <h2>Free tools we built because we needed them.</h2>
            <p>No email wall, no trial clock. If it saves us an afternoon, it&apos;ll save you one too.</p>
          </div>
          <div className="tools-grid">
            <div className="tool" data-reveal>
              <div className="thead">
                <span className="ticon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" /></svg></span>
                <h4>Inspector</h4><span className="free">Free</span>
              </div>
              <p>Intercept, inspect, and replay HTTP requests in real-time. Debug webhooks and API calls without touching Postman.</p>
              <div className="cmd"><span className="pr">$</span> inspector.urbantrends.dev <span className="cp">open</span></div>
            </div>
            <div className="tool" data-reveal>
              <div className="thead">
                <span className="ticon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v18M3 7l9-4 9 4M3 17l9 4 9-4" /></svg></span>
                <h4>Scaffold</h4><span className="free">Free</span>
              </div>
              <p>Generate a type-safe backend from your database schema in one command. Typed routes, migrations, and tests included.</p>
              <div className="cmd"><span className="pr">$</span> npx @ut/scaffold init <span className="cp">copy</span></div>
            </div>
            <div className="tool" data-reveal>
              <div className="thead">
                <span className="ticon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18M8 14h5" /></svg></span>
                <h4>OG Studio</h4><span className="free">Free</span>
              </div>
              <p>Programmatic social cards from a URL. Drop in a template, pass params, get a crisp 1200×630 every time.</p>
              <div className="cmd"><span className="pr">$</span> og.urbantrends.dev/new <span className="cp">copy</span></div>
            </div>
          </div>
          <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
            <Link
              href="/tools"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 14, fontWeight: 600, color: "var(--accent-text)",
                textDecoration: "none",
              }}
            >
              Browse all tools
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA BAND (lamp) ===== */}
      <LampContainer>
        <h2 className="lamp-title">Let&apos;s build something serious.</h2>
        <p className="lamp-sub">Tell us what you&apos;re running. We&apos;ll scope it, price it fairly, and build it properly.</p>
        <div className="hero-cta" style={{ marginTop: 24, justifyContent: "center" }}>
          <Link className="btn btn-primary" href="/services">
            Our services
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
          <Link className="btn btn-ghost" href="/contact">Talk to the team</Link>
        </div>
      </LampContainer>
    </>
  );
}
