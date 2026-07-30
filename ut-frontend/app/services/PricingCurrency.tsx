"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { formatPrice, type DisplayCurrency } from "@/lib/currency";

/**
 * Client-side currency switching for public pricing.
 *
 * Prices are authored in KES. The server picks a sensible default from the
 * visitor's country (KES in Kenya, USD elsewhere) and resolves the exchange
 * rate once; this provider just lets the visitor override that choice without
 * a round trip — an international client on a Kenyan IP, or a Kenyan client
 * who wants the dollar figure to send to a partner.
 *
 * Only the default is geo-derived. The override, once set, is remembered.
 */

const STORAGE_KEY = "ut-currency";

type Ctx = {
  currency: DisplayCurrency;
  setCurrency: (c: DisplayCurrency) => void;
  /** KES → currency. 1 when displaying KES, or when no live rate was available. */
  rate: number;
  /** False when the rate lookup failed, so USD is not offered at a made-up rate. */
  canConvert: boolean;
};

const CurrencyContext = createContext<Ctx | null>(null);

export function PricingCurrencyProvider({
  initialCurrency,
  rate,
  canConvert,
  children,
}: {
  initialCurrency: DisplayCurrency;
  rate: number;
  canConvert: boolean;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<DisplayCurrency>(initialCurrency);

  // Read the stored preference after mount rather than during render: the
  // server has already rendered `initialCurrency`, and reading localStorage
  // during render would produce a hydration mismatch.
  useEffect(() => {
    if (!canConvert) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "KES" || stored === "USD") {
      setCurrencyState(stored);
    }
  }, [canConvert]);

  const setCurrency = useCallback((c: DisplayCurrency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // Private mode / storage disabled — the choice just won't persist.
    }
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rate, canConvert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

function useCurrency(): Ctx {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used inside <PricingCurrencyProvider>");
  }
  return ctx;
}

/** A KES-authored amount, rendered in whichever currency is selected. */
export function Price({ kes }: { kes: number }) {
  const { currency, rate } = useCurrency();
  return <>{formatPrice(kes, currency, currency === "KES" ? 1 : rate)}</>;
}

const OPTIONS: { value: DisplayCurrency; label: string; hint: string }[] = [
  { value: "KES", label: "KES", hint: "Kenyan Shilling" },
  { value: "USD", label: "USD", hint: "US Dollar" },
];

export function CurrencyToggle() {
  const { currency, setCurrency, canConvert } = useCurrency();

  // No live rate means we'd be inventing one. Show nothing rather than a
  // toggle that produces a wrong number.
  if (!canConvert) return null;

  return (
    <div className="currency-toggle" role="group" aria-label="Display currency">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          className="currency-opt"
          aria-pressed={currency === o.value}
          title={o.hint}
          onClick={() => setCurrency(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Shown under the grid when the displayed figures are converted. */
export function CurrencyNote() {
  const { currency, canConvert } = useCurrency();
  if (!canConvert || currency === "KES") return null;
  return (
    <p className="currency-note">
      Converted from KES at today&apos;s rate and rounded — indicative only.
      Invoices are issued in KES.
    </p>
  );
}
