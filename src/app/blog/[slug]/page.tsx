import Link from "next/link";
import { getPost, getSlugs } from "@/lib/blog";
import TableOfContents from "@/components/TableOfContents";
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
    <div className="relative mx-auto max-w-3xl px-6 py-16">
      <TableOfContents />
      <Link
        href="/blog"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        &larr; Blog
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

      {/* Ported from the project detail page along with the case studies that
          moved here, so the App Store link doesn't disappear in the move.
          Posts without `links` render nothing. */}
      {post.meta.links && Object.keys(post.meta.links).length > 0 && (
        <div className="mt-4 flex gap-3 text-sm">
          {Object.entries(post.meta.links).map(([label, url]) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
            >
              {url.includes("apps.apple.com") && (
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z" />
                </svg>
              )}
              {label}
            </a>
          ))}
        </div>
      )}

      <article className="prose mt-10">
        <Content />
      </article>

      {post.meta.tags && post.meta.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.meta.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
