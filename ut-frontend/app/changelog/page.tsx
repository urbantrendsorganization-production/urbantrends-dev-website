import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Every meaningful change across the UrbanTrends platform and products.",
};

const ENTRIES = [
  {
    date: "Jun 2, 2026",
    version: "platform v4.2",
    title: "Real-time reconciliation for all products",
    body: "The reconciliation core now processes Daraja callbacks the moment they land, retiring the last nightly batch job across the platform. Weekends are officially boring.",
    items: [
      { tag: "new", label: "Sub-second matching on Paybill settlements" },
      { tag: "imp", label: "Idempotency keys on every webhook handler" },
      { tag: "fix", label: "Duplicate receipts on retried callbacks" },
    ],
  },
  {
    date: "May 24, 2026",
    version: "rentflow v3.1",
    title: "Owner payouts & net statements",
    body: "RentFlow can now net out management fees and disburse to landlords via M-Pesa B2C, with a statement an owner can actually read.",
    items: [
      { tag: "new", label: "Automated B2C owner payouts" },
      { tag: "new", label: "Downloadable owner statements (PDF)" },
      { tag: "imp", label: "Part-payment handling on tenant ledgers" },
    ],
  },
  {
    date: "May 12, 2026",
    version: "tools v1.8",
    title: "Daraja Playground: webhook replay",
    body: "You can now capture a callback and replay it against your local endpoint as many times as you like — including malformed payloads, on purpose.",
    items: [
      { tag: "new", label: "One-click webhook replay" },
      { tag: "new", label: "Shareable sandbox sessions" },
      { tag: "fix", label: "Timeout when sandbox was cold" },
    ],
  },
  {
    date: "Apr 29, 2026",
    version: "academyos v0.9",
    title: "AcademyOS enters open beta",
    body: "School fees, admissions and timetables in one system — now open to a wider set of schools, with M-Pesa fee collection built in.",
    items: [
      { tag: "new", label: "Fee collection via Paybill & STK Push" },
      { tag: "new", label: "Admissions pipeline" },
      { tag: "imp", label: "Bulk student import" },
    ],
  },
  {
    date: "Apr 16, 2026",
    version: "platform v4.1",
    title: "SSO, audit logs & the command palette",
    body: "Enterprise accounts get SAML SSO and full audit logging. Everyone gets a faster way around: ⌘K from anywhere.",
    items: [
      { tag: "new", label: "SAML SSO & audit logs (Enterprise)" },
      { tag: "new", label: "⌘K command palette across the app" },
      { tag: "fix", label: "Session expiry edge case on slow networks" },
    ],
  },
];

const TAG_LABELS: Record<string, string> = { new: "New", imp: "Improved", fix: "Fixed" };

export default function ChangelogPage() {
  return (
    <>
      <section className="page-head" data-screen-label="Changelog">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Changelog</span>
          </div>
          <h1 className="page-title">What we <span className="em">shipped.</span></h1>
          <p className="page-lead">Every meaningful change across the platform and products. Updated continuously, written by the people who built it.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(12px,2vw,24px)" }}>
        <div className="wrap">
          <div className="changelog">
            {ENTRIES.map((e) => (
              <article key={e.date} className="cl-entry">
                <div className="cl-meta">
                  <div className="cl-date">{e.date}</div>
                  <span className="cl-ver">{e.version}</span>
                </div>
                <div className="cl-body">
                  <h3>{e.title}</h3>
                  <p>{e.body}</p>
                  <ul className="cl-list">
                    {e.items.map((item) => (
                      <li key={item.label}>
                        <span className={`tag ${item.tag}`}>{TAG_LABELS[item.tag]}</span>
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
