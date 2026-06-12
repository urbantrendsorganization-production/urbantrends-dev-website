"use client";
import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

const BUDGET = [
  ["not_sure",   "Not sure yet"],
  ["under_50k",  "Under KES 50,000"],
  ["50k_200k",   "KES 50,000 – 200,000"],
  ["200k_500k",  "KES 200,000 – 500,000"],
  ["500k_1m",    "KES 500,000 – 1,000,000"],
  ["over_1m",    "Over KES 1,000,000"],
];

const TIMELINE = [
  ["flexible",   "Flexible / Not sure"],
  ["asap",       "ASAP (within 2 weeks)"],
  ["1_month",    "Within 1 month"],
  ["1_3_months", "1 – 3 months"],
  ["3_6_months", "3 – 6 months"],
  ["6_plus",     "6+ months"],
];

export default function QuoteDialog({
  serviceName,
  onClose,
}: {
  serviceName: string;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    firstInputRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/services/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_name:  serviceName,
          name:          fd.get("name"),
          email:         fd.get("email"),
          company:       fd.get("company") || "",
          phone:         fd.get("phone") || "",
          budget_range:  fd.get("budget_range") || "not_sure",
          timeline:      fd.get("timeline") || "flexible",
          brief:         fd.get("brief"),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="qdialog-overlay" role="dialog" aria-modal="true" aria-label={`Request a quote — ${serviceName}`}>
      <div className="qdialog-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="qdialog">
        {status === "done" ? (
          <div className="qdialog-success">
            <div className="qdialog-success-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 6" />
              </svg>
            </div>
            <h3>Quote request sent.</h3>
            <p>
              We&apos;ll review your brief and reply within 1–2 business days.
              Keep an eye on <strong>{typeof window !== "undefined" ? (document.querySelector<HTMLInputElement>("#qd-email")?.value || "your inbox") : "your inbox"}</strong>.
            </p>
            <button className="qdialog-submit" style={{ maxWidth: 200, margin: "24px auto 0" }} onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="qdialog-head">
              <div>
                <div className="qdialog-service-tag">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 12l2 2 4-4M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z" />
                  </svg>
                  {serviceName}
                </div>
                <h2 className="qdialog-title">Request a quote</h2>
                <p className="qdialog-subtitle">
                  Tell us what you need and we&apos;ll come back with a clear scope and price — no commitment required.
                </p>
              </div>
              <button className="qdialog-close" onClick={onClose} aria-label="Close">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {status === "error" && (
              <div style={{
                background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)",
                borderRadius: 8, padding: "10px 14px", fontSize: 13,
                color: "var(--fg)", marginBottom: 16, lineHeight: 1.5,
              }}>
                Something went wrong. Try again or email us at{" "}
                <a href="mailto:hello@urbantrends.dev" style={{ color: "#ef4444" }}>hello@urbantrends.dev</a>
              </div>
            )}

            <form className="qdialog-form" onSubmit={handleSubmit} noValidate>
              <div className="qdialog-row-2">
                <div className="qdialog-field">
                  <label className="qdialog-label" htmlFor="qd-name">
                    Name <span className="req">*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    className="qdialog-input"
                    id="qd-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Jane Mwangi"
                  />
                </div>
                <div className="qdialog-field">
                  <label className="qdialog-label" htmlFor="qd-email">
                    Email <span className="req">*</span>
                  </label>
                  <input
                    className="qdialog-input"
                    id="qd-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="jane@company.co.ke"
                  />
                </div>
              </div>

              <div className="qdialog-row-2">
                <div className="qdialog-field">
                  <label className="qdialog-label" htmlFor="qd-company">Company</label>
                  <input className="qdialog-input" id="qd-company" name="company" type="text" placeholder="Optional" />
                </div>
                <div className="qdialog-field">
                  <label className="qdialog-label" htmlFor="qd-phone">Phone</label>
                  <input className="qdialog-input" id="qd-phone" name="phone" type="tel" placeholder="Optional" />
                </div>
              </div>

              <div className="qdialog-row-2">
                <div className="qdialog-field">
                  <label className="qdialog-label" htmlFor="qd-budget">Budget range</label>
                  <select className="qdialog-select" id="qd-budget" name="budget_range">
                    {BUDGET.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div className="qdialog-field">
                  <label className="qdialog-label" htmlFor="qd-timeline">Timeline</label>
                  <select className="qdialog-select" id="qd-timeline" name="timeline">
                    {TIMELINE.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="qdialog-field">
                <label className="qdialog-label" htmlFor="qd-brief">
                  What do you need? <span className="req">*</span>
                </label>
                <textarea
                  className="qdialog-textarea"
                  id="qd-brief"
                  name="brief"
                  required
                  placeholder="Describe what you're trying to build or solve. The more specific, the more accurate our quote will be."
                />
              </div>

              <div className="qdialog-actions">
                <button type="button" className="qdialog-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="qdialog-submit" disabled={status === "sending"}>
                  {status === "sending" ? (
                    <>
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5"
                        style={{ animation: "spin .8s linear infinite" }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Send quote request
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
