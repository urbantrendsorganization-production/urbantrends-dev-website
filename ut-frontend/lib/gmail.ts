const API =
  typeof window === "undefined"
    ? `${process.env.BACKEND_URL ?? "http://localhost:8000"}/api`
    : "/api";

export type GmailMessage = {
  message_id: string;
  from_email: string;
  to_emails: string[];
  subject: string;
  body_text: string;
  sent_at: string | null;
  has_attachments: boolean;
};

export type GmailThread = {
  thread_id: string;
  subject: string;
  snippet: string;
  from_email: string;
  to_emails: string[];
  message_count: number;
  last_message_at: string | null;
  has_attachments: boolean;
  is_read: boolean;
  is_starred: boolean;
  client_id: number | null;
  client_name: string | null;
  order_id: number | null;
  notes: string;
};

export type GmailThreadDetail = GmailThread & {
  messages: GmailMessage[];
  labels: string[];
  synced_at: string | null;
};

function csrfToken(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(^|;\s*)csrftoken=([^;]+)/);
  return m ? decodeURIComponent(m[2]) : "";
}

export async function listThreads(): Promise<GmailThread[]> {
  const res = await fetch(`${API}/gmail/threads`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getThread(threadId: string): Promise<GmailThreadDetail | null> {
  const res = await fetch(`${API}/gmail/threads/${threadId}`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function syncGmail(): Promise<{ ok: boolean; synced?: number; error?: string }> {
  const res = await fetch(`${API}/gmail/sync`, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    credentials: "same-origin",
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error ?? "Sync failed." };
  return { ok: true, synced: data.synced };
}
