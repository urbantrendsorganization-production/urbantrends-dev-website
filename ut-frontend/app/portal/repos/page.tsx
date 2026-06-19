"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { syncRepos, listAccounts, listRepos, type GitHubRepo, type GitHubAccount } from "@/lib/github";

const LANG_COLORS: Record<string, [string, string]> = {
  Python:     ["#3776ab", "#fff"],
  TypeScript: ["#3178c6", "#fff"],
  JavaScript: ["#f7df1e", "#000"],
  Go:         ["#00add8", "#fff"],
  Rust:       ["#ce422b", "#fff"],
  Ruby:       ["#cc342d", "#fff"],
};

function relativeDate(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
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

function AccountTab({
  account,
  active,
  onClick,
}: {
  account: GitHubAccount | { login: "all"; account_type: "all"; repo_count: number };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "7px 14px",
        borderRadius: 8,
        border: active ? "1px solid var(--accent)" : "1px solid var(--border)",
        background: active ? "var(--accent-subtle, rgba(34,211,238,.08))" : "var(--surface-1)",
        color: active ? "var(--accent)" : "var(--fg-muted)",
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {account.login === "all" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      ) : account.account_type === "org" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      )}
      {account.login === "all" ? "All" : account.login}
      <span style={{
        background: active ? "var(--accent)" : "var(--surface-3)",
        color: active ? "#04181d" : "var(--fg-muted)",
        borderRadius: 20, fontSize: 10, fontWeight: 700,
        padding: "1px 6px", minWidth: 18, textAlign: "center",
      }}>
        {account.repo_count}
      </span>
    </button>
  );
}

export default function ReposPage() {
  const [accounts, setAccounts] = useState<GitHubAccount[]>([]);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeAccount, setActiveAccount] = useState<string>("all");
  const [language, setLanguage] = useState("");

  async function load(account?: string) {
    const res = await fetch(
      `/api/github/repos${account && account !== "all" ? `?account=${account}` : ""}`,
      { credentials: "same-origin", cache: "no-store" }
    );
    if (res.status === 401 || res.status === 403) {
      setDenied(true);
    } else if (res.ok) {
      setRepos(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    Promise.all([
      listAccounts().then(setAccounts),
      load(),
    ]);
  }, []);

  function switchAccount(login: string) {
    setActiveAccount(login);
    setLanguage("");
    setLoading(true);
    load(login).then(() => setLoading(false));
  }

  async function handleSync() {
    setSyncing(true);
    await syncRepos();
    const fresh = await listAccounts();
    setAccounts(fresh);
    await load(activeAccount);
    setSyncing(false);
  }

  const totalAll = repos.length;
  const languages = Array.from(new Set(repos.map((r) => r.language).filter(Boolean))).sort();
  const visible = language ? repos.filter((r) => r.language === language) : repos;

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
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>
            GitHub Repos
          </h1>
          <p style={{ color: "var(--fg-muted)", fontSize: 13, marginTop: 4 }}>
            {visible.length} repositor{visible.length === 1 ? "y" : "ies"}
            {activeAccount !== "all" && ` · @${activeAccount}`}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSync}
          disabled={syncing}
          style={{ opacity: syncing ? 0.6 : 1 }}
        >
          {syncing ? "Syncing…" : "Sync all"}
        </button>
      </div>

      {/* Account tabs */}
      {accounts.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <AccountTab
            account={{ login: "all", account_type: "all", repo_count: accounts.reduce((s, a) => s + a.repo_count, 0) }}
            active={activeAccount === "all"}
            onClick={() => switchAccount("all")}
          />
          {accounts.map((a) => (
            <AccountTab
              key={a.id}
              account={a}
              active={activeAccount === a.login}
              onClick={() => switchAccount(a.login)}
            />
          ))}
        </div>
      )}

      {/* Language filter */}
      {languages.length > 0 && (
        <div style={{ marginBottom: 20 }}>
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
        </div>
      )}

      {/* Repo grid */}
      {loading ? (
        <p style={{ color: "var(--fg-muted)", fontSize: 14 }}>Loading…</p>
      ) : visible.length === 0 ? (
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
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 12, flexShrink: 0,
                  background: repo.is_private ? "var(--surface-3)" : "#d1fae5",
                  color: repo.is_private ? "var(--fg-muted)" : "#065f46",
                }}>
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
                {accounts.length > 1 && activeAccount === "all" && (
                  <span style={{ fontSize: 11, color: "var(--fg-subtle)", marginLeft: "auto" }}>
                    @{repo.account_login}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
