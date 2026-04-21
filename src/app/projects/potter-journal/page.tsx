export const metadata = {
  title: "Potter Journal",
};

export default function PotterJournal() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm text-muted">
        <a href="/projects" className="hover:text-foreground transition-colors">
          &larr; Projects
        </a>
      </p>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Potter Journal
      </h1>
      <p className="mt-2 text-muted">
        A photo-first pottery tracker, live on the App Store.
      </p>

      <div className="mt-4 flex gap-3 text-sm">
        <a
          href="https://apps.apple.com/us/app/potter-journal/id6759199150"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-foreground transition-colors"
        >
          App Store
        </a>
        <a
          href="https://github.com/xu-albert/pottery-tracker"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-foreground transition-colors"
        >
          GitHub
        </a>
      </div>

      <img
        src="/potter-journal.png"
        alt="Potter Journal app screenshots"
        className="mt-8 w-full rounded-xl border border-border"
      />

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Background</h2>
        <p className="leading-relaxed">
          I wanted an app to track my pottery projects but couldn&apos;t find one
          that captured what I was looking for. So I made my own.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">What it does</h2>
        <p className="leading-relaxed">
          Potter Journal is a photo-first pottery tracker that follows each piece
          through its stages &mdash; thrown, bisqued, glazed. It has an album
          display for browsing your work and Firebase-backed cloud login so you
          don&apos;t lose your data if you lose your device.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {["Flutter", "Dart", "Firebase"].map((tag) => (
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
