import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/cms";
import WorkGrid from "./WorkGrid";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Recent projects from UrbanTrends — products, web apps, integrations, and developer tooling we've shipped for teams across East Africa.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <>
      <section className="page-head" data-screen-label="Work">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Work</span>
          </div>
          <h1 className="page-title">
            Recent work. <span className="em">Shipped and standing.</span>
          </h1>
          <p className="page-lead">
            A selection of products, platforms, and integrations we&apos;ve built and put into production.
            Real systems, real teams, still running.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(20px,3vw,36px)" }}>
        <div className="wrap">
          {projects.length === 0 ? (
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
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 15l5-5 4 4 3-3 6 6" />
                <circle cx="8.5" cy="8.5" r="1.5" />
              </svg>
              <p style={{ fontSize: 15, color: "var(--fg-muted)", margin: "0 0 8px" }}>
                No projects published yet.
              </p>
              <p style={{ fontSize: 13, color: "var(--fg-subtle)", margin: 0 }}>
                Check back soon — we&apos;re shipping.
              </p>
            </div>
          ) : (
            <WorkGrid projects={projects} />
          )}
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div>
            <h2>Want to be next?</h2>
            <p>Tell us what you&apos;re building. We&apos;ll scope it, price it fairly, and ship it properly.</p>
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
