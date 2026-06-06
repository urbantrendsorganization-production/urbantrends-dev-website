"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type State = "idle" | "loading" | "done";

export default function PageProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<State>("idle");
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onLinkClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("#") || href.startsWith("//")) return;
      setState("loading");
    }
    document.addEventListener("click", onLinkClick, true);
    return () => document.removeEventListener("click", onLinkClick, true);
  }, []);

  useEffect(() => {
    setState((prev) => {
      if (prev === "loading") return "done";
      return prev;
    });
  }, [pathname]);

  useEffect(() => {
    if (state === "done") {
      doneTimer.current = setTimeout(() => setState("idle"), 380);
    }
    return () => { if (doneTimer.current) clearTimeout(doneTimer.current); };
  }, [state]);

  return (
    <div
      className="page-progress"
      data-state={state}
      aria-hidden="true"
    />
  );
}
