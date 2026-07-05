const API =
  typeof window === 'undefined'
    ? `${process.env.BACKEND_URL ?? 'http://localhost:8000'}/api`
    : '/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SiteSettings = {
  active_hero_template: 'orbital' | 'code' | 'grid' | 'minimal' | 'aurora' | 'bento';
  hero_eyebrow: string;
  hero_headline: string;
  hero_subheading: string;
  hero_primary_cta_text: string;
  hero_primary_cta_url: string;
  hero_secondary_cta_text: string;
  hero_secondary_cta_url: string;
  trust_strip_label: string;
  logo_strip_label: string;
};

export type HeroStat = {
  value: string;
  label: string;
  order: number;
};

export type Partner = {
  name: string;
  category: 'rails' | 'trusted_by';
  logo: string;
  website_url: string;
};

export type Testimonial = {
  quote: string;
  author_name: string;
  author_role: string;
  company: string;
  photo_url: string;
  product_label: string;
  product_accent_color: string;
  // Present for approved customer reviews; null for editorial testimonials.
  rating?: number | null;
};

export type ChangelogTag = { type: 'new' | 'imp' | 'fix'; text: string };

export type ChangelogEntry = {
  date: string;
  product: string;
  version: string;
  title: string;
  body: string;
  tags: ChangelogTag[];
};

export type TeamMember = {
  name: string;
  role: string;
  photo_url: string;
  bio: string;
  is_founder: boolean;
  founder_message: string;
};

export type AboutMetric = {
  value: string;
  label: string;
};

export type ServiceStatusResult = {
  name: string;
  url: string;
  status: 'operational' | 'degraded' | 'down';
  response_ms: number | null;
};

export type HomeData = {
  settings: SiteSettings;
  stats: HeroStat[];
  partners_rails: Partner[];
  partners_trusted: Partner[];
  testimonials: Testimonial[];
};

export type PaginatedChangelog = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChangelogEntry[];
};

export type ToolCategory = 'mpesa' | 'developer' | 'finance' | 'utilities' | 'data' | 'other';

export type Tool = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  icon_svg: string;
  accent_color: string;
  cta_label: string;
  cta_url: string;
  is_free: boolean;
  is_coming_soon: boolean;
};

export type ProjectCategory =
  | 'product' | 'web' | 'mobile' | 'integration' | 'tooling' | 'branding' | 'other';

export type Project = {
  title: string;
  slug: string;
  client: string;
  category: ProjectCategory;
  category_label: string;
  summary: string;
  description: string;
  cover: string;
  tags: string[];
  accent_color: string;
  live_url: string;
  result_metric: string;
  year: string;
  is_featured: boolean;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: SiteSettings = {
  active_hero_template: 'orbital',
  hero_eyebrow: 'Multi-product software studio · Est. 2024',
  hero_headline: 'Code ships on Friday. Still runs on Monday.',
  hero_subheading:
    'We design, build, and ship production-grade software. Products people use. Tools developers love. Systems that don\'t wake you up.',
  hero_primary_cta_text: 'See our work',
  hero_primary_cta_url: '#services',
  hero_secondary_cta_text: 'Explore tools',
  hero_secondary_cta_url: '#tools',
  trust_strip_label: 'The same stack powering companies you use every day',
  logo_strip_label: 'Trusted by teams across Africa',
};

const DEFAULT_STATS: HeroStat[] = [
  { value: '5', label: 'Products in market', order: 0 },
  { value: '2.4M+', label: 'Transactions reconciled', order: 1 },
  { value: '99.96%', label: 'Uptime, trailing 90d', order: 2 },
];

const DEFAULT_HOME_DATA: HomeData = {
  settings: DEFAULT_SETTINGS,
  stats: DEFAULT_STATS,
  partners_rails: [],
  partners_trusted: [],
  testimonials: [],
};

// ─── API functions ────────────────────────────────────────────────────────────

export async function getHomeData(): Promise<HomeData> {
  try {
    const res = await fetch(`${API}/cms/home`, { cache: 'no-store' });
    if (!res.ok) return DEFAULT_HOME_DATA;
    const data = await res.json();
    return {
      settings: { ...DEFAULT_SETTINGS, ...data.settings },
      stats: data.stats?.length ? data.stats : DEFAULT_STATS,
      partners_rails: data.partners_rails ?? [],
      partners_trusted: data.partners_trusted ?? [],
      testimonials: data.testimonials ?? [],
    };
  } catch {
    return DEFAULT_HOME_DATA;
  }
}

export async function getChangelog(page = 1): Promise<PaginatedChangelog> {
  try {
    const res = await fetch(`${API}/cms/changelog?page=${page}`, { cache: 'no-store' });
    if (!res.ok) return { count: 0, next: null, previous: null, results: [] };
    return res.json();
  } catch {
    return { count: 0, next: null, previous: null, results: [] };
  }
}

export async function getAboutData(): Promise<{ team: TeamMember[]; metrics: AboutMetric[] }> {
  try {
    const res = await fetch(`${API}/cms/about`, { cache: 'no-store' });
    if (!res.ok) return { team: [], metrics: [] };
    return res.json();
  } catch {
    return { team: [], metrics: [] };
  }
}

export async function getSiteStatus(): Promise<ServiceStatusResult[]> {
  try {
    const res = await fetch(`${API}/cms/status`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getTools(): Promise<Tool[]> {
  try {
    const res = await fetch(`${API}/cms/tools`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results ?? []);
  } catch {
    return [];
  }
}

export async function getProjects(opts: { featured?: boolean } = {}): Promise<Project[]> {
  try {
    const qs = opts.featured ? '?featured=true' : '';
    const res = await fetch(`${API}/cms/projects${qs}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results ?? []);
  } catch {
    return [];
  }
}
