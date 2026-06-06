"use client";

import { useEffect, useState } from "react";

const NAMES: Record<string, string> = {
  KE: "Kenya", TZ: "Tanzania", UG: "Uganda", RW: "Rwanda", ET: "Ethiopia",
  NG: "Nigeria", GH: "Ghana", ZA: "South Africa", EG: "Egypt",
  US: "United States", GB: "United Kingdom", CA: "Canada", AU: "Australia",
  IN: "India", SG: "Singapore", AE: "UAE", DE: "Germany", FR: "France",
  NL: "Netherlands", SE: "Sweden", NO: "Norway", FI: "Finland",
  JP: "Japan", CN: "China", KR: "South Korea", BR: "Brazil", MX: "Mexico",
  ZM: "Zambia", MZ: "Mozambique", TG: "Togo", SN: "Senegal", CI: "Côte d'Ivoire",
  ZW: "Zimbabwe", BW: "Botswana", NA: "Namibia", MG: "Madagascar",
};

function toFlag(cc: string): string {
  return [...cc.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

function readCookie(name: string): string | null {
  const m = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return m ? m[2] : null;
}

async function detectCountry(): Promise<string | null> {
  // 1. Vercel cookie (set by middleware in production)
  const fromCookie = readCookie("ut-country");
  if (fromCookie && /^[A-Z]{2}$/.test(fromCookie)) return fromCookie;

  // 2. localStorage cache so we don't hit the API on every visit
  try {
    const cached = localStorage.getItem("ut-country-cache");
    if (cached && /^[A-Z]{2}$/.test(cached)) return cached;
  } catch { /* private browsing */ }

  // 3. Free IP geolocation API fallback (dev / no Vercel headers)
  try {
    const res = await fetch("https://ipapi.co/country/", {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const cc = (await res.text()).trim();
      if (/^[A-Z]{2}$/.test(cc)) {
        try { localStorage.setItem("ut-country-cache", cc); } catch { /* ok */ }
        return cc;
      }
    }
  } catch { /* network error or blocked — silently skip */ }

  return null;
}

export default function CountryFlag() {
  const [cc, setCC] = useState<string | null>(null);

  useEffect(() => {
    detectCountry().then((code) => { if (code) setCC(code); });
  }, []);

  if (!cc) return null;

  const flag = toFlag(cc);
  const name = NAMES[cc] ?? cc;

  return (
    <span
      className="nav-country"
      title={`Viewing from ${name}`}
      aria-label={`Your location: ${name}`}
    >
      <span aria-hidden="true">{flag}</span>
      <span className="nav-country-code">{cc}</span>
    </span>
  );
}
