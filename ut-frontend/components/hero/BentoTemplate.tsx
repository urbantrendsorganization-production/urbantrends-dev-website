type Discipline = { label: string; d: string };

// Line-icon path per discipline (24x24 viewBox, stroke).
const disciplines: Discipline[] = [
  { label: "Web apps", d: "M3 5h18v14H3zM3 9h18" },
  { label: "APIs", d: "M8 7l-4 5 4 5M16 7l4 5-4 5" },
  { label: "Mobile", d: "M7 3h10v18H7zM10 18h4" },
  { label: "Cloud & DevOps", d: "M7 18a4 4 0 010-8 5 5 0 019.6 1.5A3.5 3.5 0 0117 18z" },
  { label: "Data & AI", d: "M12 4c4 0 7 1.3 7 3s-3 3-7 3-7-1.3-7-3 3-3 7-3zM5 7v10c0 1.7 3 3 7 3s7-1.3 7-3V7" },
  { label: "Design systems", d: "M12 3l7 4v10l-7 4-7-4V7zM12 3v18M5 7l7 4 7-4" },
];

const stack = ["TypeScript", "Go", "Python", "Rust", "Postgres", "Kubernetes"];

export default function BentoTemplate() {
  return (
    <div className="art-diagram">
      <div className="bento">
        <div className="bento-card b-build">
          <span className="bento-k">What we build</span>
          <div className="build-grid">
            {disciplines.map((x, i) => (
              <div className="build-item" style={{ animationDelay: `${0.06 * i}s` }} key={x.label}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d={x.d} />
                </svg>
                <span>{x.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-card b-flow">
          <span className="bento-k">Architecture</span>
          <div className="flow-nodes">
            {["Client", "API", "Data"].map((n, i) => (
              <div className="flow-node" key={n}>
                <i style={{ animationDelay: `${0.5 * i}s` }} />
                <span>{n}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-card b-stack">
          <span className="bento-k">Stack</span>
          <div className="stack-row">
            {stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>

        <div className="bento-card b-mode">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#22D3EE" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12c0-2.2 1.8-4 4-4 3 0 4 8 7 8 2.2 0 4-1.8 4-4s-1.8-4-4-4c-3 0-4 8-7 8-2.2 0-4-1.8-4-4z" />
          </svg>
          <span className="mode-t">End-to-end</span>
          <span className="mode-s">strategy → ship</span>
        </div>
      </div>

      <style>{`
        .bento {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: minmax(72px, 1fr);
          gap: 12px;
          min-height: 342px;
        }
        .bento-card {
          position: relative; overflow: hidden;
          border: 1px solid var(--border); border-radius: 14px;
          background:
            radial-gradient(130% 130% at 88% -25%, var(--accent-soft), transparent 60%),
            var(--surface-1);
          padding: 16px;
          display: flex; flex-direction: column;
          transition: border-color .2s ease, transform .2s ease;
        }
        .bento-card:hover { border-color: color-mix(in srgb, #22D3EE 42%, var(--border)); transform: translateY(-2px); }
        .bento-k {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: .1em;
          text-transform: uppercase; color: var(--fg-subtle); margin-bottom: 12px;
        }

        .b-build { grid-column: span 2; grid-row: span 2; }
        .build-grid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-content: center; }
        .build-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border: 1px solid var(--border); border-radius: 9px;
          background: color-mix(in srgb, var(--surface-2) 40%, transparent);
          font-size: 13px; color: var(--fg); font-weight: 500;
          animation: bento-in .5s cubic-bezier(.2,.7,.3,1) backwards;
        }
        .build-item svg { color: #22D3EE; flex-shrink: 0; }

        .b-flow { grid-column: 3; grid-row: span 2; }
        .flow-nodes { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 6px; }
        .flow-node { display: flex; align-items: center; gap: 10px; position: relative; padding: 7px 0; }
        .flow-node:not(:last-child)::after {
          content: ""; position: absolute; left: 4px; top: 26px; height: 14px; width: 1.5px;
          background: color-mix(in srgb, #22D3EE 35%, transparent);
        }
        .flow-node i {
          width: 9px; height: 9px; border-radius: 50%; background: #22D3EE; flex-shrink: 0;
          box-shadow: 0 0 0 0 color-mix(in srgb, #22D3EE 55%, transparent);
          animation: flow-pulse 2.4s ease-out infinite;
        }
        .flow-node span { font-family: var(--font-mono); font-size: 12px; color: var(--fg-muted); }

        .b-stack { grid-column: span 2; }
        .stack-row { display: flex; flex-wrap: wrap; gap: 7px; align-content: center; flex: 1; }
        .stack-row span {
          font-family: var(--font-mono); font-size: 11.5px; color: var(--fg-muted);
          border: 1px solid var(--border); border-radius: 6px; padding: 3px 9px; background: var(--surface-1);
        }

        .b-mode { align-items: flex-start; justify-content: center; gap: 4px; }
        .b-mode svg { margin-bottom: 6px; }
        .mode-t { font-size: 15px; font-weight: 700; letter-spacing: -.01em; color: var(--fg); }
        .mode-s { font-family: var(--font-mono); font-size: 11px; color: var(--fg-subtle); }

        @keyframes bento-in { from { opacity: 0; transform: translateY(8px); } }
        @keyframes flow-pulse { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, #22D3EE 55%, transparent); } 70%,100% { box-shadow: 0 0 0 8px transparent; } }
        @media (prefers-reduced-motion: reduce) {
          .build-item { animation: none; } .flow-node i { animation: none; }
        }
      `}</style>
    </div>
  );
}
