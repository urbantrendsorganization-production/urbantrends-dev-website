import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import LogoStrip from "@/components/LogoStrip";
import { getAboutData, type TeamMember, type AboutMetric } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About",
  description: "UrbanTrends — a software studio from Nairobi that designs and ships production-grade products, tools, and applications.",
};

const FALLBACK_METRICS: AboutMetric[] = [
  { value: "2026", label: "Founded in Nairobi" },
  { value: "5+",   label: "Products & tools shipped" },
  { value: "2",    label: "Founding team members" },
  { value: "BN-93S95J2J", label: "Registration number" },
];

const FALLBACK_TEAM: (TeamMember & { initials: string })[] = [
  {
    name: "Edwin Wamuyu",
    role: "Founder · CEO",
    photo_url: "",
    bio: "Builds the products and drives the direction of UrbanTrends.",
    is_founder: true,
    founder_message:
      "I started UrbanTrends because I wanted to build software that actually earns trust — not just software that works in a demo. Every product we ship has to survive real operating conditions: systems that don't always behave, developers who've seen every shortcut go wrong, and clients who need the boring parts done right. We're not building for a pitch deck. We're building for the operator who'll be running this on a Monday morning, and needs it to just work.",
    initials: "EW",
  },
  {
    name: "Eric Njeru",
    role: "Co-Founder · CTO",
    photo_url: "",
    bio: "Owns the technical architecture and product engineering.",
    is_founder: true,
    founder_message:
      "The standard I hold our engineering to is simple: I have to be comfortable explaining every decision to the next developer who touches the code. That means no clever hacks, no skipped edge cases, no debt disguised as a feature. Production-grade software is mostly about discipline — the discipline to say 'this isn't ready' when it isn't, and the rigour to keep that bar even when the deadline is real.",
    initials: "EN",
  },
];

const COLLABORATORS = [
  { label: "Businesses",  desc: "SMEs and enterprises needing custom software, integrations, and automation that survives real-world conditions.", icon: "M3 21h18M5 21V7l7-4 7 4v14", color: "#34D399", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", imgAlt: "Modern office building" },
  { label: "Developers",  desc: "Engineers who build on our APIs, SDKs, and open-source tooling — without reinventing wheels that shouldn't need reinventing.", icon: "M7 8l4 4-4 4M13 16h4M3 4h18v16H3", color: "#22D3EE", img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80", imgAlt: "Developer writing code" },
  { label: "Agencies",    desc: "Design and dev agencies that bring us in for backend systems, payment rails, and the integrations they don't want to own long-term.", icon: "M12 2l8 4v6c0 5-3.5 7.5-8 10-4.5-2.5-8-5-8-10V6z", color: "#A78BFA", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80", imgAlt: "Agency team collaborating" },
  { label: "Startups",    desc: "Early-stage founders who need a technical co-builder — not just a contractor — who cares whether the thing actually ships.", icon: "M13 2 3 14h7l-1 8 10-12h-7z", color: "#FB923C", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80", imgAlt: "Startup team at work" },
  { label: "Companies",   desc: "Larger organisations that need an embedded engineering team dropped into a specific problem with full ownership.", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", color: "#60A5FA", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", imgAlt: "Corporate office" },
  { label: "NGOs",        desc: "Non-profits and development sector organisations building impactful tools on lean budgets — where every resource counts.", icon: "M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0M4.5 12H3m16.5 0H21m-9 9v-1.5m0-15V3", color: "#34D399", img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80", imgAlt: "Community volunteers" },
];

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

export default async function AboutPage() {
  const { team, metrics } = await getAboutData();

  const displayMetrics = metrics.length > 0 ? metrics : FALLBACK_METRICS;
  const displayTeam = team.length > 0
    ? team.map((m) => ({ ...m, initials: getInitials(m.name) }))
    : FALLBACK_TEAM;

  const displayFounders = displayTeam.filter((m) => m.is_founder);

  return (
    <>
      <section className="page-head" data-screen-label="About">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>About</span>
          </div>
          <h1 className="page-title">A software studio. <span className="em">From Nairobi.</span></h1>
          <p className="page-lead">UrbanTrends is a software studio that designs and ships production-grade products, tools, and applications. We work with startups, agencies, companies, and NGOs — and we hold ourselves to a high bar, because the people we build for depend on it.</p>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section className="section" style={{ paddingTop: "clamp(20px,3vw,36px)" }}>
        <div className="wrap">
          <div className="metrics">
            {displayMetrics.map((m: AboutMetric) => (
              <div key={m.label} className="m">
                <div className="n">{m.value}</div>
                <div className="l">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY WE EXIST ── */}
      <section className="section divider-top">
        <div className="wrap split lead">
          <div>
            <span className="eyebrow muted">Why UrbanTrends</span>
            <h2 className="page-title" style={{ fontSize: "clamp(26px,3.4vw,38px)", maxWidth: "18ch" }}>We build for the market we live in.</h2>
            <p className="page-lead" style={{ fontSize: 17 }}>Every product we ship has to survive contact with a real operator. That constraint is a gift — it forces us to handle the edge cases that generic software ignores: payment quirks, settlement timing, compliance formats, intermittent connectivity.</p>
            <p className="page-lead" style={{ fontSize: 17, marginTop: 18 }}>UrbanTrends is the product and services brand of what we build. Behind it is a small founding team that works directly with businesses, developers, and agencies on custom software, integrations, and tools.</p>
          </div>
          <div className="code-window">
            <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">principles.md</span><span className="lang">UrbanTrends</span></div>
            <pre className="code"><span className="c">{"# How we decide"}</span>{"\n"}{"\n"}<span className="n">1.</span> Does it survive a bad-network Tuesday?{"\n"}<span className="n">2.</span> Would a developer respect the API?{"\n"}<span className="n">3.</span> Is the boring part handled?{"\n"}<span className="n">4.</span> Can a real operator trust the number?{"\n"}{"\n"}<span className="c">{"# If any answer is \"no\", it doesn't ship."}</span>{"\n"}<span className="p">{"— the whole strategy, basically"}</span></pre>
          </div>
        </div>
      </section>

      {/* ── WHO WE COLLABORATE WITH ── */}
      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow muted">Collaborators</span>
            <h2>Who we work with.</h2>
            <p>We&apos;re not precious about who we collaborate with — as long as the problem is real and the work matters.</p>
          </div>
          <div className="collab-grid">
            {COLLABORATORS.map((c) => (
              <div key={c.label} className="collab-card" style={{ "--pa": c.color } as React.CSSProperties}>
                <div className="collab-img-wrap">
                  <Image src={c.img} alt={c.imgAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="collab-img-tint" />
                  <span className="collab-label-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d={c.icon} /></svg>
                    {c.label}
                  </span>
                </div>
                <div className="collab-body">
                  <div className="collab-accent-bar" />
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head"><span className="eyebrow muted">What we value</span><h2>Four things we won&apos;t trade away.</h2></div>
          <div className="values-grid">
            <div className="value"><div className="vnum">01</div><h3>The boring parts matter</h3><p>Reconciliation, compliance, retries. The unglamorous work is exactly where trust is won or lost.</p></div>
            <div className="value"><div className="vnum">02</div><h3>Ship serious, not flashy</h3><p>We&apos;d rather be the tool people quietly depend on than the one with the loudest launch video.</p></div>
            <div className="value"><div className="vnum">03</div><h3>Developers first</h3><p>Good APIs, real docs, free tools. If engineers respect what we build, the rest follows.</p></div>
            <div className="value"><div className="vnum">04</div><h3>Local, earned</h3><p>Our credibility comes from operating here — not from putting a map of Africa on the homepage.</p></div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head"><span className="eyebrow muted">The team</span><h2>Two founders, one mission.</h2><p>We&apos;re a small founding team that would rather ship the right thing than the fast thing.</p></div>
          <div className="team-grid">
            {displayTeam.map((m) => (
              <div key={m.name} className="member">
                {m.photo_url ? (
                  <div className="mavatar" style={{ position: "relative", overflow: "hidden" }}>
                    <Image fill sizes="80px" src={m.photo_url} alt={m.name} style={{ objectFit: "cover" }} />
                  </div>
                ) : (
                  <div className="mavatar">{m.initials}</div>
                )}
                <h4>{m.name}</h4>
                <div className="role">{m.role}</div>
                {m.bio && <p>{m.bio}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDER MESSAGES ── */}
      {displayFounders.length > 0 && (
        <section className="section divider-top">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow muted">A note from us</span>
              <h2>Why we build the way we do.</h2>
              <p>In the founders&apos; own words — what this is about and what we hold ourselves to.</p>
            </div>
            <div className="founder-msgs">
              {displayFounders.map((f) => {
                const msg = f.founder_message || f.bio;
                if (!msg) return null;
                return (
                  <div key={f.name} className="fmsg-card">
                    <div className="fmsg-mark">&ldquo;</div>
                    <p className="fmsg-body">{msg}</p>
                    <div className="fmsg-sig">
                      <div className="fmsg-avatar">
                        {f.photo_url ? (
                          <Image
                            fill
                            src={f.photo_url}
                            alt={f.name}
                            sizes="44px"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          f.initials
                        )}
                      </div>
                      <div>
                        <div className="fmsg-name">{f.name}</div>
                        <div className="fmsg-role">{f.role}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── BUSINESS REGISTRATION ── */}
      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head"><span className="eyebrow muted">Legal identity</span><h2>Registered business.</h2></div>
          <div className="reg-card">
            <div className="reg-header">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Certificate of Registration</span>
            </div>
            <dl className="reg-dl">
              <div className="reg-row"><dt>Business Name</dt><dd>GENMARS TECH</dd></div>
              <div className="reg-row"><dt>Registration No.</dt><dd>BN-93S95J2J</dd></div>
              <div className="reg-row"><dt>Act</dt><dd>The Registration of Business Names Act (Cap. 499, Section 14)</dd></div>
              <div className="reg-row"><dt>Business Address</dt><dd>Floor 5, Room 354, GTC Towers, Chiromo Road, Nairobi Westlands District, Westlands — P.O Box 00100, 00800 Westlands</dd></div>
              <div className="reg-row"><dt>Date of Registration</dt><dd>Thursday, 21 May 2026</dd></div>
              <div className="reg-row"><dt>Registered at</dt><dd>Nairobi, Kenya</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <LogoStrip label="Businesses and developers who build with us" />

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div>
            <h2>Build something serious with us.</h2>
            <p>Whether you need a product, a service, or just a conversation — we&apos;re a message away.</p>
          </div>
          <div className="hero-cta" style={{ margin: 0 }}>
            <Link className="btn btn-primary" href="/services">Our services <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
            <Link className="btn btn-ghost" href="/contact">Get in touch</Link>
          </div>
        </div>
      </section>
    </>
  );
}
