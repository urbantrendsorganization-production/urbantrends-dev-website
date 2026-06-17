"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { syncRepos, type GitHubRepo } from "@/lib/github";

const LANG_COLORS: Record<string, [string, string]> = {
  Python: ["#3776ab", "#fff"],
  TypeScript: ["#3178c6", "#fff"],
  JavaScript: ["#f7df1e", "#000"],
  Go: ["#00add8", "#fff"],
  Rust: ["#ce422b", "#fff"],
  Ruby: ["#cc342d", "#fff"],
};

function relativeDate(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const day = 86400000;
  if (diff < day) return "today";
  if (diff < 2 * day) return "yesterday";
  if (diff < 30 * day) return `${Math.floor(diff / day)}d ago`;
  if (diff < 365 * day) return `${Math.floor(diff / (30 * day))}mo ago`;
  return `${Math.floor(diff / (365 * day))}y ago`;
}

function LangBadge({ language }: { language: string }) {
  if (!language) return null;
  const [bg, fg] = LANG_COLORS[language] ?? ["#555", "#fff"];
  return (
    <span style={{ background: bg, color: fg, padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
      {language}
    </span>
  );
}

export default function ReposPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [language, setLanguage] = useState("");

  function load() {
    return fetch("/api/github/repos", { credentials: "same-origin", cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          setDenied(true);
        } else if (res.ok) {
          setRepos(await res.json());
        }
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSync() {
    setSyncing(true);
    await syncRepos();
    await load();
    setSyncing(false);
  }

  const languages = Array.from(new Set(repos.map((r) => r.language).filter(Boolean))).sort();
  const visible = language ? repos.filter((r) => r.language === language) : repos;

  if (loading) {
    return <p style={{ color: "var(--fg-muted)", fontSize: 14 }}>Loading repos…</p>;
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>
            GitHub Repos
          </h1>
          <p style={{ color: "var(--fg-muted)", fontSize: 13, marginTop: 4 }}>
            {repos.length} repositor{repos.length === 1 ? "y" : "ies"} synced
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--fg)",
              fontSize: 13,
              padding: "8px 12px",
            }}
          >
            <option value="">All languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            onClick={handleSync}
            disabled={syncing}
            style={{ opacity: syncing ? 0.6 : 1 }}
          >
            {syncing ? "Syncing…" : "Sync"}
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <p style={{ color: "var(--fg-muted)", fontSize: 13 }}>No repositories to show.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {visible.map((repo) => (
            <div
              key={repo.id}
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {repo.name}
                </a>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 12,
                    background: repo.is_private ? "var(--surface-3)" : "#d1fae5",
                    color: repo.is_private ? "var(--fg-muted)" : "#065f46",
                    flexShrink: 0,
                  }}
                >
                  {repo.is_private ? "Private" : "Public"}
                </span>
              </div>

              {repo.description && (
                <p style={{ margin: 0, fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.5 }}>
                  {repo.description}
                </p>
              )}

              {repo.project_label && (
                <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>
                  {repo.project_label}
                </span>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: "auto" }}>
                <LangBadge language={repo.language} />
                <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>★ {repo.stars}</span>
                <span style={{ fontSize: 12, color: "var(--fg-subtle)" }}>{relativeDate(repo.pushed_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
