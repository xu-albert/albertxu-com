import Link from "next/link";

interface Highlight {
  kind: "Case study" | "Blog";
  // Stored as a display string rather than YYYY-MM: `new Date("2026-07")`
  // parses as UTC midnight and renders as June in US timezones.
  date: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

// A curated shortlist, not a feed. Titles are written for the narrow card —
// they intentionally differ from the titles on the pages they link to.
const highlights: Highlight[] = [
  {
    kind: "Case study",
    date: "July 2026",
    title: "Gonna Rain?",
    description: "Minute-by-minute rain alerts, and the rejection that stalled them.",
    href: "/projects/gonna-rain",
    image: "/gonna-rain.png",
  },
  {
    kind: "Blog",
    date: "April 2026",
    title: "Auditing Docs with AI",
    description:
      "A live docs audit in an interview — what AI caught, and what it didn't.",
    href: "/blog/ai-docs-audit",
    image: "/blog/blog-ai-audit-notes.png",
  },
];

function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 0c0 6.627-5.373 12-12 12 6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
    </svg>
  );
}

export default function WhatsNew() {
  return (
    <section className="animate-fade-up delay-2 rounded-3xl border border-accent/25 bg-accent-soft/40 p-5 sm:p-6">
      <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
        <Sparkle className="h-3.5 w-3.5" />
        What&apos;s new
      </h2>

      {/* Cards keep their own cream background so the badges inside them stay on
          an untinted surface, rather than competing with the panel's tint. */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {highlights.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="project-card group flex flex-col overflow-hidden rounded-2xl border border-border bg-background"
          >
            <div className="h-30 w-full overflow-hidden bg-border/20">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="flex items-center gap-2 text-xs text-muted">
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  {item.kind}
                </span>
                {item.date}
              </p>
              <h3 className="mt-2 font-semibold leading-snug tracking-tight">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
