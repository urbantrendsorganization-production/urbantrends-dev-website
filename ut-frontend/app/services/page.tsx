import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listServices, type Service } from "@/lib/services";
import QuoteButton from "./QuoteButton";

export const metadata: Metadata = {
  title: "Services",
  description: "Genmars Tech builds custom software, APIs, integrations, and developer tools for businesses, agencies, startups, and developers.",
  alternates: { canonical: "/services" },
};

const SERVICES = [
  {
    id: "product-development",
    accent: "#22D3EE",
    icon: "M13 2 3 14h7l-1 8 10-12h-7z",
    title: "Product Development",
    tag: "End-to-end",
    desc: "From idea to shipped product. We design, architect, build, and deploy SaaS products and applications — handling product thinking, backend, frontend, and mobile.",
    bullets: ["Product strategy & scoping", "UI/UX design & prototyping", "Full-stack web & mobile development", "Cloud deployment & DevOps", "Ongoing support & iteration"],
    IllustrationEl: ProductDevIllustration,
  },
  {
    id: "custom-software",
    accent: "#34D399",
    icon: "M7 8l4 4-4 4M13 16h4M3 4h18v16H3",
    title: "Custom Software",
    tag: "Bespoke",
    desc: "When off-the-shelf doesn't fit. We build tailored software for specific business processes — inventory, logistics, HR, finance, compliance — whatever the operation actually needs.",
    bullets: ["Requirements analysis & architecture", "Business process automation", "Legacy system modernisation", "Admin dashboards & internal tools", "Data pipelines & reporting"],
    IllustrationEl: CustomSoftwareIllustration,
  },
  {
    id: "api-integrations",
    accent: "#A78BFA",
    icon: "M12 2v6m0 8v6M2 12h6m8 0h6M12 12a3 3 0 100-6 3 3 0 000 6",
    title: "API & Integrations",
    tag: "Connect everything",
    desc: "M-Pesa, Daraja, KRA eTIMS, payment gateways, ERP systems, third-party APIs. We build the plumbing that makes your stack talk to itself — and to the rails East African businesses run on.",
    bullets: ["M-Pesa Paybill & STK Push", "KRA eTIMS integration", "REST & GraphQL API design", "Webhook design & idempotency", "Third-party SaaS connectors"],
    IllustrationEl: ApiIllustration,
  },
  {
    id: "developer-tools",
    accent: "#FB923C",
    icon: "M4 19V5l8 4 8-4v14l-8 4z",
    title: "Developer Tools & SDKs",
    tag: "Open & documented",
    desc: "SDKs, CLIs, libraries, and documentation — built to the standard we'd want to use ourselves. If engineers depend on it, it needs to be typed, documented, and honestly maintained.",
    bullets: ["SDK & client library development", "CLI tool creation", "API documentation (OpenAPI)", "Sandbox environments", "Open-source contributions"],
    IllustrationEl: DevToolsIllustration,
  },
  {
    id: "design-systems",
    accent: "#60A5FA",
    icon: "M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z",
    title: "Design & UX",
    tag: "Product design",
    desc: "Product design, design systems, and prototyping. We design for operators who are busy and engineers who have taste. Functional first, beautiful second — but both.",
    bullets: ["UX research & user flows", "UI component design", "Design system creation", "Interactive prototyping", "Accessibility & responsiveness"],
    IllustrationEl: DesignIllustration,
  },
  {
    id: "consulting",
    accent: "#34D399",
    icon: "M9 12l2 2 4-4M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z",
    title: "Technical Consulting",
    tag: "Architecture & audit",
    desc: "Architecture reviews, code audits, scaling strategy, and technical due diligence. When you need a second pair of experienced eyes before you build more, or before an investor asks hard questions.",
    bullets: ["System architecture review", "Code quality & security audits", "Scaling strategy", "Technical due diligence", "CTO advisory (fractional)"],
    IllustrationEl: ConsultingIllustration,
  },
];

function ProductDevIllustration() {
  return (
    <svg viewBox="0 0 360 200" aria-hidden>
      <rect width="360" height="200" fill="rgba(34,211,238,.03)" rx="8" />
      {/* Kanban board */}
      {["Idea","Design","Build","Ship"].map((label, i) => (
        <g key={label}>
          <rect x={20 + i*84} y="20" width="72" height="160" rx="6" fill="var(--surface-3)" stroke="var(--border)" strokeWidth="1" />
          <text x={56 + i*84} y="38" textAnchor="middle" fill="#22D3EE" fontSize="9" fontFamily="monospace" opacity=".6">{label}</text>
          {[0,1,2].slice(0, [2,2,3,1][i]).map((j) => (
            <rect key={j} x={26 + i*84} y={50 + j*42} width="60" height="32" rx="4"
              fill={["rgba(34,211,238,.08)","rgba(52,211,153,.08)","rgba(167,139,250,.08)","rgba(251,146,60,.08)"][i]}
              stroke={["rgba(34,211,238,.2)","rgba(52,211,153,.2)","rgba(167,139,250,.2)","rgba(251,146,60,.2)"][i]}
              strokeWidth="1" />
          ))}
        </g>
      ))}
      <text x="180" y="192" textAnchor="middle" fill="#22D3EE" fontSize="9" fontFamily="monospace" opacity=".4">idea → design → build → ship</text>
    </svg>
  );
}

function CustomSoftwareIllustration() {
  return (
    <svg viewBox="0 0 360 200" aria-hidden>
      <rect width="360" height="200" fill="rgba(52,211,153,.03)" rx="8" />
      <rect x="20" y="20" width="320" height="160" rx="8" fill="var(--surface-3)" stroke="rgba(52,211,153,.15)" strokeWidth="1" />
      <rect x="20" y="20" width="320" height="28" rx="8" fill="rgba(52,211,153,.06)" />
      <text x="180" y="38" textAnchor="middle" fill="#34D399" fontSize="9" fontFamily="monospace" opacity=".7">business-process.ts · custom build</text>
      {[
        { y: 70,  text: "const workflow = new BusinessProcess({", color: "#34D399" },
        { y: 88,  text: "  inventory:    InventoryModule,", color: "var(--fg)" },
        { y: 106, text: "  compliance:   ETIMSModule,", color: "var(--fg)" },
        { y: 124, text: "  reporting:    DashboardModule,", color: "var(--fg)" },
        { y: 142, text: "});", color: "#34D399" },
        { y: 158, text: "// → your exact process, automated", color: "var(--fg-subtle)" },
      ].map((l, i) => (
        <text key={i} x="36" y={l.y} fill={l.color} fontSize="9" fontFamily="monospace" opacity=".85">{l.text}</text>
      ))}
    </svg>
  );
}

function ApiIllustration() {
  return (
    <svg viewBox="0 0 360 200" aria-hidden>
      <rect width="360" height="200" fill="rgba(167,139,250,.03)" rx="8" />
      {/* Hub */}
      <circle cx="180" cy="100" r="30" fill="rgba(167,139,250,.08)" stroke="#A78BFA" strokeOpacity=".2" strokeWidth="1.5" />
      <text x="180" y="97" textAnchor="middle" fill="#A78BFA" fontSize="8" fontFamily="monospace">Your</text>
      <text x="180" y="108" textAnchor="middle" fill="#A78BFA" fontSize="8" fontFamily="monospace">Platform</text>
      {[
        { x: 50,  y: 50,  label: "M-Pesa",   color: "#34D399" },
        { x: 310, y: 50,  label: "eTIMS",     color: "#FB923C" },
        { x: 50,  y: 150, label: "Daraja",    color: "#22D3EE" },
        { x: 310, y: 150, label: "ERP / CRM", color: "#60A5FA" },
        { x: 180, y: 18,  label: "Webhooks",  color: "#A78BFA" },
      ].map((n) => (
        <g key={n.label}>
          <line x1="180" y1="100" x2={n.x} y2={n.y} stroke={n.color} strokeWidth="1" strokeDasharray="4 3" opacity=".35" />
          <circle cx={n.x} cy={n.y} r="22" fill={n.color} fillOpacity=".08" stroke={n.color} strokeOpacity=".2" strokeWidth="1" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.color} fontSize="8" fontFamily="monospace" opacity=".85">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

function DevToolsIllustration() {
  return (
    <svg viewBox="0 0 360 200" aria-hidden>
      <rect width="360" height="200" fill="rgba(251,146,60,.03)" rx="8" />
      <rect x="20" y="20" width="320" height="160" rx="8" fill="var(--surface-3)" stroke="rgba(251,146,60,.15)" strokeWidth="1" />
      <rect x="20" y="20" width="320" height="28" rx="8" fill="rgba(251,146,60,.06)" />
      <text x="180" y="38" textAnchor="middle" fill="#FB923C" fontSize="9" fontFamily="monospace" opacity=".7">terminal · @urbantrends/scaffold</text>
      {[
        { y: 66,  text: "$ npm i @genmars/sdk", color: "#FB923C" },
        { y: 82,  text: "$ npx @genmars/scaffold my-app", color: "#FB923C" },
        { y: 100, text: "✓ typed routes generated", color: "#34D399" },
        { y: 116, text: "✓ M-Pesa callbacks wired", color: "#34D399" },
        { y: 132, text: "✓ reconciliation jobs set up", color: "#34D399" },
        { y: 148, text: "✓ .env template created", color: "#34D399" },
        { y: 166, text: "→ cd my-app && npm run dev", color: "#FB923C" },
      ].map((l, i) => (
        <text key={i} x="36" y={l.y} fill={l.color} fontSize="9" fontFamily="monospace" opacity=".85">{l.text}</text>
      ))}
    </svg>
  );
}

function DesignIllustration() {
  return (
    <svg viewBox="0 0 360 200" aria-hidden>
      <rect width="360" height="200" fill="rgba(96,165,250,.03)" rx="8" />
      {/* Component cards */}
      {[
        { x: 20,  y: 20,  w: 150, h: 80,  label: "Button system",   color: "#60A5FA" },
        { x: 190, y: 20,  w: 150, h: 80,  label: "Typography",      color: "#A78BFA" },
        { x: 20,  y: 114, w: 100, h: 66,  label: "Colors",          color: "#34D399" },
        { x: 134, y: 114, w: 100, h: 66,  label: "Icons",           color: "#FB923C" },
        { x: 248, y: 114, w: 92,  h: 66,  label: "Components",      color: "#60A5FA" },
      ].map((c) => (
        <g key={c.label}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="6" fill={c.color} fillOpacity=".06" stroke={c.color} strokeOpacity=".2" strokeWidth="1" />
          <text x={c.x + c.w/2} y={c.y + 16} textAnchor="middle" fill={c.color} fontSize="8" fontFamily="monospace" opacity=".6">{c.label}</text>
          {c.label === "Button system" && (
            <>
              <rect x={c.x+12} y={c.y+28} width={54} height={20} rx="5" fill="#60A5FA" fillOpacity=".2" stroke="#60A5FA" strokeOpacity=".3" strokeWidth="1" />
              <text x={c.x+39} y={c.y+42} textAnchor="middle" fill="#60A5FA" fontSize="8" fontFamily="monospace">Primary</text>
              <rect x={c.x+74} y={c.y+28} width={54} height={20} rx="5" fill="transparent" stroke="#60A5FA" strokeOpacity=".3" strokeWidth="1" />
              <text x={c.x+101} y={c.y+42} textAnchor="middle" fill="#60A5FA" fontSize="8" fontFamily="monospace">Ghost</text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

function ConsultingIllustration() {
  return (
    <svg viewBox="0 0 360 200" aria-hidden>
      <rect width="360" height="200" fill="rgba(52,211,153,.03)" rx="8" />
      {/* Architecture diagram */}
      {/* Load balancer */}
      <rect x="140" y="18" width="80" height="28" rx="5" fill="rgba(52,211,153,.1)" stroke="#34D399" strokeOpacity=".3" strokeWidth="1" />
      <text x="180" y="36" textAnchor="middle" fill="#34D399" fontSize="8" fontFamily="monospace">Load balancer</text>
      {/* API servers */}
      {[80, 180, 280].map((x, i) => (
        <g key={i}>
          <line x1="180" y1="46" x2={x} y2="70" stroke="#34D399" strokeWidth="1" opacity=".3" />
          <rect x={x-40} y="70" width="80" height="28" rx="5" fill="rgba(34,211,238,.08)" stroke="#22D3EE" strokeOpacity=".2" strokeWidth="1" />
          <text x={x} y="88" textAnchor="middle" fill="#22D3EE" fontSize="8" fontFamily="monospace">API {i+1}</text>
        </g>
      ))}
      {/* DB */}
      <line x1="180" y1="98" x2="180" y2="120" stroke="#34D399" strokeWidth="1" opacity=".3" />
      <rect x="130" y="120" width="100" height="28" rx="5" fill="rgba(167,139,250,.08)" stroke="#A78BFA" strokeOpacity=".2" strokeWidth="1" />
      <text x="180" y="138" textAnchor="middle" fill="#A78BFA" fontSize="8" fontFamily="monospace">Database cluster</text>
      {/* Cache */}
      <line x1="80" y1="98" x2="60" y2="150" stroke="#34D399" strokeWidth="1" opacity=".25" />
      <rect x="20" y="150" width="80" height="28" rx="5" fill="rgba(251,146,60,.08)" stroke="#FB923C" strokeOpacity=".2" strokeWidth="1" />
      <text x="60" y="168" textAnchor="middle" fill="#FB923C" fontSize="8" fontFamily="monospace">Redis cache</text>
      <text x="180" y="192" textAnchor="middle" fill="#34D399" fontSize="9" fontFamily="monospace" opacity=".4">architecture · reviewed · approved</text>
    </svg>
  );
}

const PROCESS = [
  { n: "01", title: "Discovery", desc: "A call where we understand your problem, your constraints, and what done looks like. Usually 30–60 minutes." },
  { n: "02", title: "Proposal", desc: "A clear scope document: what we'll build, how long it'll take, what it costs. No ambiguity, no retainer-for-its-own-sake." },
  { n: "03", title: "Build", desc: "We design, build, and test iteratively. You see working software at every checkpoint — not a big reveal at the end." },
  { n: "04", title: "Ship & support", desc: "Deployed, documented, and yours. We stay available for the questions that come up in the first weeks." },
];

const WHO = [
  {
    label: "Businesses",
    color: "#34D399",
    desc: "SMEs and enterprises needing custom software, M-Pesa integrations, and automation built for how East Africa actually works.",
    icon: "M3 21h18M5 21V7l7-4 7 4v14",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    imgAlt: "Modern business office building",
  },
  {
    label: "Developers",
    color: "#22D3EE",
    desc: "Engineers building on our APIs, SDKs, and open-source Daraja tooling — without reinventing the M-Pesa callback wheel.",
    icon: "M7 8l4 4-4 4M13 16h4M3 4h18v16H3",
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    imgAlt: "Developer writing code on a monitor",
  },
  {
    label: "Agencies",
    color: "#A78BFA",
    desc: "Design and dev agencies that bring us in for payment rails and backend systems they don't want to own long-term.",
    icon: "M12 2l8 4v6c0 5-3.5 7.5-8 10-4.5-2.5-8-5-8-10V6z",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    imgAlt: "Creative agency team collaborating",
  },
  {
    label: "Startups",
    color: "#FB923C",
    desc: "Early-stage founders who need a technical co-builder — not just a contractor — who cares whether the product ships.",
    icon: "M13 2 3 14h7l-1 8 10-12h-7z",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    imgAlt: "Startup team in a vibrant workspace",
  },
  {
    label: "Companies",
    color: "#60A5FA",
    desc: "Larger organisations that need an embedded engineering team dropped into a specific problem with full ownership.",
    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    imgAlt: "Corporate open-plan office space",
  },
  {
    label: "NGOs",
    color: "#34D399",
    desc: "Non-profits and development sector organisations building impactful tools on lean budgets — where every shilling matters.",
    icon: "M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0M4.5 12H3m16.5 0H21",
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    imgAlt: "Community volunteers working together",
  },
];

async function LiveServicesSection() {
  const services = await listServices();
  if (!services.length) return null;

  const grouped: Record<string, Service[]> = {};
  for (const s of services) {
    if (!grouped[s.category_name]) grouped[s.category_name] = [];
    grouped[s.category_name].push(s);
  }

  return (
    <section className="section divider-top">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow muted">Available now</span>
          <h2>Managed service catalog.</h2>
          <p>Browse our services, select a plan that fits your project scope, and submit your brief — we take it from there.</p>
        </div>
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} style={{ marginBottom: "clamp(32px,5vw,56px)" }}>
            <h3 style={{ fontSize: "clamp(12px,1.5vw,14px)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--fg-muted)", fontWeight: 500, marginBottom: 20 }}>
              {category}
            </h3>
            <div className="collab-grid">
              {items.map((s) => {
                return (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="collab-card"
                    style={{ "--pa": s.accent_color, textDecoration: "none" } as React.CSSProperties}
                  >
                    <div className="collab-body" style={{ paddingTop: 20 }}>
                      <div style={{ marginBottom: 10 }}>
                        <span className="pglyph" style={{ color: s.accent_color }}>
                          {s.icon_path && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                              <path d={s.icon_path} />
                            </svg>
                          )}
                        </span>
                      </div>
                      <div className="collab-accent-bar" />
                      <b style={{ display: "block", fontSize: 15, color: "var(--fg)", marginBottom: 6 }}>{s.name}</b>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.5 }}>{s.tagline}</p>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 12, fontSize: 13, color: s.accent_color }}>
                        View plans
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="12" height="12"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function ServicesPage() {
  return (
    <>
      <section className="page-head" data-screen-label="Services">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Services</span>
          </div>
          <h1 className="page-title">What we <span className="em">build together.</span></h1>
          <p className="page-lead">UrbanTrends designs and builds software for businesses, developers, agencies, and startups. Whether you need an end-to-end product, a specific integration, or a technical partner — this is what we do.</p>
          <div className="hero-cta" style={{ marginTop: "clamp(24px,3vw,36px)" }}>
            <Link className="btn btn-primary" href="/contact">
              Talk to us <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link className="btn btn-ghost" href="/about">About us</Link>
          </div>
        </div>
      </section>

      <LiveServicesSection />

      {/* ── SERVICES ── */}
      <section className="section" style={{ paddingTop: "clamp(20px,3vw,36px)" }}>
        <div className="wrap">
          <div className="services-list">
            {SERVICES.map((s) => {
              const Illustration = s.IllustrationEl;
              return (
                <div key={s.id} className="service-card" style={{ "--pa": s.accent } as React.CSSProperties}>
                  <div className="sc-art">
                    <Illustration />
                  </div>
                  <div className="sc-body">
                    <div className="sc-top">
                      <span className="sc-tag">{s.tag}</span>
                      <span className="pglyph sc-glyph">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d={s.icon} />
                        </svg>
                      </span>
                    </div>
                    <h3>{s.title}</h3>
                    <p className="sc-desc">{s.desc}</p>
                    <ul className="sc-bullets">
                      {s.bullets.map((b) => (
                        <li key={b}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                            <path d="M5 12l5 5L20 6" />
                          </svg>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <QuoteButton
                      serviceName={s.title}
                      label={`Talk to us about ${s.title.toLowerCase()}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHO WE WORK WITH ── */}
      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow muted">Collaborators</span>
            <h2>Who we work with.</h2>
            <p>We&apos;re not precious about who we collaborate with — as long as the problem is real and the work matters.</p>
          </div>
          <div className="collab-grid">
            {WHO.map((w) => (
              <div key={w.label} className="collab-card" style={{ "--pa": w.color } as React.CSSProperties}>
                <div className="collab-img-wrap">
                  <Image
                    src={w.img}
                    alt={w.imgAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="collab-img-tint" />
                  <span className="collab-label-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                      <path d={w.icon} />
                    </svg>
                    {w.label}
                  </span>
                </div>
                <div className="collab-body">
                  <div className="collab-accent-bar" />
                  <p>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow muted">How it works</span>
            <h2>A process that doesn&apos;t waste your time.</h2>
          </div>
          <div className="process-grid">
            {PROCESS.map((p) => (
              <div key={p.n} className="process-step">
                <div className="ps-num">{p.n}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="services-photo-band">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
              alt="Cross-functional engineering team collaborating on software products"
              width={1400}
              height={500}
              className="about-illustration"
            />
            <div className="about-photo-caption">
              Work across the stack — product thinking, backend, APIs, and design. Built in Nairobi.
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div>
            <h2>Let&apos;s build something that earns its keep.</h2>
            <p>Tell us what you&apos;re trying to do. We&apos;ll tell you honestly whether and how we can help.</p>
          </div>
          <div className="hero-cta" style={{ margin: 0 }}>
            <Link className="btn btn-primary" href="/contact">
              Start a conversation <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link className="btn btn-ghost" href="/about">About us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
