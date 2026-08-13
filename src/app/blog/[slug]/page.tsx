import Link from "next/link";
import { getPost, getSlugs } from "@/lib/blog";
import TableOfContents from "@/components/TableOfContents";
import MetaLinks from "@/components/MetaLinks";
import TagList from "@/components/TagList";
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
      <MetaLinks links={post.meta.links} />

      {/* Same idea for the screenshot the project pages showed above the body.
          It is opt-in per post: `coverImage` is the index thumbnail and is not
          always a hero, so a post only gets one when it says so. */}
      {post.meta.heroImage && (
        <img
          src={post.meta.heroImage}
          alt={post.meta.title}
          className="mt-8 w-full rounded-xl border border-border shadow-lg shadow-foreground/5"
        />
      )}

      <article className="prose mt-10">
        <Content />
      </article>

      <TagList tags={post.meta.tags} />
    </div>
  );
}
