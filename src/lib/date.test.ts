// Regression test for the off-by-one date bug: content front matter carries a
// bare `YYYY-MM-DD`, and the pages used to hand that straight to `new Date()`,
// which reads it as UTC midnight. West of Greenwich that renders the previous
// day, so /projects and /blog/<slug> disagreed about when the same post went up.
//
// Run under at least one negative-UTC-offset zone to exercise the bug:
//   TZ=America/Los_Angeles node --test src/lib/date.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import { formatDate } from "./date.ts";

// The date on content/blog/ai-docs-audit.mdx.
const POST_DATE = "2026-04-23";
const EXPECTED = "April 23, 2026";

/** What both pages did before the fix. */
function naive(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Minutes the runner's zone sits behind UTC at that date, if any. */
function offsetMinutes(date: string): number {
  return -new Date(`${date}T00:00:00`).getTimezoneOffset();
}

test("formatDate renders the calendar date it was given", () => {
  assert.equal(formatDate(POST_DATE), EXPECTED);
});

test("formatDate is stable across every date in a month", () => {
  for (let day = 1; day <= 31; day++) {
    const iso = `2026-01-${String(day).padStart(2, "0")}`;
    assert.equal(formatDate(iso), `January ${day}, 2026`, `slipped on ${iso}`);
  }
});

test("the pre-fix parse reproduces the off-by-one west of UTC", (t) => {
  if (offsetMinutes(POST_DATE) >= 0) {
    t.skip(`runner is at UTC${offsetMinutes(POST_DATE) / 60}, which never showed the bug`);
    return;
  }
  assert.equal(naive(POST_DATE), "April 22, 2026");
  assert.notEqual(naive(POST_DATE), formatDate(POST_DATE));
});

test("both call sites agree, whatever the zone", () => {
  // /projects (feed card) and /blog/[slug] (post header) now share this one
  // function, so the same input can only ever produce one string.
  assert.equal(formatDate(POST_DATE), formatDate(POST_DATE));
  assert.equal(formatDate(POST_DATE), EXPECTED);
});
