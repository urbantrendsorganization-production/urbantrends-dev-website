const layers = [
  { k: "PRODUCT", v: ["Web apps", "Mobile", "Dashboards"] },
  { k: "SERVICES", v: ["APIs", "Auth", "Realtime", "Jobs"] },
  { k: "DATA", v: ["Postgres", "Search", "Analytics", "AI"] },
  { k: "PLATFORM", v: ["Cloud", "CI/CD", "Observability"] },
];

export default function AuroraTemplate() {
  return (
    <div className="art-diagram">
      <div className="stack-frame">
        <div className="stack-head">
          <span className="mono-label">system / overview</span>
          <span className="stack-tag">full-stack</span>
        </div>

        <div className="stack-layers">
          <span className="stack-pulse" aria-hidden="true" />
          {layers.map((l, i) => (
            <div className="stack-layer" style={{ animationDelay: `${0.08 * i}s` }} key={l.k}>
              <span className="sl-name">{l.k}</span>
              <div className="sl-chips">
                {l.v.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stack-frame {
          position: relative; overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 14px;
          background:
            radial-gradient(120% 90% at 90% -10%, var(--accent-soft), transparent 55%),
            var(--surface-1);
          padding: 18px;
          box-shadow: var(--shadow-float);
        }
        .stack-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 2px 2px 16px;
        }
        .stack-tag {
          font-family: var(--font-mono); font-size: 10px; font-weight: 600;
          letter-spacing: .06em; color: #22D3EE;
          border: 1px solid color-mix(in srgb, #22D3EE 28%, transparent);
          background: color-mix(in srgb, #22D3EE 10%, transparent);
          border-radius: 20px; padding: 3px 10px;
        }

        .stack-layers { position: relative; padding-left: 24px; }
        .stack-layers::before {
          content: ""; position: absolute; left: 5px; top: 16px; bottom: 16px; width: 2px;
          background: linear-gradient(180deg, color-mix(in srgb, #22D3EE 40%, transparent), var(--border));
        }
        .stack-pulse {
          position: absolute; left: 1px; width: 10px; height: 10px; border-radius: 50%;
          background: #22D3EE; box-shadow: 0 0 10px 1px color-mix(in srgb, #22D3EE 70%, transparent);
          animation: stack-rail 4.5s cubic-bezier(.6,0,.4,1) infinite;
        }

        .stack-layer {
          position: relative;
          display: flex; flex-direction: column; gap: 9px;
          padding: 12px 14px; margin-bottom: 10px;
          border: 1px solid var(--border); border-radius: 10px;
          background: color-mix(in srgb, var(--surface-2) 45%, transparent);
          animation: stack-in .6s cubic-bezier(.2,.7,.3,1) backwards;
          transition: border-color .2s ease, transform .2s ease;
        }
        .stack-layer:last-child { margin-bottom: 0; }
        .stack-layer::before {
          content: ""; position: absolute; left: -24px; top: 15px;
          width: 10px; height: 10px; border-radius: 3px;
          background: var(--surface-1); border: 2px solid #22D3EE;
        }
        .stack-layer:hover { border-color: color-mix(in srgb, #22D3EE 45%, var(--border)); transform: translateX(2px); }

        .sl-name { font-family: var(--font-mono); font-size: 10px; font-weight: 700;
          letter-spacing: .16em; color: #22D3EE; }
        .sl-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .sl-chips span {
          font-family: var(--font-mono); font-size: 11.5px; color: var(--fg-muted);
          border: 1px solid var(--border); border-radius: 6px; padding: 3px 9px;
          background: var(--surface-1);
        }

        @keyframes stack-in { from { opacity: 0; transform: translateY(10px); } }
        @keyframes stack-rail {
          0% { top: 0; opacity: 0; } 12% { opacity: 1; }
          88% { opacity: 1; } 100% { top: calc(100% - 10px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .stack-layer { animation: none; } .stack-pulse { display: none; }
        }
      `}</style>
    </div>
  );
}
