<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Building and linting

`npm run build` fails with `Missing API key. Pass it to the constructor new Resend(...)` unless
`RESEND_API_KEY` is set — `src/app/api/contact/route.ts` constructs the Resend client at module
scope, and page-data collection evaluates that module. Any placeholder value works for a build
that does not send mail: `RESEND_API_KEY=re_placeholder npm run build`.

`npm run lint` is not clean on `main` (currently 1 error in `src/components/TableOfContents.tsx`
plus several `no-img-element` warnings). Compare against the base commit before treating a lint
failure as something you introduced.

## Maintaining this file

Keep this file short and high-signal: only project knowledge useful to almost every future
session. Prefer a pointer to the authoritative file, command, or doc over copying detail that
the codebase already shows. Delete entries that go stale.

`CLAUDE.md` is a one-line `@AGENTS.md` import — edit `AGENTS.md` and leave that pointer alone.
