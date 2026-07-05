import Link from "next/link";

export type ProductStatus = "live" | "beta" | "soon";

export type Product = {
  name: string;
  tag: string;
  accent: string;
  status: ProductStatus;
  description: string;
  features: string[];
  href?: string; // omitted when status is "soon"
  cta?: string;
  iconPath: string;
};

// Single source of truth for the product catalogue — consumed by both the
// /products page and the homepage teaser. Copy and link targets are provisional
// (see the /products page header); update as products go live.
export const PRODUCTS: Product[] = [
  {
    name: "RentFlow",
    tag: "SaaS · PropTech",
    accent: "#34D399",
    status: "live",
    description:
      "Property management that reconciles M-Pesa Paybill settlements to the right unit, tenant, and invoice — automatically, including on weekends.",
    features: [
      "M-Pesa Paybill auto-reconciliation",
      "Tenant, lease & unit management",
      "Automated invoices and receipts",
    ],
    href: "/rentflow",
    cta: "View product",
    iconPath:
      "M3 21h18M6 21V5a2 2 0 012-2h8a2 2 0 012 2v16M9 7h.01M9 11h.01M9 15h.01M14 7h.01M14 11h.01M14 15h.01",
  },
  {
    name: "SiteChat",
    tag: "SDK · Messaging",
    accent: "#22D3EE",
    status: "beta",
    description:
      "An embeddable, end-to-end encrypted chat SDK. Drop a widget into any site and talk to your customers over an encrypted, hosted relay.",
    features: [
      "Drop-in embeddable widget",
      "End-to-end encrypted messages",
      "Client SDK + hosted relay",
    ],
    href: "/contact",
    cta: "Request access",
    iconPath: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  },
  {
    name: "Conduit",
    tag: "Platform · White-label",
    accent: "#A78BFA",
    status: "soon",
    description:
      "A white-label, multi-tenant client portal engine. Spin up branded portals for each of your clients from a single codebase.",
    features: [
      "Multi-tenant, white-label",
      "Fully branded client portals",
      "Role-based access control",
    ],
    iconPath: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  },
  {
    name: "OnboardKit",
    tag: "Portal · KYC",
    accent: "#F59E0B",
    status: "soon",
    description:
      "A client onboarding and KYC portal. Guide new clients through structured onboarding with document capture and a compliance-ready audit trail.",
    features: [
      "Guided onboarding flows",
      "KYC document capture",
      "Compliance-ready audit trail",
    ],
    iconPath:
      "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M17 11l2 2 4-4",
  },
];

const STATUS_LABEL: Record<ProductStatus, string> = {
  live: "Live",
  beta: "Beta",
  soon: "Coming soon",
};

function ProductCard({ product }: { product: Product }) {
  const { name, tag, accent, status, description, features, href, cta, iconPath } = product;

  const inner = (
    <>
      <div className="ptop">
        <span className="pglyph">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={iconPath} />
          </svg>
        </span>
        <span className="ptag" data-status={status}>{STATUS_LABEL[status]}</span>
      </div>
      <h3>{name}</h3>
      <p className="pdesc">{description}</p>
      <ul className="pfeatures">
        {features.map((f) => (
          <li key={f}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
            {f}
          </li>
        ))}
      </ul>
      <span className="pspacer" />
      {href ? (
        <span className="pfoot">
          {cta ?? "Learn more"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
      ) : (
        <span className="pfoot pfoot-muted">{tag}</span>
      )}
    </>
  );

  const style = { "--pa": accent } as React.CSSProperties;

  return href ? (
    <Link className="pcard" href={href} style={style} aria-label={`${name} — ${cta ?? "learn more"}`}>
      {inner}
    </Link>
  ) : (
    <div className="pcard" style={style} aria-label={`${name} — coming soon`}>
      {inner}
    </div>
  );
}

export default function ProductShowcase({ className }: { className?: string }) {
  return (
    <div className={`product-grid grid-2${className ? ` ${className}` : ""}`}>
      {PRODUCTS.map((p) => (
        <ProductCard key={p.name} product={p} />
      ))}
    </div>
  );
}
