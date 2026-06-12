"use client";

import { useState } from "react";
import Link from "next/link";
import type { Tool, ToolCategory } from "@/lib/cms";

const CATEGORIES: { value: ToolCategory | "all"; label: string }[] = [
  { value: "all",       label: "All" },
  { value: "mpesa",     label: "M-Pesa" },
  { value: "developer", label: "Developer" },
  { value: "finance",   label: "Finance" },
  { value: "utilities", label: "Utilities" },
  { value: "data",      label: "Data" },
  { value: "other",     label: "Other" },
];

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  mpesa:     "M-Pesa",
  developer: "Developer",
  finance:   "Finance",
  utilities: "Utilities",
  data:      "Data",
  other:     "Other",
};

function ToolIcon({ svg, accent }: { svg: string; accent: string }) {
  return (
    <span
      className="tool-icon"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        borderRadius: 10,
        background: `${accent}18`,
        border: `1px solid ${accent}30`,
        color: accent,
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        width="20"
        height="20"
      >
        {svg ? (
          <g dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <path d="M7 8l4 4-4 4M13 16h4M3 4h18v16H3" />
        )}
      </svg>
    </span>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const accent = tool.accent_color || "#22D3EE";
  const dimmed = tool.is_coming_soon;

  return (
    <div
      className="tool-card"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        opacity: dimmed ? 0.6 : 1,
        transition: "border-color .15s, box-shadow .15s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent line */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${accent}60, transparent)`,
          borderRadius: "12px 12px 0 0",
        }}
      />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <ToolIcon svg={tool.icon_svg} accent={accent} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {tool.is_free && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 7px",
                borderRadius: 5,
                background: "rgba(52,211,153,.12)",
                color: "#34D399",
                border: "1px solid rgba(52,211,153,.2)",
                whiteSpace: "nowrap",
              }}
            >
              Free
            </span>
          )}
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: "2px 7px",
              borderRadius: 5,
              background: "var(--surface-2)",
              color: "var(--fg-subtle)",
              border: "1px solid var(--border)",
              whiteSpace: "nowrap",
            }}
          >
            {CATEGORY_LABELS[tool.category] ?? tool.category}
          </span>
        </div>
      </div>

      {/* Name + tagline */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", margin: 0, letterSpacing: "-.01em" }}>
          {tool.name}
        </h3>
        <p style={{ fontSize: 13.5, color: "var(--fg-muted)", margin: "5px 0 0", lineHeight: 1.5 }}>
          {tool.tagline}
        </p>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* CTA */}
      {tool.is_coming_soon || !tool.cta_url ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 500,
            color: "var(--fg-subtle)",
            padding: "8px 0",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
          </svg>
          Coming soon
        </span>
      ) : tool.cta_url.startsWith("http") ? (
        <a
          href={tool.cta_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: accent,
            textDecoration: "none",
            padding: "8px 0",
          }}
        >
          {tool.cta_label || "Open tool"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="13" height="13">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
      ) : (
        <Link
          href={tool.cta_url}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: accent,
            textDecoration: "none",
            padding: "8px 0",
          }}
        >
          {tool.cta_label || "Open tool"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="13" height="13">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      )}
    </div>
  );
}

export default function ToolsGrid({ tools }: { tools: Tool[] }) {
  const [active, setActive] = useState<ToolCategory | "all">("all");

  const visibleCategories = new Set<string>(tools.map((t) => t.category));
  const tabs = CATEGORIES.filter((c) => c.value === "all" || visibleCategories.has(c.value));

  const filtered = active === "all" ? tools : tools.filter((t) => t.category === active);

  return (
    <>
      {/* Category filter */}
      {tabs.length > 2 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 32,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActive(tab.value)}
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: "6px 14px",
                borderRadius: 20,
                border: active === tab.value
                  ? "1px solid rgba(34,211,238,.4)"
                  : "1px solid var(--border)",
                background: active === tab.value
                  ? "rgba(34,211,238,.1)"
                  : "transparent",
                color: active === tab.value
                  ? "#22D3EE"
                  : "var(--fg-muted)",
                cursor: "pointer",
                transition: "all .14s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            border: "1px dashed var(--border)",
            borderRadius: 12,
            padding: "56px 24px",
            textAlign: "center",
            color: "var(--fg-muted)",
          }}
        >
          <p style={{ fontSize: 14, margin: 0 }}>No tools in this category yet.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </>
  );
}
