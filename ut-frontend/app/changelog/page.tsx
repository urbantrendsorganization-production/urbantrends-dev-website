import type { Metadata } from "next";
import Link from "next/link";
import { getChangelog, type ChangelogEntry, type ChangelogTag } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Every meaningful change across the UrbanTrends platform and products.",
};

const TAG_LABELS: Record<string, string> = { new: "New", imp: "Improved", fix: "Fixed" };

const FALLBACK_ENTRIES: ChangelogEntry[] = [
  {
    date: "2026-06-02",
    product: "platform",
    version: "v4.2",
    title: "Real-time reconciliation for all products",
    body: "The reconciliation core now processes Daraja callbacks the moment they land, retiring the last nightly batch job across the platform. Weekends are officially boring.",
    tags: [
      { type: "new", text: "Sub-second matching on Paybill settlements" },
      { type: "imp", text: "Idempotency keys on every webhook handler" },
      { type: "fix", text: "Duplicate receipts on retried callbacks" },
    ],
  },
  {
    date: "2026-05-24",
    product: "rentflow",
    version: "v3.1",
    title: "Owner payouts & net statements",
    body: "RentFlow can now net out management fees and disburse to landlords via M-Pesa B2C, with a statement an owner can actually read.",
    tags: [
      { type: "new", text: "Automated B2C owner payouts" },
      { type: "new", text: "Downloadable owner statements (PDF)" },
      { type: "imp", text: "Part-payment handling on tenant ledgers" },
    ],
  },
  {
    date: "2026-05-12",
    product: "tools",
    version: "v1.8",
    title: "Daraja Playground: webhook replay",
    body: "You can now capture a callback and replay it against your local endpoint as many times as you like — including malformed payloads, on purpose.",
    tags: [
      { type: "new", text: "One-click webhook replay" },
      { type: "new", text: "Shareable sandbox sessions" },
      { type: "fix", text: "Timeout when sandbox was cold" },
    ],
  },
  {
    date: "2026-04-29",
    product: "academyos",
    version: "v0.9",
    title: "AcademyOS enters open beta",
    body: "School fees, admissions and timetables in one system — now open to a wider set of schools, with M-Pesa fee collection built in.",
    tags: [
      { type: "new", text: "Fee collection via Paybill & STK Push" },
      { type: "new", text: "Admissions pipeline" },
      { type: "imp", text: "Bulk student import" },
    ],
  },
  {
    date: "2026-04-16",
    product: "platform",
    version: "v4.1",
    title: "SSO, audit logs & the command palette",
    body: "Enterprise accounts get SAML SSO and full audit logging. Everyone gets a faster way around: ⌘K from anywhere.",
    tags: [
      { type: "new", text: "SAML SSO & audit logs (Enterprise)" },
      { type: "new", text: "⌘K command palette across the app" },
      { type: "fix", text: "Session expiry edge case on slow networks" },
    ],
  },
];

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default async function ChangelogPage() {
  const data = await getChangelog();
  const entries = data.results.length > 0 ? data.results : FALLBACK_ENTRIES;

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
          {entries.length === 0 ? (
            <div
              style={{
                border: "1px dashed var(--border)",
                borderRadius: 12,
                padding: "60px 24px",
                textAlign: "center",
                color: "var(--fg-muted)",
              }}
            >
              <p style={{ fontSize: 15 }}>No changelog entries yet — check back soon.</p>
            </div>
          ) : (
            <div className="changelog">
              {entries.map((e: ChangelogEntry) => (
                <article key={`${e.date}-${e.version}`} className="cl-entry">
                  <div className="cl-meta">
                    <div className="cl-date">{formatDate(e.date)}</div>
                    <span className="cl-ver">{e.product} {e.version}</span>
                  </div>
                  <div className="cl-body">
                    <h3>{e.title}</h3>
                    <p>{e.body}</p>
                    {e.tags.length > 0 && (
                      <ul className="cl-list">
                        {e.tags.map((tag: ChangelogTag, i: number) => (
                          <li key={i}>
                            <span className={`tag ${tag.type}`}>{TAG_LABELS[tag.type] ?? tag.type}</span>
                            {tag.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
