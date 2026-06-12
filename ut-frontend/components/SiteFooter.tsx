import Link from "next/link";

const LOGO = (
  <svg
    className="logo"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect className="logo-bar" x="2" y="14" width="4" height="8" rx="1.3" fillOpacity=".4" />
    <rect className="logo-bar" x="8" y="9" width="4" height="13" rx="1.3" fill="#22D3EE" fillOpacity=".7" />
    <rect className="logo-bar" x="14" y="4" width="4" height="18" rx="1.3" fill="#22D3EE" />
    <rect className="logo-bar" x="20" y="12" width="4" height="10" rx="1.3" fillOpacity=".4" />
  </svg>
);

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="fbrand">
            <Link className="brand" href="/" aria-label="UrbanTrends home">
              {LOGO}
              <span className="word">
                urbantrends<span className="tld">.dev</span>
              </span>
            </Link>
            <p>Software products, tools &amp; applications. Built in Nairobi.</p>
          </div>

          <div className="fcol">
            <h5>Tools</h5>
            <Link href="/tools">Browse all tools</Link>
            <Link href="/tools">Inspector</Link>
            <Link href="/tools">Scaffold</Link>
            <Link href="/tools">OG Studio</Link>
          </div>

          <div className="fcol">
            <h5>Developers</h5>
            <Link href="/tools">All tools</Link>
            <Link href="/tools">CLI generator</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/status">Status</Link>
          </div>

          <div className="fcol">
            <h5>Services</h5>
            <Link href="/services">Product Development</Link>
            <Link href="/services">Custom Software</Link>
            <Link href="/services">API &amp; Integrations</Link>
            <Link href="/services">Consulting</Link>
          </div>

          <div className="fcol">
            <h5>Company</h5>
            <Link href="/about">About UrbanTrends</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/changelog">Changelog</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="fcol">
            <h5>Legal</h5>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/security">Security</Link>
          </div>
        </div>

        <div className="footer-bot">
          <span>© 2026 UrbanTrends.dev · Nairobi, KE · <a href="mailto:info@urbantrends.dev" style={{ color: "inherit" }}>info@urbantrends.dev</a></span>
          <span className="status">
            <i />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
