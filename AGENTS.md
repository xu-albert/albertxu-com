<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Building and linting

`npm run build` needs no environment variables. The site has no API routes and no server-side
secrets — everything under `src/app/` is statically prerendered.

`npm run lint` is not clean on `main` (currently 1 error in `src/components/TableOfContents.tsx`
plus several `no-img-element` warnings). Compare against the base commit before treating a lint
failure as something you introduced.

## Where content lives

Long-form writing — including case studies — is a blog post in `content/blog/`. `content/projects/`
is for projects with no write-up; `/projects` is a showcase whose cards link to the write-up
wherever it lives. `src/lib/blog.ts` validates blog metadata at build time (`date`, `excerpt`, and a
`coverImage` that exists on disk); `src/lib/projects.ts` validates nothing.

Two things do not update themselves when content moves: the `projects` array in
`src/app/projects/page.tsx` and the `highlights` array in `src/components/WhatsNew.tsx`. Both
templates set `dynamicParams = false`, so a stale entry is a 404 the build will not catch —
`e2e/blog-ia.spec.ts` covers that.

## Maintaining this file

Keep this file short and high-signal: only project knowledge useful to almost every future
session. Prefer a pointer to the authoritative file, command, or doc over copying detail that
the codebase already shows. Delete entries that go stale.

`CLAUDE.md` is a one-line `@AGENTS.md` import — edit `AGENTS.md` and leave that pointer alone.
