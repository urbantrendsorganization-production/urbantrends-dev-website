import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to the Genmars Tech team about products, custom software, partnerships, or anything else.",
};

const CHANNELS = [
  {
    icon: "M3 8l9-4 9 4v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
    label: "Office",
    value: "Floor 5, Room 354, GTC Towers\nChiromo Road, Westlands\nNairobi, Kenya",
  },
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    label: "General",
    value: "hello@urbantrends.dev",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    label: "Security",
    value: "security@urbantrends.dev",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    label: "Careers",
    value: "jobs@urbantrends.dev",
  },
];

export default function ContactPage() {
  return (
    <div className="contact-page">
      <div className="contact-split">
        {/* Left — info panel */}
        <div className="contact-panel">
          <div className="auth-brand" style={{ marginBottom: "clamp(24px,4vw,40px)" }}>
            <svg className="logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect className="logo-bar" x="2" y="14" width="4" height="8" rx="1.3" fillOpacity=".4" />
              <rect className="logo-bar" x="8" y="9" width="4" height="13" rx="1.3" fill="#22D3EE" fillOpacity=".7" />
              <rect className="logo-bar" x="14" y="4" width="4" height="18" rx="1.3" fill="#22D3EE" />
              <rect className="logo-bar" x="20" y="12" width="4" height="10" rx="1.3" fillOpacity=".4" />
            </svg>
            <span>urbantrends<span className="tld">.dev</span></span>
          </div>

          <h2 className="contact-panel-h">Let&apos;s build<br />something serious.</h2>
          <p className="contact-panel-sub">We&apos;re a small team in Nairobi. We read every message ourselves and respond within one business day — usually faster.</p>

          <div className="contact-channels">
            {CHANNELS.map((c) => (
              <div key={c.label} className="contact-channel">
                <span className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d={c.icon} />
                  </svg>
                </span>
                <div>
                  <div className="contact-dt">{c.label}</div>
                  <div className="contact-dd" style={{ whiteSpace: "pre-line" }}>{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-panel-note">
            <p className="kenya-note">// Response time is typically &lt; 4 hours during Nairobi business hours (EAT, UTC+3).</p>
          </div>
        </div>

        {/* Right — form */}
        <div className="contact-form-side">
          <div className="auth-form-wrap">
            <Link className="auth-back" href="/">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              UrbanTrends
            </Link>

            <h1 className="auth-title">Get in touch</h1>
            <p className="auth-sub">Tell us what you&apos;re working on. The more context, the better.</p>

            <form className="auth-form" action="#" method="post">
              <div className="field-row">
                <div className="field">
                  <label htmlFor="c-fname">First name</label>
                  <input id="c-fname" name="first_name" type="text" placeholder="Wanjiru" autoComplete="given-name" required />
                </div>
                <div className="field">
                  <label htmlFor="c-lname">Last name</label>
                  <input id="c-lname" name="last_name" type="text" placeholder="Kamau" autoComplete="family-name" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="c-email">Work email</label>
                <input id="c-email" name="email" type="email" placeholder="you@company.ke" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="c-org">Company / Organisation</label>
                <input id="c-org" name="organisation" type="text" placeholder="Your company or project" autoComplete="organization" />
              </div>
              <div className="field">
                <label htmlFor="c-subject">What&apos;s this about?</label>
                <select id="c-subject" name="subject" required>
                  <option value="">Select a topic…</option>
                  <optgroup label="Products">
                    <option value="rentflow">RentFlow — property management</option>
                    <option value="portfoliou">PortfolioU — talent marketplace</option>
                    <option value="trendyyleads">TrendyyLeads — lead generation</option>
                    <option value="academyos">AcademyOS — school management</option>
                    <option value="devtools">Developer Tools &amp; APIs</option>
                  </optgroup>
                  <optgroup label="Services">
                    <option value="custom-software">Custom software development</option>
                    <option value="integration">API &amp; M-Pesa integration</option>
                    <option value="consulting">Technical consulting</option>
                    <option value="design">Product design</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="partnership">Partnership / collaboration</option>
                    <option value="press">Press &amp; media</option>
                    <option value="other">Something else</option>
                  </optgroup>
                </select>
              </div>
              <div className="field">
                <label htmlFor="c-message">Message</label>
                <textarea
                  id="c-message"
                  name="message"
                  rows={5}
                  placeholder="Tell us what you're building, what's blocking you, or what you'd like to explore with us."
                  required
                  style={{ resize: "vertical", minHeight: 120 }}
                />
              </div>
              <button className="btn btn-primary auth-submit" type="submit">
                Send message
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              <p className="auth-legal">
                We&apos;ll only use your details to respond to your enquiry. See our <Link href="/privacy">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
