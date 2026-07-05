"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getOrder, getInvoice, listMessages, postMessage, STATUS_LABELS, type Order, type OrderMessage, type Invoice } from "@/lib/services";
import { getSession } from "@/lib/auth";
import ReviewWidget from "./ReviewWidget";

const INVOICE_STATUS: Record<string, { label: string; color: string }> = {
  draft:     { label: "Being prepared",  color: "#6B7280" },
  sent:      { label: "Invoice sent",    color: "#F59E0B" },
  paid:      { label: "Paid",            color: "#34D399" },
  overdue:   { label: "Overdue",         color: "#EF4444" },
  cancelled: { label: "Cancelled",       color: "#6B7280" },
};

function InvoiceCard({ invoice }: { invoice: Invoice | null | undefined }) {
  if (invoice === undefined) return null;

  if (!invoice) {
    return (
      <div
        style={{
          borderRadius: 10,
          border: "1px dashed var(--border)",
          padding: "16px 20px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--fg-muted)" strokeWidth="1.8" width="16" height="16" style={{ flexShrink: 0 }}>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p style={{ fontSize: 13, color: "var(--fg-muted)", margin: 0 }}>
          Invoice pending — our team will issue one once your project is scoped.
        </p>
      </div>
    );
  }

  const s = INVOICE_STATUS[invoice.status] ?? { label: invoice.status, color: "#6B7280" };
  const subtotal = parseFloat(invoice.subtotal);
  const total = parseFloat(invoice.total);
  const taxAmt = total - subtotal;
  const taxRate = parseFloat(invoice.tax_rate);

  return (
    <div
      style={{
        borderRadius: 10,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "16px 20px",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--fg-muted)" strokeWidth="1.8" width="15" height="15">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--fg-muted)", margin: 0 }}>
            Invoice
          </p>
          <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>{invoice.invoice_number}</span>
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: s.color,
            background: `${s.color}18`,
            border: `1px solid ${s.color}30`,
            borderRadius: 4,
            padding: "2px 8px",
          }}
        >
          {s.label}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-muted)" }}>
          <span>Subtotal</span>
          <span>{invoice.currency} {subtotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span>
        </div>
        {taxRate > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-muted)" }}>
            <span>Tax ({taxRate}%)</span>
            <span>{invoice.currency} {taxAmt.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "var(--fg)",
            fontWeight: 600,
            fontSize: 15,
            borderTop: "1px solid var(--border)",
            paddingTop: 8,
            marginTop: 2,
          }}
        >
          <span>Total</span>
          <span>{invoice.currency} {total.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {invoice.due_date && (
        <p style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 10, marginBottom: 0 }}>
          Due {new Date(invoice.due_date).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      )}
      {invoice.notes && (
        <p style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 8, marginBottom: 0, lineHeight: 1.6 }}>
          {invoice.notes}
        </p>
      )}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  quoted: "#A78BFA",
  active: "#22D3EE",
  on_hold: "#FB923C",
  completed: "#34D399",
  cancelled: "#6B7280",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);

  const [order, setOrder] = useState<Order | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null | undefined>(undefined);
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      getOrder(orderId),
      listMessages(orderId),
      getSession(),
      getInvoice(orderId),
    ]).then(([o, msgs, session, inv]) => {
      setOrder(o);
      setMessages(msgs);
      setCurrentEmail(session.data?.user?.email ?? null);
      setInvoice(inv);
      setLoading(false);
    });
  }, [orderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await postMessage(orderId, content.trim());
      if (result.ok && result.data) {
        setMessages((prev) => [...prev, result.data!]);
        setContent("");
      } else {
        setError(result.error ?? "Failed to send.");
      }
    });
  }

  if (loading) return <p style={{ color: "var(--fg-muted)", fontSize: 14 }}>Loading order…</p>;
  if (!order) return (
    <div style={{ textAlign: "center", padding: "40px 24px" }}>
      <p style={{ color: "var(--fg-muted)", marginBottom: 12 }}>Order not found.</p>
      <Link className="btn btn-ghost" href="/portal/orders">Back to orders</Link>
    </div>
  );

  const statusColor = STATUS_COLORS[order.status] ?? "#6B7280";

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div className="breadcrumb" style={{ marginBottom: 12 }}>
          <Link href="/portal/orders">My Orders</Link>
          <span className="sep">/</span>
          <span>Order #{order.id}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 600, marginBottom: 4 }}>
              {order.service_name}
            </h1>
            <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>
              {order.plan_name ?? "Custom quote"} · Submitted {new Date(order.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: statusColor,
              background: `${statusColor}18`,
              border: `1px solid ${statusColor}30`,
              borderRadius: 6,
              padding: "5px 14px",
              whiteSpace: "nowrap",
              alignSelf: "flex-start",
            }}
          >
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
        </div>
      </div>

      {/* Brief */}
      <div
        style={{
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          padding: "16px 20px",
          marginBottom: 24,
        }}
      >
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--fg-muted)", marginBottom: 8 }}>
          Your brief
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--fg)", whiteSpace: "pre-wrap" }}>
          {order.requirements}
        </p>
      </div>

      {/* Invoice */}
      <InvoiceCard invoice={invoice} />

      {/* Review — only once the order is done */}
      {order.status === "completed" && <ReviewWidget orderId={order.id} />}

      {/* Thread */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--fg-muted)", marginBottom: 12 }}>
          Messages {messages.length > 0 && `(${messages.length})`}
        </p>

        {messages.length === 0 ? (
          <div
            style={{
              borderRadius: 10,
              border: "1px dashed var(--border)",
              padding: "28px 20px",
              textAlign: "center",
              color: "var(--fg-muted)",
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            No messages yet. The team will follow up shortly.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            {messages.map((msg) => {
              const isMe = msg.sender_email === currentEmail;
              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "75%",
                      borderRadius: isMe ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                      background: isMe ? "var(--accent)" : "var(--surface)",
                      border: isMe ? "none" : "1px solid var(--border)",
                      color: isMe ? "#fff" : "var(--fg)",
                      padding: "10px 14px",
                      fontSize: 14,
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </div>
                  <span style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 4 }}>
                    {msg.is_staff_sender ? "UrbanTrends team" : "You"} ·{" "}
                    {new Date(msg.created_at).toLocaleString("en-KE", { hour: "numeric", minute: "2-digit", day: "numeric", month: "short" })}
                  </span>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Reply form */}
      {order.status !== "completed" && order.status !== "cancelled" && (
        <form
          onSubmit={handleSend}
          style={{
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            overflow: "hidden",
          }}
        >
          <textarea
            placeholder="Write a message…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend(e as unknown as React.FormEvent);
            }}
            style={{
              width: "100%",
              border: "none",
              background: "transparent",
              color: "var(--fg)",
              fontSize: 14,
              padding: "14px 16px",
              fontFamily: "inherit",
              lineHeight: 1.6,
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderTop: "1px solid var(--border)",
            }}
          >
            {error ? (
              <span style={{ fontSize: 12, color: "var(--danger, #ef4444)" }}>{error}</span>
            ) : (
              <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>⌘↵ to send</span>
            )}
            <button
              className="btn btn-primary btn-sm"
              type="submit"
              disabled={pending || !content.trim()}
            >
              {pending ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
      )}

      {(order.status === "completed" || order.status === "cancelled") && (
        <p style={{ fontSize: 13, color: "var(--fg-muted)", textAlign: "center", padding: "12px 0" }}>
          This order is {order.status}. Messaging is closed.
        </p>
      )}
    </>
  );
}
