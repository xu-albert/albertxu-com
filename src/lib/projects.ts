import fs from "fs";
import path from "path";

export interface ProjectMeta {
  title: string;
  tagline: string;
  image?: string;
  tags: string[];
  links: Record<string, string>;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

export async function getProjectSlugs(): Promise<string[]> {
  const files = fs.readdirSync(CONTENT_DIR);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function getProject(
  slug: string
): Promise<{ slug: string; meta: ProjectMeta }> {
  const mod = await import(`@content/projects/${slug}.mdx`);
  return { slug, meta: mod.metadata };
}
