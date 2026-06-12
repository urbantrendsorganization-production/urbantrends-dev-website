"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getSession,
  signup,
  verifyEmail,
  passkeySignupCeremony,
  type AllauthResponse,
} from "@/lib/auth";

type Step = "email" | "verify" | "passkey" | "done";
type Status = { kind: "idle" } | { kind: "info" | "success" | "error"; msg: string };

function flowIsPending(r: AllauthResponse, id: string): boolean {
  return Boolean(r.data?.flows?.some((f) => f.id === id && f.is_pending));
}

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

export default function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [emailTaken, setEmailTaken] = useState(false);
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

  function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "idle" });
    setEmailTaken(false);
    startTransition(async () => {
      try {
        const r = await signup(email);
        if (r.errors?.[0]?.code === "email_taken") { setEmailTaken(true); return; }
        if (flowIsPending(r, "verify_email")) {
          setStep("verify");
          setStatus({ kind: "info", msg: `Code sent to ${email}.` });
          return;
        }
        if (r.meta?.is_authenticated) {
          window.dispatchEvent(new Event("auth:changed"));
          router.push("/");
          router.refresh();
          return;
        }
        reportError(r, "Could not start sign-up. Try again.");
      } catch (err) {
        setStatus({
          kind: "error",
          msg: err instanceof Error ? err.message : "Could not reach the server.",
        });
      }
    });
  }

  function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "idle" });
    startTransition(async () => {
      try {
        const r = await verifyEmail(code.trim());
        if (r.status >= 400 && !flowIsPending(r, "verify_email")) {
          if (r.errors?.length) { reportError(r, "That code didn't match."); return; }
        }
        if (r.meta?.is_authenticated) { router.push("/"); router.refresh(); return; }
        setStep("passkey");
        setStatus({ kind: "idle" });
      } catch (err) {
        setStatus({
          kind: "error",
          msg: err instanceof Error ? err.message : "Could not reach the server.",
        });
      }
    });
  }

  function registerPasskey() {
    setStatus({ kind: "idle" });
    startTransition(async () => {
      try {
        const r = await passkeySignupCeremony();
        if (r.meta?.is_authenticated) {
          setStep("done");
          window.dispatchEvent(new Event("auth:changed"));
          router.push("/");
          router.refresh();
          return;
        }
        reportError(r, "Passkey registered but sign-in didn't complete.");
      } catch (err) {
        setStatus({
          kind: "error",
          msg: err instanceof Error ? err.message : "Your authenticator declined. Try again.",
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

  const titleStyle: React.CSSProperties = {
    fontSize: 19,
    fontWeight: 400,
    color: "rgba(255,255,255,0.88)",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: "-0.01em",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    marginBottom: 20,
    textAlign: "center",
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 380,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {LOGO}

      {step === "email" && (
        <>
          <h1 style={titleStyle}>Create your account</h1>
          <p style={subtitleStyle}>Sign up with your work or personal email.</p>

          {emailTaken && (
            <div
              role="alert"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                fontSize: 13,
                color: "rgba(255,255,255,0.6)",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              That email already has an account.{" "}
              <Link href="/login" style={{ color: "#22D3EE", textDecoration: "none" }}>
                Sign in instead
              </Link>
            </div>
          )}

          <form
            onSubmit={submitEmail}
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
              {pending ? "…" : "Continue with email"}
            </AuthBtn>
          </form>

          <StatusMsg s={status} />

          <p
            style={{
              marginTop: 16,
              fontSize: 12,
              color: "rgba(255,255,255,0.28)",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            By signing up, you agree to our{" "}
            <Link href="/terms" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
              Privacy Policy
            </Link>
            .
          </p>
        </>
      )}

      {step === "verify" && (
        <>
          <h1 style={titleStyle}>Check your inbox</h1>
          <p style={subtitleStyle}>
            Enter the code sent to{" "}
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{email}</span>
          </p>

          <form
            onSubmit={submitCode}
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
              onClick={() => { setStep("email"); setStatus({ kind: "idle" }); }}
              disabled={pending}
            >
              Use a different email
            </AuthBtn>
          </form>

          <StatusMsg s={status} />
        </>
      )}

      {step === "passkey" && (
        <>
          <h1 style={titleStyle}>Add a passkey</h1>
          <p style={subtitleStyle}>
            Use your device — fingerprint, Face ID, or Windows Hello — instead of a password.
          </p>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            <AuthBtn primary onClick={registerPasskey} disabled={pending}>
              {pending ? "Waiting for authenticator…" : "Register passkey"}
            </AuthBtn>
            <AuthBtn
              onClick={() => { router.push("/"); router.refresh(); }}
              disabled={pending}
            >
              Skip — I&apos;ll use email codes
            </AuthBtn>
          </div>

          <StatusMsg s={status} />
        </>
      )}

      {step === "done" && (
        <>
          <h1 style={titleStyle}>You&apos;re in.</h1>
          <p style={subtitleStyle}>Redirecting…</p>
        </>
      )}

      {step !== "done" && (
        <p
          style={{
            marginTop: 28,
            fontSize: 13,
            color: "rgba(255,255,255,0.35)",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
          >
            Log in
          </Link>
        </p>
      )}
    </div>
  );
}
