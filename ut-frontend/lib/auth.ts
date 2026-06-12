import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON,
} from "@simplewebauthn/browser";

const API_ROOT = "/_allauth/browser/v1";
const CSRF_COOKIE = "csrftoken";

export type Flow = {
  id: string;
  is_pending?: boolean;
  types?: string[];
  providers?: string[];
};

// allauth uses HTTP 401 to mean "the auth flow has another pending step"
// (e.g. verify_email), not "credentials invalid" — callers should branch on
// data.flows + meta.is_authenticated, not on status alone.
export type AllauthResponse<T = unknown> = {
  status: number;
  data?: (T & { flows?: Flow[] }) | undefined;
  meta?: { is_authenticated?: boolean };
  errors?: Array<{ message: string; code: string; param?: string }>;
};

export type ServerConfig = {
  account: {
    login_methods: string[];
    is_open_for_signup: boolean;
    email_verification_by_code_enabled: boolean;
    login_by_code_enabled: boolean;
    password_reset_by_code_enabled: boolean;
    authentication_method: string;
  };
  mfa: {
    supported_types: string[];
    passkey_login_enabled: boolean;
  };
};

export type AuthUser = {
  id: number | string;
  email: string;
  display?: string;
  has_usable_password?: boolean;
};

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(^|;\\s*)" + name + "=([^;]+)"),
  );
  return match ? decodeURIComponent(match[2]) : null;
}

// Django only sets the csrftoken cookie in response to a request to an
// allauth endpoint. If a caller's first interaction is a POST (e.g. submitting
// the signup form), no prior GET has set the cookie and Django rejects with
// 403. Prime with a cheap GET so the cookie is in place before unsafe verbs.
async function ensureCsrf(): Promise<void> {
  if (readCookie(CSRF_COOKIE)) return;
  await fetch(`${API_ROOT}/config`, { credentials: "same-origin" });
}

async function request<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<AllauthResponse<T>> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (method !== "GET" && method !== "HEAD") {
    await ensureCsrf();
    const csrf = readCookie(CSRF_COOKIE);
    if (csrf) headers.set("X-CSRFToken", csrf);
  }
  const res = await fetch(`${API_ROOT}${path}`, {
    ...init,
    method,
    headers,
    credentials: "same-origin",
  });
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    return {
      status: res.status,
      errors: [{ message: `Server error (${res.status})`, code: "server_error" }],
    } as AllauthResponse<T>;
  }
  return (await res.json()) as AllauthResponse<T>;
}

// --- Server config / current session ---------------------------------------

export const getConfig = () => request<ServerConfig>("/config");

export const getSession = () =>
  request<{ user?: AuthUser; methods?: unknown[] }>("/auth/session");

// --- Email signup + verification (passkey-first) ---------------------------

export const signup = (email: string) =>
  request("/auth/signup", { method: "POST", body: JSON.stringify({ email }) });

export const verifyEmail = (key: string) =>
  request("/auth/email/verify", {
    method: "POST",
    body: JSON.stringify({ key }),
  });

// --- Fallback email + password ---------------------------------------------

export const login = (email: string, password: string) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const logout = () => request("/auth/session", { method: "DELETE" });

// --- Login by email code (fallback for devices without passkeys) -----------

// Step 1: send a one-time code to the user's email.
// Returns 401 with `data.flows = [{id:"login_by_code", is_pending:true}]` on
// success (pending stage). Returns 400 if the email has no account.
export const requestLoginCode = (email: string) =>
  request("/auth/code/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

// Step 2: confirm the code.  Returns 200 + meta.is_authenticated on success.
export const confirmLoginCode = (code: string) =>
  request("/auth/code/confirm", {
    method: "POST",
    body: JSON.stringify({ code }),
  });

export const requestPasswordReset = (email: string) =>
  request("/auth/password/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPassword = (key: string, password: string) =>
  request("/auth/password/reset", {
    method: "POST",
    body: JSON.stringify({ key, password }),
  });

// --- Passkey (WebAuthn) — low-level transport ------------------------------

export const beginPasskeySignup = () =>
  request<{ creation_options: PublicKeyCredentialCreationOptionsJSON }>(
    "/auth/webauthn/signup",
    { method: "GET" },
  );

// allauth completes passkey signup via PUT (POST is used for the basic
// signup form path, which we do not exercise).
export const completePasskeySignup = (
  credential: RegistrationResponseJSON,
  name?: string,
) =>
  request("/auth/webauthn/signup", {
    method: "PUT",
    body: JSON.stringify({ name: name ?? "", credential }),
  });

export const beginPasskeyLogin = () =>
  request<{ request_options: PublicKeyCredentialRequestOptionsJSON }>(
    "/auth/webauthn/login",
    { method: "GET" },
  );

export const completePasskeyLogin = (credential: AuthenticationResponseJSON) =>
  request("/auth/webauthn/login", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });

// --- Passkey ceremonies — high-level ---------------------------------------
// These wrap the three-leg dance (begin → navigator.credentials.* →
// complete) into a single Promise. The browser step can throw (user cancels
// the prompt, no authenticator, blocklisted RP-ID, etc.) — let those
// propagate so callers can surface the actual reason.

// allauth wraps the WebAuthn options as `{ publicKey: { ... } }` (the shape
// `navigator.credentials.create/.get` takes directly), but @simplewebauthn's
// startRegistration / startAuthentication expect the flat W3C JSON form.
// Unwrap if needed; tolerate either shape so future allauth versions that
// emit the flat form still work.
function unwrapPublicKey<T>(options: unknown): T {
  if (
    typeof options === "object" &&
    options !== null &&
    "publicKey" in options
  ) {
    return (options as { publicKey: T }).publicKey;
  }
  return options as T;
}

export async function passkeyLoginCeremony(): Promise<AllauthResponse> {
  const begin = await beginPasskeyLogin();
  const requestOptions = begin.data?.request_options;
  if (!requestOptions) return begin;
  const raw =
    unwrapPublicKey<PublicKeyCredentialRequestOptionsJSON>(requestOptions);
  // Prefer device-bound passkey (Touch ID / Face ID / Windows Hello).
  // Without this, browsers with an empty allowCredentials may default to
  // prompting for a hardware security key instead of a platform passkey.
  const optionsJSON: PublicKeyCredentialRequestOptionsJSON = {
    ...raw,
    hints: ["client-device"],
  };
  const credential = await startAuthentication({ optionsJSON });
  return completePasskeyLogin(credential);
}

export async function passkeySignupCeremony(
  name?: string,
): Promise<AllauthResponse> {
  const begin = await beginPasskeySignup();
  const creationOptions = begin.data?.creation_options;
  if (!creationOptions) return begin;
  const raw =
    unwrapPublicKey<PublicKeyCredentialCreationOptionsJSON>(creationOptions);
  // Force a device-bound passkey (saved to iCloud/Google/Windows Hello)
  // instead of a roaming hardware security key.
  const optionsJSON: PublicKeyCredentialCreationOptionsJSON = {
    ...raw,
    authenticatorSelection: {
      ...raw.authenticatorSelection,
      authenticatorAttachment: "platform",
      residentKey: "required",
      userVerification: "required",
    },
  };
  const credential = await startRegistration({ optionsJSON });
  return completePasskeySignup(credential, name);
}

// --- Capability probes ------------------------------------------------------

export { browserSupportsWebAuthn, browserSupportsWebAuthnAutofill };
