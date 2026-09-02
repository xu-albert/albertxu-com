import Link from "next/link";
import { GitHubIcon, LinkedInIcon, SubstackIcon } from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-4 text-sm text-muted">
        <span>
          &copy; {new Date().getFullYear()} Albert Xu
          <span className="px-2 text-border">&middot;</span>
          <Link
            href="/updates"
            className="hover:text-foreground transition-colors"
          >
            Site updates
          </Link>
        </span>
        <div className="flex gap-4">
          <a
            href="https://www.linkedin.com/in/albertxu451/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
          <a
            href="https://github.com/xu-albert"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <GitHubIcon />
            GitHub
          </a>
          <a
            href="https://albertwxu.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <SubstackIcon />
            Substack
          </a>
        </div>
      </div>
    </footer>
  );
}
