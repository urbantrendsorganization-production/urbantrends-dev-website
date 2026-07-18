"use client";

// Global toast pop-ups for freshly-arrived notifications. Mounted once in the
// root layout so a toast can surface on any screen — independent of the bell
// (which lives in the nav). The bell owns the unread badge; this owns the
// transient "you just got X" pop-up.

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listNotifications, markRead, type Notification } from "@/lib/notifications";

const POLL_MS = 30_000;
const TOAST_TTL_MS = 8_000;
const MAX_VISIBLE = 3;

const CloseIcon = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

function ToastItem({
  n,
  onOpen,
  onDismiss,
}: {
  n: Notification;
  onOpen: (n: Notification) => void;
  onDismiss: (id: number) => void;
}) {
  // Each toast owns its own dismiss timer; pause while hovered.
  const timer = useRef<number | null>(null);

  const start = useCallback(() => {
    timer.current = window.setTimeout(() => onDismiss(n.id), TOAST_TTL_MS);
  }, [n.id, onDismiss]);

  useEffect(() => {
    start();
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [start]);

  return (
    <div
      className="toast"
      role="alert"
      onClick={() => onOpen(n)}
      onMouseEnter={() => {
        if (timer.current) window.clearTimeout(timer.current);
      }}
      onMouseLeave={start}
    >
      <span className="toast-dot" aria-hidden="true" />
      <span className="toast-body">
        <span className="toast-title">{n.title}</span>
        {n.body && <span className="toast-sub">{n.body}</span>}
      </span>
      <button
        type="button"
        className="toast-close"
        aria-label="Dismiss notification"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(n.id);
        }}
      >
        {CloseIcon}
      </button>
    </div>
  );
}

export default function NotificationToaster() {
  const router = useRouter();
  const [toasts, setToasts] = useState<Notification[]>([]);

  // Highest notification id we've already accounted for. Notifications at or
  // below this were present before we started watching (or already toasted),
  // so they must not pop again — including across a page reload.
  const lastSeenId = useRef<number | null>(null);
  const authed = useRef(false);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const open = useCallback(
    (n: Notification) => {
      dismiss(n.id);
      if (!n.is_read) {
        markRead(n.id)
          .then(() => window.dispatchEvent(new Event("notifications:changed")))
          .catch(() => {});
      }
      if (n.url) router.push(n.url);
    },
    [dismiss, router]
  );

  const poll = useCallback(async () => {
    if (!authed.current) return;
    const items = await listNotifications();
    if (!items.length) return;

    const maxId = items.reduce((m, n) => Math.max(m, n.id), 0);

    // First look after (re)authenticating: establish a baseline silently so we
    // don't blast the whole backlog as toasts.
    if (lastSeenId.current === null) {
      lastSeenId.current = maxId;
      return;
    }

    const fresh = items
      .filter((n) => n.id > lastSeenId.current! && !n.is_read)
      .sort((a, b) => a.id - b.id);

    lastSeenId.current = maxId;

    if (fresh.length) {
      setToasts((prev) => [...prev, ...fresh].slice(-MAX_VISIBLE));
      // Nudge the bell to refresh its unread badge immediately.
      window.dispatchEvent(new Event("notifications:changed"));
    }
  }, []);

  useEffect(() => {
    let interval: number | undefined;

    function startPolling() {
      poll();
      interval = window.setInterval(poll, POLL_MS);
    }
    function stopPolling() {
      if (interval) window.clearInterval(interval);
      interval = undefined;
    }

    function syncAuth() {
      getSession()
        .then((r) => {
          const isAuthed = r.meta?.is_authenticated === true;
          if (isAuthed && !authed.current) {
            authed.current = true;
            lastSeenId.current = null; // re-baseline for this session
            startPolling();
          } else if (!isAuthed && authed.current) {
            authed.current = false;
            lastSeenId.current = null;
            stopPolling();
            setToasts([]);
          }
        })
        .catch(() => {});
    }

    syncAuth();
    const onFocus = () => poll();
    window.addEventListener("focus", onFocus);
    window.addEventListener("auth:changed", syncAuth);
    return () => {
      stopPolling();
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("auth:changed", syncAuth);
    };
  }, [poll]);

  if (!toasts.length) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((n) => (
        <ToastItem key={n.id} n={n} onOpen={open} onDismiss={dismiss} />
      ))}
    </div>
  );
}
