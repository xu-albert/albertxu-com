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
