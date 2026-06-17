import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developers",
  description:
    "Build integrations on Africa's payment and product infrastructure. Join the UrbanTrends developer community.",
};

const PRODUCTS = [
  {
    name: "RentFlow",
    pa: "#34D399",
    tagline: "Plug rent payments and M-Pesa reconciliation into your property app.",
    available: true,
  },
  {
    name: "PortfolioU",
    pa: "#A78BFA",
    tagline: "Access the talent shortlist API to match candidates to roles.",
    available: false,
  },
  {
    name: "TrendyyLeads",
    pa: "#FB923C",
    tagline: "Pull enriched, scored leads directly into your CRM.",
    available: false,
  },
  {
    name: "AcademyOS",
    pa: "#60A5FA",
    tagline: "Integrate fee collection and grade reporting into school portals.",
    available: false,
  },
  {
    name: "Developer Tools",
    pa: "#22D3EE",
    tagline: "Daraja Playground, Scaffold CLI, and OG Studio — free to use.",
    available: true,
  },
];

const STACK = [
  "Next.js",
  "Django",
  "TypeScript",
  "Python",
  "M-Pesa / Daraja",
  "WebAuthn",
  "PostgreSQL",
  "Resend",
];

const TOOLS = [
  {
    name: "Daraja Playground",
    desc: "Browser sandbox for STK Push and callbacks. No Postman. No setup.",
    cmd: "open daraja.urbantrends.dev",
    pr: "$",
  },
  {
    name: "Scaffold CLI",
    desc: "Generates a wired Daraja backend with typed routes, callback handler, and .env template.",
    cmd: "npx @urbantrends/scaffold my-app",
    pr: "$",
  },
  {
    name: "OG Studio",
    desc: "Programmatic 1200×630 Open Graph cards from a URL. Useful for blog posts, docs, and product cards.",
    cmd: "og.urbantrends.dev/new?title=...",
    pr: "→",
  },
];

export default function DocsPage() {
  return (
    <>
      {/* ── 1. Hero ── */}
      <section className="page-head" data-screen-label="Developers">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Developers</span>
          </div>
          <span className="eyebrow" style={{ marginBottom: 18, display: "inline-flex" }}>
            <span className="dot-led" />
            For developers
          </span>
          <h1 className="page-title">
            Build on Africa&apos;s{" "}
            <span className="em">payment infrastructure.</span>
          </h1>
          <p className="page-lead">
            UrbanTrends exposes the same Daraja, M-Pesa, and reconciliation
            primitives our products run on. Use them in your own apps,
            integrations, and services.
          </p>
          <div className="hero-cta" style={{ marginTop: 32 }}>
            <a className="btn btn-primary" href="#community">
              Join the community
            </a>
            <a className="btn btn-ghost" href="#tools">
              Explore the tools
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. Integration surface ── */}
      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow muted">Integration surface</span>
            <h2>
              Five products.{" "}
              <span className="em">One platform to build on.</span>
            </h2>
            <p>
              Each product in our portfolio exposes an API surface. Connect your
              app to the data and workflows that matter to your users.
            </p>
          </div>

          <div className="dev-grid">
            {PRODUCTS.map((p) => (
              <div
                key={p.name}
                className="dev-card"
                style={{ "--pa": p.pa } as React.CSSProperties}
              >
                <div className="dev-card-top">
                  <span className="dev-card-name">{p.name}</span>
                  <span
                    className="dev-card-badge"
                    data-available={p.available ? "" : undefined}
                  >
                    {p.available ? "Available" : "Coming soon"}
                  </span>
                </div>
                <p className="dev-card-desc">{p.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. The stack ── */}
      <section className="section divider-top">
        <div className="wrap">
          <span className="eyebrow muted">What we build with</span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 20,
            }}
          >
            {STACK.map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>
          <p
            style={{
              marginTop: 20,
              color: "var(--fg-muted)",
              fontSize: "clamp(14px,1.3vw,16px)",
              maxWidth: "54ch",
            }}
          >
            Our stack is standard. Our domain expertise isn&apos;t. If you know
            these tools, you&apos;re ready.
          </p>
        </div>
      </section>

      {/* ── 4. Free tools ── */}
      <section className="section divider-top" id="tools">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">
              <span className="dot-led" />
              Free tools
            </span>
            <h2>
              Built for ourselves.{" "}
              <span className="em">Open to everyone.</span>
            </h2>
            <p>
              All tools are free, require no account, and are useful whether or
              not you&apos;re building on UrbanTrends.
            </p>
          </div>

          <div className="tools-grid">
            {TOOLS.map((t) => (
              <div className="tool" key={t.name}>
                <div className="thead">
                  <h4>{t.name}</h4>
                  <span className="free">Free</span>
                </div>
                <p>{t.desc}</p>
                <div className="cmd">
                  <span className="pr">{t.pr}</span>
                  <span>{t.cmd}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. How to get involved ── */}
      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow muted">Getting started</span>
            <h2>
              Three steps to{" "}
              <span className="em">building with us.</span>
            </h2>
          </div>

          <div
            className="process-grid"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            <div className="process-step">
              <div className="ps-num">01</div>
              <h3>Join the community</h3>
              <p>
                WhatsApp/Telegram group. Introduce yourself, share what
                you&apos;re building, and ask questions directly to the team.
              </p>
            </div>
            <div className="process-step">
              <div className="ps-num">02</div>
              <h3>Explore the APIs</h3>
              <p>
                Daraja Playground and the product APIs are all accessible. No
                account needed to get started experimenting.
              </p>
            </div>
            <div className="process-step">
              <div className="ps-num">03</div>
              <h3>Ship an integration</h3>
              <p>
                Built something on the platform? Share it in the community. We
                feature standout integrations on this page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Community CTA ── */}
      <section className="section divider-top" id="community">
        <div className="wrap">
          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "clamp(40px, 6vw, 80px)",
              textAlign: "center",
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            <span className="eyebrow" style={{ justifyContent: "center" }}>
              <span className="dot-led" />
              Developer community
            </span>
            <h2
              style={{
                fontSize: "clamp(26px, 3.5vw, 40px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                margin: "18px 0 0",
              }}
            >
              Ready to build?
            </h2>
            <p
              style={{
                color: "var(--fg-muted)",
                fontSize: "clamp(14px, 1.3vw, 16px)",
                margin: "16px auto 0",
                maxWidth: "46ch",
                lineHeight: 1.65,
              }}
            >
              Join developers across East Africa building on UrbanTrends. Get
              support, share what you&apos;re working on, and collaborate with
              the team directly.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                marginTop: 32,
              }}
            >
              <Link className="btn btn-primary" href="/contact" style={{ minWidth: 200 }}>
                Join on WhatsApp
              </Link>
              <Link
                href="/contact"
                className="btn btn-ghost"
                style={{ minWidth: 200 }}
              >
                Or reach us by email
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
