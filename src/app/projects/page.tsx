import Link from "next/link";

export const metadata = {
  title: "Projects",
};

const projects = [
  {
    slug: "albertxu-com",
    title: "albertxu.com",
    tagline:
      "This website. Migrated from Squarespace to Next.js on Vercel.",
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
    imagePosition: "center" as const,
    tags: ["JavaScript", "Discord.js", "PostgreSQL", "Railway"],
  },
];

export default function Projects() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      <p className="mt-2 text-muted">
        Things I&apos;ve built.{" "}
        <a
          href="https://github.com/xu-albert"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline underline-offset-2 transition-colors hover:text-foreground"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub
        </a>
      </p>

      <div className="mt-10 space-y-4">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="project-card group flex items-center gap-5 overflow-hidden rounded-2xl border border-border bg-background p-4"
          >
            {project.image ? (
              <div className="flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-border/20">
                <img
                  src={project.image}
                  alt={project.title}
                  className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="flex h-24 w-40 shrink-0 items-center justify-center rounded-xl bg-border/20 font-mono text-lg text-muted/30">
                &lt;/&gt;
              </div>
            )}
            <div className="flex flex-1 items-center gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold tracking-tight">
                  {project.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {project.tagline}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-foreground/[0.06] px-2.5 py-0.5 text-xs font-medium text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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
