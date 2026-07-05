"use client";

import { useEffect, useState, useTransition } from "react";
import { getReview, submitReview, type Review } from "@/lib/services";

function Stars({
  value,
  onChange,
  readOnly = false,
  size = 28,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div style={{ display: "inline-flex", gap: 4 }} role={readOnly ? "img" : "radiogroup"} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          aria-pressed={!readOnly && value === n}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange?.(n)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: readOnly ? "default" : "pointer",
            lineHeight: 0,
            color: n <= shown ? "#F59E0B" : "var(--border-strong, #444)",
            transition: "color .12s ease, transform .12s ease",
            transform: !readOnly && n <= hover ? "scale(1.12)" : "none",
          }}
        >
          <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.9 6.26 6.9.54-5.24 4.5 1.6 6.7L12 16.9 5.84 20.5l1.6-6.7L2.2 8.8l6.9-.54L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

const CARD: React.CSSProperties = {
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  padding: "20px",
  marginBottom: 24,
};

const LABEL: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  color: "var(--fg-muted)",
  marginBottom: 8,
};

export default function ReviewWidget({ orderId }: { orderId: number }) {
  const [review, setReview] = useState<Review | null | undefined>(undefined);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    getReview(orderId).then((r) => setReview(r)).catch(() => setReview(null));
  }, [orderId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (rating < 1) { setError("Please pick a star rating."); return; }
    if (!comment.trim()) { setError("Please write a few words about your experience."); return; }
    startTransition(async () => {
      const result = await submitReview(orderId, {
        rating,
        comment: comment.trim(),
        author_name: authorName.trim() || undefined,
        author_role: authorRole.trim() || undefined,
        company: company.trim() || undefined,
      });
      if (result.ok && result.data) {
        setReview(result.data);
      } else {
        setError(result.error ?? "Failed to submit review.");
      }
    });
  }

  // Still loading the existing-review state.
  if (review === undefined) return null;

  // Already reviewed — show a summary + moderation state.
  if (review) {
    return (
      <div style={CARD}>
        <p style={LABEL}>Your review</p>
        <Stars value={review.rating} readOnly size={22} />
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--fg)", margin: "12px 0 0", whiteSpace: "pre-wrap" }}>
          &ldquo;{review.comment}&rdquo;
        </p>
        <p style={{ fontSize: 12.5, color: review.is_approved ? "#34D399" : "var(--fg-muted)", margin: "14px 0 0", display: "flex", alignItems: "center", gap: 6 }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            {review.is_approved ? <path d="M5 12l5 5L20 7" /> : <><circle cx="12" cy="12" r="9" /><path d="M12 8v4l2.5 2.5" /></>}
          </svg>
          {review.is_approved
            ? "Published — thank you! Your review appears on our site."
            : "Thanks! Your review is awaiting approval before it goes public."}
        </p>
      </div>
    );
  }

  // No review yet — show the submission form.
  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid var(--border)",
    borderRadius: 8,
    background: "var(--bg)",
    color: "var(--fg)",
    fontSize: 14,
    padding: "9px 12px",
    fontFamily: "inherit",
    outline: "none",
  };

  return (
    <form onSubmit={handleSubmit} style={CARD}>
      <p style={LABEL}>Leave a review</p>
      <p style={{ fontSize: 13.5, color: "var(--fg-muted)", margin: "0 0 14px", lineHeight: 1.6 }}>
        How did we do? Approved reviews may appear as testimonials on our site.
      </p>

      <Stars value={rating} onChange={setRating} />

      <textarea
        placeholder="What was working with us like?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, margin: "14px 0 12px" }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 14 }}>
        <input style={inputStyle} placeholder="Display name (optional)" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
        <input style={inputStyle} placeholder="Your role (optional)" value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} />
        <input style={inputStyle} placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        {error ? (
          <span style={{ fontSize: 12.5, color: "var(--danger, #ef4444)" }}>{error}</span>
        ) : (
          <span style={{ fontSize: 12.5, color: "var(--fg-muted)" }}>Reviews are moderated before publishing.</span>
        )}
        <button className="btn btn-primary btn-sm" type="submit" disabled={pending}>
          {pending ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </form>
  );
}
