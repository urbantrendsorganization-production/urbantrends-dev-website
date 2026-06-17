"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { triggerDeploy, type VercelProject, type Deployment } from "@/lib/deployments";

const STATUS_COLORS: Record<string, [string, string]> = {
  queued: ["#f0f0ee", "#555555"],
  building: ["#fef3c7", "#92400e"],
  ready: ["#d1fae5", "#065f46"],
  error: ["#fee2e2", "#991b1b"],
  cancelled: ["#f3f4f6", "#6b7280"],
};

function StatusBadge({ status }: { status: Deployment["status"] }) {
  const [bg, fg] = STATUS_COLORS[status] ?? ["#f0f0ee", "#555"];
  return (
    <span style={{ background: bg, color: fg, padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>
      {status}
    </span>
  );
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function DeploymentsPage() {
  const [projects, setProjects] = useState<VercelProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [deploying, setDeploying] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    return fetch("/api/deployments/projects", { credentials: "same-origin", cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          setDenied(true);
        } else if (res.ok) {
          setProjects(await res.json());
        }
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDeploy(id: number) {
    setDeploying(id);
    setError(null);
    const result = await triggerDeploy(id);
    if (!result.ok) {
      setError(result.error ?? "Deploy failed.");
    } else {
      await load();
    }
    setDeploying(null);
  }

  if (loading) {
    return <p style={{ color: "var(--fg-muted)", fontSize: 14 }}>Loading projects…</p>;
  }

  if (denied) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <p style={{ color: "var(--fg-muted)", marginBottom: 12 }}>Staff access required.</p>
        <Link className="btn btn-ghost" href="/portal/orders">Back to orders</Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>
          Deployments
        </h1>
        <p style={{ color: "var(--fg-muted)", fontSize: 13, marginTop: 4 }}>
          {projects.length} Vercel project{projects.length === 1 ? "" : "s"}
        </p>
      </div>

      {error && (
        <p style={{ color: "#f87171", fontSize: 13, marginBottom: 16 }}>{error}</p>
      )}

      {projects.length === 0 ? (
        <p style={{ color: "var(--fg-muted)", fontSize: 13 }}>No Vercel projects configured.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {projects.map((p) => {
            const latest = p.recent_deployments[0];
            const isOpen = expanded === p.id;
            return (
              <div
                key={p.id}
                style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}
              >
                <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      {p.production_url ? (
                        <a href={p.production_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600, fontSize: 16 }}>
                          {p.name}
                        </a>
                      ) : (
                        <span style={{ fontWeight: 600, fontSize: 16, color: "var(--fg)" }}>{p.name}</span>
                      )}
                      {p.custom_domain && (
                        <span style={{ fontSize: 11, color: "var(--fg-muted)", background: "var(--surface-3)", borderRadius: 6, padding: "2px 8px" }}>
                          {p.custom_domain}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      {p.repo_full_name && (
                        <span style={{ fontSize: 12, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>{p.repo_full_name}</span>
                      )}
                      {latest ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <StatusBadge status={latest.status} />
                          <span style={{ fontSize: 12, color: "var(--fg-subtle)" }}>{fmtDate(latest.created_at)}</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: "var(--fg-subtle)" }}>No deployments yet</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {p.recent_deployments.length > 0 && (
                      <button
                        className="btn btn-ghost"
                        onClick={() => setExpanded(isOpen ? null : p.id)}
                      >
                        {isOpen ? "Hide" : "History"}
                      </button>
                    )}
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDeploy(p.id)}
                      disabled={deploying === p.id}
                      style={{ opacity: deploying === p.id ? 0.6 : 1 }}
                    >
                      {deploying === p.id ? "Deploying…" : "Deploy"}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ borderTop: "1px solid var(--border)" }}>
                    {p.recent_deployments.map((d) => (
                      <div
                        key={d.id}
                        style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 22px", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}
                      >
                        <StatusBadge status={d.status} />
                        <span style={{ fontSize: 12, color: "var(--fg-muted)", textTransform: "capitalize" }}>{d.environment}</span>
                        <span style={{ fontSize: 12, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>{d.branch || "—"}</span>
                        <span style={{ fontSize: 12, color: "var(--fg-subtle)" }}>{fmtDate(d.created_at)}</span>
                        {d.url && (
                          <a href={d.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", marginLeft: "auto" }}>
                            View →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
