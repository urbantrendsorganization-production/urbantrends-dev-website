"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createOrder } from "@/lib/services";

export default function GetStartedButton({
  serviceId,
  serviceName,
  planId,
  planName,
  label = "Get started",
  className = "btn btn-primary",
  style,
}: {
  serviceId: number;
  serviceName: string;
  planId: number;
  planName: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setPending(true);
    try {
      const session = await getSession();
      const authed = Boolean(session.meta?.is_authenticated);

      if (!authed) {
        // Not signed in — hand off to the order form, which prompts login and
        // preserves the chosen service + plan.
        router.push(`/portal/orders/new?service=${serviceId}&plan=${planId}`);
        return;
      }

      const result = await createOrder({
        service: serviceId,
        pricing_plan: planId,
        requirements: `Started the ${planName} plan for ${serviceName} from the pricing page.`,
      });

      if (result.ok && result.data) {
        router.push(`/portal/orders/${result.data.id}`);
      } else {
        setError(result.error ?? "Couldn't start your order. Please try again.");
        setPending(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <>
      <button type="button" className={className} style={style} onClick={handleClick} disabled={pending}>
        {pending ? "Starting…" : label}
        {!pending && (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </button>
      {error && (
        <p style={{ fontSize: 12.5, color: "var(--danger, #ef4444)", marginTop: 8 }} role="alert">
          {error}
        </p>
      )}
    </>
  );
}
