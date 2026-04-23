# Blog Section Design

## Overview

Add a blog section to albertxu.com for publishing markdown-authored posts, starting with "How I Used AI to Audit a Cloud Provider's Developer Docs." Posts may be cross-linked from Medium with canonical URL support.

## Content Infrastructure

- MDX files stored in `content/blog/` at the project root
- `next-mdx-remote` parses and renders posts
- Frontmatter schema:
  - `title` (required): Post title
  - `date` (required): Publish date in `YYYY-MM-DD` format
  - `coverImage` (required): Path to cover image in `public/blog/`
  - `excerpt` (required): Short description for the listing page
  - `canonicalUrl` (optional): URL for `<link rel="canonical">` meta tag (for Medium cross-linking)
- Build-time validation: error if any required frontmatter field is missing
- Reading time calculated automatically from word count

## Blog Listing Page (`/blog`)

- `max-w-3xl` container, consistent with rest of site
- Side-by-side layout per entry: thumbnail on the left, text on the right
  - Text: date + reading time, title, excerpt
- Posts sorted by date descending
- Hover effect consistent with existing project cards
- Page title: "Blog"

## Blog Post Page (`/blog/[slug]`)

- Left-aligned header:
  - "Blog" breadcrumb link back to `/blog`
  - Post title (h1)
  - Date + reading time (muted text)
- No byline (authorship is obvious from the site)
- Canonical URL `<link rel="canonical">` meta tag when `canonicalUrl` is set in frontmatter
- Prose styling for rendered markdown:
  - Headings (h2, h3)
  - Paragraphs
  - Ordered and unordered lists
  - Code blocks (inline and fenced)
  - Images with alt text and captions
  - Blockquotes
  - Bold and italic text
  - Horizontal rules
- Mermaid diagrams rendered client-side via the Mermaid JS library
  - Fenced code blocks with `mermaid` language tag are detected and rendered
- Images referenced in posts are stored in `public/blog/`

## Navigation

- Add "Blog" link to the Nav component between "About" and "Resume"

## First Post

- Source: `/Users/albertxu/Documents/career-ops/interview-prep/blog-ai-docs-audit.md`
- Copy into `content/blog/ai-docs-audit.mdx`, converting to MDX format
- Copy `blog-ai-audit-notes.png` and `blog-ai-audit-ia-restructure.png` into `public/blog/`
- Cover image for listing page: to be provided by Albert

## Technical Decisions

- **MDX rendering**: `next-mdx-remote` — well-supported, standard pattern for Next.js blog/docs sites, allows React components in posts if needed
- **Mermaid rendering**: Client-side via Mermaid JS library — simpler than build-time, fewer bugs, primary supported path
- **Cover images**: Required per post, enforced at build time — keeps listing page visually consistent
