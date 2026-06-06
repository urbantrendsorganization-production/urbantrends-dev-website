import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your UrbanTrends account.",
};

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-split">
        {/* Left — illustration panel */}
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
          <div className="auth-panel-art">
            <svg viewBox="0 0 340 280" aria-hidden>
              {/* Background grid */}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={40 * i} x2="340" y2={40 * i} stroke="var(--grid-line)" strokeWidth="1" />
              ))}
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={`v${i}`} x1={40 * i} y1="0" x2={40 * i} y2="280" stroke="var(--grid-line)" strokeWidth="1" />
              ))}
              {/* Flow paths */}
              <path d="M 20 140 Q 80 80 160 120 Q 240 160 320 100" fill="none" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="6 3" opacity=".3" />
              <path d="M 20 180 Q 80 200 160 170 Q 240 140 320 160" fill="none" stroke="#34D399" strokeWidth="1.5" strokeDasharray="6 3" opacity=".3" />
              {/* Nodes */}
              <circle cx="20" cy="140" r="6" fill="#22D3EE" fillOpacity=".7" />
              <circle cx="160" cy="120" r="6" fill="#22D3EE" fillOpacity=".7" />
              <circle cx="320" cy="100" r="6" fill="#34D399" fillOpacity=".7" />
              <circle cx="160" cy="170" r="6" fill="#34D399" fillOpacity=".7" />
              {/* Core box */}
              <rect x="120" y="100" width="80" height="60" rx="8" fill="rgba(34,211,238,.06)" stroke="#22D3EE" strokeOpacity=".2" strokeWidth="1" />
              <text x="160" y="128" textAnchor="middle" fill="#22D3EE" fontSize="9" fontFamily="monospace" opacity=".6">reconciliation</text>
              <text x="160" y="142" textAnchor="middle" fill="#22D3EE" fontSize="9" fontFamily="monospace" opacity=".6">core</text>
              {/* Labels */}
              <text x="20" y="158" textAnchor="middle" fill="var(--fg-muted)" fontSize="8" fontFamily="monospace">M-Pesa</text>
              <text x="320" y="92" textAnchor="middle" fill="var(--fg-muted)" fontSize="8" fontFamily="monospace">RentFlow</text>
              <text x="320" y="174" textAnchor="middle" fill="var(--fg-muted)" fontSize="8" fontFamily="monospace">PortfolioU</text>
            </svg>
          </div>
          <div className="auth-panel-copy">
            <p className="auth-panel-quote">&ldquo;The Monday reconciliation ritual is gone. It just works.&rdquo;</p>
            <p className="auth-panel-attr">Joy Njeri · Product, RentFlow</p>
          </div>
        </div>

        {/* Right — form */}
        <div className="auth-form-side">
          <div className="auth-form-wrap">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub">Sign in to your UrbanTrends account</p>

            <form className="auth-form" action="#" method="post">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@company.ke" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="password">
                  Password
                  <Link className="field-link" href="/contact">Forgot password?</Link>
                </label>
                <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
              </div>
              <button className="btn btn-primary auth-submit" type="submit">
                Sign in
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>

            <div className="auth-divider"><span>or continue with</span></div>

            <button className="btn btn-ghost auth-mpesa" type="button">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="5" y="2" width="14" height="20" rx="3" />
                <path d="M9 7h6M9 11h6M9 15h4" />
              </svg>
              Continue with M-Pesa OTP
            </button>

            <p className="auth-switch">
              Don&apos;t have an account? <Link href="/signup">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
