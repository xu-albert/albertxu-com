# Article Table of Contents — Design

**Date:** 2026-07-23
**Status:** Approved, implemented on branch `article-toc`

## Goal

Add a docs-style table of contents to long-form articles (blog posts and
projects). It floats in the right gutter and tracks scroll position, like the
navigation on documentation sites.

## Decisions

- **Layout:** The article stays exactly as it is — `max-w-3xl`, centered,
  unchanged. The TOC is an `<aside>` absolutely positioned into the right
  gutter with a `sticky` inner element so it follows the reader.
- **Visibility:** Shown at `xl` and wider (≥1280px). Below that the gutter is
  too narrow, so the TOC is hidden and the article reads as it does today.
- **Depth:** Both `##` (h2) and `###` (h3) headings, with h3 items indented
  under their parent.
- **Active state (style D):** A soft terracotta pill on the single **innermost**
  active heading. When the reader is inside an h3, only that h3 is highlighted —
  not its parent h2. Sections with no subsections highlight their own h2.
- **Palette:** Introduces one new token, `--accent: #b5613f` (terracotta,
  echoing the Potter build timeline) plus `--accent-soft` for the pill fill.

## How it works

1. **Heading ids** — `rehype-slug` is added to the MDX pipeline in
   `next.config.ts`, giving every h2/h3 a stable github-style `id` at build
   time. These are the anchors the TOC links to.
2. **Extraction** — `TableOfContents.tsx` is a client component that reads the
   rendered `article.prose` element's `h2`/`h3` nodes on mount. Reading the real
   DOM guarantees the links match the emitted ids — no separate slug logic to
   keep in sync.
3. **Scroll-spy** — a throttled (rAF) scroll listener finds the deepest heading
   whose top has passed a reading line 120px below the viewport top. Because
   headings are in document order, the last one past the line is the innermost
   current section → exactly one active id. A bottom-of-page guard forces the
   last heading active so short final sections are reachable.
4. **Navigation** — clicking an item smooth-scrolls to the heading;
   `scroll-margin-top: 6rem` on prose headings keeps them clear of the nav.
5. **Guard** — articles with fewer than 2 headings render no TOC.

## Touch points

- `next.config.ts` — add `rehypePlugins: ["rehype-slug"]`
- `src/app/globals.css` — accent tokens + heading `scroll-margin-top`
- `src/components/TableOfContents.tsx` — new client component
- `src/app/blog/[slug]/page.tsx` and `src/app/projects/[slug]/page.tsx` —
  container gets `relative`, component dropped in
- dependency: `rehype-slug@^6`

## Out of scope

- Mobile/tablet TOC (hidden below `xl`).
- Collapsible "On this page" dropdown.
