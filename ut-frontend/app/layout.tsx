import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  icons: {
    icon: [
      { url: "/images/favicon.svg", type: "image/svg+xml" },
      { url: "/images/favicon.png", type: "image/png" },
    ],
    apple: "/images/favicon.png",
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
      </head>
      <body>
        <PageProgress />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
