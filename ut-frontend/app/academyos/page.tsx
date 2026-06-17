import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AcademyOS — Run the whole school",
  description: "School management in one system: admissions, M-Pesa fees, timetables and reports.",
};


export default function AcademyOSPage() {
  return (
    <>
      <section className="page-head" data-screen-label="AcademyOS" style={{ "--accent": "#60A5FA" } as React.CSSProperties}>
        <div className="wrap">
          <div className="split lead" style={{ alignItems: "center" }}>
            <div>
              <div className="breadcrumb"><Link href="/products">Products</Link><span className="sep">/</span><span>AcademyOS</span></div>
              <div style={{ marginTop: 18 }}><span className="prod-badge"><span className="pdot"></span>School operations · Beta</span></div>
              <h1 className="page-title">Run the whole school, <span className="em">one system.</span></h1>
              <p className="page-lead">AcademyOS replaces the spreadsheet sprawl: admissions, fee collection over M-Pesa, timetables, attendance and reports — in a single place that parents, teachers and administrators all trust.</p>
              <div className="head-cta">
                <Link className="btn btn-primary" href="/contact">Join the beta <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                <Link className="btn btn-ghost" href="/contact">Book a demo</Link>
              </div>
              <div className="stat-band" style={{ marginTop: 38 }}>
                <div className="sb"><div className="n">40+</div><div className="l">Schools in beta</div></div>
                <div className="sb"><div className="n">31,000</div><div className="l">Students managed</div></div>
                <div className="sb"><div className="n">1 day</div><div className="l">To collect a term&apos;s fees</div></div>
              </div>
            </div>
            <div className="ui-mock">
              <div className="um-bar"><div className="tl"><i></i><i></i><i></i></div><span className="um-title">academyos · fees — Term 2, Form 3</span></div>
              <div className="um-body">
                <div className="um-row"><span><span className="um-unit">Form 3 West</span> · <span className="um-sub">42 students</span></span><span className="um-amt">96%</span><span className="um-pill"><i></i>Paid</span></div>
                <div className="um-row"><span><span className="um-unit">Form 3 East</span> · <span className="um-sub">39 students</span></span><span className="um-amt">91%</span><span className="um-pill"><i></i>Paid</span></div>
                <div className="um-row"><span><span className="um-unit">Form 3 North</span> · <span className="um-sub">40 students</span></span><span className="um-amt">88%</span><span className="um-pill"><i></i>Paid</span></div>
                <div className="um-row"><span><span className="um-unit">Form 3 South</span> · <span className="um-sub">38 students</span></span><span className="um-amt">79%</span><span className="um-pill warn"><i></i>Chasing</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head"><span className="eyebrow muted">What&apos;s inside</span><h2>The whole school day, covered.</h2><p>Every module a school actually runs on — and nothing it doesn&apos;t.</p></div>
          <div className="feature-grid">
            {[
              { path: "M16 21v-2a4 4 0 00-8 0v2M12 7a4 4 0 100-8 4 4 0 000 8", title: "Admissions", desc: "An application pipeline from enquiry to enrolment, with documents, offers and waitlists in one view." },
              { path: "M12 2v6m0 8v6M9 9h6a3 3 0 010 6H9", title: "Fee collection", desc: "Collect over M-Pesa Paybill and STK Push, reconciled per student — the same engine that powers RentFlow." },
              { path: "M3 4h18v17H3M3 9h18M8 2v4M16 2v4", title: "Timetables", desc: "Build and publish class timetables with clash detection, and push changes to teachers instantly." },
              { path: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11", title: "Attendance", desc: "Mark attendance in seconds, flag patterns early, and keep a record that holds up at inspection." },
              { path: "M4 19V5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2zM8 12h8M8 16h5", title: "Report cards", desc: "Grades in, formatted report cards out — exam-board aware, ready to print or share with parents." },
              { path: "M12 20a8 8 0 10-8-8M4 12H2M8 6L4.5 4.5M12 4V2M12 12a3 3 0 100-6 3 3 0 000 6", title: "Parent portal", desc: "Parents see balances, attendance and results — and pay fees — from their phone, in their language." },
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
            <span className="eyebrow muted">Fees, reconciled</span>
            <h2 className="page-title" style={{ fontSize: "clamp(26px,3.4vw,38px)", maxWidth: "16ch" }}>Term fees, collected by Friday.</h2>
            <p className="page-lead" style={{ fontSize: 17 }}>Every M-Pesa payment is matched to the right student and term automatically — so the bursar sees who&apos;s paid, who&apos;s partial, and who needs a gentle reminder, without touching a spreadsheet.</p>
            <div className="kenya-chips" style={{ marginTop: 26 }}>
              <span className="chip"><span className="tick"></span>M-Pesa Paybill</span>
              <span className="chip"><span className="tick"></span>STK Push</span>
              <span className="chip"><span className="tick"></span>Per-student ledgers</span>
              <span className="chip"><span className="tick"></span>SMS reminders</span>
            </div>
          </div>
          <div className="code-window">
            <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">fees.ts</span><span className="lang">AcademyOS</span></div>
            <pre className="code"><span className="f">academy</span>.<span className="f">onPayment</span>{"((tx) => {"}{"\n"}{"  "}<span className="k">const</span> student = <span className="f">resolve</span>{"(tx.account);"}{"\n"}{"  "}<span className="f">ledger</span>.<span className="f">apply</span>{"(student, tx.amount);"}{"\n"}{"  "}<span className="k">if</span> {"(student.balance > 0)"}{"\n"}{"    "}<span className="f">remind</span>{"(student.parent, "}<span className="s">{`"sms"`}</span>{");"}{"\n"}{"});"}{"\n"}<span className="p">{"→ Form 3 West · 96% collected · term 2"}</span></pre>
          </div>
        </div>
      </section>

      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head"><span className="eyebrow muted">FAQ</span><h2>What administrators ask.</h2></div>
          <div className="faq">
            <details open><summary>It&apos;s in beta — is it safe to run our school on?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary><div className="ans">Forty schools already do. Beta means we&apos;re still adding modules and we onboard you personally — not that the core is shaky. Fees, attendance and admissions are production-grade.</div></details>
            <details><summary>Can parents pay from their phones?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary><div className="ans">Yes. Parents pay fees via M-Pesa straight from the portal, and the payment reconciles to their child&apos;s account automatically. No more &quot;send me the M-Pesa code&quot;.</div></details>
            <details><summary>Will it work with our existing exam system?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary><div className="ans">Report cards are exam-board aware and exportable. During onboarding we map your grading scheme so report cards come out the way your school already issues them.</div></details>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div><h2>Retire the spreadsheets.</h2><p>Join the beta — onboarding and setup are on us while we&apos;re early.</p></div>
          <div className="hero-cta" style={{ margin: 0 }}>
            <Link className="btn btn-primary" href="/contact">Join the beta <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
            <Link className="btn btn-ghost" href="/products">All products</Link>
          </div>
        </div>
      </section>
    </>
  );
}
