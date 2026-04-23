# Blog Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a blog section to albertxu.com with MDX-powered posts, Mermaid diagram rendering, and the first published post.

**Architecture:** `@next/mdx` with dynamic imports for MDX rendering. Blog posts live in `content/blog/` as `.mdx` files with exported metadata. A utility module scans the directory, validates frontmatter, and calculates reading time. Client-side Mermaid JS renders diagrams.

**Tech Stack:** `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `remark-gfm`, `@tailwindcss/typography`, `mermaid`

**Refinement from spec:** Using `@next/mdx` with dynamic imports instead of `next-mdx-remote`. This is the official Next.js 16 approach — fewer dependencies, build-time compilation, and native `generateStaticParams` support. Blog post metadata uses JS `export const metadata = {...}` instead of YAML frontmatter.

---

### Task 1: Install dependencies and configure MDX

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`
- Create: `src/mdx-components.tsx`
- Modify: `tsconfig.json`

- [ ] **Step 1: Install MDX and typography dependencies**

Run:
```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx remark-gfm @tailwindcss/typography
```

- [ ] **Step 2: Install Mermaid**

Run:
```bash
npm install mermaid
```

- [ ] **Step 3: Update next.config.ts for MDX support**

Replace `next.config.ts` with:

```ts
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
});

export default withMDX(nextConfig);
```

- [ ] **Step 4: Create mdx-components.tsx**

Create `src/mdx-components.tsx`:

```tsx
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(): MDXComponents {
  return {};
}
```

Note: This will be extended in Task 5 to handle Mermaid code blocks.

- [ ] **Step 5: Add content path alias to tsconfig.json**

Add to `compilerOptions.paths`:

```json
"@content/*": ["./content/*"]
```

Also add `"content"` to the `include` array so MDX files under `content/` are part of the TypeScript project:

```json
"include": [
  "next-env.d.ts",
  "**/*.ts",
  "**/*.tsx",
  ".next/types/**/*.ts",
  ".next/dev/types/**/*.ts",
  "**/*.mts",
  "content/**/*.mdx"
]
```

- [ ] **Step 6: Verify build still passes**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json next.config.ts src/mdx-components.tsx tsconfig.json
git commit -m "feat: configure MDX support with remark-gfm and typography"
```

---

### Task 2: Create blog utility module

**Files:**
- Create: `src/lib/blog.ts`

- [ ] **Step 1: Create src/lib/blog.ts**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/blog.ts
git commit -m "feat: add blog utility module with validation and reading time"
```

---

### Task 3: Create the first blog post

**Files:**
- Create: `content/blog/ai-docs-audit.mdx`
- Move: `public/blog-ai-audit-notes.png` → `public/blog/blog-ai-audit-notes.png`
- Move: `public/blog-ai-audit-ia-restructure.png` → `public/blog/blog-ai-audit-ia-restructure.png`
- Move: `public/blog-ai-audit-ui-tabs.png` → `public/blog/blog-ai-audit-ui-tabs.png`

- [ ] **Step 1: Create public/blog/ directory and move images**

```bash
mkdir -p public/blog
mv public/blog-ai-audit-notes.png public/blog/
mv public/blog-ai-audit-ia-restructure.png public/blog/
mv public/blog-ai-audit-ui-tabs.png public/blog/
```

- [ ] **Step 2: Create content/blog/ directory**

```bash
mkdir -p content/blog
```

- [ ] **Step 3: Create content/blog/ai-docs-audit.mdx**

Convert the source markdown to MDX format:
- Add exported metadata object (title, date, coverImage, excerpt) at the top
- Remove the `# title` and `*By Albert Xu*` lines (rendered by the page template)
- Remove the `---` separator after the byline
- Update image paths from `blog-ai-audit-notes.png` to `/blog/blog-ai-audit-notes.png`
- Keep the mermaid code block as-is (Task 5 handles rendering)

The metadata export should be:

```tsx
export const metadata = {
  title: "How I Used AI to Audit a Cloud Provider's Developer Docs",
  date: "2026-04-23",
  coverImage: "/blog/blog-ai-audit-notes.png",
  excerpt:
    "A cloud infrastructure company asked me to live audit a section of their docs. I used AI to assist — here's what I learned about the process.",
};
```

Note: The coverImage temporarily uses the notes screenshot. Albert should replace this with a dedicated cover image later.

- [ ] **Step 4: Commit**

```bash
git add content/blog/ public/blog/
git commit -m "feat: add first blog post - AI docs audit"
```

---

### Task 4: Create blog listing page

**Files:**
- Create: `src/app/blog/page.tsx`

- [ ] **Step 1: Create src/app/blog/page.tsx**

```tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
};

export default async function Blog() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-muted">Thoughts on writing, docs, and AI.</p>

      <div className="mt-10 space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="project-card group flex items-center gap-5 overflow-hidden rounded-2xl border border-border bg-background p-4"
          >
            <div className="flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-border/20">
              <img
                src={post.meta.coverImage}
                alt={post.meta.title}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-muted">
                  {new Date(post.meta.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  · {post.readingTime} min read
                </p>
                <h2 className="mt-1 text-lg font-semibold leading-snug tracking-tight">
                  {post.meta.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted line-clamp-2">
                  {post.meta.excerpt}
                </p>
              </div>
              <span className="shrink-0 text-muted transition-all duration-200 group-hover:text-foreground group-hover:translate-x-0.5">
                &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/blog/page.tsx
git commit -m "feat: add blog listing page"
```

---

### Task 5: Create Mermaid component and wire into MDX

**Files:**
- Create: `src/components/Mermaid.tsx`
- Modify: `src/mdx-components.tsx`

- [ ] **Step 1: Create src/components/Mermaid.tsx**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  fontFamily: "var(--font-geist-sans)",
});

let idCounter = 0;

export default function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");

  useEffect(() => {
    const id = `mermaid-${idCounter++}`;
    mermaid.render(id, chart).then(({ svg }) => setSvg(svg));
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
```

- [ ] **Step 2: Update src/mdx-components.tsx to handle Mermaid code blocks**

```tsx
import type { MDXComponents } from "mdx/types";
import Mermaid from "@/components/Mermaid";

export function useMDXComponents(): MDXComponents {
  return {
    pre: ({ children, ...props }) => {
      const child = children as React.ReactElement<{
        className?: string;
        children?: string;
      }>;
      if (
        child?.props?.className === "language-mermaid" &&
        typeof child.props.children === "string"
      ) {
        return <Mermaid chart={child.props.children.trim()} />;
      }
      return <pre {...props}>{children}</pre>;
    },
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Mermaid.tsx src/mdx-components.tsx
git commit -m "feat: add Mermaid diagram rendering for MDX code blocks"
```

---

### Task 6: Create blog post page with prose styling

**Files:**
- Create: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Create src/app/blog/[slug]/page.tsx**

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, getSlugs } from "@/lib/blog";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = await getSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    ...(post.meta.canonicalUrl && {
      alternates: { canonical: post.meta.canonicalUrl },
    }),
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  const { default: Content } = await import(`@content/blog/${slug}.mdx`);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/blog"
        className="text-sm font-medium uppercase tracking-widest text-muted transition-colors hover:text-foreground"
      >
        Blog
      </Link>
      <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
        {post.meta.title}
      </h1>
      <p className="mt-3 text-sm text-muted">
        {new Date(post.meta.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        · {post.readingTime} min read
      </p>

      <article className="prose mt-10">
        <Content />
      </article>
    </div>
  );
}
```

- [ ] **Step 2: Add prose styles to globals.css**

Add the `@tailwindcss/typography` plugin import and custom prose overrides at the end of `globals.css`:

```css
@plugin "@tailwindcss/typography";

.prose {
  --tw-prose-body: var(--foreground);
  --tw-prose-headings: var(--foreground);
  --tw-prose-links: var(--foreground);
  --tw-prose-bold: var(--foreground);
  --tw-prose-counters: var(--muted);
  --tw-prose-bullets: var(--muted);
  --tw-prose-hr: var(--border);
  --tw-prose-quotes: var(--foreground);
  --tw-prose-quote-borders: var(--border);
  --tw-prose-captions: var(--muted);
  --tw-prose-code: var(--foreground);
  --tw-prose-pre-code: var(--foreground);
  --tw-prose-pre-bg: var(--border);
  --tw-prose-th-borders: var(--border);
  --tw-prose-td-borders: var(--border);
  max-width: none;
}

.prose img {
  border-radius: 0.75rem;
}

.prose a {
  text-decoration-line: underline;
  text-underline-offset: 2px;
  transition: color 0.15s;
}

.prose a:hover {
  color: var(--muted);
}
```

- [ ] **Step 3: Verify the build passes and the post renders**

Run: `npm run build`
Expected: Build succeeds. The blog post page at `/blog/ai-docs-audit` should be statically generated.

Run: `npm run dev` and visit `http://localhost:3000/blog` and `http://localhost:3000/blog/ai-docs-audit`
Expected: Listing page shows the post with cover image. Post page shows the full article with rendered Mermaid diagram.

- [ ] **Step 4: Commit**

```bash
git add src/app/blog/ src/app/globals.css
git commit -m "feat: add blog post page with prose styling and canonical URL support"
```

---

### Task 7: Add Blog to navigation

**Files:**
- Modify: `src/components/Nav.tsx`

- [ ] **Step 1: Update Nav.tsx**

Add the Blog link between Projects and Contact in the `links` array:

```ts
const links = [
  { href: "/", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
```

- [ ] **Step 2: Verify nav renders correctly**

Run: `npm run dev` and check all viewport sizes.
Expected: Blog link appears between Projects and Contact on both desktop and mobile nav.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.tsx
git commit -m "feat: add Blog link to navigation"
```

---

### Task 8: Final build verification

- [ ] **Step 1: Run a clean build**

```bash
npm run build
```

Expected: Build succeeds. Static pages generated include `/blog` and `/blog/ai-docs-audit`.

- [ ] **Step 2: Test validation catches missing fields**

Temporarily remove the `date` field from `content/blog/ai-docs-audit.mdx` metadata export and run `npm run build`.
Expected: Build fails with error `Post 'ai-docs-audit' is missing required field: date`.
Restore the field after verifying.

- [ ] **Step 3: Test validation catches invalid date format**

Temporarily change `date` to `"April 23, 2026"` and run `npm run build`.
Expected: Build fails with error about invalid date format.
Restore the field after verifying.

- [ ] **Step 4: Add .superpowers/ to .gitignore**

```bash
echo ".superpowers/" >> .gitignore
```

- [ ] **Step 5: Final commit**

```bash
git add .gitignore
git commit -m "chore: add .superpowers/ to gitignore"
```
