// Browser: relative URL goes through Next.js rewrites → Django.
// Server component: no base URL, so call Django directly.
const API =
  typeof window === "undefined"
    ? `${process.env.BACKEND_URL ?? "http://localhost:8000"}/api`
    : "/api";

export type PricingPlan = {
  id: number;
  tier: "" | "basic" | "standard" | "premium";
  name: string;
  description: string;
  price: string | null;
  billing_cycle: string;
  is_quote: boolean;
  features: string[];
  is_popular: boolean;
  order: number;
};

export type Service = {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description?: string;
  icon_path: string;
  accent_color: string;
  is_featured: boolean;
  is_tiered?: boolean;
  order: number;
  category_name: string;
  category_slug: string;
  plans: PricingPlan[];
};

export type Order = {
  id: number;
  customer_email: string;
  service: number;
  service_name: string;
  service_slug: string;
  pricing_plan: number | null;
  plan_name: string | null;
  status: string;
  requirements: string;
  created_at: string;
  updated_at: string;
};

export type OrderMessage = {
  id: number;
  sender_email: string;
  is_staff_sender: boolean;
  content: string;
  is_internal: boolean;
  created_at: string;
};

export type Invoice = {
  id: number;
  invoice_number: string;
  subtotal: string;
  tax_rate: string;
  total: string;
  currency: string;
  notes: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  due_date: string | null;
  issued_at: string | null;
  paid_at: string | null;
};

export type Review = {
  id: number;
  rating: number;
  comment: string;
  author_name: string;
  author_role: string;
  company: string;
  is_approved: boolean;
  created_at: string;
};

export type AnalyticsData = {
  kpis: {
    total_orders: number;
    pending: number;
    active: number;
    completed: number;
    total_customers: number;
    new_customers_30d: number;
    total_messages: number;
    total_revenue: number;
  };
  by_status: { status: string; label: string; count: number }[];
  by_service: { name: string; count: number }[];
  by_month: { month: string; count: number }[];
  recent_orders: {
    id: number;
    customer: string;
    service: string;
    status: string;
    created_at: string;
  }[];
};

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending Review",
  quoted: "Quote Sent",
  active: "In Progress",
  on_hold: "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

export async function listServices(): Promise<Service[]> {
  const res = await fetch(`${API}/services`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function getService(slug: string): Promise<Service | null> {
  const res = await fetch(`${API}/services/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

function csrfToken(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(^|;\s*)csrftoken=([^;]+)/);
  return m ? decodeURIComponent(m[2]) : "";
}

export async function createOrder(body: {
  service: number;
  pricing_plan?: number | null;
  requirements: string;
}): Promise<{ ok: boolean; data?: Order; error?: string }> {
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken(),
    },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null
        ? Object.values(data).flat().join(" ")
        : "Failed to submit order.";
    return { ok: false, error: msg };
  }
  return { ok: true, data };
}

export async function listOrders(): Promise<Order[]> {
  const res = await fetch(`${API}/orders`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getOrder(id: number): Promise<Order | null> {
  const res = await fetch(`${API}/orders/${id}`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function listMessages(orderId: number): Promise<OrderMessage[]> {
  const res = await fetch(`${API}/orders/${orderId}/messages`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getInvoice(orderId: number): Promise<Invoice | null> {
  const res = await fetch(`${API}/orders/${orderId}/invoice`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getReview(orderId: number): Promise<Review | null> {
  const res = await fetch(`${API}/orders/${orderId}/review`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json(); // null when no review exists yet
}

export async function submitReview(
  orderId: number,
  body: { rating: number; comment: string; author_name?: string; author_role?: string; company?: string }
): Promise<{ ok: boolean; data?: Review; error?: string }> {
  const res = await fetch(`${API}/orders/${orderId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken(),
    },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg =
      data && typeof data === "object"
        ? (data.detail ?? Object.values(data).flat().join(" "))
        : "Failed to submit review.";
    return { ok: false, error: msg };
  }
  return { ok: true, data };
}

export async function getAnalytics(): Promise<AnalyticsData | null> {
  const res = await fetch(`${API}/analytics`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function postMessage(
  orderId: number,
  content: string
): Promise<{ ok: boolean; data?: OrderMessage; error?: string }> {
  const res = await fetch(`${API}/orders/${orderId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken(),
    },
    credentials: "same-origin",
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: "Failed to send message." };
  return { ok: true, data };
}
