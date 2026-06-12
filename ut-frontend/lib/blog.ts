const API =
  typeof window === 'undefined'
    ? `${process.env.BACKEND_URL ?? 'http://localhost:8000'}/api`
    : '/api';

function csrfToken(): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(^|;\s*)csrftoken=([^;]+)/);
  return m ? decodeURIComponent(m[2]) : '';
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  accent_color: string;
  author_name: string;
  published_at: string;
  read_time: number;
  tags: Tag[];
  cover_image_url: string;
  like_count: number;
  comment_count: number;
};

export type PostDetail = Post & {
  body: string;
  meta_description: string;
  og_image_url: string;
  updated_at: string;
  is_liked_by_me: boolean;
};

export type Comment = {
  id: number;
  author_name: string;
  author_initials: string;
  content: string;
  created_at: string;
};

export type LikeStatus = {
  count: number;
  is_liked: boolean;
};

export type PaginatedPosts = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
};

// ─── API functions ────────────────────────────────────────────────────────────

export async function listPosts(page = 1): Promise<PaginatedPosts> {
  const res = await fetch(`${API}/blog/posts?page=${page}`, { cache: 'no-store' });
  if (!res.ok) return { count: 0, next: null, previous: null, results: [] };
  return res.json();
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  const res = await fetch(`${API}/blog/posts/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function getLikeStatus(slug: string): Promise<LikeStatus> {
  const res = await fetch(`${API}/blog/posts/${slug}/like`, {
    credentials: 'same-origin',
    cache: 'no-store',
  });
  if (!res.ok) return { count: 0, is_liked: false };
  return res.json();
}

export async function toggleLike(slug: string): Promise<LikeStatus> {
  const res = await fetch(`${API}/blog/posts/${slug}/like`, {
    method: 'POST',
    headers: { 'X-CSRFToken': csrfToken() },
    credentials: 'same-origin',
  });
  if (!res.ok) throw new Error('Failed to toggle like');
  return res.json();
}

export async function listComments(slug: string): Promise<Comment[]> {
  const res = await fetch(`${API}/blog/posts/${slug}/comments`, {
    credentials: 'same-origin',
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export async function postComment(
  slug: string,
  content: string
): Promise<{ ok: boolean; data?: Comment; error?: string }> {
  const res = await fetch(`${API}/blog/posts/${slug}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken(),
    },
    credentials: 'same-origin',
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: 'Failed to post comment.' };
  return { ok: true, data };
}

export async function subscribeBlog(
  email: string
): Promise<{ ok: boolean; already?: boolean }> {
  const res = await fetch(`${API}/blog/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken(),
    },
    credentials: 'same-origin',
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false };
  return { ok: true, already: data.detail === 'already_subscribed' };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  engineering: 'Engineering',
  product:     'Product',
  company:     'Company',
  guides:      'Guides',
};
