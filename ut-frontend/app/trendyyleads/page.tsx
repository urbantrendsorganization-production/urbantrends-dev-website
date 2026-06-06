import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TrendyyLeads — Pipeline that respects itself",
  description: "B2B lead generation for East Africa — sourced, scored and synced to your CRM.",
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12l5 5L20 6" />
    </svg>
  );
}

export default function TrendyyLeadsPage() {
  return (
    <>
      <section className="page-head" data-screen-label="TrendyyLeads" style={{ "--accent": "#FB923C" } as React.CSSProperties}>
        <div className="wrap">
          <div className="split lead" style={{ alignItems: "center" }}>
            <div>
              <div className="breadcrumb"><Link href="/products">Products</Link><span className="sep">/</span><span>TrendyyLeads</span></div>
              <div style={{ marginTop: 18 }}><span className="prod-badge"><span className="pdot"></span>B2B · Lead generation</span></div>
              <h1 className="page-title">Leads that respect <span className="em">your pipeline.</span></h1>
              <p className="page-lead">TrendyyLeads sources, enriches, and scores B2B prospects for the East African market, then syncs the good ones into your CRM. Less list-buying, more conversations worth having.</p>
              <div className="head-cta">
                <a className="btn btn-primary" href="/signup">Start sourcing <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
                <a className="btn btn-ghost" href="/contact">Book a demo</a>
              </div>
              <div className="stat-band" style={{ marginTop: 38 }}>
                <div className="sb"><div className="n">3.2x</div><div className="l">Reply-rate vs cold lists</div></div>
                <div className="sb"><div className="n">120K+</div><div className="l">Verified EA companies</div></div>
                <div className="sb"><div className="n">&lt; 5%</div><div className="l">Bounce on verified emails</div></div>
              </div>
            </div>
            <div className="ui-mock">
              <div className="um-bar"><div className="tl"><i></i><i></i><i></i></div><span className="um-title">trendyyleads · pipeline — Fintech, Nairobi</span></div>
              <div className="um-body">
                <div className="um-row"><span><span className="um-unit">Acme Pay</span> · <span className="um-sub">Head of Ops</span></span><span className="um-amt">A · 92</span><span className="um-pill"><i></i>Intent</span></div>
                <div className="um-row"><span><span className="um-unit">Zuri SACCO</span> · <span className="um-sub">Finance Lead</span></span><span className="um-amt">A · 88</span><span className="um-pill"><i></i>Verified</span></div>
                <div className="um-row"><span><span className="um-unit">Mara Logistics</span> · <span className="um-sub">COO</span></span><span className="um-amt">B · 74</span><span className="um-pill"><i></i>Verified</span></div>
                <div className="um-row"><span><span className="um-unit">Bistro Group</span> · <span className="um-sub">Owner</span></span><span className="um-amt">C · 61</span><span className="um-pill warn"><i></i>Enriching</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head"><span className="eyebrow muted">What&apos;s inside</span><h2>From raw market to ready conversation.</h2><p>Every step from &quot;who exists&quot; to &quot;who&apos;s worth a message&quot;, handled in one place.</p></div>
          <div className="feature-grid">
            {[
              { path: "M11 11m-7 0a7 7 0 1014 0 7 7 0 00-14 0M21 21l-4-4", title: "Market sourcing", desc: "A maintained graph of East African companies and decision-makers — built for this region, not scraped from one abroad." },
              { path: "M3 3v18h18M7 14l4-4 3 3 5-6", title: "Lead scoring", desc: "Each prospect gets an A–C grade from fit and behaviour, so reps work the top of the list first." },
              { path: "M12 2v6m0 8v6M2 12h6m8 0h6M12 12m-3 0a3 3 0 106 0 3 3 0 00-6 0", title: "Enrichment", desc: "Verified emails, roles, and company signals appended automatically — with bounce rates we'll actually quote you." },
              { path: "M13 2 3 14h7l-1 8 10-12h-7z", title: "Intent signals", desc: "Hiring, funding, expansion, new Paybill — the events that mean a company is ready to buy." },
              { path: "M4 12a8 8 0 018-8M20 12a8 8 0 01-8 8M12 4v4M12 16v4", title: "CRM sync", desc: "Two-way sync with HubSpot, Pipedrive, and Sheets. No exports, no stale duplicates." },
              { path: "M3 5h18v14H3zM3 7l9 6 9-6", title: "Sequences", desc: "Light-touch outreach with reply detection — built to start conversations, not to spam inboxes." },
            ].map((f) => (
              <div key={f.title} className="feature">
                <span className="ficon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={f.path} /></svg></span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section divider-top">
        <div className="wrap split">
          <div>
            <span className="eyebrow muted">No spray-and-pray</span>
            <h2 className="page-title" style={{ fontSize: "clamp(26px,3.4vw,38px)", maxWidth: "16ch" }}>Score first. Send second.</h2>
            <p className="page-lead" style={{ fontSize: 17 }}>A list you can&apos;t trust is worse than no list. TrendyyLeads grades every prospect on fit and intent, so your reps spend their day on the A&apos;s — and your domain reputation survives the quarter.</p>
            <div className="kenya-chips" style={{ marginTop: 26 }}>
              <span className="chip"><span className="tick"></span>Verified emails</span>
              <span className="chip"><span className="tick"></span>Intent events</span>
              <span className="chip"><span className="tick"></span>CRM sync</span>
              <span className="chip"><span className="tick"></span>GDPR-aware</span>
            </div>
          </div>
          <div className="code-window">
            <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">score.ts</span><span className="lang">TrendyyLeads</span></div>
            <pre className="code"><span className="k">const</span> <span className="v">leads</span> = <span className="k">await</span> <span className="f">trendyy</span>.<span className="f">source</span>{"({"}{"\n"}{"  "}industry: <span className="s">{`"fintech"`}</span>,{"\n"}{"  "}region: <span className="s">{`"KE"`}</span>,{"\n"}{"  "}intent: [<span className="s">{`"hiring"`}</span>, <span className="s">{`"new-paybill"`}</span>],{"\n"}{"});"}{"\n"}{"\n"}leads.<span className="f">filter</span>{"(l => l.grade === "}<span className="s">{`"A"`}</span>{")"}{";  "}{"\n"}<span className="p">{"→ 214 graded · 38 grade A · synced to CRM"}</span></pre>
          </div>
        </div>
      </section>

      <section className="section divider-top" id="pricing">
        <div className="wrap">
          <div className="section-head center-head"><span className="eyebrow muted">Pricing</span><h2>Per seat, plus usage.</h2><p>Pay for the reps who use it and the leads you enrich. Nothing for shelfware.</p></div>
          <div className="pricing-grid">
            <div className="price-card">
              <div className="ptier">Solo</div><div className="pprice">KES 4,500<small> /seat/mo</small></div>
              <p className="psub">For founders and single reps.</p>
              <ul className="plist">
                <li><CheckIcon />Sourcing &amp; scoring</li>
                <li><CheckIcon />500 enrichments / mo</li>
                <li><CheckIcon />Sheets sync</li>
              </ul>
              <div className="pcta"><a className="btn btn-ghost" href="/signup">Start free trial</a></div>
            </div>
            <div className="price-card featured">
              <span className="price-badge">Most popular</span>
              <div className="ptier">Team</div><div className="pprice">KES 12,000<small> /seat/mo</small></div>
              <p className="psub">For sales teams with a number to hit.</p>
              <ul className="plist">
                <li><CheckIcon />Everything in Solo</li>
                <li><CheckIcon />Intent signals</li>
                <li><CheckIcon />HubSpot &amp; Pipedrive sync</li>
                <li><CheckIcon />Sequences &amp; reply detection</li>
              </ul>
              <div className="pcta"><a className="btn btn-primary" href="/signup">Start free trial</a></div>
            </div>
            <div className="price-card">
              <div className="ptier">Scale</div><div className="pprice">Custom</div>
              <p className="psub">For high-volume outbound orgs.</p>
              <ul className="plist">
                <li><CheckIcon />Everything in Team</li>
                <li><CheckIcon />Unlimited enrichment</li>
                <li><CheckIcon />Custom data &amp; SLA</li>
              </ul>
              <div className="pcta"><a className="btn btn-ghost" href="/contact">Contact sales</a></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head"><span className="eyebrow muted">FAQ</span><h2>Straight answers.</h2></div>
          <div className="faq">
            <details open><summary>Where does the data come from?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary><div className="ans">A maintained graph of public company and role data for the East African market, continuously verified. We tell you the bounce rate before you send, not after.</div></details>
            <details><summary>Is this compliant?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary><div className="ans">We&apos;re built to respect data-protection rules, including Kenya&apos;s DPA. You control suppression lists, opt-outs are honoured automatically, and we don&apos;t sell personal data.</div></details>
            <details><summary>Will it sync with my CRM?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary><div className="ans">Two-way with HubSpot and Pipedrive on Team and above, and Google Sheets on every plan. New leads and status changes flow both directions.</div></details>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div><h2>Fill the pipeline. Skip the junk.</h2><p>Start a free trial and grade your first 200 leads today.</p></div>
          <div className="hero-cta" style={{ margin: 0 }}>
            <a className="btn btn-primary" href="/signup">Start free trial <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
            <Link className="btn btn-ghost" href="/products">All products</Link>
          </div>
        </div>
      </section>
    </>
  );
}
