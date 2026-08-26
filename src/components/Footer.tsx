import Link from "next/link";
import { GitHubIcon, LinkedInIcon } from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 text-sm text-muted">
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
        </div>
      </div>
    </footer>
  );
}
