"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAnalytics, STATUS_LABELS, type AnalyticsData } from "@/lib/services";

const STATUS_COLORS: Record<string, string> = {
  pending:   "#F59E0B",
  quoted:    "#A78BFA",
  active:    "#22D3EE",
  on_hold:   "#FB923C",
  completed: "#34D399",
  cancelled: "#6B7280",
};

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      background: "var(--surface-1)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      padding: "20px 22px",
    }}>
      <p style={{ margin: 0, fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--fg-subtle)" }}>
        {label}
      </p>
      <p style={{ margin: "10px 0 0", fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--fg-muted)" }}>{sub}</p>
      )}
    </div>
  );
}

function HBar({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const pct = max > 0 ? Math.max(2, (count / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 120, fontSize: 13, color: "var(--fg-muted)", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div style={{ flex: 1, background: "var(--surface-3)", borderRadius: 4, height: 8, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 4, transition: "width .4s ease" }} />
      </div>
      <span style={{ width: 28, textAlign: "right", fontSize: 13, color: "var(--fg-muted)", flexShrink: 0 }}>
        {count}
      </span>
    </div>
  );
}

function MonthBar({ month, count, max }: { month: string; count: number; max: number }) {
  const pct = max > 0 ? Math.max(4, (count / max) * 100) : 4;
  const label = new Date(month + "-02").toLocaleDateString("en-KE", { month: "short" });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: 80 }}>
        <div style={{ background: "var(--accent)", borderRadius: "4px 4px 0 0", height: `${pct}%`, width: "100%", transition: "height .4s ease" }} />
      </div>
      <span style={{ fontSize: 11, color: "var(--fg-subtle)", fontFamily: "var(--font-mono)" }}>{label}</span>
      <span style={{ fontSize: 11, color: "var(--fg-muted)", fontWeight: 600 }}>{count}</span>
    </div>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    getAnalytics().then((d) => {
      if (d === null) {
        setDenied(true);
      } else {
        setData(d);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p style={{ color: "var(--fg-muted)", fontSize: 14 }}>Loading analytics…</p>;
  }

  if (denied || !data) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <p style={{ color: "var(--fg-muted)", marginBottom: 12 }}>Staff access required.</p>
        <Link className="btn btn-ghost" href="/portal/orders">Back to orders</Link>
      </div>
    );
  }

  const { kpis, by_status, by_service, by_month, recent_orders } = data;
  const maxStatus = Math.max(...by_status.map((s) => s.count), 1);
  const maxService = Math.max(...by_service.map((s) => s.count), 1);
  const maxMonth = Math.max(...by_month.map((m) => m.count), 1);

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>
          Analytics
        </h1>
        <p style={{ color: "var(--fg-muted)", fontSize: 13, marginTop: 4 }}>
          {new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
        <KpiCard label="Total Orders" value={kpis.total_orders} />
        <KpiCard label="In Progress" value={kpis.active} />
        <KpiCard label="Completed" value={kpis.completed} />
        <KpiCard label="Pending" value={kpis.pending} />
        <KpiCard label="Customers" value={kpis.total_customers} sub={`+${kpis.new_customers_30d} this month`} />
        <KpiCard label="Messages" value={kpis.total_messages} />
        {kpis.total_revenue > 0 && (
          <KpiCard label="Revenue" value={`KES ${kpis.total_revenue.toLocaleString()}`} sub="Completed orders" />
        )}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* By Status */}
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 22px" }}>
          <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Orders by status</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {by_status.map((s) => (
              <HBar key={s.status} label={s.label} count={s.count} max={maxStatus} color={STATUS_COLORS[s.status] ?? "#6B7280"} />
            ))}
          </div>
        </div>

        {/* Monthly trend */}
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 22px" }}>
          <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Orders per month</p>
          {by_month.length === 0 ? (
            <p style={{ color: "var(--fg-muted)", fontSize: 13 }}>No data yet.</p>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, paddingTop: 8 }}>
              {by_month.map((m) => (
                <MonthBar key={m.month} month={m.month} count={m.count} max={maxMonth} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top services */}
      <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 22px", marginBottom: 16 }}>
        <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Top services by orders</p>
        {by_service.length === 0 ? (
          <p style={{ color: "var(--fg-muted)", fontSize: 13 }}>No orders yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {by_service.map((s) => (
              <HBar key={s.name} label={s.name} count={s.count} max={maxService} color="var(--accent)" />
            ))}
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)" }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Recent orders</p>
        </div>
        {recent_orders.length === 0 ? (
          <p style={{ padding: "20px 22px", color: "var(--fg-muted)", fontSize: 13, margin: 0 }}>No orders yet.</p>
        ) : (
          <div>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 120px 100px", gap: 12, padding: "10px 22px", borderBottom: "1px solid var(--border)" }}>
              {["#", "Customer", "Service", "Status", "Date"].map((h) => (
                <span key={h} style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--fg-subtle)" }}>{h}</span>
              ))}
            </div>
            {recent_orders.map((o) => {
              const color = STATUS_COLORS[o.status] ?? "#6B7280";
              return (
                <Link
                  key={o.id}
                  href={`/portal/orders/${o.id}`}
                  style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 120px 100px", gap: 12, padding: "12px 22px", borderBottom: "1px solid var(--border)", textDecoration: "none", transition: "background .15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontSize: 13, color: "var(--fg-muted)" }}>#{o.id}</span>
                  <span style={{ fontSize: 13, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.customer}</span>
                  <span style={{ fontSize: 13, color: "var(--fg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.service}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 500,
                    color: color,
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                    borderRadius: 5,
                    padding: "2px 8px",
                    alignSelf: "center",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                  }}>
                    {STATUS_LABELS[o.status] ?? o.status}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>{o.created_at}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
