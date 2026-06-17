const API =
  typeof window === "undefined"
    ? `${process.env.BACKEND_URL ?? "http://localhost:8000"}/api`
    : "/api";

export type Deployment = {
  id: number;
  vercel_deployment_id: string;
  url: string;
  environment: "production" | "preview" | "development";
  branch: string;
  commit_sha: string;
  commit_message: string;
  status: "queued" | "building" | "ready" | "error" | "cancelled";
  triggered_by_email: string | null;
  created_at: string;
  ready_at: string | null;
};

export type VercelProject = {
  id: number;
  vercel_project_id: string;
  name: string;
  framework: string;
  production_url: string;
  custom_domain: string;
  repo: number | null;
  repo_full_name: string | null;
  notes: string;
  created_at: string;
  recent_deployments: Deployment[];
};

function csrfToken(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(^|;\s*)csrftoken=([^;]+)/);
  return m ? decodeURIComponent(m[2]) : "";
}

export async function listProjects(): Promise<VercelProject[]> {
  const res = await fetch(`${API}/deployments/projects`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getProject(id: number): Promise<VercelProject | null> {
  const res = await fetch(`${API}/deployments/projects/${id}`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function triggerDeploy(
  projectId: number,
  branch = "main",
  environment = "production"
): Promise<{ ok: boolean; deployment?: Deployment; error?: string }> {
  const res = await fetch(`${API}/deployments/projects/${projectId}/deploy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken(),
    },
    credentials: "same-origin",
    body: JSON.stringify({ branch, environment }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error ?? "Deploy failed." };
  return { ok: true, deployment: data };
}
