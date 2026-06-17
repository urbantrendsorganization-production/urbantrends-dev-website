import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RentFlow — Property management, reconciled",
  description: "Property management with M-Pesa Paybill reconciliation that works on weekends.",
};


export default function RentFlowPage() {
  return (
    <>
      <section className="page-head" data-screen-label="RentFlow" style={{ "--accent": "#34D399" } as React.CSSProperties}>
        <div className="wrap">
          <div className="split lead" style={{ alignItems: "center" }}>
            <div>
              <div className="breadcrumb"><Link href="/products">Products</Link><span className="sep">/</span><span>RentFlow</span></div>
              <div style={{ marginTop: 18 }}><span className="prod-badge"><span className="pdot"></span>B2B · Property management</span></div>
              <h1 className="page-title">Rent that <span className="em">reconciles itself.</span></h1>
              <p className="page-lead">RentFlow ties every M-Pesa Paybill settlement to the right unit, the right tenant, and the right invoice — automatically, including on weekends. Less spreadsheet archaeology, more collected rent.</p>
              <div className="head-cta">
                <Link className="btn btn-primary" href="/signup">Start free trial <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                <Link className="btn btn-ghost" href="/contact">Book a demo</Link>
              </div>
              <div className="stat-band" style={{ marginTop: 38 }}>
                <div className="sb"><div className="n">98.4%</div><div className="l">Auto-matched on first pass</div></div>
                <div className="sb"><div className="n">4 days</div><div className="l">Faster month-end close</div></div>
                <div className="sb"><div className="n">1,200+</div><div className="l">Units under management</div></div>
              </div>
            </div>
            <div className="ui-mock">
              <div className="um-bar"><div className="tl"><i></i><i></i><i></i></div><span className="um-title">rentflow · reconciliation — June 2026</span></div>
              <div className="um-body">
                <div className="um-row"><span><span className="um-unit">Unit 4B</span> · <span className="um-sub">Kilimani</span></span><span className="um-amt">KES 45,000</span><span className="um-pill"><i></i>Matched</span></div>
                <div className="um-row"><span><span className="um-unit">Unit 2A</span> · <span className="um-sub">Westlands</span></span><span className="um-amt">KES 62,500</span><span className="um-pill"><i></i>Matched</span></div>
                <div className="um-row"><span><span className="um-unit">Unit 7C</span> · <span className="um-sub">Lavington</span></span><span className="um-amt">KES 38,000</span><span className="um-pill"><i></i>Matched</span></div>
                <div className="um-row"><span><span className="um-unit">Unit 1D</span> · <span className="um-sub">Kileleshwa</span></span><span className="um-amt">KES 27,400</span><span className="um-pill warn"><i></i>Part-pay</span></div>
                <div className="um-row"><span><span className="um-unit">Unit 9A</span> · <span className="um-sub">Parklands</span></span><span className="um-amt">KES 52,000</span><span className="um-pill"><i></i>Matched</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section divider-top" style={{ marginTop: "clamp(40px,6vw,72px)" }}>
        <div className="wrap split">
          <div>
            <span className="eyebrow muted">The problem</span>
            <h2 className="page-title" style={{ fontSize: "clamp(28px,3.6vw,40px)", maxWidth: "16ch" }}>The Monday reconciliation ritual.</h2>
            <p className="page-lead" style={{ fontSize: 17 }}>Paybill statements in one tab. A rent roll in another. A WhatsApp thread from a caretaker in a third. Someone spends the first morning of every week deciding which &quot;MPESA REF QF…&quot; belongs to which tenant. RentFlow does that the moment money lands.</p>
          </div>
          <div className="code-window">
            <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">before_and_after.log</span><span className="lang">RentFlow</span></div>
            <pre className="code"><span className="c">{"// Before — manual, batched, late"}</span>{"\n"}<span className="p">{"Paybill statement  →  export.csv"}</span>{"\n"}<span className="p">{"Rent roll          →  sheet (v7-FINAL)"}</span>{"\n"}<span className="p">{"Match              →  human, on Monday"}</span>{"\n"}{"\n"}<span className="c">{"// After — automatic, instant"}</span>{"\n"}<span className="f">{"onSettlement"}</span>{"(tx) "}<span className="k">{"=>"}</span>{" {"}{"\n"}{"  "}<span className="k">const</span>{" unit = "}<span className="f">resolve</span>{"(tx.account);"}{"\n"}{"  "}<span className="k">await</span>{" "}<span className="f">apply</span>{"(tx, unit.invoice);"}{"\n"}{"}"}{"\n"}<span className="n">{"// matched in 38ms · receipt sent · ledger updated"}</span></pre>
          </div>
        </div>
      </section>

      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow muted">What&apos;s inside</span>
            <h2>Everything a portfolio actually needs.</h2>
            <p>No modules you&apos;ll never open. The features below are the ones property managers use every single day.</p>
          </div>
          <div className="feature-grid">
            {[
              { icon: "M4 7h16M4 12h16M4 17h10", title: "Auto-reconciliation", desc: "Paybill settlements matched to units and invoices the instant they settle — partials, overpayments and prepayments included." },
              { icon: "M12 2v20M5 7l7-4 7 4M5 17l7 4 7-4", title: "STK Push collection", desc: "Trigger a payment prompt straight to a tenant's phone. They tap, you're paid, the ledger updates itself." },
              { icon: "M3 4h18v16H3zM3 9h18M8 14h5", title: "Tenant ledgers", desc: "Every tenant gets a clean running balance, downloadable statement, and an automatic receipt on each payment." },
              { icon: "M12 8v4l3 2M12 12a9 9 0 100-18 9 9 0 000 18", title: "Arrears & reminders", desc: "Aged-debt views and scheduled nudges over SMS — polite on day one, firmer by day fourteen." },
              { icon: "M3 3v18h18M7 14l4-4 3 3 5-6", title: "Owner payouts", desc: "Net out management fees and disburse to landlords via B2C — with a statement they can actually follow." },
              { icon: "M9 12l2 2 4-4M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z", title: "eTIMS-ready", desc: "Compliant invoices and exports that line up with KRA eTIMS — so your accountant stops emailing you." },
            ].map((f) => (
              <div key={f.title} className="feature">
                <span className="ficon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={f.icon} /></svg></span>
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
            <span className="eyebrow muted">Weekend-proof</span>
            <h2 className="page-title" style={{ fontSize: "clamp(28px,3.6vw,40px)", maxWidth: "18ch" }}>It doesn&apos;t wait for a batch job.</h2>
            <p className="page-lead" style={{ fontSize: 17 }}>Settlements land at all hours. RentFlow listens on the Daraja callback and reconciles in real time, so a Saturday-afternoon payment is matched before the tenant has closed the app.</p>
            <div className="kenya-chips" style={{ marginTop: 26 }}>
              <span className="chip"><span className="tick"></span>M-Pesa Paybill</span>
              <span className="chip"><span className="tick"></span>STK Push</span>
              <span className="chip"><span className="tick"></span>B2C payouts</span>
              <span className="chip"><span className="tick"></span>KRA eTIMS</span>
            </div>
          </div>
          <div className="code-window">
            <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">callback.ts</span><span className="lang">Daraja</span></div>
            <pre className="code"><span className="f">app</span>.<span className="f">post</span>(<span className="s">{`"/mpesa/callback"`}</span>, <span className="k">async</span> {"(req) =>"} {"{"}{"\n"}{"  "}<span className="k">const</span> tx = <span className="f">parse</span>{"(req.body);"}{"\n"}{"  "}<span className="k">const</span> unit = <span className="k">await</span> <span className="f">units</span>.<span className="f">byAccount</span>{"(tx.billRef);"}{"\n"}{"\n"}{"  "}<span className="k">await</span> <span className="f">ledger</span>.<span className="f">apply</span>{"({"}{"\n"}{"    "}unit, amount: tx.amount, ref: tx.receipt,{"\n"}{"  "}{"});"}{"\n"}{"  "}<span className="k">await</span> <span className="f">receipts</span>.<span className="f">send</span>{"(unit.tenant);"}{"\n"}{"});"}{"\n"}<span className="c">{"// Sat 14:32 EAT — matched, receipted, done."}</span></pre>
          </div>
        </div>
      </section>

      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head"><span className="eyebrow muted">FAQ</span><h2>The questions managers actually ask.</h2></div>
          <div className="faq">
            <details open>
              <summary>Do I need a new Paybill number?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary>
              <div className="ans">No. RentFlow connects to your existing Paybill through Daraja. If you don&apos;t have one yet, our Scale plan includes a guided setup with Safaricom.</div>
            </details>
            <details>
              <summary>What happens with partial or overpayments?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary>
              <div className="ans">They&apos;re applied to the tenant&apos;s running balance and flagged. A part-payment shows as &quot;Part-pay&quot;; an overpayment carries forward as credit to the next invoice. Nothing silently disappears.</div>
            </details>
            <details>
              <summary>Can I pay landlords directly from RentFlow?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary>
              <div className="ans">Yes. On Growth and above, RentFlow nets out your management fee and disburses the balance to owners via M-Pesa B2C, with a statement attached.</div>
            </details>
            <details>
              <summary>Is my data compliant with KRA?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary>
              <div className="ans">Invoices and exports are formatted to line up with KRA eTIMS requirements. You stay the taxpayer of record; we just make the paperwork match reality.</div>
            </details>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div>
            <h2>Collect rent like it&apos;s 2026.</h2>
            <p>Free for your first 15 units. No card, no Paybill migration, no Monday.</p>
          </div>
          <div className="hero-cta" style={{ margin: 0 }}>
            <Link className="btn btn-primary" href="/signup">Start free trial <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
            <Link className="btn btn-ghost" href="/contact">Talk to us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
