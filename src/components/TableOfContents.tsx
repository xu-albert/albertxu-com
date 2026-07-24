"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

// The reading line: a heading is "current" once its top passes this many px
// from the viewport top. The deepest heading past the line wins, so an h3
// naturally takes over from its parent h2 — giving exactly one active item.
const READING_OFFSET = 120;

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Read the rendered article's headings once on mount. Reading the real DOM
  // means the links can never drift out of sync with the heading ids that
  // rehype-slug generated at build time.
  useEffect(() => {
    const article = document.querySelector("article.prose");
    if (!article) return;

    const items = Array.from(article.querySelectorAll("h2, h3"))
      .filter((el): el is HTMLElement => el.id !== "")
      .map((el) => ({
        id: el.id,
        text: el.textContent ?? "",
        level: Number(el.tagName[1]),
      }));

    setHeadings(items);
  }, []);

  // Scroll-spy: track the single deepest heading scrolled past.
  useEffect(() => {
    if (headings.length === 0) return;

    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    let ticking = false;

    const update = () => {
      ticking = false;

      let current = els[0]?.id ?? "";
      for (const el of els) {
        if (el.getBoundingClientRect().top <= READING_OFFSET) current = el.id;
        else break;
      }

      // Near the very bottom, force the last heading active — otherwise short
      // final sections can never reach the reading line.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = els[els.length - 1].id;

      setActiveId(current);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  if (headings.length < 2) return null;

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <aside className="absolute left-full top-0 ml-6 hidden h-full w-48 xl:block">
      <nav className="sticky top-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          On this page
        </p>
        <ul className="text-sm">
          {headings.map((h) => {
            const active = h.id === activeId;
            return (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => handleClick(e, h.id)}
                  className={[
                    "block rounded-md px-2.5 py-1 transition-colors",
                    h.level === 3 ? "pl-5" : "",
                    active
                      ? "bg-accent-soft font-medium text-accent"
                      : "text-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
