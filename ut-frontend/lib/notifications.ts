// In-app notifications ("the bell"). Client-only — always goes through the
// Next.js /api rewrite to Django.

const API = "/api";

export type NotificationKind =
  | "new_order"
  | "order_status"
  | "order_message"
  | "invoice"
  | "review";

export type Notification = {
  id: number;
  kind: NotificationKind;
  title: string;
  body: string;
  url: string;
  order: number | null;
  is_read: boolean;
  created_at: string;
};

function csrfToken(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(^|;\s*)csrftoken=([^;]+)/);
  return m ? decodeURIComponent(m[2]) : "";
}

export async function listNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API}/notifications`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getUnreadCount(): Promise<number> {
  const res = await fetch(`${API}/notifications/unread-count`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return typeof data?.count === "number" ? data.count : 0;
}

export async function markRead(id: number): Promise<boolean> {
  const res = await fetch(`${API}/notifications/${id}/read`, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    credentials: "same-origin",
  });
  return res.ok;
}

export async function markAllRead(): Promise<boolean> {
  const res = await fetch(`${API}/notifications/read-all`, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    credentials: "same-origin",
  });
  return res.ok;
}
