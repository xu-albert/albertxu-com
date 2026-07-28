# "What's new" home page section — design

**Date:** 2026-07-27
**Status:** Approved

## Problem

The home page is an about/essay page: hero, three prose sections, closing CTAs. Nothing on it signals that Albert is actively shipping work, and nothing links directly to the newest case study or blog post. Visitors have to guess that `/projects` and `/blog` are worth visiting.

## Goal

Surface the two most recent pieces of work directly below the hero, as clickable cards, so visitors have an obvious reason to go deeper instead of bouncing after the essay.

## Scope

Two hardcoded entries. Every entry links to a page on albertxu.com — no external links. Updating the section means editing an array by hand; there is no CMS, no feed, and no automatic derivation from `content/`.

## Layout

The section is the first child of the content column in `src/app/page.tsx`, sitting between the hero and the "Documentation is an extension of the product." section.

```
┌──────────────────────────────────┐
│  [photo]   Hi, I'm Albert.       │   hero (unchanged)
│            Technical Writer…     │
│            [Samples] [Contact]   │
└──────────────────────────────────┘

  What's new

  ┌────────────────┐ ┌────────────────┐
  │ [  image     ] │ │ [  image     ] │   120px cover band
  ├────────────────┤ ├────────────────┤
  │ ‹Case study›   │ │ ‹Blog›         │   badge + date
  │ Potter Journal │ │ Auditing Docs… │   title
  │ A photo-first… │ │ A live docs…   │   description
  └────────────────┘ └────────────────┘

  Documentation is an extension of the product.   (essay continues)
```

- Grid: `grid-cols-1 sm:grid-cols-2 gap-4`. Stacks to a single column on mobile.
- Cards: `next/link`, `.project-card` (existing lift + shadow hover), `rounded-2xl border border-border overflow-hidden`.
- Image band: 120px tall, full card width, `object-cover`.
- Body padding: `p-4`.

## Animation

The section takes `animate-fade-up delay-2`. The first essay section in `page.tsx` moves from `delay-2` to `delay-3` so the reveal cascade stays in document order.

## Data

A module-level `updates` array at the top of `src/components/WhatsNew.tsx`, following the same pattern as the `projects` array in `src/app/projects/page.tsx`.

```ts
type Update = {
  kind: "Case study" | "Blog";
  date: string;        // display string, e.g. "July 2026"
  title: string;
  description: string;
  href: string;        // internal route
  image: string;       // path under /public
};
```

**Dates are stored as display strings, not `YYYY-MM`.** `new Date("2026-07")` parses as UTC midnight, which renders as **June** in US timezones. Storing the rendered string avoids the class of bug entirely, and costs nothing given the array is hand-edited.

### Seed entries

| kind | date | title | href | image |
|---|---|---|---|---|
| Case study | July 2026 | Potter Journal | `/projects/potter-journal` | `/potter-journal.png` |
| Blog | April 2026 | Auditing Docs with AI | `/blog/ai-docs-audit` | `/blog/blog-ai-audit-notes.png` |

Descriptions:

- Potter Journal — "A photo-first pottery tracker, shipped to the App Store."
- Auditing Docs with AI — "A live docs audit in an interview — what AI caught, and what it didn't."

Card titles are written for the narrow two-column card, not copied from the target page. The blog post's real title is "How I Used AI to Audit a Cloud Provider's Developer Docs", which wraps to four lines at this width; the card says "Auditing Docs with AI". Titles in the `updates` array are therefore authored per entry and will drift from source titles by design.

## Visual details

- **Type badge:** `bg-accent-soft text-accent`, uppercase, `rounded-full`. Reuses the badge treatment already established in `src/components/TableOfContents.tsx:113`, so it introduces no new visual vocabulary.
- **Badge wording:** "Case study" and "Blog".
- **No header link.** A single "All projects →" would point at only half the content, and it competes with the two cards for the click. The nav already exposes both `/projects` and `/blog`.
- **Images crop.** At 120px tall in a ~376px-wide card the band is roughly 3:1, while the source images are 1.66:1 (Potter Journal) and 0.96:1 (audit notes). `object-cover` crops both. This was reviewed in a browser mockup at true column width and accepted — the crops read as intentional banners.

## Components

| File | Change | Purpose |
|---|---|---|
| `src/components/WhatsNew.tsx` | new | Owns the `updates` array and renders the section. Server component, no client JS. |
| `src/app/page.tsx` | edit | Import and render `<WhatsNew />`; bump the first essay section to `delay-3`. |

`WhatsNew` takes no props. It is understandable without reading `page.tsx`, and `page.tsx` does not depend on its internals.

## Non-goals

- Deriving entries from `content/blog` or `content/projects`. Hardcoded is the explicit ask; automation can come later once the shape is proven.
- External links (App Store releases, talks, guest posts).
- A dedicated `/updates` or changelog page.
- Pagination, filtering, or a "show more" control.

## Verification

No new tests. The section is static markup over a literal array, so `npm run build` (which type-checks and lints) plus a visual check at desktop and mobile widths is sufficient. Both `href` values must resolve to existing routes, and both `image` paths to existing files under `public/`.
