import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
  description: "Five products, one reconciliation core: RentFlow, PortfolioU, TrendyyLeads, AcademyOS and free developer tools.",
};

export default function ProductsPage() {
  return (
    <>
      <section className="page-head" data-screen-label="Products">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Products</span>
          </div>
          <h1 className="page-title">Five products. <span className="em">One spine.</span></h1>
          <p className="page-lead">Each product is built to stand on its own and sold to its own buyer. Underneath, they share the same reconciliation core, the same auth, the same design language. That&apos;s the whole point.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap">
          <div className="product-grid">
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
              <p className="pdesc">Property management with M-Pesa Paybill reconciliation that actually works on weekends. Built for agencies and managers running real portfolios.</p>
              <div className="pmotif">
                <div className="recon-row"><span>Unit 4B · Kilimani</span><span className="amt">KES 45,000</span><span className="badge"><i></i>Matched</span></div>
                <div className="recon-row"><span>Unit 2A · Westlands</span><span className="amt">KES 62,500</span><span className="badge"><i></i>Matched</span></div>
                <div className="recon-row"><span>Unit 7C · Lavington</span><span className="amt">KES 38,000</span><span className="badge"><i></i>Matched</span></div>
              </div>
              <div className="pspacer"></div>
              <div className="pfoot">View RentFlow <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div>
            </Link>

            <Link className="pcard tall" href="/portfoliou" style={{ "--pa": "#A78BFA" } as React.CSSProperties}>
              <div className="ptop">
                <span className="pglyph">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="7" cy="8" r="3" /><circle cx="17" cy="16" r="3" /><path d="M9.5 9.8 14.5 14.2" />
                  </svg>
                </span>
                <span className="ptag">Marketplace</span>
              </div>
              <h3>PortfolioU</h3>
              <p className="pdesc">A two-sided talent marketplace. Students publish real work; employers hire from proof, not promises.</p>
              <div className="pspacer"></div>
              <div className="pfoot">View PortfolioU <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div>
            </Link>

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
              <p className="pdesc">Lead generation that respects your pipeline. Sourced, scored, and synced — no spray-and-pray.</p>
              <div className="pspacer"></div>
              <div className="pfoot">View TrendyyLeads <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div>
            </Link>

            <Link className="pcard" href="/academyos" style={{ "--pa": "#60A5FA" } as React.CSSProperties}>
              <div className="ptop">
                <span className="pglyph">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 8l9-4 9 4-9 4zM7 10.5V15c0 1.5 2.2 2.5 5 2.5s5-1 5-2.5v-4.5" />
                  </svg>
                </span>
                <span className="ptag">School ops</span>
              </div>
              <h3>AcademyOS</h3>
              <p className="pdesc">School management without the spreadsheet sprawl. Admissions, fees, timetables — one system.</p>
              <div className="pspacer"></div>
              <div className="pfoot">View AcademyOS <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div>
            </Link>

            <Link className="pcard" href="/docs" style={{ "--pa": "#22D3EE" } as React.CSSProperties}>
              <div className="ptop">
                <span className="pglyph">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M7 8l4 4-4 4M13 16h4" /><rect x="3" y="4" width="18" height="16" rx="2" />
                  </svg>
                </span>
                <span className="ptag">Free · OSS</span>
              </div>
              <h3>Developer Tools</h3>
              <p className="pdesc">Daraja Playground, a scaffolding CLI, and small utilities. Polished gifts to the community.</p>
              <div className="pspacer"></div>
              <div className="pfoot">Browse tools <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow muted">At a glance</span>
            <h2>Who each one is for.</h2>
            <p>Different buyers, different jobs. One vendor relationship, one invoice, one login.</p>
          </div>
          <div className="compare">
            <table>
              <thead>
                <tr><th>Product</th><th>Built for</th><th>Model</th><th>Signature capability</th><th>Status</th></tr>
              </thead>
              <tbody>
                <tr><td>RentFlow</td><td>Property managers &amp; agencies</td><td>B2B SaaS</td><td>M-Pesa Paybill reconciliation</td><td className="yes">Live</td></tr>
                <tr><td>PortfolioU</td><td>Students &amp; employers</td><td>Two-sided marketplace</td><td>Verified portfolio hiring</td><td className="yes">Live</td></tr>
                <tr><td>TrendyyLeads</td><td>B2B sales teams</td><td>SaaS + usage</td><td>Sourced &amp; scored leads</td><td className="yes">Live</td></tr>
                <tr><td>AcademyOS</td><td>Schools &amp; administrators</td><td>B2B SaaS</td><td>Fees, admissions, timetables</td><td className="muted">Beta</td></tr>
                <tr><td>Developer Tools</td><td>Engineers</td><td>Free / OSS</td><td>Daraja sandbox &amp; scaffolding</td><td className="yes">Live</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div>
            <h2>Not sure where to start?</h2>
            <p>Tell us what you&apos;re running. We&apos;ll point you at the one product that earns its keep first.</p>
          </div>
          <div className="hero-cta" style={{ margin: 0 }}>
            <a className="btn btn-primary" href="/contact">Talk to the team <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
            <Link className="btn btn-ghost" href="/pricing">See pricing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
