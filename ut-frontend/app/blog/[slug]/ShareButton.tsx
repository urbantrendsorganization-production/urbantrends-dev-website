"use client";

import { useState } from "react";

export default function ShareButton({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/blog/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or not supported — fall through to copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "8px 14px",
        fontSize: 14,
        color: copied ? "#34D399" : "var(--fg-muted)",
        cursor: "pointer",
        transition: "all .18s ease",
        fontFamily: "inherit",
      }}
    >
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
            <path d="M5 12l5 5L20 6" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
