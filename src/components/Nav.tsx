"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border">
      <nav className="mx-auto max-w-3xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Albert Xu
          </Link>
          <ul className="hidden gap-6 text-sm font-medium sm:flex">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={
                    pathname === href
                      ? "text-foreground"
                      : "text-muted hover:text-foreground transition-colors"
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden text-muted hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out sm:hidden ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <ul className="overflow-hidden flex flex-col gap-3 text-sm font-medium">
            <li className="mt-3" />
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={
                    pathname === href
                      ? "text-foreground"
                      : "text-muted hover:text-foreground transition-colors"
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="pb-1" />
          </ul>
        </div>
      </nav>
    </header>
  );
}
