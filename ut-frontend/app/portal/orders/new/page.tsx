"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getService, createOrder, type Service, type PricingPlan } from "@/lib/services";

function NewOrderForm() {
  const router = useRouter();
  const params = useSearchParams();
  const serviceId = Number(params.get("service"));
  const planId = params.get("plan") ? Number(params.get("plan")) : null;

  const [service, setService] = useState<Service | null>(null);
  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [requirements, setRequirements] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!serviceId) { router.replace("/services"); return; }
    // Find service by id from the API — we'll fetch all and find the match
    fetch("/api/services/", { cache: "no-store" })
      .then((r) => r.json())
      .then((services: Service[]) => {
        const found = services.find((s) => s.id === serviceId) ?? null;
        setService(found);
        if (found && planId) {
          setPlan(found.plans.find((p) => p.id === planId) ?? null);
        }
      });
  }, [serviceId, planId, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await createOrder({
        service: serviceId,
        pricing_plan: planId,
        requirements,
      });
      if (result.ok && result.data) {
        router.push(`/portal/orders/${result.data.id}`);
      } else {
        setError(result.error ?? "Failed to submit. Please try again.");
      }
    });
  }

  if (!service) {
    return <p style={{ color: "var(--fg-muted)", fontSize: 14 }}>Loading…</p>;
  }

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div className="breadcrumb" style={{ marginBottom: 12 }}>
          <Link href="/services">Services</Link>
          <span className="sep">/</span>
          <Link href={`/services/${service.slug}`}>{service.name}</Link>
          <span className="sep">/</span>
          <span>Request</span>
        </div>
        <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 600, marginBottom: 4 }}>
          Request: {service.name}
        </h1>
        {plan && (
          <p style={{ fontSize: 14, color: "var(--fg-muted)" }}>
            Plan: <strong style={{ color: "var(--fg)" }}>{plan.name}</strong>
            {!plan.is_quote && plan.price && (
              <>
                {" "}— ${plan.price}
                {plan.billing_cycle === "monthly" ? "/mo" : plan.billing_cycle === "yearly" ? "/yr" : ""}
              </>
            )}
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 640,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div className="field">
          <label htmlFor="req" style={{ fontSize: 14, fontWeight: 500, color: "var(--fg)", marginBottom: 6, display: "block" }}>
            Tell us what you need
          </label>
          <textarea
            id="req"
            required
            rows={7}
            placeholder={
              plan?.is_quote
                ? "Describe your project — scope, timeline, any constraints. The more detail, the faster we can respond."
                : "Describe your requirements. What are you building? What's the context? Any specific constraints?"
            }
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--fg)",
              fontSize: 14,
              padding: "12px 14px",
              fontFamily: "inherit",
              lineHeight: 1.6,
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {error && (
          <p style={{ fontSize: 13, color: "var(--danger, #ef4444)" }} role="alert">
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-primary" type="submit" disabled={pending || !requirements.trim()}>
            {pending ? "Submitting…" : plan?.is_quote ? "Request quote" : "Submit order"}
          </button>
          <Link className="btn btn-ghost" href={`/services/${service.slug}`}>
            Cancel
          </Link>
        </div>

        <p style={{ fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.6 }}>
          Once submitted, we review your brief and follow up within 1–2 business days. You can track and communicate through your order portal.
        </p>
      </form>
    </>
  );
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={<p style={{ color: "var(--fg-muted)", fontSize: 14 }}>Loading…</p>}>
      <NewOrderForm />
    </Suspense>
  );
}
