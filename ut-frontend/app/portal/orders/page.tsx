"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listOrders, STATUS_LABELS, type Order } from "@/lib/services";

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  quoted: "#A78BFA",
  active: "#22D3EE",
  on_hold: "#FB923C",
  completed: "#34D399",
  cancelled: "#6B7280",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listOrders().then((data) => { setOrders(data); setLoading(false); });
  }, []);

  if (loading) {
    return <p style={{ color: "var(--fg-muted)", fontSize: 14 }}>Loading orders…</p>;
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 600 }}>My Orders</h1>
        <Link className="btn btn-primary btn-sm" href="/services">
          + New order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "clamp(40px,8vw,80px) 24px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--surface)",
          }}
        >
          <p style={{ color: "var(--fg-muted)", marginBottom: 16 }}>
            You haven&apos;t submitted any service orders yet.
          </p>
          <Link className="btn btn-primary" href="/services">
            Browse services
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((order) => {
            const color = STATUS_COLORS[order.status] ?? "#6B7280";
            return (
              <Link
                key={order.id}
                href={`/portal/orders/${order.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  textDecoration: "none",
                  transition: "border-color .15s",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontWeight: 600, fontSize: 15, color: "var(--fg)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {order.service_name}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--fg-muted)" }}>
                    {order.plan_name ?? "Custom quote"} · Order #{order.id}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color,
                      background: `${color}18`,
                      border: `1px solid ${color}30`,
                      borderRadius: 4,
                      padding: "3px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--fg-subtle, var(--fg-muted))" }}>
                    {new Date(order.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ color: "var(--fg-muted)" }}>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
