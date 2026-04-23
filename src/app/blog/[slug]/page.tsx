import Link from "next/link";
import { getPost, getSlugs } from "@/lib/blog";
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
