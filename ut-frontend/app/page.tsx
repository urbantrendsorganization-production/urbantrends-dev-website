import Link from "next/link";
import LogoStrip from "@/components/LogoStrip";

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
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
          </div>

          {/* Hero art — CSS [data-hero] on <html> controls which is visible */}
          <div className="hero-art">
            {/* (1) Animated infra diagram */}
            <div className="art-diagram">
              <div className="diagram-frame">
                <div className="df-head">
                  <span className="mono-label">reconciliation_core.svc</span>
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
                  aria-label="Architecture diagram: M-Pesa, Daraja and KRA feed the UrbanTrends reconciliation core, which powers the product suite."
                >
                  <defs>
                    <pattern id="dg" width="22" height="22" patternUnits="userSpaceOnUse">
                      <circle cx="1.2" cy="1.2" r="1.2" className="dot-grid-bg" />
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="760" height="410" fill="url(#dg)" opacity=".5" />
                  {/* connectors */}
                  <path className="flow" d="M156,107 C 245,107 245,196 314,196" />
                  <path className="flow" d="M156,199 C 245,199 285,220 314,220" />
                  <path className="flow" d="M156,291 C 245,291 245,244 314,244" />
                  <path className="flow" d="M446,196 C 520,196 520,92 586,92" />
                  <path className="flow" d="M446,210 C 520,210 520,172 586,172" />
                  <path className="flow" d="M446,230 C 520,230 520,252 586,252" />
                  <path className="flow" d="M446,244 C 520,244 520,332 586,332" />
                  {/* animated pulses */}
                  <path className="flow-pulse" style={{ animationDelay: "0s" }}   d="M156,107 C 245,107 245,196 314,196" />
                  <path className="flow-pulse" style={{ animationDelay: ".5s" }}  d="M156,199 C 245,199 285,220 314,220" />
                  <path className="flow-pulse" style={{ animationDelay: "1s" }}   d="M156,291 C 245,291 245,244 314,244" />
                  <path className="flow-pulse" style={{ animationDelay: ".3s" }}  d="M446,196 C 520,196 520,92 586,92" />
                  <path className="flow-pulse" style={{ animationDelay: ".9s" }}  d="M446,210 C 520,210 520,172 586,172" />
                  <path className="flow-pulse" style={{ animationDelay: "1.4s" }} d="M446,230 C 520,230 520,252 586,252" />
                  <path className="flow-pulse" style={{ animationDelay: ".7s" }}  d="M446,244 C 520,244 520,332 586,332" />
                  {/* input nodes */}
                  <rect className="node-rect" x="24"  y="84"  width="132" height="46" rx="8" />
                  <text className="node-t" x="90" y="112" textAnchor="middle">M-PESA</text>
                  <rect className="node-rect" x="24"  y="176" width="132" height="46" rx="8" />
                  <text className="node-t" x="90" y="204" textAnchor="middle">DARAJA API</text>
                  <rect className="node-rect" x="24"  y="268" width="132" height="46" rx="8" />
                  <text className="node-t" x="90" y="296" textAnchor="middle">KRA eTIMS</text>
                  {/* reconciliation core */}
                  <rect className="node-core" x="314" y="154" width="132" height="132" rx="14" />
                  <rect x="360" y="194" width="7" height="12" rx="1.5" fill="var(--accent)" fillOpacity=".5" />
                  <rect x="371" y="188" width="7" height="18" rx="1.5" fill="var(--accent)" fillOpacity=".75" />
                  <rect x="382" y="182" width="7" height="24" rx="1.5" fill="var(--accent)" />
                  <rect x="393" y="191" width="7" height="15" rx="1.5" fill="var(--accent)" fillOpacity=".4" />
                  <text className="node-t" x="380" y="232" textAnchor="middle" style={{ fontSize: "12.5px", letterSpacing: ".06em" }}>URBANTRENDS</text>
                  <text className="node-s" x="380" y="250" textAnchor="middle">RECONCILIATION CORE</text>
                  {/* output nodes */}
                  <rect className="node-rect" x="586" y="70"  width="150" height="44" rx="8" />
                  <text className="node-t" x="661" y="97"  textAnchor="middle">RentFlow</text>
                  <rect className="node-rect" x="586" y="150" width="150" height="44" rx="8" />
                  <text className="node-t" x="661" y="177" textAnchor="middle">PortfolioU</text>
                  <rect className="node-rect" x="586" y="230" width="150" height="44" rx="8" />
                  <text className="node-t" x="661" y="257" textAnchor="middle">TrendyyLeads</text>
                  <rect className="node-rect" x="586" y="310" width="150" height="44" rx="8" />
                  <text className="node-t" x="661" y="337" textAnchor="middle">AcademyOS</text>
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
                <div className="tavatar">JN</div>
                <div><div className="tname">Joy Njeri</div><div className="trole">Director, Jasmine Properties Ltd</div></div>
                <span className="tprod" style={{ "--pa": "#34D399" } as React.CSSProperties}>RentFlow</span>
              </div>
            </div>
            <div className="tcard">
              <p className="tquote">&ldquo;We integrated STK Push in an afternoon using the Playground and Scaffold CLI. Our previous attempt with the raw Daraja API took a senior engineer almost two weeks.&rdquo;</p>
              <div className="tfoot">
                <div className="tavatar">DK</div>
                <div><div className="tname">David Kamau</div><div className="trole">CTO, Pesabase</div></div>
                <span className="tprod" style={{ "--pa": "#22D3EE" } as React.CSSProperties}>Dev Tools</span>
              </div>
            </div>
            <div className="tcard">
              <p className="tquote">&ldquo;PortfolioU sent us three candidates with real, verifiable work. We hired two of them. It&apos;s the only place we&apos;ve found developers who can actually show what they&apos;ve built.&rdquo;</p>
              <div className="tfoot">
                <div className="tavatar">AM</div>
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
