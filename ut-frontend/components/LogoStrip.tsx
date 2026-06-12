import type { Partner } from "@/lib/cms";

const FALLBACK_LOGOS = [
  "Savanna Pay",
  "Mara Bank",
  "Zuri SACCO",
  "Tuura",
  "Pesabase",
  "Acacia Labs",
  "Jambo Cloud",
  "Nuru Health",
];

interface LogoStripProps {
  label?: string;
  partners?: Partner[];
}

export default function LogoStrip({
  label = "Trusted by operators across East Africa",
  partners,
}: LogoStripProps) {
  const useApi = partners && partners.length > 0;

  return (
    <div className="logostrip">
      <div className="wrap logostrip-inner">
        <span className="lab">{label}</span>
        <div className="logostrip-marks">
          {useApi
            ? partners.map((p) => (
                <span
                  key={p.name}
                  className="logostrip-item"
                  title={p.name}
                >
                  {p.logo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="ls-img"
                      style={{
                        height: 24,
                        maxWidth: 96,
                        objectFit: "contain",
                        filter: "grayscale(1) brightness(1.4)",
                        opacity: 0.65,
                        transition: "opacity .2s, filter .2s",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: "1px solid var(--border)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--fg-subtle)",
                      }}
                    >
                      {p.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="ls-name">{p.name}</span>
                </span>
              ))
            : FALLBACK_LOGOS.map((name) => (
                <span key={name} className="logostrip-item" title={name}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "1px solid var(--border)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--fg-subtle)",
                    }}
                  >
                    {name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="ls-name">{name}</span>
                </span>
              ))}
        </div>
      </div>
    </div>
  );
}
