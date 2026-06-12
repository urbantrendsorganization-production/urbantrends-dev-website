export default function MinimalTemplate() {
  return (
    <div
      className="art-diagram"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(24px,4vw,48px)",
        gap: 0,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--fg-subtle)",
          marginBottom: 20,
        }}
      >
        studio / v4.2.0
      </p>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(48px,7vw,80px)",
          fontWeight: 700,
          lineHeight: 0.92,
          letterSpacing: "-0.04em",
          color: "var(--fg)",
          marginBottom: 28,
        }}
      >
        <span style={{ color: "#22D3EE" }}>_</span>Build
        <br />
        better
        <br />
        software.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 24px",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
        }}
      >
        {[
          ["STACK",   "TypeScript · Next.js"],
          ["SURFACE", "6 services · 1 studio"],
          ["UPTIME",  "99.96 %"],
          ["BASE",    "Nairobi, KE"],
          ["SINCE",   "2024"],
          ["STATUS",  "Shipping"],
        ].map(([k, v]) => (
          <div key={k}>
            <span style={{ color: "var(--fg-subtle)" }}>{k} </span>
            <span style={{ color: "var(--fg)" }}>{v}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 28,
          height: 1,
          background: "linear-gradient(90deg, #22D3EE40, transparent)",
        }}
      />
    </div>
  );
}
