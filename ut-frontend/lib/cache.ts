/**
 * Fetch cache policy for calls into the Django API.
 *
 * The rule, and it matters: **anything sent with `credentials: "same-origin"`
 * is per-user and must stay `cache: "no-store"`.** Caching one of those would
 * serve one signed-in customer's orders, invoices or notifications to the
 * next visitor. Only anonymous, identical-for-everyone content belongs here.
 *
 * Everything public used to be `no-store` too, which meant every single page
 * view — including a crawler's — went all the way through to Django and
 * Postgres. That is fine at a trickle and falls over under a spike, so
 * editorial content is now served stale-while-revalidate instead.
 */

/**
 * Marketing and editorial content: services, pricing, blog posts, products,
 * projects, changelog, team. Authored in Django admin and read constantly.
 * Five minutes is short enough that an admin edit shows up while you're still
 * looking at the page, and long enough to flatten a traffic spike into a
 * handful of backend requests per window.
 */
export const PUBLIC_CONTENT = { next: { revalidate: 300 } } as const;

/** Service status — the one public surface where staleness is misleading. */
export const PUBLIC_STATUS = { next: { revalidate: 60 } } as const;

/** Per-user data. Never cached. */
export const PRIVATE = { cache: "no-store" } as const;
