import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

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
    icon: "M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M6.343 17.657a9 9 0 010-12.728M9.172 14.828a5 5 0 010-7.072M12 12h.01",
    label: "Support",
    value: "support@urbantrends.dev",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    label: "Security",
    value: "security@urbantrends.dev",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    label: "Join the team",
    value: "team@urbantrends.dev",
  },
  {
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
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
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
