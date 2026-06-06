import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security",
  description: "Security policy and responsible disclosure for Genmars Tech / UrbanTrends.dev.",
};

const EFFECTIVE = "21 May 2026";

export default function SecurityPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Security</span>
          </div>
          <h1 className="page-title">Security Policy</h1>
          <p className="page-lead">
            Effective {EFFECTIVE} · Genmars Tech (BN-93S95J2J) · Floor 5, Room 354, GTC Towers, Chiromo Road, Westlands, Nairobi, Kenya
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(20px,3vw,36px)" }}>
        <div className="wrap docs-content" style={{ maxWidth: 760 }}>

          <div className="callout">
            <strong>Responsible disclosure:</strong> If you have found a security vulnerability in any Genmars Tech / UrbanTrends.dev product or infrastructure, please email <strong>security@urbantrends.dev</strong> before public disclosure. We aim to respond within 48 hours.
          </div>

          <h2>1. Our commitment</h2>
          <p>
            Security is a core constraint at Genmars Tech, not an afterthought. We build software that handles real financial transactions — M-Pesa payments, property rent reconciliation, business leads — and we take the responsibility seriously. This policy describes how we protect your data and how you can report concerns.
          </p>

          <h2>2. Technical safeguards</h2>

          <h3>Encryption</h3>
          <ul>
            <li>All data in transit is encrypted using TLS 1.2 or higher.</li>
            <li>Data at rest is encrypted using AES-256 or equivalent on all storage systems.</li>
            <li>M-Pesa credentials, API keys, and secrets are stored in an encrypted secrets manager — never in source code or environment files.</li>
            <li>Passwords are hashed using bcrypt with a minimum cost factor of 12.</li>
          </ul>

          <h3>Infrastructure</h3>
          <ul>
            <li>Production systems run in isolated environments with minimal attack surface.</li>
            <li>Network access to databases and internal services is restricted to authorised application layers only.</li>
            <li>All infrastructure changes go through code review before deployment.</li>
            <li>Automated security scanning is run on dependencies and container images.</li>
          </ul>

          <h3>Access controls</h3>
          <ul>
            <li>Production access is restricted to authorised personnel using multi-factor authentication.</li>
            <li>Principle of least privilege: each service and team member has only the permissions required for their role.</li>
            <li>Access logs are retained and reviewed for anomalies.</li>
          </ul>

          <h3>Payment security</h3>
          <ul>
            <li>We do not store raw M-Pesa PIN or card numbers. Payment flows use tokenisation via Safaricom Daraja APIs.</li>
            <li>STK Push callbacks are validated against Safaricom&apos;s credentials before reconciliation.</li>
            <li>Idempotency keys are enforced on all payment writes to prevent duplicate processing.</li>
          </ul>

          <h2>3. Application security practices</h2>
          <ul>
            <li>All code changes require peer review before merging to production.</li>
            <li>Input validation and output encoding are enforced at all system boundaries.</li>
            <li>SQL queries use parameterised statements to prevent injection.</li>
            <li>API rate limiting and authentication are enforced on all endpoints.</li>
            <li>Webhook endpoints verify signatures before processing any payload.</li>
            <li>Security-relevant dependencies are monitored and updated promptly.</li>
          </ul>

          <h2>4. Incident response</h2>
          <p>
            In the event of a security incident that affects your data, we will:
          </p>
          <ul>
            <li>Contain the incident and preserve forensic evidence.</li>
            <li>Notify affected users within 72 hours of confirming a breach (consistent with Kenya&apos;s Data Protection Act, 2019 obligations).</li>
            <li>Notify the Office of the Data Protection Commissioner (ODPC) as required by law.</li>
            <li>Publish a post-incident summary to affected customers within 30 days.</li>
          </ul>

          <h2>5. Responsible disclosure</h2>
          <p>We ask security researchers to:</p>
          <ul>
            <li>Report vulnerabilities to <strong>security@urbantrends.dev</strong> before any public disclosure.</li>
            <li>Include a clear description, reproduction steps, and — where possible — a proof of concept.</li>
            <li>Allow us reasonable time (minimum 90 days) to investigate and remediate before publishing.</li>
            <li>Avoid accessing, modifying, or deleting data beyond what is necessary to demonstrate the vulnerability.</li>
            <li>Not perform denial-of-service attacks or social engineering against our team or users.</li>
          </ul>
          <p>
            We will acknowledge valid reports, keep you informed of our progress, and credit researchers in our security acknowledgements (if you wish to be named). We do not operate a paid bug bounty programme at this stage, but we genuinely appreciate responsible disclosure.
          </p>

          <h2>6. Scope</h2>
          <p>In scope for responsible disclosure:</p>
          <ul>
            <li>urbantrends.dev and all subdomains</li>
            <li>RentFlow, PortfolioU, TrendyyLeads, AcademyOS web applications and APIs</li>
            <li>Developer Tools (Daraja Playground, Scaffold CLI)</li>
          </ul>
          <p>Out of scope:</p>
          <ul>
            <li>Third-party services we integrate with (Safaricom, KRA, banks) — report these to the respective organisations.</li>
            <li>Social engineering attacks against Genmars Tech staff.</li>
            <li>Physical security of our offices.</li>
            <li>Denial-of-service attacks.</li>
          </ul>

          <h2>7. Data protection alignment</h2>
          <p>
            Our security practices are designed to satisfy the technical security requirements of Kenya&apos;s Data Protection Act, 2019 and the Data Protection (General) Regulations, 2021. For our full data handling practices, see our <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <h2>8. Contact</h2>
          <p>
            To report a vulnerability or ask a security question:<br />
            <strong>Email:</strong> security@urbantrends.dev<br />
            <strong>Response time:</strong> We aim to acknowledge reports within 48 hours.<br /><br />
            <strong>Genmars Tech</strong><br />
            Floor 5, Room 354, GTC Towers, Chiromo Road<br />
            Westlands, Nairobi, Kenya · P.O Box 00100, 00800
          </p>

        </div>
      </section>
    </>
  );
}
