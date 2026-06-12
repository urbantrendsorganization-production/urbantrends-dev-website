import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost, CATEGORY_LABELS } from "@/lib/blog";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import CommentSection from "./CommentSection";
import SubscribeSection from "./SubscribeSection";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  const description = post.meta_description || post.excerpt;
  const image = post.og_image_url || post.cover_image_url || undefined;

  return {
    title: post.title,
    description,
    openGraph: {
      type: "article",
      title: post.title,
      description,
      ...(image && { images: [image] }),
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      tags: post.tags.map((t) => t.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(image && { images: [image] }),
    },
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const authorInitials = post.author_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: post.author_name },
    publisher: {
      "@type": "Organization",
      name: "UrbanTrends",
      url: "https://urbantrends.dev",
    },
    ...(post.og_image_url || post.cover_image_url
      ? { image: post.og_image_url || post.cover_image_url }
      : {}),
    url: `https://urbantrends.dev/blog/${slug}`,
    keywords: post.tags.map((t) => t.name).join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Header ── */}
      <section className="page-head" data-screen-label="Blog post">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/blog">Blog</Link>
            <span className="sep">/</span>
            <span>{post.title}</span>
          </div>

          <div className="blog-meta" style={{ marginTop: 18, marginBottom: 18 }}>
            <span className="tag" style={{ color: post.accent_color }}>
              {CATEGORY_LABELS[post.category] ?? post.category}
            </span>
            <span>·</span>
            <span>{post.read_time} min read</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(26px,4vw,48px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: "var(--fg)",
              maxWidth: "18ch",
            }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p
              style={{
                fontSize: "clamp(15px,1.9vw,18px)",
                color: "var(--fg-muted)",
                marginTop: 18,
                lineHeight: 1.6,
                maxWidth: "54ch",
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Author row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 28,
              flexWrap: "wrap",
            }}
          >
            <div
              className="avatar"
              style={{ width: 36, height: 36, fontSize: 13 }}
            >
              {authorInitials}
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--fg)",
                  margin: 0,
                }}
              >
                {post.author_name}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--fg-subtle)",
                  margin: 0,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {new Date(post.published_at).toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginLeft: "auto",
                }}
              >
                {post.tags.map((t) => (
                  <span
                    key={t.slug}
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                      color: "var(--fg-subtle)",
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: 5,
                      padding: "3px 8px",
                    }}
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Cover image / accent banner ── */}
      {post.cover_image_url ? (
        <div
          style={{
            width: "100%",
            maxHeight: 420,
            overflow: "hidden",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image_url}
            alt={post.title}
            style={{ width: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: 6,
            background: post.accent_color,
          }}
        />
      )}

      {/* ── Body ── */}
      <section className="section" style={{ paddingTop: "clamp(32px,5vw,60px)" }}>
        <div className="wrap">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) 280px",
              gap: "clamp(32px,6vw,80px)",
              alignItems: "flex-start",
            }}
          >
            {/* Main content */}
            <div>
              <div className="prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.body}
                </ReactMarkdown>
              </div>

              {/* Action bar */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 40,
                  paddingTop: 28,
                  borderTop: "1px solid var(--border)",
                  flexWrap: "wrap",
                }}
              >
                <LikeButton slug={slug} />
                <ShareButton title={post.title} slug={slug} />
              </div>

              {/* Comments */}
              <div
                style={{
                  marginTop: 52,
                  paddingTop: 40,
                  borderTop: "1px solid var(--border)",
                }}
              >
                <CommentSection slug={slug} />
              </div>

              {/* Subscribe */}
              <div style={{ marginTop: 52 }}>
                <SubscribeSection />
              </div>
            </div>

            {/* Sidebar */}
            <aside
              style={{ position: "sticky", top: 24 }}
              className="blog-sidebar"
            >
              {/* Category */}
              <div
                style={{
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--surface-1)",
                  padding: "18px 20px",
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    color: "var(--fg-subtle)",
                    margin: "0 0 6px",
                  }}
                >
                  Category
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: post.accent_color,
                    margin: 0,
                  }}
                >
                  {CATEGORY_LABELS[post.category] ?? post.category}
                </p>
              </div>

              {/* Back to blog */}
              <Link
                href="/blog"
                className="btn btn-secondary"
                style={{
                  width: "100%",
                  textAlign: "center",
                  display: "block",
                  textDecoration: "none",
                }}
              >
                ← All posts
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .blog-sidebar { display: none; }
        }
      `}</style>
    </>
  );
}
