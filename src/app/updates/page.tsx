import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "Site updates",
};

interface Change {
  // ReactNode rather than a string + href, because links are usually a phrase
  // inside the sentence rather than the whole bullet.
  text: ReactNode;
  details?: ReactNode[];
}

// This page isn't MDX, so `.prose a` doesn't apply — links carry their own style.
function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="underline underline-offset-2 transition-colors hover:text-muted"
    >
      {children}
    </Link>
  );
}

interface Month {
  month: string;
  changes: Change[];
}

// Newest first, both across months and within each month. This is a changelog
// for the site itself — publishing a post or case study counts, shipping an app
// that lives elsewhere doesn't.
const changelog: Month[] = [
  {
    month: "July 2026",
    changes: [
      {
        text: "Added a What's new section to the home page",
        details: [
          "Surfaces the two most recent things I've published as cards",
          "Added this Site updates page linked from the footer",
        ],
      },
      {
        text: "Added a scroll-tracking table of contents to articles",
        details: ["Highlights the section you're currently reading"],
      },
      {
        text: (
          <>
            Published a case study on{" "}
            <A href="/projects/potter-journal">Potter Journal</A>
          </>
        ),
        details: [
          'Added a build timeline graphic and a "What\'s next" section',
        ],
      },
      { text: "Added a back arrow to blog post links" },
    ],
  },
  {
    month: "April 2026",
    changes: [
      { text: "Added Vercel Web Analytics" },
      {
        text: (
          <>
            Published a case study on{" "}
            <A href="/projects/albertxu-com">this site&apos;s rebuild</A>
          </>
        ),
      },
      { text: "Converted project pages to MDX" },
      {
        text: (
          <>
            Launched the blog with the first post,{" "}
            <A href="/blog/ai-docs-audit">
              How I Used AI to Audit a Cloud Provider&apos;s Docs
            </A>
          </>
        ),
        details: ["Added Mermaid diagram rendering and reading-time estimates"],
      },
      {
        text: "Launched site! 🎉",
        details: [
          "Rebuilt from scratch in Next.js and Tailwind, deployed on Vercel",
        ],
      },
    ],
  },
];

export default function Updates() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Site updates</h1>
      <p className="mt-2 text-muted">A running changelog, newest first.</p>

      <div className="mt-10 space-y-10">
        {changelog.map((entry) => (
          <section key={entry.month}>
            <h2 className="font-semibold">{entry.month}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {entry.changes.map((change, i) => (
                <li key={i} className="leading-relaxed">
                  {change.text}
                  {change.details && (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                      {change.details.map((detail, j) => (
                        <li key={j}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
