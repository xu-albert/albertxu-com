import Link from "next/link";
import { formatPostDate, getAllPosts, type Post } from "@/lib/blog";

export const metadata = {
  title: "Blog",
};

const CARD_CLASS_NAME =
  "project-card group flex items-center gap-5 overflow-hidden rounded-2xl border border-border bg-background p-4";

function BlogCardContent({ post }: { post: Post }) {
  const isExternal = Boolean(post.externalUrl);

  return (
    <>
      <div className="flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-border/20">
        <img
          src={post.meta.coverImage}
          alt={post.meta.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted">
            {formatPostDate(post.meta.date)} · {post.readingTime} min read
            {post.source ? ` · ${post.source}` : ""}
          </p>
          <h2 className="mt-1 text-lg font-semibold leading-snug tracking-tight">
            {post.meta.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted line-clamp-2">
            {post.meta.excerpt}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="shrink-0 text-muted transition-all duration-200 group-hover:text-foreground group-hover:translate-x-0.5"
        >
          {isExternal ? "\u2197" : "\u2192"}
        </span>
        {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
      </div>
    </>
  );
}

export default async function Blog() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-muted">Thoughts on writing, docs, and AI.</p>

      <div className="mt-10 space-y-4">
        {posts.map((post) =>
          post.externalUrl ? (
            <a
              key={post.slug}
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={CARD_CLASS_NAME}
            >
              <BlogCardContent post={post} />
            </a>
          ) : (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={CARD_CLASS_NAME}
            >
              <BlogCardContent post={post} />
            </Link>
          )
        )}
      </div>
    </div>
  );
}
