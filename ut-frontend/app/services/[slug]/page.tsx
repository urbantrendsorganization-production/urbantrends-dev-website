import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, type PricingPlan } from "@/lib/services";
import { currencyForCountry, formatPrice, kesRate, type DisplayCurrency } from "@/lib/currency";
import QuoteButton from "../QuoteButton";
import GetStartedButton from "../GetStartedButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.name,
    description: service.tagline,
  };
}

const BILLING_LABELS: Record<string, string> = {
  one_time: "one-time",
  monthly: "/ month",
  yearly: "/ year",
};

const TIER_LABELS: Record<string, string> = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
};

function PlanCard({
  plan,
  accent,
  serviceId,
  serviceName,
  currency,
  rate,
}: {
  plan: PricingPlan;
  accent: string;
  serviceId: number;
  serviceName: string;
  currency: DisplayCurrency;
  rate: number;
}) {
  return (
    <div
      className={`plan-card${plan.is_popular ? " popular" : ""}`}
      style={{ "--pa": accent } as React.CSSProperties}
    >
      {plan.is_popular && <span className="plan-popular-badge">Most popular</span>}

      {plan.tier && <span className="plan-tier-badge">{TIER_LABELS[plan.tier]}</span>}

      <div className="plan-name">{plan.name}</div>

      {plan.description && <p className="plan-desc">{plan.description}</p>}

      {plan.is_quote ? (
        <>
          <div className="plan-price" style={{ fontSize: 22, paddingTop: 6 }}>Custom quote</div>
          <div className="plan-cycle">Scoped to your project</div>
        </>
      ) : (
        <>
          <div className="plan-price">
            {plan.price
              ? <>{formatPrice(Number(plan.price), currency, rate)}<span> {BILLING_LABELS[plan.billing_cycle] ?? ""}</span></>
              : "—"}
          </div>
          {plan.billing_cycle && (
            <div className="plan-cycle">{BILLING_LABELS[plan.billing_cycle] ?? plan.billing_cycle}</div>
          )}
        </>
      )}

      <div className="plan-divider" />

      {plan.features.length > 0 && (
        <details className="plan-includes">
          <summary>
            <span>What&apos;s included</span>
            <svg className="pi-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <ul className="plan-features">
            {plan.features.map((f) => (
              <li key={f}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="13" height="13">
                  <path d="M5 12l5 5L20 6" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="plan-cta">
        {plan.is_quote ? (
          <QuoteButton
            serviceName={serviceName}
            label="Request a quote"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
          />
        ) : (
          <GetStartedButton
            serviceId={serviceId}
            serviceName={serviceName}
            planId={plan.id}
            planName={plan.name}
            className="btn btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              background: plan.is_popular ? accent : undefined,
              borderColor: plan.is_popular ? accent : undefined,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const hasPlans = service.plans && service.plans.length > 0;

  // Localise pricing to the visitor: KES for Kenya, approximate USD elsewhere.
  const hdrs = await headers();
  const country =
    hdrs.get("x-vercel-ip-country") ||
    (await cookies()).get("ut-country")?.value ||
    "";
  let currency = currencyForCountry(country);
  let rate = 1;
  if (currency !== "KES") {
    const r = await kesRate(currency);
    if (r) rate = r;
    else currency = "KES"; // rate unavailable — fall back to the base currency
  }

  return (
    <>
      <section className="page-head" data-screen-label="Service">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/services">Services</Link>
            <span className="sep">/</span>
            <span>{service.name}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            {service.icon_path && (
              <span
                className="pglyph"
                style={{ color: service.accent_color, "--pa": service.accent_color } as React.CSSProperties}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
                  <path d={service.icon_path} />
                </svg>
              </span>
            )}
            <span
              style={{
                fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase",
                color: service.accent_color,
                background: `${service.accent_color}18`,
                border: `1px solid ${service.accent_color}30`,
                borderRadius: 5, padding: "3px 10px",
              }}
            >
              {service.category_name}
            </span>
          </div>

          <h1 className="page-title">{service.name}</h1>
          <p className="page-lead">{service.tagline}</p>

          <div className="hero-cta" style={{ marginTop: "clamp(20px,3vw,32px)" }}>
            <QuoteButton
              serviceName={service.name}
              label="Talk to us about this"
              className="btn btn-primary"
              style={{ background: service.accent_color, borderColor: service.accent_color, color: "#04181d" }}
            />
            <Link className="btn btn-ghost" href="/services">All services</Link>
          </div>
        </div>
      </section>

      {service.description && (
        <section className="section" style={{ paddingTop: "clamp(16px,2vw,28px)" }}>
          <div className="wrap" style={{ maxWidth: 760 }}>
            <p style={{ fontSize: "clamp(15px,2vw,17.5px)", lineHeight: 1.8, color: "var(--fg-muted)" }}>
              {service.description}
            </p>
          </div>
        </section>
      )}

      {hasPlans && (
        <section className="section divider-top">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow muted">Pricing</span>
              <h2>{service.is_tiered ? "Choose your tier." : "Choose a plan."}</h2>
              <p>All plans include a scoping call. No lock-in — scope adjustments are always a conversation, not a contract fight.</p>
            </div>
            <div className="plans-grid">
              {service.plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  accent={service.accent_color}
                  serviceId={service.id}
                  serviceName={service.name}
                  currency={currency}
                  rate={rate}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section divider-top">
        <div className="wrap">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
              gap: 20,
            }}
          >
            {[
              { n: "01", title: "Discovery call", desc: "30–60 minutes. We understand the problem, the constraints, and what done actually looks like." },
              { n: "02", title: "Proposal & scope", desc: "A written scope: what we build, timeline, cost. No ambiguity, no retainer-for-its-own-sake." },
              { n: "03", title: "Build iteratively", desc: "Working software at every checkpoint — not a big reveal at the end." },
              { n: "04", title: "Ship & support", desc: "Deployed, documented, and yours. We stay on for the questions that come up in the first weeks." },
            ].map((step) => (
              <div key={step.n} className="process-step">
                <div className="ps-num" style={{ color: service.accent_color }}>{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div>
            <h2>Ready to get started?</h2>
            <p>Tell us what you need. We&apos;ll scope it and follow up with a clear proposal — usually within 48 hours.</p>
          </div>
          <div className="hero-cta" style={{ margin: 0 }}>
            <QuoteButton
              serviceName={service.name}
              label="Start a conversation"
              className="btn btn-primary"
            />
            <Link className="btn btn-ghost" href="/services">All services</Link>
          </div>
        </div>
      </section>
    </>
  );
}
