"use client";

import { useEffect, useState } from "react";

const REPO_URL = "https://github.com/santifer/career-ops";
const API_URL = "https://api.github.com/repos/santifer/career-ops";

const REPO_PATH =
  "M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z";
const STAR_PATH =
  "M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z";
const FORK_PATH =
  "M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z";

const LANG_COLOR: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

const FALLBACK_DESC =
  "AI-powered, CLI-agnostic job-search automation — offer evaluation, tailored CVs, pipeline tracking, and portal scanning.";
const FALLBACK_LANG = "JavaScript";

function compact(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n);
}

type Repo = {
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
};

export default function RepoCard() {
  const [repo, setRepo] = useState<Repo | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(API_URL, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Repo) => {
        if (alive) setRepo(d);
      })
      .catch(() => {
        /* rate-limited or offline — card still renders without live stats */
      });
    return () => {
      alive = false;
    };
  }, []);

  const description = repo?.description || FALLBACK_DESC;
  const language = repo?.language || FALLBACK_LANG;
  const dot = LANG_COLOR[language] || "#8a7d70";

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose my-6 block max-w-[440px] rounded-md border border-border bg-[color-mix(in_srgb,var(--background),white_40%)] p-4 no-underline transition-colors hover:border-muted"
    >
      <span className="flex items-center gap-2">
        <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" className="shrink-0 fill-muted">
          <path d={REPO_PATH} />
        </svg>
        <span className="text-sm">
          <span className="text-muted">santifer / </span>
          <span className="font-semibold text-[#b5714e]">career-ops</span>
        </span>
        <span className="ml-auto rounded-full border border-border px-2 py-[1px] text-[10px] font-medium text-muted">
          Public
        </span>
      </span>

      <span className="mt-2 line-clamp-2 block text-[12.5px] leading-snug text-muted">{description}</span>

      <span className="mt-3 flex items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: dot }} />
          {language}
        </span>
        {repo && (
          <>
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 16 16" width={13} height={13} aria-hidden="true" className="fill-muted">
                <path d={STAR_PATH} />
              </svg>
              {compact(repo.stargazers_count)}
            </span>
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 16 16" width={13} height={13} aria-hidden="true" className="fill-muted">
                <path d={FORK_PATH} />
              </svg>
              {compact(repo.forks_count)}
            </span>
          </>
        )}
      </span>
    </a>
  );
}
