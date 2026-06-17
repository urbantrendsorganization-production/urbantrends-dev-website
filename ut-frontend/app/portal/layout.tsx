"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    getSession()
      .then((r) => {
        if (!r.meta?.is_authenticated) {
          router.replace("/login");
        } else {
          // allauth returns is_staff on the user object when set
          const user = r.data?.user as ({ is_staff?: boolean } & { email?: string }) | undefined;
          setIsStaff(user?.is_staff === true);
          setReady(true);
        }
      })
      .catch(() => router.replace("/login"));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) {
    return (
      <div style={{ padding: "clamp(40px,8vw,80px) 24px", textAlign: "center", color: "var(--fg-muted)", fontSize: 14 }}>
        Loading…
      </div>
    );
  }

  function navLink(href: string, label: string) {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        style={{
          color: active ? "var(--fg)" : "var(--fg-muted)",
          textDecoration: "none",
          fontWeight: active ? 600 : 500,
          fontSize: 13,
          padding: "4px 0",
          borderBottom: active ? "1px solid var(--accent)" : "1px solid transparent",
        }}
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="wrap" style={{ paddingTop: "clamp(32px,5vw,56px)", paddingBottom: "clamp(40px,6vw,80px)" }}>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: "clamp(24px,3vw,36px)",
          borderBottom: "1px solid var(--border)",
          paddingBottom: 12,
        }}
      >
        {navLink("/portal/orders", "My Orders")}
        {isStaff && navLink("/portal/analytics", "Analytics")}
        {isStaff && navLink("/portal/repos", "Repos")}
        {isStaff && navLink("/portal/deployments", "Deployments")}
        {isStaff && navLink("/portal/gmail", "Gmail")}
      </nav>
      {children}
    </div>
  );
}
