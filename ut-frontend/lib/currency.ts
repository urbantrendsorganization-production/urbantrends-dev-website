// Currency localisation for public pricing.
//
// Prices are authored in KES (the base currency). Kenyan visitors see KES;
// everyone else sees an approximate USD amount converted from live rates.
// Rates come from open.er-api.com (keyless) and are cached for a day.

export type DisplayCurrency = "KES" | "USD";

const RATES_URL = "https://open.er-api.com/v6/latest/KES";

/** KES for Kenya, USD for the rest of the world. */
export function currencyForCountry(country: string | null | undefined): DisplayCurrency {
  return (country ?? "").toUpperCase() === "KE" ? "KES" : "USD";
}

/**
 * KES → `target` exchange rate (i.e. how many `target` units 1 KES buys).
 * Returns null on any failure so callers can fall back to KES.
 */
export async function kesRate(target: DisplayCurrency): Promise<number | null> {
  if (target === "KES") return 1;
  try {
    const res = await fetch(RATES_URL, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json();
    const rate = data?.rates?.[target];
    return typeof rate === "number" && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

/**
 * Format a KES amount in the display currency.
 * KES is shown exactly; converted currencies are rounded and prefixed with "~".
 */
export function formatPrice(kes: number, currency: DisplayCurrency, rate: number): string {
  if (currency === "KES") {
    return `KES ${kes.toLocaleString("en-KE")}`;
  }
  const amount = Math.round(kes * rate);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
  return `~${formatted}`;
}
