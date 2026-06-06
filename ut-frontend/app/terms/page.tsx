import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Genmars Tech / UrbanTrends.dev products and services.",
};

const EFFECTIVE = "21 May 2026";

export default function TermsPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Terms of Service</span>
          </div>
          <h1 className="page-title">Terms of Service</h1>
          <p className="page-lead">
            Effective {EFFECTIVE} · Genmars Tech (BN-93S95J2J) · Floor 5, Room 354, GTC Towers, Chiromo Road, Westlands, Nairobi, Kenya
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(20px,3vw,36px)" }}>
        <div className="wrap docs-content" style={{ maxWidth: 760 }}>

          <h2>1. Parties and agreement</h2>
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the websites, products, APIs, and services (&ldquo;Services&rdquo;) operated by <strong>Genmars Tech</strong> (registration number BN-93S95J2J, trading as <strong>UrbanTrends.dev</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
          </p>
          <p>
            By creating an account or accessing our Services, you (&ldquo;User&rdquo; or &ldquo;you&rdquo;) agree to be bound by these Terms. If you are accepting on behalf of an organisation, you represent that you have authority to bind that organisation.
          </p>
          <p>
            If you do not agree to these Terms, do not use our Services.
          </p>

          <h2>2. Services</h2>
          <p>Genmars Tech provides the following products and services under the UrbanTrends.dev brand:</p>
          <ul>
            <li><strong>RentFlow</strong> — property management software with M-Pesa payment reconciliation.</li>
            <li><strong>PortfolioU</strong> — a two-sided talent marketplace for students and employers.</li>
            <li><strong>TrendyyLeads</strong> — B2B lead generation and scoring.</li>
            <li><strong>AcademyOS</strong> — school management software.</li>
            <li><strong>Developer Tools</strong> — free tools including the Daraja Playground and Scaffold CLI.</li>
            <li><strong>Custom software and consulting services</strong> as agreed via separate service agreements.</li>
          </ul>
          <p>We reserve the right to modify, suspend, or discontinue any part of the Services with reasonable notice.</p>

          <h2>3. Account registration</h2>
          <p>
            To access certain Services, you must create an account. You agree to provide accurate and complete information and to keep your credentials confidential. You are responsible for all activity under your account. Notify us immediately at <strong>support@urbantrends.dev</strong> if you suspect unauthorised access.
          </p>
          <p>
            You must be at least 18 years old to create an account. If you are creating an account for a business, you must be an authorised representative of that business.
          </p>

          <h2>4. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Services for any unlawful purpose or in violation of any applicable Kenyan law.</li>
            <li>Attempt to gain unauthorised access to our systems or another user&apos;s account.</li>
            <li>Reverse-engineer, decompile, or disassemble any part of our software.</li>
            <li>Use our APIs beyond the rate limits and usage policies specified in our documentation.</li>
            <li>Resell or sublicence our Services without written permission.</li>
            <li>Transmit malicious code, spam, or fraudulent payment instructions.</li>
            <li>Use the Services to process payments for illegal goods or services.</li>
          </ul>

          <h2>5. Payment and billing</h2>
          <p>
            Paid plans are billed according to the pricing in effect at the time of subscription. Prices are listed in Kenya Shillings (KES) unless otherwise stated. Payment is due in advance for each billing period.
          </p>
          <p>
            RentFlow is priced per rental unit per month. Other products have their own pricing schedules published on the respective product pages. We reserve the right to change pricing with 30 days&apos; notice.
          </p>
          <p>
            Payments are processed via Safaricom M-Pesa (Daraja API) or other methods made available on the checkout. All payment data is handled in accordance with our <Link href="/privacy">Privacy Policy</Link>.
          </p>
          <p>
            Refunds are issued at our discretion. In the event of a billing error, contact us within 30 days of the charge.
          </p>

          <h2>6. Intellectual property</h2>
          <p>
            All intellectual property in the Services — including software, designs, trademarks, logos, and content — remains the property of Genmars Tech or its licensors. These Terms do not grant you any rights to our intellectual property except the limited licence to use the Services as described herein.
          </p>
          <p>
            You retain ownership of data and content you upload to the Services. By uploading content, you grant us a limited, non-exclusive licence to host and process it solely to provide the Services.
          </p>

          <h2>7. Open-source tools</h2>
          <p>
            Certain tools (including the Scaffold CLI and Daraja Playground) are released as open source. Those tools are governed by their respective open-source licences (published in their repositories), not solely by these Terms.
          </p>

          <h2>8. Third-party integrations</h2>
          <p>
            Our Services integrate with third-party APIs including Safaricom Daraja, KRA eTIMS, Equity Bank, and Co-operative Bank. Your use of those integrations is also subject to the third party&apos;s own terms and conditions. We are not responsible for the availability or conduct of third-party services.
          </p>

          <h2>9. Confidentiality</h2>
          <p>
            Each party agrees to keep the other&apos;s confidential information (including API keys, business data, and technical information) confidential and not to disclose it to third parties without consent, except as required by law.
          </p>

          <h2>10. Disclaimer of warranties</h2>
          <p>
            The Services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the maximum extent permitted by Kenyan law, we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Services will be error-free, uninterrupted, or that defects will be corrected.
          </p>

          <h2>11. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, Genmars Tech shall not be liable for indirect, incidental, consequential, or punitive damages arising from your use of the Services, including lost revenue, lost data, or business interruption. Our total aggregate liability for any claim shall not exceed the amounts you paid us in the 3 months preceding the claim.
          </p>
          <p>
            Nothing in these Terms limits liability for death, personal injury, or fraud caused by our negligence, or for anything that cannot be limited by law.
          </p>

          <h2>12. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Genmars Tech and its personnel from any claims, damages, or expenses (including legal fees) arising from your use of the Services, your violation of these Terms, or your violation of any third party&apos;s rights.
          </p>

          <h2>13. Termination</h2>
          <p>
            Either party may terminate the agreement at any time. We may suspend or terminate your account immediately if you breach these Terms or if required by law. Upon termination, your right to use the Services ceases. We will provide a reasonable opportunity to export your data before permanent deletion, unless termination is for cause.
          </p>

          <h2>14. Governing law and disputes</h2>
          <p>
            These Terms are governed by the laws of Kenya. Any disputes arising from these Terms shall first be subject to good-faith negotiation. If unresolved, disputes shall be submitted to the jurisdiction of the Kenyan courts.
          </p>

          <h2>15. Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be communicated by email or a prominent website notice at least 14 days before taking effect. Continued use after the effective date constitutes acceptance of the updated Terms.
          </p>

          <h2>16. Contact</h2>
          <p>
            For questions about these Terms:<br />
            <strong>Genmars Tech</strong><br />
            Floor 5, Room 354, GTC Towers, Chiromo Road<br />
            Westlands, Nairobi, Kenya · P.O Box 00100, 00800<br />
            Email: <strong>legal@urbantrends.dev</strong>
          </p>

        </div>
      </section>
    </>
  );
}
