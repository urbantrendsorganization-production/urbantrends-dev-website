import type { Metadata } from "next";
import Link from "next/link";
import { getTools } from "@/lib/cms";
import ToolsGrid from "./ToolsGrid";

export const metadata: Metadata = {
  title: "Tools",
  description: "Free utilities and developer tools from UrbanTrends — M-Pesa helpers, Daraja playground, and more.",
};

export default async function ToolsPage() {
  const tools = await getTools();

  return (
    <>
      <section className="page-head" data-screen-label="Tools">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Tools</span>
          </div>
          <h1 className="page-title">
            Tools we&apos;ve built. <span className="em">Yours to use.</span>
          </h1>
          <p className="page-lead">
            Utilities, playgrounds, and small SDKs we made because we needed them. Free, no account required for most.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(20px,3vw,36px)" }}>
        <div className="wrap">
          {tools.length === 0 ? (
            <div
              style={{
                border: "1px dashed var(--border)",
                borderRadius: 12,
                padding: "72px 24px",
                textAlign: "center",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--fg-subtle)"
                strokeWidth="1.5"
                width="36"
                height="36"
                style={{ marginBottom: 16 }}
              >
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
              </svg>
              <p style={{ fontSize: 15, color: "var(--fg-muted)", margin: "0 0 8px" }}>
                No tools published yet.
              </p>
              <p style={{ fontSize: 13, color: "var(--fg-subtle)", margin: 0 }}>
                Check back soon — we&apos;re building.
              </p>
            </div>
          ) : (
            <ToolsGrid tools={tools} />
          )}
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div>
            <h2>Need a custom tool?</h2>
            <p>We build internal tools, developer utilities, and integrations for businesses across East Africa.</p>
          </div>
          <div className="hero-cta" style={{ margin: 0 }}>
            <Link className="btn btn-primary" href="/services">
              Our services{" "}
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link className="btn btn-ghost" href="/contact">Talk to us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
