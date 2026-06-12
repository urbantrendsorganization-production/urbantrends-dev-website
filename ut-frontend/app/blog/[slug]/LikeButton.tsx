"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLikeStatus, toggleLike } from "@/lib/blog";
import { getSession } from "@/lib/auth";

export default function LikeButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    getLikeStatus(slug).then((s) => {
      setCount(s.count);
      setLiked(s.is_liked);
    });
    getSession().then((r) => setAuthed(!!r.meta?.is_authenticated));
  }, [slug]);

  async function handleClick() {
    if (!authed) {
      router.push(`/login?next=/blog/${slug}`);
      return;
    }
    if (loading) return;
    setLoading(true);
    // optimistic
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((c) => c + (wasLiked ? -1 : 1));
    setAnimate(true);
    setTimeout(() => setAnimate(false), 400);
    try {
      const result = await toggleLike(slug);
      setCount(result.count);
      setLiked(result.is_liked);
    } catch {
      setLiked(wasLiked);
      setCount((c) => c + (wasLiked ? 1 : -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: liked ? "rgba(239,68,68,.1)" : "var(--surface-2)",
        border: `1px solid ${liked ? "rgba(239,68,68,.3)" : "var(--border)"}`,
        borderRadius: 8,
        padding: "8px 14px",
        fontSize: 14,
        color: liked ? "#ef4444" : "var(--fg-muted)",
        cursor: "pointer",
        transition: "all .18s ease",
        transform: animate ? "scale(1.12)" : "scale(1)",
        fontFamily: "inherit",
      }}
      title={authed ? (liked ? "Unlike" : "Like this post") : "Sign in to like"}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{liked ? "♥" : "♡"}</span>
      <span>{count > 0 ? count : ""}</span>
    </button>
  );
}
