import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Careers",
  description: "Build the boring parts that matter. Open roles at UrbanTrends in Nairobi.",
  alternates: { canonical: "/careers" },
};

const PERKS = [
  { title: "Real ownership", desc: "Meaningful equity and a real say in what we build. Small team, big surface area.", icon: "M12 2l8 4v6c0 5-3.5 7.5-8 10-4.5-2.5-8-5-8-10V6z" },
  { title: "One office, Nairobi", desc: "We work together, in person, most days. Less Slack theatre, more shipping.", icon: "M3 21h18M5 21V7l7-4 7 4v14" },
  { title: "Senior peers", desc: "You'll work next to people who've shipped payments software that real businesses depend on.", icon: "M7 8l4 4-4 4M13 16h4M3 4h18v16H3z" },
  { title: "Health & time", desc: "Comprehensive cover, generous leave, and the trust to take it without a performance.", icon: "M12 8v8M8 12h8M12 12a9 9 0 100-18 9 9 0 000 18" },
  { title: "Learning budget", desc: "Books, courses, conferences. If it makes you better at the craft, we'll cover it.", icon: "M4 19V5l8 4 8-4v14l-8 4z" },
  { title: "No whiteboard puzzles", desc: "Our interview is a paid work trial on a real problem. You'll know exactly what the job is.", icon: "M3 12h4l3 7 4-14 3 7h4" },
];

const ROLES = [
  { title: "Senior Backend Engineer", dept: "Engineering", location: "Nairobi · On-site", type: "Full-time" },
  { title: "Payments Engineer (Daraja / M-Pesa)", dept: "Engineering", location: "Nairobi · On-site", type: "Full-time" },
  { title: "Product Designer", dept: "Design", location: "Nairobi · Hybrid", type: "Full-time" },
  { title: "Customer Success Lead", dept: "Success", location: "Nairobi · On-site", type: "Full-time" },
  { title: "Founding GTM / Sales", dept: "Growth", location: "Nairobi · Hybrid", type: "Full-time" },
];

export default function CareersPage() {
  return (
    <>
      <section className="page-head" data-screen-label="Careers">
        <div className="wrap">
          <div className="breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Careers</span></div>
          <h1 className="page-title">Build the boring parts <span className="em">that matter.</span></h1>
          <p className="page-lead">We&apos;re small, senior, and in one room in Nairobi. We hire for judgment and care, ship serious software, and answer support tickets on Saturdays — because settlements land on Saturdays.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(20px,3vw,36px)" }}>
        <div className="wrap">
          <div className="section-head"><span className="eyebrow muted">Why here</span><h2>What you get, plainly.</h2></div>
          <div className="perk-grid">
            {PERKS.map((p) => (
              <div key={p.title} className="perk">
                <span className="picon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d={p.icon} /></svg></span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office photo */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="about-photo-band">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
              alt="Genmars Tech team collaborating in the Nairobi office"
              width={1400}
              height={500}
              className="about-illustration"
            />
            <div className="about-photo-caption">
              Floor 5, GTC Towers, Westlands — where the boring parts get built properly.
            </div>
          </div>
        </div>
      </section>

      <section className="section divider-top">
        <div className="wrap">
          <div className="section-head"><span className="eyebrow muted">Open roles</span><h2>Five seats, currently open.</h2></div>
          <div className="role-list">
            {ROLES.map((r) => (
              <a key={r.title} className="role" href={`mailto:jobs@urbantrends.dev?subject=Application: ${r.title}`}>
                <div>
                  <div className="rtitle">{r.title}</div>
                  <div className="rmeta">
                    <span>{r.dept}</span>
                    <span>{r.location}</span>
                    <span>{r.type}</span>
                  </div>
                </div>
                <div className="rspace"></div>
                <svg className="rarrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
            ))}
          </div>
          <p className="kenya-note" style={{ marginTop: 28 }}>{'// '}Don&apos;t see your role? Email <b>jobs@urbantrends.dev</b> with what you&apos;d build here. We read every one.</p>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div>
            <h2>Think you&apos;d fit?</h2>
            <p>Tell us about something you built that you&apos;re quietly proud of. That&apos;s the whole application.</p>
          </div>
          <div className="hero-cta" style={{ margin: 0 }}>
            <a className="btn btn-primary" href="mailto:jobs@urbantrends.dev">Apply now <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
            <Link className="btn btn-ghost" href="/about">Meet the team</Link>
          </div>
        </div>
      </section>
    </>
  );
}
