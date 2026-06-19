const API =
  typeof window === "undefined"
    ? `${process.env.BACKEND_URL ?? "http://localhost:8000"}/api`
    : "/api";

export type GitHubRepo = {
  id: number;
  github_id: number;
  account_login: string;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stars: number;
  forks: number;
  is_private: boolean;
  is_archived: boolean;
  default_branch: string;
  topics: string[];
  pushed_at: string | null;
  synced_at: string | null;
  is_featured: boolean;
  project_label: string;
};

function csrfToken(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(^|;\s*)csrftoken=([^;]+)/);
  return m ? decodeURIComponent(m[2]) : "";
}

export async function listRepos(params?: {
  language?: string;
  account?: string;
}): Promise<GitHubRepo[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.account) qs.set("account", params.account);
  const res = await fetch(`${API}/github/repos${qs.toString() ? "?" + qs : ""}`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export type GitHubAccount = {
  id: number;
  login: string;
  account_type: "user" | "org";
  avatar_url: string;
  synced_at: string | null;
  repo_count: number;
};

export async function listAccounts(): Promise<GitHubAccount[]> {
  const res = await fetch(`${API}/github/accounts`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function syncRepos(): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${API}/github/sync`, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    credentials: "same-origin",
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error ?? "Sync failed." };
  return { ok: true, ...data };
}
