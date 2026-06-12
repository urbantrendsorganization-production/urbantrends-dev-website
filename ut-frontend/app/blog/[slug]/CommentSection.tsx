"use client";

import { useEffect, useState, useTransition } from "react";
import { listComments, postComment, type Comment } from "@/lib/blog";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    listComments(slug).then(setComments);
    getSession().then((r) => {
      if (r.meta?.is_authenticated && r.data?.user) {
        setUserEmail((r.data.user as { email?: string }).email ?? null);
      }
    });
  }, [slug]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await postComment(slug, content.trim());
      if (result.ok && result.data) {
        setComments((prev) => [result.data!, ...prev]);
        setContent("");
      } else {
        setError("Failed to post comment. Please try again.");
      }
    });
  }

  return (
    <div>
      <h2 style={{ fontSize: "clamp(18px,2vw,22px)", fontWeight: 700, marginBottom: 24, color: "var(--fg)" }}>
        Discussion {comments.length > 0 && <span style={{ color: "var(--fg-muted)", fontWeight: 400, fontSize: "0.7em" }}>({comments.length})</span>}
      </h2>

      {/* Comment form */}
      {userEmail ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
          <div
            style={{
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              overflow: "hidden",
            }}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts…"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(e as unknown as React.FormEvent);
              }}
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                color: "var(--fg)",
                fontSize: 14,
                padding: "14px 16px",
                fontFamily: "inherit",
                lineHeight: 1.6,
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderTop: "1px solid var(--border)",
              }}
            >
              {error ? (
                <span style={{ fontSize: 12, color: "#ef4444" }}>{error}</span>
              ) : (
                <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>⌘↵ to post</span>
              )}
              <button
                className="btn btn-primary btn-sm"
                type="submit"
                disabled={pending || !content.trim()}
              >
                {pending ? "Posting…" : "Post comment"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div
          style={{
            borderRadius: 10,
            border: "1px dashed var(--border)",
            padding: "20px 24px",
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 14, color: "var(--fg-muted)", margin: 0 }}>
            <Link href={`/login?next=/blog/${slug}`} style={{ color: "var(--accent-text)" }}>
              Sign in
            </Link>{" "}
            to join the discussion.
          </p>
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--fg-muted)" }}>
          No comments yet. Be the first.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {comments.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, flexShrink: 0 }}>
                {c.author_initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>
                    {c.author_name}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--fg-subtle)" }}>
                    {new Date(c.created_at).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>
                  {c.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
