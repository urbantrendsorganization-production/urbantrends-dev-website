export default function GridTemplate() {
  const cols = 9;
  const rows = 6;
  const cx = Math.floor(cols / 2);
  const cy = Math.floor(rows / 2);
  const spacing = 52;
  const w = cols * spacing;
  const h = rows * spacing;

  // Animated packet paths along cardinal axes from center
  const packetPaths = [
    `M${cx * spacing},${cy * spacing} L${cx * spacing},0`,
    `M${cx * spacing},${cy * spacing} L${w},${cy * spacing}`,
    `M${cx * spacing},${cy * spacing} L${cx * spacing},${h}`,
    `M${cx * spacing},${cy * spacing} L0,${cy * spacing}`,
  ];
  const delays = ["0s", "0.6s", "1.2s", "1.8s"];

  return (
    <div className="art-diagram" style={{ alignItems: "center", justifyContent: "center" }}>
      <div className="diagram-frame" style={{ overflow: "hidden" }}>
        <div className="df-head">
          <span className="mono-label">live.network</span>
          <div className="dots"><i /><i /><i /></div>
        </div>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          width="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", maxHeight: 320 }}
          aria-label="Live network topology diagram"
        >
          <defs>
            <radialGradient id="grid-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity=".35" />
              <stop offset="60%" stopColor="#22D3EE" stopOpacity=".06" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity=".6" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background glow */}
          <ellipse
            cx={cx * spacing}
            cy={cy * spacing}
            rx={spacing * 2.4}
            ry={spacing * 2.0}
            fill="url(#grid-glow)"
          />

          {/* Grid lines */}
          {Array.from({ length: cols + 1 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * spacing} y1={0}
              x2={i * spacing} y2={h}
              stroke="#22D3EE"
              strokeOpacity={i === cx ? 0.4 : 0.09}
              strokeWidth={i === cx ? 1.5 : 0.8}
            />
          ))}
          {Array.from({ length: rows + 1 }, (_, i) => (
            <line
              key={`h${i}`}
              x1={0} y1={i * spacing}
              x2={w} y2={i * spacing}
              stroke="#22D3EE"
              strokeOpacity={i === cy ? 0.4 : 0.09}
              strokeWidth={i === cy ? 1.5 : 0.8}
            />
          ))}

          {/* Data packet pulses along axes */}
          {packetPaths.map((d, i) => (
            <path
              key={`pk${i}`}
              d={d}
              stroke="#22D3EE"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="5 180"
              style={{
                animation: `grid-dash 2.8s linear ${delays[i]} infinite`,
              }}
            />
          ))}

          {/* Nodes */}
          {Array.from({ length: cols + 1 }, (_, col) =>
            Array.from({ length: rows + 1 }, (_, row) => {
              const distX = Math.abs(col - cx);
              const distY = Math.abs(row - cy);
              const dist = Math.sqrt(distX * distX + distY * distY);
              const isCenter = col === cx && row === cy;
              const r = isCenter ? 8 : dist < 1.5 ? 4.5 : dist < 2.5 ? 3 : 2;
              const opacity = isCenter ? 1 : Math.max(0.12, 1 - dist * 0.24);
              return (
                <circle
                  key={`n${col}-${row}`}
                  cx={col * spacing}
                  cy={row * spacing}
                  r={r}
                  fill="#22D3EE"
                  fillOpacity={opacity}
                />
              );
            })
          )}

          {/* Center ring */}
          <circle
            cx={cx * spacing}
            cy={cy * spacing}
            r={spacing * 0.9}
            stroke="#22D3EE"
            strokeWidth="1"
            strokeOpacity=".3"
            strokeDasharray="6 10"
            fill="none"
            style={{
              transformOrigin: `${cx * spacing}px ${cy * spacing}px`,
              animation: "spin 22s linear infinite",
            }}
          />

          {/* 4-bar chart mark at center */}
          <rect x={cx * spacing - 14} y={cy * spacing - 10} width="5" height="10" rx="1" fill="#22D3EE" fillOpacity=".38" />
          <rect x={cx * spacing - 7}  y={cy * spacing - 15} width="5" height="15" rx="1" fill="#22D3EE" fillOpacity=".65" />
          <rect x={cx * spacing}      y={cy * spacing - 21} width="5" height="21" rx="1" fill="#22D3EE" />
          <rect x={cx * spacing + 7}  y={cy * spacing - 13} width="5" height="13" rx="1" fill="#22D3EE" fillOpacity=".42" />
        </svg>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes grid-dash { to { stroke-dashoffset: -240 } }
      `}</style>
    </div>
  );
}
