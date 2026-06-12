"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

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
  // 1. Cookie (set by Django /api/geo/)
  const fromCookie = readCookie("ut-country");
  if (fromCookie && /^[A-Z]{2}$/.test(fromCookie)) return fromCookie;

  // 2. localStorage cache so we don't hit the backend on every visit
  try {
    const cached = localStorage.getItem("ut-country-cache");
    if (cached && /^[A-Z]{2}$/.test(cached)) return cached;
  } catch { /* private browsing */ }

  // 3. Own backend endpoint — reads x-vercel-ip-country forwarded by Next.js rewrite
  try {
    const res = await fetch("/api/geo/", {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      const cc: unknown = data?.country;
      if (typeof cc === "string" && /^[A-Z]{2}$/.test(cc)) {
        try { localStorage.setItem("ut-country-cache", cc); } catch { /* ok */ }
        return cc;
      }
    }
  } catch { /* offline / backend not running in dev */ }

  return null;
}

export default function CountryFlag() {
  const [cc, setCC] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    detectCountry().then((code) => {
      if (!code) return;
      setCC(code);
      // On first visit the middleware hasn't set the cookie yet, so redirect
      // client-side. The next visit the middleware handles it instantly.
      if (pathname === "/") {
        router.replace(`/${code.toLowerCase()}`);
      }
    });
  }, [pathname, router]);

  if (!cc) return null;

  const flag = toFlag(cc);
  const name = NAMES[cc] ?? cc;

  return (
    <Link
      href={`/${cc.toLowerCase()}/`}
      className="nav-country"
      title={`Viewing from ${name}`}
      aria-label={`Your location: ${name}`}
    >
      <span aria-hidden="true">{flag}</span>
      <span className="nav-country-code">/{cc.toLowerCase()}</span>
    </Link>
  );
}
