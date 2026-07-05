import type { Metadata } from "next";
import Link from "next/link";
import ProductShowcase from "@/components/ProductShowcase";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Software products built and run by UrbanTrends — RentFlow property management, the SiteChat encrypted chat SDK, the Conduit client-portal engine, and OnboardKit KYC onboarding.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Products — UrbanTrends",
    description:
      "Software products built and run by UrbanTrends — RentFlow, SiteChat, Conduit, and OnboardKit.",
  },
};

export default function ProductsPage() {
  return (
    <>
      <section className="page-head" data-screen-label="Products">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Products</span>
          </div>
          <h1 className="page-title">
            Products we build. <span className="em">And run.</span>
          </h1>
          <p className="page-lead">
            Alongside client work, we ship our own software — production systems we
            operate and support. Some are live today, others are close behind.
          </p>
        </div>
      </section>

      <section className="section products" style={{ paddingTop: "clamp(20px,3vw,36px)" }}>
        <div className="wrap">
          <ProductShowcase />
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div>
            <h2>Want something like this built for you?</h2>
            <p>We design, build, and operate production software for teams across East Africa and beyond.</p>
          </div>
          <div className="hero-cta" style={{ margin: 0 }}>
            <Link className="btn btn-primary" href="/services">
              Our services{" "}
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link className="btn btn-ghost" href="/contact">Talk to us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
