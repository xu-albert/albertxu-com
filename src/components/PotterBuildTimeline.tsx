// Self-contained, theme-aware horizontal build timeline for the Potter Journal
// case study. Colors come from CSS variables (--foreground / --muted / --border /
// --background) so it follows whatever theme the site uses. The single accent
// (terracotta) nods to the clay/pottery subject and reads well on light or dark.
//
// It sits above the detailed week-by-week sections as a glanceable overview, so
// the blurbs here are deliberately terse — the prose below carries the detail.
// On narrow screens the track scrolls horizontally.

const ACCENT = "#b5714e"; // terracotta — the "shipped" milestone

interface Phase {
  label: string;
  title: string;
  dates: string;
  blurb: string;
  milestone?: boolean;
  gapBefore?: boolean; // a ~2-month pause precedes this phase
}

const PHASES: Phase[] = [
  {
    label: "Week 1",
    title: "Local-only MVP",
    dates: "Feb 12–13",
    blurb: "SQLite, album grid, saved-options libraries",
  },
  {
    label: "Week 2",
    title: "Auth, telemetry, CI",
    dates: "Feb 14–15",
    blurb: "Firebase auth, analytics, CI builds",
  },
  {
    label: "Week 3",
    title: "Sync hardening",
    dates: "Feb 17–18",
    blurb: "54 sync tests, encrypted database",
  },
  {
    label: "Week 4",
    title: "App Store readiness",
    dates: "Feb 19–22",
    blurb: "Cupertino polish, compliance, edge cases",
  },
  {
    label: "Launch",
    title: "Rename & ship",
    dates: "Feb 27–28",
    blurb: "Renamed, submitted, v1.0.2 live",
    milestone: true,
  },
  {
    label: "1.1",
    title: "Searchable pickers",
    dates: "Apr 23–27",
    blurb: "Searchable clay & glaze pickers",
    gapBefore: true,
  },
];

export default function PotterBuildTimeline() {
  const last = PHASES.length - 1;

  return (
    <section className="not-prose my-8">
      <div className="overflow-x-auto pb-2">
        <ol className="flex min-w-[620px] items-stretch gap-1">
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
                      : { height: 10, width: 10, background: "var(--muted)" }
                  }
                />
                {phase.gapBefore && (
                  <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-background px-1 text-[10px] italic text-muted">
                    ~2 months
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
        Two focused weeks from first commit to a submittable build, then a 1.1
        once the app had earned its own feedback.
      </p>
    </section>
  );
}
