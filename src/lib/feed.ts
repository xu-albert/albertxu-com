import { getAllPosts } from "./blog";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  image?: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  {
    slug: "gonna-rain",
    title: "Gonna Rain?",
    tagline: "Minute-by-minute rain alerts for iOS, live on the App Store.",
    image: "/gonna-rain.png",
    tags: ["Swift", "SwiftUI", "WeatherKit", "Cloudflare Workers"],
  },
  {
    slug: "albertxu-com",
    title: "albertxu.com",
    tagline: "This website. Migrated from Squarespace to Next.js on Vercel.",
    image: "/albertxu-com.png",
    tags: ["Next.js", "Tailwind", "Vercel", "Resend"],
  },
  {
    slug: "potter-journal",
    title: "Potter Journal",
    tagline: "A photo-first pottery tracker, live on the App Store.",
    image: "/potter-journal.png",
    tags: ["Flutter", "Dart", "Firebase"],
  },
  {
    slug: "lol-paparazzi",
    title: "LoL Paparazzi",
    tagline:
      "A Discord bot that tracks your friends' ranked games and lets you bet on the outcome.",
    image: "/lol-paparazzi.png",
    tags: ["JavaScript", "Discord.js", "PostgreSQL", "Railway"],
  },
];

// The one place the feed order lives: newest first, by hand. Projects carry no
// dates, so nothing here is inferred — rearranging this list rearranges the
// page. Anything missing from it fails the build rather than quietly vanishing.
const ORDER: { type: "project" | "blog"; slug: string }[] = [
  { type: "project", slug: "gonna-rain" },
  { type: "blog", slug: "ai-docs-audit" },
  { type: "project", slug: "albertxu-com" },
  { type: "project", slug: "potter-journal" },
  { type: "project", slug: "lol-paparazzi" },
];

interface BaseEntry {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  image?: string;
}

export type FeedEntry =
  | (BaseEntry & { type: "project"; tags: string[] })
  | (BaseEntry & { type: "blog"; image: string; date: string; readingTime: number });

function listed(type: "project" | "blog", slug: string): boolean {
  return ORDER.some((e) => e.type === type && e.slug === slug);
}

/**
 * The /projects feed: projects and blog posts in one hand-ordered list.
 *
 * Throws at build time if ORDER and the underlying content disagree in either
 * direction, so a new post can't be published into a void.
 */
export async function getFeed(): Promise<FeedEntry[]> {
  const posts = await getAllPosts();

  for (const post of posts) {
    if (!listed("blog", post.slug)) {
      throw new Error(
        `Blog post '${post.slug}' is not in ORDER (src/lib/feed.ts). ` +
          `Add it so it appears on /projects.`
      );
    }
  }
  for (const project of PROJECTS) {
    if (!listed("project", project.slug)) {
      throw new Error(
        `Project '${project.slug}' is not in ORDER (src/lib/feed.ts). ` +
          `Add it so it appears on /projects.`
      );
    }
  }

  return ORDER.map((entry): FeedEntry => {
    if (entry.type === "project") {
      const project = PROJECTS.find((p) => p.slug === entry.slug);
      if (!project) {
        throw new Error(
          `ORDER lists project '${entry.slug}', which has no entry in PROJECTS.`
        );
      }
      return {
        type: "project",
        slug: project.slug,
        href: `/projects/${project.slug}`,
        title: project.title,
        excerpt: project.tagline,
        image: project.image,
        tags: project.tags,
      };
    }

    const post = posts.find((p) => p.slug === entry.slug);
    if (!post) {
      throw new Error(
        `ORDER lists blog post '${entry.slug}', which has no file at content/blog/${entry.slug}.mdx.`
      );
    }
    return {
      type: "blog",
      slug: post.slug,
      href: `/blog/${post.slug}`,
      title: post.meta.title,
      excerpt: post.meta.excerpt,
      image: post.meta.coverImage,
      date: post.meta.date,
      readingTime: post.readingTime,
    };
  });
}
