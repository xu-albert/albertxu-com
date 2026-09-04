<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Building, linting, and testing

`npm run build` needs no environment variables. The site has no API routes and no server-side
secrets — everything under `src/app/` is statically prerendered.

`npm run lint` is not clean on `main` (currently 1 error in `src/components/TableOfContents.tsx`
plus several `no-img-element` warnings). Compare against the base commit before treating a lint
failure as something you introduced.

`npm test` runs the Playwright e2e suite in `e2e/` headlessly, against a production build it starts
itself (see `playwright.config.ts`) — no dev server or browser session needs to be running first.

## Where the prose lives

Page copy is MDX under `content/`, imported as a component into a TSX route — see
`src/app/updates/page.tsx` for the pattern, and `src/app/page.tsx` for the variant that passes a
`components` map to keep MDX-emitted tags on the page's own type scale instead of the `prose`
class. **Where a route has a `content/*.mdx`, edit the words there, not in the TSX.**

Not every route does. `/resume` and `/portfolio` keep their copy inline, and on the home page the
hero strings and the `WhatsNew` highlights list stay in TSX deliberately — those are layout and
typed data rather than prose.

## Security headers

A locked-down CSP and the other response headers are defined in `next.config.ts` (`headers()`).
The CSP is derived from what the production bundle actually loads, so **adding any third-party
script, style, font, image, frame or fetch target means updating it** — read the comment block
above the `csp` constant first, then re-check `.next/` after a build.

## Maintaining this file

Keep this file short and high-signal: only project knowledge useful to almost every future
session. Prefer a pointer to the authoritative file, command, or doc over copying detail that
the codebase already shows. Delete entries that go stale.

`CLAUDE.md` is a one-line `@AGENTS.md` import — edit `AGENTS.md` and leave that pointer alone.
