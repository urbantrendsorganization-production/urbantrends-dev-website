"use client";
import { useState } from "react";
import QuoteDialog from "./QuoteDialog";

export default function QuoteButton({
  serviceName,
  label,
  className = "sc-link",
  style,
}: {
  serviceName: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={className}
        style={style}
        onClick={() => setOpen(true)}
      >
        {label}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14" strokeLinecap="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
      {open && <QuoteDialog serviceName={serviceName} onClose={() => setOpen(false)} />}
    </>
  );
}
