import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create account",
  description: "Start building with Genmars Tech · UrbanTrends.",
};

const PRODUCTS = [
  { name: "RentFlow", color: "#34D399", desc: "Property management" },
  { name: "PortfolioU", color: "#A78BFA", desc: "Talent marketplace" },
  { name: "TrendyyLeads", color: "#FB923C", desc: "Lead generation" },
  { name: "AcademyOS", color: "#60A5FA", desc: "School management" },
  { name: "Developer Tools", color: "#22D3EE", desc: "Free · OSS" },
];

export default function SignupPage() {
  return (
    <div className="auth-page">
      <div className="auth-split">
        {/* Left — illustration panel (matches login layout) */}
        <div className="auth-panel">
          <div className="auth-brand">
            <svg className="logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="2" y="14" width="4" height="8" rx="1.3" fillOpacity=".4" />
              <rect x="8" y="9" width="4" height="13" rx="1.3" fill="#22D3EE" fillOpacity=".7" />
              <rect x="14" y="4" width="4" height="18" rx="1.3" fill="#22D3EE" />
              <rect x="20" y="12" width="4" height="10" rx="1.3" fillOpacity=".4" />
            </svg>
            <span>urbantrends<span className="tld">.dev</span></span>
          </div>

          {/* Collaboration ecosystem illustration */}
          <div className="auth-panel-art">
            <svg viewBox="0 0 340 300" aria-hidden>
              {/* Background grid */}
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={38 * i} x2="340" y2={38 * i} stroke="var(--grid-line)" strokeWidth="1" />
              ))}
              {/* Central hub */}
              <circle cx="170" cy="150" r="38" fill="rgba(34,211,238,.06)" stroke="#22D3EE" strokeOpacity=".25" strokeWidth="1.5" />
              <circle cx="170" cy="150" r="22" fill="rgba(34,211,238,.1)" stroke="#22D3EE" strokeOpacity=".4" strokeWidth="1" />
              <text x="170" y="146" textAnchor="middle" fill="#22D3EE" fontSize="8" fontFamily="monospace" opacity=".8">Genmars</text>
              <text x="170" y="158" textAnchor="middle" fill="#22D3EE" fontSize="8" fontFamily="monospace" opacity=".8">Tech</text>
              {/* Spokes */}
              {[
                { x: 60,  y: 60,  label: "Startups",   color: "#34D399" },
                { x: 280, y: 60,  label: "Agencies",    color: "#A78BFA" },
                { x: 30,  y: 170, label: "Developers",  color: "#22D3EE" },
                { x: 310, y: 170, label: "Businesses",  color: "#FB923C" },
                { x: 80,  y: 268, label: "Companies",   color: "#60A5FA" },
                { x: 260, y: 268, label: "NGOs",        color: "#34D399" },
              ].map((node) => (
                <g key={node.label}>
                  <line
                    x1="170" y1="150" x2={node.x} y2={node.y}
                    stroke={node.color} strokeWidth="1" strokeDasharray="5 3" opacity=".3"
                  />
                  <circle cx={node.x} cy={node.y} r="28" fill={node.color} fillOpacity=".06" stroke={node.color} strokeOpacity=".25" strokeWidth="1" />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" fill={node.color} fontSize="9" fontFamily="monospace" opacity=".85">{node.label}</text>
                </g>
              ))}
            </svg>
          </div>

          <div className="auth-panel-products">
            <p className="auth-panel-label">Products on the platform</p>
            {PRODUCTS.map((p) => (
              <div key={p.name} className="auth-product-row" style={{ "--pa": p.color } as React.CSSProperties}>
                <span className="auth-product-dot"></span>
                <span className="auth-product-name">{p.name}</span>
                <span className="auth-product-desc">{p.desc}</span>
              </div>
            ))}
          </div>

          <div className="auth-panel-copy">
            <p className="auth-panel-quote">&ldquo;We don&apos;t just build products — we build the infrastructure other products run on.&rdquo;</p>
            <p className="auth-panel-attr">Brian Otieno · Founder, Genmars Tech</p>
          </div>
        </div>

        {/* Right — registration form */}
        <div className="auth-form-side">
          <div className="auth-form-wrap">
            <Link className="auth-back" href="/">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              UrbanTrends
            </Link>
            <h1 className="auth-title">Create account</h1>
            <p className="auth-sub">Free to start. No card needed.</p>

            <form className="auth-form" action="#" method="post">
              <div className="field-row">
                <div className="field">
                  <label htmlFor="fname">First name</label>
                  <input id="fname" name="first_name" type="text" placeholder="Wanjiru" autoComplete="given-name" required />
                </div>
                <div className="field">
                  <label htmlFor="lname">Last name</label>
                  <input id="lname" name="last_name" type="text" placeholder="Kamau" autoComplete="family-name" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="su-org">Organisation</label>
                <input id="su-org" name="organisation" type="text" placeholder="Your company or project" autoComplete="organization" />
              </div>
              <div className="field">
                <label htmlFor="su-email">Work email</label>
                <input id="su-email" name="email" type="email" placeholder="you@company.ke" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="su-password">Password</label>
                <input id="su-password" name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" required />
              </div>
              <div className="field">
                <label htmlFor="interest">I&apos;m interested in</label>
                <select id="interest" name="interest">
                  <option value="">Select…</option>
                  <optgroup label="Products">
                    {PRODUCTS.map((p) => (
                      <option key={p.name} value={p.name.toLowerCase().replace(/\s/g, "-")}>{p.name} — {p.desc}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Services">
                    <option value="custom-software">Custom software development</option>
                    <option value="consulting">Technical consulting</option>
                    <option value="integrations">API &amp; integrations</option>
                  </optgroup>
                </select>
              </div>
              <button className="btn btn-primary auth-submit" type="submit">
                Create account
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              <p className="auth-legal">
                By creating an account you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.
              </p>
            </form>

            <p className="auth-switch">
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
