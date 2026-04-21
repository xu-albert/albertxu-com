export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 text-sm text-muted">
        <span>&copy; {new Date().getFullYear()} Albert Xu</span>
        <div className="flex gap-4">
          <a
            href="https://linkedin.com/in/albertwxu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/xu-albert"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
