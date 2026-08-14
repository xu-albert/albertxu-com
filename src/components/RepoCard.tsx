// GitHub's official Open Graph repo card for santifer/career-ops — the social
// preview image GitHub renders (and keeps current) for the repo. This replaces
// the earlier hand-built card + live-stats fetch; alternate designs are kept in
// RepoCard.variants.tsx for easy swapping.

const REPO_URL = "https://github.com/santifer/career-ops";

export default function RepoCard() {
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
