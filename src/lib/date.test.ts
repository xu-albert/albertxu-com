// Regression test for the off-by-one date bug: content front matter carries a
// bare `YYYY-MM-DD`, and the pages used to hand that straight to `new Date()`,
// which reads it as UTC midnight. West of Greenwich that renders the previous
// day, so /projects and /blog/<slug> disagreed about when the same post went up.
//
// The zone is pinned below rather than inherited from the runner: the bug only
// shows at a negative UTC offset, so a suite that ran in the runner's own zone
// would pass under UTC with the bug fully reintroduced.
import test from "node:test";
import assert from "node:assert/strict";
import { formatDate } from "./date.ts";

process.env.TZ = "America/Los_Angeles";

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

test("formatDate renders the calendar date it was given", () => {
  assert.equal(formatDate(POST_DATE), EXPECTED);
});

test("formatDate is stable across every date in a month", () => {
  for (let day = 1; day <= 31; day++) {
    const iso = `2026-01-${String(day).padStart(2, "0")}`;
    assert.equal(formatDate(iso), `January ${day}, 2026`, `slipped on ${iso}`);
  }
});

test("the pre-fix parse slides to the previous day", () => {
  assert.equal(naive(POST_DATE), "April 22, 2026");
  assert.notEqual(naive(POST_DATE), formatDate(POST_DATE));
});

test("formatDate holds the calendar day across year and DST boundaries", () => {
  assert.equal(formatDate("2026-01-01"), "January 1, 2026");
  assert.equal(formatDate("2026-03-08"), "March 8, 2026");
  assert.equal(formatDate("2026-11-01"), "November 1, 2026");
});
