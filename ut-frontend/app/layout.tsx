import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PageProgress from "@/components/PageProgress";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://urbantrends.dev"
  ),
  title: {
    default: "UrbanTrends — Production-grade software, shipped",
    template: "%s — UrbanTrends",
  },
  description:
    "A Nairobi software studio that designs, builds, and ships production-grade products, tools, and infrastructure.",
  openGraph: {
    type: "website",
    siteName: "UrbanTrends",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  // NOTE: no `alternates.canonical` here. Next.js merges metadata shallowly and
  // *inherits* any field a child route doesn't set — a canonical on the root
  // layout would make every page without its own `alternates` declare the home
  // page as its canonical, collapsing the whole site to one URL in Google's
  // index. Canonicals are set per-route instead (see each page's metadata).
  icons: {
    icon: [
      { url: "/images/favicon.svg", type: "image/svg+xml" },
      { url: "/images/favicon.png", type: "image/png" },
    ],
    apple: "/images/favicon.png",
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urbantrends.dev";

// Organization structured data for rich results / knowledge panel. `sameAs`
// is intentionally omitted until verified social profiles exist — add the
// real profile URLs here rather than guessing.
const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UrbanTrends",
  legalName: "UrbanTrends.dev",
  url: SITE_URL,
  logo: `${SITE_URL}/images/favicon.png`,
  description:
    "A Nairobi software studio that designs, builds, and ships production-grade products, tools, and infrastructure.",
  email: "info@urbantrends.dev",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@urbantrends.dev",
    contactType: "customer support",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-hero="diagram"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ut-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
      </head>
      <body>
        <PageProgress />
        <SiteNav />
        {children}
        <SiteFooter />
        <Script
          src="/agent/static/mika-widget.js"
          data-api-base="/agent/api"
          data-avatar="/agent/static/assets/agent1.jpg"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
