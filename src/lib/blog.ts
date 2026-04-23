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
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const REQUIRED_FIELDS: (keyof PostMeta)[] = [
  "title",
  "date",
  "coverImage",
  "excerpt",
];

function validateMeta(slug: string, meta: Record<string, unknown>): PostMeta {
  for (const field of REQUIRED_FIELDS) {
    if (!meta[field]) {
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

  const coverPath = path.join(
    process.cwd(),
    "public",
    meta.coverImage as string
  );
  if (!fs.existsSync(coverPath)) {
    throw new Error(
      `Post '${slug}' references coverImage '${meta.coverImage}' but file not found at ${coverPath}`
    );
  }

  return meta as unknown as PostMeta;
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
  const posts = await Promise.all(slugs.map(getPost));
  return posts.sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );
}
