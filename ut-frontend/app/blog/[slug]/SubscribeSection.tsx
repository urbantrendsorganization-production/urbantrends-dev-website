"use client";

import { useEffect, useState } from "react";
import { subscribeBlog } from "@/lib/blog";
import { getSession } from "@/lib/auth";

export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    getSession().then((r) => {
      const u = r.data?.user as { email?: string } | undefined;
      if (r.meta?.is_authenticated && u?.email) setEmail(u.email);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state !== "idle") return;
    setState("loading");
    await subscribeBlog(email.trim());
    setState("done");
  }

  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid var(--border)",
        background: "var(--surface-1)",
        padding: "clamp(28px,4vw,48px)",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--fg-muted)", marginBottom: 8 }}>
        Stay in the loop
      </p>
      <h3 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "var(--fg)", marginBottom: 10 }}>
        Get new posts in your inbox.
      </h3>
      <p style={{ fontSize: 14, color: "var(--fg-muted)", marginBottom: 24, maxWidth: 380, marginInline: "auto" }}>
        Engineering, product, and company writing from the UrbanTrends team. No noise — only when something is worth reading.
      </p>

      {state === "done" ? (
        <p style={{ fontSize: 15, color: "#34D399", fontWeight: 500 }}>
          ✓ You&apos;re subscribed!
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: 8, maxWidth: 400, marginInline: "auto", flexWrap: "wrap" }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              flex: 1,
              minWidth: 180,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 7,
              padding: "10px 14px",
              fontSize: 14,
              color: "var(--fg)",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={state === "loading"}
            style={{ whiteSpace: "nowrap" }}
          >
            {state === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}
