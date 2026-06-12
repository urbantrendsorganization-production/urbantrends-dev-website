"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type Status = "idle" | "sending" | "done" | "error";

// Map from the form's granular <select> values to ContactInquiry.SUBJECT_CHOICES keys
const SUBJECT_MAP: Record<string, string> = {
  rentflow:        "project",
  portfoliou:      "project",
  trendyyleads:    "project",
  academyos:       "project",
  devtools:        "project",
  "custom-software": "project",
  integration:     "project",
  consulting:      "project",
  design:          "project",
  partnership:     "partnership",
  press:           "general",
  other:           "other",
};

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const firstName = (fd.get("first_name") as string).trim();
    const lastName  = (fd.get("last_name")  as string).trim();
    const rawSubject = fd.get("subject") as string;

    const body = {
      name:    `${firstName} ${lastName}`.trim(),
      email:   fd.get("email"),
      subject: SUBJECT_MAP[rawSubject] ?? "general",
      message: fd.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detail = Object.values(data).flat().join(" ") || "Something went wrong — please try again.";
        setErrorMsg(detail);
        setStatus("error");
        return;
      }

      setStatus("done");
      formRef.current?.reset();
    } catch {
      setErrorMsg("Could not reach the server — check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <div className="auth-form-wrap">
      <Link className="auth-back" href="/">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        UrbanTrends
      </Link>

      <h1 className="auth-title">Get in touch</h1>
      <p className="auth-sub">Tell us what you&apos;re working on. The more context, the better.</p>

      {status === "done" ? (
        <div className="auth-form" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            background: "color-mix(in srgb, #34D399 12%, transparent)",
            border: "1px solid color-mix(in srgb, #34D399 30%, transparent)",
            borderRadius: 10,
            padding: "20px 24px",
          }}>
            <p style={{ margin: 0, fontWeight: 600, color: "#34D399" }}>Message sent.</p>
            <p style={{ margin: "6px 0 0", color: "var(--fg-muted)", fontSize: 14 }}>
              We&apos;ll be in touch shortly — usually within one business day.
            </p>
          </div>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => setStatus("idle")}
            style={{ alignSelf: "flex-start" }}
          >
            Send another message
          </button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} ref={formRef}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="c-fname">First name</label>
              <input id="c-fname" name="first_name" type="text" placeholder="Wanjiru" autoComplete="given-name" required />
            </div>
            <div className="field">
              <label htmlFor="c-lname">Last name</label>
              <input id="c-lname" name="last_name" type="text" placeholder="Kamau" autoComplete="family-name" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="c-email">Work email</label>
            <input id="c-email" name="email" type="email" placeholder="you@company.ke" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="c-org">Company / Organisation</label>
            <input id="c-org" name="organisation" type="text" placeholder="Your company or project" autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor="c-subject">What&apos;s this about?</label>
            <select id="c-subject" name="subject" required>
              <option value="">Select a topic…</option>
              <optgroup label="Products">
                <option value="rentflow">RentFlow — property management</option>
                <option value="portfoliou">PortfolioU — talent marketplace</option>
                <option value="trendyyleads">TrendyyLeads — lead generation</option>
                <option value="academyos">AcademyOS — school management</option>
                <option value="devtools">Developer Tools &amp; APIs</option>
              </optgroup>
              <optgroup label="Services">
                <option value="custom-software">Custom software development</option>
                <option value="integration">API &amp; M-Pesa integration</option>
                <option value="consulting">Technical consulting</option>
                <option value="design">Product design</option>
              </optgroup>
              <optgroup label="Other">
                <option value="partnership">Partnership / collaboration</option>
                <option value="press">Press &amp; media</option>
                <option value="other">Something else</option>
              </optgroup>
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-message">Message</label>
            <textarea
              id="c-message"
              name="message"
              rows={5}
              placeholder="Tell us what you're building, what's blocking you, or what you'd like to explore with us."
              required
              style={{ resize: "vertical", minHeight: 120 }}
            />
          </div>

          {status === "error" && (
            <p style={{
              margin: 0,
              padding: "10px 14px",
              borderRadius: 8,
              background: "color-mix(in srgb, #EF4444 12%, transparent)",
              border: "1px solid color-mix(in srgb, #EF4444 30%, transparent)",
              color: "#EF4444",
              fontSize: 14,
            }}>
              {errorMsg}
            </p>
          )}

          <button
            className="btn btn-primary auth-submit"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send message"}
            {status !== "sending" && (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </button>
          <p className="auth-legal">
            We&apos;ll only use your details to respond to your enquiry. See our <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </form>
      )}
    </div>
  );
}
