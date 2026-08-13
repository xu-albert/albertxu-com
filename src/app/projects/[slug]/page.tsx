import Link from "next/link";
import { getProjectSlugs, getProject } from "@/lib/projects";
import TableOfContents from "@/components/TableOfContents";
import MetaLinks from "@/components/MetaLinks";
import TagList from "@/components/TagList";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project.meta.title };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  const { default: Content } = await import(
    `@content/projects/${slug}.mdx`
  );

  return (
    <div className="relative mx-auto max-w-3xl px-6 py-16">
      <TableOfContents />
      <Link
        href="/projects"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        &larr; Projects
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        {project.meta.title}
      </h1>
      <p className="mt-2 text-muted">{project.meta.tagline}</p>

      <MetaLinks links={project.meta.links} />

      {project.meta.image && (
        <img
          src={project.meta.image}
          alt={project.meta.title}
          className="mt-8 w-full rounded-xl border border-border shadow-lg shadow-foreground/5"
        />
      )}

      <article className="prose mt-10">
        <Content />
      </article>

      <TagList tags={project.meta.tags} />
    </div>
  );
}
