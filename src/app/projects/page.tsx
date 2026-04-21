import Link from "next/link";

export const metadata = {
  title: "Projects",
};

const projects = [
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
  {
    slug: "albertxu-com",
    title: "albertxu.com",
    tagline:
      "This website. Migrated from Squarespace to Next.js on Vercel.",
    tags: ["Next.js", "Tailwind", "Vercel", "Resend"],
  },
];

export default function Projects() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      <p className="mt-2 text-muted">Things I&apos;ve built.</p>

      <div className="mt-10 space-y-6">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group block overflow-hidden rounded-xl border border-border transition-colors hover:border-muted"
          >
            {project.image && (
              <div className="overflow-hidden bg-border/30">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-lg font-semibold">{project.title}</h2>
              <p className="mt-1 text-sm text-muted">{project.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
