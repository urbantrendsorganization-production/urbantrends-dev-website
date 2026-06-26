import type { Project } from "@/lib/cms";

const EXTERNAL_ARROW = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="13" height="13">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

export default function ProjectCard({ project }: { project: Project }) {
  const accent = project.accent_color || "#22D3EE";

  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
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
          background: `linear-gradient(90deg, ${accent}80, transparent)`,
          zIndex: 1,
        }}
      />

      {/* Cover */}
      <div
        style={{
          aspectRatio: "16 / 10",
          background: `linear-gradient(135deg, ${accent}1a, var(--surface-2))`,
          borderBottom: "1px solid var(--border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {project.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover}
            alt={project.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: accent,
              opacity: 0.5,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 15l5-5 4 4 3-3 6 6" />
              <circle cx="8.5" cy="8.5" r="1.5" />
            </svg>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {project.category_label}
          </span>
          {(project.client || project.year) && (
            <span style={{ fontSize: 12, color: "var(--fg-subtle)", fontFamily: "var(--font-mono)" }}>
              {[project.client, project.year].filter(Boolean).join(" · ")}
            </span>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", margin: 0, letterSpacing: "-.01em" }}>
            {project.title}
          </h3>
          <p style={{ fontSize: 13.5, color: "var(--fg-muted)", margin: "6px 0 0", lineHeight: 1.5 }}>
            {project.summary}
          </p>
        </div>

        {project.result_metric && (
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--fg)",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0 }} />
            {project.result_metric}
          </div>
        )}

        {project.tags?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "2px 8px",
                  borderRadius: 5,
                  background: "var(--surface-2)",
                  color: "var(--fg-subtle)",
                  border: "1px solid var(--border)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ flex: 1 }} />

        {project.live_url && (
          <a
            href={project.live_url}
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
              paddingTop: 4,
            }}
          >
            Visit project {EXTERNAL_ARROW}
          </a>
        )}
      </div>
    </div>
  );
}
