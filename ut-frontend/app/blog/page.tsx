import type { Metadata } from "next";
import Link from "next/link";
import { listPosts, CATEGORY_LABELS, type Post } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering write-ups, product decisions, and company thinking from the UrbanTrends team.",
  alternates: { canonical: "/blog" },
};

function PostThumb({ post }: { post: Post }) {
  if (post.cover_image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={post.cover_image_url}
        alt={post.title}
        className="blog-thumb"
        style={{ objectFit: "cover", width: "100%", display: "block" }}
      />
    );
  }
  return (
    <div
      className="blog-thumb"
      style={{
        background: `linear-gradient(135deg, ${post.accent_color}22 0%, ${post.accent_color}08 100%)`,
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: `${post.accent_color}30`,
          border: `1.5px solid ${post.accent_color}50`,
        }}
      />
    </div>
  );
}

function PostMeta({ post }: { post: Post }) {
  const initials = post.author_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="blog-foot">
      <span className="avatar">{initials || "U"}</span>
      <span>{post.author_name}</span>
      <span className="sep">·</span>
      <span>
        {new Date(post.published_at).toLocaleDateString("en-KE", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
      {post.like_count > 0 && (
        <>
          <span className="sep">·</span>
          <span>{post.like_count} ♥</span>
        </>
      )}
    </div>
  );
}

export default async function BlogPage() {
  const data = await listPosts();
  const posts = data.results;

  const [featured, ...rest] = posts;

  return (
    <>
      <section className="page-head" data-screen-label="Blog">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Blog</span>
          </div>
          <h1 className="page-title">
            Writing from the <span className="em">studio.</span>
          </h1>
          <p className="page-lead">
            Engineering decisions, product thinking, and what it takes to build
            software for East Africa.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(20px,3vw,36px)" }}>
        <div className="wrap">
          {posts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                color: "var(--fg-muted)",
                border: "1px dashed var(--border)",
                borderRadius: 12,
              }}
            >
              <p style={{ fontSize: 15 }}>No posts yet — check back soon.</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="featured-post"
                  style={{ textDecoration: "none", display: "grid" }}
                >
                  <div className="fp-body">
                    <div className="blog-meta">
                      <span
                        className="tag"
                        style={{ color: featured.accent_color }}
                      >
                        {CATEGORY_LABELS[featured.category] ?? featured.category}
                      </span>
                      <span>·</span>
                      <span>{featured.read_time} min read</span>
                    </div>
                    <h2>{featured.title}</h2>
                    <p>{featured.excerpt}</p>
                    <PostMeta post={featured} />
                  </div>
                  <PostThumb post={featured} />
                </Link>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="blog-grid" style={{ marginTop: 24 }}>
                  {rest.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="blog-card"
                      style={{ textDecoration: "none" }}
                    >
                      <PostThumb post={post} />
                      <div className="blog-body">
                        <div className="blog-meta">
                          <span
                            className="tag"
                            style={{ color: post.accent_color }}
                          >
                            {CATEGORY_LABELS[post.category] ?? post.category}
                          </span>
                          <span>·</span>
                          <span>{post.read_time} min read</span>
                        </div>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                        <PostMeta post={post} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
