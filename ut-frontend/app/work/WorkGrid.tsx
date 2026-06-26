"use client";

import { useState } from "react";
import type { Project, ProjectCategory } from "@/lib/cms";
import ProjectCard from "@/components/ProjectCard";

const CATEGORIES: { value: ProjectCategory | "all"; label: string }[] = [
  { value: "all",         label: "All" },
  { value: "product",     label: "Product Builds" },
  { value: "web",         label: "Web Apps" },
  { value: "mobile",      label: "Mobile" },
  { value: "integration", label: "Integrations" },
  { value: "tooling",     label: "Tooling" },
  { value: "branding",    label: "Design" },
  { value: "other",       label: "Other" },
];

export default function WorkGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectCategory | "all">("all");

  const present = new Set<string>(projects.map((p) => p.category));
  const tabs = CATEGORIES.filter((c) => c.value === "all" || present.has(c.value));

  const filtered = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      {tabs.length > 2 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
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
                background: active === tab.value ? "rgba(34,211,238,.1)" : "transparent",
                color: active === tab.value ? "#22D3EE" : "var(--fg-muted)",
                cursor: "pointer",
                transition: "all .14s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

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
          <p style={{ fontSize: 14, margin: 0 }}>No projects in this category yet.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: 22,
          }}
        >
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </>
  );
}
