export const metadata = {
  title: "LoL Paparazzi",
};

export default function LolPaparazzi() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm text-muted">
        <a href="/projects" className="hover:text-foreground transition-colors">
          &larr; Projects
        </a>
      </p>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        LoL Paparazzi
      </h1>
      <p className="mt-2 text-muted">
        A Discord bot that tracks your friends&apos; ranked games and lets you
        bet on the outcome.
      </p>

      <div className="mt-4 flex gap-3 text-sm">
        <a
          href="https://github.com/xu-albert/lolPaparazzi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-foreground transition-colors"
        >
          GitHub
        </a>
      </div>

      <img
        src="/lol-paparazzi.png"
        alt="LoL Paparazzi Discord bot showing live game tracking"
        className="mt-8 w-full rounded-xl border border-border"
      />

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Background</h2>
        <p className="leading-relaxed">
          Started as a way to track my friend&apos;s ranked progress in League
          of Legends. I had a simple Discord ping bot before, but I thought it
          would be more fun if the bot notified me every time my friend queued up
          for a ranked game.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">What it does</h2>
        <p className="leading-relaxed">
          The bot tracks gaming sessions &mdash; detecting when someone is
          playing games back to back and grouping them into a single session. It
          also has a predictions feature where server members can bet on win/loss
          for live games based on match stats like champion winrates, then
          compete on a leaderboard. Works for multiple players across multiple
          servers, and anyone can deploy it for free.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {["JavaScript", "Discord.js", "PostgreSQL", "Railway"].map((tag) => (
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
