/*
 * Alternate RepoCard designs — NOT used by default; kept for easy swapping.
 * The live card in use is the default export of `RepoCard.tsx` (native pinned-card + live GitHub stats).
 *
 * To use one of these instead, edit the blog MDX import, e.g.:
 *   import { RepoCardOfficialImage as RepoCard } from "@/components/RepoCard.variants";
 *
 *  - RepoCardGitHubStyle   (B) — GitHub-style card, static description + language
 *  - RepoCardAccent        (C) — terracotta left edge + "View on GitHub"
 *  - RepoCardOfficialImage (D1) — GitHub's own social preview image (most "official")
 */

const REPO_URL = "https://github.com/santifer/career-ops";
const DESC =
  "AI-powered, CLI-agnostic job-search automation: offer evaluation, tailored CV generation, pipeline tracking, and portal scanning.";

const GH_PATH =
  "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z";
const ARROW =
  "M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06z";
const STAR =
  "M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z";

/* B — GitHub-style repo card */
export function RepoCardGitHubStyle() {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose my-6 block rounded-md border border-border bg-background p-4 no-underline transition-colors hover:border-muted"
    >
      <span className="flex items-center gap-2">
        <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" className="shrink-0 fill-muted">
          <path d={GH_PATH} />
        </svg>
        <span className="text-sm font-semibold text-muted">
          santifer / <span className="text-foreground">career-ops</span>
        </span>
      </span>
      <span className="mt-2 block text-[13px] leading-snug text-muted">{DESC}</span>
      <span className="mt-3 flex items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#f1e05a" }} />
          JavaScript
        </span>
        <span className="flex items-center gap-1">
          <svg viewBox="0 0 16 16" width={13} height={13} aria-hidden="true" className="fill-muted">
            <path d={STAR} />
          </svg>
          Open source
        </span>
      </span>
    </a>
  );
}

/* C — terracotta accent feature card */
export function RepoCardAccent() {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose group my-6 flex items-stretch overflow-hidden rounded-xl border border-border bg-background no-underline transition-colors hover:border-muted"
    >
      <span className="w-1 shrink-0 bg-[#b5714e]" />
      <span className="flex items-start gap-3 px-4 py-3.5">
        <svg viewBox="0 0 16 16" width={20} height={20} aria-hidden="true" className="mt-0.5 shrink-0 fill-muted">
          <path d={GH_PATH} />
        </svg>
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold text-foreground">career-ops</span>
          <span className="mt-0.5 block text-xs text-muted">santifer · open-source AI job-search automation</span>
          <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#b5714e]">
            View on GitHub
            <svg viewBox="0 0 16 16" width={11} height={11} aria-hidden="true"
              className="fill-current transition-transform group-hover:translate-x-0.5">
              <path d={ARROW} />
            </svg>
          </span>
        </span>
      </span>
    </a>
  );
}

/* D1 — GitHub's own social preview image (most "official") */
export function RepoCardOfficialImage() {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose my-6 block overflow-hidden rounded-xl border border-border no-underline"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://opengraph.githubassets.com/1/santifer/career-ops"
        alt="santifer/career-ops on GitHub"
        className="block w-full"
      />
    </a>
  );
}
