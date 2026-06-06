import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Genmars Tech / UrbanTrends.dev — how we collect, use, and protect your data.",
};

const EFFECTIVE = "21 May 2026";

export default function PrivacyPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Privacy Policy</span>
          </div>
          <h1 className="page-title">Privacy Policy</h1>
          <p className="page-lead">
            Effective {EFFECTIVE} · Genmars Tech (BN-93S95J2J) · Floor 5, Room 354, GTC Towers, Chiromo Road, Westlands, Nairobi, Kenya
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(20px,3vw,36px)" }}>
        <div className="wrap docs-content" style={{ maxWidth: 760 }}>

          <h2>1. Who we are</h2>
          <p>
            Genmars Tech is a software studio registered in Kenya under the Registration of Business Names Act (Cap. 499, Section 14), registration number <strong>BN-93S95J2J</strong>, owned by Edwin Muchemi Wamuyu and operating under the trading name <strong>UrbanTrends.dev</strong>. Our registered address is Floor 5, Room 354, GTC Towers, Chiromo Road, Nairobi Westlands District, Westlands, P.O Box 00100, 00800 Westlands.
          </p>
          <p>
            We are the data controller for personal information collected through our website (<strong>urbantrends.dev</strong>) and our products: RentFlow, PortfolioU, TrendyyLeads, AcademyOS, and Developer Tools.
          </p>

          <h2>2. What data we collect</h2>
          <p>We collect the following categories of personal data:</p>
          <ul>
            <li><strong>Account data</strong> — name, email address, organisation name, and password (hashed) when you create an account.</li>
            <li><strong>Contact data</strong> — email address and any message content if you contact us via forms.</li>
            <li><strong>Payment data</strong> — M-Pesa phone numbers and transaction references processed through Safaricom Daraja. We do not store full card numbers; card payments (if any) are handled by PCI-DSS compliant processors.</li>
            <li><strong>Usage data</strong> — pages visited, features used, timestamps, and IP address collected via our analytics infrastructure.</li>
            <li><strong>Device data</strong> — browser type, operating system, and screen resolution collected automatically.</li>
            <li><strong>KYC data</strong> — where required by Kenyan law or a product&apos;s compliance requirements, national ID numbers or business registration numbers.</li>
          </ul>

          <h2>3. How we use your data</h2>
          <p>We use your personal data to:</p>
          <ul>
            <li>Provide, operate, and maintain our products and services.</li>
            <li>Process payments and reconcile transactions.</li>
            <li>Send you transactional emails (account creation, password reset, payment receipts).</li>
            <li>Respond to support enquiries.</li>
            <li>Improve our products through aggregated, anonymised analytics.</li>
            <li>Comply with applicable Kenyan law, including the Kenya Revenue Authority&apos;s eTIMS requirements where relevant.</li>
          </ul>
          <p>We do <strong>not</strong> sell your personal data to third parties. We do not use your data for automated decision-making that produces legal or similarly significant effects without human review.</p>

          <h2>4. Legal basis for processing</h2>
          <p>We process your data under the following legal bases (consistent with Kenya&apos;s Data Protection Act, 2019):</p>
          <ul>
            <li><strong>Contract performance</strong> — to deliver the services you signed up for.</li>
            <li><strong>Legitimate interests</strong> — for security monitoring, fraud prevention, and product improvement, where our interests do not override your rights.</li>
            <li><strong>Legal obligation</strong> — where Kenyan law requires us to retain or report data.</li>
            <li><strong>Consent</strong> — for optional marketing emails, which you can withdraw at any time.</li>
          </ul>

          <h2>5. Data sharing and third parties</h2>
          <p>We share data only with:</p>
          <ul>
            <li><strong>Safaricom (Daraja API)</strong> — to initiate and verify M-Pesa payments.</li>
            <li><strong>KRA eTIMS</strong> — to submit tax invoice data where legally required.</li>
            <li><strong>Infrastructure providers</strong> (cloud hosting, database, email delivery) — under data processing agreements that require them to protect your data.</li>
            <li><strong>Law enforcement</strong> — where required by a valid Kenyan court order or legal process.</li>
          </ul>

          <h2>6. Data retention</h2>
          <p>
            We retain account data for the life of your account plus 7 years after closure (to satisfy Kenyan tax retention requirements). Payment transaction records are retained for 7 years. Usage analytics are retained for 2 years. You may request earlier deletion subject to our legal retention obligations.
          </p>

          <h2>7. Your rights</h2>
          <p>Under Kenya&apos;s Data Protection Act, 2019, you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Correct inaccurate or incomplete data.</li>
            <li>Request deletion of your data (subject to legal retention obligations).</li>
            <li>Object to processing based on legitimate interests.</li>
            <li>Data portability — receive your data in a structured, machine-readable format.</li>
            <li>Withdraw consent for marketing at any time.</li>
          </ul>
          <p>
            To exercise these rights, email us at <strong>privacy@urbantrends.dev</strong>. We will respond within 30 days.
          </p>

          <h2>8. Cookies</h2>
          <p>
            We use strictly necessary cookies for session management and authentication. We use analytics cookies (first-party only) to understand how our site is used. We do not use third-party advertising cookies. You can disable cookies in your browser settings; this may affect site functionality.
          </p>

          <h2>9. Data security</h2>
          <p>
            We implement industry-standard technical and organisational measures to protect your data, including TLS encryption in transit, encryption at rest, access controls, and regular security reviews. See our <Link href="/security">Security Policy</Link> for more detail.
          </p>

          <h2>10. International transfers</h2>
          <p>
            Our infrastructure may be hosted outside Kenya. Where data is transferred internationally, we ensure adequate protection through contractual clauses or equivalent safeguards consistent with Kenya&apos;s Data Protection Act.
          </p>

          <h2>11. Children</h2>
          <p>
            Our products are not directed at children under 18. We do not knowingly collect personal data from minors. If you believe a minor has provided us data, contact us immediately.
          </p>

          <h2>12. Changes to this policy</h2>
          <p>
            We may update this policy. Material changes will be communicated by email or a prominent notice on our website at least 14 days before taking effect. Continued use of our services after the effective date constitutes acceptance.
          </p>

          <h2>13. Contact</h2>
          <p>
            For privacy-related queries, contact us at:<br />
            <strong>Genmars Tech</strong><br />
            Floor 5, Room 354, GTC Towers, Chiromo Road<br />
            Westlands, Nairobi, Kenya · P.O Box 00100, 00800<br />
            Email: <strong>privacy@urbantrends.dev</strong>
          </p>

          <div className="callout" style={{ marginTop: "clamp(32px,4vw,48px)" }}>
            <strong>Kenya Data Protection Act, 2019</strong> — This policy is designed to comply with Kenya&apos;s Data Protection Act, 2019 and the Data Protection (General) Regulations, 2021.
          </div>
        </div>
      </section>
    </>
  );
}
