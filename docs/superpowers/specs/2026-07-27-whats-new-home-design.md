# "What's new" home section + `/updates` changelog — design

**Date:** 2026-07-27
**Status:** Approved

## Problem

The home page is an about/essay page: hero, three prose sections, closing CTAs. Nothing on it signals that Albert is actively shipping work, and nothing links directly to the newest case study or blog post. Visitors have to guess that `/projects` and `/blog` are worth visiting.

Separately, there is no record of how the site itself has changed over time.

## Goals

Two related but distinct deliverables:

1. **Home page "What's new"** — surface the two most recent pieces of *work* as cards below the hero, so visitors have an obvious reason to go deeper instead of bouncing after the essay.
2. **`/updates`** — a plain changelog for *this website*, linked from the footer.

These are deliberately separate. The home section sells the work; the changelog records what changed on the site. They do not share data, and the home section does not link to `/updates`.

---

## Part 1 — Home page "What's new"

### Layout

First child of the content column in `src/app/page.tsx`, between the hero and "Documentation is an extension of the product."

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

### Animation

The section takes `animate-fade-up delay-2`. The first essay section in `page.tsx` moves from `delay-2` to `delay-3` so the reveal cascade stays in document order.

### Data

A module-level `whatsNew` array at the top of `src/components/WhatsNew.tsx`, following the same pattern as the `projects` array in `src/app/projects/page.tsx`.

```ts
type Highlight = {
  kind: "Case study" | "Blog";
  date: string;        // display string, e.g. "July 2026"
  title: string;
  description: string;
  href: string;        // internal route — every card links to a page
  image: string;       // path under /public
};
```

**Dates are stored as display strings, not `YYYY-MM`.** `new Date("2026-07")` parses as UTC midnight, which renders as **June** in US timezones. Storing the rendered string avoids the class of bug entirely, and costs nothing given the array is hand-edited.

Exactly two entries. This is a curated shortlist, not a feed — adding a third is an edit, not a config change.

#### Seed entries

| kind | date | title | href | image |
|---|---|---|---|---|
| Case study | July 2026 | Potter Journal | `/projects/potter-journal` | `/potter-journal.png` |
| Blog | April 2026 | Auditing Docs with AI | `/blog/ai-docs-audit` | `/blog/blog-ai-audit-notes.png` |

Descriptions:

- Potter Journal — "A photo-first pottery tracker, shipped to the App Store."
- Auditing Docs with AI — "A live docs audit in an interview — what AI caught, and what it didn't."

Card titles are written for the narrow two-column card, not copied from the target page. The blog post's real title is "How I Used AI to Audit a Cloud Provider's Developer Docs", which wraps to four lines at this width; the card says "Auditing Docs with AI". Titles in `whatsNew` are authored per entry and will drift from source titles by design.

### Visual details

- **Type badge:** `bg-accent-soft text-accent`, uppercase, `rounded-full`. Reuses the badge treatment already established in `src/components/TableOfContents.tsx:113`, so it introduces no new visual vocabulary.
- **Badge wording:** "Case study" and "Blog".
- **No header link.** `/updates` is about the site, not the work, so pointing there from this section would mislead. The nav already exposes `/projects` and `/blog`.
- **Images crop.** At 120px tall in a ~376px-wide card the band is roughly 3:1, while the source images are 1.66:1 (Potter Journal) and 0.96:1 (audit notes). `object-cover` crops both. This was reviewed in a browser mockup at true column width and accepted — the crops read as intentional banners.

---

## Part 2 — `/updates` changelog

### Scope

A changelog for **this website only** — not for apps or other projects. Shipping Potter Journal v1.2 does not belong here; publishing a case study about it does, because that changed the site.

Both content and structural changes are listed: new posts and case studies sit alongside feature work like the table of contents. Content entries are also the only ones worth linking, which keeps the page from being a list of things nobody can click.

### Layout

Plain changelog. No badges, no thumbnails, no cards — a month heading with bullets under it, and nested bullets where a change needs detail. Links are underlined text inside the bullet.

```
Updates
What I've changed on this site.

July 2026
  • Added a scroll-tracking table of contents to articles
      • Highlights the section you're currently reading
  • Published a case study on Potter Journal
  • Added a What's new section to the home page

April 2026
  • Launched the blog with the first post, How I Used AI to
    Audit a Cloud Provider's Docs
      • Added Mermaid diagram rendering and reading-time estimates
  • Published a case study on this site's rebuild
  • Added Vercel Web Analytics
```

- Month heading: `text-base font-semibold`, generous top margin, first one unspaced.
- Bullets: `list-disc pl-5 space-y-2`, matching the existing list styling in `src/app/page.tsx:67`.
- Nested bullets: `list-disc pl-5 mt-2 space-y-1 text-sm text-muted`.
- Page shell matches `/blog` and `/projects`: `mx-auto max-w-3xl px-6 py-16`, `h1` at `text-3xl font-bold tracking-tight`, muted subtitle beneath.

### Data

A module-level `changelog` array at the top of `src/app/updates/page.tsx`.

```tsx
type ChangeItem = {
  text: ReactNode;       // JSX, so links sit inline mid-sentence
  details?: ReactNode[]; // nested bullets
};

type ChangelogMonth = {
  month: string;         // "July 2026"
  items: ChangeItem[];
};
```

`text` is `ReactNode` rather than a string plus an `href`. A bullet reads "Published a case study on **Potter Journal**" — the link is a phrase inside the sentence, not the whole bullet. Since the array lives in a `.tsx` file, JSX handles this without inventing a mini-format for partial links.

Newest month first; entries are hand-ordered within a month.

#### Seed content

Derived from git history. Albert should adjust wording — this is a starting point, not a generated artifact.

**July 2026**
- Added a scroll-tracking table of contents to articles
  - Highlights the section you're currently reading
- Published a case study on [Potter Journal](/projects/potter-journal)
  - Added a build timeline graphic and a "What's next" section
- Added a "What's new" section to the home page, and this changelog
- Added a back arrow to blog post links

**April 2026**
- Launched the blog with the first post, [How I Used AI to Audit a Cloud Provider's Docs](/blog/ai-docs-audit)
  - Added Mermaid diagram rendering and reading-time estimates
- Published a case study on [this site's rebuild](/projects/albertxu-com)
- Converted project pages to MDX
- Added Vercel Web Analytics

Speed Insights is deliberately absent — `@vercel/speed-insights` is not in `package.json`, so listing it would be inaccurate.

### Discovery

Footer only, not the nav. `src/components/Footer.tsx` currently has the copyright on the left and two external social links on the right. Add "Updates" as an internal text link after the copyright, separated by a middot:

```
© 2026 Albert Xu · Updates                    LinkedIn  GitHub
```

It stays out of the social-icon group, which is for external links with icons.

---

## Components

| File | Change | Purpose |
|---|---|---|
| `src/components/WhatsNew.tsx` | new | Owns the `whatsNew` array and renders the home section. Server component, no client JS. |
| `src/app/page.tsx` | edit | Render `<WhatsNew />`; bump the first essay section to `delay-3`. |
| `src/app/updates/page.tsx` | new | Owns the `changelog` array and renders it. Server component. |
| `src/components/Footer.tsx` | edit | Add the `/updates` link. |

Each array lives next to its only consumer, matching how `src/app/projects/page.tsx` already holds its own `projects` array. Neither file needs a shared `lib` module, because nothing else reads them.

## Non-goals

- Deriving either list from `content/`. Hardcoded is the explicit ask.
- A shared data source between the home cards and the changelog. They cover different subjects and would only be coupled by coincidence.
- Changelog entries for apps and projects that aren't this website.
- `/updates` in the top nav.
- Pagination, filtering, tags, or RSS.

## Verification

No new tests. Both pages are static markup over literal arrays, so `npm run build` (which type-checks and lints) plus a visual check at desktop and mobile widths is sufficient.

Specifically confirm:

- Both `href` values in `whatsNew` resolve to existing routes, and both `image` paths to existing files under `public/`.
- Every link in the changelog resolves.
- `/updates` renders and is reachable from the footer on every page.
- The home page fade-up cascade runs hero → What's new → essay, with no two sections sharing a delay.
