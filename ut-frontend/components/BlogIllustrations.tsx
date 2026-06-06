export function IllustrationMpesaWeekends() {
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="400" height="220" fill="var(--surface-2)" />
      {[0,1,2,3,4].map(i => (
        <line key={i} x1="40" y1={40 + i*36} x2="370" y2={40 + i*36} stroke="var(--grid-line)" strokeWidth="1" />
      ))}
      {[60,100,140,180].map((x, i) => (
        <g key={i}>
          <rect x={x} y={60 + (i%3)*10} width="24" height={100 - (i%3)*10} rx="3" fill="#34D399" fillOpacity=".85" />
        </g>
      ))}
      <rect x="220" y="100" width="24" height="60" rx="3" fill="#EF4444" fillOpacity=".5" />
      <text x="232" y="172" textAnchor="middle" fill="#EF4444" fontSize="9" fontFamily="monospace">Sat</text>
      <rect x="260" y="50" width="24" height="110" rx="3" fill="#34D399" />
      <text x="272" y="172" textAnchor="middle" fill="#34D399" fontSize="9" fontFamily="monospace">Sat</text>
      <text x="272" y="44" textAnchor="middle" fill="#34D399" fontSize="11">✓</text>
      <path d="M 244 100 L 258 100" stroke="#34D399" strokeWidth="1.5" markerEnd="url(#arrowG)" />
      <defs>
        <marker id="arrowG" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#34D399" />
        </marker>
      </defs>
      <rect x="300" y="60" width="60" height="20" rx="4" fill="#34D399" fillOpacity=".15" />
      <text x="330" y="74" textAnchor="middle" fill="#34D399" fontSize="9" fontFamily="monospace">real-time</text>
      <rect x="140" y="8" width="120" height="22" rx="11" fill="#34D399" fillOpacity=".12" />
      <text x="200" y="23" textAnchor="middle" fill="#34D399" fontSize="10" fontFamily="monospace">M-Pesa callback → 38ms</text>
      <line x1="40" y1="160" x2="370" y2="160" stroke="var(--border)" strokeWidth="1.5" />
      <text x="200" y="210" textAnchor="middle" fill="#34D399" fontSize="10" fontFamily="monospace">reconciliation · all 7 days</text>
    </svg>
  );
}

export function IllustrationStkCallbacks() {
  const states = [
    { label: "INITIATED", x: 40, y: 90, color: "#22D3EE" },
    { label: "PENDING", x: 140, y: 40, color: "#22D3EE" },
    { label: "SUCCESS", x: 260, y: 40, color: "#34D399" },
    { label: "FAILED", x: 260, y: 140, color: "#EF4444" },
    { label: "TIMEOUT", x: 140, y: 140, color: "#FB923C" },
    { label: "CANCELLED", x: 140, y: 190, color: "#A78BFA" },
  ];
  return (
    <svg viewBox="0 0 400 230" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="400" height="230" fill="var(--surface-2)" />
      <text x="200" y="22" textAnchor="middle" fill="#22D3EE" fontSize="11" fontFamily="monospace" opacity=".6">STK Push · callback states</text>
      <line x1="95" y1="100" x2="140" y2="60" stroke="#22D3EE" strokeWidth="1" strokeDasharray="4 2" opacity=".4" />
      <line x1="95" y1="100" x2="140" y2="150" stroke="#FB923C" strokeWidth="1" strokeDasharray="4 2" opacity=".4" />
      <line x1="185" y1="50" x2="260" y2="50" stroke="#34D399" strokeWidth="1.5" opacity=".6" />
      <line x1="185" y1="150" x2="260" y2="150" stroke="#EF4444" strokeWidth="1" strokeDasharray="4 2" opacity=".4" />
      <line x1="140" y1="170" x2="140" y2="185" stroke="#A78BFA" strokeWidth="1" strokeDasharray="4 2" opacity=".4" />
      {states.map((s, i) => (
        <g key={i}>
          <rect x={s.x - 5} y={s.y - 12} width="82" height="22" rx="5" fill={s.color} fillOpacity=".1" stroke={s.color} strokeOpacity=".35" strokeWidth="1" />
          <text x={s.x + 36} y={s.y + 3} textAnchor="middle" fill={s.color} fontSize="9" fontFamily="monospace">{s.label}</text>
        </g>
      ))}
      <text x="200" y="215" textAnchor="middle" fill="#22D3EE" fontSize="10" fontFamily="monospace" opacity=".5">6 states · all documented</text>
    </svg>
  );
}

export function IllustrationPerUnitPricing() {
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="400" height="220" fill="var(--surface-2)" />
      <text x="100" y="30" textAnchor="middle" fill="#EF4444" fontSize="11" fontFamily="monospace" opacity=".8">seat-based</text>
      {[0,1,2,3].map(i => (
        <rect key={i} x={60 + i*26} y={80} width="20" height={80 + i*10} rx="3" fill="#EF4444" fillOpacity={0.3 + i*0.1} />
      ))}
      <text x="100" y="188" textAnchor="middle" fill="#EF4444" fontSize="9" fontFamily="monospace">punishes growth</text>
      <line x1="200" y1="20" x2="200" y2="200" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 3" />
      <text x="300" y="30" textAnchor="middle" fill="#34D399" fontSize="11" fontFamily="monospace" opacity=".8">per unit</text>
      {[0,1,2,3,4,5].map(i => (
        <g key={i}>
          <rect x={220 + i*26} y={120 - i*4} width="20" height={60 + i*4} rx="3" fill="#34D399" fillOpacity={0.55 + i*0.06} />
          <text x={230 + i*26} y={118 - i*4} textAnchor="middle" fill="#34D399" fontSize="7">▲</text>
        </g>
      ))}
      <text x="300" y="188" textAnchor="middle" fill="#34D399" fontSize="9" fontFamily="monospace">scales with value</text>
      <rect x="160" y="90" width="80" height="22" rx="11" fill="#34D399" fillOpacity=".1" />
      <text x="200" y="105" textAnchor="middle" fill="#34D399" fontSize="10" fontFamily="monospace">KES 60/unit</text>
      <text x="200" y="210" textAnchor="middle" fill="#34D399" fontSize="10" fontFamily="monospace" opacity=".5">RentFlow pricing model</text>
    </svg>
  );
}

export function IllustrationEtims() {
  const steps = [
    { label: "Invoice", color: "#FB923C" },
    { label: "eTIMS API", color: "#FB923C" },
    { label: "KRA PIN", color: "#FB923C" },
    { label: "Receipt", color: "#34D399" },
  ];
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="400" height="220" fill="var(--surface-2)" />
      <text x="200" y="28" textAnchor="middle" fill="#FB923C" fontSize="11" fontFamily="monospace" opacity=".7">eTIMS integration flow</text>
      {steps.map((s, i) => (
        <g key={i}>
          <rect x={20 + i*90} y={80} width="80" height="48" rx="6" fill={s.color} fillOpacity=".1" stroke={s.color} strokeOpacity=".3" strokeWidth="1" />
          <text x={60 + i*90} y={108} textAnchor="middle" fill={s.color} fontSize="10" fontFamily="monospace">{s.label}</text>
          <text x={60 + i*90} y={64} textAnchor="middle" fill={s.color} fontSize="18" opacity=".5">
            {["📄","⚡","🔑","✓"][i]}
          </text>
          {i < 3 && (
            <line x1={100 + i*90} y1={104} x2={110 + i*90} y2={104} stroke={s.color} strokeWidth="1.5" opacity=".5" />
          )}
        </g>
      ))}
      <text x="200" y="155" textAnchor="middle" fill="#FB923C" fontSize="9" fontFamily="monospace" opacity=".6">VSCU · OSCU · TIMs device</text>
      <rect x="100" y="168" width="200" height="20" rx="4" fill="#FB923C" fillOpacity=".08" />
      <text x="200" y="182" textAnchor="middle" fill="#FB923C" fontSize="9" fontFamily="monospace">zero KRA compliance errors in prod</text>
      <text x="200" y="210" textAnchor="middle" fill="#FB923C" fontSize="10" fontFamily="monospace" opacity=".5">Kenya Revenue Authority · eTIMS</text>
    </svg>
  );
}

export function IllustrationTwoSidedMarket() {
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="400" height="220" fill="var(--surface-2)" />
      <rect x="20" y="40" width="130" height="140" rx="8" fill="#A78BFA" fillOpacity=".07" stroke="#A78BFA" strokeOpacity=".2" strokeWidth="1" />
      <text x="85" y="62" textAnchor="middle" fill="#A78BFA" fontSize="10" fontFamily="monospace">Students</text>
      {["Amina W. · React","Kevin O. · TS","Brenda M. · Vue"].map((n, i) => (
        <g key={i}>
          <circle cx="42" cy={86 + i*30} r="10" fill="#A78BFA" fillOpacity=".2" />
          <text x="42" y={90 + i*30} textAnchor="middle" fill="#A78BFA" fontSize="8">{n[0]}</text>
          <text x="92" y={90 + i*30} textAnchor="middle" fill="#A78BFA" fontSize="8" opacity=".8">{n}</text>
        </g>
      ))}
      {[0,1,2].map(i => (
        <line key={i} x1="150" y1={96 + i*30} x2="250" y2={96 + (i === 1 ? 30 : i === 0 ? 30 : 0)} stroke="#A78BFA" strokeWidth="1" strokeDasharray="4 2" opacity=".4" />
      ))}
      <rect x="165" y="96" width="70" height="60" rx="5" fill="#A78BFA" fillOpacity=".06" />
      <text x="200" y="118" textAnchor="middle" fill="#A78BFA" fontSize="9" fontFamily="monospace">PortfolioU</text>
      <text x="200" y="132" textAnchor="middle" fill="#A78BFA" fontSize="8" opacity=".6">verified</text>
      <text x="200" y="146" textAnchor="middle" fill="#34D399" fontSize="10">match</text>
      <rect x="250" y="40" width="130" height="140" rx="8" fill="#A78BFA" fillOpacity=".07" stroke="#A78BFA" strokeOpacity=".2" strokeWidth="1" />
      <text x="315" y="62" textAnchor="middle" fill="#A78BFA" fontSize="10" fontFamily="monospace">Employers</text>
      {["Savanna Pay","Mara Bank","Jambo Cloud"].map((n, i) => (
        <g key={i}>
          <rect x="260" y={76 + i*30} width="110" height="20" rx="4" fill="#A78BFA" fillOpacity=".12" />
          <text x="315" y={90 + i*30} textAnchor="middle" fill="#A78BFA" fontSize="8">{n}</text>
        </g>
      ))}
      <text x="200" y="210" textAnchor="middle" fill="#A78BFA" fontSize="10" fontFamily="monospace" opacity=".5">18K+ student portfolios · 640 employers</text>
    </svg>
  );
}

export function IllustrationWebhookRetry() {
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="400" height="220" fill="var(--surface-2)" />
      <text x="200" y="24" textAnchor="middle" fill="#22D3EE" fontSize="11" fontFamily="monospace" opacity=".7">webhook retry · idempotency</text>
      <line x1="30" y1="110" x2="370" y2="110" stroke="var(--border)" strokeWidth="2" />
      {[
        { x: 60, label: "POST /cb", status: "✓", color: "#34D399" },
        { x: 140, label: "retry ×1", status: "✓", color: "#34D399" },
        { x: 220, label: "retry ×2", status: "✓", color: "#34D399" },
        { x: 300, label: "retry ×3", status: "✓", color: "#34D399" },
      ].map((a, i) => (
        <g key={i}>
          <line x1={a.x} y1="110" x2={a.x} y2="70" stroke={a.color} strokeWidth="1.5" opacity=".6" />
          <circle cx={a.x} cy="110" r="5" fill={a.color} fillOpacity=".25" stroke={a.color} strokeWidth="1.5" />
          <text x={a.x} y="62" textAnchor="middle" fill={a.color} fontSize="9" fontFamily="monospace">{a.label}</text>
          <text x={a.x} y="48" textAnchor="middle" fill={a.color} fontSize="12">{a.status}</text>
        </g>
      ))}
      <rect x="80" y="128" width="240" height="26" rx="5" fill="#22D3EE" fillOpacity=".08" stroke="#22D3EE" strokeOpacity=".2" strokeWidth="1" />
      <text x="200" y="145" textAnchor="middle" fill="#22D3EE" fontSize="9" fontFamily="monospace">idempotencyKey: tx.receipt → no duplicates</text>
      <text x="200" y="172" textAnchor="middle" fill="#34D399" fontSize="9" fontFamily="monospace" opacity=".7">applied once · safe to replay</text>
      <text x="200" y="210" textAnchor="middle" fill="#22D3EE" fontSize="10" fontFamily="monospace" opacity=".5">duplicate callbacks are just Tuesday</text>
    </svg>
  );
}

export function IllustrationHiringNairobi() {
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="400" height="220" fill="var(--surface-2)" />
      <rect x="20" y="30" width="240" height="160" rx="8" fill="var(--surface-3)" stroke="var(--border)" strokeWidth="1" />
      <rect x="20" y="30" width="240" height="26" rx="8" fill="var(--surface-3)" />
      <rect x="20" y="48" width="240" height="8" rx="0" fill="var(--surface-3)" />
      <circle cx="40" cy="43" r="4" fill="#EF4444" fillOpacity=".6" />
      <circle cx="55" cy="43" r="4" fill="#FB923C" fillOpacity=".6" />
      <circle cx="70" cy="43" r="4" fill="#34D399" fillOpacity=".6" />
      <text x="145" y="47" textAnchor="middle" fill="#60A5FA" fontSize="8" fontFamily="monospace">interview.ts · UrbanTrends</text>
      {[
        { y: 76, text: "// No whiteboard puzzles", color: "var(--fg-subtle)" },
        { y: 92, text: "const trial = await", color: "#60A5FA" },
        { y: 108, text: "  workTrial.run({", color: "var(--fg)" },
        { y: 124, text: "    problem: 'real',", color: "#34D399" },
        { y: 140, text: "    paid: true,", color: "#34D399" },
        { y: 156, text: "  });", color: "var(--fg)" },
        { y: 172, text: "// → offer", color: "#34D399" },
      ].map((l, i) => (
        <text key={i} x="36" y={l.y} fill={l.color} fontSize="9" fontFamily="monospace" opacity=".9">{l.text}</text>
      ))}
      <text x="300" y="30" textAnchor="middle" fill="#60A5FA" fontSize="10" fontFamily="monospace" opacity=".7">the team</text>
      {["BO","WK","DM","AH","JN","SK"].map((init, i) => (
        <g key={i}>
          <circle cx={280 + (i%2)*60} cy={55 + Math.floor(i/2)*52} r="20" fill="#60A5FA" fillOpacity=".12" stroke="#60A5FA" strokeOpacity=".25" strokeWidth="1" />
          <text x={280 + (i%2)*60} y={60 + Math.floor(i/2)*52} textAnchor="middle" fill="#60A5FA" fontSize="10" fontFamily="monospace">{init}</text>
        </g>
      ))}
      <text x="200" y="210" textAnchor="middle" fill="#60A5FA" fontSize="10" fontFamily="monospace" opacity=".5">senior peers · Nairobi · on-site</text>
    </svg>
  );
}
