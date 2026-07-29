// Horizontal build timeline for the Gonna Rain? case study, mirroring
// PotterBuildTimeline. Colors come from CSS variables so it follows the site
// theme; the single accent is a deep sky blue that nods to the app's own cyan
// while staying legible on the cream background.
//
// This timeline has something the pottery one doesn't: a setback. The March
// rejection is drawn as a hollow node so the eye reads it as a stop rather than
// a ship, and the four-month gap after it is a dashed connector.
//
// On narrow screens the track scrolls horizontally.

const ACCENT = "#1c7cb0"; // deep sky blue — the "shipped" milestone

interface Phase {
  label: string;
  title: string;
  dates: string;
  blurb: string;
  milestone?: boolean;
  setback?: boolean;
  gapBefore?: string; // a pause precedes this phase; the string labels it
}

const PHASES: Phase[] = [
  {
    label: "Week 1",
    title: "First build",
    dates: "Feb 18",
    blurb: "WeatherKit charts, background refresh",
  },
  {
    label: "Week 2",
    title: "Notification logic",
    dates: "Feb 25",
    blurb: "Two-pass confirmation, adaptive polling",
  },
  {
    label: "Week 3",
    title: "Backend & rename",
    dates: "Mar 2–6",
    blurb: "Cloudflare Worker, grid dedup",
  },
  {
    label: "Submitted",
    title: "Rejected — 5.2.5",
    dates: "Mar 11",
    blurb: "Apple Weather attribution not visible",
    setback: true,
  },
  {
    label: "Releases 1–2",
    title: "Root cause & rebuild",
    dates: "Jul 24",
    blurb: "Attribution fix, Live Activities",
    gapBefore: "~4 months",
  },
  {
    label: "Launch",
    title: "Approved",
    dates: "Jul 25",
    blurb: "Live on the App Store; 1.1 two days later",
    milestone: true,
  },
  {
    label: "1.1.1",
    title: "Snow gets its own look",
    dates: "Jul 27",
    blurb: "Wintry palette — built, not yet shipped",
  },
];

export default function RainBuildTimeline() {
  const last = PHASES.length - 1;

  return (
    <section className="not-prose my-8">
      <div className="overflow-x-auto pb-2">
        <ol className="flex min-w-[720px] items-stretch gap-1">
          {PHASES.map((phase, i) => (
            <li key={phase.label} className="flex flex-1 flex-col text-center">
              {/* eyebrow: phase + dates */}
              <div className="font-mono text-[10px] uppercase leading-tight tracking-wider text-muted">
                <div className="font-medium text-foreground/70">{phase.label}</div>
                <div>{phase.dates}</div>
              </div>

              {/* axis: connectors behind a centered node */}
              <div className="relative my-2 flex h-4 items-center justify-center">
                {i > 0 && (
                  <span
                    className={`absolute left-0 top-1/2 w-1/2 -translate-y-1/2 border-t border-border ${
                      phase.gapBefore ? "border-dashed" : ""
                    }`}
                  />
                )}
                {i < last && (
                  <span
                    className={`absolute right-0 top-1/2 w-1/2 -translate-y-1/2 border-t border-border ${
                      PHASES[i + 1]?.gapBefore ? "border-dashed" : ""
                    }`}
                  />
                )}
                <span
                  className="relative z-10 rounded-full"
                  style={
                    phase.milestone
                      ? {
                          height: 14,
                          width: 14,
                          background: ACCENT,
                          boxShadow: `0 0 0 4px color-mix(in srgb, ${ACCENT} 18%, transparent)`,
                        }
                      : phase.setback
                        ? {
                            height: 12,
                            width: 12,
                            background: "var(--background)",
                            border: "2px solid var(--muted)",
                          }
                        : { height: 10, width: 10, background: "var(--muted)" }
                  }
                />
                {phase.gapBefore && (
                  <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-background px-1 text-[10px] italic text-muted">
                    {phase.gapBefore}
                  </span>
                )}
              </div>

              {/* title + blurb */}
              <h3
                className="px-1 text-sm font-medium leading-snug text-foreground"
                style={phase.milestone ? { color: ACCENT } : undefined}
              >
                {phase.title}
              </h3>
              <p className="mt-1 px-1 text-xs leading-relaxed text-muted">
                {phase.blurb}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Three weeks to something submittable, one rejection, four months of
        nothing, then a single day to work out what Apple had been asking for
        all along.
      </p>
    </section>
  );
}
