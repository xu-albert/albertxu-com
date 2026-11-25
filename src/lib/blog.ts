import fs from "fs";
import path from "path";

export interface PostMeta {
  title: string;
  date: string;
  coverImage: string;
  excerpt: string;
  canonicalUrl?: string;
}

export interface Post {
  slug: string;
  meta: PostMeta;
  readingTime: number;
  externalUrl?: string;
  source?: string;
}

interface ExternalPostEntry {
  slug: string;
  meta: PostMeta;
  readingTime: number;
  externalUrl: string;
  source: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const REQUIRED_FIELDS: (keyof PostMeta)[] = [
  "title",
  "date",
  "coverImage",
  "excerpt",
];

// Individual Substack articles from https://albertwxu.substack.com/feed.
// Cover images are stored locally under public/blog/ to stay within the
// site's strict `img-src 'self' data:` production CSP.
const EXTERNAL_POSTS: ExternalPostEntry[] = [
  {
    slug: "please-make-your-resume-ugly",
    meta: {
      title: "Please make your resume ugly",
      date: "2026-11-17",
      coverImage: "/blog/substack-please-make-your-resume-ugly.jpg",
      excerpt:
        "Make the hiring process easier for everyone, including yourself.",
    },
    readingTime: 3,
    externalUrl:
      "https://albertwxu.substack.com/p/please-make-your-resume-ugly",
    source: "Substack",
  },
  {
    slug: "tech-writing-will-never-be-the-same",
    meta: {
      title: "Tech writing will never be the same",
      date: "2026-10-28",
      coverImage: "/blog/substack-tech-writing-will-never-be-the-same.jpg",
      excerpt: "What do tech writers even do lol",
    },
    readingTime: 9,
    externalUrl:
      "https://albertwxu.substack.com/p/tech-writing-will-never-be-the-same",
    source: "Substack",
  },
  {
    slug: "using-ai-in-job-search-as-a-technical",
    meta: {
      title: "Using AI in Job Search as a Technical Writer",
      date: "2026-09-01",
      coverImage: "/blog/substack-using-ai-in-job-search.png",
      excerpt: "AI go brrr, except not really",
    },
    readingTime: 9,
    externalUrl:
      "https://albertwxu.substack.com/p/using-ai-in-job-search-as-a-technical",
    source: "Substack",
  },
];

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function validateMeta(slug: string, meta: Record<string, unknown>): PostMeta {
  for (const field of REQUIRED_FIELDS) {
    if (typeof meta[field] !== "string" || meta[field].trim() === "") {
      throw new Error(
        `Post '${slug}' is missing required field: ${field}`
      );
    }
  }

  const dateStr = meta.date as string;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error(
      `Post '${slug}' has invalid date format: '${dateStr}'. Expected YYYY-MM-DD.`
    );
  }
  const parsedDate = new Date(`${dateStr}T00:00:00Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== dateStr
  ) {
    throw new Error(
      `Post '${slug}' has invalid calendar date: '${dateStr}'.`
    );
  }

  const coverImage = meta.coverImage as string;
  if (!coverImage.startsWith("/") || coverImage.startsWith("//")) {
    throw new Error(
      `Post '${slug}' coverImage '${coverImage}' must be a local path under public/.`
    );
  }

  const coverPath = path.resolve(PUBLIC_DIR, coverImage.slice(1));
  if (
    !coverPath.startsWith(`${PUBLIC_DIR}${path.sep}`) ||
    !fs.existsSync(coverPath)
  ) {
    throw new Error(
      `Post '${slug}' references coverImage '${coverImage}' but file not found at ${coverPath}`
    );
  }

  return meta as unknown as PostMeta;
}

function validateExternalPost(entry: ExternalPostEntry): Post {
  const meta = validateMeta(
    entry.slug,
    entry.meta as unknown as Record<string, unknown>
  );

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(entry.externalUrl);
  } catch {
    throw new Error(
      `External post '${entry.slug}' has invalid externalUrl: '${entry.externalUrl}'`
    );
  }
  if (parsedUrl.protocol !== "https:") {
    throw new Error(
      `External post '${entry.slug}' externalUrl must use https: '${entry.externalUrl}'`
    );
  }

  if (!Number.isInteger(entry.readingTime) || entry.readingTime <= 0) {
    throw new Error(
      `External post '${entry.slug}' must have a positive integer readingTime.`
    );
  }

  return {
    slug: entry.slug,
    meta,
    readingTime: entry.readingTime,
    externalUrl: entry.externalUrl,
    source: entry.source,
  };
}

function calculateReadingTime(rawContent: string): number {
  const textOnly = rawContent
    .replace(/^export\s+const\s+metadata\s*=\s*\{[\s\S]*?\};?\s*/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/import\s+.*?from\s+['"].*?['"]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[#*`\[\]()!]/g, "");
  const words = textOnly.split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 250);
}

export async function getSlugs(): Promise<string[]> {
  const files = fs.readdirSync(CONTENT_DIR);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function getPost(slug: string): Promise<Post> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const mod = await import(`@content/blog/${slug}.mdx`);
  const meta = validateMeta(slug, mod.metadata);
  const readingTime = calculateReadingTime(raw);
  return { slug, meta, readingTime };
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = await getSlugs();
  const localPosts = await Promise.all(slugs.map(getPost));
  const externalPosts = EXTERNAL_POSTS.map(validateExternalPost);
  const posts = [...localPosts, ...externalPosts];

  const seenSlugs = new Set<string>();
  for (const post of posts) {
    if (seenSlugs.has(post.slug)) {
      throw new Error(`Duplicate blog post slug: '${post.slug}'`);
    }
    seenSlugs.add(post.slug);
  }

  return posts.sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );
}
