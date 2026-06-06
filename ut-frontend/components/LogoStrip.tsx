const LOGOS = [
  {
    name: "Savanna Pay",
    mark: (
      <>
        <rect x="2" y="9" width="4" height="9" rx="1.2" />
        <rect x="8" y="5" width="4" height="13" rx="1.2" />
        <rect x="14" y="11" width="4" height="7" rx="1.2" />
      </>
    ),
  },
  {
    name: "Mara Bank",
    mark: (
      <>
        <path d="M3 18V7l7-4 7 4v11" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M3 18h14" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
  {
    name: "Zuri SACCO",
    mark: (
      <>
        <circle cx="10" cy="10.5" r="7.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M7 10.5l2.2 2.2L14 8" fill="none" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
  {
    name: "Tuura",
    mark: (
      <>
        <path d="M10 2l8 4.5v9L10 20l-8-4.5v-9z" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="10" cy="10.7" r="3" />
      </>
    ),
  },
  {
    name: "Pesabase",
    mark: (
      <>
        <rect x="2.5" y="3" width="15" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M6.5 10.5h7M10 7v7" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
  {
    name: "Acacia Labs",
    mark: (
      <>
        <path
          d="M10 2v16M10 7l5-3M10 11l-5-3M10 7L5 4M10 11l5-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </>
    ),
  },
  {
    name: "Jambo Cloud",
    mark: (
      <path
        d="M6 16h9a4 4 0 0 0 .4-7.98A6 6 0 0 0 4 9.5 3.5 3.5 0 0 0 6 16z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    ),
  },
  {
    name: "Nuru Health",
    mark: (
      <>
        <circle cx="10" cy="10.5" r="7.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M10 6.5v8M6 10.5h8" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
];

interface LogoStripProps {
  label?: string;
}

export default function LogoStrip({
  label = "Trusted by operators across East Africa",
}: LogoStripProps) {
  return (
    <div className="logostrip">
      <div className="wrap logostrip-inner">
        <span className="lab">{label}</span>
        <div className="logostrip-marks">
          {LOGOS.map((logo) => (
            <span key={logo.name} className="logostrip-item" title={logo.name}>
              <svg
                className="ls-mark"
                viewBox="0 0 20 21"
                fill="currentColor"
                aria-hidden="true"
              >
                {logo.mark}
              </svg>
              <span className="ls-name">{logo.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
