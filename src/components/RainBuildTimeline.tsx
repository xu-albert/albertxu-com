// Horizontal build timeline for the Gonna Rain? case study, mirroring
// PotterBuildTimeline. Colors come from CSS variables so it follows the site
// theme; the single accent is a deep sky blue that nods to the app's own cyan
// while staying legible on the cream background.
//
// The pause in the middle is drawn as a dashed connector and nothing else —
// it was nothing more interesting than being busy elsewhere, and the dates on
// either side already say how long it was.
//
// On narrow screens the track scrolls horizontally.
// TK the comment above says the pause "was nothing more interesting than being busy elsewhere", but 13eea28 tells it as a 5.2.5 rejection, a resubmission, and a second rejection. which version is true is your memory, not ours. if the rejection goes back into the case study, this comment and a missing timeline phase between Submitted (Mar 11) and Picked it back up (Jul 24) both need to follow.

const ACCENT = "#1c7cb0"; // deep sky blue — the "shipped" milestone

interface Phase {
  label: string;
  title: string;
  dates: string;
  milestone?: boolean;
  pauseBefore?: boolean; // a pause precedes this phase — dashes the connector
}

const PHASES: Phase[] = [
  { label: "Week 1", title: "First build", dates: "Feb 18" },
  { label: "Week 2", title: "Notifications", dates: "Feb 25" },
  { label: "Week 3", title: "A server to watch the sky", dates: "Mar 2–6" },
  { label: "Submitted", title: "First submission", dates: "Mar 11" },
  {
    label: "July",
    title: "Picked it back up",
    dates: "Jul 24",
    pauseBefore: true,
  },
  {
    label: "Launch",
    title: "On the App Store",
    dates: "Jul 25",
    milestone: true,
  },
  { label: "1.1.1", title: "Snow", dates: "Jul 27" },
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
                      phase.pauseBefore ? "border-dashed" : ""
                    }`}
                  />
                )}
                {i < last && (
                  <span
                    className={`absolute right-0 top-1/2 w-1/2 -translate-y-1/2 border-t border-border ${
                      PHASES[i + 1]?.pauseBefore ? "border-dashed" : ""
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
              </div>

              {/* title */}
              <h3
                className="px-1 text-sm font-medium leading-snug text-foreground"
                style={phase.milestone ? { color: ACCENT } : undefined}
              >
                {phase.title}
              </h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
