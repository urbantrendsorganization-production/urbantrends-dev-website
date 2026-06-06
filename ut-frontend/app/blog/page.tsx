import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  IllustrationMpesaWeekends,
  IllustrationStkCallbacks,
  IllustrationPerUnitPricing,
  IllustrationEtims,
  IllustrationTwoSidedMarket,
  IllustrationWebhookRetry,
  IllustrationHiringNairobi,
} from "@/components/BlogIllustrations";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering write-ups and product decisions from the UrbanTrends reconciliation core.",
};

interface BlogPost {
  slug: string;
  tag: string;
  readTime: string;
  title: string;
  excerpt: string;
  authorInitials: string;
  author: string;
  date: string;
  accent: string;
  Illustration: React.ComponentType;
}

const FEATURED: BlogPost = {
  slug: "reconciling-mpesa-weekends-postmortem",
  tag: "Engineering",
  readTime: "9 min read",
  title: "Reconciling M-Pesa on weekends: a postmortem of the batch job we deleted",
  excerpt:
    "We used to run reconciliation as a nightly batch. Then a landlord called on a Saturday asking why his tenant's payment 'disappeared'. Here's how we moved to real-time callback reconciliation — and what broke along the way.",
  authorInitials: "WK",
  author: "Wanjiru Kamau",
  date: "May 28, 2026",
  accent: "#34D399",
  Illustration: IllustrationMpesaWeekends,
};

const POSTS: BlogPost[] = [
  {
    slug: "daraja-stk-push-six-callbacks",
    tag: "Engineering",
    readTime: "7 min",
    title: "Daraja STK Push: the six callbacks nobody documents",
    excerpt:
      "A field map of every callback state we've seen in production, including the ones the official docs skip.",
    authorInitials: "DM",
    author: "David Mwangi",
    date: "May 21",
    accent: "#22D3EE",
    Illustration: IllustrationStkCallbacks,
  },
  {
    slug: "why-we-price-rentflow-per-unit",
    tag: "Company",
    readTime: "5 min",
    title: "Why we price RentFlow per unit",
    excerpt:
      "Seat-based pricing punishes the wrong thing. Here's the reasoning behind per-unit, and the spreadsheet we modelled it on.",
    authorInitials: "FA",
    author: "Faith Achieng",
    date: "May 14",
    accent: "#34D399",
    Illustration: IllustrationPerUnitPricing,
  },
  {
    slug: "etims-without-tears-field-guide",
    tag: "Guides",
    readTime: "11 min",
    title: "eTIMS without tears: a field guide",
    excerpt:
      "Everything we learned wiring KRA eTIMS into a product — the gotchas, the formats, the retries.",
    authorInitials: "SK",
    author: "Samuel Kiptoo",
    date: "May 7",
    accent: "#FB923C",
    Illustration: IllustrationEtims,
  },
  {
    slug: "two-sided-marketplace-one-sided-market",
    tag: "Product",
    readTime: "8 min",
    title: "Building a two-sided marketplace in a one-sided market",
    excerpt:
      "Cold-starting PortfolioU when neither students nor employers were waiting for us.",
    authorInitials: "JN",
    author: "Joy Njeri",
    date: "Apr 30",
    accent: "#A78BFA",
    Illustration: IllustrationTwoSidedMarket,
  },
  {
    slug: "webhook-retry-strategy-idempotency-keys",
    tag: "Engineering",
    readTime: "6 min",
    title: "Our webhook retry strategy (and why idempotency keys saved us)",
    excerpt:
      "Duplicate callbacks are not an edge case — they're Tuesday. How we made reconciliation safe to repeat.",
    authorInitials: "WK",
    author: "Wanjiru Kamau",
    date: "Apr 22",
    accent: "#22D3EE",
    Illustration: IllustrationWebhookRetry,
  },
  {
    slug: "hiring-senior-engineers-nairobi",
    tag: "Company",
    readTime: "4 min",
    title: "Hiring senior engineers in Nairobi",
    excerpt:
      "What we look for, how we interview, and why we don't do whiteboard puzzles.",
    authorInitials: "BO",
    author: "Brian Otieno",
    date: "Apr 15",
    accent: "#60A5FA",
    Illustration: IllustrationHiringNairobi,
  },
];

export default function BlogPage() {
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
            Notes from the <span className="em">reconciliation core.</span>
          </h1>
          <p className="page-lead">
            Engineering write-ups, product decisions, and the occasional
            hard-won lesson about building payments software in East Africa.
            Mostly for developers.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(20px,3vw,32px)" }}>
        <div className="wrap">
          {/* FEATURED POST */}
          <a
            className="featured-post"
            href="#"
            style={{ "--accent": FEATURED.accent } as React.CSSProperties}
          >
            <div className="fp-art">
              <Image
                src="https://images.unsplash.com/photo-1509017174183-0b7e0278f1ec?auto=format&fit=crop&w=900&q=80"
                alt="Mobile payment reconciliation — M-Pesa on a smartphone"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="fp-body">
              <div className="blog-meta">
                <span className="tag">{FEATURED.tag}</span>
                <span>·</span>
                <span>{FEATURED.readTime}</span>
              </div>
              <h2>{FEATURED.title}</h2>
              <p>{FEATURED.excerpt}</p>
              <div className="blog-foot">
                <span className="avatar">{FEATURED.authorInitials}</span>
                <span>{FEATURED.author}</span>
                <span>·</span>
                <span>{FEATURED.date}</span>
              </div>
            </div>
          </a>

          {/* BLOG GRID */}
          <div className="blog-grid">
            {POSTS.map((post) => (
              <a
                key={post.slug}
                className="blog-card"
                href="#"
                style={{ "--accent": post.accent } as React.CSSProperties}
              >
                <div className="blog-thumb blog-svg-art">
                  <post.Illustration />
                </div>
                <div className="blog-body">
                  <div className="blog-meta">
                    <span className="tag">{post.tag}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-foot">
                    <span className="avatar">{post.authorInitials}</span>
                    <span>{post.author} · {post.date}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
