export const metadata = {
  title: "albertxu.com",
};

export default function AlbertxuCom() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm text-muted">
        <a href="/projects" className="hover:text-foreground transition-colors">
          &larr; Projects
        </a>
      </p>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">albertxu.com</h1>
      <p className="mt-2 text-muted">
        This website. Migrated from Squarespace to Next.js on Vercel.
      </p>

      <div className="mt-4 flex gap-3 text-sm">
        <a
          href="https://github.com/xu-albert/albertxu-com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-foreground transition-colors"
        >
          GitHub
        </a>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Background</h2>
        <p className="leading-relaxed">
          Originally hosted on Squarespace, but I thought it would be cooler
          (and cheaper) to build it myself and deploy on Vercel. Contact form is
          powered by Resend.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {["Next.js", "Tailwind", "Vercel", "Resend"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
