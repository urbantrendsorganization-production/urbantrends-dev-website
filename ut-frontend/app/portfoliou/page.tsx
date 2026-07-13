import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PortfolioU — Hire from proof",
  description: "A two-sided talent marketplace where East African students are hired from verified work.",
  alternates: { canonical: "/portfoliou" },
};


export default function PortfolioUPage() {
  return (
    <>
      <section className="page-head" data-screen-label="PortfolioU" style={{ "--accent": "#A78BFA" } as React.CSSProperties}>
        <div className="wrap">
          <div className="split lead" style={{ alignItems: "center" }}>
            <div>
              <div className="breadcrumb"><Link href="/products">Products</Link><span className="sep">/</span><span>PortfolioU</span></div>
              <div style={{ marginTop: 18 }}><span className="prod-badge"><span className="pdot"></span>Two-sided marketplace</span></div>
              <h1 className="page-title">Hire from <span className="em">proof, not promises.</span></h1>
              <p className="page-lead">PortfolioU is where East African students publish real work and employers hire from it. Verified projects, not padded CVs — so the first interview is about fit, not credibility.</p>
              <div className="head-cta">
                <Link className="btn btn-primary" href="/contact">Post your work <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                <Link className="btn btn-ghost" href="/contact">Hire talent</Link>
              </div>
              <div className="stat-band" style={{ marginTop: 38 }}>
                <div className="sb"><div className="n">18,000+</div><div className="l">Student portfolios</div></div>
                <div className="sb"><div className="n">640</div><div className="l">Employers hiring</div></div>
                <div className="sb"><div className="n">11 days</div><div className="l">Median time-to-hire</div></div>
              </div>
            </div>
            <div className="ui-mock">
              <div className="um-bar"><div className="tl"><i></i><i></i><i></i></div><span className="um-title">portfoliou · shortlist — Frontend Intern</span></div>
              <div className="um-body">
                <div className="um-row"><span><span className="um-unit">Amina W.</span> · <span className="um-sub">React · 6 projects</span></span><span className="um-amt">94%</span><span className="um-pill"><i></i>Verified</span></div>
                <div className="um-row"><span><span className="um-unit">Kevin O.</span> · <span className="um-sub">TypeScript · 4 projects</span></span><span className="um-amt">89%</span><span className="um-pill"><i></i>Verified</span></div>
                <div className="um-row"><span><span className="um-unit">Brenda M.</span> · <span className="um-sub">Vue · 5 projects</span></span><span className="um-amt">86%</span><span className="um-pill"><i></i>Verified</span></div>
                <div className="um-row"><span><span className="um-unit">Tariq S.</span> · <span className="um-sub">React · 3 projects</span></span><span className="um-amt">81%</span><span className="um-pill warn"><i></i>In review</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head"><span className="eyebrow muted">For both sides</span><h2>One marketplace, two jobs done.</h2><p>Students get seen for what they can do. Employers get signal instead of noise. The features below serve both.</p></div>
          <div className="feature-grid">
            {[
              { path: "M9 12l2 2 4-4M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z", title: "Verified projects", desc: "Work is checked against its source — repos, live links, commit history — so \"I built this\" actually means something." },
              { path: "M3 3h18v18H3M3 9h18M9 21V9", title: "Proof-of-work profiles", desc: "A profile is a body of work, not a list of adjectives. Case studies, demos, and outcomes up front." },
              { path: "M11 11m-7 0a7 7 0 1014 0 7 7 0 00-14 0M21 21l-4-4", title: "Signal-based search", desc: "Filter by skill, stack, and demonstrated outcomes — then sort by match, not by who paid for a boost." },
              { path: "M5 7h14M5 12h14M5 17h9", title: "Shortlists & notes", desc: "Build a shortlist with your team, leave notes, and move candidates through stages without leaving the app." },
              { path: "M4 12a8 8 0 018-8M20 12a8 8 0 01-8 8M12 4v4M12 16v4", title: "ATS sync", desc: "Push candidates straight into Greenhouse, Lever, or your spreadsheet of record. No copy-paste." },
              { path: "M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z", title: "Student showcase", desc: "Free hosting for student projects with clean share links — good enough to put in an application anywhere." },
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
            <span className="eyebrow muted">How verification works</span>
            <h2 className="page-title" style={{ fontSize: "clamp(26px,3.4vw,38px)", maxWidth: "16ch" }}>Trust, computed.</h2>
            <p className="page-lead" style={{ fontSize: 17 }}>Every project is linked to evidence — a repository, a deployment, a commit trail. PortfolioU checks the link and gives a confidence signal, so employers don&apos;t have to take anyone&apos;s word for it.</p>
          </div>
          <div className="code-window">
            <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">verify.ts</span><span className="lang">PortfolioU</span></div>
            <pre className="code"><span className="k">const</span> <span className="v">proof</span> = <span className="k">await</span> <span className="f">portfoliou</span>.<span className="f">verify</span>{"({"}{"\n"}{"  "}repo: <span className="s">{`"github.com/amina/rentflow-ui"`}</span>,{"\n"}{"  "}live: <span className="s">{`"https://amina.dev/rentflow"`}</span>,{"\n"}{"});"}{"\n"}<span className="c">{"// → commits authored · deploy reachable · ✓"}</span>{"\n"}<span className="p">{"{ verified: "}<span className="n">true</span>{", confidence: "}<span className="n">0.94</span>{" }"}</span></pre>
          </div>
        </div>
      </section>

      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head"><span className="eyebrow muted">FAQ</span><h2>Fair questions.</h2></div>
          <div className="faq">
            <details open><summary>How is student work verified?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary><div className="ans">We check the evidence a student links — repository authorship, a reachable deployment, commit history — and attach a confidence signal. We never claim certainty we don&apos;t have; an unverified project is clearly marked.</div></details>
            <details><summary>Is it really free for students?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary><div className="ans">Yes. Students never pay to publish, host, or be discovered. Employers fund the marketplace.</div></details>
            <details><summary>Which schools can join?<svg className="q-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></summary><div className="ans">Any student in the region can create a profile. We also run formal campus partnerships for universities that want managed onboarding and analytics.</div></details>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div><h2>Show the work. Get hired for it.</h2><p>Students start free. Employers see proof before the first call.</p></div>
          <div className="hero-cta" style={{ margin: 0 }}>
            <Link className="btn btn-primary" href="/signup">Get started <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
            <Link className="btn btn-ghost" href="/products">All products</Link>
          </div>
        </div>
      </section>
    </>
  );
}
