import Link from "next/link";
import Image from "next/image";
import LogoStrip from "@/components/LogoStrip";

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        {/* Background cityscape — masked so the copy column stays clean */}
        <div className="hero-bg">
          <Image
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1800&q=55"
            alt=""
            fill
            style={{ objectFit: "cover", opacity: .22 }}
            priority
            aria-hidden="true"
          />
        </div>

        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="dot-led" />
              Nairobi, Kenya · Multi-product studio
            </span>
            <h1>
              Infrastructure for the{" "}
              <span className="em">East African internet.</span>
            </h1>
            <p className="sub">
              We build the SaaS and developer tooling East African operators
              actually ship on. M-Pesa-native, Daraja-fluent, production-grade
              — and serious about it.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#products">
                Explore products
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a className="btn btn-ghost" href="#tools">
                Read the docs <span className="kbd">⌘</span>
              </a>
            </div>
            <div className="hero-meta">
              <div className="stat">
                <div className="n">5</div>
                <div className="l">Products in market</div>
              </div>
              <div className="stat">
                <div className="n">2.4M+</div>
                <div className="l">Transactions reconciled</div>
              </div>
              <div className="stat">
                <div className="n">99.96%</div>
                <div className="l">Uptime, trailing 90d</div>
              </div>
            </div>

            {/* Photo mosaic — humanises the studio, always visible */}
            <div className="hero-photo-card">
              <div className="hpc-a">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=560&q=80"
                  alt="Genmars Tech team collaborating"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="hpc-b">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&q=80"
                  alt="Developer writing code"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="hpc-c">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80"
                  alt="Startup team at work"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>

          {/* Hero art — CSS [data-hero] on <html> controls which is visible */}
          <div className="hero-art">
            {/* (1) Animated infra diagram */}
            <div className="art-diagram">
              <div className="diagram-frame">
                <div className="df-head">
                  <span className="mono-label">genmars_studio.svc</span>
                  <div className="dots">
                    <i /><i /><i />
                  </div>
                </div>
                <svg
                  className="diagram-svg"
                  viewBox="0 0 760 410"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Orbital diagram: Genmars Tech at the centre delivering software to Startups, Businesses, Companies, Agencies, Developers and NGOs."
                >
                  <defs>
                    <pattern id="dg" width="22" height="22" patternUnits="userSpaceOnUse">
                      <circle cx="1.2" cy="1.2" r="1.2" className="dot-grid-bg" />
                    </pattern>
                    <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity=".22" />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="hub-core" cx="40%" cy="38%" r="65%">
                      <stop offset="0%" stopColor="var(--surface-3)" />
                      <stop offset="100%" stopColor="var(--surface-1)" />
                    </radialGradient>
                    <radialGradient id="ng1" cx="35%" cy="32%" r="65%">
                      <stop offset="0%" stopColor="#a5f3fc" stopOpacity=".95" />
                      <stop offset="100%" stopColor="#0e7490" stopOpacity=".9" />
                    </radialGradient>
                    <radialGradient id="ng2" cx="35%" cy="32%" r="65%">
                      <stop offset="0%" stopColor="#a7f3d0" stopOpacity=".95" />
                      <stop offset="100%" stopColor="#047857" stopOpacity=".9" />
                    </radialGradient>
                    <radialGradient id="ng3" cx="35%" cy="32%" r="65%">
                      <stop offset="0%" stopColor="#ddd6fe" stopOpacity=".95" />
                      <stop offset="100%" stopColor="#6d28d9" stopOpacity=".9" />
                    </radialGradient>
                    <radialGradient id="ng4" cx="35%" cy="32%" r="65%">
                      <stop offset="0%" stopColor="#bfdbfe" stopOpacity=".95" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity=".9" />
                    </radialGradient>
                    <radialGradient id="ng5" cx="35%" cy="32%" r="65%">
                      <stop offset="0%" stopColor="#fed7aa" stopOpacity=".95" />
                      <stop offset="100%" stopColor="#c2410c" stopOpacity=".9" />
                    </radialGradient>
                    <radialGradient id="ng6" cx="35%" cy="32%" r="65%">
                      <stop offset="0%" stopColor="#f5d0fe" stopOpacity=".95" />
                      <stop offset="100%" stopColor="#a21caf" stopOpacity=".9" />
                    </radialGradient>
                  </defs>

                  {/* Dot grid background */}
                  <rect x="0" y="0" width="760" height="410" fill="url(#dg)" opacity=".45" />

                  {/* Hub ambient glow */}
                  <circle cx="360" cy="200" r="82" fill="url(#hub-glow)" />
                  <circle cx="360" cy="200" r="62" stroke="#22D3EE" strokeWidth=".7" strokeOpacity=".18" fill="none" />

                  {/* Elliptical orbit track */}
                  <ellipse cx="360" cy="200" rx="160" ry="112" className="orbit-ring" strokeWidth=".8" strokeDasharray="4 8" fill="none" />

                  {/* Spokes: hub → satellite */}
                  <path className="flow" d="M360,156 L360,113" />
                  <path className="flow" d="M403,183 L477,153" />
                  <path className="flow" d="M403,217 L477,247" />
                  <path className="flow" d="M360,246 L360,288" />
                  <path className="flow" d="M317,217 L243,247" />
                  <path className="flow" d="M317,183 L243,153" />

                  {/* Animated pulses outward along each spoke */}
                  <path className="flow-pulse" style={{ animationDelay: "0s" }}   d="M360,156 L360,113" />
                  <path className="flow-pulse" style={{ animationDelay: ".4s" }}  d="M403,183 L477,153" />
                  <path className="flow-pulse" style={{ animationDelay: ".8s" }}  d="M403,217 L477,247" />
                  <path className="flow-pulse" style={{ animationDelay: "1.2s" }} d="M360,246 L360,288" />
                  <path className="flow-pulse" style={{ animationDelay: "1.6s" }} d="M317,217 L243,247" />
                  <path className="flow-pulse" style={{ animationDelay: "2.0s" }} d="M317,183 L243,153" />

                  {/* ── Hub sphere ── */}
                  <circle cx="360" cy="200" r="44" fill="url(#hub-core)" stroke="#22D3EE" strokeWidth="1.4" strokeOpacity=".45" />
                  <rect x="340" y="196" width="5" height="12" rx="1" fill="#22D3EE" fillOpacity=".4" />
                  <rect x="348" y="190" width="5" height="18" rx="1" fill="#22D3EE" fillOpacity=".7" />
                  <rect x="356" y="183" width="5" height="25" rx="1" fill="#22D3EE" />
                  <rect x="364" y="193" width="5" height="15" rx="1" fill="#22D3EE" fillOpacity=".45" />
                  <text x="360" y="220" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".1em" className="hub-label">GENMARS TECH</text>
                  <circle cx="347" cy="187" r="6" fill="white" fillOpacity=".08" />

                  {/* ── Satellite 1: Startups — top (360, 88), cyan ── */}
                  <circle cx="360" cy="88" r="22" fill="url(#ng1)" />
                  <circle cx="352" cy="80" r="6" fill="white" fillOpacity=".22" />
                  <text x="360" y="57" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" letterSpacing=".04em" className="sat-n1">Startups</text>
                  <text x="360" y="44" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".06em" className="sat-sub">Product Dev</text>

                  {/* ── Satellite 2: Businesses — top-right (499, 144), green ── */}
                  <circle cx="499" cy="144" r="22" fill="url(#ng2)" />
                  <circle cx="491" cy="136" r="6" fill="white" fillOpacity=".22" />
                  <text x="536" y="141" textAnchor="start" fontFamily="var(--font-mono)" fontSize="11" letterSpacing=".04em" className="sat-n2">Businesses</text>
                  <text x="536" y="154" textAnchor="start" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".06em" className="sat-sub">Custom Software</text>

                  {/* ── Satellite 3: Companies — bottom-right (499, 256), purple ── */}
                  <circle cx="499" cy="256" r="22" fill="url(#ng3)" />
                  <circle cx="491" cy="248" r="6" fill="white" fillOpacity=".22" />
                  <text x="536" y="253" textAnchor="start" fontFamily="var(--font-mono)" fontSize="11" letterSpacing=".04em" className="sat-n3">Companies</text>
                  <text x="536" y="266" textAnchor="start" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".06em" className="sat-sub">{"API & Integrations"}</text>

                  {/* ── Satellite 4: Agencies — bottom (360, 312), blue ── */}
                  <circle cx="360" cy="312" r="22" fill="url(#ng4)" />
                  <circle cx="352" cy="304" r="6" fill="white" fillOpacity=".22" />
                  <text x="360" y="351" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" letterSpacing=".04em" className="sat-n4">Agencies</text>
                  <text x="360" y="364" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".06em" className="sat-sub">Consulting</text>

                  {/* ── Satellite 5: Developers — bottom-left (221, 256), amber ── */}
                  <circle cx="221" cy="256" r="22" fill="url(#ng5)" />
                  <circle cx="213" cy="248" r="6" fill="white" fillOpacity=".22" />
                  <text x="184" y="253" textAnchor="end" fontFamily="var(--font-mono)" fontSize="11" letterSpacing=".04em" className="sat-n5">Developers</text>
                  <text x="184" y="266" textAnchor="end" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".06em" className="sat-sub">Dev Tools</text>

                  {/* ── Satellite 6: NGOs — top-left (221, 144), fuchsia ── */}
                  <circle cx="221" cy="144" r="22" fill="url(#ng6)" />
                  <circle cx="213" cy="136" r="6" fill="white" fillOpacity=".22" />
                  <text x="184" y="141" textAnchor="end" fontFamily="var(--font-mono)" fontSize="11" letterSpacing=".04em" className="sat-n6">NGOs</text>
                  <text x="184" y="154" textAnchor="end" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".06em" className="sat-sub">{"Design & UX"}</text>
                </svg>
              </div>
            </div>

            {/* (2) Code sample */}
            <div className="art-code">
              <div className="code-window">
                <div className="code-bar">
                  <div className="tl"><i /><i /><i /></div>
                  <span className="fname">reconcile.ts</span>
                  <span className="lang">TypeScript</span>
                </div>
                <pre className="code">{`\
`}<span className="c">// Match Paybill settlements to invoices — weekends included.</span>{`
`}<span className="k">import</span>{` { daraja } `}<span className="k">from</span>{` `}<span className="s">&quot;@urbantrends/mpesa&quot;</span>{`;

`}<span className="k">const</span>{` `}<span className="v">ledger</span>{` = `}<span className="k">await</span>{` `}<span className="f">daraja</span>{`.`}<span className="f">paybill</span>{`({
  shortcode: `}<span className="n">247247</span>{`,
  since: `}<span className="s">&quot;2026-06-01&quot;</span>{`,
});

`}<span className="k">for</span>{` (`}<span className="k">const</span>{` `}<span className="v">tx</span>{` `}<span className="k">of</span>{` ledger.settled) {
  `}<span className="k">await</span>{` `}<span className="f">reconcile</span>{`(tx, {
    against: `}<span className="s">&quot;invoices&quot;</span>{`,
    tolerance: `}<span className="n">0</span>{`,        `}<span className="c">// cents</span>{`
  });
}

`}<span className="p">→ 1,284 matched · 0 orphaned · 38ms</span></pre>
              </div>
            </div>

            {/* (3) Typographic */}
            <div className="art-type">
              <div className="big">
                Built on<br />the rails<br /><em>Kenya runs on.</em>
              </div>
              <div className="rule" />
              <div className="row"><span>POSITIONING</span><b>Infra for the EA internet</b></div>
              <div className="row"><span>STACK</span><b>M-Pesa · Daraja · KRA</b></div>
              <div className="row"><span>SURFACE</span><b>5 products · 1 system</b></div>
              <div className="row"><span>BASE</span><b>Nairobi, KE</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <div className="trust">
        <div className="wrap trust-inner">
          <span className="lab">Runs on the rails you already use</span>
          <div className="marks">
            <span>M-Pesa</span>
            <span>Daraja</span>
            <span>Pesalink</span>
            <span>KRA eTIMS</span>
            <span>Equity</span>
            <span>Co-op Bank</span>
          </div>
        </div>
      </div>

      {/* ===== CUSTOMER LOGO STRIP ===== */}
      <LogoStrip />

      {/* ===== PRODUCTS (centerpiece) ===== */}
      <section className="section products" id="products">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow muted">The portfolio</span>
            <h2>One studio. Five products. No loose ends.</h2>
            <p>
              Each one could stand on its own. Together they share a spine — the
              same reconciliation core, the same design language, the same
              refusal to ship anything half-built.
            </p>
          </div>

          <div className="product-grid">
            {/* RentFlow — featured wide + tall */}
            <Link className="pcard feature" href="/rentflow" style={{ "--pa": "#34D399" } as React.CSSProperties}>
              <div className="ptop">
                <span className="pglyph">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M9 11h.01M15 11h.01" />
                  </svg>
                </span>
                <span className="ptag">B2B · Property</span>
              </div>
              <h3>RentFlow</h3>
              <p className="pdesc">
                Property management with M-Pesa Paybill reconciliation that
                actually works on weekends. Built for agencies and managers
                running real portfolios.
              </p>
              <div className="pmotif">
                <div className="recon-row">
                  <span>Unit 4B · Kilimani</span>
                  <span className="amt">KES 45,000</span>
                  <span className="badge"><i />Matched</span>
                </div>
                <div className="recon-row">
                  <span>Unit 2A · Westlands</span>
                  <span className="amt">KES 62,500</span>
                  <span className="badge"><i />Matched</span>
                </div>
                <div className="recon-row">
                  <span>Unit 7C · Lavington</span>
                  <span className="amt">KES 38,000</span>
                  <span className="badge"><i />Matched</span>
                </div>
              </div>
              <div className="pspacer" />
              <div className="pfoot">
                View RentFlow
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </div>
            </Link>

            {/* PortfolioU — tall */}
            <Link className="pcard tall" href="/portfoliou" style={{ "--pa": "#A78BFA" } as React.CSSProperties}>
              <div className="ptop">
                <span className="pglyph">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="7" cy="8" r="3" />
                    <circle cx="17" cy="16" r="3" />
                    <path d="M9.5 9.8 14.5 14.2" />
                  </svg>
                </span>
                <span className="ptag">Marketplace</span>
              </div>
              <h3>PortfolioU</h3>
              <p className="pdesc">
                A two-sided talent marketplace. Students publish real work;
                employers hire from proof, not promises.
              </p>
              <div className="pspacer" />
              <div className="pfoot">
                View PortfolioU
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </div>
            </Link>

            {/* TrendyyLeads */}
            <Link className="pcard" href="/trendyyleads" style={{ "--pa": "#FB923C" } as React.CSSProperties}>
              <div className="ptop">
                <span className="pglyph">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 4h18l-7 8v6l-4 2v-8z" />
                  </svg>
                </span>
                <span className="ptag">B2B · Growth</span>
              </div>
              <h3>TrendyyLeads</h3>
              <p className="pdesc">
                Lead generation that respects your pipeline. Sourced, scored,
                and synced — no spray-and-pray.
              </p>
              <div className="pspacer" />
              <div className="pfoot">
                View TrendyyLeads
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </div>
            </Link>

            {/* AcademyOS */}
            <Link className="pcard" href="/academyos" style={{ "--pa": "#60A5FA" } as React.CSSProperties}>
              <div className="ptop">
                <span className="pglyph">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 8l9-4 9 4-9 4z" />
                    <path d="M7 10.5V15c0 1.5 2.2 2.5 5 2.5s5-1 5-2.5v-4.5" />
                  </svg>
                </span>
                <span className="ptag">School ops</span>
              </div>
              <h3>AcademyOS</h3>
              <p className="pdesc">
                School management without the spreadsheet sprawl. Admissions,
                fees, timetables — one system.
              </p>
              <div className="pspacer" />
              <div className="pfoot">
                View AcademyOS
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </div>
            </Link>

            {/* Developer Tools */}
            <Link className="pcard" href="/docs" style={{ "--pa": "#22D3EE" } as React.CSSProperties}>
              <div className="ptop">
                <span className="pglyph">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M7 8l4 4-4 4M13 16h4" />
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                  </svg>
                </span>
                <span className="ptag">Free · OSS</span>
              </div>
              <h3>Developer Tools</h3>
              <p className="pdesc">
                Daraja Playground, a scaffolding CLI, and small utilities.
                Polished gifts to the community.
              </p>
              <div className="pspacer" />
              <div className="pfoot">
                Browse tools
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BUILT ON KENYA ===== */}
      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="wrap kenya-grid">
          <div>
            <span className="eyebrow muted">Local depth, no kitsch</span>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.04, letterSpacing: "-0.03em", fontWeight: 600 }}>
              Built for Kenya. Built on Kenya.
            </h2>
            <p style={{ margin: "16px 0 0", color: "var(--fg-muted)", maxWidth: "48ch" }}>
              We know this market because we operate in it. That shows up in the
              boring places that matter — Paybill edge cases, eTIMS compliance,
              settlement timing — not in the decoration.
            </p>
            <div className="kenya-chips">
              <span className="chip"><span className="tick" />M-Pesa Paybill</span>
              <span className="chip"><span className="tick" />STK Push</span>
              <span className="chip"><span className="tick" />Daraja v2</span>
              <span className="chip"><span className="tick" />KRA eTIMS</span>
              <span className="chip"><span className="tick" />Pesalink</span>
              <span className="chip"><span className="tick" />B2C payouts</span>
            </div>
            <p className="kenya-note">
              {"// "}<b>Saturday, 14:32 EAT.</b> A Paybill settlement lands. RentFlow
              matches it to an invoice before the tenant closes the app. No batch job.
              No Monday.
            </p>
          </div>

          <div>
            <div className="kenya-img-wrap">
              <Image
                fill
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80"
                alt="Software team reviewing M-Pesa integration in Nairobi"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="code-window">
            <div className="code-bar">
              <div className="tl"><i /><i /><i /></div>
              <span className="fname">stk_push.ts</span>
              <span className="lang">Daraja</span>
            </div>
            <pre className="code">{`\
`}<span className="k">const</span>{` `}<span className="v">res</span>{` = `}<span className="k">await</span>{` `}<span className="f">daraja</span>{`.`}<span className="f">stkPush</span>{`({
  phone: `}<span className="s">&quot;2547XXXXXXXX&quot;</span>{`,
  amount: `}<span className="n">45000</span>{`,
  account: `}<span className="s">&quot;UNIT-4B&quot;</span>{`,
  callback: `}<span className="s">&quot;https://api.rentflow.ke/cb&quot;</span>{`,
});

`}<span className="c">// → CheckoutRequestID issued in 41ms</span>{`
`}<span className="c">// → settled + reconciled on callback</span>{`
`}<span className="p">{`{ ResponseCode: `}<span className="s">&quot;0&quot;</span>{`, status: `}<span className="s">&quot;ok&quot;</span>{` }`}</span></pre>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow muted">Real operators, real results</span>
            <h2>The work speaks for itself.</h2>
            <p>Companies across East Africa run on UrbanTrends products every day.</p>
          </div>
          <div className="testimonials-grid">
            <div className="tcard">
              <p className="tquote">&ldquo;The Monday reconciliation ritual is gone. We used to spend half a day matching M-Pesa statements to tenant records. RentFlow closes it in seconds — even on Sunday nights.&rdquo;</p>
              <div className="tfoot">
                <div className="tavatar">
                  <Image fill src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&q=80" alt="Joy Njeri" style={{ objectFit: "cover" }} />
                </div>
                <div><div className="tname">Joy Njeri</div><div className="trole">Director, Jasmine Properties Ltd</div></div>
                <span className="tprod" style={{ "--pa": "#34D399" } as React.CSSProperties}>RentFlow</span>
              </div>
            </div>
            <div className="tcard">
              <p className="tquote">&ldquo;We integrated STK Push in an afternoon using the Playground and Scaffold CLI. Our previous attempt with the raw Daraja API took a senior engineer almost two weeks.&rdquo;</p>
              <div className="tfoot">
                <div className="tavatar">
                  <Image fill src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=80&q=80" alt="David Kamau" style={{ objectFit: "cover" }} />
                </div>
                <div><div className="tname">David Kamau</div><div className="trole">CTO, Pesabase</div></div>
                <span className="tprod" style={{ "--pa": "#22D3EE" } as React.CSSProperties}>Dev Tools</span>
              </div>
            </div>
            <div className="tcard">
              <p className="tquote">&ldquo;PortfolioU sent us three candidates with real, verifiable work. We hired two of them. It&apos;s the only place we&apos;ve found developers who can actually show what they&apos;ve built.&rdquo;</p>
              <div className="tfoot">
                <div className="tavatar">
                  <Image fill src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Amina Mohamed" style={{ objectFit: "cover" }} />
                </div>
                <div><div className="tname">Amina Mohamed</div><div className="trole">Head of Engineering, Acacia Labs</div></div>
                <span className="tprod" style={{ "--pa": "#A78BFA" } as React.CSSProperties}>PortfolioU</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TOOLS ===== */}
      <section className="section" id="tools" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow muted">Tool-led, not gated</span>
            <h2>Free tools we built because we needed them.</h2>
            <p>No email wall, no trial clock. If it saves us an afternoon, it&apos;ll save you one too.</p>
          </div>
          <div className="tools-grid">
            <div className="tool">
              <div className="thead">
                <span className="ticon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M7 8l4 4-4 4M13 16h4" /><rect x="3" y="4" width="18" height="16" rx="2" />
                  </svg>
                </span>
                <h4>Daraja Playground</h4>
                <span className="free">Free</span>
              </div>
              <p>Fire STK pushes, inspect callbacks, and replay webhooks against the M-Pesa sandbox — no Postman gymnastics.</p>
              <div className="cmd"><span className="pr">$</span> open daraja.urbantrends.dev <span className="cp">copy</span></div>
            </div>

            <div className="tool">
              <div className="thead">
                <span className="ticon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 3v18M3 7l9-4 9 4M3 17l9 4 9-4" />
                  </svg>
                </span>
                <h4>Scaffold CLI</h4>
                <span className="free">Free</span>
              </div>
              <p>Generate a Daraja-wired backend, typed routes, and reconciliation jobs in one command. Opinionated, on purpose.</p>
              <div className="cmd"><span className="pr">$</span> npx @urbantrends/scaffold <span className="cp">copy</span></div>
            </div>

            <div className="tool">
              <div className="thead">
                <span className="ticon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18M8 14h5" />
                  </svg>
                </span>
                <h4>OG Studio</h4>
                <span className="free">Free</span>
              </div>
              <p>Programmatic social cards from a URL. Drop in a template, pass params, get a crisp 1200×630 every time.</p>
              <div className="cmd"><span className="pr">$</span> og.urbantrends.dev/new <span className="cp">copy</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BAND ===== */}
      <section className="cta-band">
        <div className="wrap cta-inner">
          <div>
            <h2>Ship something serious.</h2>
            <p>Pick a product, or build on the tools. Either way, you&apos;re starting on rails that already hold up.</p>
          </div>
          <div className="hero-cta" style={{ margin: 0 }}>
            <a className="btn btn-primary" href="#products">
              Explore products
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <Link className="btn btn-ghost" href="/contact">Talk to the team</Link>
          </div>
        </div>
      </section>
    </>
  );
}
