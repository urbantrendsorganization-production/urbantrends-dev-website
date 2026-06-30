"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getSession,
  passkeyLoginCeremony,
  requestLoginCode,
  confirmLoginCode,
  type AllauthResponse,
} from "@/lib/auth";
import { MercuryBackdrop } from "@/components/ui/mercury-auth";

type Mode = "passkey" | "code";
type CodeStep = "email" | "verify";
type Status = { kind: "idle" } | { kind: "info" | "success" | "error"; msg: string };

const LOGO = (
  <div
    style={{
      width: 44,
      height: 44,
      borderRadius: 12,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    }}
  >
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden>
      <rect x="2" y="14" width="4" height="8" rx="1.3" fill="rgba(255,255,255,0.35)" />
      <rect x="8" y="9" width="4" height="13" rx="1.3" fill="#22D3EE" fillOpacity=".8" />
      <rect x="14" y="4" width="4" height="18" rx="1.3" fill="#22D3EE" />
      <rect x="20" y="12" width="4" height="10" rx="1.3" fill="rgba(255,255,255,0.35)" />
    </svg>
  </div>
);

function AuthBtn({
  primary,
  onClick,
  disabled,
  children,
  type = "button",
}: {
  primary?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        height: 44,
        borderRadius: 8,
        border: primary ? "none" : "1px solid rgba(255,255,255,0.1)",
        background: primary ? "#22D3EE" : "rgba(255,255,255,0.06)",
        color: primary ? "#0c0c0e" : "rgba(255,255,255,0.82)",
        fontSize: 14,
        fontWeight: primary ? 600 : 400,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "opacity .15s, background .15s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

function StatusMsg({ s }: { s: Status }) {
  if (s.kind === "idle") return null;
  return (
    <p
      role="status"
      style={{
        marginTop: 12,
        fontSize: 13,
        textAlign: "center",
        color: s.kind === "error" ? "#f87171" : "rgba(255,255,255,0.5)",
      }}
    >
      {s.msg}
    </p>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("passkey");
  const [codeStep, setCodeStep] = useState<CodeStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    getSession()
      .then((r) => { if (r.meta?.is_authenticated) router.replace("/"); })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function reportError(r: AllauthResponse, fallback: string) {
    setStatus({ kind: "error", msg: r.errors?.[0]?.message ?? fallback });
  }

  function onSuccess() {
    window.dispatchEvent(new Event("auth:changed"));
    router.push("/");
    router.refresh();
  }

  function handlePasskey() {
    setStatus({ kind: "info", msg: "Approve the prompt on your device…" });
    startTransition(async () => {
      try {
        const r = await passkeyLoginCeremony();
        if (r.meta?.is_authenticated) { onSuccess(); return; }
        reportError(r, "Sign-in didn't complete. Try again.");
      } catch (err) {
        setStatus({
          kind: "error",
          msg: err instanceof Error ? err.message : "Passkey sign-in failed.",
        });
      }
    });
  }

  function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "idle" });
    startTransition(async () => {
      try {
        const r = await requestLoginCode(email);
        if (r.meta?.is_authenticated) { onSuccess(); return; }
        if (r.status === 401) {
          setCodeStep("verify");
          setStatus({ kind: "info", msg: `Code sent to ${email}.` });
          return;
        }
        reportError(r, "Couldn't send a code. Check the email and try again.");
      } catch (err) {
        setStatus({
          kind: "error",
          msg: err instanceof Error ? err.message : "Could not reach the server.",
        });
      }
    });
  }

  function handleConfirmCode(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "idle" });
    startTransition(async () => {
      try {
        const r = await confirmLoginCode(code.trim());
        if (r.meta?.is_authenticated) { onSuccess(); return; }
        reportError(r, "That code didn't match. Check your inbox and retry.");
      } catch (err) {
        setStatus({
          kind: "error",
          msg: err instanceof Error ? err.message : "Could not reach the server.",
        });
      }
    });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 44,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    padding: "0 14px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <>
      <MercuryBackdrop />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 380,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {LOGO}

      {mode === "passkey" && (
        <>
          <h1
            style={{
              fontSize: 19,
              fontWeight: 400,
              color: "rgba(255,255,255,0.88)",
              marginBottom: 24,
              textAlign: "center",
              letterSpacing: "-0.01em",
            }}
          >
            Sign in to UrbanTrends
          </h1>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            <AuthBtn primary onClick={handlePasskey} disabled={pending}>
              {pending ? "Waiting for passkey…" : "Continue with passkey"}
            </AuthBtn>
            <AuthBtn onClick={() => { setMode("code"); setCodeStep("email"); setStatus({ kind: "idle" }); }}>
              Continue with email code
            </AuthBtn>
          </div>

          <StatusMsg s={status} />
        </>
      )}

      {mode === "code" && codeStep === "email" && (
        <>
          <h1
            style={{
              fontSize: 19,
              fontWeight: 400,
              color: "rgba(255,255,255,0.88)",
              marginBottom: 8,
              textAlign: "center",
              letterSpacing: "-0.01em",
            }}
          >
            Sign in with email
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.4)",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            We&apos;ll send a one-time code to your inbox.
          </p>

          <form
            onSubmit={handleRequestCode}
            style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}
          >
            <input
              type="email"
              placeholder="you@company.ke"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <AuthBtn primary type="submit" disabled={pending}>
              {pending ? "Sending…" : "Send me a code"}
            </AuthBtn>
            <AuthBtn onClick={() => { setMode("passkey"); setStatus({ kind: "idle" }); }}>
              Use a passkey instead
            </AuthBtn>
          </form>

          <StatusMsg s={status} />
        </>
      )}

      {mode === "code" && codeStep === "verify" && (
        <>
          <h1
            style={{
              fontSize: 19,
              fontWeight: 400,
              color: "rgba(255,255,255,0.88)",
              marginBottom: 8,
              textAlign: "center",
              letterSpacing: "-0.01em",
            }}
          >
            Check your inbox
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.4)",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Enter the code sent to <span style={{ color: "rgba(255,255,255,0.7)" }}>{email}</span>
          </p>

          <form
            onSubmit={handleConfirmCode}
            style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}
          >
            <input
              type="text"
              inputMode="text"
              autoComplete="one-time-code"
              placeholder="XXXX-XXXX"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              style={{
                ...inputStyle,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                textAlign: "center",
                fontSize: 16,
              }}
            />
            <AuthBtn primary type="submit" disabled={pending}>
              {pending ? "Verifying…" : "Verify code"}
            </AuthBtn>
            <AuthBtn
              onClick={() => { setCodeStep("email"); setStatus({ kind: "idle" }); }}
              disabled={pending}
            >
              Use a different email
            </AuthBtn>
          </form>

          <StatusMsg s={status} />
        </>
      )}

      <p
        style={{
          marginTop: 28,
          fontSize: 13,
          color: "rgba(255,255,255,0.35)",
          textAlign: "center",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
        >
          Sign up
        </Link>
      </p>
      </div>
    </>
  );
}
