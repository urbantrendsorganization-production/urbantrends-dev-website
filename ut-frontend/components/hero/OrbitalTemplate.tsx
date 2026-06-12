export default function OrbitalTemplate() {
  return (
    <div className="art-diagram">
      <div className="diagram-frame">
        <div className="df-head">
          <span className="mono-label">studio.architecture</span>
          <div className="dots"><i /><i /><i /></div>
        </div>
        <svg className="diagram-svg" viewBox="0 0 760 410" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Orbital diagram showing UrbanTrends studio at centre, delivering software to Startups, Scale-ups, Enterprises, Agencies, Developers, and Design teams.">
          <defs>
            <pattern id="dg" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1.2" cy="1.2" r="1.2" className="dot-grid-bg" />
            </pattern>
            <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity=".22" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hub-core" cx="40%" cy="38%" r="65%">
              <stop offset="0%" stopColor="var(--surface-3)" />
              <stop offset="100%" stopColor="var(--surface-1)" />
            </radialGradient>
            <radialGradient id="ng1" cx="35%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#a5f3fc" stopOpacity=".95" />
              <stop offset="100%" stopColor="#0e7490" stopOpacity=".9" />
            </radialGradient>
            <radialGradient id="ng2" cx="35%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#a7f3d0" stopOpacity=".95" />
              <stop offset="100%" stopColor="#047857" stopOpacity=".9" />
            </radialGradient>
            <radialGradient id="ng3" cx="35%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#ddd6fe" stopOpacity=".95" />
              <stop offset="100%" stopColor="#6d28d9" stopOpacity=".9" />
            </radialGradient>
            <radialGradient id="ng4" cx="35%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity=".95" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity=".9" />
            </radialGradient>
            <radialGradient id="ng5" cx="35%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#fed7aa" stopOpacity=".95" />
              <stop offset="100%" stopColor="#c2410c" stopOpacity=".9" />
            </radialGradient>
            <radialGradient id="ng6" cx="35%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#f5d0fe" stopOpacity=".95" />
              <stop offset="100%" stopColor="#a21caf" stopOpacity=".9" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="760" height="410" fill="url(#dg)" opacity=".45" />
          <circle cx="360" cy="200" r="82" fill="url(#hub-glow)" />
          <circle cx="360" cy="200" r="62" stroke="#22D3EE" strokeWidth=".7" strokeOpacity=".18" fill="none" />
          <ellipse cx="360" cy="200" rx="160" ry="112" className="orbit-ring" strokeWidth=".8" strokeDasharray="4 8" fill="none" />
          <path className="flow" d="M360,156 L360,113" />
          <path className="flow" d="M403,183 L477,153" />
          <path className="flow" d="M403,217 L477,247" />
          <path className="flow" d="M360,246 L360,288" />
          <path className="flow" d="M317,217 L243,247" />
          <path className="flow" d="M317,183 L243,153" />
          <path className="flow-pulse" style={{ animationDelay: "0s" }}   d="M360,156 L360,113" />
          <path className="flow-pulse" style={{ animationDelay: ".4s" }}  d="M403,183 L477,153" />
          <path className="flow-pulse" style={{ animationDelay: ".8s" }}  d="M403,217 L477,247" />
          <path className="flow-pulse" style={{ animationDelay: "1.2s" }} d="M360,246 L360,288" />
          <path className="flow-pulse" style={{ animationDelay: "1.6s" }} d="M317,217 L243,247" />
          <path className="flow-pulse" style={{ animationDelay: "2.0s" }} d="M317,183 L243,153" />
          {/* Hub */}
          <circle cx="360" cy="200" r="44" fill="url(#hub-core)" stroke="#22D3EE" strokeWidth="1.4" strokeOpacity=".45" />
          {/* 4-bar chart mark */}
          <rect x="341" y="196" width="5" height="12" rx="1" fill="#22D3EE" fillOpacity=".4" />
          <rect x="349" y="190" width="5" height="18" rx="1" fill="#22D3EE" fillOpacity=".7" />
          <rect x="357" y="183" width="5" height="25" rx="1" fill="#22D3EE" />
          <rect x="365" y="193" width="5" height="15" rx="1" fill="#22D3EE" fillOpacity=".45" />
          <text x="360" y="220" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".1em" className="hub-label">URBANTRENDS</text>
          {/* Satellites */}
          <circle cx="360" cy="88" r="22" fill="url(#ng1)" />
          <circle cx="352" cy="80" r="6" fill="white" fillOpacity=".22" />
          <text x="360" y="57" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" letterSpacing=".04em" className="sat-n1">Startups</text>
          <text x="360" y="44" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".06em" className="sat-sub">Products</text>
          <circle cx="499" cy="144" r="22" fill="url(#ng2)" />
          <circle cx="491" cy="136" r="6" fill="white" fillOpacity=".22" />
          <text x="536" y="141" textAnchor="start" fontFamily="var(--font-mono)" fontSize="11" letterSpacing=".04em" className="sat-n2">Scale-ups</text>
          <text x="536" y="154" textAnchor="start" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".06em" className="sat-sub">Custom Software</text>
          <circle cx="499" cy="256" r="22" fill="url(#ng3)" />
          <circle cx="491" cy="248" r="6" fill="white" fillOpacity=".22" />
          <text x="536" y="253" textAnchor="start" fontFamily="var(--font-mono)" fontSize="11" letterSpacing=".04em" className="sat-n3">Enterprises</text>
          <text x="536" y="266" textAnchor="start" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".06em" className="sat-sub">{"API & Infrastructure"}</text>
          <circle cx="360" cy="312" r="22" fill="url(#ng4)" />
          <circle cx="352" cy="304" r="6" fill="white" fillOpacity=".22" />
          <text x="360" y="351" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" letterSpacing=".04em" className="sat-n4">Agencies</text>
          <text x="360" y="364" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".06em" className="sat-sub">Consulting</text>
          <circle cx="221" cy="256" r="22" fill="url(#ng5)" />
          <circle cx="213" cy="248" r="6" fill="white" fillOpacity=".22" />
          <text x="184" y="253" textAnchor="end" fontFamily="var(--font-mono)" fontSize="11" letterSpacing=".04em" className="sat-n5">Developers</text>
          <text x="184" y="266" textAnchor="end" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".06em" className="sat-sub">SDKs & Tools</text>
          <circle cx="221" cy="144" r="22" fill="url(#ng6)" />
          <circle cx="213" cy="136" r="6" fill="white" fillOpacity=".22" />
          <text x="184" y="141" textAnchor="end" fontFamily="var(--font-mono)" fontSize="11" letterSpacing=".04em" className="sat-n6">Design</text>
          <text x="184" y="154" textAnchor="end" fontFamily="var(--font-mono)" fontSize="8" letterSpacing=".06em" className="sat-sub">{"UX & Systems"}</text>
        </svg>
      </div>
    </div>
  );
}
