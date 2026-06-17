"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getThread, syncGmail, type GmailThread, type GmailThreadDetail } from "@/lib/gmail";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function GmailPage() {
  const [threads, setThreads] = useState<GmailThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<GmailThreadDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  function load() {
    return fetch("/api/gmail/threads", { credentials: "same-origin", cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          setDenied(true);
        } else if (res.ok) {
          setThreads(await res.json());
        }
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSync() {
    setSyncing(true);
    await syncGmail();
    await load();
    setSyncing(false);
  }

  async function toggle(threadId: string) {
    if (openId === threadId) {
      setOpenId(null);
      setDetail(null);
      return;
    }
    setOpenId(threadId);
    setDetail(null);
    setLoadingDetail(true);
    const d = await getThread(threadId);
    setDetail(d);
    setLoadingDetail(false);
  }

  if (loading) {
    return <p style={{ color: "var(--fg-muted)", fontSize: 14 }}>Loading inbox…</p>;
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
            Gmail
          </h1>
          <p style={{ color: "var(--fg-muted)", fontSize: 13, marginTop: 4 }}>
            {threads.length} thread{threads.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSync}
          disabled={syncing}
          style={{ opacity: syncing ? 0.6 : 1 }}
        >
          {syncing ? "Syncing…" : "Sync inbox"}
        </button>
      </div>

      {threads.length === 0 ? (
        <p style={{ color: "var(--fg-muted)", fontSize: 13 }}>No threads. Connect Gmail in the admin, then sync.</p>
      ) : (
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          {threads.map((t) => {
            const isOpen = openId === t.thread_id;
            return (
              <div key={t.thread_id} style={{ borderBottom: "1px solid var(--border)" }}>
                <div
                  onClick={() => toggle(t.thread_id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 22px", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: t.is_read ? 400 : 700, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.subject || "(no subject)"}
                      </span>
                      {t.message_count > 1 && (
                        <span style={{ fontSize: 11, color: "var(--fg-subtle)" }}>({t.message_count})</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--fg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.from_email}
                      {t.client_name && <span> · {t.client_name}</span>}
                      {t.order_id && (
                        <Link href={`/portal/orders/${t.order_id}`} onClick={(e) => e.stopPropagation()} style={{ color: "var(--accent)", textDecoration: "none", marginLeft: 6 }}>
                          → Order #{t.order_id}
                        </Link>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--fg-subtle)", flexShrink: 0 }}>{fmtDate(t.last_message_at)}</span>
                </div>

                {isOpen && (
                  <div style={{ background: "var(--surface-2)", padding: "12px 22px 18px" }}>
                    {loadingDetail ? (
                      <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>Loading messages…</p>
                    ) : !detail ? (
                      <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>Could not load thread.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {detail.messages.map((m) => (
                          <div key={m.message_id} style={{ borderLeft: "2px solid var(--border)", paddingLeft: 14 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{m.from_email}</span>
                              <span style={{ fontSize: 12, color: "var(--fg-subtle)" }}>{fmtDate(m.sent_at)}</span>
                            </div>
                            <pre style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-muted)", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.6 }}>
                              {m.body_text || "(no text body)"}
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}
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
