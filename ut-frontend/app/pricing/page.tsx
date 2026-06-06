import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Honest, per-product pricing. Start free almost everywhere; the developer tools are always free.",
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12l5 5L20 6" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <>
      <section className="page-head" data-screen-label="Pricing">
        <div className="wrap center-head" style={{ textAlign: "center" }}>
          <div className="breadcrumb" style={{ justifyContent: "center" }}>
            <Link href="/">Home</Link><span className="sep">/</span><span>Pricing</span>
          </div>
          <h1 className="page-title" style={{ marginInline: "auto" }}>Honest pricing, <span className="em">per product.</span></h1>
          <p className="page-lead" style={{ marginInline: "auto" }}>Each product is priced for the value it delivers — usually per unit, per seat, or per active user. Start free almost everywhere. The developer tools are, and always will be, free.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap">
          <div className="pricing-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <div className="price-card" style={{ "--accent": "#34D399" } as React.CSSProperties}>
              <div className="ptier">RentFlow</div>
              <div className="pprice">KES 60<small> /unit/mo</small></div>
              <p className="psub">Free up to 15 units, then per unit.</p>
              <ul className="plist">
                <li><CheckIcon />Auto-reconciliation</li>
                <li><CheckIcon />STK Push &amp; payouts</li>
                <li><CheckIcon />eTIMS exports</li>
              </ul>
              <div className="pcta"><Link className="btn btn-ghost" href="/rentflow">View plans</Link></div>
            </div>
            <div className="price-card" style={{ "--accent": "#A78BFA" } as React.CSSProperties}>
              <div className="ptier">PortfolioU</div>
              <div className="pprice">Free<small> for students</small></div>
              <p className="psub">Employers pay per hire or per seat.</p>
              <ul className="plist">
                <li><CheckIcon />Verified portfolios</li>
                <li><CheckIcon />Candidate search</li>
                <li><CheckIcon />ATS sync</li>
              </ul>
              <div className="pcta"><Link className="btn btn-ghost" href="/portfoliou">View plans</Link></div>
            </div>
            <div className="price-card" style={{ "--accent": "#FB923C" } as React.CSSProperties}>
              <div className="ptier">TrendyyLeads</div>
              <div className="pprice">KES 4,500<small> /seat/mo</small></div>
              <p className="psub">Plus usage on enriched leads.</p>
              <ul className="plist">
                <li><CheckIcon />Sourced &amp; scored leads</li>
                <li><CheckIcon />CRM sync</li>
                <li><CheckIcon />Intent signals</li>
              </ul>
              <div className="pcta"><Link className="btn btn-ghost" href="/trendyyleads">View plans</Link></div>
            </div>
            <div className="price-card" style={{ "--accent": "#60A5FA" } as React.CSSProperties}>
              <div className="ptier">AcademyOS</div>
              <div className="pprice">KES 120<small> /student/yr</small></div>
              <p className="psub">Billed annually, per enrolled student.</p>
              <ul className="plist">
                <li><CheckIcon />Fees &amp; M-Pesa</li>
                <li><CheckIcon />Admissions</li>
                <li><CheckIcon />Timetables &amp; reports</li>
              </ul>
              <div className="pcta"><Link className="btn btn-ghost" href="/academyos">View plans</Link></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow muted">Platform</span>
            <h2>What every plan shares.</h2>
            <p>The studio platform underneath all five products — auth, payments, compliance, support. These don&apos;t change between products.</p>
          </div>
          <div className="compare">
            <table>
              <thead><tr><th>Capability</th><th>Free</th><th>Pro</th><th>Enterprise</th></tr></thead>
              <tbody>
                <tr><td>M-Pesa / Daraja integration</td><td className="yes">Included</td><td className="yes">Included</td><td className="yes">Included</td></tr>
                <tr><td>KRA eTIMS-ready exports</td><td className="muted">—</td><td className="yes">Included</td><td className="yes">Included</td></tr>
                <tr><td>Team members</td><td>2</td><td>Unlimited</td><td>Unlimited</td></tr>
                <tr><td>API &amp; webhooks</td><td>Read-only</td><td className="yes">Full</td><td className="yes">Full</td></tr>
                <tr><td>SSO &amp; audit logs</td><td className="muted">—</td><td className="muted">—</td><td className="yes">Included</td></tr>
                <tr><td>Support</td><td>Community</td><td>Email · next-day</td><td>Priority · SLA</td></tr>
                <tr><td>Data residency</td><td className="muted">—</td><td className="muted">—</td><td className="yes">On request</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head"><span className="eyebrow muted">FAQ</span><h2>Billing, plainly.</h2></div>
          <div className="faq">
            <details open>
              <summary>How am I billed?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary>
              <div className="ans">Monthly or annually, in KES, via M-Pesa or card. Annual plans get two months off. You&apos;ll always see usage before it&apos;s invoiced — no surprise overages.</div>
            </details>
            <details>
              <summary>Can I use more than one product?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary>
              <div className="ans">Yes — one account, one login, one invoice across every product you use. Multi-product accounts get a portfolio discount; talk to us.</div>
            </details>
            <details>
              <summary>Is there really a free tier?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary>
              <div className="ans">On most products, yes, with real limits rather than a countdown clock. The developer tools are free with no tier at all.</div>
            </details>
            <details>
              <summary>What happens if I cancel?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary>
              <div className="ans">You keep access until the end of the period, and you can export everything — ledgers, tenants, leads, records — as CSV or via the API. Your data is yours.</div>
            </details>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div>
            <h2>Start free. Upgrade when it pays for itself.</h2>
            <p>No card to begin. Move to a paid plan the day the product earns its keep — not before.</p>
          </div>
          <div className="hero-cta" style={{ margin: 0 }}>
            <Link className="btn btn-primary" href="/products">Explore products <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
            <a className="btn btn-ghost" href="/contact">Talk to sales</a>
          </div>
        </div>
      </section>
    </>
  );
}
