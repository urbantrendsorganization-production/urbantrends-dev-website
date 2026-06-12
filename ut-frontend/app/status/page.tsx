import type { Metadata } from "next";
import Link from "next/link";
import { getSiteStatus, type ServiceStatusResult } from "@/lib/cms";

export const metadata: Metadata = {
  title: "System Status",
  description: "Real-time status of all UrbanTrends services and APIs.",
};

const STATUS_CONFIG = {
  operational: { label: "Operational",  color: "#34D399", bg: "rgba(52,211,153,.12)" },
  degraded:    { label: "Degraded",     color: "#F59E0B", bg: "rgba(245,158,11,.12)" },
  down:        { label: "Down",         color: "#EF4444", bg: "rgba(239,68,68,.12)"  },
} as const;

export default async function StatusPage() {
  const services = await getSiteStatus();

  const overallStatus: ServiceStatusResult["status"] = services.length === 0
    ? "operational"
    : services.some((s) => s.status === "down")
      ? "down"
      : services.some((s) => s.status === "degraded")
        ? "degraded"
        : "operational";

  const overall = STATUS_CONFIG[overallStatus];

  const BANNER_COPY = {
    operational: "All systems operational",
    degraded:    "Degraded performance detected",
    down:        "Service disruption in progress",
  };

  return (
    <>
      <section className="page-head" data-screen-label="Status">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Status</span>
          </div>
          <h1 className="page-title">System <span className="em">Status</span></h1>
          <p className="page-lead">Live health of all UrbanTrends services and APIs. Checked on every page load.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(16px,2vw,28px)" }}>
        <div className="wrap">

          {/* Overall banner */}
          <div
            style={{
              borderRadius: 12,
              border: `1px solid ${overall.color}40`,
              background: overall.bg,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 32,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: overall.color,
                flexShrink: 0,
                boxShadow: `0 0 8px ${overall.color}80`,
                animation: overallStatus === "operational" ? "pulse-dot 2s ease-in-out infinite" : undefined,
              }}
            />
            <span style={{ fontSize: 16, fontWeight: 600, color: overall.color }}>
              {BANNER_COPY[overallStatus]}
            </span>
          </div>

          {/* Service list */}
          {services.length === 0 ? (
            <div
              style={{
                border: "1px dashed var(--border)",
                borderRadius: 12,
                padding: "48px 24px",
                textAlign: "center",
                color: "var(--fg-muted)",
              }}
            >
              <p style={{ fontSize: 14 }}>
                No services configured yet.{" "}
                <Link href="/admin/cms/servicestatus/add/" style={{ color: "var(--accent-text)" }}>
                  Add services in the admin
                </Link>{" "}
                to start monitoring.
              </p>
            </div>
          ) : (
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {services.map((svc: ServiceStatusResult, i: number) => {
                const cfg = STATUS_CONFIG[svc.status] ?? STATUS_CONFIG.down;
                return (
                  <div
                    key={svc.name}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 20px",
                      borderTop: i === 0 ? "none" : "1px solid var(--border)",
                      background: "var(--surface-1)",
                    }}
                  >
                    {/* Name + URL */}
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)", margin: 0 }}>
                        {svc.name}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--fg-subtle)",
                          fontFamily: "var(--font-mono)",
                          margin: "3px 0 0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "40ch",
                        }}
                      >
                        {svc.url}
                      </p>
                    </div>

                    {/* Response time */}
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: "var(--font-mono)",
                        color: "var(--fg-subtle)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {svc.response_ms != null ? `${svc.response_ms}ms` : "—"}
                    </span>

                    {/* Status badge */}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: cfg.color,
                        background: cfg.bg,
                        border: `1px solid ${cfg.color}40`,
                        borderRadius: 6,
                        padding: "4px 10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: cfg.color,
                          flexShrink: 0,
                        }}
                      />
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <p
            style={{
              marginTop: 20,
              fontSize: 12,
              color: "var(--fg-subtle)",
              fontFamily: "var(--font-mono)",
              textAlign: "center",
            }}
          >
            Checked live on each page load · {new Date().toLocaleString("en-KE", {
              timeZone: "Africa/Nairobi",
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })} EAT
          </p>
        </div>
      </section>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .6; transform: scale(1.3); }
        }
      `}</style>
    </>
  );
}
